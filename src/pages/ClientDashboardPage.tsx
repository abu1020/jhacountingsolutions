import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  User as UserIcon,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ArrowLeft,
  CalendarClock,
  FileCheck2,
  GitCompareArrows,
  FileSignature,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SOFTWARE_CATALOG, SoftwareItem } from '../config/softwareConfig';
import { SoftwareCard } from '../components/SoftwareCard';
import { AccessRequestModal } from '../components/AccessRequestModal';
import { ClientProfilePage } from './ClientProfilePage';
import { CardSkeleton } from '../components/SkeletonLoader';
import { trackClickWhatsApp } from '../lib/analytics';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';
import { crossfadePanel, fadeUp, springPill, staggerContainer } from '../lib/motion';

type DashboardTab = 'dashboard' | 'software' | 'profile' | 'support';

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'software', label: 'My Software', icon: Cpu },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'support', label: 'Support Desk', icon: HelpCircle }
];

/**
 * Monthly GST filing cycle. Stages + statutory anchor dates only —
 * this visualises WHERE in the cycle today falls; it does not claim a
 * return was filed (filing receipts remain the source of truth, P1:
 * bind each stage to real ARN/receipt data — see review doc §1.1).
 */
const FILING_CYCLE = [
  { id: 'gstr1', label: 'GSTR-1', detail: 'Outward supplies · 11th', icon: FileCheck2 },
  { id: 'recon', label: '2B Reconciliation', detail: 'ITC mismatch resolution · 14th', icon: GitCompareArrows },
  { id: 'gstr3b', label: 'GSTR-3B', detail: 'Summary return & payment · 20th', icon: FileCheck2 },
  { id: 'sign', label: 'DSC / EVC Sign-off', detail: 'Digital signature verification', icon: FileSignature }
] as const;

interface MonthlyDeadline {
  title: string;
  act: string;
  dueDate: Date;
  daysLeft: number;
  state: 'passed' | 'due-today' | 'due-soon' | 'upcoming';
}

