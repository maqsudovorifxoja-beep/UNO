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

  const colors: {
    id: CardColor;
    labelUz: string;
    labelEn: string;
    bgGradient: string;
    border: string;
    shadow: string;
    key: string;
  }[] = [
    {
      id: 'red',
      labelUz: 'QIZIL',
      labelEn: 'RED',
      bgGradient: 'from-[#ff2d3d] via-[#e51323] to-[#a8000f]',
      border: 'border-red-300',
      shadow: 'shadow-red-500/40 hover:shadow-red-500/70',
      key: '1 / R',
    },
    {
      id: 'blue',
      labelUz: "KO'K",
      labelEn: 'BLUE',
      bgGradient: 'from-[#0094ff] via-[#005fec] to-[#00389b]',
      border: 'border-blue-300',
      shadow: 'shadow-blue-500/40 hover:shadow-blue-500/70',
      key: '2 / B',
    },
    {
      id: 'green',
      labelUz: 'YASHIL',
      labelEn: 'GREEN',
      bgGradient: 'from-[#1ddc62] via-[#0bbd4a] to-[#04772d]',
      border: 'border-emerald-300',
      shadow: 'shadow-emerald-500/40 hover:shadow-emerald-500/70',
      key: '3 / G',
    },
    {
      id: 'yellow',
      labelUz: 'SARIQ',
      labelEn: 'YELLOW',
      bgGradient: 'from-[#ffea00] via-[#ffd000] to-[#d99800]',
      border: 'border-yellow-200',
      shadow: 'shadow-amber-400/50 hover:shadow-amber-400/80',
      key: '4 / Y',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border-2 border-yellow-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center">
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 opacity-25 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border-2 border-yellow-400 text-yellow-300 mb-3 shadow-xl">
            <Palette size={30} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
            {lang === 'uz' ? 'Yangi Rangni Tanlang' : 'Choose Next Color'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-5">
            {lang === 'uz'
              ? "O'yin qaysi rang bilan davom etsin?"
              : 'Which color should the next card match?'}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  onSelectColor(c.id);
                }}
                className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 shadow-xl transition-all transform active:scale-95 hover:scale-105 bg-gradient-to-br ${c.bgGradient} ${c.border} ${c.shadow} cursor-pointer group`}
              >
                <span className="font-black text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white tracking-wider">
                  {lang === 'uz' ? c.labelUz : c.labelEn}
                </span>
                <span className="mt-1 text-[10px] font-mono font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
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
