import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { SettingsView } from '../components/settings/SettingsView';

export const SettingsPage: React.FC = () => {
  const settings = useWaypointStore((s) => s.settings);
  const updateSettings = useWaypointStore((s) => s.updateSettings);
  const resetDemo = useWaypointStore((s) => s.resetDemo);
  const clearAllTransactions = useWaypointStore((s) => s.clearAllTransactions);
  const categoryOverrides = useWaypointStore((s) => s.categoryOverrides);
  const patterns = useWaypointStore((s) => s.getPatterns());
  const decision = useWaypointStore((s) => s.getDecisionState());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500">
          Configure your financial baseline, monthly income, safety buffer levels, and manage your ledger data.
        </p>
      </div>

      <SettingsView
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetDemo={resetDemo}
        onClearData={clearAllTransactions}
        debugState={{
          recurring: patterns.recurring,
          anomalies: patterns.anomalies,
          habits: patterns.habits,
          theOneMove: decision.theOneMove,
          nextMoves: decision.nextMoves,
          forecastSample: decision.forecast.slice(0, 10),
          categoryOverrides
        }}
      />
    </div>
  );
};
