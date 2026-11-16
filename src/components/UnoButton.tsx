import React from 'react';
import { sound } from '../utils/sound';
import { AlertCircle, Flame, Check } from 'lucide-react';

interface UnoButtonProps {
  canSayUno: boolean;
  hasSaidUno: boolean;
  onSayUno: () => void;
  canChallenge: boolean;
  challengedPlayerName?: string;
  onChallenge: () => void;
  lang?: 'uz' | 'en';
}

export const UnoButton: React.FC<UnoButtonProps> = ({
  canSayUno,
  hasSaidUno,
  onSayUno,
  canChallenge,
  challengedPlayerName,
  onChallenge,
  lang = 'uz',
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 z-30">
      {/* Catch / Challenge Button when opponent forgot UNO */}
      {canChallenge && (
        <button
          onClick={() => {
            sound.playBuzzer();
            onChallenge();
          }}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-2xl border-2 border-yellow-300 active:scale-95 transition-all animate-bounce cursor-pointer"
        >
          <AlertCircle size={17} className="animate-spin text-yellow-200" />
          <span>
            {lang === 'uz'
              ? `${challengedPlayerName || 'Raqib'}ga +2 Jarima!`
              : `Catch ${challengedPlayerName || 'Player'}! (+2)`}
          </span>
        </button>
      )}

      {/* Main UNO! Shout Button */}
      <button
        onClick={() => {
          if (!hasSaidUno) {
            sound.playUnoCall();
            onSayUno();
          }
        }}
        disabled={hasSaidUno}
        className={`relative group px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl font-black italic tracking-tighter text-sm sm:text-base md:text-lg transition-all duration-200 select-none cursor-pointer flex items-center gap-2 shadow-2xl ${
          hasSaidUno
            ? 'bg-emerald-600 text-white border-2 border-emerald-400 cursor-default shadow-emerald-600/40'
            : canSayUno
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-yellow-300 border-2 border-yellow-300 animate-uno-pulse active:scale-95 hover:scale-105 shadow-red-600/60'
            : 'bg-slate-900 text-slate-400 border-2 border-slate-700 hover:text-slate-200 hover:bg-slate-800 active:scale-95'
        }`}
      >
        {hasSaidUno ? (
          <Check size={20} className="text-white" strokeWidth={3} />
        ) : (
          <Flame
            size={20}
            className={`${canSayUno ? 'text-yellow-300 animate-pulse' : 'text-slate-500'}`}
          />
        )}
        <span>{hasSaidUno ? (lang === 'uz' ? 'UNO AYTILDI!' : 'UNO CALLED!') : 'UNO!'}</span>
      </button>
    </div>
  );
};
