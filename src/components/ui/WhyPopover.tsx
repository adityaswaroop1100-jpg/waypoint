import React from 'react';
import { X, HelpCircle, ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/format';

interface WhyPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  reasoning: string;
  confidence: number;
  transactions: Transaction[];
}

export const WhyPopover: React.FC<WhyPopoverProps> = ({
  isOpen,
  onClose,
  title,
  reasoning,
  confidence,
  transactions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Why this recommendation?</h2>
              <p className="text-xs text-slate-500">Deterministic transaction audit trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close why popover"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto pr-1">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Action</span>
            <p className="text-base font-semibold text-slate-900 mt-0.5">{title}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-sm text-slate-700 leading-relaxed">
            <div className="font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span>Decision Engine Reasoning</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {confidence}% Confidence
              </span>
            </div>
            {reasoning}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Source Transactions ({transactions.length})
              </span>
              <span className="text-xs text-slate-400">Traceable ledger items</span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No direct linked transactions.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{tx.merchant}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(tx.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {tx.category}
                        </span>
                      </div>
                      {tx.notes && (
                        <div className="text-xs text-amber-700 mt-1 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100 inline-block">
                          {tx.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm tabular-nums text-slate-900">
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {tx.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
