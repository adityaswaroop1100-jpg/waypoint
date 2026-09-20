import React from 'react';
import { useLocation } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Wallet } from 'lucide-react';
import { useWaypointStore } from '../../store/useWaypointStore';
import { formatCurrency } from '../../lib/format';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const resetDemo = useWaypointStore((s) => s.resetDemo);
  const currentBalance = useWaypointStore((s) => s.currentBalance);
  const decision = useWaypointStore((s) => s.getDecisionState());
  const runway = decision.estimatedRunwayMonths;

  const pageTitles: Record<string, string> = {
    '/': 'Home — The One Move',
    '/forecast': '90-Day Financial Weather Forecast',
    '/simulator': 'Life Event Simulator',
    '/regret': 'Regret Engine',
    '/ask': 'Pushback Copilot',
    '/report': 'Monthly Cash-Flow Report',
    '/goals': 'Goals & Budget Limits',
    '/activity': 'Transaction Activity Ledger',
    '/upload': 'Statement Upload',
    '/settings': 'Settings & Preferences',
  };

  const currentTitle = pageTitles[location.pathname] || 'Waypoint';

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{currentTitle}</h1>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Balance & Runway Pill */}
        <div className="flex items-center gap-3 bg-slate-100/90 px-3.5 py-1.5 rounded-2xl border border-slate-200/70 text-xs">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 hidden sm:inline">Checking:</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(currentBalance)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500 hidden sm:inline">Runway:</span>
            <span className="font-bold text-emerald-700">{runway} mo</span>
          </div>
        </div>

        {/* Quick Reset State Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset application data to initial baseline state?')) {
              resetDemo();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors focus:ring-2 focus:ring-slate-400"
          title="Reset to initial baseline state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Reset State</span>
        </button>
      </div>
    </header>
  );
};

