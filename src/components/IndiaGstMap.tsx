import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { INDIA_STATE_GST_DATA } from '../data/stateGstData';
import { GstStateDetailCard } from './GstStateDetailCard';
import { ScrollReveal } from './ScrollReveal';
import { WorldClassDropdown, DropdownOption } from './WorldClassDropdown';

interface IndiaGstMapProps {
  onOpenBookingModal: (service?: string) => void;
}

export const IndiaGstMap: React.FC<IndiaGstMapProps> = ({ onOpenBookingModal }) => {
  const [selectedStateId, setSelectedStateId] = useState<string>('delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Active Selected State
  const selectedState = useMemo(() => {
    return INDIA_STATE_GST_DATA.find(s => s.id === selectedStateId) || INDIA_STATE_GST_DATA[0];
  }, [selectedStateId]);

  // Filtered States
  const filteredStates = useMemo(() => {
    return INDIA_STATE_GST_DATA.filter(s => {
      const matchesRegion = selectedRegion === 'All' || s.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesRegion;

      const matchesName = s.name.toLowerCase().includes(q);
      const matchesCode = s.code.includes(q);
      const matchesCapital = s.capital.toLowerCase().includes(q);

      return matchesRegion && (matchesName || matchesCode || matchesCapital);
    });
  }, [searchQuery, selectedRegion]);

  const stateDropdownOptions: DropdownOption[] = useMemo(() => {
    return INDIA_STATE_GST_DATA.map((st) => ({
      value: st.id,
      label: st.name,
      badge: `Code ${st.code}`,
      description: `${st.capital} · ${st.region} Region`
    }));
  }, []);

  return (
    <section id="gst-map" className="jas-dark py-20 bg-navy-850 text-white relative overflow-hidden border-y border-navy-600 scroll-mt-20 lg:scroll-mt-24">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-brand-teal/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-navy-700 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/15 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-brand-teal" />
              <span>Interactive State Compliance Map</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              State-Specific GST Rules &amp; Local Tax Deadlines
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Click on any Indian state or commercial hub to inspect intra-state e-Way Bill threshold limits, local Professional Tax (PT) filing rules, and regional SGST audit guidelines.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Regional Filter Bar */}
        <ScrollReveal delayMs={100}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-navy-700 p-4 rounded-2xl border border-navy-600 backdrop-blur-md shadow-soft-md">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-brand-teal absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state, GST code (e.g. 07)..."
                className="w-full bg-navy-850 border border-navy-600 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['All', 'North', 'South', 'West', 'East', 'Central'].map(reg => (
                <button
                  key={reg}
                  type="button"
                  aria-pressed={selectedRegion === reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer shrink-0 ${
                    selectedRegion === reg
                      ? 'bg-brand-teal text-white border-brand-teal shadow-soft-sm'
                      : 'bg-navy-850 text-slate-300 border-navy-600 hover:bg-navy-800'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

          </div>
        </ScrollReveal>

        {/* Mobile Quick State Selector (Instantly changes the active state card on mobile) */}
        <div className="lg:hidden bg-navy-700 p-3.5 rounded-2xl border border-navy-600 flex flex-col gap-2 shadow-soft">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-teal font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Select Any State or UT</span>
            </span>
            <span className="text-slate-400 text-[10px]">36 Jurisdictions</span>
          </div>
          <WorldClassDropdown
            id="mobile-state-selector"
            value={selectedState.id}
            options={stateDropdownOptions}
            onChange={(val) => setSelectedStateId(val)}
            variant="dark"
            searchable
            placeholder="Search 36 States & UTs..."
            icon={<MapPin className="w-4 h-4 text-brand-teal" />}
          />
        </div>

        {/* Interactive Layout: Active State Card + State Selector List */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Active Detail Card (7 cols on desktop, top on mobile) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <GstStateDetailCard
                key={selectedState.id}
                state={selectedState}
                onOpenBookingModal={onOpenBookingModal}
              />
            </AnimatePresence>
          </div>

          {/* State List selector (5 cols on desktop, companion directory on mobile) */}
          <div className="lg:col-span-5 order-2 lg:order-1 bg-navy-700 rounded-2xl p-4 border border-navy-600 max-h-[260px] lg:max-h-[480px] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-navy-600">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Directory ({filteredStates.length} Indian States / UTs)
              </span>
              <span className="text-[10px] font-mono text-brand-teal">
                Tap to View
              </span>
            </div>

            {filteredStates.map((st) => {
              const isSelected = st.id === selectedState.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedStateId(st.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-teal text-white border-brand-teal shadow-soft-sm'
                      : 'bg-navy-850 text-slate-300 border-navy-600 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-navy-800 text-brand-teal'}`}>
                      {st.code}
                    </span>
                    <span className="text-xs font-bold font-display">{st.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{st.capital}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
