import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ZoneTagProps {
  zone: 'safe' | 'tight' | 'danger';
  className?: string;
  showIcon?: boolean;
}

export const ZoneTag: React.FC<ZoneTagProps> = ({ zone, className = '', showIcon = true }) => {
  if (zone === 'safe') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        {showIcon && <ShieldCheck className="w-3.5 h-3.5" />}
        <span>Safe Zone</span>
      </span>
    );
  }

  if (zone === 'tight') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
        <span>Tight Zone</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
      {showIcon && <AlertOctagon className="w-3.5 h-3.5" />}
      <span>Danger Zone</span>
    </span>
  );
};
