import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { Goal, Budget } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate, formatPercentage } from '../../lib/format';
import { CATEGORIES } from '../../data/categories';

interface GoalsViewProps {
  goals: Goal[];
  budgets: Budget[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  onSetBudget: (category: string, limit: number) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  budgets,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onSetBudget
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form State
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'savings' | 'purchase' | 'emergency_fund'>('savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('2027-01-31');

  const openAddModal = () => {
    setEditingGoal(null);
    setLabel('');
    setType('savings');
    setTargetAmount('50000');
    setCurrentAmount('10000');
    setTargetDate('2027-03-31');
    setModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setLabel(goal.label);
    setType(goal.type);
    setTargetAmount(String(goal.targetAmount));
    setCurrentAmount(String(goal.currentAmount));
    setTargetDate(goal.targetDate || '2027-03-31');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !targetAmount) return;

    const numTarget = parseFloat(targetAmount) || 10000;
    const numCurrent = parseFloat(currentAmount) || 0;

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, {
        label: label.trim(),
        type,
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate
      });
    } else {
      onAddGoal({
        label: label.trim(),
        type,
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* GOALS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Financial Milestones & Goals
            </h2>
            <p className="text-xs text-slate-500">Track target funding timelines and reserve cushions</p>
          </div>
          <Button size="sm" variant="primary" onClick={openAddModal} icon={<Plus className="w-4 h-4" />}>
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
            const isCompleted = pct >= 100;

            return (
              <Card key={goal.id} className="flex flex-col justify-between hover:border-indigo-200">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {goal.type === 'emergency_fund' ? 'Emergency Buffer' : goal.type === 'purchase' ? 'Planned Purchase' : 'Savings Target'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                        title="Edit goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete goal "${goal.label}"?`)) {
                            onDeleteGoal(goal.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{goal.label}</h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-400">
                      of {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{pct}% Funded</span>
                    {goal.targetDate && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        Target: {formatDate(goal.targetDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Remaining Deficit:</span>
                  <span className="font-bold text-slate-700 tabular-nums">
                    {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* BUDGET LIMITS SECTION */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Category Monthly Budget Limits</h2>
          <p className="text-xs text-slate-500">Tune spending thresholds that govern decision alerts and monthly reporting</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'Income').map((cat) => {
            const currentLimit = budgets.find((b) => b.category === cat.name)?.monthlyLimit || cat.defaultBudget;

            return (
              <Card key={cat.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                  <span className="text-xs text-slate-400">Monthly Ceiling</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                    <input
                      type="number"
                      value={currentLimit}
                      onChange={(e) => onSetBudget(cat.name, parseFloat(e.target.value) || 0)}
                      className="w-24 pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingGoal ? 'Edit Financial Goal' : 'Create New Financial Goal'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Goa Trip, MacBook Upgrade"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Goal Category / Type
                </label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="savings">General Savings</option>
                  <option value="purchase">Planned Purchase</option>
                  <option value="emergency_fund">Emergency Cushion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Current Funded (₹)
                  </label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
