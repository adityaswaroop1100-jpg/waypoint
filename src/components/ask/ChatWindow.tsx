import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { SUGGESTED_QUESTIONS, SuggestedQuestion } from '../../data/mockQA';
import { Button } from '../ui/Button';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSelectSuggested = (sq: SuggestedQuestion) => {
    onSendMessage(sq.prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-soft-lg overflow-hidden">
      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  isAssistant ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-2 max-w-xl">
                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isAssistant
                      ? msg.isPushback
                        ? 'bg-amber-50/90 text-slate-900 border-2 border-amber-300 rounded-tl-sm shadow-xs'
                        : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-tl-sm shadow-xs'
                      : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  {msg.isPushback && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 pb-1.5 border-b border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Financial Reality Check & Pushback</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Data Points Grid */}
                  {msg.dataPoints && msg.dataPoints.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                      {msg.dataPoints.map((dp, i) => (
                        <div key={i} className="bg-white/90 p-2 rounded-xl border border-slate-200/60">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">{dp.label}</span>
                          <span className="text-xs font-extrabold text-slate-900 tabular-nums">{dp.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action CTA */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => navigate(msg.suggestedAction!.route)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <span className={`text-[10px] text-slate-400 block px-1 ${isAssistant ? '' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 sm:px-6 py-2 bg-slate-50/80 border-t border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Prompts:
          </span>
          {SUGGESTED_QUESTIONS.map((sq) => (
            <button
              key={sq.id}
              onClick={() => handleSelectSuggested(sq)}
              className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shrink-0 text-xs font-medium shadow-2xs"
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything (e.g. Can I afford ₹1.5L vacation in December?)"
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
        />
        <Button
          type="submit"
          disabled={!inputText.trim()}
          variant="primary"
          className="shrink-0 rounded-2xl px-5"
          icon={<Send className="w-4 h-4" />}
        >
          Ask
        </Button>
      </form>
    </div>
  );
};
