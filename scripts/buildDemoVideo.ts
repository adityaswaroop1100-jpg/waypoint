import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';
import { Resvg } from '@resvg/resvg-js';

const TEMP_DIR = path.join(process.cwd(), 'video_production_assets');
const OUTPUT_VIDEO = path.join(process.cwd(), 'waypoint_3min_pitch_demo.mp4');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

console.log('🎬 Starting 3-Minute WAYPOINT Video Production Engine...');

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const SECTIONS = [
  {
    index: 1,
    title: 'WAYPOINT — Know Your Next Move',
    subtitle: 'A Deterministic, Forward-Looking Financial Decision Engine',
    script: 'Welcome to Waypoint. Every personal finance app in the market today shows you where your money went in the rearview mirror — pie charts, historical spending bars, and retrospective guilt. Waypoint is fundamentally different. It is an offline-first, deterministic decision support engine that tells you exactly what to do with your money next, with zero cloud dependencies and zero live API failure points.',
    highlight: 'Forward-Looking Financial Decision Support Engine',
    color: '#4f46e5',
    bullets: [
      'Built for High-Stakes Financial Decisions & Zero-API Reliability',
      'Replaces Rearview Budgeting with Actionable Next-Move Intelligence',
      'Runs 100% Client-Side with Instant Sub-5ms Deterministic Logic'
    ]
  },
  {
    index: 2,
    title: 'Deterministic Core & Ingestion Engine',
    subtitle: 'Zero Cloud APIs • Rule-Based Pattern & Velocity Analysis',
    script: 'Under the hood, Waypoint runs entirely on local, deterministic TypeScript algorithms. Transactions are ingested, categorized, and analyzed through four specialized client-side engines: the Ingestion Normalizer, the Pattern and Collision Detector, the Decision Ranking Engine, and the Pushback Copilot. All state is preserved locally, ensuring complete privacy, zero latency, and one hundred percent uptime.',
    highlight: '4 Local Engines: Ingestion, Patterns, Decisions, Copilot',
    color: '#0284c7',
    bullets: [
      'Sub-5ms Execution Latency with Zero Network Roundtrips',
      'Complete Financial Privacy: No Transaction Data Leaves the Device',
      'Persistent Local Storage with 1-Click State Restoration'
    ]
  },
  {
    index: 3,
    title: 'The One Move — Hero Recommendation Engine',
    subtitle: 'Actionable Inactivity Detection: Cancel Disney+ Hotstar',
    script: 'On the home screen, Waypoint presents The One Move — the single highest-leverage financial action right now, ranked by annual impact, statistical confidence, and required effort. Here, Waypoint detects seventy-four days of zero streaming activity on Disney Plus Hotstar. Clicking the Why button provides an unassailable transaction audit trail. Clicking Do This instantly recomputes the ninety-day cash flow projection and advances to the next ranked action.',
    highlight: '+₹7,788/yr Saved • 94% Statistical Confidence',
    color: '#059669',
    bullets: [
      'Rank Formula: Impact(₹) × (Confidence / 100) ÷ Effort',
      'Verifiable Why? Audit Trail with Full Transaction Lineage',
      'One-Click Execution Instantly Re-projects 90-Day Cash Flow'
    ]
  },
  {
    index: 4,
    title: '90-Day Financial Weather Forecast',
    subtitle: 'Safe, Tight, and Danger Zones • The 27th Cash Collision Dip',
    script: 'The 90-Day Financial Weather Forecast projects daily liquidity across Safe, Tight, and Danger zones based on verified recurring commitments. Notice the sharp dip on the twenty-seventh of the month. Clicking this dip reveals a cash flow collision where apartment rent, utility bills, and credit card auto-debits all collide within seventy-two hours. Waypoint provides a concrete fix: reschedule the credit card due date to the fifth, eliminating the liquidity crunch entirely.',
    highlight: 'The 27th Collision: Rent + Electricity + Card Auto-Debits',
    color: '#d97706',
    bullets: [
      'Color-Blind Safe Zones (Safe > ₹15,000, Tight ₹5k–₹15k, Danger < ₹5k)',
      'Clickable Dip Explainer Pinpoints Multi-Debit Collisions',
      'Actionable Prescribed Fix: Reschedule Billing Cycle to the 5th'
    ]
  },
  {
    index: 5,
    title: 'Life Event Simulator — 5 Cascading Scenarios',
    subtitle: 'Sudden Job Loss • 15% Rent Hike • Medical Emergency • Gadget Purchase • Salary Hike',
    script: 'The Life Event Simulator lets users stress-test major life disruptions before they occur. Under Sudden Job Loss, Waypoint computes our precise baseline liquid runway of four point six months. It then prescribes a structured Lean Mode protocol — pausing non-essential subscriptions and trimming discretionary dining — extending emergency runway to seven point four months. Five real-world scenarios simulate instant cascading balance trajectories.',
    highlight: 'Instant 4.6-Month Baseline Runway & Lean-Mode Protocol',
    color: '#dc2626',
    bullets: [
      'Multi-Variable Stress Testing Across 5 Standardized Life Events',
      'Dynamic Liquid Runway Calculation Down to the Exact Day',
      'Automated Mitigating Moves to Reclaim Financial Stability'
    ]
  },
  {
    index: 6,
    title: 'Regret Engine — Constructive Counterfactuals',
    subtitle: 'Zero Shaming Words Guaranteed • Interactive Habit Sliders',
    script: 'The Regret Engine looks back at past discretionary expenses not to judge, but to unlock future capital. It adheres to a strict zero-shaming guarantee: words like wasted, failed, or guilty are permanently banned. By using interactive sliders, reducing food delivery by twenty percent redirects nine thousand two hundred rupees into our high-priority emergency travel fund, accelerating our milestone by two full months.',
    highlight: 'Strict Zero-Shaming Policy & 5%–50% Dynamic Sliders',
    color: '#7c3aed',
    bullets: [
      'Guilt-Free Positive Financial Framing with Zero Banned Words',
      'Counterfactual Sliders Showing Immediate Compound Savings',
      'Direct Capital Reallocation into Tracked Milestone Goals'
    ]
  },
  {
    index: 7,
    title: 'Pushback Copilot — Behavioral Boundary Defense',
    subtitle: 'Grounded Reality Checks • Deficit Warnings & Alternate Timelines',
    script: 'The Pushback Copilot is the anti-hallucination assistant that isn\'t afraid to say no. When asked if the user can afford a one point five Lakh rupee international trip in December, the Copilot calculates scheduled commitments, identifies a forty-thousand rupee deficit, and issues a firm pushback. It then presents a viable alternative timeline: postpone the trip to February, when savings reach one point six Lakh without compromising emergency reserves.',
    highlight: 'Mathematical Pushback: ₹40,000 Deficit Warning & Safe Reschedule',
    color: '#e11d48',
    bullets: [
      'Deterministic Reality Checks Against Hard Cash Commitments',
      'Pre-Empts Reckless Impulse Purchases with Clear Deficit Warnings',
      'Recommends Realistic Alternative Timelines with Projected Surpluses'
    ]
  },
  {
    index: 8,
    title: 'Reliability, Performance & Submission Ready',
    subtitle: '100% Offline • Zero-Lag Local Engine • Full Feature Coverage',
    script: 'Waypoint is complete, verified, and shippable. It fulfills all eleven feature requirements and five core unique selling propositions. With a one-click demo reset button that restores pristine demo data in milliseconds, zero external API bottlenecks, and an exhaustive automated test suite, Waypoint represents the gold standard in deterministic fintech engineering. Waypoint: Know your next move.',
    highlight: '11 Features • 5 USPs • 100% Deterministic • 0 Live APIs',
    color: '#10b981',
    bullets: [
      'Full Route & Feature Coverage: Forecast, Simulator, Regret & Copilot',
      'Instant One-Click Demo Reset Guarantee (§0.8)',
      'Production-Ready Build with Zero TypeScript or Runtime Errors'
    ]
  }
];

