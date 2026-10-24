import React, { useEffect } from 'react';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  ogImage?: string;
}

const BASE_URL = 'https://jhaaccounting.com';

const DEFAULT_KEYWORDS = 
  'GST compliance India, GSTR-1 GSTR-3B filing, GSTR-2B purchase register ITC reconciliation, ' +
  'annual GSTR-9 GSTR-9C return, Income Tax Return Section 139, quarterly advance tax computation, ' +
  'TDS TCS quarterly returns Chapter XVII-B, Form 24Q 26Q 27Q 27EQ, TRACES Form 16 16A download, ' +
  'corporate bookkeeping trial balance balance sheet finalisation, Jha Accounting Solutions Rishi Jha';

export const VIEW_SEO_CONFIGS: Record<string, SeoConfig> = {
  home: {
    title: 'Jha Accounting Solutions | GST, Income Tax & Bookkeeping',
    description: 'Specialised GST compliance (GSTR-1, 3B, 2B ITC), Section 139 Income Tax filing, quarterly TDS/TCS returns, and corporate bookkeeping for Indian businesses.',
    keywords: DEFAULT_KEYWORDS,
    canonicalPath: '/',
    ogType: 'website'
  },
  blog: {
    title: 'Tax Insights & Filing Updates | Jha Accounting Solutions',
    description: 'Statutory updates on GSTR-2B ITC reconciliation, Section 139 advance tax liabilities, quarterly Chapter XVII-B TDS/TCS forms, and bookkeeping best practices.',
    keywords: 'GST updates India, GSTR-2B reconciliation guidelines, Section 139 advance tax calendar, TDS TCS return due dates, bookkeeping ledger review, TRACES Form 16 download',
    canonicalPath: '/#blog',
    ogType: 'article'
  },
  analytics: {
    title: 'Practice Analytics & Compliance Metrics | Jha Accounting',
    description: 'Internal statutory filing tracker monitoring periodic GSTR-1, GSTR-3B, TDS/TCS returns, Section 139 ITR timelines, and financial statement progress.',
    keywords: 'accounting compliance analytics, GST filing tracker, TDS return monitoring, income tax compliance dashboard',
    canonicalPath: '/#analytics',
    ogType: 'website'
  },
  dashboard: {
    title: 'Client Compliance Portal | Jha Accounting Solutions',
    description: 'Client access portal to track periodic GST returns, GSTR-2B ITC matching, advance tax payment schedules, TDS/TCS records, and trial balance files.',
    keywords: 'client accounting portal, GST filing status, advance tax tracker, TDS return files, bookkeeping records',
    canonicalPath: '/#dashboard',
    ogType: 'website'
  },
  '404': {
    title: '404 Page Not Found | Jha Accounting Solutions',
    description: 'Page not found. Return to Jha Accounting Solutions for GST compliance, Section 139 Income Tax filing, quarterly TDS/TCS returns, and corporate bookkeeping.',
    canonicalPath: '/404',
    ogType: 'website'
  }
};

interface SeoManagerProps {
  currentView: string;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ currentView }) => {
  useEffect(() => {
    const config = VIEW_SEO_CONFIGS[currentView] || VIEW_SEO_CONFIGS.home;

    // 1. Document Title
    document.title = config.title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.description);

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords || DEFAULT_KEYWORDS);

    // 4. Canonical URL
    const canonicalUrl = `${BASE_URL}${config.canonicalPath || '/'}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 5. OpenGraph Tags
    const updateOgMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgMeta('og:title', config.title);
    updateOgMeta('og:description', config.description);
    updateOgMeta('og:url', canonicalUrl);
    updateOgMeta('og:type', config.ogType || 'website');
    updateOgMeta('og:site_name', 'Jha Accounting Solutions');
    updateOgMeta('og:image', `${BASE_URL}/og-card.png`);

    // 6. Twitter Card Tags
    const updateTwitterMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateTwitterMeta('twitter:card', 'summary_large_image');
    updateTwitterMeta('twitter:title', config.title);
    updateTwitterMeta('twitter:description', config.description);
    updateTwitterMeta('twitter:image', `${BASE_URL}/og-card.png`);
  }, [currentView]);

  return null;
};
