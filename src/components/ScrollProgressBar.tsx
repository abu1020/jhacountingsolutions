import React, { useState, useEffect } from 'react';

interface ScrollProgressBarProps {
  /** Optional container element ref if tracking scroll inside a modal or scrollable div instead of window */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Only show when active */
  isActive?: boolean;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  containerRef,
  isActive = true
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (containerRef && containerRef.current) {
        const el = containerRef.current;
        scrollTop = el.scrollTop;
        scrollHeight = el.scrollHeight;
        clientHeight = el.clientHeight;
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = document.documentElement.clientHeight;
      }

      const totalHeight = scrollHeight - clientHeight;
      if (totalHeight > 0) {
        const p = (scrollTop / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, p)));
      } else {
        setProgress(0);
      }
    };

    const targetEl = containerRef?.current || window;
    targetEl.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      targetEl.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, isActive]);

  if (!isActive) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/40 pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-600 to-[#10B981] transition-all duration-75 ease-out shadow-xs"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
