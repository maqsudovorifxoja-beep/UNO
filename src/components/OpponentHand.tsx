import React from 'react';
import type { Player } from '../types/game';
import { UnoCard } from './UnoCard';
import { Bot, User, Flame, Clock } from 'lucide-react';

interface OpponentHandProps {
  player: Player;
  isCurrentTurn: boolean;
  position?: 'top' | 'left' | 'right';
  lang?: 'uz' | 'en';
  reaction?: string | null;
}

export const OpponentHand: React.FC<OpponentHandProps> = ({
  player,
  isCurrentTurn,
  lang = 'uz',
  reaction,
}) => {
  const cardCount = player.hand.length;

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        isCurrentTurn ? 'scale-105 z-20' : 'opacity-85 z-10'
      }`}
    >
      {/* Speech / Reaction Bubble */}
      {reaction && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-xl shadow-xl border border-slate-300 z-30 animate-bounce">
          {reaction}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-300" />
        </div>
      )}

      {/* Active turn halo */}
      {isCurrentTurn && (
        <div className="absolute -inset-2 rounded-2xl bg-yellow-400/20 blur-md animate-pulse pointer-events-none" />
      )}

      {/* Player info capsule */}
      <div
        className={`relative flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border shadow-lg backdrop-blur-md transition-all ${
          isCurrentTurn
            ? 'bg-slate-900/90 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/50'
            : 'bg-slate-900/80 border-slate-700 text-slate-300'
        }`}
      >
        {/* Avatar icon */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border shadow-inner ${
            player.isBot
              ? 'bg-cyan-950 text-cyan-300 border-cyan-600/60'
              : 'bg-indigo-950 text-indigo-300 border-indigo-600/60'
          }`}
        >
          {player.isBot ? <Bot size={16} /> : <User size={16} />}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-bold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[110px] text-white">
              {player.name}
            </span>
            {isCurrentTurn && (
              <span className="flex items-center text-[10px] text-yellow-400 animate-pulse font-mono font-medium">
                <Clock size={11} className="mr-0.5" />
                {lang === 'uz' ? 'Navbat' : 'Turn'}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {cardCount} {lang === 'uz' ? 'karta' : 'cards'}
          </span>
        </div>

        {/* UNO Badge when they have 1 card */}
        {cardCount === 1 && (
          <div className="ml-1 px-1.5 py-0.5 rounded-md bg-red-600 text-yellow-300 font-black italic text-[10px] flex items-center gap-0.5 animate-bounce shadow">
            <Flame size={12} />
            <span>UNO</span>
          </div>
        )}
      </div>

      {/* Mini Face-down card stack representation */}
      <div className="mt-1 flex items-center justify-center relative h-10 sm:h-12 w-24 sm:w-28">
        {Array.from({ length: Math.min(cardCount, 5) }).map((_, idx) => {
          const offset = (idx - Math.min(cardCount, 5) / 2) * 8;
          return (
            <div
              key={idx}
              style={{
                transform: `translateX(${offset}px) rotate(${offset * 1.5}deg)`,
              }}
              className="absolute transition-transform"
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
