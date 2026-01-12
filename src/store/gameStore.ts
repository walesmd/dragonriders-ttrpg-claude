import { create } from 'zustand';
import type {
  GameState,
  Card,
  TargetType,
} from '../data/types';
import { createInitialGameState, getPlayer } from '../engine/state';
import { executeAttack } from '../engine/combat';
import { executeCard } from '../engine/cards';
import { executeStartPhase, passTurn } from '../engine/phases';
import { canAttack, canPlayCard, getAttackCost, getCardCost } from '../engine/validation';
import { applyWinCondition } from '../engine/winConditions';
import { deepClone } from '../utils/helpers';
import { useSetupStore } from './setupStore';
import { initializeLogger, getLogger, clearLogger } from '../logging';

interface GameStore {
  state: GameState | null;
  history: GameState[];
  selectedCard: Card | null;

  // Actions
  initializeGame: () => void;
  attack: (target: TargetType) => void;
  playCard: (cardId: string, target?: TargetType) => void;
  endTurn: () => void;
  selectCard: (card: Card | null) => void;
  undo: () => void;
  reset: () => void;

  // Helpers
  canPlayerAttack: () => boolean;
  canPlayerPlayCard: (card: Card) => boolean;
  getAttackCost: () => number;
  getCardCost: (card: Card) => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  history: [],
  selectedCard: null,

  initializeGame: () => {
    const setup = useSetupStore.getState();

    if (!setup.isSetupComplete()) {
      console.error('Setup not complete');
      return;
    }

    // Initialize the unified logger
    const mode = setup.gameMode === 'ai' ? 'ai' : 'local';
    initializeLogger(
      mode,
      setup.player1Rider,
      setup.player1Dragon,
      setup.player1Deck,
      setup.player2Rider,
      setup.player2Dragon,
      setup.player2Deck,
      setup.gameMode === 'ai' ? setup.aiDifficulty : undefined
    );

    const gameState = createInitialGameState(
      setup.player1Rider!,
      setup.player1Dragon!,
      setup.player2Rider!,
      setup.player2Dragon!,
      setup.player1Deck,
      setup.player2Deck
    );

    // Execute first start phase (this will log via the logger)
    executeStartPhase(gameState);

    set({
      state: gameState,
      history: [],
      selectedCard: null,
    });
  },

  attack: (target) => {
    const { state } = get();
    if (!state || state.phase === 'ended') return;

    // Save state for undo
    const previousState = deepClone(state);

    const result = executeAttack(state, state.activePlayer, target);

    if (result.success) {
      // Log the attack via unified logger
      const logger = getLogger();
      logger?.logAttack(state, target, result.damage?.finalDamage || 0, {
        damageBeforeReduction: result.damage?.rawDamage,
        shieldsAbsorbed: result.damage?.shieldAbsorbed,
        dragonAbility: result.dragonAbility || undefined,
        kaelBonus: result.kaelBonus,
        bronnReduction: result.damage?.damageReduction,
        burnApplied: result.burnApplied,
        freezeApplied: result.frozeTarget,
        splashDamage: result.splashDamage?.finalDamage,
        energyStolen: result.energyStolen,
      });

      // Check win conditions
      const gameEnded = applyWinCondition(state);
      if (gameEnded) {
        logger?.logGameEnd(state, state.winner!, state.winType!);
      }

      set({
        state: { ...state },
        history: [...get().history, previousState],
        selectedCard: null,
      });
    }
  },

  playCard: (cardId, target) => {
    const { state } = get();
    if (!state || state.phase === 'ended') return;

    // Save state for undo
    const previousState = deepClone(state);

    const result = executeCard(state, state.activePlayer, cardId, target);

    if (result.success) {
      // Log the card play via unified logger
      const logger = getLogger();
      logger?.logCardPlayed(
        state,
        result.cardName || 'Unknown',
        result.energySpent || 0,
        result.effects || [],
        {
          morrikBonus: result.morrikBonus,
          damage: result.totalDamage,
          target: result.damageTarget === 'both' ? undefined : result.damageTarget,
          healing: result.healingDone,
          shieldsGained: result.shieldsGained,
          burnApplied: result.burnApplied,
          freezeApplied: result.freezeApplied,
        }
      );

      // Check win conditions
      const gameEnded = applyWinCondition(state);
      if (gameEnded) {
        logger?.logGameEnd(state, state.winner!, state.winType!);
      }

      set({
        state: { ...state },
        history: [...get().history, previousState],
        selectedCard: null,
      });
    }
  },

  endTurn: () => {
    const { state } = get();
    if (!state || state.phase === 'ended') return;

    // Save state for undo
    const previousState = deepClone(state);

    passTurn(state);

    set({
      state: { ...state },
      history: [...get().history, previousState],
      selectedCard: null,
    });
  },

  selectCard: (card) => {
    set({ selectedCard: card });
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      state: previousState,
      history: newHistory,
      selectedCard: null,
    });
  },

  reset: () => {
    clearLogger();
    set({
      state: null,
      history: [],
      selectedCard: null,
    });
  },

  canPlayerAttack: () => {
    const { state } = get();
    if (!state) return false;
    const player = getPlayer(state, state.activePlayer);
    return canAttack(state, player);
  },

  canPlayerPlayCard: (card) => {
    const { state } = get();
    if (!state) return false;
    const player = getPlayer(state, state.activePlayer);
    return canPlayCard(state, player, card);
  },

  getAttackCost: () => {
    const { state } = get();
    if (!state) return 2;
    const player = getPlayer(state, state.activePlayer);
    return getAttackCost(player);
  },

  getCardCost: (card) => {
    const { state } = get();
    if (!state) return card.cost;
    const player = getPlayer(state, state.activePlayer);
    return getCardCost(player, card);
  },
}));
