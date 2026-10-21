import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

export const FaqAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { faqs } = COMPANY_CONTENT;

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Clear, transparent answers regarding our retainers, data security, switching accountants, and multi-state compliance.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <ScrollReveal key={idx} delayMs={idx * 60}>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <span className="text-base font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] border border-slate-200 flex items-center justify-center text-[#0B1F3A] shrink-0 group-hover:bg-[#ECFDF5] group-hover:text-[#10B981] transition-colors">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed font-sans border-t border-slate-100"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
