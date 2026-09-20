import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Move, Transaction } from '../../types';
import { ConfidencePill } from '../ui/ConfidencePill';
import { WhyPopover } from '../ui/WhyPopover';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/format';

interface OneMoveCardProps {
  move: Move | null;
  allTransactions: Transaction[];
  onDoMove: (moveId: string) => void;
  onDismissMove: (moveId: string) => void;
}

export const OneMoveCard: React.FC<OneMoveCardProps> = ({
  move,
  allTransactions,
  onDoMove,
  onDismissMove
}) => {
  const [whyOpen, setWhyOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  if (!move) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-soft-lg relative overflow-hidden border border-indigo-700/40">
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
            Cash-Flow Optimized
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            You're all caught up on recommendations
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            All high-priority candidate moves have been actioned. Your current 90-day trajectory is stable.
          </p>
          <a
            href="/forecast"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/20"
          >
            Review 90-day forecast <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Linked source transactions
  const linkedTransactions = allTransactions.filter(
    (t) => move.sourceTransactionIds.includes(t.id) || (move.category && t.category === move.category)
  );

  const handleExecute = () => {
    setJustCompleted(true);
    setTimeout(() => {
      onDoMove(move.id);
      setJustCompleted(false);
    }, 400);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-soft-lg border border-indigo-700/50 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 font-mono">
                THE ONE MOVE • HIGHEST RANKED RECOMMENDATION
              </span>
            </div>
            <ConfidencePill confidence={move.confidence} className="bg-emerald-950/80 text-emerald-300 border-emerald-500/40" />
          </div>

          {/* Title & Impact */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {move.title}
            </h2>
            <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 flex items-baseline gap-2">
              <span className="text-xs uppercase font-medium text-slate-300">Financial Impact:</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                +{formatCurrency(move.impactRupees)}/yr freed
              </span>
            </div>
          </div>

          {/* Reasoning */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
            {move.reasoning}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <Button
              variant="primary"
              size="lg"
              onClick={handleExecute}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 border border-emerald-400/50"
              icon={<CheckCircle2 className="w-5 h-5 text-slate-950" />}
            >
              {justCompleted ? 'Actioning Move…' : 'Do this'}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => onDismissMove(move.id)}
              className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              icon={<XCircle className="w-4 h-4" />}
            >
              Not now
            </Button>

            <button
              onClick={() => setWhyOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/40 rounded-2xl transition-colors border border-indigo-400/20 ml-auto"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why? Trace calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Why Popover Modal */}
      <WhyPopover
        isOpen={whyOpen}
        onClose={() => setWhyOpen(false)}
        title={move.title}
        reasoning={move.reasoning}
        confidence={move.confidence}
        transactions={linkedTransactions}
      />
    </>
  );
};
