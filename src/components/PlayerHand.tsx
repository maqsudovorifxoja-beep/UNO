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
      scrollContainerRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    sound.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const playableCount = cards.filter((card) =>
    isMyTurn && canPlayCard(card, topCard, currentColor, activeDrawStack, houseRules)
  ).length;

  // Jump-In exact matches when it's NOT our turn
  const jumpInCard = !isMyTurn && houseRules.jumpIn && topCard
    ? cards.find((c) => isExactMatch(c, topCard))
    : null;

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Human reaction bubble */}
      {reaction && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-xl shadow-xl border border-slate-300 z-30 animate-bounce">
          {reaction}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-300" />
        </div>
      )}

      {/* Hand Toolbar / Organization Buttons */}
      <div className="w-full flex items-center justify-between mb-1.5 px-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <span className="font-bold text-white bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-mono shadow">
            {cards.length} {lang === 'uz' ? 'karta' : 'cards'}
          </span>
          {isMyTurn && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow ${
                playableCount > 0
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
              }`}
            >
              <Sparkles size={13} />
              {playableCount > 0
                ? lang === 'uz'
                  ? `${playableCount} ta yurish mumkin`
                  : `${playableCount} playable`
                : lang === 'uz'
                ? 'Karta oling (Kolodadan)'
                : 'Draw a card'}
            </span>
          )}

          {/* Jump In Alert button */}
          {jumpInCard && onJumpIn && (
            <button
              onClick={() => {
                sound.playWild();
                onJumpIn(jumpInCard);
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg animate-bounce cursor-pointer active:scale-95"
            >
              <Zap size={14} fill="currentColor" />
              <span>{lang === 'uz' ? 'JUMP IN! (Navbatsiz tashlash)' : 'JUMP IN!'}</span>
            </button>
          )}
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick();
              onSortByColor();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs transition active:scale-95 cursor-pointer shadow"
            title={lang === 'uz' ? "Rang bo'yicha saralash" : 'Sort by Color'}
          >
            <ArrowDownUp size={12} />
            <span>{lang === 'uz' ? 'Rang' : 'Color'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSortByValue();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs transition active:scale-95 cursor-pointer shadow"
            title={lang === 'uz' ? "Raqam bo'yicha saralash" : 'Sort by Value'}
          >
            <ArrowDownUp size={12} />
            <span>{lang === 'uz' ? 'Raqam' : 'Value'}</span>
          </button>
        </div>
      </div>

      {/* Hand Cards Container with Mobile Touch Horizontal Scroll */}
      <div className="relative w-full flex items-center justify-center">
        {/* Scroll Left Button for desktop/large hands */}
        {cards.length > 7 && (
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -left-3 z-30 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white items-center justify-center shadow-lg cursor-pointer hover:bg-slate-800"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="cards-scroll-container w-full overflow-x-auto overflow-y-visible py-4 sm:py-6 px-4 flex items-center justify-start sm:justify-center gap-1 sm:gap-2 no-scrollbar"
        >
          {cards.map((card, idx) => {
            const playable = isMyTurn && canPlayCard(card, topCard, currentColor, activeDrawStack, houseRules);
            const isJumpIn = Boolean(!isMyTurn && houseRules.jumpIn && topCard && isExactMatch(card, topCard));

            return (
              <div
                key={card.id || idx}
                className="transition-transform duration-200"
                style={{
                  // Overlap cards slightly on smaller screens or when holding many cards
                  marginLeft: idx === 0 ? 0 : cards.length > 9 ? '-18px' : cards.length > 6 ? '-10px' : '0px',
                }}
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

        {/* Scroll Right Button */}
        {cards.length > 7 && (
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -right-3 z-30 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white items-center justify-center shadow-lg cursor-pointer hover:bg-slate-800"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
