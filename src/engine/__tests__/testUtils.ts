import type { GameState, PlayerState, RiderName, DragonName, Card } from '../../data/types';
import { createPlayerState, createInitialGameState } from '../state';
import { createRider } from '../../data/riders';
import { createDragon } from '../../data/dragons';

/**
 * Creates a minimal game state for testing.
 */
export function createTestGameState(
  p1Rider: RiderName = 'Talia',
  p1Dragon: DragonName = 'Emberfang',
  p2Rider: RiderName = 'Kael',
  p2Dragon: DragonName = 'Cryowyrm'
): GameState {
  return createInitialGameState(p1Rider, p1Dragon, p2Rider, p2Dragon, [], []);
}

/**
 * Creates a test card with specified properties.
 */
export function createTestCard(overrides: Partial<Card> = {}): Card {
  return {
    id: `test-card-${Math.random()}`,
    name: 'Test Card',
    cost: 1,
    effectType: 'damage',
    target: 'dragon',
    value: 3,
    secondaryValue: 0,
    description: 'Test card description',
    ...overrides,
  };
}

/**
 * Sets up a player state with specific HP values for testing breakpoints.
 */
export function setPlayerHp(player: PlayerState, riderHp: number, dragonHp: number): void {
  player.rider.hp = riderHp;
  player.dragon.hp = dragonHp;
}

/**
 * Gives a player specific energy.
 */
export function setPlayerEnergy(player: PlayerState, energy: number): void {
  player.energy = energy;
}

/**
 * Adds cards to a player's hand.
 */
export function addCardsToHand(player: PlayerState, cards: Card[]): void {
  player.hand.push(...cards);
}

/**
 * Sets up a simplified game state for combat testing.
 */
export function createCombatTestState(): GameState {
  const state = createTestGameState();
  // Give both players energy to attack
  state.player1.energy = 10;
  state.player2.energy = 10;
  return state;
}

/**
 * Creates a game state at the brink of victory.
 */
export function createNearWinState(winType: 'dragon' | 'rider' = 'dragon'): GameState {
  const state = createTestGameState();
  if (winType === 'dragon') {
    state.player2.dragon.hp = 1;
  } else {
    state.player2.rider.hp = 1;
  }
  state.player1.energy = 10;
  return state;
}

/**
 * Advances turn to action phase.
 */
export function advanceToActionPhase(state: GameState): void {
  state.turnPhase = 'action';
}
