# WAYPOINT — Know Your Next Move

> **"Waypoint doesn't show you your money. It tells you what to do with it."**
>
> *Non-goal: Waypoint provides decision support, not investment or financial advice.*

Waypoint is a forward-looking, offline-first personal financial decision engine. Instead of simply graphing where money was spent in the rearview mirror, Waypoint computes the single highest-leverage next move you should take right now, stress-tests life scenarios, forecasts 90-day cash-flow weather, calculates positive counterfactual savings, and actively pushes back when decisions threaten your liquidity safety buffer.

---

## 🌟 The Five Core USPs

1. **The One Move (Hero Screen)**: Exactly one ranked recommendation at any moment (e.g. *"Cancel Disney+ Hotstar — ₹1,499/yr freed with 94% confidence"*). Ranked mathematically via:
   $$\text{Score} = \text{Impact (₹)} \times \left(\frac{\text{Confidence}}{100}\right) \times \left(\frac{1}{\text{Effort Weight}}\right)$$
   Every move provides a traceable **Why?** transaction audit trail. Clicking **"Do this"** marks the move completed and immediately surfaces the next ranked opportunity.

2. **Life Event Simulator**: Stress-test 5 real-life scenarios with zero network calls:
   - Sudden Job Loss (runway calculation & lean protocol mitigation)
   - 15% Rent Increase (+₹3,600/mo)
   - Unplanned Medical Emergency (₹80,000)
   - Planned Gadget Purchase (₹1.2L in 4 months)
   - 20% Salary Increase (+₹17,000/mo net take-home)

3. **90-Day Financial Weather Forecast**: Day-by-day forward balance projection across **Safe**, **Tight**, and **Danger** zones. Features clickable collision dips (specifically the **27th cash collision** where Rent, Utilities, and Card Auto-Pay collide within 72 hours).

4. **Regret Engine (Counterfactual Math)**: Converts historical spending patterns into forward momentum without judgment or shaming language. Features interactive percentage sliders to model potential savings.

5. **Agent That Pushes Back (Voice Copilot)**: Grounded in deterministic math. If you ask *"Can I afford a ₹1.5L vacation in December?"*, Waypoint computes your exact commitments and argues back: *"You will have ₹1.1L after buffer — creating a ₹40,000 deficit. We recommend delaying to February 2027 or capping the trip at ₹1.0L."*

---

## 🏗️ Architecture: 4 Deterministic Agents

```
seedTransactions.ts (or CSV upload)
        │
        ▼
[Ingestor Agent]      → Rules-based categorization & LocalStorage correction memory overrides
        │
        ▼
[Pattern Engine]      → Recurrence clustering, z-score anomaly detection, Friday habit pattern
        │
        ▼
[Decision Engine]     → The One Move ranking, 90-day forecast, 5 simulator scenarios, regret math
        │
        ▼
[Voice Copilot Agent] → Deterministic intent matching & mathematical pushback
```

All 4 agents are pure, deterministic TypeScript functions: `(input) => output`. Zero external LLM or network dependencies sit on the critical path.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production static bundle
npm run build

# Preview static production build
npm run preview
```

Open `http://localhost:3000` in any modern web browser.

---

## 🔄 One-Click Demo Reset

At any time, you can restore the pristine demo baseline by clicking **"Reset Demo State"** in the sidebar footer, the top header bar, or inside the **Settings** screen (`/settings`). This clears all custom edits from LocalStorage and re-initializes the tuned 6-month seed dataset.

---

## 📱 Supported Routes & Site Map

| Route | Screen | Description |
|---|---|---|
| `/` | **Home** | The One Move hero recommendation, financial KPIs, next moves queue |
| `/forecast` | **Forecast** | 90-day balance curve, safe/tight/danger zones, clickable dips |
| `/simulator` | **Simulator** | 5 life event scenarios, runway calculator, mitigating moves |
| `/regret` | **Regret Engine** | Counterfactual savings math with zero shaming language |
| `/ask` | **Ask Copilot** | Natural language Q&A with mathematically grounded pushback |
| `/report` | **Monthly Report** | Income/expense summary, top 5 categories, budget vs actual |
| `/goals` | **Goals & Budgets** | Goals CRUD with progress rings & category monthly budget limits |
| `/activity` | **Activity Ledger** | 6-month transaction table, z-score anomaly badges, inline category editing |
| `/upload` | **Upload (Bonus)** | CSV statement ingestion with resilient error fallback |
| `/settings` | **Settings & Debug** | Parameters, one-click reset demo, developer debug inspector |
| `/onboarding`| **Onboarding** | 3-step setup wizard with fast demo skip |
| `*` | **404 Fallback** | Friendly route recovery linking back to Home |

---

## 🛡️ Reliability & Definition of Done

- **Zero Required Environment Variables**: Boots offline out of the box.
- **Client-Side Persistence**: Zustand store backed by LocalStorage.
- **Banned Words Guarantee**: All generated text is validated against a shaming words filter.
- **Accessible & Responsive**: Fully responsive from mobile (360px) to desktop (1280px+) with color-blind safe indicators (icon + text).
- **Error Boundary**: Caught exceptions render a recovery screen with an instant reset button.
