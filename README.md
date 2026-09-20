# WAYPOINT — Know Your Next Move

> **"Waypoint doesn't show you your money. It tells you what to do with it."**
>
> *Non-goal: Waypoint provides decision support, not investment or financial advice.*

[![Live App](https://img.shields.io/badge/Live_Demo-waypoint--flame.vercel.app-4f46e5?style=for-the-badge&logo=vercel)](https://waypoint-flame.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/adityaswaroop1100-jpg/waypoint)
[![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge)](https://waypoint-flame.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌐 Live Demo & Quick Links

- **Live Production App**: [https://waypoint-flame.vercel.app](https://waypoint-flame.vercel.app)
- **GitHub Repository**: [https://github.com/adityaswaroop1100-jpg/waypoint](https://github.com/adityaswaroop1100-jpg/waypoint)

---

## 💡 What is Waypoint?

Waypoint is an **offline-first, deterministic personal financial decision engine**. Instead of passively graphing where your money went in the past, Waypoint calculates the **single highest-leverage next move** you should execute right now.

It stress-tests life events, projects a 90-day cash-flow weather forecast, turns counterfactual history into forward momentum, parses bank statements (PDF & CSV) 100% in your browser, and actively pushes back when decisions threaten your safety buffer.

---

## 🌟 Core Features & USPs

### 1. 🎯 The One Move (Hero Decision Engine)
- Always gives **exactly one** ranked, high-confidence recommendation at any moment (e.g., *"Cancel Disney+ Hotstar — ₹1,499/yr freed with 94% confidence"*).
- Ranked mathematically via:
  $$\text{Score} = \text{Impact (₹)} \times \left(\frac{\text{Confidence}}{100}\right) \times \left(\frac{1}{\text{Effort Weight}}\right)$$
- Complete with an interactive **"Why?"** audit trail. Clicking **"Do this"** marks the move completed and dynamically promotes the next best move.

### 2. 📄 Statement Ingestion & Analysis (PDF & CSV)
- **PDF Bank Statements**: Ingests real bank statement PDFs (HDFC, SBI, ICICI, Axis, Kotak, IDFC First, etc.) entirely client-side using a two-pass date-anchor parser.
- **Auto Debit/Credit Detection**: Intelligently classifies transactions from standard `DR`/`CR` markers and narration keywords.
- **Built-in Sample Statement**: Includes an instant-download sample HDFC statement right on the upload page so evaluators and judges can test end-to-end with zero setup.
- **CSV Support**: Accepts any standard bank export with auto-categorization and LocalStorage correction memory.

### 3. ⛈️ 90-Day Financial Weather Forecast
- Forward balance projection across **Safe**, **Tight**, and **Danger** liquidity zones.
- Interactive collision detection highlighting the **27th cash collision** (where rent, card bills, and utilities auto-debit within 72 hours).

### 4. 🧪 Life Event Simulator
Stress-test major financial shifts in real-time with instant runway recalculation:
- **Sudden Job Loss**: Computes runway and unlocks a single-click Lean Protocol mitigation.
- **15% Rent Hike**: Models +₹3,600/month recurring pressure.
- **Unplanned Medical Emergency**: Simulates ₹80,000 sudden liquidity impact.
- **Planned Gadget Purchase**: Evaluates saving ₹1.2L over 4 months.
- **20% Salary Increase**: Demonstrates savings cushion expansion (+₹17,000/mo net).

### 5. 💡 Regret Engine (Positive Counterfactual Math)
- Converts historical non-essential spending into actionable future savings cushions.
- **Zero-shaming guarantee**: Eliminates guilt words ("wasted", "failed", "careless") and provides interactive percentage adjustment sliders.

### 6. 🗣️ Pushback Copilot
- Mathematically grounded Q&A.
- When an assumption conflicts with real obligations, the copilot pushes back with exact calculations rather than giving generic advice.

---

## 🏗️ Architecture: 4 Deterministic Agents

```
Uploaded PDF / CSV  or  Seed Transactions
                   │
                   ▼
       [1. Ingestor & PDF Parser]
       • pdfjs-dist text extraction
       • Regex date-anchor tokenization
       • Rule-based merchant categorizer & correction memory
                   │
                   ▼
           [2. Pattern Engine]
       • Recurrence clustering & interval analysis
       • Z-score anomaly detection
       • Friday habit pattern detection
                   │
                   ▼
          [3. Decision Engine]
       • The One Move scoring & ranked queue
       • 90-day balance curve & collision pinpointing
       • 5 life event simulator scenarios & regret math
                   │
                   ▼
         [4. Pushback Copilot]
       • Deterministic intent matching & mathematical guardrails
```

All engines are pure, deterministic TypeScript functions `(state) => computedState`. **Zero cloud API keys, zero external LLM latency, zero hallucinations.**

---

## 💻 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React
- **State Management**: Zustand (persisted in LocalStorage)
- **Data Visualization**: Recharts
- **PDF Engine**: PDF.js (`pdfjs-dist`)
- **CSV Engine**: PapaParse
- **Deployment**: Vercel (Production CI/CD with SPA rewrites)

---

## 📱 Site Map & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | The One Move hero card, financial KPIs, next moves queue |
| `/forecast` | **Forecast** | 90-day balance curve, safe/tight/danger zones, dip explainer |
| `/simulator` | **Simulator** | 5 life event scenarios, runway calculator, mitigating actions |
| `/regret` | **Regret Engine** | Counterfactual savings math with zero judgment |
| `/ask` | **Pushback Copilot** | Deterministic financial Q&A that pushes back with real numbers |
| `/report` | **Monthly Report** | Inflow/outflow breakdown, top categories, budget vs actual |
| `/goals` | **Goals & Budgets** | Interactive goal progress rings & monthly category caps |
| `/activity` | **Activity Ledger** | 6-month transaction history, anomaly flags, inline category editor |
| `/upload` | **Statement Ingestion** | PDF & CSV statement parser with instant downloadable sample |
| `/settings` | **Settings** | Parameter config, safety buffer limits, engine inspector, state reset |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

```bash
# 1. Clone repository
git clone https://github.com/adityaswaroop1100-jpg/waypoint.git
cd waypoint

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Verification Suite
```bash
# Verify all deterministic agents and math models
npx tsx src/test/verifyEngines.ts
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 Evaluation & Testing Instructions for Judges

1. Open the live deployment: **[https://waypoint-flame.vercel.app](https://waypoint-flame.vercel.app)**
2. **Review The One Move**: On the Home screen, inspect the single top-priority move, click **"Why?"** to see the transaction audit trail, and test clicking **"Do this"**.
3. **Test PDF Ingestion**:
   - Navigate to **Statement Upload** (`/upload`).
   - Click **"Download Sample HDFC PDF"** to save the prepared statement.
   - Click **"Choose PDF File"** and select the downloaded file.
   - Watch the client-side parser extract 20+ transactions, classify credits/debits, and update your financial weather forecast in real time.
4. **Stress-Test Life Events**: Visit **Simulator** (`/simulator`) and trigger "Sudden Job Loss" or "Medical Emergency" to observe dynamic runway changes.
5. **Ask the Copilot**: Head to **Pushback Copilot** (`/ask`) and try: *"Can I afford a ₹1.5L vacation in December?"* to experience mathematical pushback.
6. **State Reset**: Click **"Reset State"** in the sidebar at any point to restore the clean demo baseline.

---

## 📄 License

MIT © 2026 Aditya Swaroop
