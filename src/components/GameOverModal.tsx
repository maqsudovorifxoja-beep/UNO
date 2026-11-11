import React, { useEffect } from 'react';
import type { Player } from '../types/game';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, Bot, User } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | null;
  players: Player[];
  score: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  lang?: 'uz' | 'en';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  players,
  score,
  onPlayAgain,
  onGoHome,
  lang = 'uz',
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      sound.playVictory();
      // Burst confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const isHumanWinner = !winner.isBot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Trophy Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 mb-4 shadow-xl shadow-yellow-500/30 transform hover:scale-105 transition">
            <Trophy size={42} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            {isHumanWinner
              ? lang === 'uz'
                ? "TABRIKLAYMIZ! G'ALABA!"
                : 'VICTORY! YOU WON!'
              : lang === 'uz'
              ? `${winner.name} G'olib bo'ldi!`
              : `${winner.name} Won the Game!`}
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            {isHumanWinner
              ? lang === 'uz'
                ? "Siz barcha kartalaringizni birinchi bo'lib tugatdingiz!"
                : 'You were the first to clear all cards from your hand!'
              : lang === 'uz'
              ? "Keyingi safar albatta g'alaba qozonasiz!"
              : 'Better luck in the next round!'}
          </p>

          {/* Points earned card */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-6 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5">
              <Sparkles size={16} className="text-yellow-400" />
              {lang === 'uz' ? "To'plangan ochkolar:" : 'Points Scored:'}
            </span>
            <span className="font-mono font-black text-xl text-yellow-300">
              +{score} {lang === 'uz' ? 'ball' : 'pts'}
            </span>
          </div>

          {/* Player Rankings */}
          <div className="space-y-2 mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-2">
              {lang === 'uz' ? "Natijalar jadvali:" : 'Leaderboard:'}
            </h4>
            {players.map((p, idx) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm ${
                  p.id === winner.id
                    ? 'bg-yellow-950/40 border-yellow-500/60 text-yellow-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs w-4">{idx + 1}.</span>
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                    {p.isBot ? <Bot size={12} /> : <User size={12} />}
                  </div>
                  <span className="font-semibold truncate max-w-[120px]">{p.name}</span>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {p.hand.length === 0
                    ? lang === 'uz'
                      ? "G'olib"
                      : 'Winner'
                    : `${p.hand.length} ${lang === 'uz' ? 'karta qoldi' : 'cards left'}`}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onPlayAgain();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg active:scale-95 transition cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>{lang === 'uz' ? "Qayta o'ynash" : 'Play Again'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95 transition cursor-pointer"
            >
              <Home size={16} />
              <span>{lang === 'uz' ? 'Bosh sahifa' : 'Home'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
