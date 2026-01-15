import type {
  GameState,
  PlayerState,
  RiderName,
  DragonName,
  Card,
  PlayerNumber,
} from '../data/types';
import { createRider } from '../data/riders';
import { createDragon } from '../data/dragons';
import { generateId, shuffleArray } from '../utils/helpers';

export function createPlayerState(
  riderName: RiderName,
  dragonName: DragonName,
  deck: Card[]
): PlayerState {
  const rider = createRider(riderName);
  const dragon = createDragon(dragonName);

  // Transfer shields from dragon to rider
  rider.shields = dragon.shields;
  dragon.shields = 0;

  return {
    rider,
    dragon,
    hand: [],
    deck: shuffleArray([...deck]),
    discard: [],
    energy: 0,
    dragonFrozen: false,
    dragonFreezeImmune: false,
    dragonBurn: 0,
    riderFrozen: false,
    riderFreezeImmune: false,
    riderBurn: 0,
    firstAttackThisTurn: true,
    burnAppliedThisTurn: false,
    cardsPlayedWhileFrozen: 0,
  };
}

export function createInitialGameState(
  player1Rider: RiderName,
  player1Dragon: DragonName,
  player2Rider: RiderName,
  player2Dragon: DragonName,
  player1Deck: Card[],
  player2Deck: Card[]
): GameState {
  const state: GameState = {
    gameId: generateId(),
    phase: 'play',
    turn: 1,
    activePlayer: 1,
    turnPhase: 'start',
    player1: createPlayerState(player1Rider, player1Dragon, player1Deck),
    player2: createPlayerState(player2Rider, player2Dragon, player2Deck),
    winner: null,
    winType: null,
    actionLog: [],
  };

  // Draw initial hands (4 cards each)
  for (let i = 0; i < 4; i++) {
    drawCard(state.player1);
    drawCard(state.player2);
  }

  return state;
}

export function getPlayer(state: GameState, player: PlayerNumber): PlayerState {
  return player === 1 ? state.player1 : state.player2;
}

export function getOpponentPlayer(state: GameState, player: PlayerNumber): PlayerState {
  return player === 1 ? state.player2 : state.player1;
}

export function drawCard(player: PlayerState): Card | null {
  if (player.deck.length === 0) {
    return null;
  }
  const card = player.deck.shift()!;
  player.hand.push(card);
  return card;
}

export function discardCard(player: PlayerState, cardId: string): Card | null {
  const index = player.hand.findIndex((c) => c.id === cardId);
  if (index === -1) return null;
  const [card] = player.hand.splice(index, 1);
  player.discard.push(card);
  return card;
}
