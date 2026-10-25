import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '../components/LoadingButton';
import { User as UserIcon, Building, Phone, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ClientProfilePage: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();

  const [name, setName] = useState(userProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [company, setCompany] = useState(userProfile?.company || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          name,
          phone,
          company,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      await refreshUserProfile();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      // Inline banner instead of window.alert() — stays inside the branded
      // portal surface and is announced to screen readers via role="alert".
      setSubmitError('Failed to update your profile. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white font-display">Client Profile &amp; Entity Settings</h2>
        <p className="text-xs text-slate-300 font-sans">Update your primary contact information and corporate entity details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#102A4E] rounded-3xl p-6 sm:p-8 border border-[#1E3B66] shadow-2xl space-y-5">
        {submitError && (
          <div
            role="alert"
            className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-300 font-sans"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">{submitError}</p>
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="edit-name" className="text-xs font-mono font-bold text-slate-300 uppercase block">
            Full Name *
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="edit-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-email" className="text-xs font-mono font-bold text-slate-300 uppercase block">
            Email Address (Read-Only)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="edit-email"
              type="email"
              readOnly
              value={user?.email || userProfile?.email || ''}
              className="w-full bg-[#071528] border border-[#162D4F] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-400 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-phone" className="text-xs font-mono font-bold text-slate-300 uppercase block">
            Phone Number (WhatsApp) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="edit-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-company" className="text-xs font-mono font-bold text-slate-300 uppercase block">
            Company / Entity Name *
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="edit-company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Vanguard Logistics Pvt Ltd"
              className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>
        </div>

        <div className="pt-2">
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            isSuccess={isSuccess}
            className="w-full py-3.5 text-xs uppercase tracking-wider"
          >
            <span>Save Profile Changes</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
