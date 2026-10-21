import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface ContactSectionProps {
  onOpenScopeModal: (service?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenScopeModal }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Corporate Accounting & Bookkeeping',
    city: 'New Delhi HQ',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const waText = encodeURIComponent(
      `Hello Jha Accounting Solutions Team, I submitted an inquiry on your website.\n\n• Name: ${formData.name}\n• Company: ${formData.company}\n• Email: ${formData.email}\n• Phone: ${formData.phone}\n• Service: ${formData.service}\n• Location Hub: ${formData.city}\n• Message: ${formData.message || 'N/A'}`
    );
    window.open(`https://wa.me/918882860226?text=${waText}`, '_blank');
  };

  return (
    <section id="contact-advisory" className="py-20 bg-[#F5F7FA] border-b border-slate-200/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#10B981] mb-2 block">
            Direct Client Advisory Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#0B1F3A] tracking-tight">
            Schedule a Corporate Accounting Discovery Session
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Every inquiry is routed directly to a senior financial consultant with a guaranteed 24-business-hour response SLA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Desk Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B1F3A] text-white rounded-2xl p-7 sm:p-8 border border-[#162D4F] shadow-soft-lg space-y-6">
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#10B981] block mb-1">
                  Jha Accounting Solutions
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Corporate Advisory Chambers
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  High-precision corporate accounting, tax compliance, and Virtual CFO advisory services for Indian enterprises &amp; startups.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#162D4F] text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400 font-medium">Direct Advisory Line:</div>
                    <a
                      href={`tel:${JHA_ACCOUNTING_DATA.firm.directMobileRaw}`}
                      className="text-white font-bold hover:text-[#10B981] transition-colors text-sm"
                    >
                      {JHA_ACCOUNTING_DATA.firm.directMobile}
                    </a>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Board Line: {JHA_ACCOUNTING_DATA.firm.primaryPhone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400 font-medium">Corporate Work Email:</div>
                    <a
                      href={`mailto:${JHA_ACCOUNTING_DATA.firm.primaryEmail}`}
                      className="text-white font-semibold hover:text-[#10B981] transition-colors"
                    >
                      {JHA_ACCOUNTING_DATA.firm.primaryEmail}
                    </a>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Advisory Desk: {JHA_ACCOUNTING_DATA.firm.advisoryEmail}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400 font-medium">Operating Schedule:</div>
                    <div className="text-white font-medium">
                      {JHA_ACCOUNTING_DATA.firm.operatingHours}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#162D4F]">
                <a
                  href={JHA_ACCOUNTING_DATA.firm.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Directly on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* SLA Guarantee Callout */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0B1F3A]">
                  Strict Client Confidentiality &amp; NDA
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  All enterprise books, ledgers, and trade data are protected by formal non-disclosure covenants.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Dispatch Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-10 shadow-soft">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold font-display text-[#0B1F3A]">
                  Inquiry Received Successfully
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. A senior financial consultant from Jha Accounting Solutions will reach out to you within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        service: 'Corporate Accounting & Bookkeeping',
                        city: 'New Delhi HQ',
                        message: ''
                      });
                    }}
                    className="text-xs text-[#10B981] font-bold hover:underline cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#10B981] block mb-1">
                    Direct Inquiry Form
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#0B1F3A]">
                    Book an Initial Consultation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below or click "Request Scope" for an instant preliminary scope schedule.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Enterprise Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Logistics India Pvt Ltd"
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="v.sharma@apexlogistics.in"
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Direct Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98100 XXXXX"
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Service of Interest
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                    >
                      <option value="Corporate Accounting & Bookkeeping">Corporate Accounting &amp; Bookkeeping</option>
                      <option value="GST Compliance & ITC Reconciliation">Multi-State GST &amp; ITC Reconciliation</option>
                      <option value="TDS Returns & Payroll Management">TDS Returns &amp; Payroll Management</option>
                      <option value="Virtual CFO Advisory">Virtual CFO Advisory</option>
                      <option value="B2B Accounting Outsourcing">B2B Accounting Outsourcing Pod</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Office Location
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                    >
                      <option value="New Delhi HQ">New Delhi (Netaji Subhash Place HQ)</option>
                      <option value="Gurugram NCR">Gurugram (Sector 44 Delivery Hub)</option>
                      <option value="Mumbai BKC">Mumbai (Bandra Kurla Complex - BKC)</option>
                      <option value="Bengaluru">Bengaluru (Indiranagar)</option>
                      <option value="Virtual Meeting">Virtual Video Conference (Zoom/Meet)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Your Current Accounting Challenge or Volume
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Looking to transition books to Zoho Books, monthly transaction volume around 1,500 invoices, need GST-2B reconciliation and monthly P&L."
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all font-sans"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1F3A] hover:bg-[#132D52] text-white px-7 py-3 rounded-xl text-xs font-bold shadow-soft-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Submit Inquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenScopeModal(formData.service)}
                    className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Or Launch Interactive Scope Assessment →</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
