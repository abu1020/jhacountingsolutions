import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const BrandedAuthLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-navy-950 text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal font-extrabold font-mono text-2xl shadow-soft animate-pulse">
          JAS
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white font-display">
            Authenticating Client Session...
          </h2>
          <p className="text-xs font-mono text-emerald-400 font-medium">
            Jha Accounting Solutions
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Authenticating client session"
          className="w-48 h-1 bg-navy-700 rounded-full overflow-hidden"
        >
          <div className="h-full w-1/3 bg-brand-teal rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
};
