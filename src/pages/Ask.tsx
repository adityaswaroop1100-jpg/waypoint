import React from 'react';
import { MessageSquareText, Sparkles, ShieldCheck } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { ChatWindow } from '../components/ask/ChatWindow';

export const Ask: React.FC = () => {
  const chatMessages = useWaypointStore((s) => s.chatMessages);
  const sendChatMessage = useWaypointStore((s) => s.sendChatMessage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-indigo-600" />
            Pushback Copilot
          </h2>
          <p className="text-xs text-slate-500">
            Ask natural-language financial questions. If your assumption conflicts with real runway or committed obligations, Waypoint pushes back with exact numbers — not flattery.
          </p>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero-hallucination · Local Engine
        </span>
      </div>

      <ChatWindow
        messages={chatMessages}
        onSendMessage={sendChatMessage}
      />
    </div>
  );
};
