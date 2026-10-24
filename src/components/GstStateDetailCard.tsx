import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, FileCheck, Scale, ArrowRight, Copy, Check } from 'lucide-react';
import { StateGstProfile } from '../data/stateGstData';
import { crossfadePanel, staggerContainer, fadeUp, tapScale } from '../lib/motion';

interface GstStateDetailCardProps {
  state: StateGstProfile;
  onOpenBookingModal: (service?: string) => void;
  titlePrefix?: string;
}

/**
 * Detail panel for the interactive GST map.
 * The parent (IndiaGstMap) mounts this inside <AnimatePresence mode="wait">
 * keyed by `state.id`, so switching states cross-fades instead of the
 * previous hard content swap that disoriented users comparing states.
 */
export const GstStateDetailCard: React.FC<GstStateDetailCardProps> = ({
  state,
  onOpenBookingModal,
  titlePrefix = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(state.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (insecure context) — fail silently, code stays visible.
    }
  };

  return (
    <motion.article
      variants={crossfadePanel}
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-label={`${state.name} GST compliance profile`}
      className="bg-navy-850 rounded-2xl p-6 sm:p-8 text-white border border-navy-600 shadow-soft-lg space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-600 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label={`Copy GST state code ${state.code} for ${state.name}`}
              className="text-xs font-mono font-bold text-corporate-emerald bg-corporate-emerald/15 px-2.5 py-0.5 rounded border border-corporate-emerald/30 inline-flex items-center gap-1.5 hover:bg-corporate-emerald/25 transition-colors cursor-pointer"
            >
              <span>State Code: {state.code}</span>
              {copied ? (
                <Check className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Copy className="w-3 h-3 opacity-70" aria-hidden="true" />
              )}
              <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              Region: {state.region}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1">
            {titlePrefix}{state.name} GST Compliance Profile
          </h3>
        </div>

        <span className="text-xs font-mono font-bold text-slate-300 bg-navy-800 px-3 py-1 rounded-lg border border-navy-500 self-start sm:self-auto">
          Hub: {state.deliveryHub}
        </span>
      </div>

      {/* Primary Details — stagger in on every state switch.
          Full legal text is shown (previously line-clamp-1 truncated
          e-Way exemptions / PT rules mid-sentence — unacceptable for
          compliance content a user may act on). */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div variants={fadeUp} className="bg-navy-800 rounded-xl p-4 border border-navy-500 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <Building className="w-3.5 h-3.5 text-corporate-emerald" aria-hidden="true" />
            <span>Intra-State e-Way Bill</span>
          </div>
          <p className="text-sm font-bold text-white font-display tabular-nums">
            Limit: {state.ewayBillThresholdIntraState}
          </p>
          <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
            {state.ewayBillExemptions}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-navy-800 rounded-xl p-4 border border-navy-500 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <FileCheck className="w-3.5 h-3.5 text-corporate-emerald" aria-hidden="true" />
            <span>Professional Tax (PT)</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">
            Deadline: {state.ptReturnDeadline}
          </p>
          <p className="text-[11px] leading-relaxed text-corporate-emerald font-semibold font-sans">
            {state.professionalTaxRules}
          </p>
        </motion.div>
      </motion.div>

      {/* Sector Rules & Audit Directives */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-4 h-4" aria-hidden="true" />
          <span>Key Compliance Nuances</span>
        </h4>

        <div className="bg-navy-800 rounded-xl p-4 border border-navy-500 space-y-2">
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-none">
            {state.keyComplianceNuances.map((nuance) => (
              <li key={nuance} className="flex items-start gap-2">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-corporate-emerald shrink-0" aria-hidden="true" />
                <span>{nuance}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-navy-500 text-[11px] font-mono text-slate-400">
            Jurisdiction: {state.localTaxOffice}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <motion.button
          type="button"
          onClick={() => onOpenBookingModal(`${state.name} GST Compliance Desk`)}
          whileHover={{ y: -1 }}
          whileTap={tapScale}
          className="w-full py-3.5 px-4 text-xs font-bold text-white bg-corporate-emerald hover:bg-corporate-emerald-hover rounded-xl transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Retain {state.name} GST Desk</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </motion.button>
      </div>

    </motion.article>
  );
};
