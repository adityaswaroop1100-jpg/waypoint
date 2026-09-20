/**
 * PDF Statement Parser Agent
 * 
 * Extracts raw text from a PDF bank/credit card statement using PDF.js (pdfjs-dist),
 * then applies deterministic regex + keyword rules to parse transaction rows.
 * 
 * Zero network calls. 100% client-side. Works with most Indian bank PDFs:
 * HDFC, SBI, ICICI, Axis, Kotak, IDFC, Federal, IndusInd, Yes Bank.
 */

import { categorizeMerchant } from './ingestor';
import { Transaction } from '../types';

export interface PDFParseResult {
  success: boolean;
  transactions: Transaction[];
  rawTextPreview: string;
  message: string;
  pageCount: number;
}

// Patterns that match typical bank statement transaction rows
// Tries to capture: date, description/narration, and amount values
const TX_PATTERNS = [
  // DD/MM/YYYY or DD-MM-YYYY + description + amount
  /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([\-\+]?\d[\d,]*\.?\d*)\s*(?:Dr|Cr|DR|CR)?/,
  // YYYY-MM-DD + description + amount
  /(\d{4}[\/\-]\d{2}[\/\-]\d{2})\s+(.+?)\s+([\-\+]?\d[\d,]*\.?\d*)/,
  // Date then long description then debit and credit columns
  /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.{5,80}?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/,
];

// Debit indicator keywords in narration/description lines
const DEBIT_KEYWORDS = ['dr', 'debit', 'purchase', 'payment to', 'transfer to', 'trf to', 'withdrawal', 'w/d', 'emi'];
const CREDIT_KEYWORDS = ['salary', 'refund', 'reversal', 'neft cr', 'imps cr', 'transfer from', 'interest credit', 'dividend', 'consulting payout'];

function parseDateString(raw: string): string {
  const s = raw.trim();
  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // YYYY-MM-DD
  const ymd = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
  if (ymd) return s.replace(/\//g, '-');
  return s;
}

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/,/g, '').replace(/[^\d.\-+]/g, '')) || 0;
}

function isDebitLine(line: string): boolean {
  const lower = line.toLowerCase();
  return DEBIT_KEYWORDS.some(k => lower.includes(k)) && !CREDIT_KEYWORDS.some(k => lower.includes(k));
}

function isCreditLine(line: string): boolean {
  const lower = line.toLowerCase();
  return CREDIT_KEYWORDS.some(k => lower.includes(k));
}

/**
 * Parse raw text extracted from PDF into structured transactions.
 *
 * Strategy: Two-pass approach
 * Pass 1: Collect all lines, identify date anchors
 * Pass 2: For each date anchor, greedily collect the next N lines as the "row block"
 *         and extract narration + amounts from that block.
 *
 * This handles both:
 *   (a) Single-row format: "01/09/2026  SALARY CREDIT  85000.00  DR"
 *   (b) HDFC column format where pdfjs-dist puts each cell on its own line:
 *       "01/09/2026"
 *       "NEFT CR SALARY"
 *       "NEFT0001"
 *       "01/09/2026"
 *       "85,000.00"
 *       "1,23,450.00"
 */
