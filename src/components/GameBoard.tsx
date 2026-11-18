import React from 'react';
import type { Card, CardColor, TableTheme } from '../types/game';
import { UnoCard } from './UnoCard';
import { sound } from '../utils/sound';
import { RotateCw, RotateCcw, AlertTriangle, Layers, Hand } from 'lucide-react';

interface GameBoardProps {
  topCard: Card | null;
  previousCards: Card[];
  drawPileCount: number;
  currentColor: CardColor;
  activeDrawStack: number;
  direction: 1 | -1;
  theme: TableTheme;
  isMyTurn: boolean;
  hasPlayableCard: boolean;
  onDrawCard: () => void;
  lang?: 'uz' | 'en';
}

const THEME_STYLES: Record<
  TableTheme,
  {
    felt: string;
    border: string;
    glow: string;
    rail: string;
    accent: string;
  }
> = {
  'classic-casino': {
    felt: 'from-[#0b4d35] via-[#053322] to-[#021c12]',
    border: 'border-[#1b8057]',
    glow: 'rgba(16, 185, 129, 0.25)',
    rail: 'border-[#031e13] bg-[#02160e]',
    accent: 'text-emerald-400',
  },
  'neon-arcade': {
    felt: 'from-[#22133f] via-[#120926] to-[#080312]',
    border: 'border-[#9333ea]',
    glow: 'rgba(147, 51, 234, 0.3)',
    rail: 'border-[#120626] bg-[#090214]',
    accent: 'text-purple-400',
  },
  'midnight-luxury': {
    felt: 'from-[#19202c] via-[#0e131b] to-[#05070a]',
    border: 'border-[#d4af37]',
    glow: 'rgba(212, 175, 55, 0.25)',
    rail: 'border-[#261f07] bg-[#120e03]',
    accent: 'text-amber-400',
  },
  'crimson-velvet': {
    felt: 'from-[#540d19] via-[#33050d] to-[#1c0206]',
    border: 'border-[#f43f5e]',
    glow: 'rgba(244, 63, 94, 0.3)',
    rail: 'border-[#2b0309] bg-[#170104]',
    accent: 'text-rose-400',
  },
};

const COLOR_CONFIG: Record<CardColor, { bg: string; textUz: string; textEn: string; ringColor: string; shadow: string }> = {
  red: { bg: 'bg-[#ff2438]', textUz: 'Qizil', textEn: 'Red', ringColor: 'ring-red-500', shadow: 'shadow-red-500/60' },
  blue: { bg: 'bg-[#009dff]', textUz: "Ko'k", textEn: 'Blue', ringColor: 'ring-blue-500', shadow: 'shadow-blue-500/60' },
  green: { bg: 'bg-[#1ee869]', textUz: 'Yashil', textEn: 'Green', ringColor: 'ring-emerald-500', shadow: 'shadow-emerald-500/60' },
  yellow: { bg: 'bg-[#ffd200]', textUz: 'Sariq', textEn: 'Yellow', ringColor: 'ring-yellow-400', shadow: 'shadow-yellow-400/60' },
  wild: { bg: 'bg-purple-500', textUz: 'Tanlang', textEn: 'Choose', ringColor: 'ring-purple-400', shadow: 'shadow-purple-500/60' },
};

