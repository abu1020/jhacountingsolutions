import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { COMPANY_CONTENT } from '../data/content';
import { trackClickPhone } from '../lib/analytics';

interface Props { onOpenBookingModal: (service?: string) => void; onExploreServices: () => void }

const serviceLabels: Record<string, { label: string; detail: string }> = {
  'gst-compliance': { label: 'GST compliance', detail: 'Returns & reconciliation' },
  'income-tax': { label: 'Income tax', detail: 'Returns & computation' },
  'tds-tcs': { label: 'TDS / TCS', detail: 'Quarterly returns' },
  'bookkeeping-accounting': { label: 'Bookkeeping', detail: 'Records & accounts' }
};

export const HeroSection: React.FC<Props> = ({ onOpenBookingModal, onExploreServices }) => {
  const reduced = useReducedMotion();
  const enter = (delay: number) => reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5, delay, ease: [0.22, 1, 0.36, 1] as const } };
  return <section className="jas-hero">
    <div className="jas-wrap jas-hero-grid jas-sales-hero">
      <div className="jas-hero-copy">
        <motion.div {...enter(.05)} className="jas-eyebrow"><span className="jas-dot" /> ACCOUNTING & TAX SUPPORT <span className="jas-eyebrow-line" /> INDIA</motion.div>
        <motion.h1 {...enter(.12)}>Your tax and accounts,<br/><em>in clearer hands.</em></motion.h1>
        <motion.p {...enter(.2)}>From GST and income tax to TDS and bookkeeping, get practical support for the work your business needs done.</motion.p>
        <motion.div {...enter(.28)} className="jas-hero-actions">
          <button className="jas-button jas-button-dark" onClick={() => onOpenBookingModal()}>Request a consultation <ArrowRight size={17}/></button>
          <a className="jas-text-button" href={`tel:${COMPANY_CONTENT.brand.directMobileRaw}`} onClick={() => trackClickPhone('Hero_Call')}><Phone size={15}/> Call {COMPANY_CONTENT.brand.primaryPhone}</a>
        </motion.div>
        <motion.div {...enter(.35)} className="jas-hero-note"><span className="jas-note-icon"><Check size={14}/></span> Online &amp; remote support across India · Scope agreed before work begins</motion.div>
      </div>
      <motion.div {...enter(.18)} className="jas-sales-selector" aria-labelledby="hero-services-title">
        <div className="jas-sales-selector-top"><span>LET’S GET STARTED</span><span>JHA / 01</span></div>
        <div className="jas-sales-selector-heading"><div><span>SUPPORT FOR YOUR BUSINESS</span><h2 id="hero-services-title">What can we help<br/><em>you with?</em></h2></div><span className="jas-sales-mark">J<span>.</span></span></div>
        <p>Choose a service to start your consultation request.</p>
        <div className="jas-sales-options">
          {COMPANY_CONTENT.services.map(service => {
            const label = serviceLabels[service.id];
            return <button key={service.id} type="button" onClick={() => onOpenBookingModal(service.title)} aria-label={`Request a consultation for ${service.title}`}><span><strong>{label.label}</strong><small>{label.detail}</small></span><ArrowUpRight size={17} aria-hidden="true"/></button>;
          })}
        </div>
        <button type="button" className="jas-sales-all" onClick={onExploreServices}>See all services <ArrowDown size={15}/></button>
      </motion.div>
    </div>
    <div className="jas-hero-bottom jas-wrap"><span>BUILT AROUND YOUR BUSINESS</span><span className="jas-bottom-line"/><span>GST · INCOME TAX · TDS / TCS · BOOKKEEPING</span></div>
  </section>;
};
