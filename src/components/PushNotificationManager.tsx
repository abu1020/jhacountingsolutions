import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Calendar,
  AlertTriangle,
  BookOpen,
  Settings
} from 'lucide-react';

export const PushNotificationManager: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Notification Preferences
  const [prefs, setPrefs] = useState({
    taxDeadlines: true,
    regulatoryCirculars: true,
    cfoGuides: false
  });

  useEffect(() => {
    // Show banner after 3 seconds if not dismissed
    const dismissed = localStorage.getItem('jas_push_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnablePush = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsSubscribed(true);
          setShowBanner(false);
          setShowModal(false);
          localStorage.setItem('jas_push_dismissed', 'true');
          
          // Test notification
          new Notification('Jha Accounting Solutions', {
            body: 'Tax Deadline Alerts Enabled! You will receive timely statutory reminders.',
            icon: '/favicon.ico'
          });
        } else {
          setIsSubscribed(true);
          setShowBanner(false);
        }
      } catch (err) {
        setIsSubscribed(true);
        setShowBanner(false);
      }
    } else {
      setIsSubscribed(true);
      setShowBanner(false);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('jas_push_dismissed', 'true');
  };

  return (
    <>
      {/* Slide-Up Non-Intrusive Banner */}
      {showBanner && !isSubscribed && (
        <div className="fixed bottom-6 left-6 z-40 max-w-md w-full bg-[#0A1128] text-white p-5 rounded-2xl border border-[#1E2B52] shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  Tax Deadline Reminders
                </span>
                <h4 className="text-sm font-bold text-white">
                  Never Miss a GST or TDS Filing Deadline
                </h4>
              </div>
            </div>

            <button
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Opt-in to browser notifications for monthly GSTR-3B alerts, Section 194Q TDS rules, and Union Budget statutory updates.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleEnablePush}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-xs"
            >
              Enable Browser Alerts
            </button>
            <button
              onClick={() => {
                setShowBanner(false);
                setShowModal(true);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Preference Manager Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative space-y-6">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
                <Bell className="w-4 h-4" />
                <span>Web Push Controls</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Regulatory Alert Preferences
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Customize the statutory notifications you receive in your browser.
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-800">
              
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Monthly GST & TDS Deadlines</span>
                  <span className="text-[11px] text-slate-500 font-normal block">Alerts on 7th, 11th, and 20th of every month</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.taxDeadlines}
                  onChange={(e) => setPrefs(p => ({ ...p, taxDeadlines: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Union Budget & Statutory Circulars</span>
                  <span className="text-[11px] text-slate-500 font-normal block">CBIC & CBDT notification summaries</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.regulatoryCirculars}
                  onChange={(e) => setPrefs(p => ({ ...p, regulatoryCirculars: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Startup CFO & Bookkeeping Guides</span>
                  <span className="text-[11px] text-slate-500 font-normal block">Weekly blog articles & runway tools</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.cfoGuides}
                  onChange={(e) => setPrefs(p => ({ ...p, cfoGuides: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

            </div>

            <button
              onClick={handleEnablePush}
              className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
            >
              Save Preferences & Enable Web Push
            </button>

          </div>
        </div>
      )}
    </>
  );
};
