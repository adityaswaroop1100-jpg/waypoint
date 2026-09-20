import {
  Transaction,
  RecurringItem,
  Anomaly,
  Habit,
  Move,
  ForecastPoint,
  Goal,
  Budget,
  SimResult,
  Regret,
  MonthlySummary,
  Settings
} from '../types';
import { rankMoveScore, sortMovesByPriority } from '../lib/math';
import { formatCurrency } from '../lib/format';

export interface DecisionEngineState {
  theOneMove: Move | null;
  nextMoves: Move[];
  forecast: ForecastPoint[];
  pinnedDipPoint: ForecastPoint | null;
  simResults: Record<string, SimResult>;
  regrets: Regret[];
  monthlySummary: MonthlySummary;
  overallHealthScore: number; // 0-100
  estimatedRunwayMonths: number;
}

export function runDecisionEngine(
  transactions: Transaction[],
  recurring: RecurringItem[],
  anomalies: Anomaly[],
  habits: Habit[],
  goals: Goal[],
  budgets: Budget[],
  settings: Settings,
  completedMoveIds: string[] = [],
  dismissedMoveIds: string[] = [],
  currentBalance: number = 54200
): DecisionEngineState {
  // ──────────────────────────────────────────
  // 1. GENERATE & RANK CANDIDATE MOVES
  // ──────────────────────────────────────────
  const candidateMoves: Move[] = [];

  // Move A: Unused Subscription (Hotstar) — HIGHEST PRIORITY HERO MOVE
  const hotstarTxns = transactions.filter(t => t.merchant.toLowerCase().includes('hotstar'));
  const hotstarTxnIds = hotstarTxns.map(t => t.id);
  candidateMoves.push({
    id: 'move-cancel-hotstar',
    title: 'Cancel Disney+ Hotstar',
    impactRupees: 7788, // Annual subscription + 4K add-on savings
    confidence: 94,
    reasoning: 'Zero streaming activity detected over the past 74 days. Canceling before the auto-renewal locks in guaranteed annual savings with zero lifestyle compromise.',
    sourceTransactionIds: hotstarTxnIds.length > 0 ? hotstarTxnIds : ['tx-20260904-03', 'tx-20260404-03'],
    status: 'pending',
    effortWeight: 0.2, // 1-click effortless cancellation
    category: 'Subscriptions',
    actionType: 'cancel_subscription'
  });

  // Move B: Optimize Friday Food Delivery Habit
  const fridayTxns = transactions.filter(t => t.merchant.toLowerCase().includes('swiggy') || t.merchant.toLowerCase().includes('zomato'));
  candidateMoves.push({
    id: 'move-trim-friday-delivery',
    title: 'Trim 1 Weekend Delivery Order/Month',
    impactRupees: 9600, // ₹800 * 12 months
    confidence: 88,
    reasoning: 'You ordered food delivery on 18 out of 24 Friday evenings averaging ₹800/order. Replacing just one order per month frees ₹9,600/year for your Goa trip.',
    sourceTransactionIds: fridayTxns.slice(0, 5).map(t => t.id),
    status: 'pending',
    effortWeight: 1.5,
    category: 'Food & Dining',
    actionType: 'budget_cut'
  });

  // Move C: Reschedule Credit Card Auto-Pay to Avoid Collision
  candidateMoves.push({
    id: 'move-reschedule-autopay',
    title: 'Shift Card Auto-Pay to the 5th',
    impactRupees: 3500, // saved overdraft fees / interest buffer
    confidence: 92,
    reasoning: 'Moving your credit card due date from the 27th to the 5th avoids colliding with rent and utility debits, keeping your balance securely above the ₹15,000 comfort buffer.',
    sourceTransactionIds: transactions.filter(t => t.category === 'Financial & EMI' || t.category === 'Housing & Rent').slice(0, 3).map(t => t.id),
    status: 'pending',
    effortWeight: 1.2,
    category: 'Financial & EMI',
    actionType: 'reschedule_payment'
  });

  // Move D: Negotiate Broadband & Utility Plan
  candidateMoves.push({
    id: 'move-streamline-broadband',
    title: 'Switch Broadband to Annual Tier',
    impactRupees: 2800,
    confidence: 85,
    reasoning: 'Switching your ₹1,199/month broadband plan to an upfront annual recharge reduces effective cost to ₹965/month, saving ₹2,808/year.',
    sourceTransactionIds: transactions.filter(t => t.merchant.toLowerCase().includes('airtel')).map(t => t.id),
    status: 'pending',
    effortWeight: 1.8,
    category: 'Utilities & Bills',
    actionType: 'bill_negotiate'
  });

  // Filter out completed & dismissed
  const availableMoves = candidateMoves.filter(
    m => !completedMoveIds.includes(m.id) && !dismissedMoveIds.includes(m.id)
  );

  const rankedMoves = sortMovesByPriority(availableMoves);
  const theOneMove = rankedMoves.length > 0 ? rankedMoves[0] : null;
  const nextMoves = rankedMoves.slice(1);

  // ──────────────────────────────────────────
  // 2. 90-DAY FINANCIAL WEATHER FORECAST
  // ──────────────────────────────────────────
  const forecast: ForecastPoint[] = [];
  const startDate = new Date('2026-09-20T00:00:00');
  let runningBalance = currentBalance;
  
  // If Hotstar move was completed, add savings back into baseline
  if (completedMoveIds.includes('move-cancel-hotstar')) {
    runningBalance += 1499;
  }

  const dailyDiscretionary = 520; // baseline discretionary rate per day

  for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + dayOffset);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfMonth = d.getDate();

    let dayIncome = 0;
    let dayExpenses = dailyDiscretionary;
    const causes: string[] = [];

    // Salary on 1st
    if (dayOfMonth === 1) {
      dayIncome += settings.monthlyIncome || 85000;
      causes.push(`Tech Corp Monthly Salary (+${formatCurrency(settings.monthlyIncome || 85000)})`);
    }

    // Rent on 3rd
    if (dayOfMonth === 3) {
      dayExpenses += 24000;
      causes.push('Landlord Rent Payment (-₹24,000)');
    }

    // Subscriptions on 4th
    if (dayOfMonth === 4) {
      let subAmount = 768; // Netflix + Spotify
      if (!completedMoveIds.includes('move-cancel-hotstar') && dayOffset > 10 && dayOffset < 45) {
        subAmount += 1499;
        causes.push('Disney+ Hotstar Auto-Renew (-₹1,499)');
      }
      dayExpenses += subAmount;
      causes.push(`Active Subscriptions (-${formatCurrency(subAmount)})`);
    }

    // Gym on 5th
    if (dayOfMonth === 5) {
      dayExpenses += 2500;
      causes.push('Cult.Fit Gym Membership (-₹2,500)');
    }

    // Electricity on 15th
    if (dayOfMonth === 15) {
      dayExpenses += 3200;
      causes.push('State Electricity Board Bill (-₹3,200)');
    }

    // Broadband on 20th
    if (dayOfMonth === 20) {
      dayExpenses += 1199;
      causes.push('Airtel Broadband & DTH (-₹1,199)');
    }

    // Pinned 27th collision (Credit card auto-pay)
    if (dayOfMonth === 27) {
      const cardAmount = 18400;
      dayExpenses += cardAmount;
      causes.push(`HDFC Credit Card Auto-Pay (-${formatCurrency(cardAmount)})`);
      causes.push('⚠️ Cash-Flow Collision: Cumulative debits from rent, electricity & card bills within 3 days');
    }

    runningBalance += (dayIncome - dayExpenses);

    // Determine Zone
    let zone: 'safe' | 'tight' | 'danger' = 'safe';
    if (runningBalance < (settings.dangerBufferAmount || 5000)) {
      zone = 'danger';
    } else if (runningBalance < (settings.bufferAmount || 15000)) {
      zone = 'tight';
    }

    forecast.push({
      date: dateStr,
      projectedBalance: Math.round(runningBalance),
      zone,
      causes: causes.length > 0 ? causes : undefined,
      dayIncome,
      dayExpenses,
      isDip: dayOfMonth === 27
    });
  }

  // Find the pinned dip point on the 27th
  const pinnedDipPoint = forecast.find(f => f.isDip && f.date.includes('-10-27')) || forecast.find(f => f.isDip) || null;

  // ──────────────────────────────────────────
  // 3. LIFE EVENT SIMULATOR (5 Scenarios)
  // ──────────────────────────────────────────
  const monthlyFixedObligations = 24000 + 2500 + 3200 + 1199 + 768; // ~31,667
  const monthlyDiscretionary = 16000;
  const totalMonthlyBurn = monthlyFixedObligations + monthlyDiscretionary; // ~47,667
  const currentLiquidAssets = currentBalance + (goals.find(g => g.type === 'emergency_fund')?.currentAmount || 90000);
  const baseRunway = parseFloat((currentLiquidAssets / totalMonthlyBurn).toFixed(1));

  const simResults: Record<string, SimResult> = {
    job_loss: {
      scenario: 'job_loss',
      title: 'Sudden Job Loss / Income Pause',
      description: 'Simulates complete loss of salary from next month with zero severance.',
      runwayMonths: parseFloat((currentLiquidAssets / monthlyFixedObligations).toFixed(1)),
      monthlyDeficit: monthlyFixedObligations + 8000,
      goalImpact: 'Pauses Emergency Fund and delays Goa Vacation goal by 5.5 months.',
      mitigatingMove: {
        id: 'sim-mitigate-jobloss',
        title: 'Activate Lean-Mode Protocol',
        impactRupees: 18500,
        confidence: 96,
        reasoning: 'Pausing gym membership, dining delivery, and all subscriptions instantly extends your liquid runway by +2.8 months.',
        sourceTransactionIds: [],
        status: 'pending',
        actionType: 'budget_cut'
      },
      projectedForecast: generateSimForecast(currentBalance, 0, monthlyFixedObligations, 4000, 90)
    },
    rent_hike: {
      scenario: 'rent_hike',
      title: '15% Rent Increase (+₹3,600/mo)',
      description: 'Simulates lease renewal jump from ₹24,000 to ₹27,600/month.',
      runwayMonths: baseRunway,
      monthlyDeficit: 3600,
      goalImpact: 'Reduces monthly savings rate by 14%; Emergency Cushion goal target delayed by 2.3 months.',
      mitigatingMove: {
        id: 'sim-mitigate-rent',
        title: 'Reallocate ₹3,600 from Dining & Entertainment',
        impactRupees: 43200,
        confidence: 90,
        reasoning: 'Trimming weekly Swiggy orders by 1 and shopping treats absorbs the entire ₹3,600 hike with zero deficit.',
        sourceTransactionIds: [],
        status: 'pending',
        actionType: 'budget_cut'
      },
      projectedForecast: generateSimForecast(currentBalance, settings.monthlyIncome, monthlyFixedObligations + 3600, monthlyDiscretionary, 90)
    },
    medical_emergency: {
      scenario: 'medical_emergency',
      title: 'Unplanned Medical Expense (₹80,000)',
      description: 'Simulates a sudden out-of-pocket hospital or dental emergency bill.',
      runwayMonths: parseFloat(((currentLiquidAssets - 80000) / totalMonthlyBurn).toFixed(1)),
      monthlyDeficit: 0,
      goalImpact: 'Depletes 88% of current emergency reserves; takes 4.2 months of savings to restore.',
      mitigatingMove: {
        id: 'sim-mitigate-medical',
        title: 'Direct Next 3 Months Surplus to Cushion',
        impactRupees: 80000,
        confidence: 92,
        reasoning: 'Re-routing your ₹28,000 monthly surplus fully restores the ₹80,000 emergency cushion by January 2027.',
        sourceTransactionIds: [],
        status: 'pending',
        actionType: 'rebalance_goal'
      },
      projectedForecast: generateSimForecast(currentBalance - 80000, settings.monthlyIncome, monthlyFixedObligations, monthlyDiscretionary, 90)
    },
    planned_purchase: {
      scenario: 'planned_purchase',
      title: 'Planned Gadget Purchase (₹1,20,000 in 4 Months)',
      description: 'Simulates purchasing a high-end laptop or equipment by saving ₹30,000/month.',
      runwayMonths: baseRunway,
      monthlyDeficit: 8000,
      goalImpact: 'Compresses monthly liquidity buffer to under ₹8,000, putting the 27th cash-flow in the Tight Zone.',
      mitigatingMove: {
        id: 'sim-mitigate-purchase',
        title: 'Extend Savings Window from 4 to 6 Months',
        impactRupees: 120000,
        confidence: 95,
        reasoning: 'Saving ₹20,000/month over 6 months keeps your checking account well within the Safe Zone every month.',
        sourceTransactionIds: [],
        status: 'pending',
        actionType: 'rebalance_goal'
      },
      projectedForecast: generateSimForecast(currentBalance, settings.monthlyIncome, monthlyFixedObligations + 30000, monthlyDiscretionary, 90)
    },
    salary_hike: {
      scenario: 'salary_hike',
      title: '20% Salary Increase (+₹17,000/mo)',
      description: 'Simulates annual promotion raising monthly net take-home to ₹1,02,000.',
      runwayMonths: parseFloat((currentLiquidAssets / (monthlyFixedObligations + monthlyDiscretionary)).toFixed(1)),
      monthlyDeficit: 0,
      goalImpact: 'Emergency Cushion fully funded 4.5 months ahead of schedule; Goa trip funded in full by November.',
      mitigatingMove: {
        id: 'sim-mitigate-salary',
        title: 'Auto-SIP 70% of Increment to Emergency Goal',
        impactRupees: 142800,
        confidence: 98,
        reasoning: 'Routing ₹12,000 of the raise directly into savings avoids lifestyle inflation and achieves financial independence milestones twice as fast.',
        sourceTransactionIds: [],
        status: 'pending',
        actionType: 'rebalance_goal'
      },
      projectedForecast: generateSimForecast(currentBalance, settings.monthlyIncome + 17000, monthlyFixedObligations, monthlyDiscretionary, 90)
    }
  };

  // ──────────────────────────────────────────
  // 4. REGRET ENGINE (Counterfactual Math - Zero Banned Words)
  // ──────────────────────────────────────────
  const categoryPastSpend: Record<string, number> = {};
  for (const t of transactions) {
    if (t.amount < 0 && t.category !== 'Income' && t.category !== 'Housing & Rent') {
      categoryPastSpend[t.category] = (categoryPastSpend[t.category] || 0) + Math.abs(t.amount);
    }
  }

  const regrets: Regret[] = [
    {
      category: 'Food & Dining',
      actualSpend: categoryPastSpend['Food & Dining'] || 46200,
      reductionPercentage: 20,
      counterfactualSpend: Math.round((categoryPastSpend['Food & Dining'] || 46200) * 0.8),
      recoverableAmount: Math.round((categoryPastSpend['Food & Dining'] || 46200) * 0.2),
      narrative: 'If you had trimmed takeout delivery orders by 20% over the past 6 months, you would have an extra ₹9,240 ready to deploy.',
      impactContext: 'That covers 61% of your Year-End Goa Trip target.'
    },
    {
      category: 'Shopping & Gadgets',
      actualSpend: categoryPastSpend['Shopping & Gadgets'] || 45750,
      reductionPercentage: 15,
      counterfactualSpend: Math.round((categoryPastSpend['Shopping & Gadgets'] || 45750) * 0.85),
      recoverableAmount: Math.round((categoryPastSpend['Shopping & Gadgets'] || 45750) * 0.15),
      narrative: 'If you had paced impulse gadget purchases by 15%, you would have retained ₹6,860 in your reserve account.',
      impactContext: 'That provides an additional 1.2 weeks of essential living expenses.'
    },
    {
      category: 'Subscriptions',
      actualSpend: categoryPastSpend['Subscriptions'] || 7340,
      reductionPercentage: 25,
      counterfactualSpend: Math.round((categoryPastSpend['Subscriptions'] || 7340) * 0.75),
      recoverableAmount: Math.round((categoryPastSpend['Subscriptions'] || 7340) * 0.25),
      narrative: 'If you had pruned dormant streaming and digital services, you would have unlocked ₹1,835 in ongoing liquidity.',
      impactContext: 'Zero lifestyle compromise with immediate positive cash flow.'
    },
    {
      category: 'Entertainment',
      actualSpend: categoryPastSpend['Entertainment'] || 5700,
      reductionPercentage: 20,
      counterfactualSpend: Math.round((categoryPastSpend['Entertainment'] || 5700) * 0.8),
      recoverableAmount: Math.round((categoryPastSpend['Entertainment'] || 5700) * 0.2),
      narrative: 'If you had organized cinema outings slightly more intentionally, you would have retained ₹1,140 in cash cushion.',
      impactContext: 'Helps keep your month-end checking balance securely in the Safe zone.'
    }
  ];

  // ──────────────────────────────────────────
  // 5. MONTHLY SUMMARY & BUDGETS VS ACTUAL
  // ──────────────────────────────────────────
  const currentMonth = '2026-09';
  const monthTxns = transactions.filter(t => t.date.startsWith(currentMonth));
  
  let monthIncome = 0;
  let monthExpense = 0;
  const monthCategorySpends: Record<string, number> = {};

  for (const t of monthTxns) {
    if (t.amount > 0) {
      monthIncome += t.amount;
    } else {
      const spend = Math.abs(t.amount);
      monthExpense += spend;
      monthCategorySpends[t.category] = (monthCategorySpends[t.category] || 0) + spend;
    }
  }

  const topCategories = Object.entries(monthCategorySpends)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: monthExpense > 0 ? Math.round((amt / monthExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const budgetStatus = budgets.map(b => {
    const actual = monthCategorySpends[b.category] || 0;
    const percentage = Math.round((actual / (b.monthlyLimit || 1)) * 100);
    let status: 'under' | 'near' | 'over' = 'under';
    if (percentage > 100) status = 'over';
    else if (percentage >= 85) status = 'near';

    return {
      category: b.category,
      limit: b.monthlyLimit,
      actual,
      status,
      percentage
    };
  });

  const actionItems = [
    {
      id: 'act-1',
      title: 'Action Disney+ Hotstar Subscription',
      description: 'Cancel before next renewal cycle to retain ₹7,788 annual surplus.',
      impact: '₹7,788/year',
      targetRoute: '/',
      moveId: 'move-cancel-hotstar'
    },
    {
      id: 'act-2',
      title: 'Buffer the 27th Payment Collision',
      description: 'Ensure at least ₹22,000 checking balance ahead of October 27th debits.',
      impact: 'Avoid Tight Zone',
      targetRoute: '/forecast'
    },
    {
      id: 'act-3',
      title: 'Allocate September Surplus to Emergency Cushion',
      description: `Your September net surplus is ${formatCurrency(monthIncome - monthExpense)}. Direct ₹25,000 to reach 75% goal funding.`,
      impact: '+₹25,000 to goal',
      targetRoute: '/goals',
      goalId: 'goal-emergency-fund'
    }
  ];

  const monthlySummary: MonthlySummary = {
    month: currentMonth,
    income: monthIncome || 85000,
    expense: monthExpense || 34298,
    net: (monthIncome || 85000) - (monthExpense || 34298),
    topCategories,
    budgetStatus,
    actionItems
  };

  const overallHealthScore = Math.min(
    100,
    Math.max(
      35,
      Math.round(
        (baseRunway / 6) * 40 + // 40 pts for runway up to 6 months
        (monthlySummary.net > 20000 ? 30 : (monthlySummary.net / 20000) * 30) + // 30 pts for savings rate
        (budgetStatus.filter(b => b.status === 'under').length / (budgets.length || 1)) * 30 // 30 pts for budget adherence
      )
    )
  );

  return {
    theOneMove,
    nextMoves,
    forecast,
    pinnedDipPoint,
    simResults,
    regrets,
    monthlySummary,
    overallHealthScore,
    estimatedRunwayMonths: baseRunway
  };
}

function generateSimForecast(
  startBalance: number,
  monthlyIncome: number,
  monthlyFixed: number,
  monthlyDiscretionary: number,
  days: number
): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const start = new Date('2026-09-20T00:00:00');
  let balance = startBalance;
  const dailyDiscretionary = monthlyDiscretionary / 30;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const day = d.getDate();

    if (day === 1 && monthlyIncome > 0) {
      balance += monthlyIncome;
    }
    if (day === 3) {
      balance -= monthlyFixed * 0.75;
    }
    if (day === 15) {
      balance -= monthlyFixed * 0.25;
    }
    balance -= dailyDiscretionary;

    let zone: 'safe' | 'tight' | 'danger' = 'safe';
    if (balance < 5000) zone = 'danger';
    else if (balance < 15000) zone = 'tight';

    points.push({
      date: dateStr,
      projectedBalance: Math.round(balance),
      zone
    });
  }

  return points;
}
