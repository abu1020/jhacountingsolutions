import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountingNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountingNumber: React.FC<CountingNumberProps> = ({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    decimals > 0 ? (0).toFixed(decimals) : '0'
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(decimals > 0 ? (0).toFixed(decimals) : '0');
      return;
    }

    let startTimestamp: number | null = null;
    const durationMs = duration * 1000;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);

      // easeOutCubic curve for smooth settling
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = easeProgress * value;

      if (decimals > 0) {
        setDisplayValue(currentNumber.toFixed(decimals));
      } else {
        setDisplayValue(Math.floor(currentNumber).toLocaleString('en-IN'));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(
          decimals > 0
            ? value.toFixed(decimals)
            : value.toLocaleString('en-IN')
        );
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration, decimals]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
