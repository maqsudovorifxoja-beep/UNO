export interface AvatarPreset {
  id: string;
  nameUz: string;
  nameEn: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  iconName: 'bot' | 'ninja' | 'wizard' | 'king' | 'lion' | 'alien' | 'fox' | 'gem';
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'bot',
    nameUz: 'Kiber Bot',
    nameEn: 'Cyber Bot',
    color: 'text-cyan-300',
    badgeBg: 'from-cyan-950 to-blue-950',
    borderColor: 'border-cyan-500',
    iconName: 'bot',
  },
  {
    id: 'ninja',
    nameUz: 'Soyali Ninja',
    nameEn: 'Shadow Ninja',
    color: 'text-rose-300',
    badgeBg: 'from-rose-950 to-red-950',
    borderColor: 'border-rose-500',
    iconName: 'ninja',
  },
  {
    id: 'wizard',
    nameUz: 'Sehrgar',
    nameEn: 'Wizard',
    color: 'text-purple-300',
    badgeBg: 'from-purple-950 to-indigo-950',
    borderColor: 'border-purple-500',
    iconName: 'wizard',
  },
  {
    id: 'king',
    nameUz: 'Qirol',
    nameEn: 'The King',
    color: 'text-amber-300',
    badgeBg: 'from-amber-950 to-yellow-950',
    borderColor: 'border-amber-500',
    iconName: 'king',
  },
  {
    id: 'lion',
    nameUz: 'Qoplon / Sher',
    nameEn: 'Lionheart',
    color: 'text-orange-300',
    badgeBg: 'from-orange-950 to-amber-950',
    borderColor: 'border-orange-500',
    iconName: 'lion',
  },
  {
    id: 'alien',
    nameUz: 'Kosmik Sayyoh',
    nameEn: 'Alien Pilot',
    color: 'text-emerald-300',
    badgeBg: 'from-emerald-950 to-teal-950',
    borderColor: 'border-emerald-500',
    iconName: 'alien',
  },
  {
    id: 'fox',
    nameUz: 'Ayyor Tulki',
    nameEn: 'Sly Fox',
    color: 'text-yellow-300',
    badgeBg: 'from-yellow-950 to-stone-950',
    borderColor: 'border-yellow-500',
    iconName: 'fox',
  },
  {
    id: 'gem',
    nameUz: 'Brilliant',
    nameEn: 'Diamond VIP',
    color: 'text-sky-300',
    badgeBg: 'from-sky-950 to-slate-950',
    borderColor: 'border-sky-500',
    iconName: 'gem',
  },
];

export function getAvatarById(id: string): AvatarPreset {
  return AVATAR_PRESETS.find((a) => a.id === id) || AVATAR_PRESETS[0];
}
