import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { FreeApp } from '../config/freeApps';
import { useDialog } from '../hooks/useDialog';

/** Third-party apps remain isolated on their own origins and control their own sign-in. */
export function FreeAppDialog({ app, onClose }: { app: FreeApp; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useDialog(true, onClose);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.focus();
    return () => previous?.focus();
  }, []);
  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const nodes = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), iframe');
    if (!nodes?.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const dialog = <div className="jas-app-overlay">
    <div className="jas-app-backdrop" onClick={onClose} aria-hidden="true"/>
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="free-app-title" aria-describedby="free-app-notice" onKeyDown={trapFocus} className="jas-app-dialog">
      <header className="jas-app-header"><div className="jas-app-heading"><span className="jas-app-brand" aria-hidden="true">J<span>.</span></span><div><span>JHA · FREE TOOLS</span><h2 id="free-app-title">{app.name}</h2></div></div><div className="jas-app-actions"><button type="button" onClick={onClose} aria-label="Close tool"><X size={20}/></button></div></header>
      <p id="free-app-notice" className="jas-app-notice">This app opens here. Google sign-in may open a secure sign-in window; close it to return here. Some features depend on the app’s embedding settings.</p>
      <iframe className="jas-app-frame" src={app.url} title={`${app.name} application`} referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads" />
    </div>
  </div>;
  // Escape ancestor containment so the viewer covers the entire viewport.
  return typeof document === 'undefined' ? dialog : createPortal(dialog, document.body);
}
