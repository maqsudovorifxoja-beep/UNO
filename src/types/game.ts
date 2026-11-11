export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

export type CardValue =
  | '0' | '1' | '2' | '3' | '4'
  | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw2'
  | 'wild' | 'wild4';

export interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
  scoreValue: number;
}

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  avatar: string; // avatar identifier/preset
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  hand: Card[];
  hasSaidUno: boolean;
  score: number;
}

export type GameMode = 'vs-bot' | 'online' | 'pass-and-play';

export type GameStatus = 'lobby' | 'playing' | 'round-over' | 'game-over';

export type TableTheme = 'classic-casino' | 'neon-arcade' | 'midnight-luxury' | 'crimson-velvet';

export interface HouseRules {
  stacking: boolean;      // Can stack +2 on +2 or +4 on +4
  sevenZero: boolean;     // 7 swaps hand, 0 shifts all hands
  jumpIn: boolean;        // Play exact duplicate card out of turn
  drawToMatch: boolean;   // Keep drawing until playable or single draw
  forcePlay: boolean;     // Must play drawn card if playable
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalCardsPlayed: number;
  wildsPlayed: number;
  unosCalled: number;
  highestWinStreak: number;
  currentStreak: number;
}

export interface GameState {
  id: string;
  mode: GameMode;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1; // 1 = clockwise, -1 = counter-clockwise
  drawPile: Card[];
  discardPile: Card[];
  currentColor: CardColor;
  activeDrawStack: number; // accumulated +2 / +4 to draw
  houseRules: HouseRules;
  winner: Player | null;
  logs: GameLog[];
  turnTimeLeft: number;
  unoChallengePendingPlayerId: string | null; // Player who played penultimate card without UNO
}

export interface GameLog {
  id: string;
  timestamp: number;
  text: string;
  type: 'play' | 'draw' | 'uno' | 'challenge' | 'system' | 'special';
  color?: CardColor;
}

export interface NetworkMessage {
  type: 'SYNC_STATE' | 'PLAY_CARD' | 'DRAW_CARD' | 'CALL_UNO' | 'CHALLENGE_UNO' | 'CHAT_MESSAGE' | 'PLAYER_JOIN';
  payload: any;
  senderId: string;
}

