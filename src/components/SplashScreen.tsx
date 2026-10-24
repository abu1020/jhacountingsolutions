import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

// In-memory flag so splash shows only ONCE per page load (sessionStorage-free)
let hasSplashShownThisPageLoad = false;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => !hasSplashShownThisPageLoad);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // If already shown on this page load or user prefers reduced motion, skip splash immediately
    if (hasSplashShownThisPageLoad) {
      if (onComplete) onComplete();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      hasSplashShownThisPageLoad = true;
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Lock body scroll during splash screen
    document.body.style.overflow = 'hidden';

    // 0.8 second total duration progress bar animation
    const totalDuration = 800; // 0.8s
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(currentProgress);

      if (elapsed < totalDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Trigger upward curtain fade out animation
        setIsFadingOut(true);
        hasSplashShownThisPageLoad = true;

        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 400); // 400ms curtain reveal transition
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    // Safeguard timeout: never block page for more than 1.0 seconds
    const safeguardTimer = setTimeout(() => {
      hasSplashShownThisPageLoad = true;
      setIsVisible(false);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 1000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(safeguardTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0B1F3A] text-white flex flex-col items-center justify-center p-6 select-none transition-all duration-400 ease-in-out ${
        isFadingOut
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto">
        
        {/* SVG Stroke Animation Logo "JAS" */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hexagon Shield Stroke */}
            <polygon
              points="50,5 90,25 90,75 50,95 10,75 10,25"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-splash-stroke"
              style={{
                strokeDasharray: 320,
                strokeDashoffset: Math.max(0, 320 - (progress / 100) * 320),
                transition: 'stroke-dashoffset 50ms linear'
              }}
            />
            {/* Monogram Text "JAS" */}
            <text
              x="50"
              y="58"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="26"
              fontWeight="800"
              fontFamily="Plus Jakarta Sans, sans-serif"
              letterSpacing="2"
            >
              JAS
            </text>
          </svg>
        </div>

        {/* Company Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight font-display">
            Jha Accounting Solutions
          </h2>
          <p className="text-xs font-mono text-emerald-400 font-medium tracking-wider uppercase">
            GST Compliance, Income Tax &amp; Bookkeeping
          </p>
        </div>

        {/* Thin Emerald Progress Bar (0 to 100%) */}
        <div className="w-56 space-y-2">
          <div className="h-1 w-full bg-[#132D52] rounded-full overflow-hidden p-0.5 border border-[#162D4F]">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%`, willChange: 'width' }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Audit-Ready System</span>
            <span className="text-[#10B981] font-bold">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
