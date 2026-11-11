import React from 'react';
import { sound } from '../utils/sound';
import { X, BookOpen, Ban, RefreshCw, Sparkles, ShieldAlert, Award } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'uz' | 'en';
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  lang = 'uz',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="text-yellow-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-black">
              {lang === 'uz' ? "UNO O'yini Qoidalari" : 'UNO Official Rules'}
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Yopish"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Goal */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <h3 className="flex items-center gap-2 text-base font-bold text-yellow-300 mb-2">
              <Award size={18} />
              {lang === 'uz' ? "O'yin Maqsadi" : 'Objective'}
            </h3>
            <p>
              {lang === 'uz'
                ? "Har bir o'yinchiga 7 tadan karta tarqatiladi. O'yinchi o'z qo'lidagi barcha kartalarni birinchi bo'lib tugatishi kerak! O'yin markazdagi karta bilan bir xil rangdagi yoki bir xil raqamdagi kartani tashlash orqali davom etadi."
                : 'Each player receives 7 cards. The goal is to be the first to get rid of all cards in your hand by matching the top card of the discard pile by color, number, or symbol.'}
            </p>
          </div>

          {/* Action Cards */}
          <div>
            <h3 className="text-base font-bold text-white mb-3">
              {lang === 'uz' ? 'Maxsus Kartalar' : 'Special Action Cards'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Skip */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-700 shrink-0">
                  <Ban size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'uz' ? 'Skip (O\'tkazib yuborish)' : 'Skip Card'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz'
                      ? "Keyingi o'yinchi o'z navbatini o'tkazib yuboradi."
                      : 'The next player loses their turn.'}
                  </p>
                </div>
              </div>

              {/* Reverse */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-700 shrink-0">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'uz' ? 'Reverse (Teskari burish)' : 'Reverse Card'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz'
                      ? "O'yin yo'nalishini o'zgartiradi (soat bo'yicha yoki teskari)."
                      : 'Reverses the direction of play.'}
                  </p>
                </div>
              </div>

              {/* Draw 2 */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-950 text-green-400 border border-green-700 shrink-0 font-bold text-base w-9 h-9 flex items-center justify-center">
                  +2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'uz' ? 'Draw Two (+2 Jarima)' : 'Draw Two (+2)'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz'
                      ? "Keyingi o'yinchi 2 ta karta oladi va navbatini o'tkazadi."
                      : 'Next player draws 2 cards and forfeits their turn.'}
                  </p>
                </div>
              </div>

              {/* Wild */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-700 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'uz' ? 'Wild (Sehrli rang tanlash)' : 'Wild Card'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz'
                      ? "Har qanday kartaga tushadi va yangi rangni tanlash imkonini beradi."
                      : 'Can be played on any card; allows choosing next color.'}
                  </p>
                </div>
              </div>

              {/* Wild Draw 4 */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 via-amber-600 to-purple-600 text-white border border-yellow-400 shrink-0 font-black text-sm w-9 h-9 flex items-center justify-center">
                  +4
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'uz' ? 'Wild Draw Four (+4 Jarima va Rang)' : 'Wild Draw Four (+4)'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz'
                      ? "Eng kuchli karta! Yangi rangni tanlaydi, keyingi o'yinchi esa 4 ta karta oladi va o'z navbatini o'tkazadi."
                      : 'The ultimate card! Choose the color and make the next player draw 4 cards and skip their turn.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* UNO Rule & Penalty */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40">
            <h3 className="flex items-center gap-2 text-base font-bold text-amber-300 mb-1.5">
              <ShieldAlert size={18} />
              {lang === 'uz' ? "Eng Muhim Qoida: 'UNO!' Deyish" : 'Crucial Rule: Calling UNO!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'uz'
                ? "Qo'lingizda 2 ta karta qolib, ulardan birini tashlayotganingizda, albatta 'UNO!' tugmasini bosishingiz shart. Agar unutib qo'ysangiz va raqibingiz sizni fosh qilsa (Challenge), siz 2 ta qo'shimcha jarima kartasi olasiz!"
                : 'When you are down to your last card, you must press the "UNO!" button before your turn ends. If you forget and another player catches you, you must draw 2 penalty cards!'}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition active:scale-98 cursor-pointer"
          >
            {lang === 'uz' ? 'Tushundim' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
};
