import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface WebsiteLoaderProps {
  onLoadingComplete?: () => void;
  durationMs?: number;
}

export const WebsiteLoader: React.FC<WebsiteLoaderProps> = ({
  onLoadingComplete,
  durationMs = 700
}) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Status message phases
  const getStatusText = (prog: number) => {
    if (prog < 35) return "Initializing Financial Architecture...";
    if (prog < 70) return "Verifying GST & Tax Rules Engine...";
    return "Ready · Jha Accounting Solutions";
  };

  useEffect(() => {
    // Check if loaded earlier in session for even faster reload
    const isReload = sessionStorage.getItem('jas_loader_seen');
    const effectiveDuration = isReload ? 400 : durationMs;

    // Lock background scroll during loading animation
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min(Math.round((elapsed / effectiveDuration) * 100), 100);

      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        sessionStorage.setItem('jas_loader_seen', 'true');
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = 'unset';
          if (onLoadingComplete) onLoadingComplete();
        }, 120);
      }
    };

    const animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = 'unset';
    };
  }, [durationMs, onLoadingComplete]);

  // Calculate SVG stroke offset
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="website-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-[#0A1128] text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none"
        >
          {/* Background Ambient Radial Glowing Spheres */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-sm mx-auto">
            
            {/* Center Brand Badge with Circular Progress Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              
              {/* Circular SVG Progress Ring */}
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#1E2B52"
                  strokeWidth="5"
                  fill="none"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="url(#emerald-gradient)"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-75 ease-out"
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Shield Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 border border-emerald-400/50"
              >
                <ShieldCheck className="w-10 h-10 text-white stroke-[2.2] animate-pulse" />
              </motion.div>

            </div>

            {/* Brand Title & Designation */}
            <div className="space-y-2">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex items-center justify-center gap-2"
              >
                <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                  Jha Accounting
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  GST &amp; Tax
                </span>
              </motion.div>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xs font-mono text-emerald-400/90 uppercase tracking-widest"
              >
                Est. 2022 · Corporate Advisory
              </motion.p>
            </div>

            {/* Progress Percentage & Status Label */}
            <div className="w-full space-y-3 pt-2">
              
              {/* Numeric Counter */}
              <div className="flex items-center justify-between text-xs font-mono px-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL
                </span>
                <span className="text-emerald-400 font-extrabold text-lg tabular-nums">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-75 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Dynamic Status Text */}
              <div className="text-[11px] font-mono text-slate-400 h-5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{getStatusText(progress)}</span>
              </div>

            </div>

          </div>

          {/* Bottom Security Footer Line */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            High-Precision Corporate Accounting · 24-Hour SLA
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
