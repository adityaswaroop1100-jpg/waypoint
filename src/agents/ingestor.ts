import Papa from 'papaparse';
import { Transaction } from '../types';

// Category mapping rules by keyword
const MERCHANT_CATEGORY_RULES: Array<{ keywords: string[]; category: string }> = [
  {
    keywords: ['salary', 'tech corp', 'payroll', 'consulting payout', 'dividend', 'interest credited'],
    category: 'Income'
  },
  {
    keywords: ['rent', 'landlord', 'housing society', 'maintenance charge', 'flat rent'],
    category: 'Housing & Rent'
  },
  {
    keywords: ['swiggy', 'zomato', 'blinkit', 'zepto', 'nature basket', 'mcdonalds', 'starbucks', 'cafe', 'restaurant', 'groceries', 'supermarket', 'biryani'],
    category: 'Food & Dining'
  },
  {
    keywords: ['netflix', 'spotify', 'hotstar', 'prime', 'disney', 'youtube', 'apple music', 'icloud', 'github', 'chatgpt', 'playstation', 'game pass'],
    category: 'Subscriptions'
  },
  {
    keywords: ['electricity', 'bescom', 'tata power', 'airtel', 'jio', 'broadband', 'water supply', 'gas bill', 'cylinder', 'dth'],
    category: 'Utilities & Bills'
  },
  {
    keywords: ['croma', 'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'apple store', 'uniqlo', 'electronics', 'ikea'],
    category: 'Shopping & Gadgets'
  },
  {
    keywords: ['uber', 'ola', 'rapido', 'fuel', 'petrol', 'diesel', 'hpcl', 'iocl', 'metro', 'fastag', 'parking'],
    category: 'Transportation'
  },
  {
    keywords: ['bookmyshow', 'pvr', 'inox', 'concert', 'steam games', 'bowling', 'resort', 'event'],
    category: 'Entertainment'
  },
  {
    keywords: ['cult.fit', 'gym', 'apollo pharmacy', 'medplus', 'practo', 'hospital', 'dentist', '1mg', 'pharmeasy'],
    category: 'Healthcare'
  },
  {
    keywords: ['hdfc bank', 'icici bank', 'credit card', 'auto-pay', 'sbi card', 'axis card', 'emi', 'loan repayment'],
    category: 'Financial & EMI'
  }
];

export function categorizeMerchant(merchant: string, overrides: Record<string, string> = {}): string {
  const cleanMerchant = merchant.trim();
  
  // 1. Check user correction overrides first
  if (overrides[cleanMerchant]) {
    return overrides[cleanMerchant];
  }
  
  const lowerMerchant = cleanMerchant.toLowerCase();
  
  // Also check if lower merchant exists in overrides
  for (const [key, val] of Object.entries(overrides)) {
    if (key.toLowerCase() === lowerMerchant) {
      return val;
    }
  }

  // 2. Rule-based keyword matching
  for (const rule of MERCHANT_CATEGORY_RULES) {
    if (rule.keywords.some(k => lowerMerchant.includes(k))) {
      return rule.category;
    }
  }

  // 3. Fallback
  return 'Other';
}

export function parseCSVTransactions(
  csvContent: string,
  overrides: Record<string, string> = {}
): Promise<{ success: boolean; transactions: Transaction[]; message: string }> {
  return new Promise((resolve) => {
    try {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            resolve({
              success: false,
              transactions: [],
              message: 'The uploaded file is empty. Please upload a CSV containing transactions.'
            });
            return;
          }

          const parsedList: Transaction[] = [];
          const rows = results.data as Record<string, any>[];

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Flexible column matching
            const dateVal = row.Date || row.date || row['Txn Date'] || row['Transaction Date'] || row['Value Date'];
            const merchantVal = row.Merchant || row.merchant || row.Description || row.description || row.Narration || row.narration || row.Party;
            const amountVal = row.Amount || row.amount || row['Txn Amount'] || row['Transaction Amount'] || row.Withdrawal || row.Debit || row.Credit;
            const categoryVal = row.Category || row.category;

            if (!dateVal || !merchantVal || amountVal === undefined || amountVal === null || amountVal === '') {
              continue; // Skip invalid row
            }

            // Parse numeric amount
            let numAmount = typeof amountVal === 'number' ? amountVal : parseFloat(String(amountVal).replace(/[^0-9.-]+/g, ''));
            if (isNaN(numAmount)) continue;

            // Normalize sign: if marked as debit or withdrawal column, make negative
            if (row.Debit || row.Withdrawal) {
              numAmount = -Math.abs(numAmount);
            }

            // Normalize date format YYYY-MM-DD
            let isoDate = String(dateVal).trim();
            if (isoDate.includes('/')) {
              const parts = isoDate.split('/');
              if (parts.length === 3) {
                // assume DD/MM/YYYY or MM/DD/YYYY
                if (parts[2].length === 4) {
                  isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
              }
            }

            const merchantName = String(merchantVal).trim();
            const category = categoryVal && categoryVal.trim() !== ''
              ? String(categoryVal).trim()
              : categorizeMerchant(merchantName, overrides);

            parsedList.push({
              id: `csv-${Date.now()}-${i}`,
              date: isoDate,
              merchant: merchantName,
              amount: numAmount,
              category,
              source: 'csv'
            });
          }

          if (parsedList.length === 0) {
            resolve({
              success: false,
              transactions: [],
              message: 'Could not detect valid transaction columns (Date, Description/Merchant, Amount). Try standard CSV format or load sample data.'
            });
            return;
          }

          resolve({
            success: true,
            transactions: parsedList,
            message: `Successfully parsed ${parsedList.length} transactions.`
          });
        },
        error: (err: Error) => {
          resolve({
            success: false,
            transactions: [],
            message: `Failed to parse CSV: ${err.message}. Please try CSV format or load sample data.`
          });
        }
      });
    } catch (e: any) {
      resolve({
        success: false,
        transactions: [],
        message: `Unexpected file format: ${e?.message || 'Error reading file'}. Load sample data instead.`
      });
    }
  });
}
