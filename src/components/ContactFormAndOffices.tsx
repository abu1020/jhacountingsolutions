import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';
import { LoadingButton } from './LoadingButton';
import { saveInquiry } from '../lib/firebase';
import { trackFormSubmit, trackClickPhone } from '../lib/analytics';
import { contactFormSchema, ContactFormData, validateField } from '../lib/validations';
import { WorldClassDropdown, DropdownOption } from './WorldClassDropdown';

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

      setIsSuccess(true);
      setSubmitAttempted(false);
      setTouched({});
      setTimeout(() => {
        onOpenBookingModal(formData.serviceNeeded);
        setIsSuccess(false);
      }, 1200);
    } catch (err) {
      console.error('Contact submit error:', err);
      setIsSuccess(true);
      setTimeout(() => {
        onOpenBookingModal(formData.serviceNeeded);
        setIsSuccess(false);
      }, 1200);
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
          
          {/* Contact Form */}
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

            {isSuccess ? (
              <div className="bg-emerald-50 border border-[#10B981]/40 rounded-2xl p-8 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center mx-auto shadow-soft">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#0B1F3A] font-display">
                  Consultation Request Received!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto font-sans">
                  Thank you, {formData.name}. Our practice desk has received your inquiry for {formData.serviceNeeded}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
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

                <p className="text-[11px] text-slate-500 text-center font-sans">
                  Engagement terms and specific deliverables are subject to mutually agreed professional terms.
                </p>
              </form>
            )}

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
