import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  Zap,
  Globe2
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

export const AnalyticsDashboard: React.FC = () => {
  const { overview, trafficHistory, conversionFunnel, topArticles, deviceDistribution, locationDistribution } = JHA_ACCOUNTING_DATA.analyticsData;

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const currentChartData = timeframe === '7d' 
    ? trafficHistory.days7 
    : timeframe === '30d' 
    ? trafficHistory.days30 
    : trafficHistory.days90;

  const maxVisits = Math.max(...currentChartData.map((d: { date: string; visits: number }) => d.visits));

  return (
    <section className="py-20 bg-[#0B1F3A] text-slate-100 min-h-screen border-b border-[#162D4F]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#162D4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] uppercase font-bold">
              <BarChart3 className="w-4 h-4" />
              <span>Practice Portal Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
              Site Analytics &amp; Consultation Inquiries
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Summary analytics for Jha Accounting Solutions portal.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-2 bg-[#132D52] p-1.5 rounded-xl border border-[#162D4F]">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">
              Period:
            </span>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                timeframe === '7d' ? 'bg-[#10B981] text-white font-bold shadow-soft-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                timeframe === '30d' ? 'bg-[#10B981] text-white font-bold shadow-soft-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                timeframe === '90d' ? 'bg-[#10B981] text-white font-bold shadow-soft-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Visitors */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
              <span>Unique Visitors</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {overview.totalVisitors}
            </p>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded inline-block">
              {overview.visitorsTrend} vs last period
            </span>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
              <span>Inquiry Rate</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
              {overview.conversionRate}
            </p>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded inline-block">
              {overview.conversionTrend}
            </span>
          </div>

          {/* Card 3: Total Consultations */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
              <span>Consultation Inquiries</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {overview.totalLeads}
            </p>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded inline-block">
              {overview.leadsTrend} total requests
            </span>
          </div>

          {/* Card 4: Session Duration */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
              <span>Avg Session Length</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {overview.avgSessionDuration}
            </p>
            <span className="text-[10px] font-mono text-slate-400 block">
              Engagement Metric
            </span>
          </div>

          {/* Card 5: Core Web Vitals Status */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-2 col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
              <span>Performance</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-mono font-bold text-emerald-400">
              {overview.webVitals.score}/100
            </p>
            <p className="text-[10px] font-mono text-slate-300">
              LCP: {overview.webVitals.lcp} · INP: {overview.webVitals.inp}
            </p>
          </div>

        </div>

        {/* Traffic Trend Chart + Conversion Funnel */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Traffic Trend Chart */}
          <div className="lg:col-span-7 bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  Visitor Volume
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  Traffic Trend ({timeframe})
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Peak: {maxVisits.toLocaleString()} visits
              </span>
            </div>

            <div className="space-y-4">
              <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-700/80 px-2">
                {currentChartData.map((item: { date: string; visits: number }, idx: number) => {
                  const heightPercent = Math.round((item.visits / maxVisits) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.visits}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-700 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <span className="text-[10px] font-mono text-slate-400 truncate w-full text-center">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Site Sessions
                </span>
                <span>Optimized Lightweight Bundle</span>
              </div>
            </div>

          </div>

          {/* Conversion Funnel Breakdown */}
          <div className="lg:col-span-5 bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                Practice Inquiries
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                Service Inquiry Funnel
              </h3>
            </div>

            <div className="space-y-4">
              {conversionFunnel.map((step: { step: string; count: number; percentage: number }, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-medium">{step.step}</span>
                    <span className="text-emerald-400 font-bold">{step.count.toLocaleString()} ({step.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${step.percentage}%` }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 font-mono block">Scope Note:</span>
              <p className="font-sans">
                Inquiries are directed strictly toward our four approved categories: GST compliance, Income Tax, TDS/TCS, and Bookkeeping.
              </p>
            </div>

          </div>

        </div>

        {/* Secondary Grid: Top Insight Articles & Devices */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Top Articles Table */}
          <div className="lg:col-span-7 bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">
              Top Statutory Compliance Articles
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Article Title</th>
                    <th className="pb-3 font-semibold">Views</th>
                    <th className="pb-3 font-semibold">Read Rate</th>
                    <th className="pb-3 font-semibold text-right">Inquiries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {topArticles.map((art: { title: string; views: string; readRate: string; leadsGenerated: number }, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 font-sans font-medium text-slate-200 max-w-xs truncate pr-4">
                        {art.title}
                      </td>
                      <td className="py-3 text-slate-300">{art.views}</td>
                      <td className="py-3 text-emerald-400 font-bold">{art.readRate}</td>
                      <td className="py-3 text-right text-white font-bold">{art.leadsGenerated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device & Location Split */}
          <div className="lg:col-span-5 bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 space-y-6">
            <h3 className="text-lg font-bold text-white font-display">
              Traffic Demographics &amp; Devices
            </h3>

            {/* Devices */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                Device Distribution
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {deviceDistribution.map((d: { device: string; percentage: number; label: string }, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-[10px] text-slate-400 block truncate">{d.device}</span>
                    <span className="text-base font-bold text-emerald-400 block">{d.percentage}%</span>
                    <span className="text-[9px] text-slate-500 block">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3 pt-3 border-t border-slate-700/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                Geographic Breakdown
              </span>
              <div className="space-y-2 text-xs font-mono">
                {locationDistribution.map((loc: { region: string; percentage: number; count: string }, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-sans text-xs">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                      {loc.region}
                    </span>
                    <span className="font-bold text-white">{loc.count} ({loc.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
