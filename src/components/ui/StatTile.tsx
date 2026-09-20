import React, { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  trendText,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-4 shadow-soft flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <div className="p-2 rounded-xl bg-slate-50 text-slate-600 shrink-0">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</div>
        {(subValue || trendText) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            {trendText && (
              <span className={`font-semibold ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-600'}`}>
                {trendText}
              </span>
            )}
            {subValue && <span>{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
