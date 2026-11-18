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
  disabled?: boolean;
}

const COLOR_THEMES: Record<
  CardColor,
  {
    gradient: string;
    text: string;
    accent: string;
    ring: string;
  }
> = {
  red: {
    gradient: 'from-[#ff2238] via-[#e50b20] to-[#aa0010]',
    text: 'text-[#e50b20]',
    accent: '#ff2238',
    ring: 'ring-red-400 shadow-red-500/50',
  },
  blue: {
    gradient: 'from-[#0094ff] via-[#0062ff] to-[#0038b3]',
    text: 'text-[#0062ff]',
    accent: '#0094ff',
    ring: 'ring-blue-400 shadow-blue-500/50',
  },
  green: {
    gradient: 'from-[#1ee869] via-[#0cbd4e] to-[#046e2a]',
    text: 'text-[#0cbd4e]',
    accent: '#1ee869',
    ring: 'ring-emerald-400 shadow-emerald-500/50',
  },
  yellow: {
    gradient: 'from-[#ffea00] via-[#ffd200] to-[#c78800]',
    text: 'text-[#b37400]',
    accent: '#ffd200',
    ring: 'ring-yellow-300 shadow-amber-400/50',
  },
  wild: {
    gradient: 'from-[#232938] via-[#141923] to-[#080a0f]',
    text: 'text-white',
    accent: '#ffffff',
    ring: 'ring-purple-400 shadow-purple-500/50',
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
  disabled = false,
}) => {
  // Proportional card dimensions with exact 1:1.44 playing card ratio
  const sizeClasses = {
    mini: 'w-7 h-10 rounded-[6px] p-0.5 text-[9px]',
    sm: 'w-11 h-16 sm:w-12 sm:h-17 rounded-xl p-1 text-xs',
    md: 'w-18 h-26 sm:w-22 sm:h-32 md:w-24 md:h-34 rounded-2xl p-1 sm:p-1.5 text-sm',
    lg: 'w-16 h-23 sm:w-20 sm:h-29 md:w-24 md:h-34 rounded-2xl p-1 sm:p-1.5 text-base',
  }[size];

  const theme = COLOR_THEMES[card.color];

  // RENDER CARD BACK (CLASSIC BLACK WITH RED OVAL & UNO LOGO)
  if (faceDown) {
    return (
      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className={`relative ${sizeClasses} select-none transition-all duration-200 shrink-0
          bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border-[2px] sm:border-[2.5px] border-neutral-700
          shadow-xl shadow-black/80 flex items-center justify-center overflow-hidden cursor-default ${className}`}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

        {/* Outer border inset */}
        <div className="absolute inset-1 rounded-xl border border-neutral-600/40 pointer-events-none" />

        {/* Iconic Red Ellipse with Golden UNO text */}
        <div className="relative w-[86%] h-[80%] rounded-[50%] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_3px_10px_rgba(0,0,0,0.4)] transform -rotate-25 border-2 border-yellow-400 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/50 opacity-60 pointer-events-none" />
          <span className="font-black italic text-yellow-300 font-mono tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] text-[10px] sm:text-xs md:text-sm">
            UNO
          </span>
        </div>
      </div>
    );
  }

  // RENDER CENTER / CORNER SYMBOLS
  const renderSymbol = (isCenter = false) => {
    const iconSize = isCenter
      ? size === 'lg' || size === 'md'
        ? 26
        : 18
      : size === 'lg' || size === 'md'
      ? 13
      : 9;

    switch (card.value) {
      case 'skip':
        return (
          <Ban
            size={iconSize}
            strokeWidth={3}
            className={isCenter ? theme.text : 'text-white drop-shadow'}
          />
        );
      case 'reverse':
        return (
          <RefreshCw
            size={iconSize}
            strokeWidth={3}
            className={isCenter ? theme.text : 'text-white drop-shadow'}
          />
        );
      case 'draw2':
        return (
          <span
            className={
              isCenter
                ? `${theme.text} text-xl sm:text-2xl md:text-3xl font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]`
                : 'text-white font-black text-[10px] sm:text-xs drop-shadow'
            }
          >
            +2
          </span>
        );
      case 'wild':
        if (isCenter) {
          return (
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md border-2 border-white/90 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#ff2438]" />
              <div className="bg-[#009dff]" />
              <div className="bg-[#ffd200]" />
              <div className="bg-[#1ee869]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles size={iconSize} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
          );
        }
        return <Sparkles size={iconSize} className="text-white drop-shadow" />;
      case 'wild4':
        if (isCenter) {
          return (
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-md border-2 border-white/90 grid grid-cols-2 grid-rows-2 opacity-95">
                <div className="bg-[#ff2438]" />
                <div className="bg-[#009dff]" />
                <div className="bg-[#ffd200]" />
                <div className="bg-[#1ee869]" />
              </div>
              <span className="absolute font-black text-white text-base sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tighter">
                +4
              </span>
            </div>
          );
        }
        return <span className="text-white font-black text-[10px] sm:text-xs drop-shadow">+4</span>;
      default:
        // Number cards (0 - 9)
        return (
          <span
            className={`font-black italic tracking-tighter font-mono select-none leading-none ${
              isCenter
                ? `${theme.text} text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]`
                : 'text-white text-[11px] sm:text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
            }`}
          >
            {card.value}
          </span>
        );
    }
  };

  return (
    <div
      onClick={!disabled && isPlayable ? onClick : undefined}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative ${sizeClasses} select-none transition-all duration-200 shrink-0
        bg-gradient-to-br ${theme.gradient} border-[2px] sm:border-[2.5px] border-white/95 shadow-lg shadow-black/50
        flex flex-col justify-between overflow-hidden
        ${
          isPlayable && !disabled
            ? 'cursor-pointer ring-2 sm:ring-3 ring-yellow-400 shadow-xl shadow-yellow-400/50 -translate-y-2.5 sm:-translate-y-3.5 hover:-translate-y-4 active:scale-95 z-20'
            : onClick && !disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-default'
        }
        ${highlight ? 'ring-4 ring-yellow-400 animate-bounce' : ''}
        ${className}`}
    >
      {/* Specular sheen reflection */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/30 via-white/5 to-transparent pointer-events-none rounded-xl" />

      {/* Top Left Mini Index */}
      <div className="relative z-10 flex items-center justify-start leading-none font-black pl-0.5 pt-0.5">
        {renderSymbol(false)}
      </div>

      {/* Center White Ellipse Oval Badge */}
      <div className="relative self-center w-[86%] h-[74%] bg-white rounded-[50%] transform -rotate-25 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.2)] border border-white/80 overflow-hidden">
        {/* Soft radial glare */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-white to-white opacity-90 pointer-events-none" />

        {/* Center Symbol un-rotated back */}
        <div className="transform rotate-25 flex items-center justify-center z-10">
          {renderSymbol(true)}
        </div>
      </div>

      {/* Bottom Right Inverted Mini Index */}
      <div className="relative z-10 flex items-center justify-end leading-none font-black pr-0.5 pb-0.5 transform rotate-180">
        {renderSymbol(false)}
      </div>
    </div>
  );
};
