import type { GameState, PlayerState, Card, TargetType, GameAction } from '../data/types';
import { getPlayer } from './state';
import { isCritical, isWounded } from '../data/riders';

export function getAttackCost(player: PlayerState): number {
  let cost = player.dragon.attackCost; // Base cost is 2

  // Kael critical: attacks cost +1
  if (player.rider.name === 'Kael' && isCritical(player.rider)) {
    cost += 1;
  }

  return cost;
}

export function getCardCost(player: PlayerState, card: Card): number {
  let cost = card.cost;

  // Lyra wounded: freeze cards cost +1
  if (player.rider.name === 'Lyra' && isWounded(player.rider)) {
    if (card.effectType === 'freeze') {
      cost += 1;
    }
  }

  return cost;
}

export function canAttack(_state: GameState, player: PlayerState): boolean {
  // Dragon must be alive
  if (player.dragon.hp <= 0) return false;

  // Cannot attack while frozen
  if (player.dragonFrozen) return false;

  // Must afford attack cost
  const cost = getAttackCost(player);
  if (player.energy < cost) return false;

  return true;
}

export function canPlayCard(_state: GameState, player: PlayerState, card: Card): boolean {
  // Must afford card
  const cost = getCardCost(player, card);
  if (player.energy < cost) return false;

  // Lyra critical: cannot play freeze cards
  if (player.rider.name === 'Lyra' && isCritical(player.rider)) {
    if (card.effectType === 'freeze') return false;
  }

  // Morrik critical: cannot play shield cards
  if (player.rider.name === 'Morrik' && isCritical(player.rider)) {
    if (card.effectType === 'shield') return false;
  }

  // When dragon frozen: can play max 1 card per turn
  if (player.dragonFrozen && player.cardsPlayedWhileFrozen >= 1) {
    return false;
  }

  return true;
}

export function needsTarget(card: Card): boolean {
  // Cards that target 'both' or 'self' or 'opp' don't need target selection
  return card.target === 'dragon' || card.target === 'rider';
}

export function isValidTarget(card: Card, target: TargetType): boolean {
  if (card.target === 'dragon') return target === 'dragon';
  if (card.target === 'rider') return target === 'rider';
  return true;
}

export function getLegalActions(state: GameState): GameAction[] {
  const player = getPlayer(state, state.activePlayer);
  const actions: GameAction[] = [];

  // Attack actions
  if (canAttack(state, player)) {
    actions.push({ type: 'ATTACK', target: 'dragon' });
    actions.push({ type: 'ATTACK', target: 'rider' });
  }

  // Card actions
  for (const card of player.hand) {
    if (canPlayCard(state, player, card)) {
      if (needsTarget(card)) {
        if (card.target === 'dragon') {
          actions.push({ type: 'PLAY_CARD', cardId: card.id, target: 'dragon' });
        } else if (card.target === 'rider') {
          actions.push({ type: 'PLAY_CARD', cardId: card.id, target: 'rider' });
        }
      } else {
        actions.push({ type: 'PLAY_CARD', cardId: card.id });
      }
    }
  }

  // Can always pass
  actions.push({ type: 'PASS' });

  return actions;
}
