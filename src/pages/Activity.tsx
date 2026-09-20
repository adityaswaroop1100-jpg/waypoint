import React from 'react';
import { Receipt, Sparkles } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { ActivityTable } from '../components/activity/ActivityTable';

export const Activity: React.FC = () => {
  const transactions = useWaypointStore((s) => s.transactions);
  const updateCategory = useWaypointStore((s) => s.updateCategory);
  const addTransaction = useWaypointStore((s) => s.addTransaction);
  const deleteTransaction = useWaypointStore((s) => s.deleteTransaction);
  const patterns = useWaypointStore((s) => s.getPatterns());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-indigo-600" />
          Transaction Activity Ledger & Real-Time Tracker
        </h2>
        <p className="text-xs text-slate-500">
          Track and manage your finances in real-time. Add manual transactions, delete entries, or upload bank statements. Inline category edits are remembered across all future analysis.
        </p>
      </div>

      <ActivityTable
        transactions={transactions}
        anomalies={patterns.anomalies}
        onUpdateCategory={updateCategory}
        onAddTransaction={addTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    </div>
  );
};
