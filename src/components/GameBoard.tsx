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

const THEME_STYLES: Record<TableTheme, { felt: string; border: string; glow: string; rail: string }> = {
  'classic-casino': {
    felt: 'from-[#0a4630] via-[#053121] to-[#021f14]',
    border: 'border-[#1b7a54]',
    glow: 'rgba(16, 185, 129, 0.25)',
    rail: 'border-[#2d5c48]',
  },
  'neon-arcade': {
    felt: 'from-[#1e1338] via-[#120a24] to-[#080410]',
    border: 'border-[#8b5cf6]',
    glow: 'rgba(139, 92, 246, 0.3)',
    rail: 'border-[#582b9b]',
  },
  'midnight-luxury': {
    felt: 'from-[#171c26] via-[#0d1117] to-[#05070a]',
    border: 'border-[#d4af37]',
    glow: 'rgba(212, 175, 55, 0.25)',
    rail: 'border-[#8c7322]',
  },
  'crimson-velvet': {
    felt: 'from-[#4a0d16] via-[#2f060c] to-[#1a0206]',
    border: 'border-[#e11d48]',
    glow: 'rgba(225, 29, 72, 0.28)',
    rail: 'border-[#881337]',
  },
};

const COLOR_CONFIG: Record<CardColor, { bg: string; textUz: string; textEn: string; glow: string }> = {
  red: { bg: 'bg-[#ff2d3d]', textUz: 'Qizil', textEn: 'Red', glow: 'shadow-red-500/80 ring-red-400' },
  blue: { bg: 'bg-[#0094ff]', textUz: "Ko'k", textEn: 'Blue', glow: 'shadow-blue-500/80 ring-blue-400' },
  green: { bg: 'bg-[#1ddc62]', textUz: 'Yashil', textEn: 'Green', glow: 'shadow-emerald-500/80 ring-emerald-400' },
  yellow: { bg: 'bg-[#ffd000]', textUz: 'Sariq', textEn: 'Yellow', glow: 'shadow-amber-400/80 ring-yellow-300' },
  wild: { bg: 'bg-purple-500', textUz: 'Tanlang', textEn: 'Choose', glow: 'shadow-purple-500/80 ring-purple-400' },
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
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 my-auto select-none">
      {/* 3D Oval Felt Table Surface */}
      <div
        style={{
          boxShadow: `0 0 90px ${currentTheme.glow}, inset 0 0 60px rgba(0,0,0,0.85)`,
        }}
        className={`relative w-full min-h-[230px] sm:min-h-[290px] md:min-h-[330px] rounded-[48px] sm:rounded-[64px] bg-gradient-to-b ${currentTheme.felt} border-4 ${currentTheme.border} p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden transition-all duration-500`}
      >
        {/* Table Felt Cross-weave Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Orbiting Direction Indicator Ring with Active Color Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-56 h-56 sm:w-76 sm:h-76 md:w-88 md:h-88 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center transition-all ${
              direction === 1 ? 'rotate-cw' : 'rotate-ccw'
            }`}
          >
            <div className="w-full flex justify-between px-3 text-white/40">
              {direction === 1 ? <RotateCw size={24} /> : <RotateCcw size={24} />}
              {direction === 1 ? <RotateCw size={24} /> : <RotateCcw size={24} />}
            </div>
          </div>
        </div>

        {/* Central Card Interaction Area */}
        <div className="relative z-10 flex items-center justify-center gap-5 sm:gap-10 md:gap-14">
          {/* DRAW PILE (DECK) */}
          <div className="relative flex flex-col items-center">
            {/* 3D Stack depth under deck */}
            <div className="absolute top-2 left-1.5 w-20 h-29 sm:w-24 sm:h-35 md:w-26 md:h-38 bg-black rounded-2xl border border-zinc-800 -rotate-3" />
            <div className="absolute top-1 left-0.5 w-20 h-29 sm:w-24 sm:h-35 md:w-26 md:h-38 bg-zinc-950 rounded-2xl border border-zinc-700 -rotate-1" />

            <div
              onClick={() => {
                if (isMyTurn) {
                  sound.playCardSlide();
                  onDrawCard();
                }
              }}
              className={`relative transition-all duration-200 ${
                isMyTurn
                  ? 'cursor-pointer hover:scale-105 active:scale-95 group ring-2 ring-yellow-400/80 rounded-2xl'
                  : 'cursor-default opacity-90'
              }`}
            >
              <UnoCard
                card={{ id: 'deck-card', color: 'red', value: '0', scoreValue: 0 }}
                faceDown={true}
                size="md"
              />

              {/* Remaining Cards Badge */}
              <div className="absolute -top-2.5 -right-2.5 bg-slate-900 border-2 border-yellow-400 text-yellow-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full shadow-xl flex items-center gap-1">
                <Layers size={11} />
                <span>{drawPileCount}</span>
              </div>

              {/* Big Draw Prompt if it is your turn */}
              {isMyTurn && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-xl animate-bounce flex items-center gap-1 border border-yellow-200">
                  <Hand size={12} />
                  <span>{lang === 'uz' ? 'Karta Olish' : 'Draw Card'}</span>
                </div>
              )}
            </div>
          </div>

          {/* DISCARD PILE (CURRENT PLAYED CARDS) */}
          <div className="relative flex flex-col items-center">
            {/* Show previously played cards underneath with natural scattered rotation */}
            {previousCards.slice(-3, -1).map((prevCard, i) => (
              <div
                key={prevCard.id || i}
                className="absolute top-0 left-0 pointer-events-none opacity-50"
              >
                <UnoCard
                  card={prevCard}
                  size="md"
                  rotation={((i + 1) * 8 - 12) * (i % 2 === 0 ? 1 : -1)}
                />
              </div>
            ))}

            {/* Current Top Card with slight physical angle */}
            {topCard && (
              <div className="relative">
                <UnoCard card={topCard} size="md" rotation={2} />

                {/* Stacking Attack Alert Badge */}
                {activeDrawStack > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 border-2 border-yellow-300 text-white font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce">
                    <AlertTriangle size={14} className="text-yellow-300" />
                    <span>+{activeDrawStack} JARIMA!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Current Active Color Pill with Radiant Ring */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/90 border-2 border-slate-700/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-2xl">
          <span className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider">
            {lang === 'uz' ? 'Faol Rang:' : 'Active Color:'}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full shadow-lg ring-2 ring-white/60 animate-pulse ${colorInfo.bg}`}
            />
            <span className="text-xs sm:text-sm font-black capitalize text-white">
              {lang === 'uz' ? colorInfo.textUz : colorInfo.textEn}
            </span>
          </div>
        </div>

        {/* Direction Indicator Pill at top right */}
        <div className="absolute top-3 sm:top-4 right-4 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-slate-300 text-xs shadow-md">
          {direction === 1 ? (
            <RotateCw size={13} className="text-cyan-400" />
          ) : (
            <RotateCcw size={13} className="text-cyan-400" />
          )}
          <span className="text-[11px] font-mono font-bold">
            {direction === 1
              ? lang === 'uz'
                ? "Soat yo'nalishida"
                : 'Clockwise'
              : lang === 'uz'
              ? 'Teskari'
              : 'Counter-cw'}
          </span>
        </div>

        {/* Turn Guide Hint for Human Player */}
        {isMyTurn && (
          <div className="absolute top-3 sm:top-4 left-4 hidden sm:flex items-center gap-1.5 bg-yellow-400/90 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg animate-pulse">
            <span>
              {hasPlayableCard
                ? lang === 'uz'
                  ? '🎯 Kartangizni bosing'
                  : '🎯 Tap your card'
                : lang === 'uz'
                ? '🃏 Kolodadan oling'
                : '🃏 Draw a card'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
