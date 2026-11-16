import React, { useState } from 'react';
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
  const [tab, setTab] = useState<'guide' | 'cards' | 'penalty'>('guide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="text-yellow-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-black">
              {lang === 'uz' ? "UNO O'yini Qo'llanmasi" : 'UNO Game Guide'}
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Yopish"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition hover:bg-slate-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-4">
          <button
            onClick={() => setTab('guide')}
            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'guide' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'uz' ? 'Qisqa Qoidalar' : 'How to Play'}
          </button>
          <button
            onClick={() => setTab('cards')}
            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'cards' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'uz' ? 'Kartalar Turi' : 'Card Types'}
          </button>
          <button
            onClick={() => setTab('penalty')}
            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'penalty' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'uz' ? 'UNO va Jarima' : 'UNO & Penalties'}
          </button>
        </div>

        {/* TAB 1: GUIDE */}
        {tab === 'guide' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
              <h3 className="flex items-center gap-2 text-base font-black text-yellow-400 mb-2">
                <Award size={18} />
                {lang === 'uz' ? "O'yinning Bosh Maqsadi" : 'The Main Objective'}
              </h3>
              <p className="leading-relaxed">
                {lang === 'uz'
                  ? "Barcha o'yinchilarga 7 tadan karta tarqatiladi. Sizning asosiy vazifangiz — qo'lingizdagi barcha kartalarni raqiblaringizdan oldin birinchi bo'lib tugatish!"
                  : 'Every player starts with 7 cards. Your main goal is to be the very first player to get rid of all your cards!'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500 mb-2">
                    1
                  </span>
                  <h4 className="font-black text-white text-xs mb-1">
                    {lang === 'uz' ? 'Mos Kartani Tashlang' : 'Match the Card'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? "Stol o'rtasidagi karta bilan bir xil rangdagi yoki bir xil raqamdagi kartani bosing."
                      : 'Play a card that matches the top card by color or number.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-yellow-950 text-yellow-300 font-black text-xs flex items-center justify-center border border-yellow-500 mb-2">
                    2
                  </span>
                  <h4 className="font-black text-white text-xs mb-1">
                    {lang === 'uz' ? 'Karta Bo\'lmasa Oling' : 'Draw if No Match'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? "Agar qo'lingizda mos karta bo'lmasa, chapdagi Kolodani bosing va yangi karta oling."
                      : 'If you have no playable card, tap the deck on the left to draw.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-300 font-black text-xs flex items-center justify-center border border-rose-500 mb-2">
                    3
                  </span>
                  <h4 className="font-black text-white text-xs mb-1">
                    {lang === 'uz' ? '"UNO!" Tugmasini Bosing' : 'Press "UNO!"'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? 'Qo\'lingizda 1 ta karta qolganida "UNO!" deb baqirishingiz (tugmani bosishingiz) shart!'
                      : 'When you have 1 card left, press the glowing UNO button immediately!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPECIAL CARDS */}
        {tab === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {/* Skip */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-700 shrink-0">
                <Ban size={22} />
              </div>
              <div>
                <h4 className="font-black text-white text-xs sm:text-sm">
                  {lang === 'uz' ? 'Skip (O\'tkazib yuborish)' : 'Skip Card'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'uz'
                    ? "Keyingi o'yinchi navbatini o'tkazadi va yura olmaydi."
                    : 'The next player loses their turn and gets skipped.'}
                </p>
              </div>
            </div>

            {/* Reverse */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-700 shrink-0">
                <RefreshCw size={22} />
              </div>
              <div>
                <h4 className="font-black text-white text-xs sm:text-sm">
                  {lang === 'uz' ? 'Reverse (Teskari burish)' : 'Reverse Card'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'uz'
                    ? "O'yin yo'nalishini soat bo'yicha yoki teskari buradi."
                    : 'Reverses the direction of turn rotation.'}
                </p>
              </div>
            </div>

            {/* Draw 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-950 text-green-400 border border-green-700 shrink-0 font-black text-base flex items-center justify-center">
                +2
              </div>
              <div>
                <h4 className="font-black text-white text-xs sm:text-sm">
                  {lang === 'uz' ? 'Draw 2 (+2 Jarima)' : 'Draw Two (+2)'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'uz'
                    ? "Keyingi o'yinchi 2 ta karta oladi va navbatini o'tkazadi (Stacking bo'lsa boshqa +2 bilan qaytarish mumkin!)."
                    : 'Next player draws 2 cards and misses their turn.'}
                </p>
              </div>
            </div>

            {/* Wild */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-700 shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="font-black text-white text-xs sm:text-sm">
                  {lang === 'uz' ? 'Wild (Sehrli Rang Tanlash)' : 'Wild Card'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'uz'
                    ? "Istalgan kartaga tushadi va keyingi rangni o'zingiz tanlaysiz."
                    : 'Can be played on any card; pick any color you want!'}
                </p>
              </div>
            </div>

            {/* Wild Draw 4 */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-purple-600 text-white border-2 border-yellow-300 shrink-0 font-black text-base flex items-center justify-center">
                +4
              </div>
              <div>
                <h4 className="font-black text-white text-xs sm:text-sm">
                  {lang === 'uz' ? 'Wild Draw 4 (+4 Jarima + Rang Tanlash)' : 'Wild Draw Four (+4)'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'uz'
                    ? "Eng kuchli karta! Yangi rang tanlaysiz, keyingi o'yinchi esa 4 ta karta oladi va navbatini o'tkazadi!"
                    : 'The ultimate card! Choose the color and force the next player to draw 4 cards!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UNO & PENALTY */}
        {tab === 'penalty' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-600/50">
              <h3 className="flex items-center gap-2 text-base font-black text-amber-300 mb-2">
                <ShieldAlert size={20} />
                {lang === 'uz' ? 'UNO Deyish Qoidasi (Juda Muhim!)' : 'The Golden UNO Rule'}
              </h3>
              <p className="leading-relaxed">
                {lang === 'uz'
                  ? "Qo'lingizda 2 ta karta qolganda va ulardan birini tashlashdan oldin (yoki tashlashingiz bilan), ekrandagi yaltirab turgan qizil 'UNO!' tugmasini bosishingiz shart!"
                  : 'When playing your second-to-last card, you must tap the glowing "UNO!" button!'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-black text-white text-sm mb-1">
                {lang === 'uz' ? 'Agar UNO deyishni unutsangiz nima bo\'ladi?' : 'What if you forget to say UNO?'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'uz'
                  ? "Agar siz unutib qo'ysangiz va raqibingiz (yoki aqlli bot) 'Jarima berish (Challenge)' tugmasini bosib sizni fosh qilsa, siz darhol 2 ta qo'shimcha jarima kartasi olasiz!"
                  : 'If you forget and an opponent catches you, you must draw 2 penalty cards from the deck!'}
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5 pt-3.5 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-sm shadow-xl active:scale-98 transition cursor-pointer"
          >
            {lang === 'uz' ? 'Tushundim, O\'yinga Qaytish' : 'Got it, Back to Game'}
          </button>
        </div>
      </div>
    </div>
  );
};
