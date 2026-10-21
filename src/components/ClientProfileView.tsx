import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { saveUserProfile } from '../lib/firebase';
import { LoadingButton } from './LoadingButton';

interface ClientProfileViewProps {
  currentUser: User | null;
  profile: any;
  onProfileUpdate: (updated: any) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  currentUser,
  profile,
  onProfileUpdate
}) => {
  const [companyName, setCompanyName] = useState(profile?.companyName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [gstStateCount, setGstStateCount] = useState(profile?.gstStateCount || '1');
  const [businessType, setBusinessType] = useState(profile?.businessType || 'Pvt Ltd Company');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    const updatedData = {
      ...profile,
      companyName,
      phone,
      gstStateCount,
      businessType,
      updatedAt: new Date().toISOString()
    };

    try {
      await saveUserProfile(currentUser.uid, updatedData);
      onProfileUpdate(updatedData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#102A4E] p-6 rounded-2xl border border-[#1E3B66]">
      <h4 className="text-sm font-bold text-white font-display border-b border-[#1E3B66] pb-2">
        Corporate Entity &amp; Contact Details
      </h4>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="profile-company" className="text-xs font-mono font-bold text-slate-300 uppercase">
            Company Name
          </label>
          <input
            id="profile-company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Vanguard Technologies Pvt Ltd"
            className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-phone" className="text-xs font-mono font-bold text-slate-300 uppercase">
            Contact Phone (WhatsApp)
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="profile-entity" className="text-xs font-mono font-bold text-slate-300 uppercase">
            Entity Type
          </label>
          <select
            id="profile-entity"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10B981] font-mono cursor-pointer"
          >
            <option value="Pvt Ltd Company">Pvt Ltd Company</option>
            <option value="LLP">Limited Liability Partnership (LLP)</option>
            <option value="Partnership Firm">Partnership Firm</option>
            <option value="Proprietorship">Proprietorship</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-gst-count" className="text-xs font-mono font-bold text-slate-300 uppercase">
            Active GST Registrations
          </label>
          <select
            id="profile-gst-count"
            value={gstStateCount}
            onChange={(e) => setGstStateCount(e.target.value)}
            className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10B981] font-mono cursor-pointer"
          >
            <option value="1">1 State (Single Location)</option>
            <option value="2-5">2 to 5 States</option>
            <option value="6-10">6 to 10 States</option>
            <option value="10+">10+ States (Pan-India)</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          isSuccess={isSuccess}
          className="w-full py-3 text-xs uppercase tracking-wider"
        >
          <span>Update Corporate Profile</span>
        </LoadingButton>
      </div>
    </form>
  );
};