// Step 1: Synthesize High-Quality Speech for each section
console.log('🎙️ Generating natural voiceover speech files using macOS speech synthesis...');
const audioFiles: string[] = [];

for (const sec of SECTIONS) {
  const aiffPath = path.join(TEMP_DIR, `audio_${sec.index}.aiff`);
  const wavPath = path.join(TEMP_DIR, `audio_${sec.index}.wav`);
  
  execSync(`say -v Samantha "${sec.script.replace(/"/g, '\\"')}" -o "${aiffPath}"`);
  execSync(`"${ffmpegPath}" -y -i "${aiffPath}" -ar 44100 -ac 2 "${wavPath}"`);
  audioFiles.push(wavPath);
  console.log(`  ✅ Section ${sec.index} audio synthesized (${sec.title})`);
}

// Step 2: Generate HD 1080p slide images for each section
console.log('🎨 Generating 1080p HD UI showcase presentation slides...');
const pngSlideFiles: string[] = [];

for (const sec of SECTIONS) {
  const svgPath = path.join(TEMP_DIR, `slide_${sec.index}.svg`);
  const pngPath = path.join(TEMP_DIR, `slide_${sec.index}.png`);

  const bulletElements = sec.bullets
    .map((b, idx) => `
      <g transform="translate(220, ${620 + idx * 75})">
        <circle cx="16" cy="16" r="14" fill="${sec.color}" fill-opacity="0.25"/>
        <path d="M10 16 L14 20 L22 12" stroke="${sec.color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="45" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="600" fill="#f1f5f9">${escapeXml(b)}</text>
      </g>
    `).join('');

  const svgContent = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  
  <!-- Top Brand Header Bar -->
  <rect x="0" y="0" width="1920" height="110" fill="#020617" fill-opacity="0.9"/>
  <circle cx="100" cy="55" r="30" fill="${sec.color}"/>
  <text x="100" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">W</text>
  
  <text x="150" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="2">WAYPOINT</text>
  <text x="150" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#a5b4fc">KNOW YOUR NEXT MOVE</text>
  
  <rect x="1540" y="35" width="280" height="42" rx="21" fill="#059669" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
  <circle cx="1568" cy="56" r="6" fill="#10b981"/>
  <text x="1585" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#34d399">DETERMINISTIC 100%</text>

  <!-- Main Showcase Container -->
  <rect x="120" y="160" width="1680" height="820" rx="36" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
  
  <!-- Section Badge -->
  <rect x="180" y="210" width="380" height="44" rx="22" fill="${sec.color}" fill-opacity="0.25" stroke="${sec.color}" stroke-width="2"/>
  <text x="370" y="238" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">SECTION ${sec.index} OF 8 • 3-MIN PITCH</text>
  
  <!-- Section Title & Subtitle -->
  <text x="180" y="315" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="900" fill="#ffffff">${escapeXml(sec.title)}</text>
  <text x="180" y="365" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="600" fill="#94a3b8">${escapeXml(sec.subtitle)}</text>
  
  <!-- Highlight Feature Callout Box -->
  <rect x="180" y="410" width="1560" height="120" rx="24" fill="#020617" fill-opacity="0.9" stroke="${sec.color}" stroke-width="2.5"/>
  <text x="220" y="455" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="${sec.color}" letter-spacing="2">CORE CAPABILITY HIGHLIGHT</text>
  <text x="220" y="495" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="#f8fafc">${escapeXml(sec.highlight)}</text>

  <!-- Architecture & Decision Features List -->
  <rect x="180" y="560" width="1560" height="360" rx="24" fill="#0f172a" fill-opacity="0.7" stroke="#475569" stroke-width="1.5"/>
  <text x="220" y="605" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#38bdf8" letter-spacing="1.5">TECHNICAL PRODUCT SURFACE</text>
  
  ${bulletElements}
</svg>`;

  fs.writeFileSync(svgPath, svgContent);

  // Render SVG to crisp 1080p PNG using resvg
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: 1920
    }
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(pngPath, pngBuffer);

  pngSlideFiles.push(pngPath);
  console.log(`  ✅ Section ${sec.index} 1080p PNG slide rendered`);
}

// Step 3: Encode each segment video (PNG Slide + Voiceover Audio)
console.log('🎥 Encoding 6 synchronized HD video segments with FFmpeg...');
const segmentVideos: string[] = [];

for (let i = 0; i < SECTIONS.length; i++) {
  const sec = SECTIONS[i];
  const audio = audioFiles[i];
  const slide = pngSlideFiles[i];
  const segVideo = path.join(TEMP_DIR, `segment_${sec.index}.mp4`);

  // Loop PNG slide for the duration of the audio
  execSync(`"${ffmpegPath}" -y -loop 1 -i "${slide}" -i "${audio}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${segVideo}"`);
  segmentVideos.push(segVideo);
  console.log(`  ✅ Segment ${sec.index} encoded to MP4`);
}

// Step 4: Concat all 6 segments into the master 3-minute video
console.log('🎞️ Concatenating all segments into master 3-minute video...');
const videoListPath = path.join(TEMP_DIR, 'video_list.txt');
fs.writeFileSync(
  videoListPath,
  segmentVideos.map(v => `file '${v}'`).join('\n')
);

execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${videoListPath}" -c copy "${OUTPUT_VIDEO}"`);

const stats = fs.statSync(OUTPUT_VIDEO);
console.log(`\n🎉 SUCCESS! Master 3-minute pitch video created (${(stats.size / 1024 / 1024).toFixed(2)} MB):`);
console.log(`📁 ${OUTPUT_VIDEO}\n`);
