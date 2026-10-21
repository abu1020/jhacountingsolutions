import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

export const TestimonialsCarousel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { testimonials } = COMPANY_CONTENT;

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
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
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <div className="max-w-4xl mx-auto bg-[#0B1F3A] rounded-2xl p-8 sm:p-12 shadow-soft-lg border border-[#162D4F] text-white relative">
            <div className="absolute top-6 right-8 text-[#10B981]/20">
              <Quote className="w-16 h-16" />
            </div>

            <div className="space-y-6 relative z-10 min-h-[220px] flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-md border border-[#10B981]/35 inline-block">
                  {testimonials[activeIdx].metric}
                </span>

                <p className="text-lg sm:text-xl text-slate-100 italic font-sans leading-relaxed">
                  &ldquo;{testimonials[activeIdx].quote}&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-[#162D4F] gap-4">
                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {testimonials[activeIdx].name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {testimonials[activeIdx].role}, <strong className="text-white">{testimonials[activeIdx].company}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    {activeIdx + 1} of {testimonials.length}
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
        </ScrollReveal>

      </div>
    </section>
  );
};
