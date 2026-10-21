import React, { useState } from 'react';
import { MessageSquare, X, ArrowRight } from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

export const WhatsAppFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChat = (customMsg?: string) => {
    const text = encodeURIComponent(
      customMsg || "Hello Jha Accounting Solutions Team, I would like to inquire about your corporate accounting and GST compliance services."
    );
    window.open(`https://wa.me/918882860226?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      
      {/* Quick Prompt Popup */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 max-w-xs w-full space-y-3 text-slate-800 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900">JAS Priority Desk</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Select a quick query or start a direct WhatsApp conversation with our lead accountant:
          </p>

          <div className="space-y-1.5 text-xs font-medium">
            <button
              onClick={() => handleOpenChat("I need assistance with Multi-State GST Filing & GSTR-2B Input Tax Credit Recovery.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors"
            >
              • GST Filing & ITC Recovery
            </button>
            <button
              onClick={() => handleOpenChat("I want to discuss Virtual CFO Advisory and rolling 13-week cash runway modeling.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors"
            >
              • Virtual CFO Advisory
            </button>
            <button
              onClick={() => handleOpenChat("I need corporate cloud bookkeeping on TallyPrime / Zoho Books.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors"
            >
              • Cloud Bookkeeping Scope
            </button>
          </div>

          <button
            onClick={() => handleOpenChat()}
            className="w-full py-2.5 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl transition-all shadow-soft-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-soft-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 border-2 border-white cursor-pointer"
        title="Instant Priority WhatsApp Chat"
        aria-label="WhatsApp Priority Chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

    </div>
  );
};
