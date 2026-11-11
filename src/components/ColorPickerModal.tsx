import React, { useEffect } from 'react';
import type { CardColor } from '../types/game';
import { sound } from '../utils/sound';
import { Palette } from 'lucide-react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onSelectColor: (color: CardColor) => void;
  lang?: 'uz' | 'en';
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onSelectColor,
  lang = 'uz',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'r' || key === '1') {
        sound.playClick();
        onSelectColor('red');
      } else if (key === 'b' || key === '2') {
        sound.playClick();
        onSelectColor('blue');
      } else if (key === 'g' || key === '3') {
        sound.playClick();
        onSelectColor('green');
      } else if (key === 'y' || key === '4') {
        sound.playClick();
        onSelectColor('yellow');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSelectColor]);

  if (!isOpen) return null;

  const colors: { id: CardColor; labelUz: string; labelEn: string; bg: string; key: string }[] = [
    { id: 'red', labelUz: 'Qizil', labelEn: 'Red', bg: 'bg-gradient-to-br from-red-500 to-rose-700 hover:from-red-400 hover:to-rose-600 border-red-400', key: '1 / R' },
    { id: 'blue', labelUz: "Ko'k", labelEn: 'Blue', bg: 'bg-gradient-to-br from-blue-500 to-sky-700 hover:from-blue-400 hover:to-sky-600 border-blue-400', key: '2 / B' },
    { id: 'green', labelUz: 'Yashil', labelEn: 'Green', bg: 'bg-gradient-to-br from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 border-emerald-400', key: '3 / G' },
    { id: 'yellow', labelUz: 'Sariq', labelEn: 'Yellow', bg: 'bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 border-yellow-300 text-slate-900', key: '4 / Y' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 opacity-20 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-yellow-400 mb-4 shadow-inner">
            <Palette size={32} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            {lang === 'uz' ? 'Rangni tanlang' : 'Choose a Color'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {lang === 'uz' ? 'O\'yin davom etishi uchun qaysi rangni tanlaysiz?' : 'Which color should continue the game?'}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  onSelectColor(c.id);
                }}
                className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 shadow-lg transition-all transform active:scale-95 hover:scale-105 ${c.bg} group cursor-pointer`}
              >
                <span className="font-black text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-white">
                  {lang === 'uz' ? c.labelUz : c.labelEn}
                </span>
                <span className="mt-1 text-[11px] font-mono font-medium opacity-80 text-white/90 bg-black/30 px-2 py-0.5 rounded-full">
                  {c.key}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
