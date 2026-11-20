import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';
export const FaqAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return <section id="faq" className="jas-faq jas-section"><div className="jas-wrap jas-faq-grid"><div><div className="jas-kicker"><span>04</span> GOOD TO KNOW</div><h2>Questions, meet<br/><em>clarity.</em></h2><p className="jas-faq-intro">A little more detail about our services and how we can work together.</p></div><div className="jas-faq-list">{COMPANY_CONTENT.faqs.map((faq, idx) => <ScrollReveal key={faq.question}><div className="jas-faq-item"><button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} aria-expanded={openIdx === idx} aria-controls={`faq-answer-${idx}`}><span>{faq.question}</span>{openIdx === idx ? <Minus size={18}/> : <Plus size={18}/>}</button><div id={`faq-answer-${idx}`} hidden={openIdx !== idx}><p>{faq.answer}</p></div></div></ScrollReveal>)}</div></div></section>;
};