function useMonthlyDeadlines(): MonthlyDeadline[] {
  return useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return JHA_ACCOUNTING_DATA.taxCalendar
      .filter(item => item.period === 'Every Month')
      .map(item => {
        const dayNum = parseInt(item.day, 10) || 20;
        const dueDate = new Date(now.getFullYear(), now.getMonth(), dayNum, 23, 59, 59);
        const daysLeft = Math.round(
          (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime() -
            startOfToday.getTime()) /
            86_400_000
        );
        const state: MonthlyDeadline['state'] =
          daysLeft < 0 ? 'passed' : daysLeft === 0 ? 'due-today' : daysLeft <= 3 ? 'due-soon' : 'upcoming';
        return { title: item.title, act: item.act, dueDate, daysLeft, state };
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, []);
}

const DEADLINE_CHIP: Record<MonthlyDeadline['state'], { className: string; label: (d: MonthlyDeadline) => string }> = {
  passed: {
    className: 'text-slate-400 bg-slate-400/10 border-slate-400/25',
    label: d => `Window closed · ${d.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
  },
  'due-today': {
    className: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    label: () => 'Due today'
  },
  'due-soon': {
    className: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    label: d => `Due in ${d.daysLeft} day${d.daysLeft === 1 ? '' : 's'}`
  },
  upcoming: {
    className: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
    label: d => `Due in ${d.daysLeft} days`
  }
};

export const ClientDashboardPage: React.FC = () => {
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [selectedSoftwareModal, setSelectedSoftwareModal] = useState<SoftwareItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const monthlyDeadlines = useMonthlyDeadlines();
  const currentCycleStage = useMemo(() => {
    const day = new Date().getDate();
    if (day <= 11) return 0;
    if (day <= 14) return 1;
    if (day <= 20) return 2;
    return 3;
  }, []);

  const unlockedList = userProfile?.unlockedSoftware || ['osflex'];
  const userName = userProfile?.name || user?.displayName || 'Valued Client';

  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const handleSupportWhatsApp = () => {
    trackClickWhatsApp();
    const text = encodeURIComponent(
      `Hi Jha Accounting Solutions Support, I am logged in as ${userName} (${user?.email}) and need technical / advisory support.`
    );
    window.open(`https://wa.me/918882860226?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col md:flex-row font-sans">

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0B1F3A] border-b border-[#162D4F] p-4 flex items-center justify-between sticky top-0 z-30">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2.5 text-left cursor-pointer"
          title="Return to Website"
        >
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] font-extrabold font-mono">
            JAS
          </div>
          <span className="text-sm font-bold text-white font-display">Client Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goHome}
            className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-[#132D52] rounded-lg border border-[#162D4F] cursor-pointer"
          >
            Site &rarr;
          </button>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-expanded={isMobileSidebarOpen}
            aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#132D52] border border-[#162D4F] cursor-pointer"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar scrim — previously the drawer floated over content
          with no backdrop and no click-outside dismissal. */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#070D1F]/70 backdrop-blur-sm z-30 md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0B1F3A] border-r border-[#162D4F] p-5 flex flex-col justify-between transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Brand Logo Header */}
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-3 pb-4 border-b border-[#162D4F] w-full text-left cursor-pointer group hover:opacity-90"
            title="Return to Website"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-extrabold font-mono text-xl flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
              JAS
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white font-display leading-tight">Jha Accounting</h1>
              <span className="text-[10px] font-mono text-[#10B981]">Client Workspace</span>
            </div>
          </button>

          {/* Navigation — shared-element pill (layoutId) glides between items */}
          <nav aria-label="Client workspace" className="space-y-1.5 font-mono text-xs">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="client-nav-pill"
                      transition={springPill}
                      className="absolute inset-0 bg-[#10B981] rounded-xl shadow-soft"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3 flex-1">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'software' && (
                    <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#132D52] text-slate-300'}`}>
                      {SOFTWARE_CATALOG.length}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={goHome}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors cursor-pointer font-bold text-slate-300 hover:bg-[#132D52] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
              <span>Back to Website</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-[#162D4F]">
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Top Header Bar */}
        <header className="bg-[#0B1F3A] border-b border-[#162D4F] p-4 sm:p-6 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold text-[#10B981]">Client Workspace</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              Welcome, {userName}!
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-[#10B981] object-cover shadow-soft"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] font-bold font-mono flex items-center justify-center" aria-hidden="true">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block font-display">{userName}</span>
              <span className="text-[10px] font-mono text-slate-400 block">{userProfile?.company || user?.email}</span>
            </div>
          </div>
        </header>

        {/* Main Workspace Area — keyed panel transitions per tab */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-busy="true">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                variants={crossfadePanel}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTab === 'dashboard' && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                    {/* Active Plan Overview Banner */}
                    <motion.div variants={fadeUp} className="bg-[#102A4E] rounded-3xl p-6 border border-[#1E3B66] shadow-soft-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                            Corporate Account Active
                          </span>
                          <span className="text-xs font-mono text-slate-300">
                            Entity: {userProfile?.company || 'Pvt Ltd'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-display pt-1">
                          Compliance &amp; Advisory Overview
                        </h3>
                        <p className="text-xs text-slate-300 font-sans">
                          Your monthly GST filing cycle, statutory deadlines and software access — in one place.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSupportWhatsApp}
                        className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-mono font-bold rounded-xl shadow-soft transition-colors shrink-0 cursor-pointer flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        <span>Connect With Rishi Jha</span>
                      </button>
                    </motion.div>

                    {/* Monthly GST Filing Cycle Stepper */}
                    <motion.section
                      variants={fadeUp}
                      aria-label="Monthly GST filing cycle"
                      className="bg-[#102A4E] rounded-3xl p-6 border border-[#1E3B66] shadow-soft-lg space-y-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
                          Monthly GST Filing Cycle
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-3 list-none">
                        {FILING_CYCLE.map((stage, idx) => {
                          const Icon = stage.icon;
                          const isCurrent = idx === currentCycleStage;
                          const isCompleteWindow = idx < currentCycleStage;
                          return (
                            <li
                              key={stage.id}
                              aria-current={isCurrent ? 'step' : undefined}
                              className={`rounded-2xl p-4 border space-y-2 ${
                                isCurrent
                                  ? 'bg-[#10B981]/10 border-[#10B981]/50'
                                  : 'bg-[#0B1F3A] border-[#162D4F]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                    isCurrent || isCompleteWindow
                                      ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                                      : 'bg-[#132D52] border-[#162D4F] text-slate-400'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isCurrent ? 'text-[#10B981]' : 'text-slate-500'}`}>
                                  {isCurrent ? 'Current stage' : isCompleteWindow ? 'Window passed' : 'Upcoming'}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-white font-display leading-tight">{stage.label}</p>
                              <p className="text-[11px] text-slate-400 leading-snug">{stage.detail}</p>
                            </li>
                          );
                        })}
                      </ol>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Schedule view based on statutory due dates. Filing receipts (ARN) shared by your JAS lead remain the source of truth for filed status.
                      </p>
                    </motion.section>

                    {/* This Month's Statutory Schedule + Software Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      <motion.section
                        variants={fadeUp}
                        aria-label="This month's compliance deadlines"
                        className="lg:col-span-3 bg-[#102A4E] rounded-3xl p-6 border border-[#1E3B66] shadow-soft-lg space-y-4"
                      >
                        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
                          This Month&apos;s Compliance Schedule
                        </h3>
                        <ul className="space-y-2.5 list-none">
                          {monthlyDeadlines.map(deadline => {
                            const chip = DEADLINE_CHIP[deadline.state];
                            return (
                              <li
                                key={deadline.title}
                                className="flex items-center justify-between gap-3 bg-[#0B1F3A] rounded-xl px-4 py-3 border border-[#162D4F]"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white truncate">{deadline.title}</p>
                                  <p className="text-[10px] font-mono text-slate-500 truncate">{deadline.act}</p>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 tabular-nums ${chip.className}`}>
                                  {chip.label(deadline)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.section>

                      <motion.section
                        variants={fadeUp}
                        aria-label="Software access summary"
                        className="lg:col-span-2 bg-[#102A4E] rounded-3xl p-6 border border-[#1E3B66] shadow-soft-lg flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
                            Software &amp; Practice Hub
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            Access your unlocked lifetime software suite or request premium corporate add-ons.
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 tabular-nums">
                            {unlockedList.length} of {SOFTWARE_CATALOG.length} applications active
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectTab('software')}
                          className="w-full py-3 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl text-xs font-bold border border-[#162D4F] transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                        >
                          <span>Open My Software</span>
                          <ArrowRight className="w-4 h-4 text-[#10B981] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </button>
                      </motion.section>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'software' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#162D4F] pb-3">
                      <h3 className="text-lg font-bold text-white font-display">My Software Applications</h3>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {unlockedList.length} of {SOFTWARE_CATALOG.length} Active
                      </span>
                    </div>

                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {SOFTWARE_CATALOG.map(software => (
                        <motion.div key={software.id} variants={fadeUp}>
                          <SoftwareCard
                            software={software}
                            isUnlocked={unlockedList.includes(software.id)}
                            onRequestAccess={item => setSelectedSoftwareModal(item)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {activeTab === 'profile' && <ClientProfilePage />}

                {activeTab === 'support' && (
                  <div className="max-w-2xl bg-[#102A4E] rounded-3xl p-6 sm:p-8 border border-[#1E3B66] shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white font-display">Priority Client Support Desk</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Every account is assigned a dedicated lead accountant with a guaranteed 24-hour SLA across all filings, GST returns, and advisory questions.
                      </p>
                    </div>

                    <div className="bg-[#0B1F3A] rounded-2xl p-5 border border-[#162D4F] space-y-3 font-mono text-xs text-slate-300">
                      <div className="flex justify-between border-b border-[#162D4F] pb-2">
                        <span>Lead Advisory Partner:</span>
                        <span className="text-[#10B981] font-bold">Rishi Jha</span>
                      </div>
                      <div className="flex justify-between border-b border-[#162D4F] pb-2">
                        <span>Direct Mobile / WhatsApp:</span>
                        <a href="tel:+918882860226" className="text-white font-bold tabular-nums hover:text-[#10B981] transition-colors">
                          +91 88828 60226
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority Response SLA:</span>
                        <span className="text-[#10B981] font-bold">Guaranteed &lt; 2 Hours</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSupportWhatsApp}
                      className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      <span>Launch Priority WhatsApp Chat</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Access Request Modal */}
      {selectedSoftwareModal && (
        <AccessRequestModal
          software={selectedSoftwareModal}
          userId={user?.uid || ''}
          userEmail={user?.email || ''}
          onClose={() => setSelectedSoftwareModal(null)}
        />
      )}

    </div>
  );
};
