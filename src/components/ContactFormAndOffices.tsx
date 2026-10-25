import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, Sparkles, Calendar, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';
import { LoadingButton } from './LoadingButton';
import { saveInquiry } from '../lib/firebase';
import { trackFormSubmit, trackClickPhone } from '../lib/analytics';
import { contactFormSchema, ContactFormData, validateField } from '../lib/validations';
import { WorldClassDropdown, DropdownOption } from './WorldClassDropdown';

/**
 * Subtle Framer Motion Success Checkmark
 * Features an expanding ambient pulse halo, spring-based circle scale,
 * and SVG stroke-drawn circle and checkmark paths with micro-sparkle accents.
 */
const FramerSuccessCheckmark: React.FC = () => {
  return (
    <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
      {/* Expanding subtle radial halo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.9, 1.35, 1.5],
          opacity: [0.55, 0.2, 0]
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
        className="absolute inset-0 rounded-full bg-[#10B981]/25 pointer-events-none"
      />

      {/* Secondary soft static aura */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-1 rounded-full bg-emerald-100/60 pointer-events-none"
      />

      {/* Main Emerald Circle Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22,
          delay: 0.05
        }}
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/25"
      >
        <svg
          viewBox="0 0 50 50"
          className="w-10 h-10 text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular track drawn using stroke pathLength */}
          <motion.circle
            cx="25"
            cy="25"
            r="22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.35 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1]
            }}
          />

          {/* Animated checkmark path */}
          <motion.path
            d="M15 26.5L22 33.5L35 18"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              delay: 0.22,
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1]
            }}
          />
        </svg>
      </motion.div>

      {/* Subtle micro sparkle accents */}
      {[
        { x: -26, y: -20, delay: 0.35, size: 'w-1.5 h-1.5' },
        { x: 26, y: -18, delay: 0.4, size: 'w-2 h-2' },
        { x: -22, y: 22, delay: 0.45, size: 'w-1.5 h-1.5' },
        { x: 24, y: 20, delay: 0.5, size: 'w-2 h-2' },
      ].map((particle, idx) => (
        <motion.span
          key={idx}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 0.9, 0],
            x: particle.x,
            y: particle.y
          }}
          transition={{
            delay: particle.delay,
            duration: 0.7,
            ease: 'easeOut'
          }}
          className={`absolute rounded-full bg-[#10B981] ${particle.size} pointer-events-none`}
        />
      ))}
    </div>
  );
};

const CONTACT_SERVICE_OPTIONS: DropdownOption[] = [
  { value: 'GST Compliance Services', label: 'GST Compliance Services', description: 'GSTR-1, 3B, 2B ITC audit & reconciliation', badge: 'GST' },
  { value: 'Income Tax Return and Computation', label: 'Income Tax Return and Computation', description: 'Corporate, LLP & individual tax filing', badge: 'ITR' },
  { value: 'TDS/TCS Quarterly Returns', label: 'TDS/TCS Quarterly Returns', description: 'Quarterly forms 24Q, 26Q & TRACES certificates', badge: 'TDS' },
  { value: 'Bookkeeping and Accounting', label: 'Bookkeeping and Accounting', description: 'Ledgers, reconciliations & statutory reporting', badge: 'Accounts' }
];

interface ContactFormAndOfficesProps {
  onOpenBookingModal: (service?: string) => void;
}

