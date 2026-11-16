import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Card,
  CardColor,
  GameMode,
  GameState,
  GameStats,
  HouseRules,
  Player,
  TableTheme,
  BotDifficulty,
  NetworkMessage,
} from './types/game';
import { generateDeck, canPlayCard, getNextPlayerIndex, calculateRoundScore, shuffle } from './utils/unoEngine';
import { decideBotMove } from './utils/botAi';
import { sound } from './utils/sound';
import { P2PManager } from './utils/p2p';

// Components
import { LobbyScreen } from './components/LobbyScreen';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { PlayerHand } from './components/PlayerHand';
import { OpponentHand } from './components/OpponentHand';
import { UnoButton } from './components/UnoButton';
import { ColorPickerModal } from './components/ColorPickerModal';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { GameOverModal } from './components/GameOverModal';
import { PassCurtainModal } from './components/PassCurtainModal';
import { HandSwapModal } from './components/HandSwapModal';
import { ReactionPicker } from './components/ReactionPicker';
import { ActionBanner, type ActionNotice } from './components/ActionBanner';
import { OnlineLobbyModal } from './components/OnlineLobbyModal';

const DEFAULT_HOUSE_RULES: HouseRules = {
  stacking: true,
  sevenZero: true,
  jumpIn: false,
  drawToMatch: false,
  forcePlay: false,
};

const BOT_CONFIGS = [
  { name: 'Kiber Bot', avatar: 'bot' },
  { name: 'Ayyor Tulki', avatar: 'fox' },
  { name: 'Sehrgar Master', avatar: 'wizard' },
];

const BOT_REACTIONS_ATTACKED = ['😱 Voybo\'!', '😡 Qarab tur!', '🤖 Tizim xatosi!', '💥 Ouch!'];
const BOT_REACTIONS_VICTORY = ['🔥 UNO!', '😎 Oson bo\'ldi!', '🚀 G\'alaba yaqin!', '✨ Genial!'];

