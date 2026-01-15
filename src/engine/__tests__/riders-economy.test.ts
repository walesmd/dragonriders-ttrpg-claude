import { describe, it, expect } from 'vitest';
import { isWounded, isCritical } from '../../data/riders';
import { calculateEconomy, calculateEnergyBreakdown } from '../economy';
import { calculateDamageReduction } from '../combat';
import { getAttackCost } from '../validation';
import { createTestGameState } from './testUtils';

describe('Rider Breakpoints and Economy', () => {
  describe('isWounded and isCritical', () => {
    it('should detect wounded state at threshold', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      expect(isWounded(state.player1.rider)).toBe(true);
      expect(isCritical(state.player1.rider)).toBe(false);
    });

    it('should detect critical state at threshold', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      expect(isWounded(state.player1.rider)).toBe(true);
      expect(isCritical(state.player1.rider)).toBe(true);
    });

    it('should not be wounded above threshold', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold + 1;

      expect(isWounded(state.player1.rider)).toBe(false);
    });

    it('should respect forceWounded flag', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.maxHp;
      state.player1.rider.forceWounded = true;

      expect(isWounded(state.player1.rider)).toBe(true);
    });

    it('should critical state implies wounded', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      expect(isCritical(state.player1.rider)).toBe(true);
      expect(isWounded(state.player1.rider)).toBe(true);
    });
  });

  describe('Talia economy', () => {
    it('should have base 2 + 1 dragon bonus when healthy', () => {
      const state = createTestGameState('Talia', 'Emberfang');

      const eco = calculateEconomy(state.player1);

      expect(eco).toBe(3); // 2 base + 1 dragon bonus
    });

    it('should lose 1 economy when wounded', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      const eco = calculateEconomy(state.player1);

      expect(eco).toBe(2); // 2 base + 1 dragon - 1 wounded = 2
    });

    it('should lose dragon bonus when critical', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      const eco = calculateEconomy(state.player1);

      expect(eco).toBe(1); // 2 base - 1 wounded, no dragon bonus = 1
    });

    it('should not get dragon bonus when dragon is dead', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.dragon.hp = 0;

      const eco = calculateEconomy(state.player1);

      expect(eco).toBe(2); // 2 base, no dragon bonus
    });

    it('should not go below 0 economy', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;
      state.player1.dragon.hp = 0;

      const eco = calculateEconomy(state.player1);

      expect(eco).toBe(1); // 2 base - 1 wounded = 1
    });
  });

  describe('Kael first attack bonus', () => {
    it('should cost +1 energy to attack when critical', () => {
      const state = createTestGameState('Kael', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      const dragonCost = getAttackCost(state.player1, 'dragon');
      const riderCost = getAttackCost(state.player1, 'rider');

      expect(dragonCost).toBe(3); // 2 base + 1 critical penalty
      expect(riderCost).toBe(4); // 2 base + 1 rider + 1 critical penalty
    });

    it('should cost normal when not critical', () => {
      const state = createTestGameState('Kael', 'Emberfang');

      const dragonCost = getAttackCost(state.player1, 'dragon');
      const riderCost = getAttackCost(state.player1, 'rider');

      expect(dragonCost).toBe(2); // Normal dragon attack cost
      expect(riderCost).toBe(3); // Rider attacks cost +1
    });
  });

  describe('Bronn damage reduction', () => {
    it('should reduce all damage by 1 when healthy', () => {
      const state = createTestGameState('Bronn', 'Emberfang');

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(1);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(1);
    });

    it('should only reduce dragon damage when wounded', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(1);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(0);
    });

    it('should not reduce damage when critical', () => {
      const state = createTestGameState('Bronn', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      expect(calculateDamageReduction(state.player1, 'dragon')).toBe(0);
      expect(calculateDamageReduction(state.player1, 'rider')).toBe(0);
    });
  });

  describe('Energy breakdown calculation', () => {
    it('should calculate base energy correctly', () => {
      const state = createTestGameState('Talia', 'Emberfang');

      const breakdown = calculateEnergyBreakdown(state.player1);

      expect(breakdown.base).toBe(3);
      expect(breakdown.riderBonus).toBe(2);
      expect(breakdown.dragonAliveBonus).toBe(1);
    });

    it('should show wounded penalty for Talia', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;

      const breakdown = calculateEnergyBreakdown(state.player1);

      expect(breakdown.base).toBe(3);
      expect(breakdown.riderBonus).toBe(1); // 2 - 1 wounded
      expect(breakdown.dragonAliveBonus).toBe(1);
    });

    it('should not show dragon bonus when critical', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.criticalThreshold;

      const breakdown = calculateEnergyBreakdown(state.player1);

      expect(breakdown.base).toBe(3);
      expect(breakdown.riderBonus).toBe(1); // 2 - 1 wounded
      expect(breakdown.dragonAliveBonus).toBeUndefined();
    });

    it('should work for riders without special economy', () => {
      const state = createTestGameState('Kael', 'Emberfang');

      const breakdown = calculateEnergyBreakdown(state.player1);

      expect(breakdown.base).toBe(3);
      expect(breakdown.riderBonus).toBe(1);
      expect(breakdown.dragonAliveBonus).toBeUndefined();
    });
  });

  describe('All rider breakpoints', () => {
    const riders = [
      { name: 'Talia' as const, wounded: 13, critical: 7 },
      { name: 'Kael' as const, wounded: 12, critical: 6 },
      { name: 'Bronn' as const, wounded: 14, critical: 8 },
      { name: 'Lyra' as const, wounded: 12, critical: 6 },
      { name: 'Morrik' as const, wounded: 14, critical: 8 },
    ];

    riders.forEach(({ name, wounded, critical }) => {
      it(`${name} should have correct thresholds`, () => {
        const state = createTestGameState(name, 'Emberfang');

        expect(state.player1.rider.woundedThreshold).toBe(wounded);
        expect(state.player1.rider.criticalThreshold).toBe(critical);

        // Test wounded boundary
        state.player1.rider.hp = wounded + 1;
        expect(isWounded(state.player1.rider)).toBe(false);

        state.player1.rider.hp = wounded;
        expect(isWounded(state.player1.rider)).toBe(true);

        // Test critical boundary
        state.player1.rider.hp = critical + 1;
        expect(isCritical(state.player1.rider)).toBe(false);

        state.player1.rider.hp = critical;
        expect(isCritical(state.player1.rider)).toBe(true);
      });
    });
  });
});
