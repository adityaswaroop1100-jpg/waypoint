import React from 'react';
import {
  Briefcase,
  Home,
  HeartPulse,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SimResult, Move } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/format';
import { ConfidencePill } from '../ui/ConfidencePill';

export interface ScenarioMeta {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'job_loss',
    label: 'Sudden Job Loss',
    subLabel: 'Income drops to ₹0 / month',
    icon: Briefcase,
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'rent_hike',
    label: '15% Rent Hike',
    subLabel: '+₹3,600 / month rent jump',
    icon: Home,
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'medical_emergency',
    label: 'Medical ₹80,000',
    subLabel: 'Sudden hospital / emergency bill',
    icon: HeartPulse,
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 'planned_purchase',
    label: 'Gadget ₹1.2L in 4mo',
    subLabel: 'Saving ₹30,000 / month',
    icon: ShoppingBag,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'salary_hike',
    label: '20% Salary Hike',
    subLabel: '+₹17,000 / month net raise',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
];

interface SimResultCardProps {
  result: SimResult;
  onApplyMitigatingMove?: (move: Move) => void;
}

export const SimResultCard: React.FC<SimResultCardProps> = ({
  result,
  onApplyMitigatingMove
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-lg space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
            Simulated Outcome & Runway Impact
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{result.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{result.description}</p>
        </div>

        <div className="shrink-0 bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-col items-center sm:items-end">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Projected Liquid Runway</span>
          <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {result.runwayMonths} Months
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Timeline Impact */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Goal & Savings Timeline Impact</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{result.goalImpact}</p>
          {result.monthlyDeficit !== undefined && result.monthlyDeficit > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Monthly Cash Squeeze:</span>
              <span className="font-bold text-rose-600 tabular-nums">-{formatCurrency(result.monthlyDeficit)}/mo</span>
            </div>
          )}
        </div>

        {/* Concrete Mitigating Move */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-5 border border-indigo-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Mitigating Move
              </div>
              <ConfidencePill confidence={result.mitigatingMove.confidence} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{result.mitigatingMove.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {result.mitigatingMove.reasoning}
            </p>
          </div>

          <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-600 tabular-nums">
              +{formatCurrency(result.mitigatingMove.impactRupees)} offset
            </span>
            {onApplyMitigatingMove && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApplyMitigatingMove(result.mitigatingMove)}
              >
                Apply to My Plan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
