import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Send, MessageSquare, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { saveInquiry } from '../lib/firebase';
import { LoadingButton } from './LoadingButton';
import { useDialog } from '../hooks/useDialog';
import { consultationModalSchema, ConsultationModalData, validateField } from '../lib/validations';

interface ContactConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ContactConsultationModal: React.FC<ContactConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const { brand } = COMPANY_CONTENT;

  const [formData, setFormData] = useState<ConsultationModalData>({
    fullName: '',
    workEmail: '',
    phone: '',
    businessType: 'Private Limited',
    serviceNeeded: (preselectedService as any) || 'GST Compliance Services',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationModalData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ConsultationModalData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceNeeded: preselectedService as any }));
    }
  }, [preselectedService]);

  useDialog(isOpen, onClose);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof ConsultationModalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field] || submitAttempted) {
      const errorMsg = validateField(consultationModalSchema, field, value);
      setErrors(prev => {
        const next = { ...prev };
        if (errorMsg) {
          next[field] = errorMsg;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleInputBlur = (field: keyof ConsultationModalData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errorMsg = validateField(consultationModalSchema, field, formData[field]);
    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) {
        next[field] = errorMsg;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const validationResult = consultationModalSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ConsultationModalData, string>> = {};
      const allTouched: Partial<Record<keyof ConsultationModalData, boolean>> = {};

      validationResult.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof ConsultationModalData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      (['fullName', 'workEmail', 'phone', 'businessType', 'serviceNeeded', 'message'] as const).forEach(k => {
        allTouched[k] = true;
      });

      setTouched(allTouched);
      setErrors(fieldErrors);

      const firstErrorField = validationResult.error.issues[0]?.path[0];
      if (firstErrorField) {
        const el = document.getElementById(`modal-${String(firstErrorField)}`);
        if (el) el.focus();
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await saveInquiry({
        fullName: formData.fullName,
        email: formData.workEmail,
        phone: formData.phone,
        company: formData.businessType,
        service: formData.serviceNeeded,
        message: formData.message
      });

      const ref = `JAS-${Date.now().toString().slice(-6)}`;
      setReferenceId(ref);
      setIsSubmitted(true);
      setSubmitAttempted(false);
      setTouched({});
    } catch (err) {
      console.error('Error submitting consultation modal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      workEmail: '',
      phone: '',
      businessType: 'Private Limited',
      serviceNeeded: 'GST Compliance Services',
      message: ''
    });
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#0B1F3A]/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-label="Schedule a consultation" className="relative bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header (CSS Selector 2) */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#F8FAFC] to-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/25 text-[#10B981] text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Statutory Consultation Desk</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Schedule Service Consultation
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Direct review by Lead Partner Rishi Jha · Confirmed response within business hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#0B1F3A] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Close consultation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation (CSS Selector 1) */}
        <div className="p-6 sm:p-8 space-y-5 bg-white text-slate-700 overflow-hidden">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="consultation-success"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-5 py-4 bg-emerald-50/70 border border-[#10B981]/30 rounded-2xl p-6 sm:p-8 shadow-2xs"
              >
                {/* Subtle Animated Checkmark with Pulsing Aura */}
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.35, 1.45], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-2xl bg-[#10B981]/25 pointer-events-none"
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.08 }}
                    className="w-16 h-16 bg-gradient-to-tr from-[#059669] to-[#10B981] text-white rounded-2xl flex items-center justify-center shadow-soft relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.22, type: 'spring', stiffness: 400, damping: 24 }}
                    >
                      <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Staggered Heading & Context */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="space-y-2"
                >
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] font-display">
                    Consultation Request Received
                  </h4>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 border border-[#10B981]/35 text-xs font-mono font-bold text-[#10B981] shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Reference ID: {referenceId}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto pt-1 font-sans">
                    Thank you, <strong className="text-[#0B1F3A] font-bold">{formData.fullName}</strong>. We have logged your inquiry for <span className="font-semibold text-[#0B1F3A] bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">{formData.serviceNeeded}</span>. Lead Partner Rishi Jha will review your statutory scope and reach out shortly.
                  </p>
                </motion.div>

                {/* What Happens Next Guidance Box */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 text-left text-xs space-y-1.5 shadow-2xs max-w-md mx-auto"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    What Happens Next
                  </span>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                    <span>Direct statutory scope review by Lead Partner Rishi Jha</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                    <span>Response dispatched to <span className="font-mono font-semibold text-[#0B1F3A]">{formData.workEmail}</span></span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="pt-2 flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <a
                    href={brand.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-soft active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect on WhatsApp</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#0B1F3A] text-xs font-bold font-mono border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    Close Desk
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="consultation-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.2 } }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
              {submitAttempted && Object.keys(errors).length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Please correct the highlighted fields before submitting your consultation request.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="modal-fullName" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                  Your Full Name *
                </label>
                <input
                  id="modal-fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleInputBlur('fullName')}
                  placeholder="e.g. Vikram Malhotra"
                  className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 font-sans transition-all shadow-2xs ${
                    (touched.fullName || submitAttempted) && errors.fullName
                      ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                  }`}
                />
                {(touched.fullName || submitAttempted) && errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-workEmail" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Email Address *
                  </label>
                  <input
                    id="modal-workEmail"
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => handleInputChange('workEmail', e.target.value)}
                    onBlur={() => handleInputBlur('workEmail')}
                    placeholder="vikram@entity.com"
                    className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 font-sans transition-all shadow-2xs ${
                      (touched.workEmail || submitAttempted) && errors.workEmail
                        ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                    }`}
                  />
                  {(touched.workEmail || submitAttempted) && errors.workEmail && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{errors.workEmail}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="modal-phone" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleInputBlur('phone')}
                    placeholder="+91 98765 43210"
                    className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 font-sans transition-all shadow-2xs ${
                      (touched.phone || submitAttempted) && errors.phone
                        ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                    }`}
                  />
                  {(touched.phone || submitAttempted) && errors.phone && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-businessType" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Entity Type
                  </label>
                  <select
                    id="modal-businessType"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value as any)}
                    onBlur={() => handleInputBlur('businessType')}
                    className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 font-sans cursor-pointer transition-all shadow-2xs ${
                      (touched.businessType || submitAttempted) && errors.businessType
                        ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                    }`}
                  >
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Proprietorship / Partnership">Proprietorship / Partnership</option>
                    <option value="Individual">Individual Assessee</option>
                  </select>
                  {(touched.businessType || submitAttempted) && errors.businessType && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{errors.businessType}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="modal-serviceNeeded" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Approved Service Required *
                  </label>
                  <select
                    id="modal-serviceNeeded"
                    value={formData.serviceNeeded}
                    onChange={(e) => handleInputChange('serviceNeeded', e.target.value as any)}
                    onBlur={() => handleInputBlur('serviceNeeded')}
                    className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 font-sans cursor-pointer transition-all shadow-2xs ${
                      (touched.serviceNeeded || submitAttempted) && errors.serviceNeeded
                        ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                    }`}
                  >
                    <option value="GST Compliance Services">GST Compliance Services</option>
                    <option value="Income Tax Return and Computation">Income Tax Return and Computation</option>
                    <option value="TDS/TCS Quarterly Returns">TDS/TCS Quarterly Returns</option>
                    <option value="Bookkeeping and Accounting">Bookkeeping and Accounting</option>
                  </select>
                  {(touched.serviceNeeded || submitAttempted) && errors.serviceNeeded && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{errors.serviceNeeded}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-message" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                  Details / Specific Notes (Optional)
                </label>
                <textarea
                  id="modal-message"
                  rows={3}
                  value={formData.message || ''}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  onBlur={() => handleInputBlur('message')}
                  placeholder="Describe your current software (Tally, Zoho Books, etc.) or specific compliance requirements..."
                  className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0B1F3A] placeholder-slate-400 focus:outline-none focus:ring-2 font-sans transition-all shadow-2xs resize-none ${
                    (touched.message || submitAttempted) && errors.message
                      ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'bg-[#F8FAFC] focus:bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                  }`}
                />
                {(touched.message || submitAttempted) && errors.message && (
                  <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  isSuccess={isSubmitted}
                  className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl shadow-soft hover:shadow-soft-md transition-all active:scale-[0.98]"
                >
                  <span>Submit Consultation Request</span>
                  <Send className="w-4 h-4 ml-1.5" />
                </LoadingButton>
              </div>

              <p className="text-[11px] text-slate-500 text-center font-sans">
                Specific service scope is subject to mutually agreed engagement terms and client applicability.
              </p>
            </motion.form>
          )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
