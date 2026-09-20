import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction, Goal, Budget, Settings, ChatMessage, Move } from '../types';
import { SEED_TRANSACTIONS, INITIAL_GOALS, INITIAL_BUDGETS, INITIAL_ACCOUNT_BALANCE } from '../data/seedTransactions';
import { DEFAULT_SETTINGS } from '../lib/constants';
import { runPatternEngine, PatternEngineOutput } from '../agents/patternEngine';
import { runDecisionEngine, DecisionEngineState } from '../agents/decisionEngine';
import { answerUserQuestion } from '../agents/voice';

interface WaypointStoreState {
  transactions: Transaction[];
  categoryOverrides: Record<string, string>;
  goals: Goal[];
  budgets: Budget[];
  settings: Settings;
  currentBalance: number;
  completedMoveIds: string[];
  dismissedMoveIds: string[];
  chatMessages: ChatMessage[];
  hasCompletedOnboarding: boolean;

  // Actions
  addTransaction: (tx: Transaction) => void;
  addTransactions: (txs: Transaction[]) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  updateCategory: (transactionId: string, merchant: string, newCategory: string) => void;
  doMove: (moveId: string) => void;
  dismissMove: (moveId: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setBudget: (category: string, monthlyLimit: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  sendChatMessage: (userText: string) => void;
  completeOnboarding: (income?: number, buffer?: number) => void;
  resetDemo: () => void;

  // Computed state getters
  getPatterns: () => PatternEngineOutput;
  getDecisionState: () => DecisionEngineState;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    sender: 'assistant',
    text: "Hello Aditya! I'm your Waypoint decision copilot. I don't just log where your money went — I tell you what to do with it next.\n\nAsk me about upcoming cash squeezes, whether you can afford a planned purchase, or where to prune subscriptions.",
    timestamp: 'Just now'
  }
];

export const useWaypointStore = create<WaypointStoreState>()(
  persist(
    (set, get) => ({
      transactions: SEED_TRANSACTIONS,
      categoryOverrides: {},
      goals: INITIAL_GOALS,
      budgets: INITIAL_BUDGETS,
      settings: DEFAULT_SETTINGS,
      currentBalance: INITIAL_ACCOUNT_BALANCE,
      completedMoveIds: [],
      dismissedMoveIds: [],
      chatMessages: INITIAL_CHAT_MESSAGES,
      hasCompletedOnboarding: true, // true by default for instant seed demo, but resetable

      addTransaction: (tx) => {
        set((state) => ({
          transactions: [tx, ...state.transactions]
        }));
      },

      addTransactions: (txs) => {
        set((state) => ({
          transactions: [...txs, ...state.transactions]
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }));
      },

      clearAllTransactions: () => {
        set(() => ({
          transactions: []
        }));
      },

      updateCategory: (transactionId, merchant, newCategory) => {
        set((state) => {
          const updatedOverrides = {
            ...state.categoryOverrides,
            [merchant]: newCategory
          };
          
          // Also update all transactions matching this merchant
          const updatedTxns = state.transactions.map((t) => {
            if (t.id === transactionId || t.merchant === merchant) {
              return { ...t, category: newCategory, corrected: true };
            }
            return t;
          });

          return {
            categoryOverrides: updatedOverrides,
            transactions: updatedTxns
          };
        });
      },

      doMove: (moveId: string) => {
        set((state) => ({
          completedMoveIds: [...state.completedMoveIds, moveId]
        }));
      },

      dismissMove: (moveId: string) => {
        set((state) => ({
          dismissedMoveIds: [...state.dismissedMoveIds, moveId]
        }));
      },

      addGoal: (newGoalData) => {
        const newGoal: Goal = {
          ...newGoalData,
          id: `goal-${Date.now()}`
        };
        set((state) => ({
          goals: [...state.goals, newGoal]
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g))
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id)
        }));
      },

      setBudget: (category, monthlyLimit) => {
        set((state) => {
          const existing = state.budgets.find((b) => b.category === category);
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.category === category ? { ...b, monthlyLimit } : b
              )
            };
          }
          return {
            budgets: [...state.budgets, { category, monthlyLimit }]
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      sendChatMessage: (userText: string) => {
        const userMsg: ChatMessage = {
          id: `msg-user-${Date.now()}`,
          sender: 'user',
          text: userText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };

        // Append user message immediately
        set((state) => ({
          chatMessages: [...state.chatMessages, userMsg]
        }));

        const state = get();
        const patterns = state.getPatterns();
        const decisionState = state.getDecisionState();

        const botReply = answerUserQuestion(
          userText,
          decisionState,
          state.transactions,
          patterns.recurring,
          state.goals,
          state.budgets,
          state.settings
        );

        set((s) => ({
          chatMessages: [...s.chatMessages, botReply]
        }));
      },

      completeOnboarding: (income, buffer) => {
        set((state) => ({
          hasCompletedOnboarding: true,
          settings: {
            ...state.settings,
            monthlyIncome: income || state.settings.monthlyIncome,
            bufferAmount: buffer || state.settings.bufferAmount
          }
        }));
      },

      resetDemo: () => {
        // One-click demo reset to exact seed state
        localStorage.removeItem('waypoint-storage');
        set({
          transactions: SEED_TRANSACTIONS,
          categoryOverrides: {},
          goals: INITIAL_GOALS,
          budgets: INITIAL_BUDGETS,
          settings: DEFAULT_SETTINGS,
          currentBalance: INITIAL_ACCOUNT_BALANCE,
          completedMoveIds: [],
          dismissedMoveIds: [],
          chatMessages: INITIAL_CHAT_MESSAGES,
          hasCompletedOnboarding: true
        });
      },

      getPatterns: () => {
        const { transactions } = get();
        return runPatternEngine(transactions);
      },

      getDecisionState: () => {
        const {
          transactions,
          goals,
          budgets,
          settings,
          completedMoveIds,
          dismissedMoveIds,
          currentBalance
        } = get();

        const patterns = runPatternEngine(transactions);
        return runDecisionEngine(
          transactions,
          patterns.recurring,
          patterns.anomalies,
          patterns.habits,
          goals,
          budgets,
          settings,
          completedMoveIds,
          dismissedMoveIds,
          currentBalance
        );
      }
    }),
    {
      name: 'waypoint-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
