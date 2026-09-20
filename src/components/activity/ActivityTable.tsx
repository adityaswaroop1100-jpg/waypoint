import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Transaction, Anomaly } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../lib/format';
import { Badge } from '../ui/Badge';

interface ActivityTableProps {
  transactions: Transaction[];
  anomalies: Anomaly[];
  onUpdateCategory: (transactionId: string, merchant: string, newCategory: string) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  transactions,
  anomalies,
  onUpdateCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [sortAsc, setSortAsc] = useState(false);

  // Available months in dataset
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((t) => months.add(t.date.slice(0, 7)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Quick lookup for anomalies by transaction ID
  const anomalyMap = useMemo(() => {
    const map = new Map<string, Anomaly>();
    anomalies.forEach((a) => map.set(a.transactionId, a));
    return map;
  }, [anomalies]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
        const matchesMonth = selectedMonth === 'ALL' || t.date.startsWith(selectedMonth);

        return matchesSearch && matchesCat && matchesMonth;
      })
      .sort((a, b) => {
        return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      });
  }, [transactions, searchTerm, selectedCategory, selectedMonth, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, notes, category…"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Months ({availableMonths.length})</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Oldest' : 'Newest'}</span>
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant & Description</th>
                <th className="py-3 px-4">Category (Editable Memory)</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isIncome = tx.amount > 0;
                  const anomaly = anomalyMap.get(tx.id);

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        anomaly ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Merchant */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{tx.merchant}</span>
                          {anomaly && (
                            <div
                              className="group relative inline-flex items-center"
                              title={anomaly.explanation}
                            >
                              <Badge variant="warning" size="sm" icon={<AlertOctagon className="w-3 h-3" />}>
                                Z-Score Anomaly
                              </Badge>
                              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 z-20 w-64 p-2 bg-slate-900 text-white rounded-xl text-[11px] shadow-lg leading-tight pointer-events-none">
                                {anomaly.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                        {tx.notes && (
                          <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                            {tx.notes}
                          </span>
                        )}
                      </td>

                      {/* Category with Inline Correction Memory */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={tx.category}
                            onChange={(e) => onUpdateCategory(tx.id, tx.merchant, e.target.value)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Edit category (automatically updates correction memory across all future imports)"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {tx.corrected && (
                            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100" title="Correction memory active">
                              Override
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tx.source}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-bold text-sm tabular-nums ${
                            isIncome ? 'text-emerald-600 font-extrabold' : 'text-slate-900'
                          }`}
                        >
                          {formatCurrency(tx.amount, '₹', true)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
            <strong className="text-slate-800">{transactions.length}</strong> transactions
          </span>
          <span className="text-[11px] text-slate-400 italic">
            Inline category edits persist automatically into LocalStorage correction memory
          </span>
        </div>
      </div>
    </div>
  );
};
