import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  ShieldAlert,
  BellRing
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface ComplianceDeadlineBannerProps {
  onOpenBookingModal: (service?: string) => void;
}

interface DeadlineItem {
  targetDate: Date;
  dayNum: number;
  title: string;
  act: string;
  desc: string;
  category: 'GST' | 'TDS' | 'PF/ESI' | 'Advance Tax';
  urgency: 'critical' | 'upcoming';
}

export const ComplianceDeadlineBanner: React.FC<ComplianceDeadlineBannerProps> = ({
  onOpenBookingModal
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);

  // Determine current & next upcoming deadline from taxCalendar data
  const activeDeadline = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Map statutory days from taxCalendar (7th, 11th, 15th, 20th)
    const candidates: DeadlineItem[] = JHA_ACCOUNTING_DATA.taxCalendar
      .map(item => {
        let dayNum = parseInt(item.day, 10);
        if (isNaN(dayNum)) {
          if (item.day.includes('7')) dayNum = 7;
          else if (item.day.includes('11')) dayNum = 11;
          else if (item.day.includes('15')) dayNum = 15;
          else if (item.day.includes('20')) dayNum = 20;
          else dayNum = 20;
        }

        let category: 'GST' | 'TDS' | 'PF/ESI' | 'Advance Tax' = 'GST';
        if (item.title.toLowerCase().includes('tds')) category = 'TDS';
        else if (item.title.toLowerCase().includes('pf')) category = 'PF/ESI';
        else if (item.title.toLowerCase().includes('advance tax')) category = 'Advance Tax';

        // Set target date for current month at 23:59:59
        let target = new Date(currentYear, currentMonth, dayNum, 23, 59, 59);

        // If deadline passed this month, target next month
        if (target.getTime() < now.getTime()) {
          target = new Date(currentYear, currentMonth + 1, dayNum, 23, 59, 59);
        }

        return {
          targetDate: target,
          dayNum,
          title: item.title,
          act: item.act,
          desc: item.desc,
          category,
          urgency: item.urgency as 'critical' | 'upcoming'
        };
      })
      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());

    // Nearest upcoming deadline
    return candidates[0] || null;
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!activeDeadline) return;

    const updateTimer = () => {
      const diff = activeDeadline.targetDate.getTime() - Date.now();
      setTimeRemainingMs(Math.max(0, diff));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeDeadline]);

  if (!activeDeadline || isDismissed) return null;

  // Convert difference in ms to hours, minutes, seconds
  const totalHours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const hoursDisplay = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const minutesDisplay = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDisplay = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);

  // Ensure banner triggers when deadline is within 72 hours (3 days)
  // For demo & real time, if totalHours > 72, we still present urgent notice when close or within cutoff
  const isWithin72Hours = totalHours <= 72;

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 right-4 z-40"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-full font-mono text-xs font-bold shadow-xl border border-amber-300/80 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <BellRing className="w-3.5 h-3.5 animate-bounce text-slate-950" />
          <span>
            {activeDeadline.title}: {hoursDisplay}h {minutesDisplay}m Left
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white border-b border-amber-500/40 shadow-xl relative z-30 select-none overflow-hidden"
      >
        {/* Ambient Glowing Background Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-amber-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Left: Urgent Alert Badge & Details */}
            <div className="flex items-start sm:items-center gap-3">
              
              {/* Pulsing Icon Shield */}
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-4 h-4 animate-pulse text-amber-400" />
              </div>

              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Urgent Compliance Alert · Within 72 Hrs
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {activeDeadline.title}
                  </span>
                  <span className="text-[11px] font-mono text-amber-200/80 hidden lg:inline">
                    ({activeDeadline.act})
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block leading-tight">
                  Avoid Section 234F / Section 47 statutory late fees &amp; 18% p.a. interest penalties.
                </p>
              </div>
            </div>

            {/* Right: Ticking Countdown & Immediate Action Trigger */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-amber-500/20">
              
              {/* Ticking Countdown Boxes */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                
                <div className="bg-slate-900/90 border border-amber-500/40 px-2 py-1 rounded text-amber-300 font-extrabold tabular-nums">
                  {String(hoursDisplay).padStart(2, '0')}<span className="text-[10px] font-normal text-amber-400/70 ml-0.5">h</span>
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-slate-900/90 border border-amber-500/40 px-2 py-1 rounded text-amber-300 font-extrabold tabular-nums">
                  {String(minutesDisplay).padStart(2, '0')}<span className="text-[10px] font-normal text-amber-400/70 ml-0.5">m</span>
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-slate-900/90 border border-amber-500/40 px-2 py-1 rounded text-amber-300 font-extrabold tabular-nums w-10 text-center">
                  {String(secondsDisplay).padStart(2, '0')}<span className="text-[10px] font-normal text-amber-400/70 ml-0.5">s</span>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                onClick={() => onOpenBookingModal(activeDeadline.title)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-extrabold shadow-md transition-all hover:scale-102 active:scale-98 flex items-center gap-1.5 shrink-0"
              >
                <span>File {activeDeadline.category} Return Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Controls: Minimize & Dismiss */}
              <div className="flex items-center gap-1 border-l border-amber-500/30 pl-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 text-amber-200/70 hover:text-white rounded hover:bg-white/10 transition-colors text-[10px] font-mono"
                  title="Minimize banner"
                >
                  Min
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1 text-amber-200/70 hover:text-white rounded hover:bg-white/10 transition-colors"
                  title="Dismiss banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
