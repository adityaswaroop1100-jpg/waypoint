import React from 'react';
import { History, Sparkles, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { RegretCard } from '../components/regret/RegretCard';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/format';

export const Regret: React.FC = () => {
  const regrets = useWaypointStore((s) => s.getDecisionState().regrets);

  const totalRecoverable = regrets.reduce((sum, r) => sum + r.recoverableAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Regret Engine — Counterfactual Math
          </h2>
          <p className="text-xs text-slate-500">
            Backward-looking analysis transformed into forward-looking momentum. Zero judgment, zero shaming.
          </p>
        </div>

        <div className="shrink-0 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Identifiable Capital</span>
            <span className="text-base font-extrabold text-emerald-900 tabular-nums">
              +{formatCurrency(totalRecoverable)} Potential
            </span>
          </div>
        </div>
      </div>

      {/* Motivational Tone Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-soft flex items-start gap-4">
        <div className="p-2.5 bg-white/10 rounded-2xl shrink-0 mt-0.5">
          <Heart className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            "You didn't make bad decisions — you bought convenience when you needed it."
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Regret Engine doesn't use words like "wasted" or "failed". Instead, it calculates the exact math of how slight 15–20% adjustments compound into massive financial independence cushions.
          </p>
        </div>
      </div>

      {/* Regret Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {regrets.map((regret) => (
          <RegretCard key={regret.category} regret={regret} />
        ))}
      </div>
    </div>
  );
};
