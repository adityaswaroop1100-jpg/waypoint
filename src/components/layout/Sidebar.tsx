import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  Sliders,
  History,
  MessageSquareText,
  FileBarChart,
  Target,
  Receipt,
  Settings as SettingsIcon,
  UploadCloud,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useWaypointStore } from '../../store/useWaypointStore';
import { HEADER_TAGLINE } from '../../lib/constants';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Compass },
  { to: '/forecast', label: 'Forecast', icon: TrendingUp },
  { to: '/simulator', label: 'Simulator', icon: Sliders },
  { to: '/regret', label: 'Regret Engine', icon: History },
  { to: '/ask', label: 'Ask Copilot', icon: MessageSquareText },
  { to: '/report', label: 'Monthly Report', icon: FileBarChart },
  { to: '/goals', label: 'Goals & Budgets', icon: Target },
  { to: '/activity', label: 'Activity Ledger', icon: Receipt },
  { to: '/upload', label: 'Statement Upload', icon: UploadCloud },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC = () => {
  const resetDemo = useWaypointStore((s) => s.resetDemo);
  const decision = useWaypointStore((s) => s.getDecisionState());
  const oneMovePending = decision.theOneMove !== null;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-wider font-mono">WAYPOINT</div>
            <div className="text-[11px] text-indigo-300 font-medium">{HEADER_TAGLINE}</div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Decision Control
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isHomeWithMove = item.to === '/' && oneMovePending;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {isHomeWithMove && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-ping" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Status & Reset Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Offline · Deterministic
          </span>
          <span className="font-mono text-[10px] text-slate-500">v1.0</span>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset application data to initial baseline state?')) {
              resetDemo();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
          title="Restore initial baseline state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset State
        </button>
      </div>
    </aside>
  );
};
