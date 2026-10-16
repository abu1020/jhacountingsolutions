import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  HelpCircle,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface FAQSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBookingModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const faqs = JHA_ACCOUNTING_DATA.faqs || [];

  const categories = ['All', 'GST & Compliance', 'Income Tax & TDS', 'Bookkeeping & Software', 'Virtual CFO & Pricing'];

  // Filter FAQs based on search query and active category
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuestion = faq.question.toLowerCase().includes(query);
      const matchesAnswer = faq.answer.toLowerCase().includes(query);
      const matchesTags = faq.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && (matchesQuestion || matchesAnswer || matchesTags);
    });
  }, [faqs, searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  // Helper function to highlight matching search term
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-slate-900 rounded-xs px-1 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <section id="faq" className="py-20 bg-slate-100/70 border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tax &amp; Accounting Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Tax &amp; GST Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Search our curated repository of corporate GST regulations, TDS section 194Q rules, bookkeeping workflows, and Virtual CFO deliverables.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="max-w-2xl mx-auto relative shadow-lg rounded-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-emerald-600 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search query e.g., GSTR-3B, 194Q TDS, LUT filing, Tally, Virtual CFO fees..."
              className="w-full pl-12 pr-12 py-4 bg-white text-slate-900 placeholder:text-slate-400 font-sans text-sm rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              aria-label="Search FAQ questions"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 px-1 text-xs text-slate-500">
            <span className="font-mono text-[11px] uppercase text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-emerald-600" /> Popular:
            </span>
            {['GSTR-3B', 'Section 194Q', 'LUT Export', 'Tally Cloud', 'Virtual CFO'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all text-[11px] font-medium shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                selectedCategory === cat
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-950/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                    isOpen ? 'border-emerald-500/60 ring-2 ring-emerald-500/10 shadow-md' : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors pt-1">
                        {renderHighlightedText(faq.question, searchQuery)}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-xl transition-all shrink-0 mt-1 ${
                      isOpen ? 'bg-emerald-500 text-white rotate-180 shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-600 leading-relaxed space-y-4">
                          <p>{renderHighlightedText(faq.answer, searchQuery)}</p>
                          
                          {/* FAQ Tags & CTA */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/80">
                            <div className="flex flex-wrap gap-1.5">
                              {faq.tags.map((t, tIdx) => (
                                <span key={tIdx} className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  #{t}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => onOpenBookingModal(faq.question)}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors group/btn"
                            >
                              <span>Consult Senior GST Expert</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center bg-white p-10 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No matching questions found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We couldn't find any FAQ matching "{searchQuery}". Have a specific GST or tax inquiry?
                </p>
              </div>
              <button
                onClick={() => onOpenBookingModal(`Query about: ${searchQuery}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Our Lead Tax Consultant Directly</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#0A1128] text-white p-6 sm:p-8 rounded-2xl border border-[#1E2B52] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Guaranteed 24-Hour SLA</span>
            </div>
            <h4 className="text-lg font-bold text-white">Have a Complex Statutory or GST Tax Query?</h4>
            <p className="text-xs text-slate-300">
              Speak with a Senior Lead Tax Consultant for personalized advisory and notice analysis.
            </p>
          </div>
          <button
            onClick={() => onOpenBookingModal()}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 shrink-0"
          >
            <span>Schedule Advisory Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
