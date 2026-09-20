import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  Home as HomeIcon,
  HeartPulse,
  ShoppingBag
} from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { SCENARIOS, ScenarioMeta, SimResultCard } from '../components/simulator/ScenarioCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Simulator: React.FC = () => {
  const simResults = useWaypointStore((s) => s.getDecisionState().simResults);
  const doMove = useWaypointStore((s) => s.doMove);
  const navigate = useNavigate();

  const [activeScenarioId, setActiveScenarioId] = useState<string>('job_loss');

  const activeResult = simResults[activeScenarioId] || simResults['job_loss'];

  const handleApplyMitigatingMove = (move: any) => {
    doMove(move.id);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-indigo-600" />
          Life Event Simulator (USP 2)
        </h2>
        <p className="text-xs text-slate-500">
          Stress-test 5 real-life scenarios against your actual recurring velocity. Pure deterministic math.
        </p>
      </div>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          const isSelected = sc.id === activeScenarioId;

          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenarioId(sc.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              <div className="mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm leading-tight">{sc.label}</div>
              </div>
              <div
                className={`text-[11px] font-medium leading-tight ${
                  isSelected ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                {sc.subLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Card */}
      {activeResult && (
        <SimResultCard
          result={activeResult}
          onApplyMitigatingMove={handleApplyMitigatingMove}
        />
      )}

      {/* Teaching Note */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          💡 <strong>How the Simulator works:</strong> Recalculates velocity curves from your active rent, utilities, and discretionary averages without changing your real account baseline.
        </span>
        <button
          onClick={() => navigate('/forecast')}
          className="font-bold text-indigo-600 hover:text-indigo-700 shrink-0 ml-4 inline-flex items-center gap-1"
        >
          Compare with baseline forecast <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
