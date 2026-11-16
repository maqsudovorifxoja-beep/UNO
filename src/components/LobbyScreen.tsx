import React, { useState } from 'react';
import type { BotDifficulty, GameMode, GameStats } from '../types/game';
import { sound } from '../utils/sound';
import { AVATAR_PRESETS } from '../utils/avatars';
import { AvatarIcon } from './AvatarIcon';
import {
  Bot,
  Wifi,
  Users,
  Play,
  Settings,
  Trophy,
  Copy,
  Check,
  User,
  Shield,
  Zap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface LobbyScreenProps {
  onStartVsBot: (playerCount: number, botDifficulty: BotDifficulty, playerName: string, avatarId: string) => void;
  onCreateOnlineRoom: (roomCode: string, playerName: string, avatarId: string) => void;
  onJoinOnlineRoom: (roomCode: string, playerName: string, avatarId: string) => void;
  onStartPassAndPlay: (playerCount: number, playerNames: string[]) => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  stats: GameStats;
  lang?: 'uz' | 'en';
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartVsBot,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
  onStartPassAndPlay,
  onOpenRules,
  onOpenSettings,
  stats,
  lang = 'uz',
}) => {
  const [activeTab, setActiveTab] = useState<GameMode>('vs-bot');
  const [playerName, setPlayerName] = useState('O\'yinchi 1');
  const [selectedAvatarId, setSelectedAvatarId] = useState('ninja');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');

  // Online Room State
  const [roomCodeToJoin, setRoomCodeToJoin] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('room') || '';
    } catch {
      return '';
    }
  });
  const [customRoomCode] = useState(() => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  });
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setActiveTab('online');
        setRoomCodeToJoin(roomParam.toUpperCase());
      }
    } catch {
      // ignore
    }
  }, []);

  // Pass and play names
  const [passNames, setPassNames] = useState<string[]>([
    '1-O\'yinchi',
    '2-O\'yinchi',
    '3-O\'yinchi',
    '4-O\'yinchi',
  ]);

  const copyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(customRoomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-6 bg-gradient-to-b from-[#070a13] via-[#0b0f1d] to-[#04060b] select-none text-slate-100">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-2xl shadow-xl shadow-red-950/60 border-2 border-yellow-300/60 flex items-center gap-2">
            <span className="font-black italic text-yellow-300 text-xl sm:text-2xl tracking-tighter drop-shadow-md font-mono">
              UNO
            </span>
            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest bg-yellow-400 px-1.5 py-0.5 rounded-md">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Rules / How to play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer shadow-lg"
          >
            <BookOpen size={16} className="text-yellow-400" />
            <span>{lang === 'uz' ? 'Qoidalar' : 'Rules'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Sozlamalar"
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer shadow-lg"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="w-full max-w-xl flex flex-col items-center my-auto py-3">
        {/* Visual 3D Hero Cards Badge */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute -inset-6 bg-gradient-to-r from-red-600 via-yellow-400 via-green-500 to-blue-600 rounded-full opacity-25 blur-2xl animate-pulse pointer-events-none" />
          <div className="relative flex items-center -space-x-5 sm:-space-x-6">
            <div className="w-16 h-24 sm:w-20 sm:h-29 rounded-2xl bg-gradient-to-br from-[#ff2d3d] to-[#a8000f] p-1 border-2 border-white/80 shadow-2xl -rotate-14 transform hover:-translate-y-2 transition flex flex-col justify-between">
              <span className="font-mono font-black italic text-white text-xs pl-1">UNO</span>
              <span className="font-mono font-black italic text-white text-2xl sm:text-3xl self-center">7</span>
              <span className="font-mono font-black italic text-white text-xs pr-1 self-end rotate-180">UNO</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-29 rounded-2xl bg-gradient-to-br from-[#0094ff] to-[#00389b] p-1 border-2 border-white/80 shadow-2xl -rotate-4 transform hover:-translate-y-2 transition z-10 flex flex-col justify-between">
              <span className="font-mono font-black text-white text-xs pl-1">+2</span>
              <span className="font-mono font-black text-white text-2xl sm:text-3xl self-center">+2</span>
              <span className="font-mono font-black text-white text-xs pr-1 self-end rotate-180">+2</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-29 rounded-2xl bg-gradient-to-br from-[#ffd000] to-[#b87c00] p-1 border-2 border-white/80 shadow-2xl rotate-6 transform hover:-translate-y-2 transition z-20 flex flex-col justify-between">
              <span className="font-mono font-black text-slate-900 text-xs pl-1">0</span>
              <span className="font-mono font-black text-slate-900 text-2xl sm:text-3xl self-center">0</span>
              <span className="font-mono font-black text-slate-900 text-xs pr-1 self-end rotate-180">0</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-29 rounded-2xl bg-gradient-to-br from-[#1ddc62] to-[#04772d] p-1 border-2 border-white/80 shadow-2xl rotate-16 transform hover:-translate-y-2 transition z-10 flex flex-col justify-between">
              <Sparkles size={16} className="text-white pl-0.5" />
              <Zap size={28} className="text-white self-center animate-pulse" />
              <Sparkles size={16} className="text-white pr-0.5 self-end rotate-180" />
            </div>
          </div>
        </div>

        {/* Player Profile & Avatar Selector Box */}
        <div className="w-full bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl mb-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            {/* Avatar preview */}
            <div className="relative group cursor-pointer">
              <AvatarIcon avatarId={selectedAvatarId} size={28} className="shadow-xl" />
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 p-1 rounded-full shadow">
                <Sparkles size={12} />
              </div>
            </div>

            {/* Name input */}
            <div className="flex-1 w-full text-left">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'uz' ? 'Ismingizni kiriting:' : 'Enter your player name:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl font-bold text-white shadow-inner focus:outline-none transition"
                  placeholder={lang === 'uz' ? 'Ismingiz' : 'Your name'}
                />
              </div>
            </div>
          </div>

          {/* Avatar Picker Row */}
          <div className="mt-3.5 pt-3 border-t border-slate-800">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
              {lang === 'uz' ? 'Qahramoningizni tanlang:' : 'Choose your avatar:'}
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_PRESETS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatarId(av.id);
                  }}
                  className={`flex flex-col items-center p-1.5 rounded-xl border transition cursor-pointer ${
                    selectedAvatarId === av.id
                      ? 'border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400/50 scale-105'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800'
                  }`}
                  title={lang === 'uz' ? av.nameUz : av.nameEn}
                >
                  <AvatarIcon avatarId={av.id} size={15} showBadge={false} />
                  <span className="text-[9px] font-bold mt-1 text-slate-300 truncate w-full text-center">
                    {lang === 'uz' ? av.nameUz.split(' ')[0] : av.nameEn.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="w-full grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-4 shadow-xl">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('vs-bot');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              activeTab === 'vs-bot'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot size={17} />
            <span>{lang === 'uz' ? 'Vs Bot' : 'Vs AI Bots'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('online');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              activeTab === 'online'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wifi size={17} />
            <span>{lang === 'uz' ? 'Onlayn Xona' : 'Online Room'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('pass-and-play');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              activeTab === 'pass-and-play'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={17} />
            <span>{lang === 'uz' ? 'Pass & Play' : 'Pass & Play'}</span>
          </button>
        </div>

        {/* TAB 1: VS BOT MODE */}
        {activeTab === 'vs-bot' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn">
            {/* Player Count */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 text-left">
                {lang === 'uz' ? "O'yinchilar soni (Siz + Botlar):" : 'Number of Players:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      sound.playClick();
                      setPlayerCount(count);
                    }}
                    className={`py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black transition cursor-pointer ${
                      playerCount === count
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 ring-2 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {count} {lang === 'uz' ? "O'yinchi" : 'Players'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bot Difficulty */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 text-left">
                {lang === 'uz' ? 'Bot Aqli (Qiyinlik darajasi):' : 'Bot AI Level:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'easy', labelUz: 'Oson', labelEn: 'Easy' },
                    { id: 'medium', labelUz: "O'rtacha", labelEn: 'Tactician' },
                    { id: 'hard', labelUz: 'Qiyin (Usta)', labelEn: 'Master' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      sound.playClick();
                      setBotDifficulty(d.id);
                    }}
                    className={`py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black transition cursor-pointer ${
                      botDifficulty === d.id
                        ? 'border-yellow-400 bg-yellow-950/50 text-yellow-300 ring-2 ring-yellow-400/40'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'uz' ? d.labelUz : d.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Game Button */}
            <button
              onClick={() => {
                sound.playClick();
                onStartVsBot(playerCount, botDifficulty, playerName || 'O\'yinchi', selectedAvatarId);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-2xl shadow-red-950/80 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer border border-yellow-300/40"
            >
              <Play size={22} fill="currentColor" />
              <span>{lang === 'uz' ? 'O\'YINNI BOSHLASH' : 'START GAME'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: ONLINE MULTIPLAYER */}
        {activeTab === 'online' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn">
            {/* Create Room */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-left">
                <Wifi size={14} />
                {lang === 'uz' ? 'Yangi Onlayn Xona Yaratish' : 'Create an Online Room'}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono font-black text-center text-emerald-400 text-lg tracking-widest">
                  {customRoomCode}
                </div>
                <button
                  onClick={copyCode}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center gap-1 text-xs font-bold cursor-pointer active:scale-95"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{isCopied ? (lang === 'uz' ? 'Nusxalandi' : 'Copied') : (lang === 'uz' ? 'Nusxa' : 'Copy')}</span>
                </button>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onCreateOnlineRoom(customRoomCode, playerName || 'Host', selectedAvatarId);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition active:scale-98 cursor-pointer"
              >
                {lang === 'uz' ? 'Xonani ochish' : 'Open Room'}
              </button>
            </div>

            {/* Join Room */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-left">
                <Zap size={14} />
                {lang === 'uz' ? 'Do\'stning Xonasiga Kirish' : 'Join Friend\'s Room'}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={lang === 'uz' ? '4-xonalik kod (masalan: 8421)' : 'Room code'}
                  value={roomCodeToJoin}
                  onChange={(e) => setRoomCodeToJoin(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 font-mono font-bold text-center text-white placeholder:text-slate-600 text-base uppercase focus:outline-none"
                />
              </div>
              <button
                disabled={!roomCodeToJoin.trim()}
                onClick={() => {
                  sound.playClick();
                  onJoinOnlineRoom(roomCodeToJoin.trim(), playerName || 'O\'yinchi 2', selectedAvatarId);
                }}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow transition active:scale-98 ${
                  roomCodeToJoin.trim()
                    ? 'bg-cyan-600 hover:bg-cyan-500 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {lang === 'uz' ? 'Ulanish' : 'Join'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PASS & PLAY */}
        {activeTab === 'pass-and-play' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 text-left">
                {lang === 'uz' ? "O'yinchilar soni (Bitta telefonda):" : 'Number of Players (One Device):'}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      sound.playClick();
                      setPlayerCount(count);
                    }}
                    className={`py-2 rounded-xl border-2 text-sm font-bold transition cursor-pointer ${
                      playerCount === count
                        ? 'border-purple-400 bg-purple-950/60 text-purple-300 ring-2 ring-purple-400/40'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {count} {lang === 'uz' ? "O'yinchi" : 'Players'}
                  </button>
                ))}
              </div>

              {/* Names Input */}
              <div className="space-y-2">
                {Array.from({ length: playerCount }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 w-5">{i + 1}.</span>
                    <input
                      type="text"
                      maxLength={14}
                      value={passNames[i] || `O'yinchi ${i + 1}`}
                      onChange={(e) => {
                        const updated = [...passNames];
                        updated[i] = e.target.value;
                        setPassNames(updated);
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onStartPassAndPlay(playerCount, passNames.slice(0, playerCount));
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Play size={20} fill="currentColor" />
              <span>{lang === 'uz' ? 'PASS & PLAY NI BOSHLASH' : 'START PASS & PLAY'}</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer / Statistics Ribbon */}
      <footer className="w-full max-w-4xl py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-400" />
            <span>
              {lang === 'uz' ? "O'yinlar:" : 'Games:'} <strong className="text-white font-mono">{stats.gamesPlayed}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-400" />
            <span>
              {lang === 'uz' ? "G'alabalar:" : 'Wins:'} <strong className="text-white font-mono">{stats.gamesWon}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-cyan-400" />
            <span>
              {lang === 'uz' ? 'G\'alaba ulushi:' : 'Winrate:'}{' '}
              <strong className="text-white font-mono">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
              </strong>
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          UNO PRO &bull; Telefon va Kompyuter uchun to'liq moslashgan
        </div>
      </footer>
    </div>
  );
};
