import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
const Industries = lazy(() => import('./IndustriesAndOutsourcing').then(m => ({ default: m.IndustriesAndOutsourcing })));
const Map = lazy(() => import('./IndiaGstMap').then(m => ({ default: m.IndiaGstMap })));
const Documents = lazy(() => import('./RequiredDocumentsSection').then(m => ({ default: m.RequiredDocumentsSection })));
const Faq = lazy(() => import('./FaqAccordion').then(m => ({ default: m.FaqAccordion })));
type Resource = 'industries' | 'gst-map' | 'required-documents' | 'faq';
const choices: { id: Resource; label: string }[] = [
  { id: 'industries', label: 'Industries we support' },
  { id: 'gst-map', label: 'GST state information' },
  { id: 'required-documents', label: 'Document checklist' },
  { id: 'faq', label: 'Frequently asked questions' }
];
function fromHash(): Resource | null {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (hash === 'documents') return 'required-documents';
  return choices.find(item => item.id === hash)?.id ?? null;
}
function ScrollToSelected({ selected }: { selected: Resource }) {
  useEffect(() => {
    if (fromHash() === selected) document.getElementById(selected)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);
  return null;
}
export function SupportingResources({ onOpenBookingModal }: { onOpenBookingModal: (service?: string) => void }) {
  const [selected, setSelected] = useState<Resource | null>(fromHash);
  useEffect(() => { const onHash = () => { const resource = fromHash(); if (resource) setSelected(resource); }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash); }, []);
  return <section className="jas-resources" aria-label="Additional resources"><div className="jas-wrap"><div className="jas-resources-heading"><div><div className="jas-kicker">ADDITIONAL RESOURCES</div><h2>Need a little more detail?</h2></div><p>Explore these supporting resources when you need them.</p></div><div className="jas-resource-links">{choices.map(item => <button key={item.id} aria-expanded={selected === item.id} aria-controls="resource-panel" onClick={() => setSelected(selected === item.id ? null : item.id)}>{item.label}<ArrowUpRight size={15}/></button>)}</div></div>{selected && <div id="resource-panel"><div className="jas-wrap jas-tool-panel-top"><span>SUPPORTING RESOURCE</span><button onClick={() => setSelected(null)}>Close resource</button></div><Suspense fallback={<p className="jas-wrap py-8" role="status">Loading resource…</p>}>
    {selected === 'industries' && <Industries onOpenBookingModal={onOpenBookingModal}/>}
    {selected === 'gst-map' && <Map onOpenBookingModal={onOpenBookingModal}/>}
    {selected === 'required-documents' && <Documents onOpenBookingModal={onOpenBookingModal}/>}
    {selected === 'faq' && <Faq/>}
    <ScrollToSelected selected={selected}/>
  </Suspense></div>}</section>;
}
