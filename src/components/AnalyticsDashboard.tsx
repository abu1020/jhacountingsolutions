import React from 'react';
import { BarChart3 } from 'lucide-react';

/** No analytics provider is connected to this view. Never present demo figures as real data. */
export const AnalyticsDashboard: React.FC = () => (
  <section className="min-h-[60vh] bg-[#f6f7f1] py-24 px-6 text-[#173c38]">
    <div className="max-w-3xl mx-auto">
      <BarChart3 className="w-8 h-8 mb-6" aria-hidden="true" />
      <p className="text-xs uppercase tracking-widest font-bold text-[#527e6a]">Practice analytics</p>
      <h1 className="text-4xl font-display font-bold mt-3">Analytics are not connected</h1>
      <p className="mt-5 text-base leading-relaxed text-slate-600">This page does not currently have a verified analytics data source. No visitor or conversion figures are displayed until one is configured.</p>
      <a href="/#home" className="inline-block mt-8 underline font-semibold">Return to the website</a>
    </div>
  </section>
);
