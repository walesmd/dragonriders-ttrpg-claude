import { describe, it, expect } from 'vitest';
import {
  applyFreeze,
  clearFreeze,
  grantFreezeImmunity,
  clearFreezeImmunity,
} from '../combat';
import { createTestGameState } from './testUtils';

describe('Freeze Mechanics', () => {
  describe('applyFreeze', () => {
    it('should freeze dragon when not immune', () => {
      const state = createTestGameState();

      const success = applyFreeze(state.player1, 'dragon');

      expect(success).toBe(true);
      expect(state.player1.dragonFreezeStacks).toBe(1);
    });

    it('should freeze rider when not immune', () => {
      const state = createTestGameState();

      const success = applyFreeze(state.player1, 'rider');

      expect(success).toBe(true);
      expect(state.player1.riderFreezeStacks).toBe(1);
    });

    it('should not freeze dragon when immune', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeImmune = true;

      const success = applyFreeze(state.player1, 'dragon');

      expect(success).toBe(false);
      expect(state.player1.dragonFreezeStacks).toBe(0);
    });

    it('should not freeze rider when immune', () => {
      const state = createTestGameState();
      state.player1.riderFreezeImmune = true;

      const success = applyFreeze(state.player1, 'rider');

      expect(success).toBe(false);
      expect(state.player1.riderFreezeStacks).toBe(0);
    });

    it('should allow freezing dragon when only rider is immune', () => {
      const state = createTestGameState();
      state.player1.riderFreezeImmune = true;

      const success = applyFreeze(state.player1, 'dragon');

      expect(success).toBe(true);
      expect(state.player1.dragonFreezeStacks).toBe(1);
    });

    it('should allow freezing rider when only dragon is immune', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeImmune = true;

      const success = applyFreeze(state.player1, 'rider');

      expect(success).toBe(true);
      expect(state.player1.riderFreezeStacks).toBe(1);
    });

    it('should freeze already frozen unit (stack/reapply)', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeStacks = 1;

      const success = applyFreeze(state.player1, 'dragon');

      expect(success).toBe(true);
      expect(state.player1.dragonFreezeStacks).toBe(2);
    });
  });

  describe('clearFreeze', () => {
    it('should clear dragon freeze', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeStacks = 1;

      clearFreeze(state.player1, 'dragon');

      expect(state.player1.dragonFreezeStacks).toBe(0);
    });

    it('should clear rider freeze', () => {
      const state = createTestGameState();
      state.player1.riderFreezeStacks = 1;

      clearFreeze(state.player1, 'rider');

      expect(state.player1.riderFreezeStacks).toBe(0);
    });

    it('should only clear specified target', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeStacks = 1;
      state.player1.riderFreezeStacks = 1;

      clearFreeze(state.player1, 'dragon');

      expect(state.player1.dragonFreezeStacks).toBe(0);
      expect(state.player1.riderFreezeStacks).toBe(1);
    });

    it('should work when already not frozen', () => {
      const state = createTestGameState();

      clearFreeze(state.player1, 'dragon');

      expect(state.player1.dragonFreezeStacks).toBe(0);
    });
  });

  describe('grantFreezeImmunity', () => {
    it('should grant dragon freeze immunity', () => {
      const state = createTestGameState();

      grantFreezeImmunity(state.player1, 'dragon');

      expect(state.player1.dragonFreezeImmune).toBe(true);
    });

    it('should grant rider freeze immunity', () => {
      const state = createTestGameState();

      grantFreezeImmunity(state.player1, 'rider');

      expect(state.player1.riderFreezeImmune).toBe(true);
    });

    it('should only grant to specified target', () => {
      const state = createTestGameState();

      grantFreezeImmunity(state.player1, 'dragon');

      expect(state.player1.dragonFreezeImmune).toBe(true);
      expect(state.player1.riderFreezeImmune).toBe(false);
    });
  });

  describe('clearFreezeImmunity', () => {
    it('should clear both dragon and rider immunity', () => {
      const state = createTestGameState();
      state.player1.dragonFreezeImmune = true;
      state.player1.riderFreezeImmune = true;

      clearFreezeImmunity(state.player1);

      expect(state.player1.dragonFreezeImmune).toBe(false);
      expect(state.player1.riderFreezeImmune).toBe(false);
    });

    it('should work when already not immune', () => {
      const state = createTestGameState();

      clearFreezeImmunity(state.player1);

      expect(state.player1.dragonFreezeImmune).toBe(false);
      expect(state.player1.riderFreezeImmune).toBe(false);
    });
  });

  describe('Freeze flow integration', () => {
    it('should follow proper freeze -> clear -> immunity -> clear immunity cycle', () => {
      const state = createTestGameState();

      // Apply freeze
      applyFreeze(state.player1, 'dragon');
      expect(state.player1.dragonFreezeStacks).toBe(1);
      expect(state.player1.dragonFreezeImmune).toBe(false);

      // Clear freeze and grant immunity (end of turn)
      clearFreeze(state.player1, 'dragon');
      grantFreezeImmunity(state.player1, 'dragon');
      expect(state.player1.dragonFreezeStacks).toBe(0);
      expect(state.player1.dragonFreezeImmune).toBe(true);

      // Try to freeze again (should fail due to immunity)
      const success = applyFreeze(state.player1, 'dragon');
      expect(success).toBe(false);
      expect(state.player1.dragonFreezeStacks).toBe(0);

      // Clear immunity (start of opponent's turn)
      clearFreezeImmunity(state.player1);
      expect(state.player1.dragonFreezeImmune).toBe(false);

      // Now freeze should work again
      const success2 = applyFreeze(state.player1, 'dragon');
      expect(success2).toBe(true);
      expect(state.player1.dragonFreezeStacks).toBe(1);
    });

    it('should track both dragon and rider freeze independently', () => {
      const state = createTestGameState();

      applyFreeze(state.player1, 'dragon');
      applyFreeze(state.player1, 'rider');

      expect(state.player1.dragonFreezeStacks).toBe(1);
      expect(state.player1.riderFreezeStacks).toBe(1);

      clearFreeze(state.player1, 'dragon');

      expect(state.player1.dragonFreezeStacks).toBe(0);
      expect(state.player1.riderFreezeStacks).toBe(1);
    });

    it('should track immunity independently for dragon and rider', () => {
      const state = createTestGameState();

      grantFreezeImmunity(state.player1, 'dragon');

      expect(applyFreeze(state.player1, 'dragon')).toBe(false);
      expect(applyFreeze(state.player1, 'rider')).toBe(true);

      expect(state.player1.dragonFreezeStacks).toBe(0);
      expect(state.player1.riderFreezeStacks).toBe(1);
    });
  });
});
