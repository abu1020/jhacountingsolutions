import React, { useState } from 'react';
import { AlertTriangle, Download, RefreshCw, MessageSquare } from 'lucide-react';

interface SecurityAuditProps { onSupportWhatsApp?: () => void }
type BrowserCheck = { checkedAt: string; protocol: string; framed: boolean };

/** These are browser observations, not a test of the application's security. */
function observeBrowser(): BrowserCheck {
  return { checkedAt: new Date().toISOString(), protocol: window.location.protocol, framed: window.self !== window.top };
}

export const SecurityAudit: React.FC<SecurityAuditProps> = ({ onSupportWhatsApp }) => {
  const [result, setResult] = useState<BrowserCheck | null>(null);
  const download = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ ...result, limitation: 'Browser observations only; not a security audit or certification.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'browser-security-observations.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return <section className="space-y-5 text-white" aria-labelledby="browser-check-title">
    <div className="bg-navy-800 rounded-3xl p-6 border border-navy-500 space-y-4">
      <h2 id="browser-check-title" className="text-xl font-bold">Browser security information</h2>
      <p className="text-sm text-slate-300">Check the current page protocol and whether it is displayed inside another frame. This is not a security audit or a guarantee of protection.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setResult(observeBrowser())} className="px-4 py-2 rounded-xl bg-brand-teal text-white font-semibold flex items-center gap-2"><RefreshCw size={16}/> {result ? 'Check again' : 'Check this browser'}</button>
        {result && <button type="button" onClick={download} className="px-4 py-2 rounded-xl bg-navy-700 text-white flex items-center gap-2"><Download size={16}/> Download observations</button>}
      </div>
      {result && <div role="status" className="text-sm text-slate-200 space-y-2">
        <p>Page protocol: <strong>{result.protocol === 'https:' ? 'HTTPS' : result.protocol === 'http:' ? 'HTTP — do not enter sensitive information on an untrusted network' : result.protocol}</strong></p>
        <p>Display: {result.framed ? 'Inside a frame' : 'Top-level window'}</p>
        <p>Checked: {new Date(result.checkedAt).toLocaleString()}</p>
      </div>}
    </div>
    <div className="bg-navy-800 rounded-3xl p-6 border border-navy-500 text-sm text-slate-300 space-y-3">
      <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={18}/> What this cannot verify</h3>
      <p>These observations do not verify TLS configuration, security headers, authentication, database permissions, storage, vulnerabilities, privacy compliance or access to your data. A separate review and testing of deployed systems are necessary.</p>
      <p>Use a strong, unique password and multi-factor authentication for your Google account. Sign out on shared devices and contact us if you suspect unauthorized access.</p>
      {onSupportWhatsApp && <button type="button" onClick={onSupportWhatsApp} className="text-white underline flex items-center gap-2"><MessageSquare size={16}/> Contact support</button>}
    </div>
  </section>;
};
