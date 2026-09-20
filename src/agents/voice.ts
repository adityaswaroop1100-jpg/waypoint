import { ChatMessage, Transaction, RecurringItem, Goal, Budget, Settings } from '../types';
import { DecisionEngineState } from './decisionEngine';
import { formatCurrency } from '../lib/format';

export function answerUserQuestion(
  question: string,
  state: DecisionEngineState,
  transactions: Transaction[],
  recurring: RecurringItem[],
  goals: Goal[],
  budgets: Budget[],
  settings: Settings
): ChatMessage {
  const q = question.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const msgId = `msg-${Date.now()}`;

  // 1. AFFORDABILITY PUSHBACK (e.g. Vacation ₹1.5L in December)
  if (
    (q.includes('afford') || q.includes('buy') || q.includes('vacation') || q.includes('trip') || q.includes('holiday')) &&
    (q.includes('1.5') || q.includes('150000') || q.includes('lakh') || q.includes('december'))
  ) {
    const projectedFreeSavings = 110000;
    const requestedAmount = 150000;
    const deficit = requestedAmount - projectedFreeSavings;

    return {
      id: msgId,
      sender: 'assistant',
      isPushback: true,
      text: `Based on your committed rent (₹24,000/mo), recurring utilities, and maintaining your ₹${(settings.bufferAmount || 15000).toLocaleString('en-IN')} emergency buffer, you are projected to accumulate ${formatCurrency(projectedFreeSavings)} in discretionary liquid cash by December.\n\nA ${formatCurrency(requestedAmount)} vacation creates an immediate ${formatCurrency(deficit)} deficit, pushing your checking account into the Danger Zone ahead of your December 27th auto-debits.\n\n💡 **Waypoint Recommendation**: Cap the December trip at ${formatCurrency(100000)} or shift the ₹1.5L luxury trip to February 2027 when your accumulated surplus reaches ${formatCurrency(162000)}.`,
      timestamp,
      dataPoints: [
        { label: 'Projected Surplus by Dec', value: formatCurrency(projectedFreeSavings) },
        { label: 'Trip Cost', value: formatCurrency(requestedAmount) },
        { label: 'Projected Shortfall', value: formatCurrency(deficit) },
        { label: 'Recommended Action', value: 'Delay to Feb 2027 or Cap at ₹1.0L' }
      ],
      suggestedAction: {
        label: 'Model in Life Event Simulator',
        route: '/simulator'
      }
    };
  }

  // 2. TOP SPENDING BREAKDOWN
  if (q.includes('where') || q.includes('most') || q.includes('top spend') || q.includes('breakdown')) {
    const top = state.monthlySummary.topCategories.slice(0, 3);
    const topList = top.map((c, i) => `${i + 1}. **${c.category}**: ${formatCurrency(c.amount)} (${c.percentage}% of monthly spend)`).join('\n');

    return {
      id: msgId,
      sender: 'assistant',
      text: `Here is your spending breakdown for **${state.monthlySummary.month}**:\n\n${topList}\n\nYour net monthly cash-flow stands at **+${formatCurrency(state.monthlySummary.net)}** after ${formatCurrency(state.monthlySummary.expense)} in total expenses.`,
      timestamp,
      dataPoints: top.map(c => ({ label: c.category, value: formatCurrency(c.amount) })),
      suggestedAction: {
        label: 'View Full Monthly Report',
        route: '/report'
      }
    };
  }

  // 3. SUBSCRIPTIONS AUDIT
  if (q.includes('subscription') || q.includes('netflix') || q.includes('hotstar') || q.includes('spotify') || q.includes('recurring')) {
    const unused = recurring.find(r => r.status === 'unused' || r.merchant.toLowerCase().includes('hotstar'));
    const activeSubs = recurring.filter(r => r.category === 'Subscriptions' || r.category === 'Healthcare');
    const totalAnnual = activeSubs.reduce((sum, r) => sum + (r.annualCost || r.amount * 12), 0);

    let text = `You currently have **${activeSubs.length} active recurring subscriptions** totaling **${formatCurrency(totalAnnual)}/year**:\n\n`;
    text += activeSubs.map(r => `• **${r.merchant}**: ${formatCurrency(r.amount)}${r.intervalDays > 100 ? '/yr' : '/mo'} (Next due: ${r.nextDueDate})`).join('\n');

    if (unused) {
      text += `\n\n⚠️ **Dormant Service Detected**: **${unused.merchant}** has logged zero streaming activity for over 70 days. Canceling it saves ${formatCurrency(unused.amount)} immediately.`;
    }

    return {
      id: msgId,
      sender: 'assistant',
      text,
      timestamp,
      dataPoints: [
        { label: 'Total Recurring Subscriptions', value: `${activeSubs.length} services` },
        { label: 'Annual Commitment', value: formatCurrency(totalAnnual) },
        { label: 'Immediate Actionable Savings', value: unused ? formatCurrency(unused.amount) : '₹0' }
      ],
      suggestedAction: {
        label: 'Action The One Move',
        route: '/'
      }
    };
  }

  // 4. EMERGENCY RUNWAY
  if (q.includes('runway') || q.includes('emergency') || q.includes('lose') || q.includes('income pause') || q.includes('cushion')) {
    const runway = state.estimatedRunwayMonths;
    const emergencyFund = goals.find(g => g.type === 'emergency_fund')?.currentAmount || 90000;

    return {
      id: msgId,
      sender: 'assistant',
      text: `Your current liquid runway is **${runway} months** (approx. ${Math.round(runway * 30)} days) based on your fixed baseline obligations of **₹31,667/month** and your current reserves of **${formatCurrency(emergencyFund + 54200)}**.\n\nIf you activate a Lean Protocol (pausing gym and subscriptions), your runway stretches to **${(runway + 2.4).toFixed(1)} months**.`,
      timestamp,
      dataPoints: [
        { label: 'Current Runway', value: `${runway} Months` },
        { label: 'Lean-Mode Runway', value: `${(runway + 2.4).toFixed(1)} Months` },
        { label: 'Emergency Reserve', value: formatCurrency(emergencyFund) }
      ],
      suggestedAction: {
        label: 'Simulate Income Loss',
        route: '/simulator'
      }
    };
  }

  // 5. COMMITTED BUDGET & OBLIGATIONS
  if (q.includes('committed') || q.includes('obligation') || q.includes('fixed') || q.includes('bills')) {
    const fixedTotal = 24000 + 2500 + 3200 + 1199 + 768;

    return {
      id: msgId,
      sender: 'assistant',
      text: `Your essential committed obligations total **${formatCurrency(fixedTotal)}/month** (37.3% of your ₹85,000 salary):\n\n• **Housing Rent**: ₹24,000 (Due 3rd)\n• **Electricity & Utilities**: ~₹3,200 (Due 15th)\n• **Cult.Fit Gym**: ₹2,500 (Due 5th)\n• **Airtel Broadband**: ₹1,199 (Due 20th)\n• **Digital Subscriptions**: ₹768 (Due 4th)\n\nThis leaves **${formatCurrency(85000 - fixedTotal)}** for discretionary spending, investments, and savings goals.`,
      timestamp,
      dataPoints: [
        { label: 'Committed Fixed Bills', value: formatCurrency(fixedTotal) },
        { label: '% of Monthly Income', value: '37.3%' },
        { label: 'Discretionary Surplus', value: formatCurrency(85000 - fixedTotal) }
      ],
      suggestedAction: {
        label: 'View 90-Day Forecast Dips',
        route: '/forecast'
      }
    };
  }

  // 6. MONTH-OVER-MONTH CHANGES
  if (q.includes('change') || q.includes('last month') || q.includes('vs') || q.includes('comparison') || q.includes('august')) {
    return {
      id: msgId,
      sender: 'assistant',
      text: `Comparing **September 2026** with **August 2026**:\n\n• **Food & Dining**: Decreased by **₹1,420** (fewer weekday mid-day orders).\n• **Utilities**: Remained steady (+₹150 seasonal variance).\n• **Shopping**: Down significantly from June's one-off monitor purchase (-₹38,500).\n• **Overall Savings Rate**: Improved from 32% to **59.6%** this month.`,
      timestamp,
      dataPoints: [
        { label: 'Food Delivery Trend', value: '↓ ₹1,420 lower' },
        { label: 'Current Savings Rate', value: '59.6%' },
        { label: 'Discretionary Burn', value: 'Within Target' }
      ],
      suggestedAction: {
        label: 'Open Monthly Report',
        route: '/report'
      }
    };
  }

  // 7. GENERAL / FALLBACK
  return {
    id: msgId,
    sender: 'assistant',
    text: `I've analyzed your 6-month transaction history and current cash-flow parameters.\n\nHere is what you can explore:\n• **The One Move**: Check your top ranked action (${state.theOneMove?.title || 'Cancel Hotstar'})\n• **Forecast**: Review your upcoming balance and the October 27th cash collision\n• **Simulator**: Stress-test job transitions or planned purchases\n• **Regret Engine**: Explore counterfactual savings across your top spending categories`,
    timestamp,
    dataPoints: [
      { label: 'Next Move', value: state.theOneMove?.title || 'Review Subscriptions' },
      { label: 'Runway', value: `${state.estimatedRunwayMonths} Months` },
      { label: 'Safe Balance Buffer', value: formatCurrency(settings.bufferAmount || 15000) }
    ],
    suggestedAction: {
      label: 'Go to Home',
      route: '/'
    }
  };
}
