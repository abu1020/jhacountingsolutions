import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User as UserIcon, Phone, Mail, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile, logOutUser } from '../lib/firebase';
import { ClientProfileView } from './ClientProfileView';
import { COMPANY_CONTENT } from '../data/content';
import { useDialog } from '../hooks/useDialog';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenBookingModal: (service?: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenBookingModal
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'status' | 'profile'>('status');

  useEffect(() => {
    if (isOpen && currentUser) {
      setIsLoadingProfile(true);
      getUserProfile(currentUser.uid)
        .then((data) => {
          if (data) setProfile(data);
        })
        .finally(() => setIsLoadingProfile(false));
    }
  }, [isOpen, currentUser]);

  useDialog(isOpen, onClose);

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logOutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-label="Client Service Portal" className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-soft-lg border border-[#162D4F] w-full max-w-3xl overflow-hidden z-10 my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#132D52] border-b border-[#162D4F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-extrabold font-mono text-lg shadow-soft-sm">
              C
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981] block">
                Client Service Portal
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
                {currentUser?.displayName || currentUser?.email || 'Valued Corporate Client'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-[#071528] hover:bg-[#132D52] text-slate-300 text-xs font-mono border border-[#162D4F] transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Direct Launch Banner */}
        <div className="bg-[#102A4E] px-6 py-3 border-b border-[#1E3B66] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-slate-300 font-sans">Full client accounting &amp; filing workspace:</span>
          </div>
          <a
            href="https://jhacountingsolution.vercel.app"
            className="text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Launch Client Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 bg-[#071528] p-2 rounded-2xl border border-[#162D4F]">
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'status' ? 'bg-[#10B981] text-white shadow-soft-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Filing SLA &amp; Status
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#10B981] text-white shadow-soft-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Corporate Profile Details
            </button>
          </div>

          {activeTab === 'status' ? (
            <div className="space-y-4">
              <div className="bg-[#102A4E] rounded-2xl p-5 border border-[#1E3B66] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 uppercase">Current Month Compliance SLA</span>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                    Active &amp; Compliant
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#0B1F3A] p-3 rounded-xl border border-[#162D4F] space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">GSTR-1 Status</span>
                    <span className="text-xs font-extrabold text-[#10B981] font-mono block">Filed (Receipt #GSTR12984)</span>
                  </div>
                  <div className="bg-[#0B1F3A] p-3 rounded-xl border border-[#162D4F] space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">GSTR-3B Target</span>
                    <span className="text-xs font-extrabold text-white font-mono block">Schedule Locked · 20th</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#102A4E] rounded-2xl p-5 border border-[#1E3B66] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white font-display">Need Additional Filing State or CFO Advisory?</h4>
                  <p className="text-xs text-slate-300 font-sans">Connect directly with Lead Partner Rishi Jha.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBookingModal('Client Portal Scope Expansion');
                  }}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-soft transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Request Advisory Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <ClientProfileView
              currentUser={currentUser}
              profile={profile}
              onProfileUpdate={(updated) => setProfile(updated)}
            />
          )}
        </div>

      </div>
    </div>
  );
};
