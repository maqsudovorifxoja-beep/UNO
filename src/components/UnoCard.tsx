import React from 'react';
import type { Card, CardColor } from '../types/game';
import { Ban, RefreshCw, Sparkles } from 'lucide-react';

interface UnoCardProps {
  card: Card;
  faceDown?: boolean;
  isPlayable?: boolean;
  size?: 'mini' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  rotation?: number;
  highlight?: boolean;
}

const COLOR_CONFIG: Record<
  CardColor,
  {
    bgGradient: string;
    textColor: string;
    shadowGlow: string;
    borderAccent: string;
    centerColor: string;
  }
> = {
  red: {
    bgGradient: 'from-[#ff2d3d] via-[#e51323] to-[#a8000f]',
    textColor: 'text-[#e51323]',
    shadowGlow: 'shadow-red-500/40 ring-red-400',
    borderAccent: 'border-red-300/40',
    centerColor: '#e51323',
  },
  blue: {
    bgGradient: 'from-[#0094ff] via-[#005fec] to-[#00389b]',
    textColor: 'text-[#005fec]',
    shadowGlow: 'shadow-blue-500/40 ring-blue-400',
    borderAccent: 'border-blue-300/40',
    centerColor: '#005fec',
  },
  green: {
    bgGradient: 'from-[#1ddc62] via-[#0bbd4a] to-[#04772d]',
    textColor: 'text-[#0bbd4a]',
    shadowGlow: 'shadow-emerald-500/40 ring-emerald-400',
    borderAccent: 'border-emerald-300/40',
    centerColor: '#0bbd4a',
  },
  yellow: {
    bgGradient: 'from-[#ffea00] via-[#ffd000] to-[#d99800]',
    textColor: 'text-[#b87c00]',
    shadowGlow: 'shadow-amber-400/50 ring-yellow-300',
    borderAccent: 'border-yellow-200/50',
    centerColor: '#c78500',
  },
  wild: {
    bgGradient: 'from-[#202534] via-[#121620] to-[#07090e]',
    textColor: 'text-white',
    shadowGlow: 'shadow-purple-500/40 ring-purple-400',
    borderAccent: 'border-purple-300/30',
    centerColor: '#ffffff',
  },
};

