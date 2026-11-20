import React from 'react';
import { ArrowUpRight, Calculator, FileText, BookOpen, Layers, Check } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

export const ServicesSection: React.FC<{onOpenBookingModal: (service?: string) => void}> = ({onOpenBookingModal}) => {
  const icons = [Layers, Calculator, FileText, BookOpen];
  return <section id="services" className="jas-services jas-section">
    <div className="jas-wrap">
      <div className="jas-section-heading"><div><div className="jas-kicker"><span>01</span> WHAT WE DO</div><h2>Good business deserves<br/><em>great foundations.</em></h2></div><p>Practical, precise support for the financial essentials of your business. Explore the areas where we can help.</p></div>
      <div className="jas-service-grid">{COMPANY_CONTENT.services.map((service, i) => { const Icon = icons[i]; return <ScrollReveal key={service.id} delayMs={i * 75}><article className="jas-service-card"><div className="jas-card-top"><span className="jas-service-icon"><Icon size={23} strokeWidth={1.5}/></span><span>0{i + 1} / 04</span></div><h3>{service.title}</h3><p>{service.shortDesc}</p><div className="jas-card-features">{service.features.map(feature => <div key={feature}><Check size={14}/><span>{feature}</span></div>)}</div><button onClick={() => onOpenBookingModal(service.title)} className="jas-card-link">Discuss this service <ArrowUpRight size={17}/></button></article></ScrollReveal>})}</div>
      <div className="jas-service-note"><span>✳</span> Every business is different. Deliverables are tailored to your requirements and agreed engagement terms.</div>
    </div>
  </section>;
};
