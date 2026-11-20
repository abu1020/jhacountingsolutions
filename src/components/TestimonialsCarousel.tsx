import React from 'react';
import { ArrowUpRight, FileCheck2, Compass, MessageCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { COMPANY_CONTENT } from '../data/content';
const principles = [
  { icon: Compass, title: 'A focused scope', text: 'Four core practice areas, with work shaped around your applicable business requirements.' },
  { icon: FileCheck2, title: 'A structured approach', text: 'Careful review of records, reconciliations and filings helps bring order to the details.' },
  { icon: MessageCircle, title: 'A direct conversation', text: 'Discuss your requirements with Rishi Jha and agree on the scope before work begins.' }
];
export const TestimonialsCarousel: React.FC = () => <section id="about" className="jas-why jas-section"><div className="jas-wrap jas-why-grid"><div><div className="jas-kicker"><span>02</span> WHY JHA</div><h2>Thoughtful work.<br/><em>Clearer direction.</em></h2><p className="jas-why-intro">Behind every return and ledger is a business with its own priorities. We bring focus and care to the details, so you can see the bigger picture.</p><a className="jas-why-link" href={`mailto:${COMPANY_CONTENT.brand.primaryEmail}`}>Get to know us <ArrowUpRight size={16}/></a></div><div className="jas-principles">{principles.map(({icon: Icon,title,text},i) => <ScrollReveal key={title} delayMs={i*75}><div className="jas-principle"><span><Icon size={20} strokeWidth={1.5}/></span><div><h3>{title}</h3><p>{text}</p></div><small>0{i+1}</small></div></ScrollReveal>)}</div></div></section>;
