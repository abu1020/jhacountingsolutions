import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReceiptText,
  Calculator,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
  FileCheck2,
  FolderOpen
} from 'lucide-react';
import {
  DOCUMENT_CATEGORIES,
  REQUIRED_DOCUMENTS,
  DocumentCategoryInfo,
  DocumentItem
} from '../data/requiredDocumentsData';
import { ScrollReveal } from './ScrollReveal';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface RequiredDocumentsSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ReceiptText,
  Calculator,
  ShieldCheck,
  BookOpen
};

const STORAGE_KEY = 'jha_docs_readiness_checklist';

export const RequiredDocumentsSection: React.FC<RequiredDocumentsSectionProps> = ({
  onOpenBookingModal
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<'gst' | 'itr' | 'tds' | 'bookkeeping'>('gst');
  const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // Fallback if storage unavailable or corrupted
    }
    return new Set<string>();
  });

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkedDocIds)));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [checkedDocIds]);

  const activeCategory = useMemo(() => {
    return DOCUMENT_CATEGORIES.find((cat) => cat.id === activeCategoryId) || DOCUMENT_CATEGORIES[0];
  }, [activeCategoryId]);

  const categoryDocs = useMemo(() => {
    return REQUIRED_DOCUMENTS.filter((doc) => doc.category === activeCategoryId);
  }, [activeCategoryId]);

  // Readiness Calculations
  const totalCount = categoryDocs.length;
  const readyCount = useMemo(() => {
    return categoryDocs.filter((doc) => checkedDocIds.has(doc.id)).length;
  }, [categoryDocs, checkedDocIds]);

  const readinessPercent = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  const toggleDoc = (id: string) => {
    setCheckedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllCategory = () => {
    setCheckedDocIds((prev) => {
      const next = new Set(prev);
      categoryDocs.forEach((doc) => next.add(doc.id));
      return next;
    });
  };

  const handleClearCategory = () => {
    setCheckedDocIds((prev) => {
      const next = new Set(prev);
      categoryDocs.forEach((doc) => next.delete(doc.id));
      return next;
    });
  };

  const handleCopyChecklist = () => {
    const lines = [
      `📋 JHA ACCOUNTING SOLUTIONS — REQUIRED DOCUMENTS CHECKLIST`,
      `Service: ${activeCategory.title}`,
      `Statutory Cycle: ${activeCategory.frequency}`,
      `Readiness Progress: ${readyCount}/${totalCount} documents prepared (${readinessPercent}% ready)\n`,
      `DOCUMENTS LIST:`
    ];

    categoryDocs.forEach((doc, idx) => {
      const isReady = checkedDocIds.has(doc.id);
      const mark = isReady ? '[✓ READY]' : '[  PENDING]';
      const mandatoryTag = doc.isMandatory ? '(Mandatory)' : '(If Applicable)';
      lines.push(`${idx + 1}. ${mark} ${doc.name} ${mandatoryTag}`);
      lines.push(`   - Format: ${doc.recommendedFormat}`);
      lines.push(`   - Purpose: ${doc.statutoryReason}`);
    });

    lines.push(`\nLead Partner: ${JHA_ACCOUNTING_DATA.leaders[0]?.name || 'Rishi Jha'}`);
    lines.push(`Confidential Consultation: ${JHA_ACCOUNTING_DATA.firm.primaryPhone} | ${JHA_ACCOUNTING_DATA.firm.primaryEmail}`);
    lines.push(`Desk: https://jhacountingsolution.vercel.app`);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2400);
    }).catch(() => {
      // Fallback
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const IconComponent = ICON_MAP[activeCategory.iconName] || ReceiptText;

  return (
    <section
      id="required-documents"
      className="py-20 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider">
              <FolderOpen className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Client Preparation Desk</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Required Documents Checklist Before You File
            </h2>
            <p className="text-slate-600 text-base font-sans">
              To avoid statutory delay and ensure error-free reconciliation, verify your documentation checklist below for GST, Income Tax, TDS/TCS, or Bookkeeping services before booking your consultation.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            const TabIcon = ICON_MAP[cat.iconName] || ReceiptText;
            const catDocs = REQUIRED_DOCUMENTS.filter((d) => d.category === cat.id);
            const catReady = catDocs.filter((d) => checkedDocIds.has(d.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2.5 shadow-2xs ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white shadow-soft font-bold'
                    : 'bg-white text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 border border-slate-200/90'
                }`}
                role="tab"
                aria-selected={isActive}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                <span>{cat.shortTitle}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-[#10B981] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {catReady}/{catDocs.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          
          {/* Active Category Header Banner */}
          <div className="bg-[#0B1F3A] text-white p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#10B981] border border-white/15">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider block">
                      {activeCategory.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {activeCategory.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
                  {activeCategory.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-sans">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <strong className="text-slate-200">Statutory Frequency:</strong> {activeCategory.frequency}
                  </span>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="text-emerald-300 font-medium">
                    💡 {activeCategory.leadTimeNotice}
                  </span>
                </div>
              </div>

              {/* Readiness Card & Quick Action Buttons */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 sm:p-5 shrink-0 min-w-[260px] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">Readiness Score</span>
                  <span className="font-mono font-bold text-white">
                    {readyCount} of {totalCount} ({readinessPercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                    style={{ width: `${readinessPercent}%` }}
                    animate={{ width: `${readinessPercent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>{readinessPercent === 100 ? '🎉 All documents ready!' : readinessPercent > 50 ? '👍 Good progress' : '📌 Check off ready files'}</span>
                  <button
                    onClick={handleSelectAllCategory}
                    className="text-[#10B981] hover:underline cursor-pointer font-medium"
                  >
                    Select All
                  </button>
                </div>

                {/* Checklist Action Buttons */}
                <div className="pt-2 border-t border-white/15 flex items-center gap-2">
                  <button
                    onClick={handleCopyChecklist}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy formatted checklist to clipboard"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                        <span>Copy List</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="py-1.5 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Print checklist"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-300" />
                    <span>Print</span>
                  </button>

                  {readyCount > 0 && (
                    <button
                      onClick={handleClearCategory}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Reset checklist for this category"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Interactive Document Items List */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>Interactive Checklist ({categoryDocs.length} items)</span>
              <span className="text-[11px] font-sans text-slate-400">Click anywhere on an item to mark ready</span>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-3.5"
              >
                {categoryDocs.map((doc) => {
                  const isChecked = checkedDocIds.has(doc.id);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/50 border-[#10B981]/50 shadow-2xs'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        
                        {/* Custom Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                            isChecked
                              ? 'bg-[#10B981] border-[#10B981] text-white'
                              : 'bg-white border-slate-300 hover:border-[#10B981]'
                          }`}
                        >
                          {isChecked ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <div className="w-2 h-2 rounded-xs bg-transparent" />
                          )}
                        </div>

                        {/* Document Content */}
                        <div className="flex-grow space-y-1.5">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`text-sm sm:text-base font-bold font-display ${
                                isChecked ? 'text-[#0B1F3A]' : 'text-[#0B1F3A]'
                              }`}
                            >
                              {doc.name}
                            </h4>

                            <div className="flex items-center gap-2">
                              {/* Mandatory vs Conditional Badge */}
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                  doc.isMandatory
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200/80'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {doc.isMandatory ? 'Mandatory' : 'As Applicable'}
                              </span>

                              {/* Format Pill */}
                              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200/80 px-2 py-0.5 rounded-md hidden sm:inline-block">
                                {doc.recommendedFormat}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 font-sans leading-relaxed">
                            {doc.description}
                          </p>

                          {/* Mobile format indicator */}
                          <div className="sm:hidden pt-0.5">
                            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Format: {doc.recommendedFormat}
                            </span>
                          </div>

                          {/* Statutory reason and tip */}
                          <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-sans">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{doc.statutoryReason}</span>
                            </span>
                            {doc.tips && (
                              <span className="text-slate-500 italic">
                                💡 {doc.tips}
                              </span>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Document Handling & Confidentiality Assurance */}
            <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
                    Professional Confidentiality &amp; Security Protocol
                  </h5>
                  <p className="text-xs text-slate-600 font-sans">
                    Client records are processed under strict statutory privacy standards. Transmit documents securely to Lead Partner Rishi Jha via encrypted email ({JHA_ACCOUNTING_DATA.firm.primaryEmail}) or verified WhatsApp ({JHA_ACCOUNTING_DATA.firm.primaryPhone}).
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingModal(activeCategory.serviceBookingName)}
                className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-soft hover:shadow-soft-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 font-display"
              >
                <span>Book {activeCategory.shortTitle} Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
