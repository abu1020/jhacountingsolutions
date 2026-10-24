import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Server
} from 'lucide-react';

interface LoginRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
}

export const LoginRedirectModal: React.FC<LoginRedirectModalProps> = ({
  isOpen,
  onClose,
  targetUrl = 'https://jhacountingsolution.vercel.app'
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setIsRedirecting(false);
      return;
    }

    // Step 1: Initialize Security Handshake
    setCurrentStep(1);
    setProgress(20);

    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(60);
    }, 600);

    // Step 2: Establish TLS 1.3 Workspace Connection
    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(95);
    }, 1200);

    // Step 3: Redirect
    const timer3 = setTimeout(() => {
      setProgress(100);
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.assign(targetUrl);
      }, 350);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleInstantRedirect = () => {
    window.location.assign(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dimmed & Blurred Backdrop with ambient gradient */}
      <div
        className="fixed inset-0 bg-[#070D1F]/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Authentication Portal Card */}
      <div className="relative bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#162D4F] w-full max-w-md mx-auto z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#10B981]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Scan Line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer z-20"
          aria-label="Cancel redirection"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-6 pt-2">
          
          {/* Animated Central Icon Cluster */}
          <div className="relative">
            {/* Outer Pulsing Waves */}
            <div className="absolute inset-0 rounded-2xl bg-[#10B981]/20 animate-ping opacity-60 pointer-events-none" />
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#10B981]/30 to-blue-500/20 blur-md pointer-events-none" />

            {/* Core Shield Box */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#102A4E] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-soft-lg group">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#10B981] animate-pulse" />
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#10B981] text-[#0B1F3A] flex items-center justify-center shadow-xs">
                <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-1.5 max-w-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#10B981]" />
              <span>Secure Client Gateway</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Accessing Client Portal
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Connecting you securely to your dedicated accounting, GST &amp; tax workspace at <span className="font-mono text-emerald-300 font-semibold">jhacountingsolution.vercel.app</span>
            </p>
          </div>

          {/* Step Progression Indicators */}
          <div className="w-full bg-[#081527] rounded-2xl p-4 border border-[#162D4F] space-y-2.5 text-left text-xs font-mono">
            
            {/* Step 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span className={currentStep >= 1 ? 'text-white font-medium' : 'text-slate-500'}>
                  Domain &amp; SSL Handshake
                </span>
              </div>
              {currentStep >= 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] animate-in zoom-in duration-150" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className={currentStep >= 2 ? 'text-white font-medium' : 'text-slate-500'}>
                  256-Bit Encrypted Channel
                </span>
              </div>
              {currentStep >= 2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] animate-in zoom-in duration-150" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span className={currentStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isRedirecting ? 'Redirecting now...' : 'Launching Client Login Desk'}
                </span>
              </div>
              {currentStep >= 3 ? (
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </div>

          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Security Handshake</span>
              <span className="text-[#10B981] font-bold tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-xs"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="w-full pt-1 flex flex-col gap-2">
            <button
              onClick={handleInstantRedirect}
              className="w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.98] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Login Desk Immediately</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer font-mono"
            >
              Cancel &amp; Stay on Website
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
