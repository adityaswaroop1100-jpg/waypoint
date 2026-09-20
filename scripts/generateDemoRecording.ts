import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runDemoRecording() {
  console.log('🎥 Launching automated headless video recorder for WAYPOINT...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outputDir = path.join(process.cwd(), 'demo_frames');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('1️⃣ Navigating to Home (The One Move)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '01_home_one_move.png') });

  console.log('2️⃣ Navigating to Forecast (90-Day Weather & 27th Dip)...');
  await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '02_forecast_weather.png') });

  console.log('3️⃣ Navigating to Simulator (5 Stress-Test Scenarios)...');
  await page.goto('http://localhost:3000/simulator', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '03_simulator_scenarios.png') });

  console.log('4️⃣ Navigating to Regret Engine (Counterfactual Math)...');
  await page.goto('http://localhost:3000/regret', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '04_regret_engine.png') });

  console.log('5️⃣ Navigating to Ask Copilot (Pushback Intelligence)...');
  await page.goto('http://localhost:3000/ask', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '05_ask_pushback.png') });

  console.log('6️⃣ Navigating to Monthly Report & Budgets...');
  await page.goto('http://localhost:3000/report', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '06_monthly_report.png') });

  await browser.close();
  console.log(`✅ Successfully captured demo frames in ${outputDir}`);
}

runDemoRecording().catch((err) => {
  console.error('Error recording demo:', err);
});
