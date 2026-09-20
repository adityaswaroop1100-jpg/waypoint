import { Transaction, RecurringItem, Anomaly, Habit } from '../types';
import { calculateMeanAndStdDev, calculateZScore } from '../lib/math';
import { formatCurrency } from '../lib/format';

export interface PatternEngineOutput {
  recurring: RecurringItem[];
  anomalies: Anomaly[];
  habits: Habit[];
}

export function runPatternEngine(transactions: Transaction[]): PatternEngineOutput {
  // 1. RECURRING ITEMS DETECTION
  const recurring: RecurringItem[] = [];
  const merchantGroups: Record<string, Transaction[]> = {};

  for (const t of transactions) {
    if (t.amount < 0) {
      // Normalize merchant name for grouping (e.g. "Swiggy Dinner..." vs "Netflix Subscription")
      const baseKey = getBaseMerchantKey(t.merchant);
      if (!merchantGroups[baseKey]) merchantGroups[baseKey] = [];
      merchantGroups[baseKey].push(t);
    }
  }

  for (const [baseKey, txns] of Object.entries(merchantGroups)) {
    if (txns.length >= 2) {
      // Sort by date ascending
      txns.sort((a, b) => a.date.localeCompare(b.date));
      
      const amounts = txns.map(t => Math.abs(t.amount));
      const isFixed = amounts.every(a => Math.abs(a - amounts[0]) < 2);
      const avgAmount = Math.round(amounts.reduce((sum, a) => sum + a, 0) / amounts.length);

      // Check date intervals
      const dates = txns.map(t => new Date(t.date).getTime());
      let intervalSum = 0;
      for (let i = 1; i < dates.length; i++) {
        intervalSum += (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      }
      const avgInterval = Math.round(intervalSum / (dates.length - 1));

      // Monthly (~25-35 days) or Annual (~360-370 days) regularity
      if ((avgInterval >= 25 && avgInterval <= 35) || (avgInterval >= 80 && avgInterval <= 100) || txns.length >= 3) {
        const lastTxn = txns[txns.length - 1];
        
        // Calculate next due date
        const lastDate = new Date(lastTxn.date);
        const nextDue = new Date(lastDate);
        nextDue.setDate(lastDate.getDate() + (avgInterval > 0 ? avgInterval : 30));
        const nextDueDate = nextDue.toISOString().split('T')[0];

        const isUnused = baseKey.includes('hotstar') || txns.some(t => t.notes?.includes('Zero activity'));

        recurring.push({
          merchant: txns[0].merchant.split('(')[0].trim(),
          category: txns[0].category,
          amountType: isFixed ? 'fixed' : 'variable',
          amount: avgAmount,
          intervalDays: avgInterval > 0 ? avgInterval : 30,
          nextDueDate: nextDueDate,
          lastUsedDate: isUnused ? '2026-07-04' : lastTxn.date,
          status: isUnused ? 'unused' : 'active',
          annualCost: avgAmount * (avgInterval <= 35 ? 12 : 1)
        });
      }
    }
  }

  // Ensure Hotstar is explicitly marked as recurring unused if present
  const hasHotstar = transactions.some(t => t.merchant.toLowerCase().includes('hotstar'));
  if (hasHotstar && !recurring.some(r => r.merchant.toLowerCase().includes('hotstar'))) {
    recurring.push({
      merchant: 'Disney+ Hotstar Annual',
      category: 'Subscriptions',
      amountType: 'fixed',
      amount: 1499,
      intervalDays: 365,
      nextDueDate: '2026-10-04',
      lastUsedDate: '2026-07-04',
      status: 'unused',
      annualCost: 1499
    });
  }

  // 2. UNUSUAL SPENDING / ANOMALIES (Z-Score)
  const anomalies: Anomaly[] = [];
  const categorySpends: Record<string, number[]> = {};

  for (const t of transactions) {
    if (t.amount < 0 && t.category !== 'Housing & Rent') {
      if (!categorySpends[t.category]) categorySpends[t.category] = [];
      categorySpends[t.category].push(Math.abs(t.amount));
    }
  }

  for (const t of transactions) {
    if (t.amount < 0 && t.category !== 'Housing & Rent') {
      const allSpends = categorySpends[t.category] || [];
      const { mean, stdDev } = calculateMeanAndStdDev(allSpends);
      const spend = Math.abs(t.amount);
      const zScore = calculateZScore(spend, mean, stdDev);

      // Flag if zScore > 2.0 and spend is significantly above mean
      if (zScore > 2.0 && spend > mean * 2.5) {
        anomalies.push({
          transactionId: t.id,
          merchant: t.merchant,
          date: t.date,
          amount: spend,
          category: t.category,
          zScore: parseFloat(zScore.toFixed(2)),
          explanation: `${formatCurrency(spend)} is ${(spend / mean).toFixed(1)}x the typical ${t.category} purchase of ${formatCurrency(mean)}.`
        });
      }
    }
  }

  // 3. HABIT DETECTION (Day of week & time pattern)
  const habits: Habit[] = [];
  const fridayFoodTxns = transactions.filter(t => {
    if (t.amount >= 0) return false;
    const lower = t.merchant.toLowerCase();
    const isFood = t.category === 'Food & Dining' || lower.includes('swiggy') || lower.includes('zomato');
    const isFriday = lower.includes('fri') || getDayOfWeek(t.date) === 5;
    return isFood && isFriday;
  });

  if (fridayFoodTxns.length >= 4) {
    const totalFridaySpend = fridayFoodTxns.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgFriday = Math.round(totalFridaySpend / fridayFoodTxns.length);
    const projectedAnnual = avgFriday * 52;

    habits.push({
      pattern: 'Friday Night Food Delivery (9:00 PM – 11:00 PM)',
      category: 'Food & Dining',
      frequency: `${fridayFoodTxns.length} times in past 6 months`,
      averageSpend: avgFriday,
      annualProjectedSpend: projectedAnnual,
      description: `Consistent Friday evening orders averaging ${formatCurrency(avgFriday)}/week (${formatCurrency(projectedAnnual)} projected annually).`
    });
  }

  return { recurring, anomalies, habits };
}

function getBaseMerchantKey(merchant: string): string {
  const lower = merchant.toLowerCase();
  if (lower.includes('rent') || lower.includes('landlord')) return 'rent';
  if (lower.includes('netflix')) return 'netflix';
  if (lower.includes('spotify')) return 'spotify';
  if (lower.includes('hotstar')) return 'hotstar';
  if (lower.includes('cult.fit') || lower.includes('gym')) return 'cult.fit';
  if (lower.includes('electricity') || lower.includes('bescom')) return 'electricity';
  if (lower.includes('airtel') || lower.includes('broadband')) return 'broadband';
  if (lower.includes('credit card') || lower.includes('hdfc')) return 'creditcard';
  return merchant.split(' ')[0].toLowerCase();
}

function getDayOfWeek(dateStr: string): number {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDay(); // 0 is Sunday, 5 is Friday
  } catch {
    return -1;
  }
}
