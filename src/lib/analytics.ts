/**
 * Google Analytics 4 Event Tracking Utility
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-JAS2026TAX';

/**
 * GA4 bootstrap — performance-tuned:
 * 1. The dataLayer + gtag stubs are installed synchronously so every event
 *    (including the initial `config`) is queued from millisecond zero.
 * 2. The actual gtag.js network request is deferred until the browser is
 *    idle (or ~2.5 s after `load`), keeping the main thread and network
 *    free for LCP-critical app code. Queued events replay automatically
 *    when gtag.js finally boots — the standard GA snippet behaviour.
 */
export const initGA = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true
  });

  const injectScript = () => {
    if (document.getElementById('ga-script')) return;
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(injectScript, { timeout: 5000 });
  } else {
    window.addEventListener('load', () => setTimeout(injectScript, 2500), { once: true });
  }
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } else {
    console.log(`[GA4 Event Log] Action: ${action} | Category: ${category} | Label: ${label}`);
  }
};

export const trackClickConsultation = (source: string) => {
  trackEvent('click_consultation_button', 'Conversion', source);
};

export const trackClickPhone = (phone: string) => {
  trackEvent('click_phone_number', 'Lead', phone);
};

export const trackClickWhatsApp = () => {
  trackEvent('click_whatsapp_button', 'Lead', 'WhatsApp Direct');
};

export const trackFormSubmit = (serviceNeeded: string) => {
  trackEvent('form_submit_contact', 'Lead', serviceNeeded);
};
