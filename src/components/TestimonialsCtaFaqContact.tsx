import React, { useState } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Send,
  Building2,
  Clock,
  Lock
} from 'lucide-react';

interface TestimonialsCtaFaqContactProps {
  onOpenBookingModal: (service?: string) => void;
}

export const TestimonialsCtaFaqContact: React.FC<TestimonialsCtaFaqContactProps> = ({
  onOpenBookingModal
}) => {
  // Testimonials Carousel State (3 placeholder client quotes)
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
  const testimonials = [
    {
      name: 'Vikram Malhotra',
      company: 'Zenith Logistics & Supply Chain Pvt Ltd',
      role: 'Chief Financial Officer',
      quote: 'Jha Accounting Solutions transformed our multi-state GST filing and ITC reconciliation. We saved over ₹42L in eligible tax credits that our previous CA firm missed, with zero late penalties over 3 years.',
      metric: '₹42L+ ITC Recovered',
      location: 'New Delhi HQ'
    },
    {
      name: 'Ananya Sharma',
      company: 'Vanguard SaaS Solutions',
      role: 'Founder & CEO',
      quote: 'Their Virtual CFO advisory gave us institutional-grade MIS reports and 13-week cash runway models that helped us successfully close our Series A round with top-tier venture funds.',
      metric: 'Series A Funded',
      location: 'Bengaluru Office'
    },
    {
      name: 'CA Rajesh Singhania',
      company: 'Singhania & Associates Chartered Accountants',
      role: 'Senior Partner',
      quote: 'We outsource our bulk corporate compliance and bookkeeping to Rishi Jha’s team under our own firm brand. Their white-label precision allows our firm to scale without hiring overshoots.',
      metric: '100% Confidential White-Label',
      location: 'Mumbai Office'
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // FAQ Accordion State (6 specific questions: Pricing, Switching accountants, Data security, GST for multiple states, Turnaround time, White-label terms)
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      question: 'How is your pricing structured for corporate accounting and GST?',
      answer: 'Our pricing is transparent, predictable, and based on monthly transaction volume, employee count, and active GST registrations. We offer fixed monthly retainers starting from ₹15,000/month with zero hidden fees, covering full bookkeeping, GST filings, and monthly MIS.'
    },
    {
      question: 'What is the process for switching our current accountant or CA firm to you?',
      answer: 'Switching is entirely seamless. Our onboarding team handles communication with your previous accountant, requests and secures all opening balances, Tally/ERP backups, and historical GST returns (GSTR-1 & 3B) with zero operational downtime.'
    },
    {
      question: 'How do you ensure enterprise-grade data security and client confidentiality?',
      answer: 'We employ 256-bit SSL encryption, role-based cloud access controls, restricted server environments, and strict Non-Disclosure Agreements (NDAs) signed by all lead accountants and partners. Your financial data never leaves secure compliant servers.'
    },
    {
      question: 'How do you handle multi-state GST registrations and interstate compliance?',
      answer: 'We manage centralized as well as multi-state GST registrations across all 28 states and union territories. Our automated reconciliation engine matches GSTR-2B with purchase registers state-by-state to prevent mismatched ITC and notices.'
    },
    {
      question: 'What is your typical turnaround time for monthly book closing and GST filing?',
      answer: 'We guarantee monthly book closing within 5 days of month-end, followed by GSTR-1 and 3B filings well before statutory deadlines (typically by the 10th and 18th of the month) to ensure zero penalty and absolute peace of mind.'
    },
    {
      question: 'What are the terms for White-Label Accounting partnerships for CA firms?',
      answer: 'Practicing Chartered Accountants can outsource compliance, TDS computation, and bookkeeping to us. We operate 100% invisibly under your firm letterhead and brand guidelines with dedicated dedicated SLA support and confidential B2B retainers.'
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceNeeded: 'Corporate Accounting & Bookkeeping',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Please fill in all required contact fields.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      onOpenBookingModal(formData.serviceNeeded);
    }, 1200);
  };

  // 4 Office Addresses (Map-Style List)
  const offices = [
    {
      city: 'New Delhi (HQ)',
      address: '204, Kanchenjunga Building, 18 Barakhamba Road, Connaught Place, New Delhi - 110001',
      phone: '+91 (011) 4256-8900',
      email: 'delhi@jhaaccounting.com',
      timing: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Gurugram',
      address: 'Tower B, 7th Floor, DLF Cyber City, Phase 2, Sector 24, Gurugram, Haryana - 122002',
      phone: '+91 (0124) 6892-3400',
      email: 'gurugram@jhaaccounting.com',
      timing: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Mumbai',
      address: 'Unit 402, Trade Centre, Bandra Kurla Complex (BKC), Bandra East, Mumbai - 400051',
      phone: '+91 (022) 6198-4500',
      email: 'mumbai@jhaaccounting.com',
      timing: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Bengaluru',
      address: 'No. 45, 100ft Road, Indiranagar 1st Stage, Near Metro Station, Bengaluru - 560038',
      phone: '+91 (080) 4125-9600',
      email: 'bengaluru@jhaaccounting.com',
      timing: 'Mon - Sat: 9:30 AM - 7:00 PM'
    }
  ];

  return (
    <>
      {/* Testimonials Carousel Section */}
      <section className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Trusted by India&apos;s Scaling Leaders
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Hear what CFOs, Founders, and Senior Partners say about our rigor, punctuality, and financial clarity.
            </p>
          </div>

          {/* Testimonial Card Carousel */}
          <div className="max-w-4xl mx-auto bg-[#0B1F3A] rounded-2xl p-8 sm:p-12 shadow-soft-lg border border-[#162D4F] text-white relative">
            <div className="absolute top-6 right-8 text-[#10B981]/20">
              <Quote className="w-16 h-16" />
            </div>

            <div className="space-y-6 relative z-10 min-h-[220px] flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-md border border-[#10B981]/35 inline-block">
                  {testimonials[activeTestimonial].metric}
                </span>

                <p className="text-lg sm:text-xl text-slate-100 italic font-sans leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-[#162D4F] gap-4">
                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {testimonials[activeTestimonial].role}, <strong className="text-white">{testimonials[activeTestimonial].company}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    {activeTestimonial + 1} of {testimonials.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevTestimonial}
                      className="w-9 h-9 rounded-xl bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-white hover:bg-[#10B981] hover:border-[#10B981] transition-all cursor-pointer"
                      aria-label="Previous Testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-9 h-9 rounded-xl bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-white hover:bg-[#10B981] hover:border-[#10B981] transition-all cursor-pointer"
                      aria-label="Next Testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FAQ Accordion Section (6 Questions) */}
      <section className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Clear, transparent answers regarding our retainers, data security, switching accountants, and multi-state compliance.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-base font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] border border-slate-200 flex items-center justify-center text-[#0B1F3A] shrink-0 group-hover:bg-[#ECFDF5] group-hover:text-[#10B981] transition-colors">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed font-sans border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-[#0B1F3A] text-white border-b border-[#162D4F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1E3B66_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-lg border border-[#10B981]/30 inline-block">
            Ready for Absolute Financial Clarity?
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display max-w-3xl mx-auto leading-[1.15]">
            Secure 100% Compliant Accounting &amp; Virtual CFO Advisory Today
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto font-sans">
            Join 450+ scale-ups, enterprises, and CA partner firms enjoying zero penalty SLAs and dedicated senior partner oversight led by Rishi Jha.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onOpenBookingModal('Free Consultation - Final CTA')}
              className="px-8 py-4 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft-lg hover:shadow-soft-xl flex items-center gap-2.5 cursor-pointer group"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+919876543210"
              className="px-8 py-4 text-sm font-bold text-white bg-[#102A4E] hover:bg-[#162D4F] border border-[#1E3B66] rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#10B981]" />
              <span>Call Lead Partner: +91 98765 43210</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section with Form & Map-Style List of 4 Office Addresses */}
      <section id="contact" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Connect With Our Advisory Desk
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Schedule a direct consultation with Lead Partner Rishi Jha or visit any of our 4 corporate offices across India.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7 bg-[#F5F7FA] rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                    Send Us a Message
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Response Guaranteed within 2 Hours
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Secure Form
                </span>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-[#10B981]/40 rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center mx-auto shadow-soft">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0B1F3A] font-display">
                    Consultation Request Received!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-sans">
                    Thank you, {formData.name}. Our lead partner desk has received your inquiry and is opening the secure calendar modal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Rohan Sharma"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Vanguard Technologies Pvt Ltd"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                        Phone Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rohan@vanguard.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Service Needed *
                    </label>
                    <select
                      value={formData.serviceNeeded}
                      onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors cursor-pointer"
                    >
                      <option value="Corporate Accounting & Bookkeeping">Corporate Accounting &amp; Bookkeeping</option>
                      <option value="Multi-State GST Filing & ITC Reconciliation">Multi-State GST Filing &amp; ITC Reconciliation</option>
                      <option value="Virtual CFO Advisory & MIS Reports">Virtual CFO Advisory &amp; MIS Reports</option>
                      <option value="TDS Compliance & Payroll Operations">TDS Compliance &amp; Payroll Operations</option>
                      <option value="White-Label CA Partnership">White-Label CA Partnership for CA Firms</option>
                      <option value="Audit Support & Tax Scrutiny">Audit Support &amp; Tax Scrutiny</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                      Message / Specific Requirement
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your current accounting setup, GST registrations, or team size..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2.5 cursor-pointer group"
                    >
                      <span>Submit Consultation Request</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right Column: Map-Style List of 4 Office Addresses */}
            <div className="lg:col-span-5 space-y-4">
              <div className="pb-2">
                <span className="text-xs font-mono font-bold text-[#10B981] uppercase">
                  Pan-India Presence
                </span>
                <h3 className="text-xl font-bold text-[#0B1F3A] font-display">
                  Our 4 Corporate Office Locations
                </h3>
              </div>

              {offices.map((office, idx) => (
                <div
                  key={idx}
                  className="bg-[#F5F7FA] rounded-2xl p-5 border border-slate-200/80 space-y-3 hover:border-[#10B981]/40 hover:bg-white transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                        {office.city}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Verified Desk
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {office.address}
                  </p>

                  <div className="pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{office.timing.split(':')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  );
};
