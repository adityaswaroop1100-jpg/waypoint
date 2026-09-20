export interface SuggestedQuestion {
  id: string;
  category: 'spending' | 'affordability' | 'subscriptions' | 'runway' | 'obligations';
  prompt: string;
  label: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'q-afford-vacation',
    category: 'affordability',
    prompt: 'Can I afford a ₹1.5L vacation in December?',
    label: 'Can I afford ₹1.5L vacation in December?'
  },
  {
    id: 'q-top-spending',
    category: 'spending',
    prompt: 'Where did I spend the most money this month?',
    label: 'Where did I spend the most this month?'
  },
  {
    id: 'q-subscriptions',
    category: 'subscriptions',
    prompt: 'Which subscriptions am I paying for and are any unused?',
    label: 'Which subscriptions am I paying for?'
  },
  {
    id: 'q-runway',
    category: 'runway',
    prompt: 'What is my emergency runway if I lose my income today?',
    label: 'What is my emergency runway?'
  },
  {
    id: 'q-committed',
    category: 'obligations',
    prompt: 'How much of my next month budget is already committed?',
    label: 'How much budget is committed?'
  },
  {
    id: 'q-mom-delta',
    category: 'spending',
    prompt: 'What changed in my spending compared to last month?',
    label: 'What changed vs last month?'
  }
];
