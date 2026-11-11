import React from 'react';
import type { Card, CardColor, TableTheme } from '../types/game';
import { UnoCard } from './UnoCard';
import { sound } from '../utils/sound';
import { RotateCw, RotateCcw, AlertTriangle, Layers } from 'lucide-react';

interface GameBoardProps {
  topCard: Card | null;
  previousCards: Card[];
  drawPileCount: number;
  currentColor: CardColor;
  activeDrawStack: number;
  direction: 1 | -1;
  theme: TableTheme;
  isMyTurn: boolean;
  onDrawCard: () => void;
  lang?: 'uz' | 'en';
}

const THEME_STYLES: Record<TableTheme, { felt: string; border: string; glow: string }> = {
  'classic-casino': {
    felt: 'from-emerald-950 via-teal-950 to-slate-950',
    border: 'border-emerald-800/60 shadow-emerald-950/80',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  'neon-arcade': {
    felt: 'from-slate-950 via-purple-950 to-neutral-950',
    border: 'border-purple-800/60 shadow-purple-950/80',
    glow: 'rgba(168, 85, 247, 0.2)',
  },
  'midnight-luxury': {
    felt: 'from-slate-950 via-indigo-950 to-black',
    border: 'border-amber-600/50 shadow-black',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
  'crimson-velvet': {
    felt: 'from-rose-950 via-red-950 to-neutral-950',
    border: 'border-rose-800/60 shadow-rose-950/80',
    glow: 'rgba(244, 63, 94, 0.18)',
  },
};

const COLOR_GLOW: Record<CardColor, string> = {
  red: 'bg-red-500 shadow-red-500/50 text-red-100',
  blue: 'bg-blue-500 shadow-blue-500/50 text-blue-100',
  green: 'bg-emerald-500 shadow-emerald-500/50 text-emerald-100',
  yellow: 'bg-yellow-400 shadow-yellow-400/50 text-yellow-950',
  wild: 'bg-purple-500 shadow-purple-500/50 text-purple-100',
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
  onDrawCard,
  lang = 'uz',
}) => {
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES['classic-casino'];

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-3 sm:p-6 my-auto select-none">
      {/* Table Felt Surface */}
      <div
        style={{
          boxShadow: `0 0 80px ${currentTheme.glow}, inset 0 0 50px rgba(0,0,0,0.8)`,
        }}
        className={`relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px] rounded-[36px] sm:rounded-[48px] bg-gradient-to-b ${currentTheme.felt} border-4 ${currentTheme.border} p-4 sm:p-8 flex items-center justify-center overflow-hidden transition-all duration-500`}
      >
        {/* Felt textured grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Dynamic Rotating Direction Indicator Circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full border border-dashed border-white/15 flex items-center justify-center transition-all ${
              direction === 1 ? 'rotate-cw' : 'rotate-ccw'
            }`}
          >
            <div className="w-full flex justify-between px-2 text-white/30">
              {direction === 1 ? <RotateCw size={24} /> : <RotateCcw size={24} />}
              {direction === 1 ? <RotateCw size={24} /> : <RotateCcw size={24} />}
            </div>
          </div>
        </div>

        {/* Central Cards Zone */}
        <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
          {/* DRAW PILE (DECK) */}
          <div className="relative flex flex-col items-center">
            {/* 3D Deck thickness layers */}
            <div className="absolute top-2 left-1 w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 bg-zinc-950 rounded-xl border border-zinc-800 -rotate-3" />
            <div className="absolute top-1 left-0.5 w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 bg-zinc-900 rounded-xl border border-zinc-700 -rotate-1" />

            <div
              onClick={() => {
                if (isMyTurn) {
                  sound.playCardSlide();
                  onDrawCard();
                }
              }}
              className={`relative transition-transform duration-200 ${
                isMyTurn
                  ? 'cursor-pointer hover:scale-105 active:scale-95 group'
                  : 'cursor-default opacity-85'
              }`}
            >
              <UnoCard
                card={{ id: 'deck-top', color: 'red', value: '0', scoreValue: 0 }}
                faceDown={true}
                size="md"
              />

              {/* Draw Pile Count Badge */}
              <div className="absolute -top-2.5 -right-2.5 bg-slate-900 border border-slate-700 text-yellow-300 font-mono font-bold text-xs px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                <Layers size={11} />
                <span>{drawPileCount}</span>
              </div>

              {/* Prompt to draw if player's turn */}
              {isMyTurn && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                  {lang === 'uz' ? 'Karta olish' : 'Draw'}
                </div>
              )}
            </div>
          </div>

          {/* DISCARD PILE */}
          <div className="relative flex flex-col items-center">
            {/* Show scattered previous cards underneath */}
            {previousCards.slice(-3, -1).map((prevCard, i) => (
              <div
                key={prevCard.id || i}
                className="absolute top-0 left-0 pointer-events-none opacity-60"
              >
                <UnoCard
                  card={prevCard}
                  size="md"
                  rotation={((i + 1) * 7 - 10) * (i % 2 === 0 ? 1 : -1)}
                />
              </div>
            ))}

            {/* Current Top Card */}
            {topCard && (
              <div className="relative">
                <UnoCard card={topCard} size="md" rotation={3} />

                {/* Active Draw Stack Warning Badge (e.g. +4, +6) */}
                {activeDrawStack > 0 && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 border border-yellow-300 text-white font-black text-xs px-3 py-1 rounded-full shadow-xl flex items-center gap-1 animate-bounce">
                    <AlertTriangle size={13} className="text-yellow-300" />
                    <span>+{activeDrawStack} JARIMA!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Current Active Color Pill Badge */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
            {lang === 'uz' ? 'Faol rang:' : 'Active color:'}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-full shadow-md ${COLOR_GLOW[currentColor] || 'bg-slate-500'}`}
            />
            <span className="text-xs sm:text-sm font-bold capitalize text-white">
              {lang === 'uz'
                ? currentColor === 'red'
                  ? 'Qizil'
                  : currentColor === 'blue'
                  ? "Ko'k"
                  : currentColor === 'green'
                  ? 'Yashil'
                  : currentColor === 'yellow'
                  ? 'Sariq'
                  : 'Har qanday'
                : currentColor}
            </span>
          </div>
        </div>

        {/* Direction Indicator Pill */}
        <div className="absolute top-3 sm:top-4 right-4 flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-full text-slate-400 text-xs">
          {direction === 1 ? <RotateCw size={13} className="text-cyan-400" /> : <RotateCcw size={13} className="text-cyan-400" />}
          <span className="text-[11px] font-mono">
            {direction === 1
              ? lang === 'uz'
                ? "Soat bo'yicha"
                : 'Clockwise'
              : lang === 'uz'
              ? 'Teskari'
              : 'Counter-cw'}
          </span>
        </div>
      </div>
    </div>
  );
};
