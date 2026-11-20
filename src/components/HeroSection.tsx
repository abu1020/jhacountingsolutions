import React from 'react';
import { ArrowDown, ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props { onOpenBookingModal: (service?: string) => void; onExploreServices: () => void }
export const HeroSection: React.FC<Props> = ({ onOpenBookingModal, onExploreServices }) => {
  const reduced = useReducedMotion();
  const enter = (delay: number) => reduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: .7, delay, ease: [0.22, 1, 0.36, 1] as const } };
  return <section className="jas-hero">
    <div className="jas-wrap jas-hero-grid">
      <div className="jas-hero-copy">
        <motion.div {...enter(.05)} className="jas-eyebrow"><span className="jas-dot" /> ACCOUNTING & TAX COMPLIANCE <span className="jas-eyebrow-line" /> INDIA</motion.div>
        <motion.h1 {...enter(.15)}>Clarity for your<br/><em>business journey.</em></motion.h1>
        <motion.p {...enter(.25)}>Good decisions start with clear numbers. We help businesses navigate accounting, GST and tax compliance with a thoughtful, structured approach.</motion.p>
        <motion.div {...enter(.35)} className="jas-hero-actions">
          <button className="jas-button jas-button-dark" onClick={() => onOpenBookingModal()}>Book a consultation <ArrowRight size={17}/></button>
          <button className="jas-text-button" onClick={onExploreServices}>Explore our services <ArrowDown size={16}/></button>
        </motion.div>
        <motion.div {...enter(.45)} className="jas-hero-note"><span className="jas-note-icon"><Check size={14}/></span> Professional support, wherever business takes you.</motion.div>
      </div>
      <motion.div {...enter(.3)} className="jas-visual" aria-label="Illustration representing a clear financial overview">
        <div className="jas-visual-orbit orbit-one"/><div className="jas-visual-orbit orbit-two"/>
        <div className="jas-visual-caption"><span>THE BIGGER PICTURE</span><Sparkles size={16}/></div>
        <div className="jas-paper">
          <div className="jas-paper-head"><div><span>YOUR BUSINESS</span><strong>A clearer view.</strong></div><div className="jas-paper-mark">J<span>.</span></div></div>
          <div className="jas-paper-line"/>
          <div className="jas-chart-label"><span>FINANCIAL CLARITY</span><span>↗</span></div>
          <div className="jas-chart" aria-hidden="true"><div className="jas-chart-grid"/><svg viewBox="0 0 360 150" preserveAspectRatio="none"><path className="chart-area" d="M0 135 C40 125 50 110 85 112 S130 78 170 85 S220 50 255 57 S315 15 360 18 L360 150 L0 150 Z"/><path className="chart-line" d="M0 135 C40 125 50 110 85 112 S130 78 170 85 S220 50 255 57 S315 15 360 18"/></svg></div>
          <div className="jas-paper-bottom"><div><span>THE FOUNDATION</span><strong>Organised records</strong></div><div><span>THE OUTLOOK</span><strong>Informed decisions</strong></div></div>
        </div>
        <div className="jas-floating-card"><span className="jas-floating-icon"><Check size={17}/></span><div><strong>Thoughtfully handled</strong><small>From records to returns</small></div></div>
        <div className="jas-visual-foot">A LITTLE MORE CLARITY, EVERY DAY <span>✳</span></div>
      </motion.div>
    </div>
    <div className="jas-hero-bottom jas-wrap"><span>SCROLL TO EXPLORE</span><span className="jas-bottom-line"/><span>MADE FOR BUSINESS, BUILT ON CLARITY</span></div>
  </section>;
};
