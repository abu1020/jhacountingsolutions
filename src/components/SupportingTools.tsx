import React, { lazy, Suspense, useState } from 'react';
import { Calculator, CalendarDays, ArrowUpRight, X, NotebookPen, Users, ListTodo } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { motion, useReducedMotion } from 'framer-motion';
import { FREE_APPS, type FreeApp } from '../config/freeApps';
import { FreeAppDialog } from './FreeAppDialog';
const FreeToolsSection = lazy(() => import('./FreeToolsSection').then(m => ({ default: m.FreeToolsSection })));
type Tool = 'calculator' | 'dates';
export function SupportingTools({ onOpenBookingModal }: { onOpenBookingModal: (service?: string) => void }) {
  const [active, setActive] = useState<Tool | null>(null);
  const [app, setApp] = useState<FreeApp | null>(null);
  const reducedMotion = useReducedMotion();
  return <section id="free-tools" className="jas-tools jas-section">
    <div className="jas-wrap">
      <div className="jas-section-heading"><div><div className="jas-kicker"><span>04</span> HELPFUL TOOLS</div><h2>Small tools for<br/><em>everyday decisions.</em></h2></div><p>Useful starting points for your accounting work. For advice specific to your business, speak with us.</p></div>
      <div className="jas-tools-grid">
        <ScrollReveal><button className="jas-tool-card" onClick={() => setActive(active === 'calculator' ? null : 'calculator')} aria-expanded={active === 'calculator'} aria-controls="tool-panel"><span className="jas-tool-icon"><Calculator size={22}/></span><span><strong>GST calculator</strong><small>Estimate GST on an inclusive or exclusive amount.</small></span><ArrowUpRight size={18}/></button></ScrollReveal>
        <ScrollReveal delayMs={80}><button className="jas-tool-card" onClick={() => setActive(active === 'dates' ? null : 'dates')} aria-expanded={active === 'dates'} aria-controls="tool-panel"><span className="jas-tool-icon"><CalendarDays size={22}/></span><span><strong>Compliance dates</strong><small>Review general GST, income tax and TDS dates.</small></span><ArrowUpRight size={18}/></button></ScrollReveal>
      </div>
      <div className="jas-app-section"><div className="jas-app-section-heading"><div><span>MORE FREE TOOLS</span><h3>Make space for your work.</h3></div><p>Explore these separate apps for notes, team management and focus.</p></div><div className="jas-app-grid">{FREE_APPS.map((item, index) => { const Icon = [NotebookPen, Users, ListTodo][index]; return <button key={item.id} type="button" className="jas-app-tile" onClick={() => setApp(item)} aria-haspopup="dialog"><span className="jas-tool-icon"><Icon size={21}/></span><span><strong>{item.name}</strong><small>{item.description}</small><span className="jas-app-tile-link">Open tool <ArrowUpRight size={14}/></span></span></button>; })}</div></div>
      <p className="jas-tools-disclaimer">For general guidance only. Deadlines and applicability can change; verify them for your circumstances.</p>
    </div>
    {app && <FreeAppDialog app={app} onClose={() => setApp(null)}/>}
    {active && <motion.div id="tool-panel" className="jas-tool-panel" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}><div className="jas-wrap jas-tool-panel-top"><span>{active === 'calculator' ? 'GST CALCULATOR' : 'COMPLIANCE DATES'}</span><button onClick={() => setActive(null)}><X size={16}/> Close tool</button></div><Suspense fallback={<p className="jas-wrap py-8" role="status">Loading tool…</p>}><FreeToolsSection key={active} initialTab={active} onOpenBookingModal={onOpenBookingModal}/></Suspense></motion.div>}
  </section>;
}
