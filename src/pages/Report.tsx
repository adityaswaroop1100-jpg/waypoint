import React, { useState, useMemo } from 'react';
import { FileBarChart, Sparkles } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { ReportViews } from '../components/report/ReportViews';
import { calculateMonthlyStats } from '../lib/math';
import { MonthlySummary } from '../types';

export const Report: React.FC = () => {
  const transactions = useWaypointStore((s) => s.transactions);
  const budgets = useWaypointStore((s) => s.budgets);
  const baseDecision = useWaypointStore((s) => s.getDecisionState());

  // Available months
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((t) => months.add(t.date.slice(0, 7)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || '2026-09');

  // Compute stats dynamically for selected month
  const monthlySummary: MonthlySummary = useMemo(() => {
    if (selectedMonth === '2026-09') {
      return baseDecision.monthlySummary;
    }

    const stats = calculateMonthlyStats(transactions, selectedMonth);
    const monthTxns = transactions.filter((t) => t.date.startsWith(selectedMonth));
    const monthCategorySpends: Record<string, number> = {};
    for (const t of monthTxns) {
      if (t.amount < 0) {
        monthCategorySpends[t.category] = (monthCategorySpends[t.category] || 0) + Math.abs(t.amount);
      }
    }

    const budgetStatus = budgets.map((b) => {
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

    return {
      month: selectedMonth,
      income: stats.income || 85000,
      expense: stats.expense,
      net: (stats.income || 85000) - stats.expense,
      topCategories: stats.topCategories,
      budgetStatus,
      actionItems: baseDecision.monthlySummary.actionItems
    };
  }, [selectedMonth, transactions, budgets, baseDecision]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-indigo-600" />
          Monthly Cash-Flow Summary & Budgets vs. Actual
        </h2>
        <p className="text-xs text-slate-500">
          Deterministic breakdown of all historical months, spending distributions, and budget adherence.
        </p>
      </div>

      <ReportViews
        summary={monthlySummary}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        availableMonths={availableMonths}
        allTransactions={transactions}
      />
    </div>
  );
};
