import { Transaction, Move } from '../types';

export function calculateMeanAndStdDev(values: number[]): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 };
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (values.length === 1) return { mean, stdDev: 0 };
  
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
}

export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

export function rankMoveScore(move: Move): number {
  const effort = move.effortWeight || 1;
  const confidenceFactor = (move.confidence || 90) / 100;
  // ranking score = impactRupees * (confidence / 100) * (1 / effortWeight)
  return Math.round(move.impactRupees * confidenceFactor * (1 / effort));
}

export function sortMovesByPriority(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => rankMoveScore(b) - rankMoveScore(a));
}

export function calculateMonthlyStats(transactions: Transaction[], targetMonth: string) {
  const monthTxns = transactions.filter(t => t.date.startsWith(targetMonth));
  
  let income = 0;
  let expense = 0;
  const categoryTotals: Record<string, number> = {};

  for (const t of monthTxns) {
    if (t.amount > 0) {
      income += t.amount;
    } else {
      const positiveSpend = Math.abs(t.amount);
      expense += positiveSpend;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + positiveSpend;
    }
  }

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: expense > 0 ? (amount / expense) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    month: targetMonth,
    income,
    expense,
    net: income - expense,
    topCategories
  };
}
