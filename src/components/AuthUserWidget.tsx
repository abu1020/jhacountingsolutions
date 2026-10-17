import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { auth, signInWithGoogle, logOutUser } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthUserWidgetProps {
  onOpenClientPortal?: () => void;
}

export const AuthUserWidget: React.FC<AuthUserWidgetProps> = ({ onOpenClientPortal }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user && onOpenClientPortal) {
        onOpenClientPortal();
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logOutUser();
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse shrink-0" />
    );
  }

  if (!currentUser) {
    return (
      <button
        onClick={handleSignIn}
        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        title="Sign in with Google to access your Client Dashboard & Onboarding"
      >
        <LogIn className="w-3.5 h-3.5 text-emerald-400" />
        <span>Client Login</span>
      </button>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenClientPortal && onOpenClientPortal()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenClientPortal && onOpenClientPortal();
        }
      }}
      className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 px-2.5 py-1 rounded-full text-xs shrink-0 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      title="Open Client Accounting Dashboard"
    >
      {currentUser.photoURL ? (
        <img
          src={currentUser.photoURL}
          alt={currentUser.displayName || 'User'}
          className="w-5 h-5 rounded-full object-cover border border-emerald-500/50"
        />
      ) : (
        <UserIcon className="w-4 h-4 text-emerald-400" />
      )}
      <span className="text-white font-semibold text-[11px] max-w-[90px] truncate hidden sm:inline">
        {currentUser.displayName?.split(' ')[0] || 'Client'}
      </span>
      <button
        onClick={handleSignOut}
        className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-0.5"
        title="Sign Out"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
