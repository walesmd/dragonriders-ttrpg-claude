import { create } from 'zustand';
import type {
  GameMode,
  SetupPhase,
  AIDifficulty,
  RiderName,
  DragonName,
  Card,
} from '../data/types';
import { createCardPool, DECK_SIZE } from '../data/cards';
import { RIDERS } from '../data/riders';
import { DRAGONS } from '../data/dragons';
import { shuffleArray } from '../utils/helpers';

const ALL_RIDERS = Object.keys(RIDERS) as RiderName[];
const ALL_DRAGONS = Object.keys(DRAGONS) as DragonName[];

interface SetupState {
  // Mode
  gameMode: GameMode | null;
  aiDifficulty: AIDifficulty;

  // Phase
  phase: SetupPhase;

  // Selections
  player1Rider: RiderName | null;
  player2Rider: RiderName | null;
  player1Dragon: DragonName | null;
  player2Dragon: DragonName | null;

  // Draft
  draftPool: Card[]; // Hidden cards not yet visible
  visiblePool: Card[]; // 5 visible cards players can draft from
  player1Deck: Card[];
  player2Deck: Card[];
  currentDrafter: 1 | 2;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  selectRider: (player: 1 | 2, rider: RiderName) => void;
  selectDragon: (player: 1 | 2, dragon: DragonName) => void;
  draftCard: (cardId: string) => void;
  initializeDraft: () => void;
  reset: () => void;
  isSetupComplete: () => boolean;
}

const initialState = {
  gameMode: null as GameMode | null,
  aiDifficulty: 'medium' as AIDifficulty,
  phase: 'menu' as SetupPhase,
  player1Rider: null as RiderName | null,
  player2Rider: null as RiderName | null,
  player1Dragon: null as DragonName | null,
  player2Dragon: null as DragonName | null,
  draftPool: [] as Card[],
  visiblePool: [] as Card[],
  player1Deck: [] as Card[],
  player2Deck: [] as Card[],
  currentDrafter: 1 as 1 | 2,
};

export const useSetupStore = create<SetupState>((set, get) => ({
  ...initialState,

  setGameMode: (mode) =>
    set({
      gameMode: mode,
      phase: 'p1-rider',
    }),

  setAIDifficulty: (difficulty) =>
    set({ aiDifficulty: difficulty }),

  selectRider: (player, rider) => {
    const state = get();

    if (player === 1) {
      if (state.gameMode === 'ai') {
        // AI mode: P1 selects, then go straight to P1 dragon
        set({
          player1Rider: rider,
          phase: 'p1-dragon',
        });
      } else {
        // Local mode: P1 selects, then P2 selects
        set({
          player1Rider: rider,
          phase: 'p2-rider',
        });
      }
    } else {
      set({
        player2Rider: rider,
        phase: 'p1-dragon',
      });
    }
  },

  selectDragon: (player, dragon) => {
    const state = get();

    if (player === 1) {
      if (state.gameMode === 'ai') {
        // AI mode: Pick random rider/dragon for AI, then go to draft
        const availableRiders = ALL_RIDERS.filter((r) => r !== state.player1Rider);
        const availableDragons = ALL_DRAGONS.filter((d) => d !== dragon);
        const aiRider = availableRiders[Math.floor(Math.random() * availableRiders.length)];
        const aiDragon = availableDragons[Math.floor(Math.random() * availableDragons.length)];

        set({
          player1Dragon: dragon,
          player2Rider: aiRider,
          player2Dragon: aiDragon,
          phase: 'draft',
        });
        get().initializeDraft();
      } else {
        set({
          player1Dragon: dragon,
          phase: 'p2-dragon',
        });
      }
    } else {
      set({
        player2Dragon: dragon,
        phase: 'draft',
      });
      get().initializeDraft();
    }
  },

  initializeDraft: () => {
    const pool = createCardPool();
    const shuffled = shuffleArray(pool);

    // Take first 5 cards as visible pool, rest as hidden pool
    const visible = shuffled.slice(0, 5);
    const hidden = shuffled.slice(5);

    set({
      visiblePool: visible,
      draftPool: hidden,
      player1Deck: [],
      player2Deck: [],
      currentDrafter: 1,
    });
  },

  draftCard: (cardId) => {
    const state = get();
    // Find card in visible pool
    const cardIndex = state.visiblePool.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;

    const card = state.visiblePool[cardIndex];
    const newVisiblePool = [...state.visiblePool];
    newVisiblePool.splice(cardIndex, 1);

    // Refill visible pool from hidden pool if available
    const newDraftPool = [...state.draftPool];
    if (newDraftPool.length > 0) {
      const nextCard = newDraftPool.shift()!; // Take first card from hidden pool
      newVisiblePool.push(nextCard);
    }

    if (state.currentDrafter === 1) {
      const newDeck = [...state.player1Deck, card];
      const deckComplete = newDeck.length >= DECK_SIZE;

      set({
        draftPool: newDraftPool,
        visiblePool: newVisiblePool,
        player1Deck: newDeck,
        currentDrafter: deckComplete && state.player2Deck.length < DECK_SIZE ? 2 :
                        !deckComplete ? 2 : 1,
        phase: deckComplete && state.player2Deck.length >= DECK_SIZE ? 'complete' : 'draft',
      });
    } else {
      const newDeck = [...state.player2Deck, card];
      const deckComplete = newDeck.length >= DECK_SIZE;

      set({
        draftPool: newDraftPool,
        visiblePool: newVisiblePool,
        player2Deck: newDeck,
        currentDrafter: deckComplete && state.player1Deck.length < DECK_SIZE ? 1 :
                        !deckComplete ? 1 : 2,
        phase: deckComplete && state.player1Deck.length >= DECK_SIZE ? 'complete' : 'draft',
      });
    }
  },

  reset: () => set(initialState),

  isSetupComplete: () => {
    const state = get();
    return (
      state.player1Rider !== null &&
      state.player2Rider !== null &&
      state.player1Dragon !== null &&
      state.player2Dragon !== null &&
      state.player1Deck.length >= DECK_SIZE &&
      state.player2Deck.length >= DECK_SIZE
    );
  },
}));
