import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5'
  };

  const variantClasses = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    brand: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60'
  };

  return (
    <span className={`inline-flex items-center shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
