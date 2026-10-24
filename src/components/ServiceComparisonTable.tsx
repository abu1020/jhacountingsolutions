import React from 'react';
import {
  FileText,
  Calculator,
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface ServiceComparisonTableProps {
  onOpenBookingModal: (service?: string) => void;
}

export const ServiceComparisonTable: React.FC<ServiceComparisonTableProps> = ({
  onOpenBookingModal
}) => {
  const approvedCategories = [
    {
      id: 'gst-compliance',
      title: '1. GST Compliance Services',
      governingAct: 'CGST / SGST / IGST Act, 2017',
      periodicity: 'Monthly / Quarterly & Annual',
      icon: FileText,
      deliverables: [
        'Preparation and filing of monthly/quarterly GSTR-1 and GSTR-3B, as applicable to the client',
        'Monthly Input Tax Credit (ITC) reconciliation between GSTR-2B and the Purchase Register',
        'Preparation of annual GSTR-9 returns and GSTR-9C reconciliation statements'
      ]
    },
    {
      id: 'income-tax',
      title: '2. Income Tax Return and Computation',
      governingAct: 'Income-tax Act, 1961',
      periodicity: 'Quarterly & Annual',
      icon: Calculator,
      deliverables: [
        'Preparation and filing of annual Income Tax Returns under Section 139 of the Income-tax Act, 1961',
        'Computation of total income and quarterly advance tax liability calculations'
      ]
    },
    {
      id: 'tds-tcs',
      title: '3. TDS/TCS Quarterly Returns',
      governingAct: 'Chapter XVII-B, Income-tax Act, 1961',
      periodicity: 'Quarterly Statements',
      icon: ReceiptText,
      deliverables: [
        'Verification of deductee details and applicability of tax deduction under Chapter XVII-B',
        'Preparation and filing of quarterly TDS/TCS returns using Forms 24Q, 26Q, 27Q and 27EQ, as applicable',
        'Assistance with downloading Form 16 and Form 16A from TRACES'
      ]
    },
    {
      id: 'bookkeeping-accounting',
      title: '4. Bookkeeping and Accounting',
      governingAct: 'Indian Accounting Standards & ICAI Framework',
      periodicity: 'Periodic & Year-End',
      icon: ShieldCheck,
      deliverables: [
        'Periodic ledger review and accounting-entry verification',
        'Trial balance review and finalisation',
        'Finalisation of the Balance Sheet, Profit and Loss Account, and Cash Flow Statement'
      ]
    }
  ];

  return (
    <section id="approved-scope" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase">
            Approved Practice Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            Approved Scope &amp; Statutory Deliverables
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            Our firm delivers services strictly within the four approved categories outlined below. All deliverables are subject to mutually agreed terms and client applicability.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#10B981] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] font-display">
                        {cat.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        {cat.governingAct}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30 shrink-0">
                    {cat.periodicity}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Approved Deliverables:
                  </span>
                  {cat.deliverables.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-sans leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={() => onOpenBookingModal(cat.title)}
                    className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Inquire for Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
