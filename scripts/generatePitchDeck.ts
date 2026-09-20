import pptxgen from 'pptxgenjs';
import path from 'path';
import fs from 'fs';

async function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.author = 'Waypoint Team';
  pptx.company = 'Waypoint Decision Support Systems';
  pptx.title = 'Waypoint — Know Your Next Move';

  // Modern High-Contrast Fintech Palette
  const THEME = {
    bgDark: '0B0F19',
    bgCard: '131B2E',
    bgCardBorder: '233354',
    primary: '6366F1',     // Indigo
    primaryLight: '818CF8',
    emerald: '10B981',
    amber: 'F59E0B',
    rose: 'EF4444',
    textMain: 'F8FAFC',
    textMuted: '94A3B8',
    textSub: '64748B',
    accentGrad: '4F46E5',
    white: 'FFFFFF'
  };

  const getImg = (relPath: string) => {
    const full = path.join(process.cwd(), relPath);
    return fs.existsSync(full) ? full : null;
  };

  const addHeader = (slide: pptxgen.Slide, category: string, title: string, subtitle?: string) => {
    // Header category tag
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.4,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight,
      charSpacing: 2
    });

    // Main slide title
    slide.addText(title, {
      x: 0.8,
      y: 0.68,
      w: 8.5,
      h: 0.55,
      fontSize: 22,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.25,
        w: 8.5,
        h: 0.35,
        fontSize: 12,
        fontFace: 'Arial',
        color: THEME.textMuted
      });
    }
  };

  // Helper for background
  const setDarkBg = (slide: pptxgen.Slide) => {
    slide.background = { color: THEME.bgDark };
  };

  // ==========================================
  // SLIDE 1: Title
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);

    // Decorative gradient card / glow background
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 0.8,
      w: 8.4,
      h: 4.0,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1.5 },
      rectRadius: 0.2
    });

    // Sub-badge
    slide.addText('AI AGENT HACKATHON 2026  •  PROBLEM STATEMENT 2', {
      x: 1.2,
      y: 1.2,
      w: 7.6,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight,
      charSpacing: 2
    });

    // Giant Title
    slide.addText('WAYPOINT', {
      x: 1.2,
      y: 1.6,
      w: 7.6,
      h: 0.9,
      fontSize: 44,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });

    // Taglines
    slide.addText('Know your next move.', {
      x: 1.2,
      y: 2.5,
      w: 7.6,
      h: 0.45,
      fontSize: 22,
      fontFace: 'Arial',
      bold: true,
      color: THEME.emerald
    });

    slide.addText("The decision engine for your money.\nWaypoint doesn't show you your money. It tells you what to do with it.", {
      x: 1.2,
      y: 3.0,
      w: 7.6,
      h: 0.7,
      fontSize: 14,
      fontFace: 'Arial',
      color: THEME.textMuted
    });

    // Live link pill
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.2,
      y: 3.8,
      w: 3.6,
      h: 0.5,
      fill: { color: '4F46E5' },
      rectRadius: 0.1
    });

    slide.addText('⚡ LIVE: waypoint-flame.vercel.app', {
      x: 1.2,
      y: 3.85,
      w: 3.6,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.white,
      align: 'center'
    });
  }

  // ==========================================
  // SLIDE 2: The Problem
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Current Reality', "You can see your money. You just don't know what to do with it.");

    // Card 1: Symptoms
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.7,
      w: 4.0,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('THE REARVIEW MIRROR SICKNESS', {
      x: 1.1,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.rose
    });

    const symptoms = [
      '📊 47 transactions logged across 6 categories',
      '💳 3 subscriptions silently auto-debiting',
      '📈 Colorful pie charts & budget progress bars',
      '🚪 You open the app, stare at it for 20s, and close it',
      '❓ Still zero idea what action to actually take today'
    ];
    slide.addText(symptoms.join('\n\n'), {
      x: 1.1,
      y: 2.3,
      w: 3.4,
      h: 2.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: THEME.textMuted
    });

    // Card 2: Core Insight
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.2,
      y: 1.7,
      w: 4.0,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.primary, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText('THE CORE BREAKTHROUGH', {
      x: 5.5,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight
    });

    slide.addText('The real problem isn’t data.\nIt’s decision paralysis.', {
      x: 5.5,
      y: 2.3,
      w: 3.4,
      h: 0.8,
      fontSize: 18,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });

    slide.addText('Users do not suffer from a lack of analytics.\nThey suffer from an absence of prioritized agency.\n\nEvery dashboard shows the past.\nNobody was calculating the next move.', {
      x: 5.5,
      y: 3.1,
      w: 3.4,
      h: 1.6,
      fontSize: 12,
      fontFace: 'Arial',
      color: THEME.textMuted
    });
  }

  // ==========================================
  // SLIDE 3: The Insight
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'The Strategic Shift', 'Nobody needs more information. They need one clear decision.');

    // Comparison Table Container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.7,
      w: 4.0,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.rose, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('❌ EVERY COMPETING TEAM', {
      x: 1.1,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.rose
    });

    slide.addText('Builds a Rearview Mirror:\n\nUpload  ➔  Categorize  ➔  Dashboard  ➔  Chatbot\n\nAnswers only:\n"Where did my money go last month?"', {
      x: 1.1,
      y: 2.3,
      w: 3.4,
      h: 2.2,
      fontSize: 13,
      fontFace: 'Arial',
      color: THEME.textMuted
    });

    // Waypoint Column
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.2,
      y: 1.7,
      w: 4.0,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.emerald, width: 2 },
      rectRadius: 0.15
    });

    slide.addText('✅ WAYPOINT ARCHITECTURE', {
      x: 5.5,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: THEME.emerald
    });

    slide.addText('Builds a Forward Decision Loop:\n\nPatterns  ➔  90d Forecast  ➔  One Move  ➔  Action\n\nAnswers:\n"What is the single decision I should make this week to be financially safer in 90 days?"', {
      x: 5.5,
      y: 2.3,
      w: 3.4,
      h: 2.4,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });
  }

  // ==========================================
  // SLIDE 4: The Product Philosophy
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.0,
      y: 1.0,
      w: 8.0,
      h: 3.6,
      fill: { color: THEME.bgCard },
      line: { color: THEME.primary, width: 2 },
      rectRadius: 0.2
    });

    slide.addText('THE PRODUCT PHILOSOPHY', {
      x: 1.5,
      y: 1.4,
      w: 7.0,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight,
      charSpacing: 2
    });

    slide.addText('"Waypoint doesn\'t show you your money.\nIt tells you what to do with it."', {
      x: 1.5,
      y: 1.9,
      w: 7.0,
      h: 1.4,
      fontSize: 28,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });

    slide.addText('Deterministic Math  •  Zero Cloud Latency  •  Action-Oriented Decision Support', {
      x: 1.5,
      y: 3.4,
      w: 7.0,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      color: THEME.emerald
    });
  }

  // ==========================================
  // SLIDE 5: Feature 1 - The One Move
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Core Feature 1', 'The One Move: Hero Recommendation', 'Exactly one ranked action at any moment — eliminating decision fatigue.');

    // Left info block
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.7,
      w: 4.1,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('ACTIONABLE SPECIFICATION', {
      x: 1.1,
      y: 1.9,
      w: 3.5,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight
    });

    const moveBullet = [
      '🎯 Cancel ₹649/mo Disney+ Hotstar',
      '⏱️ Inactive for 73 consecutive days',
      '💰 Frees ₹7,788/year into savings',
      '🛡️ Covers 1.3 months of emergency buffer gap',
      '📊 Confidence: 94% (Deterministic Score)',
      '⚡ Controls: [Do this]  [Not now]  [Why?]'
    ];
    slide.addText(moveBullet.join('\n'), {
      x: 1.1,
      y: 2.2,
      w: 3.5,
      h: 2.5,
      fontSize: 11,
      fontFace: 'Arial',
      color: THEME.textMuted
    });

    // Right image / preview
    const img = getImg('screen_recording_assets/scene_2/frame_01.png');
    if (img) {
      slide.addImage({
        path: img,
        x: 5.2,
        y: 1.7,
        w: 4.0,
        h: 3.3,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 6: Feature 2 - Life Event Simulator
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Core Feature 2', 'Life Event Simulator', '"What if I lose my job tomorrow?" Instant recalculation of runway and lean protocols.');

    const img = getImg('screen_recording_assets/scene_4/frame_01_job_loss.png');
    if (img) {
      slide.addImage({
        path: img,
        x: 0.8,
        y: 1.7,
        w: 4.3,
        h: 3.3,
        rounding: true
      });
    }

    // Right details
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.4,
      y: 1.7,
      w: 3.8,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('5 STRESS-TEST SCENARIOS', {
      x: 5.6,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.amber
    });

    const simPoints = [
      '1. Sudden Job Loss (4.2 mo runway calculated)',
      '2. 15% Rent Increase (+₹3,600/mo impact)',
      '3. Medical Emergency (₹80,000 liquidity shock)',
      '4. Planned Gadget Purchase (₹1.2L in 4 months)',
      '5. 20% Salary Increase (+₹17,000/mo net)',
      '',
      '👉 Not a passive calculator — unlocks automatic lean mitigations to extend runway to 5.6 mo.'
    ];
    slide.addText(simPoints.join('\n'), {
      x: 5.6,
      y: 2.2,
      w: 3.4,
      h: 2.5,
      fontSize: 11,
      fontFace: 'Arial',
      color: THEME.textMuted
    });
  }

  // ==========================================
  // SLIDE 7: Feature 3 - Financial Weather Forecast
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Core Feature 3', '90-Day Financial Weather Forecast', 'Forward-looking cash curve with clickable explainable dip collisions.');

    const img = getImg('screen_recording_assets/scene_3/frame_01_forecast.png');
    if (img) {
      slide.addImage({
        path: img,
        x: 0.8,
        y: 1.7,
        w: 4.3,
        h: 3.3,
        rounding: true
      });
    }

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.4,
      y: 1.7,
      w: 3.8,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('LIQUIDITY WEATHER ZONES', {
      x: 5.6,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.emerald
    });

    const forecastPoints = [
      '🟢 Safe Zone: Balance comfortably above ₹15k buffer',
      '🟡 Tight Zone: Dips between danger and safe thresholds',
      '🔴 Danger Zone: Projects negative before next income',
      '',
      '💥 The 27th Cash Collision Alert:',
      'Rent (₹18,000) + Electricity (₹2,340) + Card Auto-pay (₹6,200) hit within 48h.',
      'Alerts user 3 weeks in advance with ₹1,540 shortfall warning.'
    ];
    slide.addText(forecastPoints.join('\n'), {
      x: 5.6,
      y: 2.2,
      w: 3.4,
      h: 2.6,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: THEME.textMuted
    });
  }

  // ==========================================
  // SLIDE 8: Feature 4 - Regret Engine
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Core Feature 4', 'The Regret Engine: Counterfactual Math', 'Positive momentum math without shaming or guilt language.');

    const img = getImg('screen_recording_assets/scene_5/frame_01_regret.png');
    if (img) {
      slide.addImage({
        path: img,
        x: 0.8,
        y: 1.7,
        w: 4.3,
        h: 3.3,
        rounding: true
      });
    }

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.4,
      y: 1.7,
      w: 3.8,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('MOTIVATING, NEVER SHAMING', {
      x: 5.6,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight
    });

    const regretPoints = [
      '💡 "You bought convenience when you needed it."',
      '',
      '• Food Delivery: ₹23,400 spent in 6 months.',
      '  Cooking 3 extra meals/week recovers ₹14,200 — fully funding the emergency cushion.',
      '',
      '• Unused Subscriptions: ₹3,894 paid for services used fewer than 5 times.',
      '',
      '✨ Interactive adjustment sliders let users model realistic 10–25% optimizations.'
    ];
    slide.addText(regretPoints.join('\n'), {
      x: 5.6,
      y: 2.2,
      w: 3.4,
      h: 2.6,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: THEME.textMuted
    });
  }

  // ==========================================
  // SLIDE 9: Feature 5 - Pushback Copilot
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Core Feature 5', 'Pushback Copilot: An Agent With An Opinion', 'Waypoint pushes back with exact math when assumptions violate commitments.');

    const img = getImg('screen_recording_assets/scene_6/frame_02_pushback_response.png');
    if (img) {
      slide.addImage({
        path: img,
        x: 0.8,
        y: 1.7,
        w: 4.3,
        h: 3.3,
        rounding: true
      });
    }

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.4,
      y: 1.7,
      w: 3.8,
      h: 3.3,
      fill: { color: THEME.bgCard },
      line: { color: THEME.bgCardBorder, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('MATHEMATICALLY GROUNDED PUSHBACK', {
      x: 5.6,
      y: 1.9,
      w: 3.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: THEME.rose
    });

    const pushbackText = [
      'User: "Can I afford a ₹1.5L vacation in Dec?"',
      '',
      'Waypoint: "Based on your net savings of ₹8,200/mo, you will have ₹1.1L after safety buffer — leaving a ₹40,000 deficit.',
      '',
      'Options:',
      '(a) Cut discretionary spend by ₹5,000/mo for 8 months.',
      '(b) Delay trip to February 2027.',
      '',
      'Waypoint recommends (b)."',
      '',
      '👉 Not an agreeable chatbot. An honest advisor.'
    ];
    slide.addText(pushbackText.join('\n'), {
      x: 5.6,
      y: 2.2,
      w: 3.4,
      h: 2.6,
      fontSize: 10,
      fontFace: 'Arial',
      color: THEME.textMuted
    });
  }

  // ==========================================
  // SLIDE 10: Architecture
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'System Architecture', '4 Deterministic Agents • Zero External LLM in Math', 'Pure mathematical functions executing 100% client-side.');

    // 4 Agent boxes
    const agents = [
      { name: '1. INGESTOR AGENT', desc: '• PDF statement text extraction (pdfjs-dist)\n• Two-pass date-anchor parser\n• Rule categorizer + correction overrides', color: THEME.primaryLight },
      { name: '2. PATTERN ENGINE', desc: '• Recurrence clustering (30d intervals)\n• Z-score anomaly detector (>2.0 standard dev)\n• Friday surge spending habit pattern', color: THEME.amber },
      { name: '3. DECISION ENGINE', desc: '• The One Move scoring algorithm\n• 90-day cash weather projection\n• 5 life event simulators & regret counterfactuals', color: THEME.emerald },
      { name: '4. PUSHBACK COPILOT', desc: '• Deterministic regex intent matcher\n• Mathematical budget verification\n• Guardrails against safety buffer breach', color: THEME.rose }
    ];

    agents.forEach((ag, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 4.3;
      const y = 1.7 + row * 1.7;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.1,
        h: 1.5,
        fill: { color: THEME.bgCard },
        line: { color: THEME.bgCardBorder, width: 1 },
        rectRadius: 0.1
      });

      slide.addText(ag.name, {
        x: x + 0.2,
        y: y + 0.15,
        w: 3.7,
        h: 0.25,
        fontSize: 11,
        fontFace: 'Arial',
        bold: true,
        color: ag.color
      });

      slide.addText(ag.desc, {
        x: x + 0.2,
        y: y + 0.45,
        w: 3.7,
        h: 0.95,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: THEME.textMuted
      });
    });
  }

  // ==========================================
  // SLIDE 11: Built for Reliability
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Engineering Rigor', 'Built for Reliability: The Offline Guarantee', 'Designed so the demo never fails, glitches, or white-screens during judging.');

    const pillars = [
      { title: '🔒 Zero Mandatory API Keys', text: 'Works 100% offline out of the box with zero network calls on the critical path.' },
      { title: '📊 Hardcoded Pristine Seed', text: '77 curated transactions over 6 months with pre-calculated mathematical benchmarks.' },
      { title: '🧮 Pure Deterministic TypeScript', text: 'No hallucinations, no indeterminate outputs, and no flaky token timeouts.' },
      { title: '🛡️ Root ErrorBoundary & State Views', text: 'Every route has loading, error, and empty states. Never shows a blank screen.' },
      { title: '🔄 1-Click State Restoration', text: 'Reset button cleans user overrides and restores pristine seed dataset in <50ms.' },
      { title: '🧪 100% Engine Verification Suite', text: 'All 7 deterministic unit tests pass automatically via npx tsx verifyEngines.ts.' }
    ];

    pillars.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.8 + col * 4.3;
      const y = 1.7 + row * 1.15;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.1,
        h: 1.0,
        fill: { color: THEME.bgCard },
        line: { color: THEME.bgCardBorder, width: 1 },
        rectRadius: 0.1
      });

      slide.addText(p.title, {
        x: x + 0.2,
        y: y + 0.12,
        w: 3.7,
        h: 0.25,
        fontSize: 11,
        fontFace: 'Arial',
        bold: true,
        color: THEME.emerald
      });

      slide.addText(p.text, {
        x: x + 0.2,
        y: y + 0.4,
        w: 3.7,
        h: 0.5,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: THEME.textMuted
      });
    });
  }

  // ==========================================
  // SLIDE 12: The Complete Product
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Scope & Completeness', 'Not a Prototype. A Production Web Application.', '12 fully interactive routes styled with responsive Tailwind CSS.');

    const routes = [
      { name: 'Home (The One Move)', desc: 'Hero recommendation, financial KPIs, next moves queue' },
      { name: '90-Day Forecast', desc: 'Balance curve, safe/tight/danger zones, dip explainer' },
      { name: 'Simulator', desc: '5 stress-test life scenarios + lean mitigation moves' },
      { name: 'Regret Engine', desc: 'Counterfactual math with positive, motivating tone' },
      { name: 'Pushback Copilot', desc: 'Natural language Q&A with mathematical pushback' },
      { name: 'Monthly Report', desc: 'Income vs expense, top categories, budget tracking' },
      { name: 'Goals & Budgets', desc: 'Interactive goal progress rings & monthly category caps' },
      { name: 'Activity Ledger', desc: '6-month ledger, anomaly flags, inline category edits' },
      { name: 'Statement Upload', desc: 'PDF & CSV statement parser + sample HDFC statement' },
      { name: 'Settings & State', desc: 'Buffer limits, income settings, and engine state inspector' }
    ];

    routes.forEach((r, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.8 + col * 4.3;
      const y = 1.7 + row * 0.68;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 4.1,
        h: 0.58,
        fill: { color: THEME.bgCard },
        line: { color: THEME.bgCardBorder, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(`${r.name}: `, {
        x: x + 0.15,
        y: y + 0.1,
        w: 1.6,
        h: 0.38,
        fontSize: 9.5,
        fontFace: 'Arial',
        bold: true,
        color: THEME.textMain
      });

      slide.addText(r.desc, {
        x: x + 1.7,
        y: y + 0.1,
        w: 2.2,
        h: 0.38,
        fontSize: 9,
        fontFace: 'Arial',
        color: THEME.textMuted
      });
    });
  }

  // ==========================================
  // SLIDE 13: Why We Win
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);
    addHeader(slide, 'Competitive Advantage', 'Why We Win: Other Teams vs. Waypoint');

    const comparisons = [
      { dim: 'Core Question', others: '"Where did my money go?"', waypoint: '"What should I do next?"' },
      { dim: 'Primary Output', others: 'Overwhelming dashboard of charts', waypoint: 'One single ranked decision' },
      { dim: 'Demo "Aha!" Moment', others: 'A static pie chart', waypoint: '"What if I lose my job tomorrow?"' },
      { dim: 'Advisor Tone', others: 'Passive neutral reporting', waypoint: 'Coach with a clear point of view' },
      { dim: 'Emotional Hook', others: 'None (or financial guilt)', waypoint: 'The Regret Engine (empowerment)' },
      { dim: 'Reliability', others: 'Fragile live API & LLM calls', waypoint: '100% offline & deterministic' },
      { dim: 'Memorability', others: 'Yet another budgeting tool', waypoint: '"The app that tells you what to do"' }
    ];

    // Table Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.6,
      w: 8.4,
      h: 0.4,
      fill: { color: '1E293B' },
      rectRadius: 0.08
    });

    slide.addText('DIMENSION', { x: 1.0, y: 1.65, w: 2.2, h: 0.3, fontSize: 10, fontFace: 'Arial', bold: true, color: THEME.textSub });
    slide.addText('COMPETING TEAMS', { x: 3.3, y: 1.65, w: 2.7, h: 0.3, fontSize: 10, fontFace: 'Arial', bold: true, color: THEME.rose });
    slide.addText('WAYPOINT', { x: 6.2, y: 1.65, w: 2.8, h: 0.3, fontSize: 10, fontFace: 'Arial', bold: true, color: THEME.emerald });

    comparisons.forEach((c, idx) => {
      const y = 2.08 + idx * 0.45;
      const isAlt = idx % 2 === 1;

      if (isAlt) {
        slide.addShape(pptx.shapes.RECTANGLE, {
          x: 0.8,
          y: y - 0.04,
          w: 8.4,
          h: 0.42,
          fill: { color: '101626' }
        });
      }

      slide.addText(c.dim, { x: 1.0, y: y, w: 2.2, h: 0.35, fontSize: 10, fontFace: 'Arial', bold: true, color: THEME.textMain });
      slide.addText(c.others, { x: 3.3, y: y, w: 2.7, h: 0.35, fontSize: 9.5, fontFace: 'Arial', color: THEME.textMuted });
      slide.addText(c.waypoint, { x: 6.2, y: y, w: 2.8, h: 0.35, fontSize: 9.5, fontFace: 'Arial', bold: true, color: THEME.emerald });
    });
  }

  // ==========================================
  // SLIDE 14: Closing
  // ==========================================
  {
    const slide = pptx.addSlide();
    setDarkBg(slide);

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.0,
      y: 0.9,
      w: 8.0,
      h: 3.8,
      fill: { color: THEME.bgCard },
      line: { color: THEME.primary, width: 2 },
      rectRadius: 0.2
    });

    slide.addText('WAYPOINT', {
      x: 1.5,
      y: 1.3,
      w: 7.0,
      h: 0.5,
      fontSize: 28,
      fontFace: 'Arial',
      bold: true,
      color: THEME.textMain
    });

    slide.addText('"Waypoint doesn\'t show you your money.\nIt tells you what to do with it."', {
      x: 1.5,
      y: 1.85,
      w: 7.0,
      h: 1.0,
      fontSize: 22,
      fontFace: 'Arial',
      bold: true,
      color: THEME.emerald
    });

    slide.addText('Know your next move.', {
      x: 1.5,
      y: 2.9,
      w: 7.0,
      h: 0.4,
      fontSize: 16,
      fontFace: 'Arial',
      color: THEME.textMuted
    });

    // Links container
    slide.addText('🌐 LIVE DEMO: https://waypoint-flame.vercel.app\n💻 CODEBASE:  https://github.com/adityaswaroop1100-jpg/waypoint', {
      x: 1.5,
      y: 3.4,
      w: 7.0,
      h: 0.8,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: THEME.primaryLight
    });
  }

  const outPath = path.join(process.cwd(), 'Waypoint_Pitch_Deck.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`✅ PowerPoint successfully generated at: ${outPath}`);
}

buildPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
