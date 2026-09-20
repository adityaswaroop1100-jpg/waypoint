import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import { Regret } from '../../types';
import { Card } from '../ui/Card';
import { formatCurrency, formatPercentage, containsBannedWords, sanitizeText } from '../../lib/format';

interface RegretCardProps {
  regret: Regret;
}

export const RegretCard: React.FC<RegretCardProps> = ({ regret }) => {
  const [reductionPct, setReductionPct] = useState(regret.reductionPercentage || 20);

  // Recompute counterfactual on slider change
  const counterfactualSpend = Math.round(regret.actualSpend * (1 - reductionPct / 100));
  const recoverableAmount = Math.round(regret.actualSpend * (reductionPct / 100));

  // Verify zero banned words
  const cleanNarrative = sanitizeText(regret.narrative);

  return (
    <Card className="flex flex-col justify-between hover:border-indigo-200">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Opportunity</span>
            <h3 className="text-lg font-bold text-slate-900">{regret.category}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">Past 6-Mo Total</span>
            <span className="text-sm font-bold text-slate-700 tabular-nums">
              {formatCurrency(regret.actualSpend)}
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100/80 mb-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            Counterfactual Projection:
          </p>
          <p>
            If you adjusted {regret.category.toLowerCase()} spending by <span className="font-bold text-indigo-700">{reductionPct}%</span>, you would retain{' '}
            <span className="font-extrabold text-emerald-700 tabular-nums bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{formatCurrency(recoverableAmount)}
            </span>{' '}
            in flexible savings.
          </p>
          <p className="text-xs text-indigo-900/80 mt-2 font-medium">
            💡 {regret.impactContext}
          </p>
        </div>

        {/* Interactive Percentage Slider */}
        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Tune Reduction Target:
            </span>
            <span className="font-bold text-indigo-600 tabular-nums">{reductionPct}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={reductionPct}
            onChange={(e) => setReductionPct(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5% (Gentle)</span>
            <span>25% (Balanced)</span>
            <span>50% (Lean)</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">Adjusted 6-Mo Spend:</span>
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {formatCurrency(counterfactualSpend)}
        </span>
      </div>
    </Card>
  );
};
