import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface ConfidencePillProps {
  confidence: number; // 0 to 100
  className?: string;
}

export const ConfidencePill: React.FC<ConfidencePillProps> = ({ confidence, className = '' }) => {
  let colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (confidence < 80) {
    colorStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorStyle} ${className}`}
      title={`Deterministic confidence level based on historical recurring transaction pattern`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>{confidence}% confident</span>
    </div>
  );
};
