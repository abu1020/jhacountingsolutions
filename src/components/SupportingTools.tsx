import React, { lazy, Suspense, useState } from 'react';
import { Calculator, CalendarDays, ArrowUpRight, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { motion, useReducedMotion } from 'framer-motion';
const FreeToolsSection = lazy(() => import('./FreeToolsSection').then(m => ({ default: m.FreeToolsSection })));
type Tool = 'calculator' | 'dates';
export function SupportingTools({ onOpenBookingModal }: { onOpenBookingModal: (service?: string) => void }) {
  const [active, setActive] = useState<Tool | null>(null);
  const reducedMotion = useReducedMotion();
  return <section id="free-tools" className="jas-tools jas-section">
    <div className="jas-wrap">
      <div className="jas-section-heading"><div><div className="jas-kicker"><span>04</span> HELPFUL TOOLS</div><h2>Small tools for<br/><em>everyday decisions.</em></h2></div><p>Useful starting points for your accounting work. For advice specific to your business, speak with us.</p></div>
      <div className="jas-tools-grid">
        <ScrollReveal><button className="jas-tool-card" onClick={() => setActive(active === 'calculator' ? null : 'calculator')} aria-expanded={active === 'calculator'} aria-controls="tool-panel"><span className="jas-tool-icon"><Calculator size={22}/></span><span><strong>GST calculator</strong><small>Estimate GST on an inclusive or exclusive amount.</small></span><ArrowUpRight size={18}/></button></ScrollReveal>
        <ScrollReveal delayMs={80}><button className="jas-tool-card" onClick={() => setActive(active === 'dates' ? null : 'dates')} aria-expanded={active === 'dates'} aria-controls="tool-panel"><span className="jas-tool-icon"><CalendarDays size={22}/></span><span><strong>Compliance dates</strong><small>Review general GST, income tax and TDS dates.</small></span><ArrowUpRight size={18}/></button></ScrollReveal>
      </div>
      <p className="jas-tools-disclaimer">For general guidance only. Deadlines and applicability can change; verify them for your circumstances.</p>
    </div>
    {active && <motion.div id="tool-panel" className="jas-tool-panel" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}><div className="jas-wrap jas-tool-panel-top"><span>{active === 'calculator' ? 'GST CALCULATOR' : 'COMPLIANCE DATES'}</span><button onClick={() => setActive(null)}><X size={16}/> Close tool</button></div><Suspense fallback={<p className="jas-wrap py-8" role="status">Loading tool…</p>}><FreeToolsSection key={active} initialTab={active} onOpenBookingModal={onOpenBookingModal}/></Suspense></motion.div>}
  </section>;
}
