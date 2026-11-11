import type { Card, CardColor, CardValue, HouseRules, Player } from '../types/game';

const COLORS: CardColor[] = ['red', 'blue', 'green', 'yellow'];

/**
 * Generate a complete authentic 108-card UNO deck
 */
export function generateDeck(): Card[] {
  const deck: Card[] = [];
  let idCounter = 1;

  COLORS.forEach((color) => {
    // One '0' card per color
    deck.push({
      id: `${color}-0-${idCounter++}`,
      color,
      value: '0',
      scoreValue: 0,
    });

    // Two of each 1-9
    for (let num = 1; num <= 9; num++) {
      const val = String(num) as CardValue;
      deck.push({
        id: `${color}-${val}-a-${idCounter++}`,
        color,
        value: val,
        scoreValue: num,
      });
      deck.push({
        id: `${color}-${val}-b-${idCounter++}`,
        color,
        value: val,
        scoreValue: num,
      });
    }

    // Action cards: 2 of each (Skip, Reverse, Draw2)
    const actions: CardValue[] = ['skip', 'reverse', 'draw2'];
    actions.forEach((act) => {
      deck.push({
        id: `${color}-${act}-a-${idCounter++}`,
        color,
        value: act,
        scoreValue: 20,
      });
      deck.push({
        id: `${color}-${act}-b-${idCounter++}`,
        color,
        value: act,
        scoreValue: 20,
      });
    });
  });

  // 4 Wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-${i}-${idCounter++}`,
      color: 'wild',
      value: 'wild',
      scoreValue: 50,
    });
  }

  // 4 Wild Draw Four (+4) cards
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild4-${i}-${idCounter++}`,
      color: 'wild',
      value: 'wild4',
      scoreValue: 50,
    });
  }

  return shuffle(deck);
}

/**
 * Fisher-Yates array shuffler
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Check if a card can be legally played
 */
export function canPlayCard(
  card: Card,
  topCard: Card | null,
  currentColor: CardColor,
  activeDrawStack: number = 0,
  houseRules: HouseRules = {
    stacking: true,
    sevenZero: false,
    jumpIn: false,
    drawToMatch: false,
    forcePlay: false,
  }
): boolean {
  if (!topCard) return true;

  // If there is an active draw attack (+2 or +4 stacked)
  if (activeDrawStack > 0) {
    if (!houseRules.stacking) return false;
    // If top card is draw2, can stack draw2 or wild4
    if (topCard.value === 'draw2') {
      return card.value === 'draw2' || card.value === 'wild4';
    }
    // If top card is wild4, can only stack wild4
    if (topCard.value === 'wild4') {
      return card.value === 'wild4';
    }
    return false;
  }

  // Wild cards can always be played
  if (card.color === 'wild') return true;

  // Matching active color (e.g., played color or chosen color after wild)
  if (card.color === currentColor) return true;

  // Matching value (e.g. Red 5 on Blue 5, or Green Skip on Yellow Skip)
  if (card.value === topCard.value) return true;

  return false;
}

/**
 * Check if a card is an exact match for Jump-In rule
 */
export function isExactMatch(card: Card, topCard: Card): boolean {
  return card.color === topCard.color && card.value === topCard.value;
}

/**
 * Calculate the next player index
 */
export function getNextPlayerIndex(
  currentIndex: number,
  playerCount: number,
  direction: 1 | -1,
  skipCount: number = 1
): number {
  const raw = currentIndex + direction * skipCount;
  return ((raw % playerCount) + playerCount) % playerCount;
}

/**
 * Calculate round score for the winner based on remaining cards in opponents' hands
 */
export function calculateRoundScore(players: Player[], winnerId: string): number {
  let score = 0;
  players.forEach((p) => {
    if (p.id !== winnerId) {
      p.hand.forEach((card) => {
        score += card.scoreValue;
      });
    }
  });
  return score;
}
