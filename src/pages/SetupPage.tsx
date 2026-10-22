import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '../components/LoadingButton';

const REQUIREMENT_OPTIONS = [
  'Accounting Software',
  'GST Filing',
  'Payroll',
  'Virtual CFO',
  'Team Chat/Collaboration',
  'Other'
];

export const SetupPage: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState(user?.displayName || userProfile?.name || '');
  const [email, setEmail] = useState(user?.email || userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [selectedReqs, setSelectedReqs] = useState<string[]>(['Accounting Software']);
  const [notes, setNotes] = useState('');

  // Validation & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters)';
    }

    // Indian phone format 10-digit validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!company.trim()) {
      errs.company = 'Please enter your company or business name';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const toggleReq = (option: string) => {
    if (selectedReqs.includes(option)) {
      setSelectedReqs(selectedReqs.filter(r => r !== option));
    } else {
      setSelectedReqs([...selectedReqs, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      const cleanPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/[^0-9]/g, '')}`;

      const profileData = {
        uid: user.uid,
        name,
        email,
        phone: cleanPhone,
        company,
        requirements: selectedReqs,
        notes,
        createdAt: new Date().toISOString(),
        onboardingComplete: true,
        plan: 'free',
        unlockedSoftware: ['osflex']
      };

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profileData, { merge: true });

      setIsSuccess(true);
      await refreshUserProfile();

      setTimeout(() => {
        window.location.hash = 'dashboard';
      }, 1200);
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      alert('Failed to save onboarding setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#10B981] rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl bg-[#102A4E] rounded-3xl p-6 sm:p-10 border border-[#1E3B66] shadow-2xl relative z-10 space-y-8">
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Back to Website</span>
          </button>
        </div>

        {/* Card Header & Step Progress Bar */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account Onboarding Setup</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Welcome to Jha Accounting
          </h1>

          <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2 border-t border-[#1E3B66]">
            <span>Progress: Step {step} of 2</span>
            <span className="text-[#10B981] font-bold">{step === 1 ? '50%' : '100%'} Completed</span>
          </div>

          {/* Progress Bar Line */}
          <div className="h-1.5 w-full bg-[#0B1F3A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-[#10B981] text-white rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Setup Complete!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto font-sans">
              Your corporate profile and OSFlex ERP access are ready. Redirecting to your Client Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
                  />
                  {errors.name && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Corporate Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={email}
                    className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-sm text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Phone Number (+91, 10 digits) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Company / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Vanguard Logistics Pvt Ltd"
                    className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
                  />
                  {errors.company && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.company}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Select Your Business Requirements *
                  </label>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {REQUIREMENT_OPTIONS.map((option) => {
                      const isSelected = selectedReqs.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleReq(option)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#10B981] text-white border-[#10B981] shadow-soft-sm'
                              : 'bg-[#0B1F3A] text-slate-300 border-[#162D4F] hover:bg-[#132D52]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    Tell Us What You Need (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional details about your current accounting setup or multi-state GST..."
                    className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 bg-[#0B1F3A] hover:bg-[#132D52] text-slate-300 border border-[#162D4F] rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <LoadingButton
                    type="submit"
                    isLoading={isSubmitting}
                    isSuccess={isSuccess}
                    className="flex-1 py-3.5 text-xs uppercase tracking-wider"
                  >
                    <span>Complete Setup &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </LoadingButton>
                </div>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
