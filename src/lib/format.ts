import { BANNED_SHAMING_WORDS } from './constants';

export function formatCurrency(amount: number, currency: string = '₹', showSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  
  // Format with Indian numbering system (e.g., 1,50,000)
  const formatted = absAmount.toLocaleString('en-IN');
  
  if (showSign) {
    if (isNegative) return `-${currency}${formatted}`;
    if (amount > 0) return `+${currency}${formatted}`;
  }
  
  return isNegative ? `-${currency}${formatted}` : `${currency}${formatted}`;
}

export function formatCompactRupees(amount: number, currency: string = '₹'): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) {
    return `${currency}${(absAmount / 10000000).toFixed(1)}Cr`;
  }
  if (absAmount >= 100000) {
    return `${currency}${(absAmount / 100000).toFixed(1)}L`;
  }
  if (absAmount >= 1000) {
    return `${currency}${(absAmount / 1000).toFixed(1)}k`;
  }
  return `${currency}${absAmount}`;
}

export function formatPercentage(val: number, decimals: number = 0): string {
  return `${val.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateString;
  }
}

export function formatMonthName(monthStr: string): string {
  // monthStr is 'YYYY-MM'
  try {
    const [year, month] = monthStr.split('-');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } catch {
    return monthStr;
  }
}

export function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_SHAMING_WORDS.some(word => lower.includes(word));
}

export function sanitizeText(text: string): string {
  let clean = text;
  for (const word of BANNED_SHAMING_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, 'opportunity');
  }
  return clean;
}
