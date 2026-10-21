import React, { useState } from 'react';
import { X, Lock, CheckCircle2, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SoftwareItem } from '../config/softwareConfig';
import { LoadingButton } from './LoadingButton';
import { trackClickWhatsApp } from '../lib/analytics';

interface AccessRequestModalProps {
  software: SoftwareItem | null;
  userId: string;
  userEmail: string;
  onClose: () => void;
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  software,
  userId,
  userEmail,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!software) return null;

  const handleRequestSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'accessRequests'), {
        uid: userId,
        email: userEmail,
        softwareId: software.id,
        softwareName: software.name,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Access request submit error:', err);
      alert('Failed to submit access request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    trackClickWhatsApp();
    const text = encodeURIComponent(
      `Hi Jha Accounting Solutions, I would like to request unlock access for ${software.name} (${software.pricePlaceholder}).`
    );
    window.open(`https://wa.me/918882860226?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-[#0B1F3A] text-white rounded-3xl shadow-2xl border border-[#162D4F] w-full max-w-md p-6 sm:p-8 space-y-6 z-10 my-auto">
        <div className="flex items-center justify-between border-b border-[#162D4F] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Unlock {software.name}</h3>
              <span className="text-[11px] font-mono text-slate-400">{software.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">Request Submitted!</h4>
            <p className="text-xs text-slate-300 font-sans">
              Our lead advisory desk has received your request for {software.name}. An activation key will be issued shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {software.description}
            </p>

            <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Access Pricing</span>
              <div className="text-base font-extrabold text-[#10B981] font-mono">
                {software.pricePlaceholder}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <LoadingButton
                onClick={handleRequestSubmit}
                isLoading={isSubmitting}
                className="w-full py-3 text-xs uppercase tracking-wider"
              >
                <span>Request Access Token</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </LoadingButton>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-3 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl border border-[#162D4F] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#10B981]" />
                <span>Instant Unlock via WhatsApp (+91 88828 60226)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
