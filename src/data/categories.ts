export interface CategoryDef {
  id: string;
  name: string;
  color: string;
  iconName: string;
  defaultBudget: number;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'Income', name: 'Income', color: '#10b981', iconName: 'ArrowDownLeft', defaultBudget: 0 },
  { id: 'Housing & Rent', name: 'Housing & Rent', color: '#6366f1', iconName: 'Home', defaultBudget: 25000 },
  { id: 'Food & Dining', name: 'Food & Dining', color: '#f59e0b', iconName: 'Utensils', defaultBudget: 12000 },
  { id: 'Subscriptions', name: 'Subscriptions', color: '#8b5cf6', iconName: 'Tv', defaultBudget: 3500 },
  { id: 'Utilities & Bills', name: 'Utilities & Bills', color: '#06b6d4', iconName: 'Zap', defaultBudget: 5000 },
  { id: 'Shopping & Gadgets', name: 'Shopping & Gadgets', color: '#ec4899', iconName: 'ShoppingBag', defaultBudget: 8000 },
  { id: 'Transportation', name: 'Transportation', color: '#3b82f6', iconName: 'Car', defaultBudget: 4000 },
  { id: 'Entertainment', name: 'Entertainment', color: '#14b8a6', iconName: 'Film', defaultBudget: 3000 },
  { id: 'Healthcare', name: 'Healthcare', color: '#ef4444', iconName: 'HeartPulse', defaultBudget: 2500 },
  { id: 'Financial & EMI', name: 'Financial & EMI', color: '#64748b', iconName: 'CreditCard', defaultBudget: 10000 },
  { id: 'Other', name: 'Other', color: '#94a3b8', iconName: 'MoreHorizontal', defaultBudget: 2000 }
];

export const CATEGORY_IDS = CATEGORIES.map(c => c.id);

export function getCategoryDef(categoryName: string): CategoryDef {
  return (
    CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase() || c.id.toLowerCase() === categoryName.toLowerCase()) || {
      id: 'Other',
      name: categoryName || 'Other',
      color: '#94a3b8',
      iconName: 'MoreHorizontal',
      defaultBudget: 2000
    }
  );
}
