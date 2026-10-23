import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Send, Phone, MessageSquare } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { saveInquiry } from '../lib/firebase';
import { LoadingButton } from './LoadingButton';

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

  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessStage, setBusinessStage] = useState<'New Startup' | 'SMB' | 'Enterprise' | 'Individual'>('SMB');
  const [serviceNeeded, setServiceNeeded] = useState<string>(preselectedService || 'Corporate Accounting & Bookkeeping');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setServiceNeeded(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !phone.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
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
    } catch (err) {
      console.error('Error submitting consultation modal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setWorkEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-soft-lg border border-[#162D4F] w-full max-w-xl overflow-hidden z-10 my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#132D52] border-b border-[#162D4F] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#10B981] uppercase block">
              Free Consultation Desk
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
              Schedule Consultation with Rishi Jha
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation */}
        <div className="p-6 sm:p-8 space-y-6">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-[#10B981] text-white rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white font-display">Consultation Dispatched!</h4>
                <p className="text-xs font-mono text-[#10B981]">Reference ID: {referenceId}</p>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto pt-2 font-sans">
                  Thank you, {fullName}. Our lead partner desk has received your request for {serviceNeeded}. We will contact you at {phone} within 2 hours.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={brand.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-soft"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Quick Chat on WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-200 text-xs font-mono border border-[#162D4F] rounded-xl transition-colors"
                >
                  Close Modal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="modal-name" className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Your Full Name *
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="modal-email" className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Work Email *
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="rohan@vanguard.com"
                    className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="modal-phone" className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-service" className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Service Area *
                </label>
                <select
                  id="modal-service"
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#10B981] font-mono cursor-pointer"
                >
                  <option value="B2B White-Label Accounting Outsourcing (Talkable Pricing & Free Pilot)">★ B2B Outsourcing (Talkable Pricing, Custom Discounts &amp; Free Pilot)</option>
                  <option value="Corporate Accounting & Bookkeeping">Corporate Accounting &amp; Bookkeeping</option>
                  <option value="Multi-State GST Filing & ITC Reconciliation">Multi-State GST Filing &amp; ITC Reconciliation</option>
                  <option value="Virtual CFO Advisory & MIS Reports">Virtual CFO Advisory &amp; MIS Reports</option>
                  <option value="TDS Compliance & Payroll Operations">TDS Compliance &amp; Payroll Operations</option>
                  <option value="White-Label CA Partnership">White-Label CA Partnership for CA Firms</option>
                  <option value="Audit Support & Tax Scrutiny">Audit Support &amp; Tax Scrutiny</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-msg" className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Requirement Details (Optional)
                </label>
                <textarea
                  id="modal-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your current accounting software, GST states, or team size..."
                  className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>

              <div className="pt-2">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  isSuccess={isSubmitted}
                  className="w-full py-3.5 text-xs font-bold uppercase tracking-wider"
                >
                  <span>Submit Advisory Request</span>
                  <Send className="w-4 h-4 ml-1.5" />
                </LoadingButton>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
