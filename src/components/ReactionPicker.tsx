import { useState } from 'react';
import { sound } from '../utils/sound';
import { Smile, X } from 'lucide-react';

interface ReactionPickerProps {
  onSendReaction: (reaction: string) => void;
  lang?: 'uz' | 'en';
}

const REACTIONS = [
  { id: 'fire', text: '🔥 UNO!', labelUz: 'Olov' },
  { id: 'cool', text: '😎 Zo\'r!', labelUz: 'Kruoy' },
  { id: 'shock', text: '😱 Voybo\'!', labelUz: 'Xayrat' },
  { id: 'laugh', text: '😂 Haha!', labelUz: 'Kulgi' },
  { id: 'think', text: '🤔 O\'ylayapman...', labelUz: 'Fikr' },
  { id: 'angry', text: '😤 Qarab tur!', labelUz: 'Jahldor' },
  { id: 'gg', text: '🤝 Yaxshi o\'yin!', labelUz: 'GG' },
  { id: 'bye', text: '👋 Xayr!', labelUz: 'Salom' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSendReaction,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (text: string) => {
    sound.playClick();
    onSendReaction(text);
    setIsOpen(false);
  };

  return (
    <div className="relative z-30">
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        aria-label="Reaktsiyalar"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-yellow-300 hover:text-yellow-200 border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shadow"
      >
        <Smile size={18} />
      </button>

      {isOpen && (
        <div className="absolute bottom-11 left-0 sm:left-auto sm:right-0 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md w-56 grid grid-cols-2 gap-1.5 animate-fadeIn">
          <div className="col-span-2 flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400">
            <span>Reaktsiyalar</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
          {REACTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r.text)}
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white text-left truncate transition cursor-pointer active:scale-95"
            >
              {r.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

