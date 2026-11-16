import React, { useState } from 'react';
import { sound } from '../utils/sound';
import { AvatarIcon } from './AvatarIcon';
import { Wifi, Copy, Check, Play, X, Share2, Loader2 } from 'lucide-react';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  isHost: boolean;
  roomCode: string;
  hostName: string;
  hostAvatar: string;
  guestName?: string | null;
  guestAvatar?: string | null;
  isConnecting: boolean;
  errorMessage?: string | null;
  onStartGame: () => void;
  onCancel: () => void;
  lang?: 'uz' | 'en';
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  isHost,
  roomCode,
  hostName,
  hostAvatar,
  guestName,
  guestAvatar,
  isConnecting,
  errorMessage,
  onStartGame,
  onCancel,
  lang = 'uz',
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    sound.playClick();
    const shareUrl = `${window.location.origin}?room=${roomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl text-center overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          aria-label="Yopish"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition hover:bg-slate-700 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-500 text-emerald-400 mb-3 shadow-lg">
            <Wifi size={30} className={isConnecting ? 'animate-pulse' : ''} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            {isHost
              ? lang === 'uz'
                ? 'Onlayn Xona Kutish Zali'
                : 'Online Room Waiting Lobby'
              : lang === 'uz'
              ? 'Xonaga Ulanish'
              : 'Connecting to Room'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-5">
            {isHost
              ? lang === 'uz'
                ? 'Ushbu kodni do\'stingizga yuboring va ulanishini kuting:'
                : 'Share this code with your friend to connect:'
              : lang === 'uz'
              ? 'Host o\'yinni boshlashini kuting...'
              : 'Waiting for the host to launch the game...'}
          </p>

          {/* Room Code Display Box */}
          <div className="bg-slate-950/90 border-2 border-emerald-500/80 rounded-2xl p-3.5 mb-5 shadow-inner">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {lang === 'uz' ? 'XONA KODI' : 'ROOM CODE'}
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 tracking-widest">
              {roomCode}
            </span>

            {/* Copy & Share Buttons */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? (lang === 'uz' ? 'Nusxalandi!' : 'Copied!') : (lang === 'uz' ? 'Kodni Nusxalash' : 'Copy Code')}</span>
              </button>

              <button
                onClick={handleShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                <span>{copiedLink ? (lang === 'uz' ? 'Havola Nusxalandi!' : 'Link Copied!') : (lang === 'uz' ? 'Havola' : 'Share Link')}</span>
              </button>
            </div>
          </div>

          {/* Players in Room */}
          <div className="space-y-2.5 mb-6">
            {/* Host Box */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3">
                <AvatarIcon avatarId={hostAvatar} size={18} />
                <div className="text-left">
                  <div className="text-sm font-black text-white">{hostName}</div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {lang === 'uz' ? 'Xona Egasi (Host)' : 'Host'}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-600/60">
                {lang === 'uz' ? 'Tayyor' : 'Ready'}
              </span>
            </div>

            {/* Guest Box */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              {guestName ? (
                <>
                  <div className="flex items-center gap-3">
                    <AvatarIcon avatarId={guestAvatar || 'alien'} size={18} />
                    <div className="text-left">
                      <div className="text-sm font-black text-white">{guestName}</div>
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {lang === 'uz' ? '2-O\'yinchi' : 'Player 2'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-bold text-[10px] border border-cyan-600/60">
                    {lang === 'uz' ? 'Ulandi ✅' : 'Connected'}
                  </span>
                </>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-1 text-slate-400 text-xs font-semibold">
                  <Loader2 size={16} className="animate-spin text-yellow-400" />
                  <span>
                    {isConnecting
                      ? lang === 'uz'
                        ? 'Xona serveriga ulanmoqda...'
                        : 'Connecting to room...'
                      : lang === 'uz'
                      ? 'Do\'st ulanishi kutilmoqda...'
                      : 'Waiting for friend to join...'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold mb-4">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {isHost && (
              <button
                disabled={!guestName}
                onClick={() => {
                  sound.playClick();
                  onStartGame();
                }}
                className={`w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl transition active:scale-98 ${
                  guestName
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white cursor-pointer shadow-emerald-950/80'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Play size={20} fill="currentColor" />
                <span>
                  {guestName
                    ? lang === 'uz'
                      ? 'O\'YINNI BOSHLASH'
                      : 'START GAME'
                    : lang === 'uz'
                    ? '2-O\'YINCHI KUTILMOQDA...'
                    : 'WAITING FOR PLAYER 2...'}
                </span>
              </button>
            )}

            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              {lang === 'uz' ? 'Bekor Qilish' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
