import React, { useState } from 'react';
import { PlusCircle, X, Check, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { Transaction } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'Food & Dining');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !merchant.trim()) return;

    const finalAmount = type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    const newTx: Transaction = {
      id: `manual-${Date.now()}`,
      date,
      merchant: merchant.trim(),
      amount: finalAmount,
      category: type === 'income' ? 'Income' : category,
      source: 'csv',
      notes: notes.trim() || undefined
    };

    onAdd(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Add New Transaction</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Income vs Expense Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Income') setCategory(CATEGORIES[0]?.name || 'Food & Dining');
              }}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Income');
              }}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Merchant / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks, Grocery Store, Freelance Gig"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="e.g. 450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          {type === 'expense' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.filter((c) => c.name !== 'Income').map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              placeholder="Optional context or memo"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<Check className="w-4 h-4" />}>
              Save Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
