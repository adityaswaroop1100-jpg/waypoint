import { Transaction, Goal, Budget } from '../types';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-emergency-fund',
    type: 'emergency_fund',
    label: '6-Month Emergency Cushion',
    targetAmount: 150000,
    targetDate: '2027-03-31',
    currentAmount: 90000 // 60% funded
  },
  {
    id: 'goal-goa-trip',
    type: 'purchase',
    label: 'Year-End Goa Trip',
    targetAmount: 40000,
    targetDate: '2026-12-20',
    currentAmount: 15000
  },
  {
    id: 'goal-macbook-pro',
    type: 'purchase',
    label: 'MacBook Pro Upgrade',
    targetAmount: 120000,
    targetDate: '2027-01-15',
    currentAmount: 45000
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  { category: 'Food & Dining', monthlyLimit: 12000 },
  { category: 'Shopping & Gadgets', monthlyLimit: 8000 },
  { category: 'Entertainment', monthlyLimit: 3000 },
  { category: 'Transportation', monthlyLimit: 4000 },
  { category: 'Utilities & Bills', monthlyLimit: 5000 }
];

export const SEED_TRANSACTIONS: Transaction[] = [
  // ──────────────────────────────────────────
  // APRIL 2026
  // ──────────────────────────────────────────
  { id: 'tx-20260401-01', date: '2026-04-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260403-01', date: '2026-04-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260404-01', date: '2026-04-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260404-02', date: '2026-04-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260404-03', date: '2026-04-04', merchant: 'Disney+ Hotstar Annual', amount: -1499, category: 'Subscriptions', source: 'seed' }, // Unused subscription
  { id: 'tx-20260405-01', date: '2026-04-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260408-01', date: '2026-04-08', merchant: 'Nature Basket Groceries', amount: -3200, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260410-01', date: '2026-04-10', merchant: 'Swiggy Dinner Delivery (Fri 9:45pm)', amount: -680, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260412-01', date: '2026-04-12', merchant: 'Uber Commute', amount: -420, category: 'Transportation', source: 'seed' },
  { id: 'tx-20260415-01', date: '2026-04-15', merchant: 'State Electricity Board', amount: -2150, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260417-01', date: '2026-04-17', merchant: 'Zomato Late Night (Fri 10:15pm)', amount: -820, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260420-01', date: '2026-04-20', merchant: 'Airtel Broadband & DTH', amount: -1199, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260422-01', date: '2026-04-22', merchant: 'BookMyShow Cinema Tickets', amount: -950, category: 'Entertainment', source: 'seed' },
  { id: 'tx-20260424-01', date: '2026-04-24', merchant: 'Swiggy Feast (Fri 9:30pm)', amount: -760, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260428-01', date: '2026-04-28', merchant: 'Amazon Retail Order', amount: -2450, category: 'Shopping & Gadgets', source: 'seed' },

  // ──────────────────────────────────────────
  // MAY 2026
  // ──────────────────────────────────────────
  { id: 'tx-20260501-01', date: '2026-05-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260503-01', date: '2026-05-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260504-01', date: '2026-05-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260504-02', date: '2026-05-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260505-01', date: '2026-05-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260508-01', date: '2026-05-08', merchant: 'Swiggy Dinner (Fri 10:00pm)', amount: -740, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260512-01', date: '2026-05-12', merchant: 'Blinkit Instant Groceries', amount: -2100, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260515-01', date: '2026-05-15', merchant: 'State Electricity Board', amount: -3400, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260515-02', date: '2026-05-15', merchant: 'Swiggy Dinner (Fri 9:20pm)', amount: -890, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260518-01', date: '2026-05-18', merchant: 'Uber Intercity Travel', amount: -1850, category: 'Transportation', source: 'seed' },
  { id: 'tx-20260520-01', date: '2026-05-20', merchant: 'Airtel Broadband & DTH', amount: -1199, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260522-01', date: '2026-05-22', merchant: 'Zomato Biryani (Fri 10:45pm)', amount: -920, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260525-01', date: '2026-05-25', merchant: 'Zara Apparel Store', amount: -4800, category: 'Shopping & Gadgets', source: 'seed' },
  { id: 'tx-20260529-01', date: '2026-05-29', merchant: 'Swiggy Dinner (Fri 9:15pm)', amount: -650, category: 'Food & Dining', source: 'seed' },

  // ──────────────────────────────────────────
  // JUNE 2026
  // ──────────────────────────────────────────
  { id: 'tx-20260601-01', date: '2026-06-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260603-01', date: '2026-06-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260604-01', date: '2026-06-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260604-02', date: '2026-06-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260605-01', date: '2026-06-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260605-02', date: '2026-06-05', merchant: 'Swiggy Friday Night (Fri 10:30pm)', amount: -780, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260610-01', date: '2026-06-10', merchant: 'Apollo Pharmacy Meds', amount: -1450, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260612-01', date: '2026-06-12', merchant: 'Zomato Burger Combo (Fri 9:40pm)', amount: -690, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260615-01', date: '2026-06-15', merchant: 'State Electricity Board', amount: -4100, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260618-01', date: '2026-06-18', merchant: 'Croma Electronics - UltraWide 4K Monitor', amount: -38500, category: 'Shopping & Gadgets', source: 'seed' }, // CLEAR ANOMALY
  { id: 'tx-20260619-01', date: '2026-06-19', merchant: 'Swiggy Friday Order (Fri 10:10pm)', amount: -850, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260620-01', date: '2026-06-20', merchant: 'Airtel Broadband & DTH', amount: -1199, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260626-01', date: '2026-06-26', merchant: 'Swiggy Weekend Starter (Fri 9:55pm)', amount: -720, category: 'Food & Dining', source: 'seed' },

  // ──────────────────────────────────────────
  // JULY 2026
  // ──────────────────────────────────────────
  { id: 'tx-20260701-01', date: '2026-07-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260703-01', date: '2026-07-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260704-01', date: '2026-07-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260704-02', date: '2026-07-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260705-01', date: '2026-07-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260703-02', date: '2026-07-03', merchant: 'Swiggy Friday Dinner (Fri 9:25pm)', amount: -790, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260710-01', date: '2026-07-10', merchant: 'Zomato Treats (Fri 10:20pm)', amount: -860, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260715-01', date: '2026-07-15', merchant: 'State Electricity Board', amount: -3200, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260717-01', date: '2026-07-17', merchant: 'Swiggy Meal (Fri 9:50pm)', amount: -710, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260720-01', date: '2026-07-20', merchant: 'Airtel Broadband & DTH', amount: -1199, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260724-01', date: '2026-07-24', merchant: 'Swiggy Late Night (Fri 11:00pm)', amount: -640, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260727-01', date: '2026-07-27', merchant: 'HDFC Bank Credit Card Auto-Pay', amount: -18400, category: 'Financial & EMI', source: 'seed' },
  { id: 'tx-20260731-01', date: '2026-07-31', merchant: 'Zomato Friday Pizza (Fri 9:15pm)', amount: -950, category: 'Food & Dining', source: 'seed' },

  // ──────────────────────────────────────────
  // AUGUST 2026
  // ──────────────────────────────────────────
  { id: 'tx-20260801-01', date: '2026-08-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260803-01', date: '2026-08-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260804-01', date: '2026-08-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260804-02', date: '2026-08-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260805-01', date: '2026-08-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260807-01', date: '2026-08-07', merchant: 'Swiggy Friday Feast (Fri 10:05pm)', amount: -830, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260812-01', date: '2026-08-12', merchant: 'Nature Basket Groceries', amount: -3800, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260814-01', date: '2026-08-14', merchant: 'Zomato Friday Dinner (Fri 9:35pm)', amount: -750, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260815-01', date: '2026-08-15', merchant: 'State Electricity Board', amount: -2800, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260820-01', date: '2026-08-20', merchant: 'Airtel Broadband & DTH', amount: -1199, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260821-01', date: '2026-08-21', merchant: 'Swiggy Friday Night (Fri 10:40pm)', amount: -810, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260828-01', date: '2026-08-28', merchant: 'Swiggy Friday Dinner (Fri 9:20pm)', amount: -690, category: 'Food & Dining', source: 'seed' },

  // ──────────────────────────────────────────
  // SEPTEMBER 2026 (Current Month)
  // ──────────────────────────────────────────
  { id: 'tx-20260901-01', date: '2026-09-01', merchant: 'Tech Corp India (Salary)', amount: 85000, category: 'Income', source: 'seed' },
  { id: 'tx-20260903-01', date: '2026-09-03', merchant: 'Landlord Rent Transfer', amount: -24000, category: 'Housing & Rent', source: 'seed' },
  { id: 'tx-20260904-01', date: '2026-09-04', merchant: 'Netflix Subscription', amount: -649, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260904-02', date: '2026-09-04', merchant: 'Spotify Premium', amount: -119, category: 'Subscriptions', source: 'seed' },
  { id: 'tx-20260904-03', date: '2026-09-04', merchant: 'Hotstar Subscription Auto-Renew Pending', amount: -1499, category: 'Subscriptions', source: 'seed', notes: 'Zero activity detected across past 74 days' },
  { id: 'tx-20260905-01', date: '2026-09-05', merchant: 'Cult.Fit Gym Membership', amount: -2500, category: 'Healthcare', source: 'seed' },
  { id: 'tx-20260904-04', date: '2026-09-04', merchant: 'Swiggy Friday Dinner (Fri 9:15pm)', amount: -760, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260911-01', date: '2026-09-11', merchant: 'Zomato Friday Order (Fri 10:10pm)', amount: -840, category: 'Food & Dining', source: 'seed' },
  { id: 'tx-20260915-01', date: '2026-09-15', merchant: 'State Electricity Board', amount: -2950, category: 'Utilities & Bills', source: 'seed' },
  { id: 'tx-20260918-01', date: '2026-09-18', merchant: 'Swiggy Weekend Starter (Fri 9:45pm)', amount: -790, category: 'Food & Dining', source: 'seed' }
];

export const INITIAL_ACCOUNT_BALANCE = 54200;
