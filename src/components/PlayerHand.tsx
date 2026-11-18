import React, { useRef } from 'react';
import type { Card, CardColor, HouseRules } from '../types/game';
import { UnoCard } from './UnoCard';
import { canPlayCard, isExactMatch } from '../utils/unoEngine';
import { ArrowDownUp, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

interface PlayerHandProps {
  cards: Card[];
  topCard: Card | null;
  currentColor: CardColor;
  activeDrawStack: number;
  isMyTurn: boolean;
  houseRules: HouseRules;
  onPlayCard: (card: Card) => void;
  onJumpIn?: (card: Card) => void;
  onSortByColor: () => void;
  onSortByValue: () => void;
  reaction?: string | null;
  lang?: 'uz' | 'en';
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  topCard,
  currentColor,
  activeDrawStack,
  isMyTurn,
  houseRules,
  onPlayCard,
  onJumpIn,
  onSortByColor,
  onSortByValue,
  reaction,
  lang = 'uz',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sound.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    sound.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const playableCount = cards.filter((card) =>
    isMyTurn && canPlayCard(card, topCard, currentColor, activeDrawStack, houseRules)
  ).length;

  const jumpInCard = !isMyTurn && houseRules.jumpIn && topCard
    ? cards.find((c) => isExactMatch(c, topCard))
    : null;

  // Dynamic overlap calculation so cards fan out elegantly without clipping
  const total = cards.length;
  const getOverlapMargin = (idx: number): string => {
    if (idx === 0) return '0px';
    if (total > 14) return '-34px';
    if (total > 10) return '-28px';
    if (total > 7) return '-22px';
    if (total > 4) return '-14px';
    return '-6px';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none px-2 z-30 pb-1">
      {/* Human reaction speech bubble */}
      {reaction && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-2xl border-2 border-slate-300 z-50 animate-bounce">
          {reaction}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-slate-300" />
        </div>
      )}

      {/* Hand Status & Sort Action Bar */}
      <div className="w-full flex items-center justify-between mb-1 px-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Card counter badge */}
          <span className="font-mono font-black text-white bg-slate-900/90 border border-slate-700 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs shadow">
            {cards.length} {lang === 'uz' ? 'ta karta' : 'cards'}
          </span>

          {/* Turn Guidance message */}
          {isMyTurn && (
            <span
              className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 shadow-md transition-all ${
                playableCount > 0
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/80 animate-pulse'
                  : 'bg-amber-950 text-amber-300 border border-yellow-500/80'
              }`}
            >
              <Sparkles size={12} />
              {playableCount > 0
                ? lang === 'uz'
                  ? `${playableCount} ta karta yurish mumkin`
                  : `${playableCount} playable`
                : lang === 'uz'
                ? "Mos karta yo'q — Kolodadan oling"
                : 'No match — Draw card'}
            </span>
          )}

          {/* Jump In alert button */}
          {jumpInCard && onJumpIn && (
            <button
              onClick={() => {
                sound.playWild();
                onJumpIn(jumpInCard);
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs shadow-lg animate-bounce cursor-pointer active:scale-95"
            >
              <Zap size={12} fill="currentColor" />
              <span>JUMP IN!</span>
            </button>
          )}
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick();
              onSortByColor();
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold border border-slate-700 transition active:scale-95 cursor-pointer shadow"
            title={lang === 'uz' ? "Rang bo'yicha saralash" : 'Sort by Color'}
          >
            <ArrowDownUp size={11} className="text-yellow-400" />
            <span>{lang === 'uz' ? 'Rang' : 'Color'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSortByValue();
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold border border-slate-700 transition active:scale-95 cursor-pointer shadow"
            title={lang === 'uz' ? "Raqam bo'yicha saralash" : 'Sort by Value'}
          >
            <ArrowDownUp size={11} className="text-cyan-400" />
            <span>{lang === 'uz' ? 'Raqam' : 'Value'}</span>
          </button>
        </div>
      </div>

      {/* Hand Cards Fanned Row */}
      <div className="relative w-full flex items-center justify-center">
        {/* Scroll Left Button if hand is large */}
        {cards.length > 8 && (
          <button
            onClick={scrollLeft}
            aria-label="Chapga surish"
            className="hidden sm:flex absolute -left-2 z-40 w-8 h-8 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 hover:text-white items-center justify-center shadow-xl cursor-pointer hover:bg-slate-800 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto pt-4 pb-2 px-2 flex items-center justify-start sm:justify-center no-scrollbar min-h-[125px] sm:min-h-[155px]"
        >
          {cards.map((card, idx) => {
            const playable = isMyTurn && canPlayCard(card, topCard, currentColor, activeDrawStack, houseRules);
            const isJumpIn = Boolean(!isMyTurn && houseRules.jumpIn && topCard && isExactMatch(card, topCard));

            // Dynamic Fanning angle
            const mid = (total - 1) / 2;
            const offset = total > 1 ? (idx - mid) / mid : 0;
            const fanAngle = total <= 9 ? offset * 7 : offset * 4;
            const fanY = total <= 9 ? Math.abs(offset) * 5 : 0;

            return (
              <div
                key={card.id || idx}
                style={{
                  marginLeft: getOverlapMargin(idx),
                  transform: `rotate(${fanAngle}deg) translateY(${fanY}px)`,
                  zIndex: idx + 10,
                }}
                className="card-fan-item shrink-0 transition-transform duration-200"
              >
                <UnoCard
                  card={card}
                  isPlayable={playable || isJumpIn}
                  highlight={isJumpIn}
                  size="lg"
                  onClick={() => {
                    if (isJumpIn && onJumpIn) {
                      onJumpIn(card);
                    } else {
                      onPlayCard(card);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button if hand is large */}
        {cards.length > 8 && (
          <button
            onClick={scrollRight}
            aria-label="O'ngga surish"
            className="hidden sm:flex absolute -right-2 z-40 w-8 h-8 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 hover:text-white items-center justify-center shadow-xl cursor-pointer hover:bg-slate-800 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
