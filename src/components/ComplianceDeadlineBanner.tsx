import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  X,
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

  const activeDeadline = useMemo(() => {
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

        let category: 'GST' | 'TDS' | 'PF/ESI' | 'Advance Tax' = 'GST';
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

  const totalHours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const minutesDisplay = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDisplay = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);

  // Dynamic urgency messaging
  const urgencyStatus = useMemo(() => {
    if (totalHours < 24) return { label: 'CRITICAL: Due Today', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (totalHours < 72) return { label: 'URGENT: Filing Soon', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'UPCOMING: Scheduled', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
  }, [totalHours]);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-16 right-4 z-40"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className={`${urgencyStatus.bg} border ${urgencyStatus.border} text-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95`}
        >
          <BellRing className={`w-3 h-3 ${urgencyStatus.color} animate-bounce`} />
          <span>{activeDeadline.title}</span>
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
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        className="bg-slate-950 text-white border-b border-slate-800 shadow-sm relative z-30 select-none"
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
              <Clock className="w-3 h-3" />
              <span className="font-bold tabular-nums">
                {String(totalHours).padStart(2, '0')}:
                {String(minutesDisplay).padStart(2, '0')}:
                {String(secondsDisplay).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => onOpenBookingModal(activeDeadline.title)}
              className="bg-slate-100 hover:bg-white text-slate-950 px-3 py-1 rounded text-[10px] font-extrabold shadow-sm transition-all hover:scale-102 active:scale-98 flex items-center gap-1"
            >
              File Now
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
