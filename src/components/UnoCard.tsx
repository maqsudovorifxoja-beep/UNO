import React from 'react';
import type { Card, CardColor } from '../types/game';
import { Ban, RefreshCw, Sparkles } from 'lucide-react';

interface UnoCardProps {
  card: Card;
  faceDown?: boolean;
  isPlayable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  onClick?: () => void;
  className?: string;
  rotation?: number; // For discard pile natural scattered rotation
  highlight?: boolean;
}

const COLOR_CLASSES: Record<CardColor, { bg: string; text: string; ring: string; border: string }> = {
  red: {
    bg: 'from-rose-500 via-red-600 to-red-700',
    text: 'text-red-600',
    ring: 'ring-red-400 shadow-red-500/50',
    border: 'border-red-400',
  },
  blue: {
    bg: 'from-sky-400 via-blue-600 to-blue-700',
    text: 'text-blue-600',
    ring: 'ring-blue-400 shadow-blue-500/50',
    border: 'border-blue-400',
  },
  green: {
    bg: 'from-emerald-400 via-green-600 to-green-700',
    text: 'text-green-600',
    ring: 'ring-green-400 shadow-green-500/50',
    border: 'border-green-400',
  },
  yellow: {
    bg: 'from-amber-300 via-yellow-400 to-amber-500',
    text: 'text-amber-500',
    ring: 'ring-yellow-300 shadow-yellow-400/50',
    border: 'border-yellow-300',
  },
  wild: {
    bg: 'from-slate-900 via-zinc-900 to-black',
    text: 'text-white',
    ring: 'ring-purple-400 shadow-purple-500/50',
    border: 'border-slate-700',
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
  // Dimensions based on size
  const sizeClasses = {
    mini: 'w-8 h-12 rounded-sm text-[10px]',
    sm: 'w-12 h-18 sm:w-14 sm:h-20 rounded-md text-xs',
    md: 'w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 rounded-xl text-sm',
    lg: 'w-20 h-30 sm:w-24 sm:h-36 md:w-28 md:h-42 rounded-xl text-base',
  }[size];

  const colorConfig = COLOR_CLASSES[card.color];

  // Render Card Back
  if (faceDown) {
    return (
      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className={`relative ${sizeClasses} select-none transition-all duration-300 shrink-0
          bg-gradient-to-br from-zinc-900 via-neutral-900 to-black p-1.5 border border-neutral-700/80
          shadow-lg shadow-black/60 flex items-center justify-center overflow-hidden cursor-default ${className}`}
      >
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Outer border bevel */}
        <div className="absolute inset-1 rounded-lg border border-neutral-600/50" />

        {/* Center glowing badge */}
        <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-red-600 via-rose-700 to-red-800 flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative transform -rotate-25 scale-90 flex flex-col items-center justify-center">
            <span className="font-black italic text-yellow-300 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-base sm:text-xl font-mono">
              UNO
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Center Action Icon or Number
  const renderCardContent = (isCenter = false) => {
    const iconSize = isCenter
      ? size === 'lg'
        ? 32
        : size === 'md'
        ? 24
        : 16
      : size === 'lg'
      ? 16
      : 12;

    switch (card.value) {
      case 'skip':
        return <Ban size={iconSize} strokeWidth={2.8} className={isCenter ? colorConfig.text : 'text-white'} />;
      case 'reverse':
        return <RefreshCw size={iconSize} strokeWidth={2.8} className={isCenter ? colorConfig.text : 'text-white'} />;
      case 'draw2':
        return (
          <div className="flex items-center justify-center font-black tracking-tight leading-none">
            <span className={isCenter ? `${colorConfig.text} text-xl sm:text-3xl font-black` : 'text-white font-bold'}>
              +2
            </span>
          </div>
        );
      case 'wild':
        if (isCenter) {
          return (
            <div className="relative w-9 h-9 sm:w-14 sm:h-14 rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 p-0.5 shadow-md">
              <div className="bg-red-500" />
              <div className="bg-blue-500" />
              <div className="bg-yellow-400" />
              <div className="bg-green-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={iconSize} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] animate-pulse" />
              </div>
            </div>
          );
        }
        return <Sparkles size={iconSize} className="text-white" />;
      case 'wild4':
        if (isCenter) {
          return (
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 p-0.5 shadow-md opacity-90">
                <div className="bg-red-500" />
                <div className="bg-blue-500" />
                <div className="bg-yellow-400" />
                <div className="bg-green-500" />
              </div>
              <span className="absolute font-black text-white text-lg sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tighter">
                +4
              </span>
            </div>
          );
        }
        return <span className="text-white font-black">+4</span>;
      default:
        // Number cards 0-9
        return (
          <span
            className={`font-black italic tracking-tighter font-mono select-none leading-none ${
              isCenter
                ? `${colorConfig.text} text-2xl sm:text-4xl md:text-5xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`
                : 'text-white text-xs sm:text-sm'
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
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative ${sizeClasses} select-none transition-all duration-200 shrink-0
        bg-gradient-to-br ${colorConfig.bg} p-1 sm:p-1.5 border ${colorConfig.border}
        shadow-md shadow-black/40 flex flex-col justify-between overflow-hidden
        ${isPlayable ? 'cursor-pointer hover:-translate-y-3 sm:hover:-translate-y-4 hover:shadow-xl hover:shadow-cyan-500/30 ring-2 ' + colorConfig.ring : 'cursor-default'}
        ${!isPlayable && onClick ? 'opacity-85 hover:opacity-90' : ''}
        ${highlight ? 'ring-4 ring-yellow-400 animate-bounce' : ''}
        ${className}`}
    >
      {/* Top Left Mini Index */}
      <div className="flex items-center justify-start leading-none font-bold select-none z-10">
        {renderCardContent(false)}
      </div>

      {/* Center White Ellipse Oval Badge */}
      <div className="relative self-center w-[84%] h-[70%] bg-white rounded-[50%] transform -rotate-25 flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_3px_8px_rgba(0,0,0,0.25)] border border-white/60">
        {/* Subtle glossy card sheen */}
        <div className="absolute inset-0 rounded-[50%] bg-gradient-to-t from-transparent via-white/40 to-white/70 opacity-70 pointer-events-none" />

        {/* Render Center Content */}
        <div className="transform rotate-25 flex items-center justify-center z-10">
          {renderCardContent(true)}
        </div>
      </div>

      {/* Bottom Right Inverted Mini Index */}
      <div className="flex items-center justify-end leading-none font-bold select-none z-10 transform rotate-180">
        {renderCardContent(false)}
      </div>

      {/* Playable border glow shimmer */}
      {isPlayable && (
        <div className="absolute inset-0 rounded-xl bg-white/10 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};
