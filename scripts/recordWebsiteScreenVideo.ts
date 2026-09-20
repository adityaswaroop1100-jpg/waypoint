import puppeteer, { Browser, Page } from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

const RECORDING_DIR = path.join(process.cwd(), 'screen_recording_assets');
const FINAL_OUTPUT_VIDEO = path.join(process.cwd(), 'waypoint_website_screen_recording_3min.mp4');

if (!fs.existsSync(RECORDING_DIR)) {
  fs.mkdirSync(RECORDING_DIR, { recursive: true });
}

console.log('🎥 Initializing Full Website Screen Recording Engine...');

interface DemoScene {
  id: string;
  name: string;
  url: string;
  script: string;
  action: (page: Page, sceneDir: string) => Promise<string[]>;
}

const SCENES: DemoScene[] = [
  {
    id: 'scene_01_hero_home',
    name: '1. Dashboard & Core Mission',
    url: 'http://localhost:3000/',
    script: 'Welcome to Waypoint. Traditional budgeting apps only show where your money went in the rearview mirror. Waypoint is fundamentally different: an offline-first, deterministic decision engine that tells you your single next best financial move. Every calculation runs locally with zero cloud dependencies and zero live API failure points.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 800));
      const f2 = path.join(dir, 'frame_02.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 600));
      const f3 = path.join(dir, 'frame_03.png');
      await page.screenshot({ path: f3 });
      frames.push(f3);

      return frames;
    }
  },
  {
    id: 'scene_02_the_one_move',
    name: '2. The One Move — Hero Action & Audit Trail',
    url: 'http://localhost:3000/',
    script: 'Right on the home dashboard, Waypoint surfaces The One Move, ranked by annual impact, high statistical confidence, and low effort. Here, it detects seventy-four days of zero streaming activity on Disney Plus Hotstar. Clicking Why opens a verifiable transaction audit trail. Clicking Do This instantly recomputes the ninety-day balance forecast and advances to the next ranked action.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 500));

      const f1 = path.join(dir, 'frame_01.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      // Click "Why?" button to open audit trail modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent?.includes('Why'));
        if (target) target.click();
      });
      await new Promise(r => setTimeout(r, 800));
      const f2 = path.join(dir, 'frame_02_audit_modal.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      // Close modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent?.includes('Close') || b.getAttribute('aria-label') === 'Close');
        if (closeBtn) closeBtn.click();
        else {
          const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          window.dispatchEvent(escEvent);
        }
      });
      await new Promise(r => setTimeout(r, 600));

      // Click "Do this" button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const doBtn = btns.find(b => b.textContent?.includes('Do this') || b.textContent?.includes('Done'));
        if (doBtn) doBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));
      const f3 = path.join(dir, 'frame_03_done.png');
      await page.screenshot({ path: f3 });
      frames.push(f3);

      return frames;
    }
  },
  {
    id: 'scene_03_forecast_collision',
    name: '3. 90-Day Weather Forecast & The 27th Collision',
    url: 'http://localhost:3000/forecast',
    script: 'Next is the 90-Day Financial Weather Forecast. Rather than looking backwards, it projects daily liquidity across Safe, Tight, and Danger zones. Notice the sharp dip on the twenty-seventh. Clicking it pinpoints a triple cash flow collision where rent, electricity, and card auto-debits land simultaneously. Waypoint prescribes an immediate fix: shift the card billing due date to the fifth.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_forecast.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 800));
      const f2 = path.join(dir, 'frame_02_chart.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const collisionEl = elements.find(el => el.textContent?.includes('27th') || el.textContent?.includes('Collision'));
        if (collisionEl && (collisionEl as HTMLElement).click) {
          (collisionEl as HTMLElement).click();
        }
      });
      await new Promise(r => setTimeout(r, 800));
      const f3 = path.join(dir, 'frame_03_collision_detail.png');
      await page.screenshot({ path: f3 });
      frames.push(f3);

      return frames;
    }
  },
  {
    id: 'scene_04_life_simulator',
    name: '4. Life Event Simulator — 5 Scenarios',
    url: 'http://localhost:3000/simulator',
    script: 'The Life Event Simulator lets you stress-test major disruptions before they occur. Under Sudden Job Loss, Waypoint recalculates our exact liquid runway of four point six months. Enabling the Lean Mode protocol extends our runway to over seven months by pausing non-essentials. All five scenarios execute locally with zero network latency.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/simulator', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_job_loss.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const rentBtn = btns.find(b => b.textContent?.includes('Rent Hike') || b.textContent?.includes('Rent'));
        if (rentBtn) rentBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));
      const f2 = path.join(dir, 'frame_02_rent_hike.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const medBtn = btns.find(b => b.textContent?.includes('Medical') || b.textContent?.includes('Emergency'));
        if (medBtn) medBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));
      const f3 = path.join(dir, 'frame_03_medical.png');
      await page.screenshot({ path: f3 });
      frames.push(f3);

      return frames;
    }
  },
  {
    id: 'scene_05_regret_engine',
    name: '5. Regret Engine — Zero-Shaming Recovery',
    url: 'http://localhost:3000/regret',
    script: 'The Regret Engine converts past spending into future momentum with a strict zero-shaming guarantee: words like wasted or failed are permanently banned. By using interactive sliders, reducing food delivery by twenty percent redirects over nine thousand rupees into our high-priority emergency travel fund.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/regret', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_regret.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.evaluate(() => {
        const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
        if (sliders.length > 0) {
          (sliders[0] as HTMLInputElement).value = '25';
          sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
          sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
        window.scrollBy({ top: 200, behavior: 'smooth' });
      });
      await new Promise(r => setTimeout(r, 800));
      const f2 = path.join(dir, 'frame_02_slider.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      return frames;
    }
  },
  {
    id: 'scene_06_pushback_copilot',
    name: '6. Pushback Copilot — Grounded Reality Checks',
    url: 'http://localhost:3000/ask',
    script: 'The Pushback Copilot is the anti-hallucination assistant that refuses reckless spending. When asked if we can afford a one point five Lakh rupee vacation in December, it calculates obligations, warns of a forty-thousand rupee deficit, and recommends delaying to February when our surplus reaches one point six Lakh.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/ask', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_copilot.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const vacationBtn = btns.find(b => b.textContent?.includes('vacation') || b.textContent?.includes('1.5L') || b.textContent?.includes('afford'));
        if (vacationBtn) vacationBtn.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      const f2 = path.join(dir, 'frame_02_pushback_response.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      return frames;
    }
  },
  {
    id: 'scene_07_goals_and_activity',
    name: '7. Goals & Audit Activity Lineage',
    url: 'http://localhost:3000/goals',
    script: 'Waypoint continuously tracks milestone goals and full transaction activity. Every expense is categorized locally, maintaining strict financial privacy without a single byte of transaction telemetry ever leaving the user\'s local machine.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/goals', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_goals.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.goto('http://localhost:3000/activity', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));
      const f2 = path.join(dir, 'frame_02_activity.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      return frames;
    }
  },
  {
    id: 'scene_08_conclusion_reset',
    name: '8. 100% Deterministic Reliability & Reset',
    url: 'http://localhost:3000/settings',
    script: 'Waypoint is complete, verified, and shippable. With a one-click demo reset button that restores pristine data instantly, zero external API bottlenecks, and sub-five millisecond latency, Waypoint is ready for submission. Waypoint: Know your next move.',
    action: async (page, dir) => {
      const frames: string[] = [];
      await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 600));

      const f1 = path.join(dir, 'frame_01_settings.png');
      await page.screenshot({ path: f1 });
      frames.push(f1);

      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));
      const f2 = path.join(dir, 'frame_02_home_final.png');
      await page.screenshot({ path: f2 });
      frames.push(f2);

      return frames;
    }
  }
];

