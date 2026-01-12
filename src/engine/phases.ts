import type { GameState, LogEntry } from '../data/types';
import { getPlayer, getOpponentPlayer, drawCard } from './state';
import { gainStartOfTurnEnergy } from './economy';
import { clearFreezeImmunity, grantFreezeImmunity, clearFreeze, damageDragon } from './combat';
import { applyWinCondition } from './winConditions';
import { getOpponent } from '../utils/helpers';

// ============================================================================
// LOGGING
// ============================================================================

function log(state: GameState, action: string, details?: Record<string, unknown>): void {
  const entry: LogEntry = {
    turn: state.turn,
    player: state.activePlayer,
    action,
    details,
    timestamp: Date.now(),
  };
  state.actionLog.push(entry);
}

// ============================================================================
// START PHASE
// ============================================================================

export function executeStartPhase(state: GameState): void {
  const player = getPlayer(state, state.activePlayer);
  const opponent = getOpponentPlayer(state, state.activePlayer);

  log(state, `Turn ${state.turn} Start Phase`);

  // 1. Clear freeze immunity from opponent (it was granted when they ended their turn)
  clearFreezeImmunity(opponent);

  // 2. Draw a card
  const drawnCard = drawCard(player);
  if (drawnCard) {
    log(state, 'Drew a card', { cardName: drawnCard.name });
  }

  // 3. Gain energy (base + rider economy)
  const energyGained = gainStartOfTurnEnergy(player);
  log(state, 'Gained energy', { amount: energyGained, total: player.energy });

  // 4. Apply burn damage
  if (player.dragonBurn > 0) {
    player.dragon.hp -= player.dragonBurn;
    log(state, 'Dragon took burn damage', { damage: player.dragonBurn, hp: player.dragon.hp });
  }
  if (player.riderBurn > 0) {
    player.rider.hp -= player.riderBurn;
    log(state, 'Rider took burn damage', { damage: player.riderBurn, hp: player.rider.hp });
  }

  // 5. Dragon start-of-turn abilities
  if (player.dragon.name === 'Voidmaw') {
    if (player.energy > opponent.energy) {
      damageDragon(state, opponent, 2, state.activePlayer);
      log(state, 'Voidmaw dealt 2 damage (energy advantage)', {
        playerEnergy: player.energy,
        opponentEnergy: opponent.energy
      });
    }
  }

  // 6. Reset turn flags
  player.firstAttackThisTurn = true;
  player.burnAppliedThisTurn = false;
  player.cardsPlayedWhileFrozen = 0;

  // 7. Check win conditions
  if (applyWinCondition(state)) {
    log(state, 'Game ended', { winner: state.winner, winType: state.winType });
    return;
  }

  // 8. Transition to action phase
  state.turnPhase = 'action';
  log(state, 'Entered Action Phase');
}

// ============================================================================
// END PHASE
// ============================================================================

export function executeEndPhase(state: GameState): void {
  const player = getPlayer(state, state.activePlayer);

  log(state, 'End Phase');

  // 1. Discard down to hand limit (5 cards)
  while (player.hand.length > 5) {
    // For now, auto-discard last card. UI should let player choose.
    const discarded = player.hand.pop()!;
    player.discard.push(discarded);
    log(state, 'Discarded to hand limit', { cardName: discarded.name });
  }

  // 2. Handle freeze: remove freeze, grant immunity
  if (player.dragonFrozen) {
    clearFreeze(player, 'dragon');
    grantFreezeImmunity(player, 'dragon');
    log(state, 'Dragon thawed and gained freeze immunity');
  }
  if (player.riderFrozen) {
    clearFreeze(player, 'rider');
    grantFreezeImmunity(player, 'rider');
    log(state, 'Rider thawed and gained freeze immunity');
  }

  // 3. Switch active player and increment turn
  const nextPlayer = getOpponent(state.activePlayer);
  state.activePlayer = nextPlayer;
  if (nextPlayer === 1) {
    state.turn++;
  }
  state.turnPhase = 'start';

  log(state, 'Turn ended', { nextPlayer, turn: state.turn });
}

// ============================================================================
// PASS TURN
// ============================================================================

export function passTurn(state: GameState): void {
  log(state, 'Passed');
  state.turnPhase = 'end';
  executeEndPhase(state);

  // Auto-execute start phase for next player
  if (state.phase !== 'ended') {
    executeStartPhase(state);
  }
}
