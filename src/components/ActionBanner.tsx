import React from 'react';
import type { CardColor } from '../types/game';
import { Ban, RefreshCw, Zap, Sparkles, Flame, CheckCircle, AlertCircle } from 'lucide-react';

export interface ActionNotice {
  id: string;
  type: 'attack' | 'skip' | 'reverse' | 'color' | 'uno' | 'turn' | 'challenge';
  titleUz: string;
  titleEn: string;
  subtitleUz?: string;
  subtitleEn?: string;
  color?: CardColor;
}

interface ActionBannerProps {
  notice: ActionNotice | null;
  lang?: 'uz' | 'en';
}

const COLOR_PILL: Record<CardColor, { bg: string; text: string }> = {
  red: { bg: 'bg-red-600', text: 'text-red-200' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-200' },
  green: { bg: 'bg-emerald-600', text: 'text-emerald-200' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-950' },
  wild: { bg: 'bg-purple-600', text: 'text-purple-200' },
};

export const ActionBanner: React.FC<ActionBannerProps> = ({ notice, lang = 'uz' }) => {
  if (!notice) return null;

  const renderIcon = () => {
    switch (notice.type) {
      case 'skip':
        return <Ban size={22} className="text-red-400 animate-pulse" />;
      case 'reverse':
        return <RefreshCw size={22} className="text-cyan-400 animate-spin" />;
      case 'attack':
        return <Zap size={22} className="text-yellow-400 animate-bounce" />;
      case 'color':
        return <Sparkles size={22} className="text-purple-300 animate-pulse" />;
      case 'uno':
        return <Flame size={22} className="text-orange-400 animate-bounce" />;
      case 'challenge':
        return <AlertCircle size={22} className="text-amber-400 animate-pulse" />;
      default:
        return <CheckCircle size={22} className="text-emerald-400" />;
    }
  };

  const colorStyle = notice.color ? COLOR_PILL[notice.color] : null;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 w-full max-w-sm px-4">
      <div className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-yellow-400/80 shadow-2xl shadow-yellow-500/20 backdrop-blur-md animate-bounce">
        <div className="shrink-0 p-1.5 rounded-xl bg-slate-800 border border-slate-700">
          {renderIcon()}
        </div>

        <div className="flex flex-col text-center">
          <span className="font-black text-xs sm:text-sm text-white tracking-wide uppercase drop-shadow">
            {lang === 'uz' ? notice.titleUz : notice.titleEn}
          </span>
          {(notice.subtitleUz || notice.subtitleEn) && (
            <span className="text-[11px] font-semibold text-slate-300">
              {lang === 'uz' ? notice.subtitleUz : notice.subtitleEn}
            </span>
          )}
        </div>

        {colorStyle && (
          <span className={`w-3.5 h-3.5 rounded-full ${colorStyle.bg} ring-2 ring-white/60 shrink-0 shadow-md`} />
        )}
      </div>
    </div>
  );
};
