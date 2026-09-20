export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number; // positive for income, negative for expenses
  category: string;
  source: 'seed' | 'csv';
  corrected?: boolean;
  notes?: string;
}

export interface RecurringItem {
  merchant: string;
  category: string;
  amountType: 'fixed' | 'variable';
  amount: number;
  intervalDays: number;
  nextDueDate: string;
  lastUsedDate?: string;
  status?: 'active' | 'unused' | 'flagged';
  annualCost?: number;
}

export interface Anomaly {
  transactionId: string;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  zScore: number;
  explanation: string;
}

export interface Habit {
  pattern: string;
  category: string;
  frequency: string;
  averageSpend: number;
  annualProjectedSpend: number;
  description: string;
}

export interface Move {
  id: string;
  title: string;
  impactRupees: number; // annual or immediate savings in ₹
  confidence: number; // percentage, e.g. 94
  reasoning: string;
  sourceTransactionIds: string[];
  status: 'pending' | 'done' | 'dismissed';
  effortWeight?: number; // 1 (easy) to 3 (harder)
  category?: string;
  actionType?: 'cancel_subscription' | 'budget_cut' | 'reschedule_payment' | 'rebalance_goal' | 'bill_negotiate';
}

export interface ForecastPoint {
  date: string;
  projectedBalance: number;
  zone: 'safe' | 'tight' | 'danger';
  causes?: string[];
  dayIncome?: number;
  dayExpenses?: number;
  isDip?: boolean;
}

export interface Goal {
  id: string;
  type: 'savings' | 'purchase' | 'emergency_fund';
  label: string;
  targetAmount: number;
  targetDate?: string;
  currentAmount: number;
}

export interface Budget {
  category: string;
  monthlyLimit: number;
}

export interface SimResult {
  scenario: string;
  title: string;
  description: string;
  runwayMonths: number;
  goalImpact: string;
  mitigatingMove: Move;
  projectedForecast: ForecastPoint[];
  monthlyDeficit?: number;
}

export interface Regret {
  category: string;
  actualSpend: number;
  reductionPercentage: number;
  counterfactualSpend: number;
  recoverableAmount: number;
  narrative: string;
  impactContext: string;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  net: number;
  topCategories: { category: string; amount: number; percentage: number }[];
  budgetStatus: {
    category: string;
    limit: number;
    actual: number;
    status: 'under' | 'near' | 'over';
    percentage: number;
  }[];
  actionItems: {
    id: string;
    title: string;
    description: string;
    impact: string;
    targetRoute: string;
    moveId?: string;
    goalId?: string;
  }[];
}

export interface Settings {
  bufferAmount: number; // default 15000 ₹ threshold for "tight" zone
  dangerBufferAmount: number; // default 5000 ₹ threshold for "danger" zone
  monthlyIncome: number; // default 85000 from seed
  currency: string; // default '₹'
  mockMode: boolean; // default true
  userName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isPushback?: boolean;
  dataPoints?: {
    label: string;
    value: string;
  }[];
  suggestedAction?: {
    label: string;
    route: string;
  };
}
