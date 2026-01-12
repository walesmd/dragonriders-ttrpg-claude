import { describe, it, expect } from 'vitest';
import {
  damageDragon,
  damageRider,
  calculateDamageReduction,
  healDragon,
  healRider,
  addShields,
} from '../combat';
import { createTestGameState, setPlayerHp } from './testUtils';

describe('Damage Calculation', () => {
  describe('damageDragon', () => {
    it('should deal full damage when no shields or reduction', () => {
      const state = createTestGameState();
      state.player1.dragon.shields = 0;
      const initialHp = state.player1.dragon.hp;

      const result = damageDragon(state, state.player1, 5);

      expect(result.rawDamage).toBe(5);
      expect(result.damageReduction).toBe(0);
      expect(result.shieldAbsorbed).toBe(0);
      expect(result.finalDamage).toBe(5);
      expect(state.player1.dragon.hp).toBe(initialHp - 5);
    });

    it('should absorb damage with shields first', () => {
      const state = createTestGameState();
      state.player1.dragon.shields = 3;
      const initialHp = state.player1.dragon.hp;

      const result = damageDragon(state, state.player1, 5);

      expect(result.shieldAbsorbed).toBe(3);
      expect(result.finalDamage).toBe(2);
      expect(state.player1.dragon.shields).toBe(0);
      expect(state.player1.dragon.hp).toBe(initialHp - 2);
    });

    it('should fully absorb damage with sufficient shields', () => {
      const state = createTestGameState();
      state.player1.dragon.shields = 10;
      const initialHp = state.player1.dragon.hp;

      const result = damageDragon(state, state.player1, 5);

      expect(result.shieldAbsorbed).toBe(5);
      expect(result.finalDamage).toBe(0);
      expect(state.player1.dragon.shields).toBe(5);
      expect(state.player1.dragon.hp).toBe(initialHp);
    });

    it('should trigger Steelhorn counter when attacking', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player2.dragon.shields = 0;
      state.player1.energy = 10;

      const result = damageDragon(state, state.player2, 5, 1);

      expect(result.triggeredSteelhorn).toBe(true);
      expect(state.player1.energy).toBe(9); // Lost 1 energy
    });

    it('should not trigger Steelhorn if damage fully absorbed by shields', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player2.dragon.shields = 10;
      state.player1.energy = 10;

      const result = damageDragon(state, state.player2, 5, 1);

      expect(result.triggeredSteelhorn).toBe(false);
      expect(state.player1.energy).toBe(10); // No energy lost
    });

    it('should not trigger Steelhorn if no attacker specified', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player2.dragon.shields = 0;

      const result = damageDragon(state, state.player2, 5);

      expect(result.triggeredSteelhorn).toBe(false);
    });

    it('should apply Bronn damage reduction (normal state)', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Bronn', 'Cryowyrm');
      state.player2.dragon.shields = 0;

      const result = damageDragon(state, state.player2, 5);

      expect(result.damageReduction).toBe(1);
      expect(result.finalDamage).toBe(4); // 5 - 1 reduction
    });

    it('should apply Bronn reduction to dragon only when wounded', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Bronn', 'Cryowyrm');
      state.player2.rider.hp = state.player2.rider.woundedThreshold; // Make wounded
      state.player2.dragon.shields = 0;

      const result = damageDragon(state, state.player2, 5);

      expect(result.damageReduction).toBe(1);
      expect(result.finalDamage).toBe(4);
    });

    it('should not apply Bronn reduction when critical', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Bronn', 'Cryowyrm');
      state.player2.rider.hp = state.player2.rider.criticalThreshold; // Make critical
      state.player2.dragon.shields = 0;

      const result = damageDragon(state, state.player2, 5);

      expect(result.damageReduction).toBe(0);
      expect(result.finalDamage).toBe(5);
    });

    it('should handle 0 damage', () => {
      const state = createTestGameState();
      const initialHp = state.player1.dragon.hp;

      const result = damageDragon(state, state.player1, 0);

      expect(result.finalDamage).toBe(0);
      expect(state.player1.dragon.hp).toBe(initialHp);
    });

    it('should not deal negative damage with high reduction', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Bronn', 'Cryowyrm');
      state.player2.dragon.shields = 0;
      const initialHp = state.player2.dragon.hp;

      const result = damageDragon(state, state.player2, 1);

      expect(result.finalDamage).toBe(0); // 1 - 1 reduction = 0, not negative
      expect(state.player2.dragon.hp).toBe(initialHp);
    });
  });

  describe('damageRider', () => {
    it('should deal full damage when no reduction', () => {
      const state = createTestGameState();
      const initialHp = state.player1.rider.hp;

      const result = damageRider(state.player1, 5);

      expect(result.rawDamage).toBe(5);
      expect(result.damageReduction).toBe(0);
      expect(result.finalDamage).toBe(5);
      expect(result.shieldAbsorbed).toBe(0); // Riders don't have shields
      expect(state.player1.rider.hp).toBe(initialHp - 5);
    });

    it('should apply Bronn damage reduction (normal state)', () => {
      const state = createTestGameState('Bronn', 'Emberfang');

      const result = damageRider(state.player1, 5);

      expect(result.damageReduction).toBe(1);
      expect(result.finalDamage).toBe(4);
    });

    it('should not reduce rider damage when Bronn is wounded', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      const result = damageRider(state.player1, 5);

      expect(result.damageReduction).toBe(0);
      expect(result.finalDamage).toBe(5);
    });

    it('should not apply Bronn reduction when critical', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      const result = damageRider(state.player1, 5);

      expect(result.damageReduction).toBe(0);
      expect(result.finalDamage).toBe(5);
    });

    it('should handle 0 damage', () => {
      const state = createTestGameState();
      const initialHp = state.player1.rider.hp;

      const result = damageRider(state.player1, 0);

      expect(result.finalDamage).toBe(0);
      expect(state.player1.rider.hp).toBe(initialHp);
    });
  });

  describe('calculateDamageReduction', () => {
    it('should return 0 for non-Bronn riders', () => {
      const state = createTestGameState('Talia', 'Emberfang');

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(0);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(0);
    });

    it('should return 1 for Bronn in normal state', () => {
      const state = createTestGameState('Bronn', 'Emberfang');

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(1);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(1);
    });

    it('should return 1 for dragon, 0 for rider when Bronn is wounded', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(1);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(0);
    });

    it('should return 0 when Bronn is critical', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(0);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(0);
    });
  });

  describe('healDragon', () => {
    it('should heal dragon up to max HP', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = state.player1.dragon.maxHp - 10;

      const healed = healDragon(state.player1, 5);

      expect(healed).toBe(5);
      expect(state.player1.dragon.hp).toBe(state.player1.dragon.maxHp - 5);
    });

    it('should not heal beyond max HP', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = state.player1.dragon.maxHp - 3;

      const healed = healDragon(state.player1, 10);

      expect(healed).toBe(3);
      expect(state.player1.dragon.hp).toBe(state.player1.dragon.maxHp);
    });

    it('should heal 0 when at full HP', () => {
      const state = createTestGameState();

      const healed = healDragon(state.player1, 10);

      expect(healed).toBe(0);
      expect(state.player1.dragon.hp).toBe(state.player1.dragon.maxHp);
    });
  });

  describe('healRider', () => {
    it('should heal rider up to max HP', () => {
      const state = createTestGameState();
      state.player1.rider.hp = state.player1.rider.maxHp - 10;

      const healed = healRider(state.player1, 5);

      expect(healed).toBe(5);
      expect(state.player1.rider.hp).toBe(state.player1.rider.maxHp - 5);
    });

    it('should not heal beyond max HP', () => {
      const state = createTestGameState();
      state.player1.rider.hp = state.player1.rider.maxHp - 3;

      const healed = healRider(state.player1, 10);

      expect(healed).toBe(3);
      expect(state.player1.rider.hp).toBe(state.player1.rider.maxHp);
    });

    it('should remove forceWounded when healing above wounded threshold', () => {
      const state = createTestGameState();
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.rider.forceWounded = true;

      healRider(state.player1, 5);

      expect(state.player1.rider.forceWounded).toBe(false);
    });

    it('should not remove forceWounded when still below threshold', () => {
      const state = createTestGameState();
      state.player1.rider.hp = state.player1.rider.woundedThreshold - 5;
      state.player1.rider.forceWounded = true;

      healRider(state.player1, 1);

      expect(state.player1.rider.forceWounded).toBe(true);
    });
  });

  describe('addShields', () => {
    it('should add shields normally', () => {
      const state = createTestGameState();
      state.player1.dragon.shields = 2;

      const added = addShields(state.player1, 3);

      expect(added).toBe(3);
      expect(state.player1.dragon.shields).toBe(5);
    });

    it('should halve shields for wounded Morrik (round up)', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.dragon.shields = 0;

      const added = addShields(state.player1, 5);

      expect(added).toBe(3); // ceil(5/2)
      expect(state.player1.dragon.shields).toBe(3);
    });

    it('should halve odd number shields for wounded Morrik correctly', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.dragon.shields = 0;

      const added = addShields(state.player1, 3);

      expect(added).toBe(2); // ceil(3/2)
      expect(state.player1.dragon.shields).toBe(2);
    });

    it('should not halve shields for non-wounded Morrik', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.dragon.shields = 0;

      const added = addShields(state.player1, 5);

      expect(added).toBe(5);
      expect(state.player1.dragon.shields).toBe(5);
    });

    it('should not halve shields for other riders when wounded', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.dragon.shields = 0;

      const added = addShields(state.player1, 5);

      expect(added).toBe(5);
      expect(state.player1.dragon.shields).toBe(5);
    });
  });
});
