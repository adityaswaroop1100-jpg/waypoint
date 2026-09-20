import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  Sliders,
  History,
  MessageSquareText,
  FileBarChart,
  Menu,
  X,
  Target,
  Receipt,
  Settings as SettingsIcon,
  UploadCloud,
  RotateCcw
} from 'lucide-react';
import { useWaypointStore } from '../../store/useWaypointStore';

export const MobileTabBar: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const resetDemo = useWaypointStore((s) => s.resetDemo);

  const mainTabs = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/forecast', label: 'Forecast', icon: TrendingUp },
    { to: '/simulator', label: 'Simulator', icon: Sliders },
    { to: '/regret', label: 'Regret', icon: History },
    { to: '/ask', label: 'Ask', icon: MessageSquareText },
    { to: '/report', label: 'Report', icon: FileBarChart },
  ];

  const secondaryTabs = [
    { to: '/goals', label: 'Goals & Budgets', icon: Target },
    { to: '/activity', label: 'Activity Ledger', icon: Receipt },
    { to: '/upload', label: 'Upload Statement', icon: UploadCloud },
    { to: '/settings', label: 'Settings & Debug', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Drawer for secondary items */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">More Screens</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 text-sm font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <button
              onClick={() => {
                setMoreOpen(false);
                if (window.confirm('Reset demo state to seed dataset?')) {
                  resetDemo();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-950/40 text-rose-300 border border-rose-800/50 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo State
            </button>
          </div>
        </div>
      )}

      {/* Bottom Fixed Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium text-slate-400 hover:text-slate-200"
          aria-label="Open menu for more pages"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </>
  );
};
