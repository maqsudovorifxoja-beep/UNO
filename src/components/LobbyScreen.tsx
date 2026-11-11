import React, { useState } from 'react';
import type { BotDifficulty, GameMode, GameStats } from '../types/game';
import { sound } from '../utils/sound';
import {
  Bot,
  Wifi,
  Users,
  Play,
  HelpCircle,
  Settings,
  Trophy,
  Copy,
  Check,
  User,
  Shield,
  Zap,
} from 'lucide-react';

interface LobbyScreenProps {
  onStartVsBot: (playerCount: number, botDifficulty: BotDifficulty, playerName: string) => void;
  onCreateOnlineRoom: (roomCode: string, playerName: string) => void;
  onJoinOnlineRoom: (roomCode: string, playerName: string) => void;
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
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');

  // Online Room State
  const [roomCodeToJoin, setRoomCodeToJoin] = useState('');
  const [customRoomCode] = useState(() => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  });
  const [isCopied, setIsCopied] = useState(false);

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
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b0f19] select-none text-slate-200">
      {/* Top Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-2xl shadow-xl shadow-red-950/60 border border-yellow-300/40 flex items-center gap-1.5">
            <span className="font-black italic text-yellow-300 text-xl sm:text-2xl tracking-tighter drop-shadow font-mono">
              UNO
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow"
          >
            <HelpCircle size={16} />
            <span>{lang === 'uz' ? 'Qoidalar' : 'Rules'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer shadow"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex flex-col items-center my-auto py-4">
        {/* Animated Hero Card Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-3xl opacity-20 blur-xl animate-pulse" />
          <div className="relative flex items-center -space-x-4 sm:-space-x-6">
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 p-1 border-2 border-red-300 shadow-xl -rotate-12 transform hover:-translate-y-2 transition flex items-center justify-center">
              <span className="font-mono font-black italic text-yellow-300 text-lg sm:text-xl">UNO</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-gradient-to-br from-blue-600 to-sky-700 p-1 border-2 border-blue-300 shadow-xl -rotate-3 transform hover:-translate-y-2 transition z-10 flex items-center justify-center">
              <span className="font-mono font-black text-white text-2xl sm:text-3xl">+2</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-1 border-2 border-yellow-200 shadow-xl rotate-6 transform hover:-translate-y-2 transition z-20 flex items-center justify-center">
              <span className="font-mono font-black text-slate-900 text-2xl sm:text-3xl">7</span>
            </div>
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-1 border-2 border-green-300 shadow-xl rotate-16 transform hover:-translate-y-2 transition z-10 flex items-center justify-center">
              <Zap size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Player Name Input */}
        <div className="w-full mb-4 px-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
            {lang === 'uz' ? 'O\'yinchi Ismi:' : 'Player Name:'}
          </label>
          <div className="relative max-w-xs mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={16} />
            </div>
            <input
              type="text"
              value={playerName}
              maxLength={15}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-yellow-400 rounded-2xl text-center font-bold text-white shadow-inner focus:outline-none transition"
              placeholder={lang === 'uz' ? 'Ismingizni yozing' : 'Enter your name'}
            />
          </div>
        </div>

        {/* Game Mode Tab Bar */}
        <div className="w-full grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl mb-5 shadow-lg">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('vs-bot');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'vs-bot'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot size={16} />
            <span>{lang === 'uz' ? 'Vs Bot' : 'Vs Bots'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('online');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'online'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wifi size={16} />
            <span>{lang === 'uz' ? 'Onlayn Xona' : 'Online P2P'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('pass-and-play');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'pass-and-play'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users size={16} />
            <span>{lang === 'uz' ? 'Pass & Play' : 'Pass & Play'}</span>
          </button>
        </div>

        {/* Tab 1: Vs Bot Mode */}
        {activeTab === 'vs-bot' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
            {/* Player Count */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'uz' ? "O'yinchilar soni (Siz + Botlar)" : 'Players Count'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      sound.playClick();
                      setPlayerCount(count);
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                      playerCount === count
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {count} {lang === 'uz' ? "O'yinchi" : 'Players'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bot Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'uz' ? 'Bot Darajasi (Aqllilik darajasi)' : 'Bot Difficulty'}
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
                    className={`py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                      botDifficulty === d.id
                        ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300 ring-1 ring-yellow-400'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'uz' ? d.labelUz : d.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                sound.playClick();
                onStartVsBot(playerCount, botDifficulty, playerName || 'O\'yinchi');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Play size={20} fill="currentColor" />
              <span>{lang === 'uz' ? 'O\'YINNI BOSHLASH' : 'START GAME'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Online P2P Mode */}
        {activeTab === 'online' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
            {/* Create Room Box */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wifi size={14} className="text-emerald-400" />
                {lang === 'uz' ? 'Yangi Onlayn Xona Ochish' : 'Create an Online Room'}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-black text-center text-emerald-400 text-lg tracking-widest">
                  {customRoomCode}
                </div>
                <button
                  onClick={copyCode}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center gap-1 text-xs font-semibold cursor-pointer active:scale-95"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{isCopied ? (lang === 'uz' ? 'Nusxalandi' : 'Copied') : (lang === 'uz' ? 'Nusxa' : 'Copy')}</span>
                </button>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onCreateOnlineRoom(customRoomCode, playerName || 'Host');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition active:scale-98 cursor-pointer"
              >
                {lang === 'uz' ? 'Xonani yaratish va kutish' : 'Create & Host Room'}
              </button>
            </div>

            {/* Join Room Box */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap size={14} className="text-cyan-400" />
                {lang === 'uz' ? 'Mavjud Xonaga Ulanish' : 'Join Existing Room'}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={lang === 'uz' ? '4-xonalik kod (masalan: 8421)' : 'Room code'}
                  value={roomCodeToJoin}
                  onChange={(e) => setRoomCodeToJoin(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 font-mono font-bold text-center text-white placeholder:text-slate-600 text-base uppercase focus:outline-none"
                />
              </div>
              <button
                disabled={!roomCodeToJoin.trim()}
                onClick={() => {
                  sound.playClick();
                  onJoinOnlineRoom(roomCodeToJoin.trim(), playerName || 'O\'yinchi 2');
                }}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow transition active:scale-98 ${
                  roomCodeToJoin.trim()
                    ? 'bg-cyan-600 hover:bg-cyan-500 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {lang === 'uz' ? 'Xonaga kirish' : 'Join Room'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Pass & Play Mode */}
        {activeTab === 'pass-and-play' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'uz' ? "O'yinchilar soni (Bitta qurilmada)" : 'Number of Players (One Device)'}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      sound.playClick();
                      setPlayerCount(count);
                    }}
                    className={`py-2 rounded-xl border text-sm font-bold transition cursor-pointer ${
                      playerCount === count
                        ? 'border-purple-400 bg-purple-950/60 text-purple-300 ring-1 ring-purple-400'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
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

      {/* Footer / Stats Ribbon */}
      <footer className="w-full max-w-4xl py-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
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
