import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileTabBar } from './MobileTabBar';
import { DISCLAIMER_TEXT } from '../../lib/constants';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <TopBar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Global Footer with Regulatory Disclaimer */}
        <footer className="border-t border-slate-200/60 py-4 px-6 text-center text-xs text-slate-600 bg-white/40">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 WAYPOINT Decision Support Systems</span>
            <span className="text-[11px] text-slate-600 italic">
              {DISCLAIMER_TEXT}
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
};
