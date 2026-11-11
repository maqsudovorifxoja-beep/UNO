import React from 'react';
import type { Player } from '../types/game';
import { sound } from '../utils/sound';
import { RefreshCw, User, Bot } from 'lucide-react';

interface HandSwapModalProps {
  isOpen: boolean;
  currentPlayer: Player;
  opponents: Player[];
  onSelectPlayer: (targetPlayerId: string) => void;
  lang?: 'uz' | 'en';
}

export const HandSwapModal: React.FC<HandSwapModalProps> = ({
  isOpen,
  opponents,
  onSelectPlayer,
  lang = 'uz',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-yellow-500/50 rounded-3xl p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-yellow-950 text-yellow-400 border border-yellow-600/60 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <RefreshCw size={28} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
          {lang === 'uz' ? '7 Qoidasi: Qo\'lni Almashtirish!' : '7 Rule: Swap Hands!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-5">
          {lang === 'uz'
            ? 'Qo\'lingizdagi kartalarni kim bilan almashtirmoqchisiz?'
            : 'Choose an opponent to swap your entire hand with!'}
        </p>

        <div className="space-y-2">
          {opponents.map((opp) => (
            <button
              key={opp.id}
              onClick={() => {
                sound.playClick();
                onSelectPlayer(opp.id);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-yellow-400 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 text-xs">
                  {opp.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{opp.name}</div>
                  <div className="text-xs text-slate-400 font-mono">
                    {opp.hand.length} {lang === 'uz' ? 'karta' : 'cards'}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-700/50 px-2.5 py-1 rounded-lg">
                {lang === 'uz' ? 'Almashtirish' : 'Swap'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
