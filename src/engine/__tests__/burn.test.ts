import { describe, it, expect } from 'vitest';
import { applyBurn } from '../combat';
import { executeStartPhase } from '../phases';
import { createTestGameState } from './testUtils';

describe('Burn Mechanics', () => {
  describe('applyBurn', () => {
    it('should apply burn stacks to dragon', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 2);

      expect(state.player1.dragonBurn).toBe(2);
    });

    it('should apply burn stacks to rider', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'rider', 1);

      expect(state.player1.riderBurn).toBe(1);
    });

    it('should stack burn on multiple applications', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 1);
      applyBurn(state.player1, 'dragon', 2);

      expect(state.player1.dragonBurn).toBe(3);
    });

    it('should track dragon and rider burn independently', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 2);
      applyBurn(state.player1, 'rider', 3);

      expect(state.player1.dragonBurn).toBe(2);
      expect(state.player1.riderBurn).toBe(3);
    });

    it('should apply multiple stacks at once', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 5);

      expect(state.player1.dragonBurn).toBe(5);
    });

    it('should handle 0 burn stacks', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 0);

      expect(state.player1.dragonBurn).toBe(0);
    });
  });

  describe('Burn damage at start of turn', () => {
    it('should deal dragon burn damage at start of turn', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragonBurn = 3;
      const initialHp = state.player1.dragon.hp;

      executeStartPhase(state);

      expect(state.player1.dragon.hp).toBe(initialHp - 3);
    });

    it('should deal rider burn damage at start of turn', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.riderBurn = 2;
      const initialHp = state.player1.rider.hp;

      executeStartPhase(state);

      expect(state.player1.rider.hp).toBe(initialHp - 2);
    });

    it('should deal both dragon and rider burn damage', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragonBurn = 2;
      state.player1.riderBurn = 1;
      const initialDragonHp = state.player1.dragon.hp;
      const initialRiderHp = state.player1.rider.hp;

      executeStartPhase(state);

      expect(state.player1.dragon.hp).toBe(initialDragonHp - 2);
      expect(state.player1.rider.hp).toBe(initialRiderHp - 1);
    });

    it('should not deal damage when burn is 0', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragonBurn = 0;
      state.player1.riderBurn = 0;
      const initialDragonHp = state.player1.dragon.hp;
      const initialRiderHp = state.player1.rider.hp;

      executeStartPhase(state);

      expect(state.player1.dragon.hp).toBe(initialDragonHp);
      expect(state.player1.rider.hp).toBe(initialRiderHp);
    });

    it('should keep burn stacks after dealing damage', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragonBurn = 3;
      state.player1.riderBurn = 2;

      executeStartPhase(state);

      // Burn persists until explicitly removed
      expect(state.player1.dragonBurn).toBe(3);
      expect(state.player1.riderBurn).toBe(2);
    });

    it('should deal burn damage every turn', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragonBurn = 2;
      const initialHp = state.player1.dragon.hp;

      // First turn
      executeStartPhase(state);
      expect(state.player1.dragon.hp).toBe(initialHp - 2);

      // Simulate passing turn and coming back
      state.turnPhase = 'start';
      const hpAfterFirstBurn = state.player1.dragon.hp;

      executeStartPhase(state);
      expect(state.player1.dragon.hp).toBe(hpAfterFirstBurn - 2);
    });

    it('should potentially kill units with burn', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragon.hp = 2;
      state.player1.dragonBurn = 5;

      executeStartPhase(state);

      expect(state.player1.dragon.hp).toBe(-3);
      expect(state.phase).toBe('ended');
      expect(state.winner).toBe(2);
    });
  });

  describe('Burn stacking scenarios', () => {
    it('should handle large burn stacks', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 10);
      applyBurn(state.player1, 'dragon', 10);

      expect(state.player1.dragonBurn).toBe(20);
    });

    it('should track burn for both players independently', () => {
      const state = createTestGameState();

      applyBurn(state.player1, 'dragon', 3);
      applyBurn(state.player2, 'dragon', 5);

      expect(state.player1.dragonBurn).toBe(3);
      expect(state.player2.dragonBurn).toBe(5);
    });

    it('should allow clearing burn by setting to 0', () => {
      const state = createTestGameState();
      state.player1.dragonBurn = 5;
      state.player1.riderBurn = 3;

      state.player1.dragonBurn = 0;
      state.player1.riderBurn = 0;

      expect(state.player1.dragonBurn).toBe(0);
      expect(state.player1.riderBurn).toBe(0);
    });
  });
});
