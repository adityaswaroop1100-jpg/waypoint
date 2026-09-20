import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { ForecastPoint, Settings } from '../../types';
import { formatCurrency, formatShortDate } from '../../lib/format';
import { ZoneTag } from '../ui/ZoneTag';

interface ForecastChartProps {
  data: ForecastPoint[];
  settings: Settings;
  selectedDate: string | null;
  onSelectPoint: (point: ForecastPoint) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  settings,
  selectedDate,
  onSelectPoint
}) => {
  const tightThreshold = settings.bufferAmount || 15000;
  const dangerThreshold = settings.dangerBufferAmount || 5000;

  // Find max and min for chart domain
  const balances = data.map((d) => d.projectedBalance);
  const maxBalance = Math.max(...balances, 100000);
  const minBalance = Math.min(...balances, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point: ForecastPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 max-w-xs pointer-events-none">
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-800">
            <span className="font-semibold text-slate-300">{formatShortDate(point.date)}</span>
            <ZoneTag zone={point.zone} showIcon={false} className="py-0.5 px-2 text-[10px]" />
          </div>
          <div className="text-base font-bold text-white tabular-nums">
            {formatCurrency(point.projectedBalance)}
          </div>
          {point.causes && point.causes.length > 0 && (
            <div className="pt-1 text-[11px] text-slate-300 space-y-0.5">
              <span className="font-semibold text-indigo-300 block">Daily Cash Movements:</span>
              {point.causes.map((c, i) => (
                <div key={i} className="text-slate-300 leading-tight">
                  • {c}
                </div>
              ))}
            </div>
          )}
          {point.isDip && (
            <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <span>⚠️ Click to inspect cash collision</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload.length) {
              onSelectPoint(e.activePayload[0].payload);
            }
          }}
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Zones */}
          <ReferenceArea y1={tightThreshold} y2={maxBalance + 20000} fill="#10b981" fillOpacity={0.05} />
          <ReferenceArea y1={dangerThreshold} y2={tightThreshold} fill="#f59e0b" fillOpacity={0.07} />
          <ReferenceArea y1={minBalance - 5000} y2={dangerThreshold} fill="#ef4444" fillOpacity={0.1} />

          {/* Reference Lines */}
          <ReferenceLine
            y={tightThreshold}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: `Comfort Buffer (₹${tightThreshold.toLocaleString('en-IN')})`, fill: '#d97706', fontSize: 10, position: 'right' }}
          />
          <ReferenceLine
            y={dangerThreshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: `Danger Floor (₹${dangerThreshold.toLocaleString('en-IN')})`, fill: '#dc2626', fontSize: 10, position: 'right' }}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            interval={14}
          />
          <YAxis
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            domain={[Math.max(0, minBalance - 5000), maxBalance + 10000]}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="projectedBalance"
            stroke="#4f46e5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#balanceGradient)"
            activeDot={{
              r: 6,
              fill: '#4f46e5',
              stroke: '#ffffff',
              strokeWidth: 2,
              className: 'cursor-pointer animate-pulse'
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
