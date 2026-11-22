import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { trackClickWhatsApp } from '../lib/analytics';

/** Opens a draft, not a submitted request; the visitor sends it in WhatsApp. */
export const BULK_REQUEST_MESSAGE = 'Hello Jha Accounting Solutions, I would like to discuss accounting or tax services for multiple clients. Please let me know the next steps.';
export const BULK_REQUEST_URL = `https://wa.me/${COMPANY_CONTENT.brand.directMobileRaw.replace(/\D/g, '')}?text=${encodeURIComponent(BULK_REQUEST_MESSAGE)}`;

export function BulkRequestLink({ className, onClick, label = 'Request via WhatsApp' }: { className?: string; onClick?: () => void; label?: string }) {
  return <a href={BULK_REQUEST_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={() => { trackClickWhatsApp(); onClick?.(); }} aria-label={`${label} (opens WhatsApp in a new tab)`}>{label} <ArrowUpRight size={15} aria-hidden="true"/></a>;
}
