import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building,
  FileCheck,
  ShieldCheck,
  Scale,
  X,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { INDIA_STATE_GST_DATA, StateGstProfile } from '../data/stateGstData';

interface IndiaGstMapProps {
  onOpenBookingModal: (service?: string) => void;
}

export const IndiaGstMap: React.FC<IndiaGstMapProps> = ({ onOpenBookingModal }) => {
  const [selectedStateId, setSelectedStateId] = useState<string>('delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [compareStateId, setCompareStateId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Active Selected State
  const selectedState = useMemo(() => {
    return INDIA_STATE_GST_DATA.find(s => s.id === selectedStateId) || INDIA_STATE_GST_DATA[0];
  }, [selectedStateId]);

  // Comparison State
  const compareState = useMemo(() => {
    if (!compareStateId) return null;
    return INDIA_STATE_GST_DATA.find(s => s.id === compareStateId) || null;
  }, [compareStateId]);

  // Filtered States
  const filteredStates = useMemo(() => {
    return INDIA_STATE_GST_DATA.filter(s => {
      const matchesRegion = selectedRegion === 'All' || s.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesRegion;

      const matchesName = s.name.toLowerCase().includes(q);
      const matchesCode = s.code.includes(q);
      const matchesCapital = s.capital.toLowerCase().includes(q);
      const matchesNuance = s.keyComplianceNuances.some(n => n.toLowerCase().includes(q));

      return matchesRegion && (matchesName || matchesCode || matchesCapital || matchesNuance);
    });
  }, [searchQuery, selectedRegion]);

  const handleStateSelect = (id: string) => {
    if (isCompareMode) {
      if (id === selectedStateId) return;
      setCompareStateId(id);
    } else {
      setSelectedStateId(id);
    }
  };

  return (
    <section id="state-map" className="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive State Compliance Map</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            State-Specific GST Rules &amp; Local Tax Deadlines
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Click on any Indian state or commercial hub to inspect intra-state e-Way Bill threshold limits, local Professional Tax (PT) filing rules, and regional SGST audit guidelines.
          </p>
        </div>

        {/* Search & Regional Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 backdrop-blur-md shadow-xl">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state name, code (27, 07), PT..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900 text-white placeholder:text-slate-400 text-xs rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Regional Filter Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'North', 'South', 'West', 'East'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === region
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {region}
              </button>
            ))}

            {/* Compare Toggle Button */}
            <button
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                if (!isCompareMode && !compareStateId) {
                  const other = INDIA_STATE_GST_DATA.find(s => s.id !== selectedStateId);
                  if (other) setCompareStateId(other.id);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isCompareMode
                  ? 'bg-amber-400 text-slate-950 font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompareMode ? 'Exit Compare' : 'Compare 2 States'}</span>
            </button>
          </div>

        </div>

        {/* 2-Column Split: Interactive Vector Map + State Profile Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Interactive Vector Map of India */}
          <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-6 border border-slate-800 shadow-2xl relative flex flex-col items-center justify-between min-h-[480px]">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Select State Pin
              </span>
              <span>{filteredStates.length} Active Hubs</span>
            </div>

            {/* Visual SVG Map Graphic Container */}
            <div className="relative w-full max-w-[360px] h-[380px] my-4 flex items-center justify-center">
              
              {/* Stylized Vector Outline Background of India Map */}
              <svg
                viewBox="0 0 500 650"
                className="w-full h-full filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified India Territorial Outline */}
                <path
                  d="M 230 40 L 260 50 L 280 90 L 260 120 L 310 150 L 360 180 L 410 180 L 440 210 L 410 240 L 370 250 L 350 310 L 310 330 L 280 370 L 270 450 L 250 560 L 220 610 L 210 540 L 180 430 L 150 370 L 120 310 L 140 250 L 180 230 L 210 170 Z"
                  fill="#0F172A"
                  stroke="#1E2B52"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Regional Dividing Grid Lines */}
                <line x1="100" y1="280" x2="400" y2="280" stroke="#1E2B52" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="250" y1="100" x2="250" y2="580" stroke="#1E2B52" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                {/* Render Clickable Interactive State Pins on SVG Map */}
                {filteredStates.map((st) => {
                  const isSelected = st.id === selectedStateId;
                  const isCompared = isCompareMode && st.id === compareStateId;

                  return (
                    <g
                      key={st.id}
                      onClick={() => handleStateSelect(st.id)}
                      className="cursor-pointer group"
                    >
                      {/* Outer Pulse Circle for Selected State */}
                      {(isSelected || isCompared) && (
                        <circle
                          cx={st.mapPosition.x}
                          cy={st.mapPosition.y}
                          r="16"
                          className={`${isSelected ? 'fill-emerald-500/20 stroke-emerald-400' : 'fill-amber-500/20 stroke-amber-400'} animate-ping`}
                          strokeWidth="1.5"
                        />
                      )}

                      {/* State Location Marker Pin */}
                      <circle
                        cx={st.mapPosition.x}
                        cy={st.mapPosition.y}
                        r={isSelected ? '9' : isCompared ? '8' : '6'}
                        className={`transition-all duration-200 ${
                          isSelected
                            ? 'fill-emerald-400 stroke-white'
                            : isCompared
                            ? 'fill-amber-400 stroke-white'
                            : 'fill-slate-700 stroke-slate-400 group-hover:fill-emerald-400 group-hover:stroke-white'
                        }`}
                        strokeWidth="2"
                      />

                      {/* State Code Label Tag */}
                      <text
                        x={st.mapPosition.x + 12}
                        y={st.mapPosition.y + 4}
                        fill={isSelected ? '#34D399' : isCompared ? '#FBBF24' : '#94A3B8'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono, monospace"
                        className="pointer-events-none select-none group-hover:fill-white transition-colors"
                      >
                        {st.code} · {st.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick State Grid Buttons below Map */}
            <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-[11px] font-mono">
              {filteredStates.slice(0, 9).map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleStateSelect(st.id)}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all truncate ${
                    st.id === selectedStateId
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                      : st.id === compareStateId
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {st.code} - {st.name.split(' ')[0]}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column (7 Cols): Active State Compliance Dossier Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary State Profile Card */}
            <div className="bg-slate-950/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Card Top Title & State Code Badge */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                      GST State Code: {selectedState.code}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Region: {selectedState.region} India
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {selectedState.name} GST &amp; Tax Rules
                  </h3>
                  <p className="text-xs text-slate-400">
                    State Capital: <span className="text-white font-semibold">{selectedState.capital}</span> · Delivery Hub: <span className="text-emerald-400 font-semibold">{selectedState.deliveryHub}</span>
                  </p>
                </div>

                <button
                  onClick={() => onOpenBookingModal(`${selectedState.name} GST Compliance Advisory`)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <span>Book {selectedState.name} Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Key Metrics Grid: e-Way Bill Limit & Professional Tax Rules */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* 1. Intra-State e-Way Bill Threshold */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Intra-State e-Way Bill Limit</span>
                  </div>
                  <div className="text-xl font-mono font-extrabold text-white">
                    {selectedState.ewayBillThresholdIntraState}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedState.ewayBillExemptions}
                  </p>
                </div>

                {/* 2. Professional Tax (PT) Rules */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Professional Tax (PT) Provisions</span>
                  </div>
                  <p className="text-xs font-semibold text-white leading-snug">
                    {selectedState.professionalTaxRules}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                    PT Deadline: <span className="text-amber-300 font-bold">{selectedState.ptReturnDeadline}</span>
                  </p>
                </div>

              </div>

              {/* State Compliance Nuances & Audit Scrutinies */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Key SGST Audit Risks &amp; Local Compliance Guidelines
                </h4>
                <div className="space-y-2">
                  {selectedState.keyComplianceNuances.map((nuance, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{nuance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Tax Authority Office Address */}
              <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-center gap-3">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">State Tax Authority Jurisdiction:</span>
                  <span className="text-slate-300 font-medium">{selectedState.localTaxOffice}</span>
                </div>
              </div>

            </div>

            {/* Optional Side-by-Side Comparison Dossier Card */}
            <AnimatePresence>
              {isCompareMode && compareState && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                        State Comparison Mode: {selectedState.name} vs {compareState.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCompareMode(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2-Column Comparison Table */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    {/* Primary State */}
                    <div className="space-y-3 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <div className="font-extrabold text-emerald-400 text-sm">{selectedState.name} ({selectedState.code})</div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">e-Way Bill Limit:</span>
                        <span className="text-white font-bold">{selectedState.ewayBillThresholdIntraState}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Professional Tax:</span>
                        <span className="text-slate-300 text-[11px] leading-snug block">{selectedState.professionalTaxRules}</span>
                      </div>
                    </div>

                    {/* Compare State */}
                    <div className="space-y-3 p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/30">
                      <div className="font-extrabold text-amber-400 text-sm">{compareState.name} ({compareState.code})</div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">e-Way Bill Limit:</span>
                        <span className="text-white font-bold">{compareState.ewayBillThresholdIntraState}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Professional Tax:</span>
                        <span className="text-slate-300 text-[11px] leading-snug block">{compareState.professionalTaxRules}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
};
