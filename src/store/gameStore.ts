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

    const gameState = createInitialGameState(
      setup.player1Rider!,
      setup.player1Dragon!,
      setup.player2Rider!,
      setup.player2Dragon!,
      setup.player1Deck,
      setup.player2Deck
    );

    // Execute first start phase
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
      // Log the attack
      state.actionLog.push({
        turn: state.turn,
        player: state.activePlayer,
        action: `Attacked ${target}`,
        details: {
          damage: result.damage?.finalDamage,
          kaelBonus: result.kaelBonus,
          dragonAbility: result.dragonAbility,
        },
        timestamp: Date.now(),
      });

      // Check win conditions
      applyWinCondition(state);

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
      // Log the card play
      state.actionLog.push({
        turn: state.turn,
        player: state.activePlayer,
        action: `Played ${result.cardName}`,
        details: {
          cost: result.energySpent,
          morrikBonus: result.morrikBonus,
          effects: result.effects,
        },
        timestamp: Date.now(),
      });

      // Check win conditions
      applyWinCondition(state);

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
