import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
const steps = [
  ['01', 'Understanding your needs', 'We begin with your business, your requirements and the scope of support you need.'],
  ['02', 'Getting organised', 'We align the relevant records, documents and accounting information for your engagement.'],
  ['03', 'Taking care of the details', 'We prepare applicable returns, reconciliations and accounting work with a structured approach.'],
  ['04', 'Keeping the picture clear', 'Periodic reviews and applicable annual filings help keep your records in order.']
];
export const VirtualCfoSpotlight: React.FC<{onOpenBookingModal: (service?: string) => void}> = ({onOpenBookingModal}) => <section id="process" className="jas-process jas-section"><div className="jas-wrap"><div className="jas-process-intro"><div><div className="jas-kicker light"><span>03</span> HOW WE WORK</div><h2>A little structure.<br/><em>A lot more clarity.</em></h2></div><div><p>From the first conversation to ongoing compliance, we believe the process should feel as clear as the outcome.</p><button onClick={() => onOpenBookingModal()} className="jas-process-link">Let’s talk about your business <ArrowRight size={17}/></button></div></div><div className="jas-process-grid">{steps.map(([number,title,description],i) => <ScrollReveal key={number} delayMs={i*80}><div className="jas-step"><span className="jas-step-number">{number}</span><div className="jas-step-rule"><i/></div><h3>{title}</h3><p>{description}</p></div></ScrollReveal>)}</div></div></section>;
