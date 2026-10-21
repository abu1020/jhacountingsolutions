import React, { useState } from 'react';
import {
  LayoutDashboard,
  Cpu,
  User as UserIcon,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SOFTWARE_CATALOG, SoftwareItem } from '../config/softwareConfig';
import { SoftwareCard } from '../components/SoftwareCard';
import { AccessRequestModal } from '../components/AccessRequestModal';
import { ClientProfilePage } from './ClientProfilePage';
import { CardSkeleton } from '../components/SkeletonLoader';
import { trackClickWhatsApp } from '../lib/analytics';

export const ClientDashboardPage: React.FC = () => {
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'software' | 'profile' | 'support'>('dashboard');
  const [selectedSoftwareModal, setSelectedSoftwareModal] = useState<SoftwareItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const unlockedList = userProfile?.unlockedSoftware || ['osflex'];
  const userName = userProfile?.name || user?.displayName || 'Valued Client';

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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] font-extrabold font-mono">
            JAS
          </div>
          <span className="text-sm font-bold text-white font-display">Client Portal</span>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#132D52] border border-[#162D4F]"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0B1F3A] border-r border-[#162D4F] p-5 flex flex-col justify-between transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#162D4F]">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-extrabold font-mono text-xl flex items-center justify-center shadow-soft-sm">
              JAS
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white font-display leading-tight">Jha Accounting</h1>
              <span className="text-[10px] font-mono text-[#10B981]">Client Workspace</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer font-bold ${
                activeTab === 'dashboard'
                  ? 'bg-[#10B981] text-white shadow-soft'
                  : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('software');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer font-bold ${
                activeTab === 'software'
                  ? 'bg-[#10B981] text-white shadow-soft'
                  : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>My Software</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">
                {SOFTWARE_CATALOG.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer font-bold ${
                activeTab === 'profile'
                  ? 'bg-[#10B981] text-white shadow-soft'
                  : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('support');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer font-bold ${
                activeTab === 'support'
                  ? 'bg-[#10B981] text-white shadow-soft'
                  : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support Desk</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-[#162D4F]">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
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
                alt={userName}
                className="w-10 h-10 rounded-full border-2 border-[#10B981] object-cover shadow-soft"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] font-bold font-mono flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block font-display">{userName}</span>
              <span className="text-[10px] font-mono text-slate-400 block">{userProfile?.company || user?.email}</span>
            </div>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : activeTab === 'dashboard' || activeTab === 'software' ? (
            <div className="space-y-6">
              
              {/* Active Plan Overview Banner */}
              <div className="bg-[#102A4E] rounded-3xl p-6 border border-[#1E3B66] shadow-soft-lg flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    Software &amp; Practice Advisory Hub
                  </h3>
                  <p className="text-xs text-slate-300 font-sans">
                    Access your unlocked lifetime software suite or request premium corporate add-ons.
                  </p>
                </div>

                <button
                  onClick={handleSupportWhatsApp}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-mono font-bold rounded-xl shadow-soft transition-all shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect With Rishi Jha</span>
                </button>
              </div>

              {/* My Software Catalog Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#162D4F] pb-3">
                  <h3 className="text-lg font-bold text-white font-display">My Software Applications</h3>
                  <span className="text-xs font-mono text-slate-400">
                    {unlockedList.length} of {SOFTWARE_CATALOG.length} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SOFTWARE_CATALOG.map((software) => {
                    const isUnlocked = unlockedList.includes(software.id);
                    return (
                      <SoftwareCard
                        key={software.id}
                        software={software}
                        isUnlocked={isUnlocked}
                        onRequestAccess={(item) => setSelectedSoftwareModal(item)}
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          ) : activeTab === 'profile' ? (
            <ClientProfilePage />
          ) : (
            /* Support Desk View */
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
                  <span className="text-white font-bold">+91 88828 60226</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority Response SLA:</span>
                  <span className="text-[#10B981] font-bold">Guaranteed &lt; 2 Hours</span>
                </div>
              </div>

              <button
                onClick={handleSupportWhatsApp}
                className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch Priority WhatsApp Chat</span>
              </button>
            </div>
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
