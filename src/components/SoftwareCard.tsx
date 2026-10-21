import React from 'react';
import { Lock, ExternalLink, Cpu, MessageSquare, Check, ShieldCheck } from 'lucide-react';
import { SoftwareItem } from '../config/softwareConfig';

interface SoftwareCardProps {
  software: SoftwareItem;
  isUnlocked: boolean;
  onRequestAccess: (software: SoftwareItem) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  MessageSquare
};

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  software,
  isUnlocked,
  onRequestAccess
}) => {
  const IconComponent = ICON_MAP[software.iconName] || Cpu;

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
        isUnlocked
          ? 'bg-[#102A4E] border-[#1E3B66] shadow-soft-lg hover:border-[#10B981]/50'
          : 'bg-[#0B1F3A]/70 border-[#162D4F] opacity-80'
      }`}
    >
      <div className="space-y-4">
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] border border-[#1E3B66] flex items-center justify-center text-[#10B981]">
            <IconComponent className="w-6 h-6" />
          </div>

          {isUnlocked ? (
            <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Active · {software.badge}</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Locked Software</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <span>{software.name}</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 block">{software.tagline}</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
            {software.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#1E3B66] flex items-center justify-between">
        {isUnlocked ? (
          <a
            href={software.url}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open {software.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <button
            onClick={() => onRequestAccess(software)}
            className="w-full py-3 px-4 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold border border-[#162D4F] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Request Access / Buy ({software.pricePlaceholder})</span>
          </button>
        )}
      </div>
    </div>
  );
};
