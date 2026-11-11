import React from 'react';
import { sound } from '../utils/sound';
import { AlertCircle, Flame } from 'lucide-react';

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
      {/* Challenge Button when someone forgot UNO */}
      {canChallenge && (
        <button
          onClick={() => {
            sound.playBuzzer();
            onChallenge();
          }}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-900/40 border border-orange-400 active:scale-95 transition-all animate-bounce"
        >
          <AlertCircle size={16} />
          <span>
            {lang === 'uz'
              ? `${challengedPlayerName || 'Raqib'}ga +2 jarima!`
              : `Catch ${challengedPlayerName || 'Player'}! (+2)`}
          </span>
        </button>
      )}

      {/* Main UNO! Button */}
      <button
        onClick={() => {
          if (!hasSaidUno) {
            sound.playUnoCall();
            onSayUno();
          }
        }}
        disabled={hasSaidUno}
        className={`relative group px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-black italic tracking-tighter text-sm sm:text-base md:text-lg transition-all duration-200 select-none cursor-pointer flex items-center gap-1.5 shadow-xl ${
          hasSaidUno
            ? 'bg-emerald-600/60 text-emerald-200 border border-emerald-400/50 cursor-default'
            : canSayUno
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-yellow-500 text-white border-2 border-yellow-300 animate-uno-pulse active:scale-95 hover:scale-105'
            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 hover:bg-slate-700 active:scale-95'
        }`}
      >
        <Flame
          size={18}
          className={`${hasSaidUno ? 'text-emerald-300' : canSayUno ? 'text-yellow-300 animate-pulse' : 'text-slate-500'}`}
        />
        <span>{hasSaidUno ? (lang === 'uz' ? 'UNO AYTILDI!' : 'UNO CALLED!') : 'UNO!'}</span>
      </button>
    </div>
  );
};

