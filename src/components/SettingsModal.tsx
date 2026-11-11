import React from 'react';
import type { HouseRules, TableTheme } from '../types/game';
import { sound } from '../utils/sound';
import { X, Volume2, ShieldCheck, Palette, Languages } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: TableTheme;
  onChangeTheme: (theme: TableTheme) => void;
  houseRules: HouseRules;
  onChangeHouseRules: (rules: HouseRules) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: 'uz' | 'en';
  onChangeLang: (lang: 'uz' | 'en') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onChangeTheme,
  houseRules,
  onChangeHouseRules,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  lang,
  onChangeLang,
}) => {
  if (!isOpen) return null;

  const toggleRule = (key: keyof HouseRules) => {
    sound.playClick();
    onChangeHouseRules({
      ...houseRules,
      [key]: !houseRules[key],
    });
  };

  const themes: { id: TableTheme; nameUz: string; nameEn: string; color: string }[] = [
    { id: 'classic-casino', nameUz: 'Klassik Kazino (Yashil)', nameEn: 'Classic Casino', color: 'bg-emerald-700' },
    { id: 'neon-arcade', nameUz: 'Neon Kiber (Binafsha)', nameEn: 'Neon Arcade', color: 'bg-purple-700' },
    { id: 'midnight-luxury', nameUz: 'Midnight Qora/Oltin', nameEn: 'Midnight Luxury', color: 'bg-slate-900 border-amber-500' },
    { id: 'crimson-velvet', nameUz: 'Qizil Baxmal', nameEn: 'Crimson Velvet', color: 'bg-rose-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-white">
            <Palette className="text-yellow-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-black">
              {lang === 'uz' ? "O'yin Sozlamalari" : 'Game Settings'}
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

        <div className="space-y-6">
          {/* Table Theme Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              {lang === 'uz' ? 'Stol ko\'rinishi (Mavzu)' : 'Table Theme'}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    onChangeTheme(t.id);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                    theme === t.id
                      ? 'border-yellow-400 bg-slate-800 text-yellow-300 ring-1 ring-yellow-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border ${t.color}`} />
                  <span className="truncate">{lang === 'uz' ? t.nameUz : t.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Volume */}
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <Volume2 size={18} className="text-emerald-400" />
                {lang === 'uz' ? 'Ovoz balandligi' : 'Sound Volume'}
              </span>
              <button
                onClick={onToggleMute}
                className="text-xs text-yellow-400 hover:underline cursor-pointer"
              >
                {isMuted
                  ? lang === 'uz'
                    ? 'Ovozni yoqish'
                    : 'Unmute'
                  : lang === 'uz'
                  ? "Ovozni o'chirish"
                  : 'Mute'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                onChangeVolume(parseFloat(e.target.value));
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
              <Languages size={18} className="text-cyan-400" />
              {lang === 'uz' ? 'Til (Language)' : 'Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onChangeLang('uz');
                }}
                className={`py-2 px-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                  lang === 'uz'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                O'zbekcha
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onChangeLang('en');
                }}
                className={`py-2 px-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                  lang === 'en'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* House Rules Toggles */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
              <ShieldCheck size={18} className="text-amber-400" />
              {lang === 'uz' ? 'Maxsus O\'yin Qoidalari (House Rules)' : 'House Rules'}
            </label>
            <div className="space-y-2.5">
              {/* Stacking Rule */}
              <div
                onClick={() => toggleRule('stacking')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-800 cursor-pointer transition"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {lang === 'uz' ? 'Stacking (+2 ustiga +2, +4 ustiga +4)' : 'Card Stacking (+2 on +2, +4 on +4)'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? 'Raqib tashlagan jarima kartasini boshqa raqibga uzatish'
                      : 'Pass penalty cards to the next player'}
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    houseRules.stacking ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* 7-0 Rule */}
              <div
                onClick={() => toggleRule('sevenZero')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-800 cursor-pointer transition"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {lang === 'uz' ? '7-0 Qoidasi' : '7-0 Rule'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? '7 raqami qo\'lni almashtiradi, 0 raqami barcha qo\'llarni aylantiradi'
                      : '7 swaps hands with a player, 0 rotates everyone hands'}
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    houseRules.sevenZero ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* Jump-In Rule */}
              <div
                onClick={() => toggleRule('jumpIn')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-800 cursor-pointer transition"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {lang === 'uz' ? 'Jump-In (Navbatsiz tashlash)' : 'Jump-In Rule'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? 'Bir xil rang va qiymatli karta bo\'lsa navbatsiz tashlash'
                      : 'Play identical card out of turn immediately'}
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    houseRules.jumpIn ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* Draw To Match */}
              <div
                onClick={() => toggleRule('drawToMatch')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-800 cursor-pointer transition"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {lang === 'uz' ? 'Tushguncha olish (Draw to match)' : 'Draw until match'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {lang === 'uz'
                      ? 'Mos karta chiqmaguncha kolodadan karta olish'
                      : 'Keep drawing cards until a playable card is found'}
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    houseRules.drawToMatch ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-base shadow-lg hover:from-red-500 hover:to-amber-500 transition active:scale-98 cursor-pointer"
          >
            {lang === 'uz' ? 'Saqlash va qaytish' : 'Save and Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