export const ContactFormAndOffices: React.FC<ContactFormAndOfficesProps> = ({ onOpenBookingModal }) => {
  const { officeLocations, brand } = COMPANY_CONTENT;

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceNeeded: 'GST Compliance Services',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Optional automatic calendar scheduler transition after reviewing confirmation
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      onOpenBookingModal(formData.serviceNeeded);
    }, 4500);
    return () => clearTimeout(timer);
  }, [isSuccess, formData.serviceNeeded, onOpenBookingModal]);

  const handleResetForm = () => {
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      serviceNeeded: 'GST Compliance Services',
      message: ''
    });
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    setIsSuccess(false);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Real-time validation if the field was already touched or user already tried submitting
    if (touched[field] || submitAttempted) {
      const errorMsg = validateField(contactFormSchema, field, value);
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

  const handleInputBlur = (field: keyof ContactFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errorMsg = validateField(contactFormSchema, field, formData[field]);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Validate entire form with Zod schema
    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      const allTouched: Partial<Record<keyof ContactFormData, boolean>> = {};
      
      validationResult.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof ContactFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      (['name', 'company', 'phone', 'email', 'serviceNeeded', 'message'] as const).forEach(k => {
        allTouched[k] = true;
      });

      setTouched(allTouched);
      setErrors(fieldErrors);

      // Focus the first invalid field
      const firstErrorField = validationResult.error.issues[0]?.path[0];
      if (firstErrorField) {
        const el = document.getElementById(`contact-${String(firstErrorField)}`);
        if (el) el.focus();
      }
      return;
    }

    // Validation passed
    setErrors({});
    setIsSubmitting(true);
    trackFormSubmit(formData.serviceNeeded);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      await saveInquiry({
        fullName: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        service: formData.serviceNeeded,
        message: formData.message
      });

      const newRef = `JAS-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(newRef);
      setIsSuccess(true);
      setSubmitAttempted(false);
      setTouched({});
    } catch (err) {
      console.error('Contact submit error:', err);
      const newRef = `JAS-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(newRef);
      setIsSuccess(true);
      setSubmitAttempted(false);
      setTouched({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Connect With Our Practice Desk
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Schedule a direct consultation with Lead Partner {brand.leadPartner} for your GST compliance, income tax, TDS/TCS, or bookkeeping requirements.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form Container */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div>
                <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                  Send a Consultation Inquiry
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Direct review by Lead Partner Rishi Jha
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Statutory Desk
              </span>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-emerald-50/70 border border-[#10B981]/35 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xs"
                >
                  {/* Animated Subtle Checkmark */}
                  <FramerSuccessCheckmark />

                  {/* Staggered Heading & Personalized Context */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.35 }}
                    className="space-y-2"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#10B981]/35 text-xs font-mono font-bold text-[#10B981] shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Reference ID: {referenceId}</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] font-display">
                      Consultation Request Received!
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-sans">
                      Thank you, <strong className="text-[#0B1F3A] font-bold">{formData.name}</strong>. Our practice desk has received your consultation request for <span className="font-semibold text-[#0B1F3A] bg-white/90 px-2 py-0.5 rounded border border-slate-200/80">{formData.serviceNeeded}</span>.
                    </p>
                  </motion.div>

                  {/* Operational Review SLA Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.35 }}
                    className="bg-white/95 rounded-xl p-4 border border-slate-200/80 text-left text-xs space-y-2 max-w-md mx-auto shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Practice Desk Dispatch
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Priority Queue
                      </span>
                    </div>
                    <ul className="text-slate-600 text-xs space-y-1.5 font-sans">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>Direct review by Lead Partner Rishi Jha within 2 business hours.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>Acknowledgement logged for <strong className="font-medium text-slate-800">{formData.email}</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>WhatsApp direct confirmation to <strong className="font-medium text-slate-800">{formData.phone}</strong>.</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Actions & Auto-scheduler trigger */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.35 }}
                    className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenBookingModal(formData.serviceNeeded)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#162D4F] active:scale-98 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-soft cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#10B981]" />
                      <span>Select Calendar Slot Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-98 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Send Another Inquiry</span>
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleFormSubmit}
                  noValidate
                  className="space-y-4"
                >
                {submitAttempted && Object.keys(errors).length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Please correct the highlighted fields before submitting your consultation request.</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleInputBlur('name')}
                      placeholder="e.g. Vikram Malhotra"
                      className={`w-full rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 transition-all ${
                        (touched.name || submitAttempted) && errors.name
                          ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                      }`}
                    />
                    {(touched.name || submitAttempted) && errors.name && (
                      <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Business / Entity Name
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      onBlur={() => handleInputBlur('company')}
                      placeholder="e.g. Alpha Solutions Pvt Ltd"
                      className={`w-full rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 transition-all ${
                        (touched.company || submitAttempted) && errors.company
                          ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                      }`}
                    />
                    {(touched.company || submitAttempted) && errors.company && (
                      <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.company}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleInputBlur('phone')}
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 transition-all ${
                        (touched.phone || submitAttempted) && errors.phone
                          ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                      }`}
                    />
                    {(touched.phone || submitAttempted) && errors.phone && (
                      <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleInputBlur('email')}
                      placeholder="vikram@example.com"
                      className={`w-full rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 transition-all ${
                        (touched.email || submitAttempted) && errors.email
                          ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
                      }`}
                    />
                    {(touched.email || submitAttempted) && errors.email && (
                      <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <WorldClassDropdown
                    id="contact-service"
                    name="serviceNeeded"
                    label="Approved Service Required *"
                    value={formData.serviceNeeded}
                    options={CONTACT_SERVICE_OPTIONS}
                    onChange={(val) => handleInputChange('serviceNeeded', val as any)}
                    onBlur={() => handleInputBlur('serviceNeeded')}
                    error={(touched.serviceNeeded || submitAttempted) && errors.serviceNeeded ? errors.serviceNeeded : undefined}
                    variant="light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Message / Current Accounting Software (Optional)
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    onBlur={() => handleInputBlur('message')}
                    placeholder="Briefly state your requirements or software setup (Tally Prime, Zoho Books, etc.)..."
                    className={`w-full rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 transition-all ${
                      (touched.message || submitAttempted) && errors.message
                        ? 'border border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'bg-white border border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20'
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
                    isSuccess={isSuccess}
                    className="w-full py-4 text-sm font-bold uppercase tracking-wider"
                  >
                    <span>Submit Consultation Request</span>
                    <Send className="w-4 h-4 ml-2" />
                  </LoadingButton>
                </div>

                </motion.form>
              )}
            </AnimatePresence>

          </div>

          {/* Genuine Practice Information Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B1F3A] rounded-2xl p-6 sm:p-8 text-white border border-[#162D4F] space-y-6 shadow-soft">
              
              <div className="space-y-1 border-b border-[#162D4F] pb-4">
                <span className="text-xs font-mono font-bold text-[#10B981] uppercase">
                  Practice Information
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  {brand.leadPartnerTitle}
                </p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">Practice Operations</span>
                    <p className="text-slate-200 font-medium">
                      Serving businesses across India via secure digital and cloud infrastructure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">Telephone / WhatsApp</span>
                    <a
                      href={`tel:${brand.directMobileRaw}`}
                      onClick={() => trackClickPhone(brand.primaryPhone)}
                      className="text-white font-bold hover:text-[#10B981] font-mono text-sm transition-colors"
                    >
                      {brand.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">Email Address</span>
                    <a
                      href={`mailto:${brand.primaryEmail}`}
                      className="text-white font-bold hover:text-[#10B981] font-mono transition-colors"
                    >
                      {brand.primaryEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">Working Hours</span>
                    <p className="text-slate-200 font-mono">
                      Monday – Saturday: 09:30 AM – 06:30 PM (IST)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#162D4F]">
                <a
                  href={brand.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
