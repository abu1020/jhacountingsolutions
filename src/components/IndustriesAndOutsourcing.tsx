import React from 'react';
import { ArrowUpRight, ShoppingBag, Rocket, Factory, Briefcase } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

const icons = [ShoppingBag, Rocket, Factory, Briefcase];
export const IndustriesAndOutsourcing: React.FC<{ onOpenBookingModal: (service?: string) => void }> = ({ onOpenBookingModal }) => <section id="industries" className="jas-industry jas-section"><div className="jas-wrap"><div className="jas-section-heading"><div><div className="jas-kicker">SECTOR SUPPORT</div><h2>Services shaped<br/><em>around your business.</em></h2></div><p>Our accounting and compliance services support a range of business needs.</p></div><div className="jas-industry-grid">{COMPANY_CONTENT.industries.map((industry, i) => { const Icon = icons[i]; return <ScrollReveal key={industry.title} delayMs={i * 60}><article><span className="jas-tool-icon"><Icon size={21}/></span><h3>{industry.title}</h3><p>{industry.description}</p><button onClick={() => onOpenBookingModal()}>Discuss your requirements <ArrowUpRight size={15}/></button></article></ScrollReveal> })}</div></div></section>;
