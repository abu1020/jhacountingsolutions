import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, X, BellRing } from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';
import { EASE_OUT_EXPO, DURATION } from '../lib/motion';

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

/**
 * Isolated 1-second ticker: ONLY these digits re-render every second,
 * not the whole banner (the previous version setState'd the entire
 * component tree each tick).
 */
const CountdownText: React.FC<{ targetDate: Date }> = memo(({ targetDate }) => {
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(
    () => Math.max(0, targetDate.getTime() - Date.now())
  );

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemainingMs(Math.max(0, targetDate.getTime() - Date.now()));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const totalHours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const minutesDisplay = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDisplay = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);

  return (
    <span className="font-bold tabular-nums" aria-live="off">
      {String(totalHours).padStart(2, '0')}:
      {String(minutesDisplay).padStart(2, '0')}:
      {String(secondsDisplay).padStart(2, '0')}
    </span>
  );
});
CountdownText.displayName = 'CountdownText';

export const ComplianceDeadlineBanner: React.FC<ComplianceDeadlineBannerProps> = ({
  onOpenBookingModal
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const activeDeadline = useMemo<DeadlineItem | null>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

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

        let category: DeadlineItem['category'] = 'GST';
        if (item.title.toLowerCase().includes('tds')) category = 'TDS';
        else if (item.title.toLowerCase().includes('pf')) category = 'PF/ESI';
        else if (item.title.toLowerCase().includes('advance tax')) category = 'Advance Tax';

        let target = new Date(currentYear, currentMonth, dayNum, 23, 59, 59);
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

    return candidates[0] || null;
  }, []);

  // FIX: this hook previously sat AFTER an early return
  // (`if (!activeDeadline || isDismissed) return null`), which violates
  // the Rules of Hooks — hook count changed between renders.
  // All hooks now run unconditionally above every early return.
  const urgencyStatus = useMemo(() => {
    if (!activeDeadline) {
      return { label: 'UPCOMING: Scheduled', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
    }
    const totalHours = Math.floor(
      Math.max(0, activeDeadline.targetDate.getTime() - Date.now()) / (1000 * 60 * 60)
    );
    if (totalHours < 24) return { label: 'CRITICAL: Due Today', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (totalHours < 72) return { label: 'URGENT: Filing Soon', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'UPCOMING: Scheduled', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
  }, [activeDeadline]);

  if (!activeDeadline || isDismissed) return null;

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.fast, ease: EASE_OUT_EXPO }}
        className="fixed top-16 right-4 z-40"
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label={`Show compliance deadline: ${activeDeadline.title}`}
          className={`${urgencyStatus.bg} border ${urgencyStatus.border} backdrop-blur-md text-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
        >
          <BellRing className={`w-3 h-3 ${urgencyStatus.color}`} aria-hidden="true" />
          <span>{activeDeadline.title}</span>
        </button>
      </motion.div>
    );
  }

  return (
    // Transform/opacity entrance only — the previous `height: 0 → auto`
    // animation reflowed the page on load (CLS) and animated layout.
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT_EXPO }}
      className="bg-slate-950 text-white border-b border-slate-800 shadow-sm relative z-30 select-none"
      role="region"
      aria-label="Next statutory compliance deadline"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${urgencyStatus.border} ${urgencyStatus.bg} ${urgencyStatus.color}`}>
            {urgencyStatus.label}
          </div>
          <div className="text-xs font-bold text-slate-200 hidden sm:block">
            {activeDeadline.title}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <CountdownText targetDate={activeDeadline.targetDate} />
          </div>

          <button
            type="button"
            onClick={() => onOpenBookingModal(activeDeadline.title)}
            className="bg-slate-100 hover:bg-white text-slate-950 px-3 py-1 rounded text-[10px] font-extrabold shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 cursor-pointer"
          >
            File Now
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimise deadline banner"
            className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
