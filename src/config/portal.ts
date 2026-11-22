/** Public entry point for the dedicated external client portal software. */
export const CLIENT_PORTAL_URL = 'https://jhacountingsolution.vercel.app';
export const CLIENT_PORTAL_HOST = CLIENT_PORTAL_URL.replace(/^https?:\/\//, '');

export const CLIENT_PORTAL_HIGHLIGHTS = [
  {
    title: 'GST & ITR Filing Tracker',
    detail: 'Follow active returns, statutory acknowledgements, and filing timelines.'
  },
  {
    title: 'Statements & Document Vault',
    detail: 'Access ledgers, computation summaries, and compliance copies.'
  },
  {
    title: 'Direct Engagement Desk',
    detail: 'Coordinate directly with your dedicated accounting team.'
  }
] as const;

let portalWarmed = false;

/**
 * Idempotently pre-warms DNS and TLS connections to the external client portal
 * on hover/focus/open so the handoff feels immediate even under peak traffic.
 */
export function warmUpClientPortal(targetUrl: string = CLIENT_PORTAL_URL): void {
  if (portalWarmed || typeof document === 'undefined') return;
  try {
    const origin = new URL(targetUrl).origin;
    const head = document.head;
    if (!head) return;

    if (!head.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`)) {
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = origin;
      head.appendChild(dns);
    }

    if (!head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = origin;
      preconnect.crossOrigin = 'anonymous';
      head.appendChild(preconnect);
    }

    portalWarmed = true;
  } catch {
    // Ignore invalid URLs safely
  }
}
