import type { Card, CardColor, HouseRules, Player } from '../types/game';
import { canPlayCard } from './unoEngine';

export interface BotDecision {
  action: 'play' | 'draw';
  card?: Card;
  chosenColor?: CardColor;
  shouldCallUno: boolean;
  targetPlayerId?: string; // For 7-0 hand swap
}

/**
 * Determine best color based on bot's remaining cards
 */
function getBestColorFromHand(hand: Card[]): CardColor {
  const counts: Record<'red' | 'blue' | 'green' | 'yellow', number> = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
  };

  hand.forEach((c) => {
    if (c.color !== 'wild') {
      counts[c.color]++;
    }
  });

  const sorted = (Object.keys(counts) as ('red' | 'blue' | 'green' | 'yellow')[]).sort(
    (a, b) => counts[b] - counts[a]
  );

  return sorted[0] || 'red';
}

/**
 * Compute bot's move based on difficulty and current state
 */
export function decideBotMove(
  bot: Player,
  topCard: Card,
  currentColor: CardColor,
  activeDrawStack: number,
  houseRules: HouseRules,
  players: Player[],
  direction: 1 | -1
): BotDecision {
  const difficulty = bot.botDifficulty || 'medium';
  const playableCards = bot.hand.filter((card) =>
    canPlayCard(card, topCard, currentColor, activeDrawStack, houseRules)
  );

  // If no playable card, bot must draw
  if (playableCards.length === 0) {
    return {
      action: 'draw',
      shouldCallUno: false,
    };
  }

  let selectedCard: Card;

  if (difficulty === 'easy') {
    // Random playable card
    selectedCard = playableCards[Math.floor(Math.random() * playableCards.length)];
  } else if (difficulty === 'medium') {
    // Prioritize:
    // 1. Stack if under attack
    // 2. Play action cards (+2, skip, reverse) if next player has few cards
    // 3. Regular matching cards
    // 4. Hold Wild cards as backup
    const attackCards = playableCards.filter((c) => c.value === 'draw2' || c.value === 'wild4');
    if (activeDrawStack > 0 && attackCards.length > 0) {
      selectedCard = attackCards[0];
    } else {
      const nonWild = playableCards.filter((c) => c.color !== 'wild');
      if (nonWild.length > 0) {
        selectedCard = nonWild[Math.floor(Math.random() * nonWild.length)];
      } else {
        selectedCard = playableCards[0];
      }
    }
  } else {
    // Hard / Master difficulty
    const botIdx = players.findIndex((p) => p.id === bot.id);
    const nextPlayerIdx = ((botIdx + direction) % players.length + players.length) % players.length;
    const nextPlayer = players[nextPlayerIdx];

    // If next player is dangerously low on cards (<= 2), aggressively drop attacks or skips
    if (nextPlayer.hand.length <= 2) {
      const aggressiveCards = playableCards.filter(
        (c) => c.value === 'wild4' || c.value === 'draw2' || c.value === 'skip' || c.value === 'reverse'
      );
      if (aggressiveCards.length > 0) {
        selectedCard = aggressiveCards[0];
      } else {
        selectedCard = playableCards[0];
      }
    } else {
      // Prefer highest point cards first (get rid of high value numbers / actions)
      playableCards.sort((a, b) => b.scoreValue - a.scoreValue);
      selectedCard = playableCards[0];
    }
  }

  // Handle color choice if playing Wild
  let chosenColor: CardColor | undefined;
  if (selectedCard.color === 'wild') {
    chosenColor = getBestColorFromHand(bot.hand.filter((c) => c.id !== selectedCard.id));
  }

  // Handle UNO declaration (when hand becomes 1 card after playing)
  const willHaveOneCard = bot.hand.length === 2;
  let shouldCallUno = false;
  if (willHaveOneCard) {
    if (difficulty === 'easy') {
      shouldCallUno = Math.random() < 0.65; // 35% chance to forget
    } else if (difficulty === 'medium') {
      shouldCallUno = Math.random() < 0.88; // 12% chance to forget
    } else {
      shouldCallUno = Math.random() < 0.98; // 2% chance to forget
    }
  }

  // For 7-0 rule: target the player with the least cards to swap hands with!
  let targetPlayerId: string | undefined;
  if (selectedCard.value === '7' && houseRules.sevenZero) {
    const opponents = players.filter((p) => p.id !== bot.id);
    opponents.sort((a, b) => a.hand.length - b.hand.length);
    if (opponents[0] && opponents[0].hand.length < bot.hand.length) {
      targetPlayerId = opponents[0].id;
    }
  }

  return {
    action: 'play',
    card: selectedCard,
    chosenColor,
    shouldCallUno,
    targetPlayerId,
  };
}
