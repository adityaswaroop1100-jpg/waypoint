import React from 'react';
import { Receipt, Sparkles } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { ActivityTable } from '../components/activity/ActivityTable';

export const Activity: React.FC = () => {
  const transactions = useWaypointStore((s) => s.transactions);
  const updateCategory = useWaypointStore((s) => s.updateCategory);
  const patterns = useWaypointStore((s) => s.getPatterns());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-indigo-600" />
          Transaction Activity Ledger
        </h2>
        <p className="text-xs text-slate-500">
          Browse your complete 6-month transaction history. Inline category corrections are saved locally and applied to all future analyses.
        </p>
      </div>

      <ActivityTable
        transactions={transactions}
        anomalies={patterns.anomalies}
        onUpdateCategory={updateCategory}
      />
    </div>
  );
};