async function main() {
  console.log('🌐 Launching headless browser for screen recording...');
  const browser: Browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  const segmentVideos: string[] = [];

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    console.log(`\n🎬 Recording Scene ${i + 1}/${SCENES.length}: ${scene.name}`);
    const sceneDir = path.join(RECORDING_DIR, `scene_${i + 1}`);
    if (!fs.existsSync(sceneDir)) {
      fs.mkdirSync(sceneDir, { recursive: true });
    }

    const aiffPath = path.join(sceneDir, 'voiceover.aiff');
    const wavPath = path.join(sceneDir, 'voiceover.wav');
    execSync(`say -v Samantha -r 170 "${scene.script.replace(/"/g, '\\"')}" -o "${aiffPath}"`);
    execSync(`"${ffmpegPath}" -y -i "${aiffPath}" -ar 44100 -ac 2 "${wavPath}"`);

    const durationOutput = execSync(
      `"${ffmpegPath}" -i "${wavPath}" 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,//`
    ).toString().trim();
    console.log(`  🎙️ Voiceover generated (${durationOutput})`);

    const frames = await scene.action(page, sceneDir);
    console.log(`  📸 Captured ${frames.length} high-res screen frames`);

    const segVideo = path.join(sceneDir, 'segment.mp4');
    
    const parts = durationOutput.split(':');
    const totalSec = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    const frameDuration = (totalSec / frames.length).toFixed(3);

    const frameListPath = path.join(sceneDir, 'frames.txt');
    const frameListContent = frames.map(f => `file '${f}'\nduration ${frameDuration}`).join('\n') + `\nfile '${frames[frames.length - 1]}'`;
    fs.writeFileSync(frameListPath, frameListContent);

    execSync(
      `"${ffmpegPath}" -y -f concat -safe 0 -i "${frameListPath}" -i "${wavPath}" -c:v libx264 -pix_fmt yuv420p -r 25 -c:a aac -b:a 192k -shortest "${segVideo}"`
    );
    segmentVideos.push(segVideo);
    console.log(`  ✅ Scene ${i + 1} video segment encoded`);
  }

  await browser.close();

  console.log('\n🎞️ Merging all screen recording segments into master video...');
  const masterListPath = path.join(RECORDING_DIR, 'master_list.txt');
  fs.writeFileSync(
    masterListPath,
    segmentVideos.map(v => `file '${v}'`).join('\n')
  );

  execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${masterListPath}" -c copy "${FINAL_OUTPUT_VIDEO}"`);

  const stats = fs.statSync(FINAL_OUTPUT_VIDEO);
  const finalDuration = execSync(
    `"${ffmpegPath}" -i "${FINAL_OUTPUT_VIDEO}" 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,//`
  ).toString().trim();

  console.log(`\n🎉 MASTER SCREEN RECORDING VIDEO READY!`);
  console.log(`📁 File: ${FINAL_OUTPUT_VIDEO}`);
  console.log(`⏱️ Duration: ${finalDuration}`);
  console.log(`📦 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
}

main().catch(err => {
  console.error('Recording engine error:', err);
  process.exit(1);
});
