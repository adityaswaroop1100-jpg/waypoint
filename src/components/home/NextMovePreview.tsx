import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, HelpCircle, Check } from 'lucide-react';
import { Move, Transaction } from '../../types';
import { Card } from '../ui/Card';
import { ConfidencePill } from '../ui/ConfidencePill';
import { WhyPopover } from '../ui/WhyPopover';
import { formatCurrency } from '../../lib/format';

interface NextMovePreviewProps {
  moves: Move[];
  allTransactions: Transaction[];
  onDoMove: (moveId: string) => void;
}

export const NextMovePreview: React.FC<NextMovePreviewProps> = ({
  moves,
  allTransactions,
  onDoMove
}) => {
  const [selectedWhyMove, setSelectedWhyMove] = useState<Move | null>(null);

  if (moves.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Next Candidate Moves in Queue
        </h2>
        <span className="text-xs font-medium text-slate-500">
          Ranked by ROI = Impact × Confidence ÷ Effort
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moves.map((move, index) => {
          const linkedTransactions = allTransactions.filter(
            (t) => move.sourceTransactionIds.includes(t.id) || (move.category && t.category === move.category)
          );

          return (
            <Card key={move.id} className="flex flex-col justify-between hover:border-indigo-200">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">#{index + 2} IN QUEUE</span>
                  <ConfidencePill confidence={move.confidence} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{move.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {move.reasoning}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Impact</span>
                  <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
                    +{formatCurrency(move.impactRupees)}/yr
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWhyMove(move)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Why? Trace transactions"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDoMove(move.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Do this
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedWhyMove && (
        <WhyPopover
          isOpen={true}
          onClose={() => setSelectedWhyMove(null)}
          title={selectedWhyMove.title}
          reasoning={selectedWhyMove.reasoning}
          confidence={selectedWhyMove.confidence}
          transactions={allTransactions.filter(
            (t) => selectedWhyMove.sourceTransactionIds.includes(t.id) || (selectedWhyMove.category && t.category === selectedWhyMove.category)
          )}
        />
      )}
    </div>
  );
};
