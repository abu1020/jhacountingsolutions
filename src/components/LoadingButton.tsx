import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  isSuccess = false,
  loadingText = 'Sending...',
  successText = 'Submitted Successfully!',
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = 'relative transition-all duration-200 font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 active:scale-98 ';

  if (variant === 'primary') {
    baseStyles += 'bg-brand-teal hover:bg-brand-teal-hover text-white focus:ring-brand-teal ';
  } else if (variant === 'dark') {
    baseStyles += 'bg-navy-850 hover:bg-navy-700 text-white focus:ring-navy-850 ';
  } else {
    baseStyles += 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300 ';
  }

  return (
    <button
      disabled={isLoading || isSuccess || disabled}
      className={`${baseStyles} ${className} ${isLoading || isSuccess ? 'opacity-90 cursor-wait' : ''}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
          <span>{loadingText}</span>
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{successText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
