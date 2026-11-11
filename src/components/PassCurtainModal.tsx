import React from 'react';
import type { Player } from '../types/game';
import { sound } from '../utils/sound';
import { Eye, Shield, Users } from 'lucide-react';

interface PassCurtainModalProps {
  isOpen: boolean;
  nextPlayer: Player;
  onReveal: () => void;
  lang?: 'uz' | 'en';
}

export const PassCurtainModal: React.FC<PassCurtainModalProps> = ({
  isOpen,
  nextPlayer,
  onReveal,
  lang = 'uz',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-950 text-purple-400 border border-purple-700/60 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Users size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
          {lang === 'uz' ? 'Navbat almashinuvi' : 'Pass the Device'}
        </h2>

        <p className="text-sm text-slate-300 mb-6">
          {lang === 'uz' ? (
            <>
              Qurilmani <strong className="text-purple-300">{nextPlayer.name}</strong>ga uzating!
            </>
          ) : (
            <>
              Pass the device to <strong className="text-purple-300">{nextPlayer.name}</strong>!
            </>
          )}
        </p>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 mb-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield size={14} className="text-emerald-400" />
          <span>{lang === 'uz' ? 'Kartalar maxfiy saqlanmoqda' : 'Cards are hidden for privacy'}</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onReveal();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Eye size={18} />
          <span>{lang === 'uz' ? 'Kartalarni ochish' : 'Reveal My Hand'}</span>
        </button>
      </div>
    </div>
  );
};
