import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { CLIENT_PORTAL_URL } from '../config/portal';
import { useDialog } from '../hooks/useDialog';

interface LoginRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
}

/** A short, cancellable transition before navigating to the external portal. */
export const LoginRedirectModal: React.FC<LoginRedirectModalProps> = ({
  isOpen,
  onClose,
  targetUrl = CLIENT_PORTAL_URL
}) => {
  const reducedMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    onClose();
  }, [onClose]);
  useDialog(isOpen, cancel);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.focus();
    timer.current = setTimeout(() => window.location.assign(targetUrl), 2000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      previousFocus?.focus();
    };
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const keepFocusInDialog = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };

  return <div className="jas-portal-overlay">
    <div className="jas-portal-backdrop" onClick={cancel} aria-hidden="true" />
    <motion.div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-transition-title"
      aria-describedby="portal-transition-description"
      tabIndex={-1}
      onKeyDown={keepFocusInDialog}
      className="jas-portal-card"
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="jas-portal-close" onClick={cancel} aria-label="Cancel and stay on the website"><X size={19}/></button>
      <div className="jas-portal-brand"><span className="jas-portal-brand-mark">J<span>.</span></span><span>JHA <small>ACCOUNTING SOLUTIONS</small></span></div>
      <div className="jas-portal-visual" aria-hidden="true">
        <span className="jas-portal-orbit jas-portal-orbit-one" />
        <span className="jas-portal-orbit jas-portal-orbit-two" />
        <span className="jas-portal-visual-mark">J<span>.</span></span>
        <span className="jas-portal-visual-arrow"><ArrowUpRight size={19}/></span>
      </div>
      <div className="jas-portal-copy">
        <p className="jas-portal-eyebrow"><span /> YOUR CLIENT WORKSPACE</p>
        <h2 id="portal-transition-title">Taking you to<br/><em>your portal.</em></h2>
        <p id="portal-transition-description">You’re leaving the website for the Jha Accounting Solutions client software.</p>
      </div>
      <div className="jas-portal-status" role="status" aria-live="polite"><span>Opening client portal</span><span className="jas-portal-status-dots" aria-hidden="true">···</span></div>
      <div className="jas-portal-progress" aria-hidden="true"><span /></div>
      <div className="jas-portal-actions">
        <a href={targetUrl} onClick={() => { if (timer.current) clearTimeout(timer.current); }} className="jas-portal-primary">Continue now <ArrowRight size={17}/></a>
        <button type="button" onClick={cancel} className="jas-portal-cancel">Stay on this website</button>
      </div>
      <p className="jas-portal-destination">DESTINATION <span>{targetUrl.replace(/^https?:\/\//, '')}</span></p>
    </motion.div>
  </div>;
};
