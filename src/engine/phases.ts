import type { GameState } from '../data/types';
import { getPlayer, getOpponentPlayer, drawCard } from './state';
import { gainStartOfTurnEnergy, calculateEnergyBreakdown } from './economy';
import { clearFreezeImmunity, grantFreezeImmunity, clearFreeze, damageDragon } from './combat';
import { applyWinCondition } from './winConditions';
import { getOpponent } from '../utils/helpers';
import { getLogger } from '../logging';

// ============================================================================
// START PHASE
// ============================================================================

export function executeStartPhase(state: GameState): void {
  const player = getPlayer(state, state.activePlayer);
  const opponent = getOpponentPlayer(state, state.activePlayer);
  const logger = getLogger();

  logger?.logTurnStart(state);

  // 1. Clear freeze immunity from opponent (it was granted when they ended their turn)
  clearFreezeImmunity(opponent);

  // 2. Draw a card
  const drawnCard = drawCard(player);
  if (drawnCard) {
    logger?.logDrawCard(state, drawnCard.name);
  }

  // 3. Gain energy (base + rider economy)
  const energyBreakdown = calculateEnergyBreakdown(player);
  const energyGained = gainStartOfTurnEnergy(player);
  logger?.logEnergyGain(state, energyGained, player.energy, energyBreakdown);

  // 4. Apply burn damage
  if (player.dragonBurn > 0) {
    player.dragon.hp -= player.dragonBurn;
    logger?.logBurnDamage(state, 'dragon', player.dragonBurn, player.dragon.hp);
  }
  if (player.riderBurn > 0) {
    player.rider.hp -= player.riderBurn;
    logger?.logBurnDamage(state, 'rider', player.riderBurn, player.rider.hp);
  }

  // 5. Dragon start-of-turn abilities
  if (player.dragon.name === 'Voidmaw') {
    if (player.energy > opponent.energy) {
      damageDragon(state, opponent, 2, state.activePlayer);
      logger?.logDragonAbility(state, 'Voidmaw dealt 2 damage (energy advantage)', {
        damage: 2,
        dragonAbility: 'Voidmaw energy advantage',
      });
    }
  }

  // 6. Reset turn flags
  player.firstAttackThisTurn = true;
  player.burnAppliedThisTurn = false;
  player.actionsTakenThisTurn = 0;

  // 7. Check win conditions
  if (applyWinCondition(state)) {
    logger?.logGameEnd(state, state.winner!, state.winType!);
    return;
  }

  // 8. Transition to action phase
  state.turnPhase = 'action';
  logger?.logActionPhase(state);
}

// ============================================================================
// END PHASE
// ============================================================================

export function executeEndPhase(state: GameState): void {
  const player = getPlayer(state, state.activePlayer);
  const logger = getLogger();

  // 1. Discard down to hand limit (5 cards)
  while (player.hand.length > 5) {
    // For now, auto-discard last card. UI should let player choose.
    const discarded = player.hand.pop()!;
    player.discard.push(discarded);
    logger?.logDiscard(state, discarded.name);
  }

  // 2. Handle freeze stacks: decay by 1, grant immunity when cleared
  if (player.dragonFreezeStacks > 0) {
    player.dragonFreezeStacks = Math.max(0, player.dragonFreezeStacks - 1);
    if (player.dragonFreezeStacks === 0) {
      grantFreezeImmunity(player, 'dragon');
      logger?.logFreezeThaw(state, 'dragon');
    }
  }
  if (player.riderFreezeStacks > 0) {
    player.riderFreezeStacks = Math.max(0, player.riderFreezeStacks - 1);
    if (player.riderFreezeStacks === 0) {
      grantFreezeImmunity(player, 'rider');
      logger?.logFreezeThaw(state, 'rider');
    }
  }

  // 3. Switch active player and increment turn
  const nextPlayer = getOpponent(state.activePlayer);
  state.activePlayer = nextPlayer;
  if (nextPlayer === 1) {
    state.turn++;
  }
  state.turnPhase = 'start';

  logger?.logEndTurn(state, nextPlayer, state.turn);
}

// ============================================================================
// PASS TURN
// ============================================================================

export function passTurn(state: GameState): void {
  state.turnPhase = 'end';
  executeEndPhase(state);

  // Auto-execute start phase for next player
  if (state.phase !== 'ended') {
    executeStartPhase(state);
  }
}
