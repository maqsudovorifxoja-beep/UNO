import React from 'react';
import type { GameMode } from '../types/game';
import { sound } from '../utils/sound';
import { Volume2, VolumeX, HelpCircle, Settings, Home, Users, Bot, Wifi } from 'lucide-react';

interface GameHeaderProps {
  mode: GameMode;
  roomCode?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onExitGame: () => void;
  latestLog?: string;
  lang?: 'uz' | 'en';
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  mode,
  roomCode,
  isMuted,
  onToggleMute,
  onOpenRules,
  onOpenSettings,
  onExitGame,
  latestLog,
  lang = 'uz',
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col gap-2 z-40">
      <div className="w-full flex items-center justify-between">
        {/* Left: UNO Brand & Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-2xl shadow-lg border border-yellow-300/40">
            <span className="font-black italic text-yellow-300 text-lg sm:text-xl tracking-tighter drop-shadow font-mono">
              UNO
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider bg-black/30 px-1.5 py-0.5 rounded-md">
              PRO
            </span>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full">
            {mode === 'vs-bot' && <Bot size={13} className="text-cyan-400" />}
            {mode === 'online' && <Wifi size={13} className="text-emerald-400" />}
            {mode === 'pass-and-play' && <Users size={13} className="text-purple-400" />}
            <span className="font-medium text-slate-300">
              {mode === 'vs-bot'
                ? lang === 'uz'
                  ? 'Botlar bilan'
                  : 'Vs Bots'
                : mode === 'online'
                ? `Online: ${roomCode || 'P2P'}`
                : 'Pass & Play'}
            </span>
          </div>
        </div>

        {/* Right: Sound, Rules, Settings, Exit */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mute Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shadow"
          >
            {isMuted ? <VolumeX size={17} className="text-rose-400" /> : <Volume2 size={17} className="text-emerald-400" />}
          </button>

          {/* Rules Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            aria-label="Qoidalar"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shadow"
          >
            <HelpCircle size={17} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Sozlamalar"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shadow"
          >
            <Settings size={17} />
          </button>

          {/* Exit / Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              onExitGame();
            }}
            aria-label="Bosh sahifa"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/60 flex items-center justify-center transition active:scale-95 cursor-pointer shadow"
          >
            <Home size={17} />
          </button>
        </div>
      </div>

      {/* Latest Game Ticker notification bar */}
      {latestLog && (
        <div className="w-full flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-yellow-300/90 font-medium truncate max-w-md shadow-md animate-fadeIn">
            {latestLog}
          </div>
        </div>
      )}
    </header>
  );
};