export const UnoCard: React.FC<UnoCardProps> = ({
  card,
  faceDown = false,
  isPlayable = false,
  size = 'md',
  onClick,
  className = '',
  rotation = 0,
  highlight = false,
}) => {
  // Dimensions carefully calibrated to 1 : 1.45 ratio
  const sizeClasses = {
    mini: 'w-7 h-10 rounded-[6px] text-[9px] p-0.5',
    sm: 'w-11 h-16 sm:w-13 sm:h-19 rounded-xl text-xs p-1',
    md: 'w-20 h-29 sm:w-24 sm:h-35 md:w-26 md:h-38 rounded-2xl text-sm p-1.5',
    lg: 'w-20 h-29 sm:w-24 sm:h-35 md:w-28 md:h-41 rounded-2xl text-base p-1.5',
  }[size];

  const config = COLOR_CONFIG[card.color];

  // RENDER CARD BACK (Authentic UNO back with golden UNO text)
  if (faceDown) {
    return (
      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className={`relative ${sizeClasses} select-none transition-transform duration-200 shrink-0
          bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border-2 border-neutral-700/80
          shadow-xl shadow-black/80 flex items-center justify-center overflow-hidden cursor-default ${className}`}
      >
        {/* Fine cross-hatch card texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />

        {/* Outer decorative card border line */}
        <div className="absolute inset-1 rounded-xl border border-neutral-600/40 pointer-events-none" />

        {/* Iconic Red Ellipse with Yellow UNO Logo */}
        <div className="relative w-[86%] h-[82%] rounded-[50%] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_3px_10px_rgba(0,0,0,0.4)] transform -rotate-25 border-2 border-yellow-400/80 overflow-hidden">
          {/* Sheen reflection */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/50 opacity-60 pointer-events-none" />
          <span className="font-black italic text-yellow-300 font-mono tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-xs sm:text-base md:text-lg">
            UNO
          </span>
        </div>
      </div>
    );
  }

  // RENDER CARD VALUE / SYMBOL
  const renderSymbol = (isCenter = false) => {
    const iconSize = isCenter
      ? size === 'lg'
        ? 34
        : size === 'md'
        ? 28
        : 18
      : size === 'lg'
      ? 15
      : size === 'md'
      ? 13
      : 10;

    switch (card.value) {
      case 'skip':
        return (
          <Ban
            size={iconSize}
            strokeWidth={3}
            className={isCenter ? config.textColor : 'text-white drop-shadow'}
          />
        );
      case 'reverse':
        return (
          <RefreshCw
            size={iconSize}
            strokeWidth={3}
            className={isCenter ? config.textColor : 'text-white drop-shadow'}
          />
        );
      case 'draw2':
        return (
          <div className="flex items-center justify-center font-black tracking-tight leading-none">
            <span
              className={
                isCenter
                  ? `${config.textColor} text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`
                  : 'text-white font-black drop-shadow'
              }
            >
              +2
            </span>
          </div>
        );
      case 'wild':
        if (isCenter) {
          return (
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-lg border-2 border-white/80 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#ff2d3d]" />
              <div className="bg-[#0094ff]" />
              <div className="bg-[#ffea00]" />
              <div className="bg-[#1ddc62]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={iconSize} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse" />
              </div>
            </div>
          );
        }
        return <Sparkles size={iconSize} className="text-white drop-shadow" />;
      case 'wild4':
        if (isCenter) {
          return (
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full overflow-hidden shadow-lg border-2 border-white/80 grid grid-cols-2 grid-rows-2 opacity-95">
                <div className="bg-[#ff2d3d]" />
                <div className="bg-[#0094ff]" />
                <div className="bg-[#ffea00]" />
                <div className="bg-[#1ddc62]" />
              </div>
              <span className="absolute font-black text-white text-xl sm:text-3xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] tracking-tighter">
                +4
              </span>
            </div>
          );
        }
        return <span className="text-white font-black drop-shadow">+4</span>;
      default:
        // Number cards (0 - 9)
        return (
          <span
            className={`font-black italic tracking-tighter font-mono select-none leading-none ${
              isCenter
                ? `${config.textColor} text-3xl sm:text-4xl md:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]`
                : 'text-white text-xs sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
            }`}
          >
            {card.value}
          </span>
        );
    }
  };

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative ${sizeClasses} select-none transition-all duration-200 shrink-0
        bg-gradient-to-br ${config.bgGradient} border-2 border-white/85 shadow-lg shadow-black/50
        flex flex-col justify-between overflow-hidden
        ${
          isPlayable
            ? 'cursor-pointer hover:-translate-y-3 sm:hover:-translate-y-4 hover:shadow-2xl hover:shadow-amber-400/40 ring-2 ring-yellow-300 ring-offset-2 ring-offset-slate-900 active:scale-95'
            : onClick
            ? 'opacity-60 grayscale-[25%] cursor-not-allowed hover:opacity-70'
            : 'cursor-default'
        }
        ${highlight ? 'ring-4 ring-yellow-400 animate-bounce' : ''}
        ${className}`}
    >
      {/* Subtle glossy card surface lacquer reflection */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/30 via-white/5 to-transparent pointer-events-none rounded-2xl" />

      {/* Top Left Mini Index */}
      <div className="relative z-10 flex items-center justify-start leading-none font-black pl-0.5 pt-0.5">
        {renderSymbol(false)}
      </div>

      {/* Iconic Center Tilted White Oval Badge */}
      <div className="relative self-center w-[86%] h-[72%] bg-white rounded-[50%] transform -rotate-25 flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.25)] border border-white/70 overflow-hidden">
        {/* Soft radial glare within the badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-white to-white opacity-80 pointer-events-none" />

        {/* Center Symbol un-rotated back */}
        <div className="transform rotate-25 flex items-center justify-center z-10">
          {renderSymbol(true)}
        </div>
      </div>

      {/* Bottom Right Inverted Mini Index */}
      <div className="relative z-10 flex items-center justify-end leading-none font-black pr-0.5 pb-0.5 transform rotate-180">
        {renderSymbol(false)}
      </div>

      {/* Playable Pulse Ribbon Indicator */}
      {isPlayable && size === 'lg' && (
        <div className="absolute inset-x-0 bottom-0 bg-yellow-400/90 text-slate-950 font-black text-[9px] uppercase tracking-wider py-0.5 text-center shadow-md">
          Tashlash
        </div>
      )}
    </div>
  );
};
