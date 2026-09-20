import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { MonthlySummary, Budget, Transaction } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatTile } from '../ui/StatTile';
import { formatCurrency, formatPercentage } from '../../lib/format';
import { MonthlyTrendsChart } from './MonthlyTrendsChart';

interface ReportViewsProps {
  summary: MonthlySummary;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  availableMonths: string[];
  allTransactions?: Transaction[];
}

export const ReportViews: React.FC<ReportViewsProps> = ({
  summary,
  selectedMonth,
  onSelectMonth,
  availableMonths,
  allTransactions
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyText = () => {
    const text = `WAYPOINT MONTHLY REPORT — ${summary.month}
──────────────────────────────────────
• Income: ${formatCurrency(summary.income)}
• Total Expenses: ${formatCurrency(summary.expense)}
• Net Surplus: ${formatCurrency(summary.net)}

TOP SPENDING CATEGORIES:
${summary.topCategories.map((c) => `  - ${c.category}: ${formatCurrency(c.amount)} (${c.percentage}%)`).join('\n')}

BUDGET VS ACTUAL:
${summary.budgetStatus.map((b) => `  - ${b.category}: ${formatCurrency(b.actual)} / ${formatCurrency(b.limit)} [${b.status.toUpperCase()}]`).join('\n')}

ACTION ITEMS:
${summary.actionItems.map((a, i) => `  ${i + 1}. ${a.title}: ${a.description}`).join('\n')}
──────────────────────────────────────
Generated deterministically by Waypoint.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Month Selector & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyText}
          icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? 'Copied Summary to Clipboard' : 'Export Text Summary'}
        </Button>
      </div>

      {/* Multi-Month Trend Chart */}
      {allTransactions && allTransactions.length > 0 && (
        <MonthlyTrendsChart
          transactions={allTransactions}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
      )}

      {/* KPI Tiles: Income, Expense, Net */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Total Inflows"
          value={formatCurrency(summary.income)}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          trend="up"
          trendText="Verified Regular"
          subValue="Salary & credits"
        />
        <StatTile
          label="Total Expenses"
          value={formatCurrency(summary.expense)}
          icon={<TrendingDown className="w-5 h-5 text-rose-600" />}
          trend="neutral"
          trendText={`${summary.topCategories.length} categories`}
          subValue="Fixed & discretionary"
        />
        <StatTile
          label="Net Savings / Cash Flow"
          value={formatCurrency(summary.net)}
          icon={<Scale className="w-5 h-5 text-indigo-600" />}
          trend={summary.net >= 0 ? 'up' : 'down'}
          trendText={summary.net >= 0 ? 'Surplus' : 'Deficit'}
          subValue={summary.income > 0 ? `${formatPercentage((summary.net / summary.income) * 100)} savings rate` : ''}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Categories */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Top Spending Categories</h3>
            <span className="text-xs text-slate-400">Ranked by volume</span>
          </div>

          <div className="space-y-3">
            {summary.topCategories.slice(0, 5).map((c, i) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    {c.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 tabular-nums">{formatCurrency(c.amount)}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({c.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, c.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Budgets vs Actual Table */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Budget vs. Actual Status</h3>
            <span className="text-xs text-slate-400">Monthly limits</span>
          </div>

          <div className="space-y-3">
            {summary.budgetStatus.map((b) => {
              let statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  UNDER
                </span>
              );
              let barColor = 'bg-emerald-500';

              if (b.status === 'over') {
                statusBadge = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    OVER LIMIT
                  </span>
                );
                barColor = 'bg-rose-500';
              } else if (b.status === 'near') {
                statusBadge = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    NEAR LIMIT
                  </span>
                );
                barColor = 'bg-amber-500';
              }

              return (
                <div key={b.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{b.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums">
                        {formatCurrency(b.actual)} / {formatCurrency(b.limit)}
                      </span>
                      {statusBadge}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${barColor} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 3 Auto-Generated Action Items */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg space-y-4">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            3 High-ROI Action Items for {summary.month}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {summary.actionItems.map((act) => (
            <div
              key={act.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  {act.impact}
                </span>
                <h4 className="text-sm font-bold text-white mb-1">{act.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{act.description}</p>
              </div>

              <button
                onClick={() => navigate(act.targetRoute)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition-colors"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
