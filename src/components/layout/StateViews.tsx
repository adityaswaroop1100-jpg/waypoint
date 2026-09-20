import React from 'react';
import { Loader2, AlertCircle, FileQuestion, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Analyzing transactions with deterministic decision engine…'
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-1">Processing State</h3>
    <p className="text-xs text-slate-500 max-w-sm">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <FileQuestion className="w-8 h-8 text-slate-400" />
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
    <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
    {actionText && onAction && (
      <Button variant="primary" size="sm" onClick={onAction}>
        {actionText}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({
  title = 'Unable to complete action',
  message,
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 rounded-3xl border border-rose-200">
    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-rose-700 max-w-sm mb-4 leading-relaxed">{message}</p>
    {onRetry && (
      <Button variant="danger" size="sm" onClick={onRetry}>
        Try again or reset demo
      </Button>
    )}
  </div>
);