export const GameBoard: React.FC<GameBoardProps> = ({
  topCard,
  previousCards,
  drawPileCount,
  currentColor,
  activeDrawStack,
  direction,
  theme,
  isMyTurn,
  hasPlayableCard,
  onDrawCard,
  lang = 'uz',
}) => {
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES['classic-casino'];
  const colorInfo = COLOR_CONFIG[currentColor] || COLOR_CONFIG.red;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-2 py-1 select-none">
      {/* 3D Casino Table Felt Surface */}
      <div
        style={{
          boxShadow: `0 0 70px ${currentTheme.glow}, inset 0 0 50px rgba(0,0,0,0.85)`,
        }}
        className={`relative w-full h-[190px] sm:h-[230px] md:h-[260px] rounded-[32px] sm:rounded-[44px] bg-gradient-to-b ${currentTheme.felt} border-2 ${currentTheme.border} p-3 sm:p-5 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-2xl`}
      >
        {/* Felt Texture subtle background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Orbiting Turn Direction Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border border-dashed border-white/20 flex items-center justify-center transition-all duration-700 ${
              direction === 1 ? 'rotate-cw' : 'rotate-ccw'
            }`}
          >
            <div className="w-full flex justify-between px-2 text-white/25">
              {direction === 1 ? <RotateCw size={18} /> : <RotateCcw size={18} />}
              {direction === 1 ? <RotateCw size={18} /> : <RotateCcw size={18} />}
            </div>
          </div>
        </div>

        {/* Top Indicators Bar (Inside Table) */}
        <div className="absolute top-2.5 sm:top-3 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Active Color Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/90 border border-slate-700 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg pointer-events-auto">
            <span className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider">
              {lang === 'uz' ? 'Rang:' : 'Color:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded-full shadow-md ring-2 ring-white animate-pulse ${colorInfo.bg}`}
              />
              <span className="text-[11px] sm:text-xs font-black capitalize text-white">
                {lang === 'uz' ? colorInfo.textUz : colorInfo.textEn}
              </span>
            </div>
          </div>

          {/* Direction Pill */}
          <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-700 px-2.5 py-1 rounded-full text-slate-300 text-[10px] sm:text-xs shadow-lg pointer-events-auto">
            {direction === 1 ? (
              <RotateCw size={12} className="text-cyan-400" />
            ) : (
              <RotateCcw size={12} className="text-cyan-400" />
            )}
            <span className="font-mono font-bold hidden sm:inline">
              {direction === 1
                ? lang === 'uz' ? "Soat bo'yicha" : 'Clockwise'
                : lang === 'uz' ? "Teskari" : 'Counter-CW'}
            </span>
          </div>
        </div>

        {/* Central Playing Arena: Draw Pile + Discard Pile */}
        <div className="relative z-10 flex items-center justify-center gap-8 sm:gap-14 md:gap-18 mt-3 sm:mt-4">
          {/* 1. DRAW PILE (DECK) */}
          <div className="relative flex flex-col items-center">
            {/* 3D stacked deck shadow cards */}
            <div className="absolute top-1.5 left-1 w-18 h-26 sm:w-22 sm:h-32 bg-black/80 rounded-2xl border border-zinc-800 -rotate-3 pointer-events-none" />
            <div className="absolute top-0.5 left-0.5 w-18 h-26 sm:w-22 sm:h-32 bg-zinc-950 rounded-2xl border border-zinc-700 -rotate-1 pointer-events-none" />

            <div
              onClick={() => {
                if (isMyTurn) {
                  sound.playCardSlide();
                  onDrawCard();
                }
              }}
              className={`relative transition-all duration-200 select-none ${
                isMyTurn
                  ? 'cursor-pointer hover:scale-105 active:scale-95 ring-3 ring-yellow-400 rounded-2xl shadow-xl shadow-yellow-500/40'
                  : 'cursor-default opacity-90'
              }`}
            >
              <UnoCard
                card={{ id: 'deck-card', color: 'red', value: '0', scoreValue: 0 }}
                faceDown={true}
                size="md"
              />

              {/* Cards Count Badge */}
              <div className="absolute -top-2 -right-2 bg-slate-950 border-2 border-yellow-400 text-yellow-300 font-mono font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-xl flex items-center gap-1 z-20">
                <Layers size={10} />
                <span>{drawPileCount}</span>
              </div>

              {/* Draw Prompt Banner when it's your turn */}
              {isMyTurn && (
                <div
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xl flex items-center gap-1 border border-white/60 transition-all z-20 ${
                    hasPlayableCard
                      ? 'bg-yellow-400 hover:bg-yellow-300'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-300 animate-bounce'
                  }`}
                >
                  <Hand size={11} />
                  <span>{lang === 'uz' ? 'Karta Olish' : 'Draw Card'}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. DISCARD PILE (TOP PLAYED CARD) */}
          <div className="relative flex flex-col items-center">
            {/* Previous cards underneath */}
            {previousCards.slice(-3, -1).map((prevCard, i) => (
              <div
                key={prevCard.id || i}
                className="absolute top-0 left-0 pointer-events-none opacity-40"
              >
                <UnoCard
                  card={prevCard}
                  size="md"
                  rotation={((i + 1) * 7 - 10) * (i % 2 === 0 ? 1 : -1)}
                />
              </div>
            ))}

            {/* Current Top Card with Colored Glow Halo */}
            {topCard && (
              <div className={`relative rounded-2xl ring-4 ${colorInfo.ringColor} ${colorInfo.shadow} shadow-2xl`}>
                <UnoCard card={topCard} size="md" rotation={1} />

                {/* Stacking Attack Alert (+2 / +4 penalty) */}
                {activeDrawStack > 0 && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 border-2 border-yellow-300 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xl flex items-center gap-1 animate-bounce z-30">
                    <AlertTriangle size={13} className="text-yellow-300" />
                    <span>+{activeDrawStack} JARIMA!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
