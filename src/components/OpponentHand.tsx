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
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 font-black text-xs px-3 py-1 rounded-2xl shadow-2xl border border-slate-300 z-30 animate-bounce">
          {reaction}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-slate-300" />
        </div>
      )}

      {/* Player Capsule */}
      <div
        className={`relative flex items-center gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
          isCurrentTurn
            ? 'bg-slate-900/95 border-yellow-400 ring-2 ring-yellow-400/50 shadow-yellow-500/20'
            : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        {/* Avatar with Turn Countdown badge */}
        <div className="relative">
          <AvatarIcon avatarId={player.avatar || (player.isBot ? 'bot' : 'ninja')} size={15} />

          {/* Turn timer badge */}
          {isCurrentTurn && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 rounded-full w-3.5 h-3.5 flex items-center justify-center font-mono font-black text-[8px] shadow">
              {turnTimeLeft}
            </div>
          )}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 leading-tight">
            <span className="font-black text-xs truncate max-w-[70px] sm:max-w-[100px] text-white">
              {player.name}
            </span>
            {isCurrentTurn && (
              <span className="flex items-center text-[9px] text-yellow-400 font-mono font-bold">
                <Clock size={9} className="mr-0.5" />
                {lang === 'uz' ? 'Navbat' : 'Turn'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold">
            {cardCount} {lang === 'uz' ? 'ta karta' : 'cards'}
          </span>
        </div>

        {/* Pulsing UNO Badge if player holds exactly 1 card */}
        {cardCount === 1 && (
          <div className="ml-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-yellow-300 font-black italic text-[10px] flex items-center gap-0.5 animate-bounce shadow border border-yellow-300">
            <Flame size={11} fill="currentColor" />
            <span>UNO!</span>
          </div>
        )}
      </div>

      {/* Mini Fanned Cards Preview */}
      <div className="mt-0.5 flex items-center justify-center relative h-6 sm:h-8 w-16 sm:w-20 pointer-events-none">
        {Array.from({ length: Math.min(cardCount, 4) }).map((_, idx) => {
          const count = Math.min(cardCount, 4);
          const offset = (idx - count / 2 + 0.5) * 6;
          return (
            <div
              key={idx}
              style={{
                transform: `translateX(${offset}px) rotate(${offset * 1.5}deg)`,
              }}
              className="absolute"
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
