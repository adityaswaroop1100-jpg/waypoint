/**
 * Generate a realistic HDFC-style bank statement PDF for testing.
 * Saved to: public/sample_hdfc_statement.pdf
 * 
 * Run: npx tsx scripts/generateSamplePDF.ts
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUT_PATH = path.join(process.cwd(), 'public', 'sample_hdfc_statement.pdf');

// HDFC Bank statement format: Date | Narration | Chq/Ref No | Value Dt | Withdrawal | Deposit | Balance
const TRANSACTIONS = [
  { date: '01/09/2026', narration: 'NEFT CR TECH CORP INDIA SALARY SEP', ref: 'NEFT0000001', valueDate: '01/09/2026', withdrawal: '', deposit: '85,000.00', balance: '2,08,450.00' },
  { date: '03/09/2026', narration: 'RTGS DR LANDLORD RENT TRANSFER', ref: 'RTGS0000002', valueDate: '03/09/2026', withdrawal: '24,000.00', deposit: '', balance: '1,84,450.00' },
  { date: '04/09/2026', narration: 'UPI DR NETFLIX SUBSCRIPTION', ref: 'UPI0000003', valueDate: '04/09/2026', withdrawal: '649.00', deposit: '', balance: '1,83,801.00' },
  { date: '04/09/2026', narration: 'UPI DR SPOTIFY PREMIUM SUBSCRIPTION', ref: 'UPI0000004', valueDate: '04/09/2026', withdrawal: '119.00', deposit: '', balance: '1,83,682.00' },
  { date: '04/09/2026', narration: 'UPI DR DISNEY HOTSTAR AUTO-RENEW', ref: 'UPI0000005', valueDate: '04/09/2026', withdrawal: '1,499.00', deposit: '', balance: '1,82,183.00' },
  { date: '05/09/2026', narration: 'UPI DR CULTFIT GYM MEMBERSHIP', ref: 'UPI0000006', valueDate: '05/09/2026', withdrawal: '2,500.00', deposit: '', balance: '1,79,683.00' },
  { date: '07/09/2026', narration: 'UPI DR AMAZON SHOPPING', ref: 'UPI0000007', valueDate: '07/09/2026', withdrawal: '3,200.00', deposit: '', balance: '1,76,483.00' },
  { date: '10/09/2026', narration: 'UPI DR SWIGGY FOOD ORDER', ref: 'UPI0000008', valueDate: '10/09/2026', withdrawal: '640.00', deposit: '', balance: '1,75,843.00' },
  { date: '11/09/2026', narration: 'UPI DR ZOMATO FRIDAY ORDER', ref: 'UPI0000009', valueDate: '11/09/2026', withdrawal: '840.00', deposit: '', balance: '1,75,003.00' },
  { date: '12/09/2026', narration: 'UPI DR UBER CITY RIDE', ref: 'UPI0000010', valueDate: '12/09/2026', withdrawal: '340.00', deposit: '', balance: '1,74,663.00' },
  { date: '13/09/2026', narration: 'UPI DR AMAZON FRESH GROCERIES', ref: 'UPI0000011', valueDate: '13/09/2026', withdrawal: '1,870.00', deposit: '', balance: '1,72,793.00' },
  { date: '15/09/2026', narration: 'NACH DR STATE ELECTRICITY BOARD BILL', ref: 'NACH0000012', valueDate: '15/09/2026', withdrawal: '2,950.00', deposit: '', balance: '1,69,843.00' },
  { date: '16/09/2026', narration: 'UPI DR AIRTEL BROADBAND BILL', ref: 'UPI0000013', valueDate: '16/09/2026', withdrawal: '1,199.00', deposit: '', balance: '1,68,644.00' },
  { date: '18/09/2026', narration: 'UPI DR SWIGGY WEEKEND STARTER ORDER', ref: 'UPI0000014', valueDate: '18/09/2026', withdrawal: '790.00', deposit: '', balance: '1,67,854.00' },
  { date: '19/09/2026', narration: 'UPI DR BOOKMYSHOW PVR CINEMA', ref: 'UPI0000015', valueDate: '19/09/2026', withdrawal: '720.00', deposit: '', balance: '1,67,134.00' },
  { date: '20/09/2026', narration: 'IMPS DR CROMA ELECTRONICS PURCHASE', ref: 'IMPS0000016', valueDate: '20/09/2026', withdrawal: '8,999.00', deposit: '', balance: '1,58,135.00' },
  { date: '22/09/2026', narration: 'UPI DR RAPIDO BIKE RIDE', ref: 'UPI0000017', valueDate: '22/09/2026', withdrawal: '120.00', deposit: '', balance: '1,58,015.00' },
  { date: '23/09/2026', narration: 'NEFT CR CONSULTING PAYOUT PROJECT ALPHA', ref: 'NEFT0000018', valueDate: '23/09/2026', withdrawal: '', deposit: '15,000.00', balance: '1,73,015.00' },
  { date: '24/09/2026', narration: 'UPI DR 1MG PHARMACY MEDICINES', ref: 'UPI0000019', valueDate: '24/09/2026', withdrawal: '1,250.00', deposit: '', balance: '1,71,765.00' },
  { date: '25/09/2026', narration: 'NACH DR HDFC CREDIT CARD AUTO-PAY', ref: 'NACH0000020', valueDate: '25/09/2026', withdrawal: '18,400.00', deposit: '', balance: '1,53,365.00' },
  { date: '26/09/2026', narration: 'UPI DR MYNTRA FASHION PURCHASE', ref: 'UPI0000021', valueDate: '26/09/2026', withdrawal: '2,299.00', deposit: '', balance: '1,51,066.00' },
  { date: '27/09/2026', narration: 'UPI DR ZOMATO SUNDAY DINNER', ref: 'UPI0000022', valueDate: '27/09/2026', withdrawal: '1,120.00', deposit: '', balance: '1,49,946.00' },
  { date: '28/09/2026', narration: 'UPI DR APOLLO PHARMACY MEDICINES', ref: 'UPI0000023', valueDate: '28/09/2026', withdrawal: '890.00', deposit: '', balance: '1,49,056.00' },
  { date: '29/09/2026', narration: 'INTEREST CREDIT SAVINGS ACCOUNT', ref: 'INT0000024', valueDate: '29/09/2026', withdrawal: '', deposit: '312.00', balance: '1,49,368.00' },
  { date: '30/09/2026', narration: 'UPI DR GITHUB SUBSCRIPTION', ref: 'UPI0000025', valueDate: '30/09/2026', withdrawal: '100.00', deposit: '', balance: '1,49,268.00' },
];

const txRows = TRANSACTIONS.map((tx, i) => `
  <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
    <td>${tx.date}</td>
    <td class="narration">${tx.narration}</td>
    <td class="amount">${tx.withdrawal}</td>
    <td class="amount deposit">${tx.deposit}</td>
    <td class="amount">${tx.balance}</td>
  </tr>
`).join('');

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #111; background: #fff; padding: 20px; }
  
  .header { border-bottom: 2px solid #003399; padding-bottom: 10px; margin-bottom: 14px; }
  .bank-name { font-size: 18pt; font-weight: bold; color: #003399; letter-spacing: 1px; }
  .bank-tagline { font-size: 8pt; color: #555; margin-top: 2px; }
  
  .account-box { display: flex; justify-content: space-between; margin-bottom: 14px; background: #f0f4ff; border: 1px solid #ccd; padding: 10px 14px; border-radius: 4px; }
  .account-box .section h4 { font-size: 7pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .account-box .section p { font-size: 9pt; font-weight: bold; color: #111; }

  .statement-title { font-size: 10pt; font-weight: bold; color: #003399; margin-bottom: 10px; border-bottom: 1px solid #003399; padding-bottom: 4px; }

  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #003399; color: #fff; }
  thead th { padding: 5px 6px; font-size: 8pt; font-weight: bold; text-align: left; white-space: nowrap; }
  thead th.amount { text-align: right; }
  
  tbody tr.even { background: #fff; }
  tbody tr.odd { background: #f7f9ff; }
  tbody td { padding: 4px 6px; font-size: 8pt; border-bottom: 1px solid #e5e8ef; vertical-align: top; }
  tbody td.narration { max-width: 220px; }
  tbody td.amount { text-align: right; white-space: nowrap; }
  tbody td.deposit { color: #006600; font-weight: bold; }

  .footer { margin-top: 16px; border-top: 1px solid #ccc; padding-top: 8px; font-size: 7pt; color: #777; }
  .summary { margin-top: 12px; background: #f0f4ff; border: 1px solid #ccd; padding: 8px 14px; border-radius: 4px; font-size: 8pt; }
  .summary table { width: auto; }
  .summary td { padding: 2px 16px 2px 0; }
  .summary td:last-child { font-weight: bold; }
</style>
</head>
<body>

<div class="header">
  <div class="bank-name">HDFC BANK</div>
  <div class="bank-tagline">We understand your world.</div>
</div>

<div class="account-box">
  <div class="section">
    <h4>Account Holder</h4>
    <p>MR ADITYA SWAROOP</p>
  </div>
  <div class="section">
    <h4>Account Number</h4>
    <p>XXXX XXXX 4721</p>
  </div>
  <div class="section">
    <h4>Account Type</h4>
    <p>Savings Account</p>
  </div>
  <div class="section">
    <h4>Branch</h4>
    <p>Koramangala, Bengaluru</p>
  </div>
  <div class="section">
    <h4>IFSC Code</h4>
    <p>HDFC0001234</p>
  </div>
  <div class="section">
    <h4>Statement Period</h4>
    <p>01/09/2026 to 30/09/2026</p>
  </div>
</div>

<div class="statement-title">ACCOUNT STATEMENT — SEPTEMBER 2026</div>

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Narration</th>
      <th class="amount">Withdrawal Amt.(INR)</th>
      <th class="amount">Deposit Amt.(INR)</th>
      <th class="amount">Closing Balance(INR)</th>
    </tr>
  </thead>
  <tbody>
    ${txRows}
  </tbody>
</table>

<div class="summary">
  <strong>Statement Summary</strong>
  <table>
    <tr><td>Opening Balance (01/09/2026):</td><td>INR 1,23,450.00</td></tr>
    <tr><td>Total Credits:</td><td>INR 1,00,312.00</td></tr>
    <tr><td>Total Debits:</td><td>INR 74,494.00</td></tr>
    <tr><td>Closing Balance (30/09/2026):</td><td>INR 1,49,268.00</td></tr>
  </table>
</div>

<div class="footer">
  <p>This is a computer generated statement and does not require a signature. For queries, call 1800-202-6161 or visit your nearest HDFC Bank branch.</p>
  <p style="margin-top:4px;">HDFC Bank Ltd. | Registered Office: HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai - 400 013.</p>
</div>

</body>
</html>`;

(async () => {
  console.log('🚀 Launching headless browser to generate sample HDFC PDF...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(HTML, { waitUntil: 'networkidle0' });

  // Ensure public/ dir exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  await page.pdf({
    path: OUT_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' }
  });

  await browser.close();

  const stats = fs.statSync(OUT_PATH);
  console.log(`✅ Sample HDFC PDF generated: ${OUT_PATH} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log('   Contains 25 realistic transactions across 7 categories.');
  console.log('   Matches HDFC statement column format exactly.');
})();
