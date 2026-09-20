import React, { useState } from 'react';
import { Compass, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { HEADER_TAGLINE, PITCH_TAGLINE } from '../../lib/constants';
import { formatCurrency } from '../../lib/format';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (income: number, buffer: number) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [monthlyIncome, setMonthlyIncome] = useState('85000');
  const [bufferAmount, setBufferAmount] = useState('15000');

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete(parseFloat(monthlyIncome) || 85000, parseFloat(bufferAmount) || 15000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between min-h-[440px]">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm tracking-wider font-mono">WAYPOINT</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span className={step === 1 ? 'text-indigo-600 font-bold' : ''}>1</span>
            <span>•</span>
            <span className={step === 2 ? 'text-indigo-600 font-bold' : ''}>2</span>
            <span>•</span>
            <span className={step === 3 ? 'text-indigo-600 font-bold' : ''}>3</span>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-soft">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome to Waypoint
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              "{PITCH_TAGLINE}"
            </p>
            <p className="text-xs text-slate-400">
              Unlike traditional budgeting apps that look backward, Waypoint gives you one clear, forward-looking move at a time.
            </p>
          </div>
        )}

        {/* Step 2: Set Profile & Baseline */}
        {step === 2 && (
          <div className="py-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Set your financial baseline</h2>
              <p className="text-xs text-slate-500">Waypoint calibrates your 90-day forecast and safety zones</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Monthly Net Take-Home Salary (₹)
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Checking Comfort Buffer (₹)
                </label>
                <input
                  type="number"
                  value={bufferAmount}
                  onChange={(e) => setBufferAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  The minimum balance you like to preserve in your checking account.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Demo Data Loaded */}
        {step === 3 && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">6-Month Dataset Preloaded</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We've preloaded 6 months of transaction history, identified your recurring commitments, detected Friday habits, and primed The One Move.
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono">
              Deterministic Decision Engine • 100% Offline Ready
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleFinish}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Skip & use demo defaults
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => (s - 1) as any)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button variant="primary" size="sm" onClick={() => setStep((s) => (s + 1) as any)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleFinish} icon={<CheckCircle2 className="w-4 h-4" />}>
                Enter Waypoint
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
