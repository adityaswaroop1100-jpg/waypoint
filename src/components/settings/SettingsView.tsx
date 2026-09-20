import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Code,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Database
} from 'lucide-react';
import { Settings, Move, RecurringItem, Anomaly, Habit, ForecastPoint } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DISCLAIMER_TEXT, HEADER_TAGLINE, PITCH_TAGLINE } from '../../lib/constants';
import { formatCurrency } from '../../lib/format';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onResetDemo: () => void;
  onClearData?: () => void;
  debugState: {
    recurring: RecurringItem[];
    anomalies: Anomaly[];
    habits: Habit[];
    theOneMove: Move | null;
    nextMoves: Move[];
    forecastSample: ForecastPoint[];
    categoryOverrides: Record<string, string>;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemo,
  onClearData,
  debugState
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local form state
  const [buffer, setBuffer] = useState(String(settings.bufferAmount));
  const [dangerBuffer, setDangerBuffer] = useState(String(settings.dangerBufferAmount));
  const [income, setIncome] = useState(String(settings.monthlyIncome));
  const [currency, setCurrency] = useState(settings.currency || '₹');
  const [mockMode, setMockMode] = useState(settings.mockMode !== false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      bufferAmount: parseFloat(buffer) || 15000,
      dangerBufferAmount: parseFloat(dangerBuffer) || 5000,
      monthlyIncome: parseFloat(income) || 85000,
      currency,
      mockMode
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Financial Buffer & Baselines */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Decision Engine Parameters</h2>
            <p className="text-xs text-slate-500">Configure balance safety thresholds and income baseline</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Offline Deterministic Mode
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Comfort Buffer (Tight Zone Threshold)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={buffer}
                  onChange={(e) => setBuffer(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Balances below this trigger the Tight Zone warning.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Danger Floor Threshold
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={dangerBuffer}
                  onChange={(e) => setDangerBuffer(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Balances below this trigger the Danger Zone alert.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Monthly Net Income Baseline
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Scheduled monthly salary credited on the 1st.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary currency formatting across all screens.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="mockModeCheck"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <label htmlFor="mockModeCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Strict Zero-Dependency Mode (MOCK_MODE=true)
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : undefined}
            >
              {savedSuccess ? 'Settings Saved' : 'Save Parameters'}
            </Button>
          </div>
        </form>
      </Card>

      {/* USER DATA MANAGEMENT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reset to Sample Data */}
        <Card className="p-6 border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Load Sample 6-Month Dataset</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Restores the verified 6-month demo dataset (77 transactions) to test all 4 deterministic agents and forecasts.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('Reload the verified 6-month sample dataset?')) {
                onResetDemo();
              }
            }}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Load Sample Dataset
          </Button>
        </Card>

        {/* Start Fresh / Clean Slate for New User */}
        {onClearData && (
          <Card className="p-6 border-rose-200 bg-rose-50/30 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Start Fresh (My Own Data)</h3>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Clears preloaded sample data so you can upload your own PDF/CSV statements or record your own transactions from zero.
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Clear all sample data and start fresh with an empty ledger for your own transactions?')) {
                  onClearData();
                }
              }}
              icon={<Database className="w-4 h-4" />}
            >
              Start Clean Slate
            </Button>
          </Card>
        )}
      </div>

      {/* ENGINE STATE INSPECTOR */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Engine State Inspector</h3>
              <p className="text-xs text-slate-500">View live computed outputs from the 4 local deterministic agents</p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            icon={<Code className="w-4 h-4" />}
          >
            {showDebug ? 'Hide Inspector' : 'Show Inspector'}
          </Button>
        </div>

        {showDebug && (
          <div className="pt-4 space-y-4 border-t border-slate-100 text-xs font-mono">
            {/* Pattern Engine Output */}
            <div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                1. [Pattern Engine] Detected Recurring Items ({debugState.recurring.length})
              </span>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-40">
                {JSON.stringify(debugState.recurring, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                2. [Pattern Engine] Detected Anomalies ({debugState.anomalies.length}) & Habits ({debugState.habits.length})
              </span>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-40">
                {JSON.stringify({ anomalies: debugState.anomalies, habits: debugState.habits }, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                3. [Decision Engine] The One Move & Ranked Queue
              </span>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-40">
                {JSON.stringify({ theOneMove: debugState.theOneMove, nextMoves: debugState.nextMoves }, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                4. [Ingestor] LocalStorage Correction Memory Overrides
              </span>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-40">
                {JSON.stringify(debugState.categoryOverrides, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Card>

      {/* Product Identity & Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 uppercase tracking-wider">Product Identity & Guardrails</div>
        <p className="font-medium text-slate-700">"{PITCH_TAGLINE}"</p>
        <p className="text-slate-500 leading-relaxed italic">{DISCLAIMER_TEXT}</p>
      </div>
    </div>
  );
};