export function parsePDFText(rawText: string, overrides: Record<string, string> = {}): Transaction[] {
  const transactions: Transaction[] = [];
  const seen = new Set<string>();

  // Normalize: collapse multiple spaces within a line, split on newlines
  const allLines = rawText
    .split('\n')
    .map(l => l.replace(/\s{2,}/g, ' ').trim())
    .filter(l => l.length > 1);

  // Patterns
  const dateRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})$/;
  const dateInlineRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
  const amountRegex = /^[\d,]{1,12}\.\d{2}$/;           // standalone amount cell
  const amountInline = /[\d,]{1,12}\.\d{2}/g;            // inline amount in narration line
  const headerSkip = /date|narration|withdrawal|deposit|balance|chq|ref|value|description|particulars|transaction|debit|credit|opening|closing|statement|account|ifsc|branch/i;

  // ── PASS 1: find all date-anchor indices ──────────────────────────────────
  const dateIndices: number[] = [];
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    if (headerSkip.test(line)) continue;

    // Either line IS a standalone date, or it STARTS with a date
    if (dateRegex.test(line) || dateInlineRegex.test(line)) {
      const m = line.match(dateInlineRegex);
      if (m) dateIndices.push(i);
    }
  }

  // ── PASS 2: for each date, collect a window and parse ─────────────────────
  for (let di = 0; di < dateIndices.length; di++) {
    const start = dateIndices[di];
    // Row block ends where the next date begins (or max 8 lines ahead)
    const end = di + 1 < dateIndices.length
      ? Math.min(dateIndices[di + 1], start + 8)
      : Math.min(start + 8, allLines.length);

    const block = allLines.slice(start, end);
    const blockText = block.join(' ');

    // Skip header rows
    if (headerSkip.test(blockText)) continue;

    // Extract date
    const dateMatch = block[0].match(dateInlineRegex);
    if (!dateMatch) continue;
    const isoDate = parseDateString(dateMatch[1]);

    // Validate date is plausible (year 2000–2040)
    const yearMatch = isoDate.match(/^(\d{4})/);
    if (!yearMatch) continue;
    const year = parseInt(yearMatch[1]);
    if (year < 2000 || year > 2040) continue;

    // Extract all amounts from the block
    const amountTokens: number[] = [];
    for (const line of block) {
      if (amountRegex.test(line)) {
        // Standalone amount cell (column-separated format)
        amountTokens.push(parseFloat(line.replace(/,/g, '')));
      }
    }
    // Also extract inline amounts if no standalone ones found
    if (amountTokens.length === 0) {
      const inlineAmts = [...blockText.matchAll(amountInline)];
      for (const m of inlineAmts) {
        amountTokens.push(parseFloat(m[0].replace(/,/g, '')));
      }
    }

    if (amountTokens.length === 0) continue;

    // Build narration from non-date, non-amount, non-reference lines
    const narrationParts: string[] = [];
    for (const line of block) {
      if (line === block[0] && dateRegex.test(line)) continue;  // skip pure date line
      if (amountRegex.test(line)) continue;                     // skip amount-only lines
      if (/^[A-Z0-9]{8,20}$/.test(line)) continue;             // skip ref no (UPI0000001 etc.)
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(line)) continue; // skip value date
      if (headerSkip.test(line)) continue;

      // Strip leading date from inline lines
      const stripped = line.replace(dateInlineRegex, '').replace(amountInline, '').trim();
      if (stripped.length > 2) narrationParts.push(stripped);
    }

    let narration = narrationParts.join(' ').replace(/\s{2,}/g, ' ').trim().slice(0, 90);
    if (narration.length < 3) continue;

    // ── Determine amount and sign ─────────────────────────────────────────
    let amount: number;
    const hasDr = /\bDR\b|\bDr\b/.test(blockText);
    const hasCr = /\bCR\b|\bCr\b/.test(blockText) || isCreditLine(narration);

    // Primary: Use DR/CR from narration — most reliable signal
    if (hasDr && !hasCr) {
      // Take the smallest amount (not the closing balance)
      const txAmt = amountTokens.length >= 2
        ? Math.min(...amountTokens)   // smallest = the transaction, not the balance
        : amountTokens[0];
      amount = -Math.abs(txAmt);
    } else if (hasCr && !hasDr) {
      const txAmt = amountTokens.length >= 2
        ? Math.min(...amountTokens)
        : amountTokens[0];
      amount = Math.abs(txAmt);
    } else if (amountTokens.length >= 3) {
      // HDFC three-column [Withdrawal, Deposit, Balance] — no keyword disambiguation
      const withdrawal = amountTokens[0];
      const deposit = amountTokens[1];
      if (withdrawal > 0 && deposit === 0) {
        amount = -withdrawal;
      } else if (deposit > 0 && withdrawal === 0) {
        amount = deposit;
      } else {
        amount = -(Math.min(amountTokens[0], amountTokens[1]) || amountTokens[0]);
      }
    } else if (amountTokens.length === 2) {
      const a = amountTokens[0];
      const b = amountTokens[1];
      // Use the smaller as the transaction amount (larger is likely closing balance)
      const txAmt = Math.min(a, b);
      amount = isCreditLine(narration) ? Math.abs(txAmt) : -Math.abs(txAmt);
    } else {
      const raw = amountTokens[0];
      amount = isDebitLine(narration) ? -Math.abs(raw) : -Math.abs(raw);
    }

    // Sanity checks
    if (Math.abs(amount) < 0.01 || Math.abs(amount) > 50_000_000) continue;

    const key = `${isoDate}|${narration.slice(0, 30)}|${amount.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const category = categorizeMerchant(narration, overrides);

    transactions.push({
      id: `pdf-${Date.now()}-${transactions.length}`,
      date: isoDate,
      merchant: narration,
      amount,
      category,
      source: 'csv',
      notes: 'Parsed from PDF statement'
    });
  }

  return transactions;
}

/**
 * Load PDF.js dynamically and extract all text from all pages of the PDF.
 * Uses the bundled pdfjs-dist worker.
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  // Dynamic import to avoid SSR issues and keep bundle split
  const pdfjsLib = await import('pdfjs-dist');
  
  // Point worker to the bundled worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;
  const pageTexts: string[] = [];

  for (let p = 1; p <= pageCount; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    // Join text items with spaces, preserve line breaks via y-position grouping
    const items = content.items as Array<{ str: string; transform: number[] }>;
    
    let lastY: number | null = null;
    let lineText = '';
    const pageLines: string[] = [];

    for (const item of items) {
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 3) {
        if (lineText.trim()) pageLines.push(lineText.trim());
        lineText = item.str;
      } else {
        lineText += (lineText && !lineText.endsWith(' ') ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (lineText.trim()) pageLines.push(lineText.trim());
    pageTexts.push(pageLines.join('\n'));
  }

  return { text: pageTexts.join('\n\n'), pageCount };
}

/**
 * Top-level: Parse a PDF file (as ArrayBuffer) into structured transactions.
 */
export async function parsePDFStatement(
  arrayBuffer: ArrayBuffer,
  overrides: Record<string, string> = {}
): Promise<PDFParseResult> {
  try {
    const { text, pageCount } = await extractTextFromPDF(arrayBuffer);
    
    if (!text || text.trim().length < 50) {
      return {
        success: false,
        transactions: [],
        rawTextPreview: text.slice(0, 500),
        pageCount,
        message: 'Could not extract readable text from this PDF. It may be a scanned image PDF. Please try a text-based bank statement PDF.'
      };
    }

    const transactions = parsePDFText(text, overrides);

    if (transactions.length === 0) {
      return {
        success: false,
        transactions: [],
        rawTextPreview: text.slice(0, 500),
        pageCount,
        message: 'No transaction rows detected in this PDF. Supported formats: HDFC, SBI, ICICI, Axis, Kotak, IDFC bank statements. Ensure the PDF is a standard text-based statement (not a scanned image).'
      };
    }

    return {
      success: true,
      transactions,
      rawTextPreview: text.slice(0, 500),
      pageCount,
      message: `Successfully extracted ${transactions.length} transactions from ${pageCount} pages.`
    };
  } catch (err: any) {
    return {
      success: false,
      transactions: [],
      rawTextPreview: '',
      pageCount: 0,
      message: `PDF parsing failed: ${err?.message || 'Unknown error'}. Please ensure the file is a valid, non-password-protected PDF.`
    };
  }
}
