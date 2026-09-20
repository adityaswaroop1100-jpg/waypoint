import React from 'react';
import { AlertTriangle, ShieldAlert, Calendar, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import { ForecastPoint } from '../../types';
import { formatCurrency, formatDate } from '../../lib/format';
import { ZoneTag } from '../ui/ZoneTag';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DipExplainerProps {
  point: ForecastPoint | null;
  onClear: () => void;
  onNavigateToSimulator: () => void;
}

export const DipExplainer: React.FC<DipExplainerProps> = ({
  point,
  onClear,
  onNavigateToSimulator
}) => {
  if (!point) return null;

  const isCollisionDate = point.date.includes('-27') || point.isDip;

  return (
    <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-soft-lg animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-950">
                {isCollisionDate ? '⚠️ The 27th Cash-Flow Collision Detected' : `Forecast Inspection: ${formatDate(point.date)}`}
              </h3>
            </div>
            <p className="text-xs text-amber-800">
              Projected balance dips to <span className="font-bold tabular-nums">{formatCurrency(point.projectedBalance)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ZoneTag zone={point.zone} />
          <button
            onClick={onClear}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
        {/* Left Column: Colliding Debits */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
            Colliding Outflows on {formatDate(point.date)}
          </span>

          <div className="space-y-2 bg-white/80 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center justify-between text-sm py-1 border-b border-amber-100">
              <span className="font-medium text-slate-800">HDFC Credit Card Auto-Debit</span>
              <span className="font-bold text-rose-600 tabular-nums">-₹18,400</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1 border-b border-amber-100">
              <span className="font-medium text-slate-800">State Electricity Board Bill</span>
              <span className="font-bold text-rose-600 tabular-nums">-₹3,200</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1 text-slate-600 text-xs">
              <span>Cumulative month-to-date fixed outlays (Rent & Bills)</span>
              <span className="font-semibold text-slate-700">-₹28,399</span>
            </div>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            Three significant obligations land within 72 hours of each other before your next salary cycle, compressing your checking buffer to under ₹15,000.
          </p>
        </div>

        {/* Right Column: Mitigating Action */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Recommended Mitigating Action
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Shift Card Billing Cycle to the 5th
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Call your card issuer or toggle the billing date in the banking app to 5 days after salary arrival. This eliminates the 27th dip permanently.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Zero fee • 100% effective</span>
            <Button size="sm" variant="primary" onClick={onNavigateToSimulator}>
              Stress-test in Simulator <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
