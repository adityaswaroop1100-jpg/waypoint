import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Transaction } from '../../types';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/format';

interface MonthlyTrendsChartProps {
  transactions: Transaction[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({
  transactions,
  selectedMonth,
  onSelectMonth
}) => {
  const trendData = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((tx) => {
      const m = tx.date.slice(0, 7);
      if (!monthMap.has(m)) {
        monthMap.set(m, { income: 0, expense: 0 });
      }
      const entry = monthMap.get(m)!;
      if (tx.amount > 0) {
        entry.income += tx.amount;
      } else {
        entry.expense += Math.abs(tx.amount);
      }
    });

    const sortedMonths = Array.from(monthMap.keys()).sort();

    return sortedMonths.map((month) => {
      const data = monthMap.get(month)!;
      const net = data.income - data.expense;
      return {
        month,
        income: data.income,
        expense: data.expense,
        net
      };
    });
  }, [transactions]);

  if (trendData.length <= 1) return null;

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Multi-Month Income vs. Expense Trend</h3>
          <p className="text-xs text-slate-500">Track and compare your financial performance across all recorded months</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg w-fit">
          {trendData.length} Months Tracked
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activeLabel) {
                onSelectMonth(state.activeLabel);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)),
                name === 'income' ? 'Income' : name === 'expense' ? 'Expenses' : 'Net Surplus'
              ]}
              labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E2E8F0',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              formatter={(value) => (value === 'income' ? 'Total Income' : 'Total Expense')}
            />
            <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
        <span className="italic text-[11px]">Click on any month bar in the chart to inspect that month's full breakdown</span>
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Inflows
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Outflows
          </span>
        </div>
      </div>
    </Card>
  );
};
