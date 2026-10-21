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

export const initGA = () => {
  if (typeof window === 'undefined') return;

  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    });
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
