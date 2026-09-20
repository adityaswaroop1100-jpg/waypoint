/**
 * Verify the sample HDFC PDF can be parsed by our pdfParser agent.
 * Run: npx tsx scripts/testPDFParsing.ts
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const PDF_PATH = path.join(process.cwd(), 'public', 'sample_hdfc_statement.pdf');

(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('WAYPOINT PDF PARSER END-TO-END VERIFICATION');
  console.log('═══════════════════════════════════════════════════════\n');

  if (!fs.existsSync(PDF_PATH)) {
    console.error('❌ Sample PDF not found. Run: npx tsx scripts/generateSamplePDF.ts first');
    process.exit(1);
  }

  console.log(`📄 Testing: ${PDF_PATH}`);
  const stats = fs.statSync(PDF_PATH);
  console.log(`   File size: ${(stats.size / 1024).toFixed(1)} KB\n`);

  // Load pdfjs-dist in Node context - use legacy build which supports Node.js
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // Point to the co-located worker using absolute file:// URL
  const workerPath = `file://${path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')}`;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

  const data = fs.readFileSync(PDF_PATH);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;

  console.log('🔍 Step 1: Extracting text from PDF pages...');
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true }).promise;
  console.log(`   Pages found: ${pdf.numPages}`);

  let fullText = '';
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
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
    fullText += pageLines.join('\n') + '\n\n';
  }

  console.log(`   Extracted ${fullText.split('\n').filter(l => l.trim()).length} lines of text`);

  // Show a sample of the raw text
  const sampleLines = fullText.split('\n').filter(l => l.trim()).slice(0, 20);
  console.log('\n📋 Step 2: First 20 lines of extracted text:');
  sampleLines.forEach((l, i) => console.log(`   ${String(i+1).padStart(2, '0')}: ${l}`));

  // Now run the parser
  console.log('\n⚙️  Step 3: Running parsePDFText()...');
  
  // Import parsePDFText directly
  const { parsePDFText } = await import('../src/agents/pdfParser.ts' as any);
  const transactions = parsePDFText(fullText, {});
  
  console.log(`\n✅ Parsed ${transactions.length} transactions successfully!\n`);
  
  if (transactions.length === 0) {
    console.log('❌ FAILED — No transactions extracted. Check parser logic or PDF format.');
    process.exit(1);
  }

  // Show table
  console.log('   Date        | Category              | Amount         | Narration');
  console.log('   ─'.repeat(20));
  for (const tx of transactions.slice(0, 15)) {
    const amt = (tx.amount >= 0 ? '+' : '') + tx.amount.toFixed(2).padStart(12);
    const cat = tx.category.padEnd(22);
    console.log(`   ${tx.date} | ${cat}| ${amt} | ${tx.merchant.slice(0, 40)}`);
  }

  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const categories = new Set(transactions.map(t => t.category));

  console.log('\n📊 Summary:');
  console.log(`   Total transactions: ${transactions.length}`);
  console.log(`   Total credits:      ₹${income.toFixed(2)}`);
  console.log(`   Total debits:       ₹${expenses.toFixed(2)}`);
  console.log(`   Categories found:   ${[...categories].join(', ')}`);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('PDF PARSER VERIFICATION: PASSED ✅');
  console.log('═══════════════════════════════════════════════════════\n');
})().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