export function App() {
  // Navigation & Screen status
  const [inGame, setInGame] = useState(false);
  const [lang, setLang] = useState<'uz' | 'en'>('uz');
  const [theme, setTheme] = useState<TableTheme>('classic-casino');
  const [houseRules, setHouseRules] = useState<HouseRules>(DEFAULT_HOUSE_RULES);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [volume, setVolume] = useState(() => sound.getVolume());

  // Reactions & Action Banner
  const [reactions, setReactions] = useState<Record<string, string | null>>({});
  const [currentNotice, setCurrentNotice] = useState<ActionNotice | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isPassCurtainOpen, setIsPassCurtainOpen] = useState(false);
  const [isHandSwapOpen, setIsHandSwapOpen] = useState(false);
  const [pendingCardToPlay, setPendingCardToPlay] = useState<Card | null>(null);

  // Online Multiplayer State
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [onlineIsHost, setOnlineIsHost] = useState(false);
  const [onlineRoomCode, setOnlineRoomCode] = useState('');
  const [onlineHostName, setOnlineHostName] = useState('Host');
  const [onlineHostAvatar, setOnlineHostAvatar] = useState('ninja');
  const [onlineGuestName, setOnlineGuestName] = useState<string | null>(null);
  const [onlineGuestAvatar, setOnlineGuestAvatar] = useState<string | null>(null);
  const [onlineIsConnecting, setOnlineIsConnecting] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('uno_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalCardsPlayed: 0,
      wildsPlayed: 0,
      unosCalled: 0,
      highestWinStreak: 0,
      currentStreak: 0,
    };
  });

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>({
    id: '',
    mode: 'vs-bot',
    status: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    direction: 1,
    drawPile: [],
    discardPile: [],
    currentColor: 'red',
    activeDrawStack: 0,
    houseRules: DEFAULT_HOUSE_RULES,
    winner: null,
    logs: [],
    turnTimeLeft: 30,
    unoChallengePendingPlayerId: null,
  });

  // P2P Multiplayer manager reference
  const p2pRef = useRef<P2PManager | null>(null);

  // Show prominent action notice banner
  const triggerActionNotice = useCallback((notice: ActionNotice) => {
    setCurrentNotice(notice);
    setTimeout(() => {
      setCurrentNotice((prev) => (prev?.id === notice.id ? null : prev));
    }, 2800);
  }, []);

  // Trigger Reaction helper
  const triggerReaction = useCallback((playerId: string, reactionText: string) => {
    setReactions((prev) => ({ ...prev, [playerId]: reactionText }));
    setTimeout(() => {
      setReactions((prev) => ({ ...prev, [playerId]: null }));
    }, 3000);
  }, []);

  // Persist stats
  const updateStats = useCallback((won: boolean) => {
    setStats((prev) => {
      const updated: GameStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: won ? prev.currentStreak + 1 : 0,
        highestWinStreak: won
          ? Math.max(prev.highestWinStreak, prev.currentStreak + 1)
          : prev.highestWinStreak,
      };
      try {
        localStorage.setItem('uno_stats', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  /**
   * Initialize a new match
   */
  const startNewGame = useCallback(
    (
      mode: GameMode,
      playerCount: number,
      botDifficulty: BotDifficulty = 'medium',
      customNames: string[] = [],
      humanAvatarId: string = 'ninja',
      guestAvatarId: string = 'alien'
    ): GameState => {
      const deck = generateDeck();
      const players: Player[] = [];

      for (let i = 0; i < playerCount; i++) {
        const isBot = mode === 'vs-bot' ? i > 0 : false;
        const botConfig = isBot ? BOT_CONFIGS[(i - 1) % BOT_CONFIGS.length] : null;
        const name = customNames[i] || (isBot ? botConfig?.name || `Bot ${i}` : `O'yinchi ${i + 1}`);
        const avatar = isBot
          ? botConfig?.avatar || 'bot'
          : i === 0
          ? humanAvatarId
          : guestAvatarId;

        players.push({
          id: `player-${i}`,
          name,
          avatar,
          isBot,
          botDifficulty: isBot ? botDifficulty : undefined,
          hand: deck.splice(0, 7),
          hasSaidUno: false,
          score: 0,
        });
      }

      // Draw initial top card
      let topCardIndex = deck.findIndex((c) => c.value !== 'wild4' && c.color !== 'wild');
      if (topCardIndex === -1) topCardIndex = 0;
      const initialTopCard = deck.splice(topCardIndex, 1)[0];

      const newGameState: GameState = {
        id: `game-${Date.now()}`,
        mode,
        status: 'playing',
        players,
        currentPlayerIndex: 0,
        direction: 1,
        drawPile: deck,
        discardPile: [initialTopCard],
        currentColor: initialTopCard.color === 'wild' ? 'red' : initialTopCard.color,
        activeDrawStack: 0,
        houseRules,
        winner: null,
        logs: [
          {
            id: 'start',
            timestamp: Date.now(),
            text:
              lang === 'uz'
                ? `O'yin boshlandi! Birinchi karta: ${initialTopCard.color} ${initialTopCard.value}`
                : `Game started! First card: ${initialTopCard.color} ${initialTopCard.value}`,
            type: 'system',
          },
        ],
        turnTimeLeft: 30,
        unoChallengePendingPlayerId: null,
      };

      setGameState(newGameState);
      setInGame(true);
      setIsGameOverOpen(false);
      sound.playCardSlide();

      triggerActionNotice({
        id: String(Date.now()),
        type: 'turn',
        titleUz: 'O\'YIN BOSHLANDI!',
        titleEn: 'GAME STARTED!',
        subtitleUz: `Birinchi karta: ${initialTopCard.color.toUpperCase()} ${initialTopCard.value}`,
        subtitleEn: `Top card: ${initialTopCard.color.toUpperCase()} ${initialTopCard.value}`,
      });

      return newGameState;
    },
    [houseRules, lang, triggerActionNotice]
  );

  // Reshuffle draw pile when empty
  const ensureDrawPile = (currentDrawPile: Card[], discardPile: Card[]): { newDraw: Card[]; newDiscard: Card[] } => {
    if (currentDrawPile.length > 0) {
      return { newDraw: currentDrawPile, newDiscard: discardPile };
    }
    if (discardPile.length <= 1) {
      return { newDraw: generateDeck(), newDiscard: discardPile };
    }
    const top = discardPile[discardPile.length - 1];
    const recycled = shuffle(discardPile.slice(0, discardPile.length - 1));
    return { newDraw: recycled, newDiscard: [top] };
  };

  /**
   * Player draws card(s)
   */
  const handleDrawCard = useCallback(
    () => {
      // If playing online as guest, send DRAW_CARD to host
      if (gameState.mode === 'online' && !onlineIsHost) {
        p2pRef.current?.sendMessage({
          type: 'DRAW_CARD',
          payload: {},
          senderId: 'guest',
        });
        sound.playCardSlide();
        return;
      }

      setGameState((prev) => {
        let { newDraw, newDiscard } = ensureDrawPile(prev.drawPile, prev.discardPile);
        const player = prev.players[prev.currentPlayerIndex];
        const cardsToDrawCount = prev.activeDrawStack > 0 ? prev.activeDrawStack : 1;

        if (newDraw.length < cardsToDrawCount) {
          const fresh = generateDeck();
          newDraw = [...newDraw, ...fresh];
        }

        const drawnCards = newDraw.splice(0, cardsToDrawCount);
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.currentPlayerIndex) {
            return {
              ...p,
              hand: [...p.hand, ...drawnCards],
              hasSaidUno: false,
            };
          }
          return p;
        });

        sound.playCardSlide();

        const logMsg =
          lang === 'uz'
            ? `${player.name} ${cardsToDrawCount} ta karta oldi`
            : `${player.name} drew ${cardsToDrawCount} card(s)`;

        const wasAttack = prev.activeDrawStack > 0;
        const nextIdx = wasAttack
          ? getNextPlayerIndex(prev.currentPlayerIndex, prev.players.length, prev.direction, 1)
          : prev.currentPlayerIndex;

        if (wasAttack && prev.mode === 'pass-and-play') {
          setIsPassCurtainOpen(true);
        }

        const nextState: GameState = {
          ...prev,
          players: updatedPlayers,
          drawPile: newDraw,
          discardPile: newDiscard,
          activeDrawStack: 0,
          currentPlayerIndex: nextIdx,
          turnTimeLeft: 30,
          logs: [
            {
              id: String(Date.now()),
              timestamp: Date.now(),
              text: logMsg,
              type: 'draw',
            },
            ...prev.logs.slice(0, 19),
          ],
        };

        // If host in online mode, sync to guest
        if (prev.mode === 'online' && onlineIsHost) {
          p2pRef.current?.syncState(nextState);
        }

        return nextState;
      });
    },
    [lang, onlineIsHost, gameState.mode]
  );

  /**
   * Execute playing a card after validation & color pick
   */
  const executePlayCard = useCallback(
    (card: Card, chosenColor?: CardColor, targetPlayerId?: string) => {
      // If in online mode as guest, send PLAY_CARD to host
      if (gameState.mode === 'online' && !onlineIsHost) {
        p2pRef.current?.sendMessage({
          type: 'PLAY_CARD',
          payload: { card, chosenColor, targetPlayerId },
          senderId: 'guest',
        });
        sound.playCardSnap();
        return;
      }

      setGameState((prev) => {
        const player = prev.players[prev.currentPlayerIndex];
        const newHand = player.hand.filter((c) => c.id !== card.id);
        const willHaveOneCard = newHand.length === 1;

        const newColor: CardColor = card.color === 'wild' ? chosenColor || 'red' : card.color;

        let newActiveStack = prev.activeDrawStack;
        if (card.value === 'draw2') newActiveStack += 2;
        if (card.value === 'wild4') newActiveStack += 4;

        let newDirection = prev.direction;
        let skipCount = 1;

        if (card.value === 'reverse') {
          if (prev.players.length === 2) {
            skipCount = 2;
          } else {
            newDirection = (newDirection * -1) as 1 | -1;
            skipCount = 1;
          }
        } else if (card.value === 'skip') {
          skipCount = 2;
        }

        // Trigger dynamic banner notices based on card played
        if (card.value === 'skip') {
          sound.playSkip();
          triggerActionNotice({
            id: String(Date.now()),
            type: 'skip',
            titleUz: `${player.name}: SKIP!`,
            titleEn: `${player.name}: SKIP!`,
            subtitleUz: 'Keyingi o\'yinchi navbatini o\'tkazadi',
            subtitleEn: 'Next player is skipped',
          });
        } else if (card.value === 'reverse') {
          sound.playReverse();
          triggerActionNotice({
            id: String(Date.now()),
            type: 'reverse',
            titleUz: 'YO\'NALISH O\'ZGARDI!',
            titleEn: 'DIRECTION REVERSED!',
            subtitleUz: newDirection === 1 ? 'Soat yo\'nalishi' : 'Teskari yo\'nalish',
            subtitleEn: newDirection === 1 ? 'Clockwise' : 'Counter-clockwise',
          });
        } else if (card.value === 'draw2') {
          sound.playDrawAttack(false);
          triggerActionNotice({
            id: String(Date.now()),
            type: 'attack',
            titleUz: `${player.name}: +2 JARIMA!`,
            titleEn: `${player.name}: DRAW 2!`,
            subtitleUz: `Jarima miqdori: +${newActiveStack}`,
            subtitleEn: `Total stack: +${newActiveStack}`,
          });
        } else if (card.value === 'wild' || card.value === 'wild4') {
          sound.playWild();
          if (card.value === 'wild4') sound.playDrawAttack(true);
          triggerActionNotice({
            id: String(Date.now()),
            type: 'color',
            titleUz: `YANGI RANG: ${newColor.toUpperCase()}`,
            titleEn: `NEW COLOR: ${newColor.toUpperCase()}`,
            subtitleUz: card.value === 'wild4' ? `+4 Jarima berildi! (+${newActiveStack})` : undefined,
            subtitleEn: card.value === 'wild4' ? `+4 Attack applied! (+${newActiveStack})` : undefined,
            color: newColor,
          });
        } else {
          sound.playCardSnap();
        }

        // Check 7-0 Hand Swap rule
        let updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.currentPlayerIndex) {
            return {
              ...p,
              hand: newHand,
              hasSaidUno: willHaveOneCard ? p.hasSaidUno : false,
            };
          }
          return p;
        });

        if (prev.houseRules.sevenZero && card.value === '7' && targetPlayerId) {
          const targetIndex = updatedPlayers.findIndex((p) => p.id === targetPlayerId);
          if (targetIndex !== -1) {
            const temp = updatedPlayers[prev.currentPlayerIndex].hand;
            updatedPlayers[prev.currentPlayerIndex].hand = updatedPlayers[targetIndex].hand;
            updatedPlayers[targetIndex].hand = temp;
          }
        } else if (prev.houseRules.sevenZero && card.value === '0') {
          const hands = updatedPlayers.map((p) => p.hand);
          updatedPlayers = updatedPlayers.map((p, idx) => {
            const fromIdx =
              ((idx - newDirection) % updatedPlayers.length + updatedPlayers.length) %
              updatedPlayers.length;
            return {
              ...p,
              hand: hands[fromIdx],
            };
          });
        }

        // Check Victory Condition
        if (newHand.length === 0) {
          setIsGameOverOpen(true);
          updateStats(!player.isBot);

          const finalState: GameState = {
            ...prev,
            players: updatedPlayers,
            discardPile: [...prev.discardPile, card],
            currentColor: newColor,
            winner: player,
            status: 'game-over',
            logs: [
              {
                id: String(Date.now()),
                timestamp: Date.now(),
                text:
                  lang === 'uz'
                    ? `G'ALABA! ${player.name} o'yinda yutdi!`
                    : `VICTORY! ${player.name} won the match!`,
                type: 'special',
              },
              ...prev.logs,
            ],
          };

          if (prev.mode === 'online' && onlineIsHost) {
            p2pRef.current?.syncState(finalState);
          }

          return finalState;
        }

        // Advance to next player
        const nextIdx = getNextPlayerIndex(
          prev.currentPlayerIndex,
          updatedPlayers.length,
          newDirection,
          skipCount
        );

        // Next player bot reactions if under attack
        const nextP = updatedPlayers[nextIdx];
        if (nextP && nextP.isBot && (card.value === 'draw2' || card.value === 'wild4' || card.value === 'skip')) {
          const randReact = BOT_REACTIONS_ATTACKED[Math.floor(Math.random() * BOT_REACTIONS_ATTACKED.length)];
          triggerReaction(nextP.id, randReact);
        }

        // UNO Challenge window
        const challengePending = willHaveOneCard && !player.hasSaidUno ? player.id : null;

        if (prev.mode === 'pass-and-play') {
          setIsPassCurtainOpen(true);
        } else if (!updatedPlayers[nextIdx].isBot) {
          sound.playTurnChime();
        }

        const nextState: GameState = {
          ...prev,
          players: updatedPlayers,
          discardPile: [...prev.discardPile, card],
          currentColor: newColor,
          direction: newDirection,
          activeDrawStack: newActiveStack,
          currentPlayerIndex: nextIdx,
          unoChallengePendingPlayerId: challengePending,
          turnTimeLeft: 30,
          logs: [
            {
              id: String(Date.now()),
              timestamp: Date.now(),
              text:
                lang === 'uz'
                  ? `${player.name} ${card.color} ${card.value} kartasini tashladi`
                  : `${player.name} played ${card.color} ${card.value}`,
              type: 'play',
              color: newColor,
            },
            ...prev.logs.slice(0, 19),
          ],
        };

        if (prev.mode === 'online' && onlineIsHost) {
          p2pRef.current?.syncState(nextState);
        }

        return nextState;
      });
    },
    [lang, triggerActionNotice, triggerReaction, updateStats, onlineIsHost, gameState.mode]
  );

  /**
   * Jump-In: Play exact matching card out of turn
   */
  const handleJumpIn = (card: Card) => {
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: 0,
    }));
    sound.playWild();
    executePlayCard(card);
  };

  /**
   * Card click handler by current player
   */
  const handleCardClick = (card: Card) => {
    // In online mode as guest, my player index is 1; as host, my player index is 0
    const myIndex = gameState.mode === 'online' ? (onlineIsHost ? 0 : 1) : 0;
    if (gameState.currentPlayerIndex !== myIndex && gameState.mode !== 'pass-and-play') {
      return;
    }

    const top = gameState.discardPile[gameState.discardPile.length - 1];
    if (!canPlayCard(card, top, gameState.currentColor, gameState.activeDrawStack, gameState.houseRules)) {
      sound.playBuzzer();
      return;
    }

    // Check if card is Wild - needs color pick
    if (card.color === 'wild') {
      setPendingCardToPlay(card);
      setIsColorPickerOpen(true);
      return;
    }

    // Check if card is 7 with 7-0 rule - needs opponent select
    if (card.value === '7' && gameState.houseRules.sevenZero && gameState.players.length > 2) {
      setPendingCardToPlay(card);
      setIsHandSwapOpen(true);
      return;
    }

    executePlayCard(card);
  };

  /**
   * Color selected from ColorPickerModal
   */
  const handleSelectColor = (chosenColor: CardColor) => {
    setIsColorPickerOpen(false);
    if (pendingCardToPlay) {
      executePlayCard(pendingCardToPlay, chosenColor);
      setPendingCardToPlay(null);
    }
  };

  /**
   * Hand swap opponent selected
   */
  const handleSelectSwapTarget = (targetPlayerId: string) => {
    setIsHandSwapOpen(false);
    if (pendingCardToPlay) {
      executePlayCard(pendingCardToPlay, undefined, targetPlayerId);
      setPendingCardToPlay(null);
    }
  };

  /**
   * Player presses UNO! button
   */
  const handleSayUno = () => {
    if (gameState.mode === 'online' && !onlineIsHost) {
      p2pRef.current?.sendMessage({
        type: 'CALL_UNO',
        payload: {},
        senderId: 'guest',
      });
      return;
    }

    setGameState((prev) => {
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.currentPlayerIndex) {
          return { ...p, hasSaidUno: true };
        }
        return p;
      });

      triggerReaction(currentPlayer.id, '🔥 UNO!');
      triggerActionNotice({
        id: String(Date.now()),
        type: 'uno',
        titleUz: `${currentPlayer.name}: 'UNO!'`,
        titleEn: `${currentPlayer.name}: 'UNO!'`,
        subtitleUz: '1 ta karta qoldi!',
        subtitleEn: 'Only 1 card remaining!',
      });

      const nextState: GameState = {
        ...prev,
        players: updatedPlayers,
        logs: [
          {
            id: String(Date.now()),
            timestamp: Date.now(),
            text: `${currentPlayer.name}: UNO! 🔥`,
            type: 'uno',
          },
          ...prev.logs.slice(0, 19),
        ],
      };

      if (prev.mode === 'online' && onlineIsHost) {
        p2pRef.current?.syncState(nextState);
      }

      return nextState;
    });
  };

  /**
   * Opponent challenges a player who forgot to say UNO
   */
  const handleChallengeUno = () => {
    if (!gameState.unoChallengePendingPlayerId) return;

    if (gameState.mode === 'online' && !onlineIsHost) {
      p2pRef.current?.sendMessage({
        type: 'CHALLENGE_UNO',
        payload: {},
        senderId: 'guest',
      });
      return;
    }

    setGameState((prev) => {
      const targetId = prev.unoChallengePendingPlayerId;
      const targetPlayer = prev.players.find((p) => p.id === targetId);
      if (!targetPlayer) return prev;

      let { newDraw, newDiscard } = ensureDrawPile(prev.drawPile, prev.discardPile);
      const penaltyCards = newDraw.splice(0, 2);

      const updatedPlayers = prev.players.map((p) => {
        if (p.id === targetId) {
          return {
            ...p,
            hand: [...p.hand, ...penaltyCards],
            hasSaidUno: false,
          };
        }
        return p;
      });

      triggerReaction(targetPlayer.id, '😱 +2 Jarima!');
      triggerActionNotice({
        id: String(Date.now()),
        type: 'challenge',
        titleUz: `${targetPlayer.name} FOSH BO'LDI!`,
        titleEn: `${targetPlayer.name} CAUGHT!`,
        subtitleUz: 'UNO demagani uchun +2 jarima kartasi oldi',
        subtitleEn: 'Draws 2 penalty cards for forgetting UNO',
      });

      const nextState: GameState = {
        ...prev,
        players: updatedPlayers,
        drawPile: newDraw,
        discardPile: newDiscard,
        unoChallengePendingPlayerId: null,
        logs: [
          {
            id: String(Date.now()),
            timestamp: Date.now(),
            text:
              lang === 'uz'
                ? `FOSh BO'LDI! ${targetPlayer.name} UNO demagani uchun +2 jarima kartasi oldi!`
                : `CHALLENGE! ${targetPlayer.name} forgot UNO and drew 2 penalty cards!`,
            type: 'challenge',
          },
          ...prev.logs.slice(0, 19),
        ],
      };

      if (prev.mode === 'online' && onlineIsHost) {
        p2pRef.current?.syncState(nextState);
      }

      return nextState;
    });
  };

  /**
   * Bot AI execution loop (Only runs in vs-bot mode)
   */
  useEffect(() => {
    if (!inGame || gameState.status !== 'playing' || gameState.mode !== 'vs-bot') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.isBot) return;

    const delay = currentPlayer.botDifficulty === 'hard' ? 950 : 1350;
    const timer = setTimeout(() => {
      const topCard = gameState.discardPile[gameState.discardPile.length - 1];
      const decision = decideBotMove(
        currentPlayer,
        topCard,
        gameState.currentColor,
        gameState.activeDrawStack,
        gameState.houseRules,
        gameState.players,
        gameState.direction
      );

      if (decision.action === 'play' && decision.card) {
        if (decision.shouldCallUno) {
          sound.playUnoCall();
          triggerReaction(currentPlayer.id, '🔥 UNO!');
          setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) =>
              p.id === currentPlayer.id ? { ...p, hasSaidUno: true } : p
            ),
          }));
        } else if (decision.card.value === 'wild4' || decision.card.value === 'draw2') {
          if (Math.random() < 0.4) {
            const randReaction = BOT_REACTIONS_VICTORY[Math.floor(Math.random() * BOT_REACTIONS_VICTORY.length)];
            triggerReaction(currentPlayer.id, randReaction);
          }
        }
        executePlayCard(decision.card, decision.chosenColor, decision.targetPlayerId);
      } else {
        handleDrawCard();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [inGame, gameState, executePlayCard, handleDrawCard, triggerReaction]);

  // Sort player hand helpers
  const handleSortByColor = () => {
    setGameState((prev) => {
      const myIdx = prev.mode === 'online' ? (onlineIsHost ? 0 : 1) : prev.currentPlayerIndex;
      const player = prev.players[myIdx];
      if (!player) return prev;
      const sorted = [...player.hand].sort((a, b) => a.color.localeCompare(b.color));
      const updatedPlayers = prev.players.map((p, idx) => (idx === myIdx ? { ...p, hand: sorted } : p));
      return { ...prev, players: updatedPlayers };
    });
  };

  const handleSortByValue = () => {
    setGameState((prev) => {
      const myIdx = prev.mode === 'online' ? (onlineIsHost ? 0 : 1) : prev.currentPlayerIndex;
      const player = prev.players[myIdx];
      if (!player) return prev;
      const sorted = [...player.hand].sort((a, b) => a.scoreValue - b.scoreValue);
      const updatedPlayers = prev.players.map((p, idx) => (idx === myIdx ? { ...p, hand: sorted } : p));
      return { ...prev, players: updatedPlayers };
    });
  };

  // ONLINE MULTIPLAYER: HOST CREATES ROOM
  const handleCreateOnlineRoom = (roomCode: string, hostPlayerName: string, avatarId: string) => {
    setOnlineIsHost(true);
    setOnlineRoomCode(roomCode);
    setOnlineHostName(hostPlayerName);
    setOnlineHostAvatar(avatarId);
    setOnlineGuestName(null);
    setOnlineGuestAvatar(null);
    setOnlineError(null);
    setOnlineIsConnecting(true);
    setIsOnlineModalOpen(true);

    const p2p = new P2PManager({
      onHostReady: () => {
        setOnlineIsConnecting(false);
      },
      onGuestConnected: (guestName, avatar) => {
        sound.playTurnChime();
        setOnlineGuestName(guestName);
        setOnlineGuestAvatar(avatar);
      },
      onMessageReceived: (msg: NetworkMessage) => {
        if (msg.type === 'PLAY_CARD') {
          executePlayCard(msg.payload.card, msg.payload.chosenColor, msg.payload.targetPlayerId);
        } else if (msg.type === 'DRAW_CARD') {
          handleDrawCard();
        } else if (msg.type === 'CALL_UNO') {
          handleSayUno();
        } else if (msg.type === 'CHALLENGE_UNO') {
          handleChallengeUno();
        }
      },
      onError: (errMsg) => {
        setOnlineError(errMsg);
        setOnlineIsConnecting(false);
      },
      onDisconnected: () => {
        setOnlineError('Raqib xonadan chiqib ketdi yoki aloqa uzildi.');
      },
    });

    p2pRef.current = p2p;
    p2p.createRoom(roomCode, hostPlayerName, avatarId).catch((err) => {
      setOnlineError(err.message || 'Xona ochishda xatolik');
      setOnlineIsConnecting(false);
    });
  };

  // Host launches game with guest
  const handleHostStartOnlineGame = () => {
    if (!onlineGuestName) return;
    setIsOnlineModalOpen(false);

    const initialGame = startNewGame(
      'online',
      2,
      'medium',
      [onlineHostName, onlineGuestName],
      onlineHostAvatar,
      onlineGuestAvatar || 'alien'
    );

    // Broadcast initial state to guest
    p2pRef.current?.syncState(initialGame);
  };

  // ONLINE MULTIPLAYER: GUEST JOINS ROOM
  const handleJoinOnlineRoom = (roomCode: string, guestPlayerName: string, avatarId: string) => {
    setOnlineIsHost(false);
    setOnlineRoomCode(roomCode);
    setOnlineHostName('Host');
    setOnlineHostAvatar('ninja');
    setOnlineGuestName(guestPlayerName);
    setOnlineGuestAvatar(avatarId);
    setOnlineError(null);
    setOnlineIsConnecting(true);
    setIsOnlineModalOpen(true);

    const p2p = new P2PManager({
      onConnectedToHost: () => {
        sound.playClick();
        setOnlineIsConnecting(false);
      },
      onMessageReceived: (msg: NetworkMessage) => {
        if (msg.type === 'SYNC_STATE') {
          setGameState(msg.payload);
          setInGame(true);
          setIsOnlineModalOpen(false);
          sound.playCardSlide();
        }
      },
      onError: (errMsg) => {
        setOnlineError(errMsg);
        setOnlineIsConnecting(false);
      },
      onDisconnected: () => {
        setOnlineError('Host bilan aloqa uzildi.');
      },
    });

    p2pRef.current = p2p;
    p2p.joinRoom(roomCode, guestPlayerName, avatarId).catch((err) => {
      setOnlineError(err.message || 'Ulanishda xato');
      setOnlineIsConnecting(false);
    });
  };

  const handleCancelOnlineModal = () => {
    if (p2pRef.current) {
      p2pRef.current.destroy();
      p2pRef.current = null;
    }
    setIsOnlineModalOpen(false);
  };

  // Exit back to lobby
  const handleExitGame = () => {
    if (window.confirm(lang === 'uz' ? "O'yindan chiqishni xohlaysizmi?" : 'Exit current match?')) {
      if (p2pRef.current) {
        p2pRef.current.destroy();
        p2pRef.current = null;
      }
      setInGame(false);
      setIsGameOverOpen(false);
      setIsOnlineModalOpen(false);
    }
  };

  // My player index: 0 in single-player/host; 1 if guest in online mode
  const myPlayerIndex = gameState.mode === 'online' ? (onlineIsHost ? 0 : 1) : 0;
  const myPlayer = gameState.players[myPlayerIndex] || {
    id: 'p0',
    name: 'You',
    avatar: 'ninja',
    isBot: false,
    hand: [],
    hasSaidUno: false,
    score: 0,
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex] || myPlayer;
  const isMyTurn = gameState.currentPlayerIndex === myPlayerIndex;
  const opponents = gameState.players.filter((_, idx) => idx !== myPlayerIndex);
  const topCard = gameState.discardPile[gameState.discardPile.length - 1] || null;

  // Check if player has any playable cards
  const hasPlayableCard = myPlayer.hand.some((card) =>
    isMyTurn && canPlayCard(card, topCard, gameState.currentColor, gameState.activeDrawStack, gameState.houseRules)
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#070a13] text-slate-100 overflow-x-hidden font-sans">
      {!inGame ? (
        <LobbyScreen
          onStartVsBot={(count, diff, name, avatar) => startNewGame('vs-bot', count, diff, [name], avatar)}
          onCreateOnlineRoom={handleCreateOnlineRoom}
          onJoinOnlineRoom={handleJoinOnlineRoom}
          onStartPassAndPlay={(count, names) => startNewGame('pass-and-play', count, 'medium', names)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          stats={stats}
          lang={lang}
        />
      ) : (
        <div className="flex-1 flex flex-col justify-between py-2 relative min-h-screen">
          {/* Header Bar */}
          <GameHeader
            mode={gameState.mode}
            roomCode={onlineRoomCode}
            isMuted={isMuted}
            onToggleMute={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onExitGame={handleExitGame}
            latestLog={gameState.logs[0]?.text}
            lang={lang}
          />

          {/* Dynamic Action Notification Banner */}
          <ActionBanner notice={currentNotice} lang={lang} />

          {/* Opponents Ribbon at the top */}
          <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-around gap-2 my-1">
            {opponents.map((opp) => (
              <OpponentHand
                key={opp.id}
                player={opp}
                isCurrentTurn={gameState.players[gameState.currentPlayerIndex]?.id === opp.id}
                reaction={reactions[opp.id]}
                position="top"
                turnTimeLeft={gameState.turnTimeLeft}
                lang={lang}
              />
            ))}
          </div>

          {/* Central 3D Poker Felt Game Board */}
          <GameBoard
            topCard={topCard}
            previousCards={gameState.discardPile}
            drawPileCount={gameState.drawPile.length}
            currentColor={gameState.currentColor}
            activeDrawStack={gameState.activeDrawStack}
            direction={gameState.direction}
            theme={theme}
            isMyTurn={isMyTurn}
            hasPlayableCard={hasPlayableCard}
            onDrawCard={() => handleDrawCard()}
            lang={lang}
          />

          {/* Floating Controls Bar: UNO Button & Reactions */}
          <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <UnoButton
                canSayUno={myPlayer.hand.length <= 2 && !myPlayer.hasSaidUno}
                hasSaidUno={myPlayer.hasSaidUno}
                onSayUno={handleSayUno}
                canChallenge={!!gameState.unoChallengePendingPlayerId}
                challengedPlayerName={
                  gameState.players.find((p) => p.id === gameState.unoChallengePendingPlayerId)?.name
                }
                onChallenge={handleChallengeUno}
                lang={lang}
              />
              <ReactionPicker
                onSendReaction={(text) => triggerReaction(myPlayer.id, text)}
                lang={lang}
              />
            </div>

            {/* Current Player Indicator Pill */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xl border-2 transition-all ${
                isMyTurn
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 animate-pulse'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700'
              }`}
            >
              <span>{isMyTurn ? (lang === 'uz' ? 'SIZNING NAVBATINGIZ!' : 'YOUR TURN!') : (lang === 'uz' ? 'Navbat:' : 'Turn:')}</span>
              {!isMyTurn && <strong className="text-yellow-400 font-bold">{currentPlayer.name}</strong>}
            </div>
          </div>

          {/* Player's Hand at the bottom */}
          <PlayerHand
            cards={myPlayer.hand}
            topCard={topCard}
            currentColor={gameState.currentColor}
            activeDrawStack={gameState.activeDrawStack}
            isMyTurn={isMyTurn}
            houseRules={gameState.houseRules}
            onPlayCard={handleCardClick}
            onJumpIn={handleJumpIn}
            onSortByColor={handleSortByColor}
            onSortByValue={handleSortByValue}
            reaction={reactions[myPlayer.id]}
            lang={lang}
          />

          {/* Modals */}
          <ColorPickerModal
            isOpen={isColorPickerOpen}
            onSelectColor={handleSelectColor}
            lang={lang}
          />

          <HandSwapModal
            isOpen={isHandSwapOpen}
            currentPlayer={currentPlayer}
            opponents={opponents}
            onSelectPlayer={handleSelectSwapTarget}
            lang={lang}
          />

          <PassCurtainModal
            isOpen={isPassCurtainOpen}
            nextPlayer={gameState.players[gameState.currentPlayerIndex] || myPlayer}
            onReveal={() => setIsPassCurtainOpen(false)}
            lang={lang}
          />

          <GameOverModal
            isOpen={isGameOverOpen}
            winner={gameState.winner}
            players={gameState.players}
            score={calculateRoundScore(gameState.players, gameState.winner?.id || '')}
            onPlayAgain={() => {
              if (gameState.mode === 'online') {
                if (onlineIsHost) {
                  handleHostStartOnlineGame();
                }
              } else {
                startNewGame(
                  gameState.mode,
                  gameState.players.length,
                  'medium',
                  gameState.players.map((p) => p.name)
                );
              }
            }}
            onGoHome={() => {
              setIsGameOverOpen(false);
              setInGame(false);
            }}
            lang={lang}
          />
        </div>
      )}

      {/* Online Room Waiting Lobby Modal */}
      <OnlineLobbyModal
        isOpen={isOnlineModalOpen}
        isHost={onlineIsHost}
        roomCode={onlineRoomCode}
        hostName={onlineHostName}
        hostAvatar={onlineHostAvatar}
        guestName={onlineGuestName}
        guestAvatar={onlineGuestAvatar}
        isConnecting={onlineIsConnecting}
        errorMessage={onlineError}
        onStartGame={handleHostStartOnlineGame}
        onCancel={handleCancelOnlineModal}
        lang={lang}
      />

      {/* Global Settings & Rules Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onChangeTheme={setTheme}
        houseRules={houseRules}
        onChangeHouseRules={setHouseRules}
        volume={volume}
        onChangeVolume={(vol) => {
          sound.setVolume(vol);
          setVolume(vol);
        }}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = sound.toggleMute();
          setIsMuted(muted);
        }}
        lang={lang}
        onChangeLang={setLang}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        lang={lang}
      />
    </div>
  );
}
export default App;
