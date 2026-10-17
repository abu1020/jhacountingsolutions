import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

import { saveInquiry } from '../lib/firebase';

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
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessStage, setBusinessStage] = useState<'New Startup' | 'SMB' | 'Enterprise' | 'Individual'>('SMB');
  const [serviceNeeded, setServiceNeeded] = useState<string>(preselectedService || 'Corporate Accounting & Bookkeeping');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam protection

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setServiceNeeded(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!workEmail.trim() || !emailRegex.test(workEmail)) {
      errs.workEmail = 'Please provide a valid business email address';
    }

    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      errs.phone = 'Please provide a valid contact or WhatsApp number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot check
    if (honeypot) {
      return; // Silent reject for spam bots
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save to Firestore Database
      await saveInquiry({
        fullName,
        email: workEmail,
        phone,
        company: businessStage,
        service: serviceNeeded,
        message
      });

      const ref = `JAS-REQ-${Date.now().toString().slice(-6)}`;
      setReferenceId(ref);
      setIsSubmitted(true);

      // Automatically open WhatsApp pre-filled with form details
      const waText = encodeURIComponent(
        `Hello Jha Accounting Solutions Team, I submitted a consultation intake form (${ref}).\n\n• Name: ${fullName}\n• Email: ${workEmail}\n• Phone: ${phone}\n• Business Scale: ${businessStage}\n• Service Required: ${serviceNeeded}\n• Message: ${message || 'N/A'}`
      );
      window.open(`https://wa.me/918882860226?text=${waText}`, '_blank');
    } catch (err) {
      console.error('Submission error:', err);
      const ref = `JAS-REQ-${Date.now().toString().slice(-6)}`;
      setReferenceId(ref);
      setIsSubmitted(true);

      const waText = encodeURIComponent(
        `Hello Jha Accounting Solutions Team, I submitted a consultation intake form (${ref}).\n\n• Name: ${fullName}\n• Email: ${workEmail}\n• Phone: ${phone}\n• Business Scale: ${businessStage}\n• Service Required: ${serviceNeeded}\n• Message: ${message || 'N/A'}`
      );
      window.open(`https://wa.me/918882860226?text=${waText}`, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hello Jha Accounting Solutions Team, I submitted a consultation request (${referenceId}). Name: ${fullName}, Email: ${workEmail}, Phone: ${phone}, Business Stage: ${businessStage}, Service Needed: ${serviceNeeded}. Message: ${message}`
    );
    window.open(`https://wa.me/918882860226?text=${text}`, '_blank');
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(1);
    setFullName('');
    setWorkEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Consultation Intake</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Book Your Free 24-Hour Scope Assessment
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Receive a tailored accounting proposal and dedicated lead accountant allocation within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Spam protection honeypot (hidden) */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Service Selection (Selectable Pills) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  1. Select Service Area Needed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Corporate Accounting & Bookkeeping',
                    'GST Compliance & ITC Reconciliation',
                    'TDS Returns & Payroll Management',
                    'Virtual CFO Advisory',
                    'B2B Accounting Outsourcing'
                  ].map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setServiceNeeded(srv)}
                      className={`py-2 px-3 rounded-xl border text-left font-medium transition-all ${
                        serviceNeeded === srv
                          ? 'bg-navy-dark text-white border-navy-dark shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Stage */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  2. Business Scale / Stage
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(['New Startup', 'SMB', 'Enterprise', 'Individual'] as const).map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setBusinessStage(stg)}
                      className={`py-2 text-center rounded-lg border font-medium transition-all ${
                        businessStage === stg
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  3. Your Contact Credentials
                </label>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                        errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.fullName && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.fullName}</span>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Work Email Address *"
                      value={workEmail}
                      onChange={(e) => {
                        setWorkEmail(e.target.value);
                        if (errors.workEmail) setErrors(prev => ({ ...prev, workEmail: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                        errors.workEmail ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.workEmail && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.workEmail}</span>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number *"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.phone}</span>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Key Business Challenge / Notes (Optional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Scope Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Consultation Request (Guaranteed 24-Hr Response)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ISO Data Confidentiality Policy
                </span>
                <span>No spam · Dedicated lead assigned</span>
              </div>

            </form>
          </div>
        ) : (
          /* Instant Confirmation State */
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Request Confirmed · Ref #{referenceId}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 pt-2">
                Thank You, {fullName}!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your consultation request for <strong className="text-slate-900">{serviceNeeded}</strong> has been assigned to our senior lead accountant. You will receive a detailed proposal at <strong className="text-slate-900">{workEmail}</strong> within 24 hours.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 max-w-md mx-auto text-left text-xs">
              <span className="font-bold text-slate-900 block">Need Instant Priority Response?</span>
              <p className="text-slate-600 text-[11px]">
                Connect immediately with our advisory desk on WhatsApp for instant scope discussions:
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Instant WhatsApp Priority Chat</span>
              </button>
            </div>

            <button
              onClick={resetForm}
              className="px-6 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Return to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
