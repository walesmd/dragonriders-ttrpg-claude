import type { GameState, PlayerNumber, AIDifficulty } from '../data/types';
import { getPlayer, getOpponentPlayer } from '../engine/state';
import { canAttack, canPlayCard, needsTarget } from '../engine/validation';
import { executeAttack } from '../engine/combat';
import { executeCard } from '../engine/cards';
import { passTurn } from '../engine/phases';
import { applyWinCondition } from '../engine/winConditions';
import { getAIConfig, type AIConfig } from './presets';
import { scoreAction, type AIAction } from './scoring';

function generateActions(state: GameState, playerNum: PlayerNumber): AIAction[] {
  const player = getPlayer(state, playerNum);
  const actions: AIAction[] = [];

  // Can always pass
  actions.push({ type: 'pass' });

  // Attack actions
  if (canAttack(state, player, 'dragon')) {
    actions.push({ type: 'attack_dragon' });
  }
  if (canAttack(state, player, 'rider')) {
    actions.push({ type: 'attack_rider' });
  }

  // Card actions
  for (const card of player.hand) {
    if (canPlayCard(state, player, card)) {
      if (needsTarget(card)) {
        if (card.target === 'dragon') {
          actions.push({ type: 'play_card', card, target: 'dragon' });
        } else if (card.target === 'rider') {
          actions.push({ type: 'play_card', card, target: 'rider' });
        }
      } else {
        actions.push({ type: 'play_card', card });
      }
    }
  }

  return actions;
}

function executeAction(state: GameState, playerNum: PlayerNumber, action: AIAction): void {
  switch (action.type) {
    case 'attack_dragon': {
      const result = executeAttack(state, playerNum, 'dragon');
      state.actionLog.push({
        turn: state.turn,
        player: playerNum,
        action: 'AI attacked Dragon',
        details: {
          damage: result.damage?.finalDamage,
          kaelBonus: result.kaelBonus,
          dragonAbility: result.dragonAbility,
          splashDamage: result.splashDamage?.finalDamage,
        },
        timestamp: Date.now(),
      });
      break;
    }

    case 'attack_rider': {
      const result = executeAttack(state, playerNum, 'rider');
      state.actionLog.push({
        turn: state.turn,
        player: playerNum,
        action: 'AI attacked Rider',
        details: {
          damage: result.damage?.finalDamage,
          kaelBonus: result.kaelBonus,
          dragonAbility: result.dragonAbility,
          splashDamage: result.splashDamage?.finalDamage,
        },
        timestamp: Date.now(),
      });
      break;
    }

    case 'play_card':
      if (action.card) {
        const result = executeCard(state, playerNum, action.card.id, action.target);
        state.actionLog.push({
          turn: state.turn,
          player: playerNum,
          action: `AI played ${action.card.name}`,
          details: {
            cost: result.energySpent,
            morrikBonus: result.morrikBonus,
            effects: result.effects,
          },
          timestamp: Date.now(),
        });
      }
      break;

    case 'pass':
      // Do nothing, handled by caller
      break;
  }

  applyWinCondition(state);
}

export interface AITurnResult {
  actions: { action: AIAction; score: number }[];
  finished: boolean;
}

export function executeAIAction(
  state: GameState,
  playerNum: PlayerNumber,
  config: AIConfig
): AITurnResult {
  if (state.phase === 'ended') {
    return { actions: [], finished: true };
  }

  const player = getPlayer(state, playerNum);
  const opponent = getOpponentPlayer(state, playerNum);
  const actions = generateActions(state, playerNum);

  // If only action is pass, we're done
  if (actions.length === 1 && actions[0].type === 'pass') {
    return { actions: [], finished: true };
  }

  // Score all actions
  const scoredActions = actions.map((action) => ({
    action,
    score: scoreAction(state, player, opponent, action, config),
  }));

  // Sort by score descending
  scoredActions.sort((a, b) => b.score - a.score);

  // Select best action
  const best = scoredActions[0];

  if (best.action.type === 'pass' || best.score < 0) {
    return { actions: scoredActions, finished: true };
  }

  // Execute the action
  executeAction(state, playerNum, best.action);

  return { actions: scoredActions, finished: false };
}

export function executeFullAITurn(
  state: GameState,
  playerNum: PlayerNumber,
  difficulty: AIDifficulty
): void {
  const player = getPlayer(state, playerNum);
  const config = getAIConfig(difficulty, player.dragon.name);

  let actionCount = 0;
  const maxActions = 20;

  while (state.phase !== 'ended' && actionCount < maxActions) {
    const result = executeAIAction(state, playerNum, config);

    if (result.finished) {
      break;
    }

    actionCount++;
  }

  // End turn
  if (state.phase !== 'ended') {
    passTurn(state);
  }
}

// Hook for React component to use AI
export function useAI() {
  const takeAIAction = (
    state: GameState,
    playerNum: PlayerNumber,
    difficulty: AIDifficulty
  ): AITurnResult => {
    const player = getPlayer(state, playerNum);
    const config = getAIConfig(difficulty, player.dragon.name);
    return executeAIAction(state, playerNum, config);
  };

  const takeFullAITurn = (
    state: GameState,
    playerNum: PlayerNumber,
    difficulty: AIDifficulty
  ): void => {
    executeFullAITurn(state, playerNum, difficulty);
  };

  return { takeAIAction, takeFullAITurn };
}
