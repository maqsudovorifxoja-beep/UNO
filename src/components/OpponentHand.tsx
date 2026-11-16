import React from 'react';
import type { Player } from '../types/game';
import { UnoCard } from './UnoCard';
import { AvatarIcon } from './AvatarIcon';
import { Flame, Clock } from 'lucide-react';

interface OpponentHandProps {
  player: Player;
  isCurrentTurn: boolean;
  position?: 'top' | 'left' | 'right';
  lang?: 'uz' | 'en';
  reaction?: string | null;
  turnTimeLeft?: number;
}

export const OpponentHand: React.FC<OpponentHandProps> = ({
  player,
  isCurrentTurn,
  position: _position = 'top',
  lang = 'uz',
  reaction,
  turnTimeLeft = 30,
}) => {
  const cardCount = player.hand.length;

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        isCurrentTurn ? 'scale-105 z-20' : 'opacity-90 z-10'
      }`}
    >
      {/* Speech / Reaction Bubble */}
      {reaction && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 font-black text-xs px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-slate-300 z-30 animate-bounce">
          {reaction}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-slate-300" />
        </div>
      )}

      {/* Turn Spotlight Aura */}
      {isCurrentTurn && (
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-yellow-400/30 to-amber-500/30 blur-xl animate-pulse pointer-events-none" />
      )}

      {/* Player Badge Capsule */}
      <div
        className={`relative flex items-center gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 shadow-xl backdrop-blur-md transition-all ${
          isCurrentTurn
            ? 'bg-slate-900/95 border-yellow-400 ring-2 ring-yellow-400/50 shadow-yellow-500/20'
            : 'bg-slate-900/85 border-slate-700/80'
        }`}
      >
        {/* Avatar with Turn Countdown border */}
        <div className="relative">
          <AvatarIcon avatarId={player.avatar || (player.isBot ? 'bot' : 'ninja')} size={18} />

          {/* Turn timer badge when it's their turn */}
          {isCurrentTurn && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center font-mono font-black text-[9px] shadow">
              {turnTimeLeft}
            </div>
          )}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-black text-xs sm:text-sm truncate max-w-[85px] sm:max-w-[120px] text-white">
              {player.name}
            </span>
            {isCurrentTurn && (
              <span className="flex items-center text-[10px] text-yellow-400 animate-pulse font-mono font-bold">
                <Clock size={10} className="mr-0.5" />
                {lang === 'uz' ? 'Yurmoqda' : 'Playing'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-300 font-mono font-bold">
            {cardCount} {lang === 'uz' ? 'ta karta' : 'cards'}
          </span>
        </div>

        {/* Pulsing UNO Badge if player holds exactly 1 card */}
        {cardCount === 1 && (
          <div className="ml-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-yellow-300 font-black italic text-[11px] flex items-center gap-1 animate-bounce shadow-lg border border-yellow-300">
            <Flame size={13} fill="currentColor" />
            <span>UNO!</span>
          </div>
        )}
      </div>

      {/* Mini Fanned Face-down Cards */}
      <div className="mt-1 flex items-center justify-center relative h-10 sm:h-12 w-24 sm:w-28">
        {Array.from({ length: Math.min(cardCount, 5) }).map((_, idx) => {
          const maxDisplay = Math.min(cardCount, 5);
          const offset = (idx - maxDisplay / 2 + 0.5) * 8;
          return (
            <div
              key={idx}
              style={{
                transform: `translateX(${offset}px) rotate(${offset * 1.8}deg)`,
              }}
              className="absolute transition-transform pointer-events-none"
            >
              <UnoCard
                card={{ id: `back-${idx}`, color: 'red', value: '0', scoreValue: 0 }}
                faceDown={true}
                size="mini"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
