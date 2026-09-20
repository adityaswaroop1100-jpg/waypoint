import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Zap,
  CreditCard,
  Home as HomeIcon,
  HelpCircle
} from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { ForecastChart } from '../components/forecast/ForecastChart';
import { DipExplainer } from '../components/forecast/DipExplainer';
import { ForecastPoint } from '../types';
import { Card } from '../components/ui/Card';
import { ZoneTag } from '../components/ui/ZoneTag';
import { formatCurrency, formatDate } from '../lib/format';

export const Forecast: React.FC = () => {
  const forecast = useWaypointStore((s) => s.getDecisionState().forecast);
  const pinnedDip = useWaypointStore((s) => s.getDecisionState().pinnedDipPoint);
  const settings = useWaypointStore((s) => s.settings);
  const patterns = useWaypointStore((s) => s.getPatterns());
  const navigate = useNavigate();

  const [selectedPoint, setSelectedPoint] = useState<ForecastPoint | null>(pinnedDip);

  return (
    <div className="space-y-6">
      {/* Header & Zone Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            90-Day Financial Weather Forecast (USP 3)
          </h2>
          <p className="text-xs text-slate-500">
            Day-by-day forward balance projection based on verified recurring commitments and daily discretionary rate.
          </p>
        </div>

        {/* Zone Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-emerald-800">Safe: &gt;₹{(settings.bufferAmount || 15000).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-bold text-amber-800">Tight: ₹5k – ₹15k</span>
          </div>
          <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="font-bold text-rose-800">Danger: &lt;₹5k</span>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <Card className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
          <span className="font-semibold text-slate-700">Projected Daily Liquidity (Next 90 Days)</span>
          <span className="text-[11px] text-indigo-600 font-medium">
            💡 Tip: Click any point on the curve to inspect scheduled cash movements
          </span>
        </div>

        <ForecastChart
          data={forecast}
          settings={settings}
          selectedDate={selectedPoint?.date || null}
          onSelectPoint={(p) => setSelectedPoint(p)}
        />
      </Card>

      {/* Clickable Dip Explainer (USP 3 Pinned Moment) */}
      {selectedPoint && (
        <DipExplainer
          point={selectedPoint}
          onClear={() => setSelectedPoint(null)}
          onNavigateToSimulator={() => navigate('/simulator')}
        />
      )}

      {/* UPCOMING OBLIGATIONS (Feature F6) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Verified Recurring Obligations & Subscriptions (Next 30–90 Days)
          </h3>
          <span className="text-xs text-slate-500">{patterns.recurring.length} automated debits</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patterns.recurring.map((item, i) => (
            <Card key={i} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'unused'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status === 'unused' ? 'Dormant' : 'Active'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.merchant}</h4>
                <div className="text-xs text-slate-500">
                  Cadence: ~{item.intervalDays} days ({item.amountType})
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Next debit:</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
