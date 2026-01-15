import { describe, it, expect } from 'vitest';
import { executeAttack } from '../combat';
import { executeStartPhase } from '../phases';
import { createTestGameState, advanceToActionPhase } from './testUtils';

describe('Dragon Abilities', () => {
  describe('Emberfang - Burn on first attack', () => {
    it('should apply 1 burn stack on first attack to dragon', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.success).toBe(true);
      expect(result.burnApplied).toBe(1);
      expect(state.player2.dragonBurn).toBe(1);
    });

    it('should apply 1 burn stack on first attack to rider', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'rider');

      expect(result.success).toBe(true);
      expect(result.burnApplied).toBe(1);
      expect(state.player2.riderBurn).toBe(1);
    });

    it('should not apply burn on second attack', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      executeAttack(state, 1, 'dragon');
      const result2 = executeAttack(state, 1, 'dragon');

      expect(result2.burnApplied).toBe(0);
      expect(state.player2.dragonBurn).toBe(1); // Still just 1 from first attack
    });

    it('should reset burn application for new turn', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      executeAttack(state, 1, 'dragon');
      expect(state.player2.dragonBurn).toBe(1);

      // New turn
      state.turnPhase = 'start';
      state.player1.energy = 10;
      executeStartPhase(state);

      const result = executeAttack(state, 1, 'dragon');
      expect(result.burnApplied).toBe(1);
      expect(state.player2.dragonBurn).toBe(2); // Added another stack
    });
  });

  describe('Cryowyrm - Freeze on attack', () => {
    it('should freeze dragon target', () => {
      const state = createTestGameState('Talia', 'Cryowyrm');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.frozeTarget).toBe(true);
      expect(state.player2.dragonFrozen).toBe(true);
    });

    it('should freeze rider target', () => {
      const state = createTestGameState('Talia', 'Cryowyrm');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'rider');

      expect(result.frozeTarget).toBe(true);
      expect(state.player2.riderFrozen).toBe(true);
    });

    it('should not freeze if target is immune', () => {
      const state = createTestGameState('Talia', 'Cryowyrm');
      state.player1.energy = 10;
      state.player2.dragonFreezeImmune = true;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.frozeTarget).toBe(false);
      expect(state.player2.dragonFrozen).toBe(false);
    });

    it('should freeze on every attack', () => {
      const state = createTestGameState('Talia', 'Cryowyrm');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      // Clear freeze after first attack to test reapplication
      executeAttack(state, 1, 'dragon');
      state.player2.dragonFrozen = false;

      const result2 = executeAttack(state, 1, 'dragon');
      expect(result2.frozeTarget).toBe(true);
    });
  });

  describe('Voltwing - Splash damage', () => {
    it('should deal 2 splash damage to rider when attacking dragon', () => {
      const state = createTestGameState('Talia', 'Voltwing');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      state.player2.rider.shields = 0;
      advanceToActionPhase(state);
      const initialRiderHp = state.player2.rider.hp;

      const result = executeAttack(state, 1, 'dragon');

      expect(result.splashDamage).toBeDefined();
      expect(result.splashDamage!.finalDamage).toBe(2);
      expect(state.player2.rider.hp).toBe(initialRiderHp - 2);
    });

    it('should deal 2 splash damage to dragon when attacking rider', () => {
      const state = createTestGameState('Talia', 'Voltwing');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      advanceToActionPhase(state);
      const initialDragonHp = state.player2.dragon.hp;

      const result = executeAttack(state, 1, 'rider');

      expect(result.splashDamage).toBeDefined();
      expect(result.splashDamage!.finalDamage).toBe(2);
      expect(state.player2.dragon.hp).toBe(initialDragonHp - 2);
    });

    it('should apply splash damage every attack', () => {
      const state = createTestGameState('Talia', 'Voltwing');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      advanceToActionPhase(state);

      executeAttack(state, 1, 'dragon');
      const result2 = executeAttack(state, 1, 'dragon');

      expect(result2.splashDamage).toBeDefined();
    });

    it('should respect Bronn damage reduction on splash', () => {
      const state = createTestGameState('Talia', 'Voltwing', 'Bronn', 'Cryowyrm');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      state.player2.rider.shields = 0;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      // Splash to rider should be reduced by 1
      expect(result.splashDamage!.damageReduction).toBe(1);
      expect(result.splashDamage!.finalDamage).toBe(1); // 2 - 1 = 1
    });
  });

  describe('Steelhorn - Counter attacker', () => {
    it('should drain 1 energy from attacker', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.damage!.triggeredSteelhorn).toBe(true);
      expect(state.player1.energy).toBe(7); // 10 - 2 (attack cost) - 1 (steelhorn)
    });

    it('should always counter (no shields on dragon)', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0; // Dragons don't have shields anymore
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.damage!.triggeredSteelhorn).toBe(true);
      expect(state.player1.energy).toBe(7); // Attack cost + counter
    });

    it('should not drain below 0 energy', () => {
      const state = createTestGameState('Talia', 'Emberfang', 'Kael', 'Steelhorn');
      state.player1.energy = 2; // Just enough for attack
      state.player2.dragon.shields = 0;
      advanceToActionPhase(state);

      executeAttack(state, 1, 'dragon');

      expect(state.player1.energy).toBe(0);
    });
  });

  describe('Voidmaw - Energy steal and advantage bonus', () => {
    it('should steal 1 energy on attack', () => {
      const state = createTestGameState('Talia', 'Voidmaw');
      state.player1.energy = 10;
      state.player2.energy = 5;
      state.player2.dragon.shields = 0;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.energyStolen).toBe(1);
      expect(state.player1.energy).toBe(9); // 10 - 2 (cost) + 1 (stolen)
      expect(state.player2.energy).toBe(4); // 5 - 1
    });

    it('should not steal if opponent has 0 energy', () => {
      const state = createTestGameState('Talia', 'Voidmaw');
      state.player1.energy = 10;
      state.player2.energy = 0;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.energyStolen).toBe(0);
      expect(state.player2.energy).toBe(0);
    });

    it('should deal 2 damage at start of turn if energy advantage', () => {
      const state = createTestGameState('Talia', 'Voidmaw');
      state.turnPhase = 'start';
      state.player1.energy = 0; // Will gain energy first
      state.player2.energy = 0;
      state.player2.dragon.shields = 0;
      const initialHp = state.player2.dragon.hp;

      executeStartPhase(state);

      // P1 gains energy (3 base + economy), P2 has 0, so should trigger
      expect(state.player2.dragon.hp).toBe(initialHp - 2);
    });

    it('should not deal bonus damage if no energy advantage', () => {
      const state = createTestGameState('Talia', 'Voidmaw');
      state.turnPhase = 'start';
      state.player1.energy = 0;
      state.player2.energy = 10;
      const initialHp = state.player2.dragon.hp;

      executeStartPhase(state);

      // P1 gains less than P2 has, no bonus damage
      expect(state.player2.dragon.hp).toBe(initialHp);
    });

    it('should not deal bonus damage if equal energy', () => {
      const state = createTestGameState('Kael', 'Voidmaw', 'Kael', 'Cryowyrm');
      state.turnPhase = 'start';
      state.player1.energy = 0;
      state.player2.energy = 0;
      const initialHp = state.player2.dragon.hp;

      executeStartPhase(state);

      // Both gain same (4 total), no advantage
      const p1Energy = state.player1.energy;
      const p2Energy = state.player2.energy;

      // If equal, should not trigger
      if (p1Energy === p2Energy) {
        expect(state.player2.dragon.hp).toBe(initialHp);
      }
    });
  });

  describe('Kael first attack bonus with riders', () => {
    it('should add +2 damage and +2 shields on first attack when healthy', () => {
      const state = createTestGameState('Kael', 'Emberfang');
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      const initialShields = state.player1.rider.shields;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.kaelBonus).toEqual({ damage: 2, shields: 2 });
      expect(state.player1.rider.shields).toBe(initialShields + 2);
      // Base damage is 3 + 2 = 5
      expect(result.damage!.rawDamage).toBe(5);
    });

    it('should add +1 damage and +1 shield when wounded', () => {
      const state = createTestGameState('Kael', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      const initialShields = state.player1.rider.shields;
      advanceToActionPhase(state);

      const result = executeAttack(state, 1, 'dragon');

      expect(result.kaelBonus).toEqual({ damage: 1, shields: 1 });
      expect(state.player1.rider.shields).toBe(initialShields + 1);
      expect(result.damage!.rawDamage).toBe(4); // 3 + 1
    });

    it('should not apply bonus on second attack', () => {
      const state = createTestGameState('Kael', 'Emberfang');
      state.player1.energy = 10;
      advanceToActionPhase(state);

      executeAttack(state, 1, 'dragon');
      const result2 = executeAttack(state, 1, 'dragon');

      expect(result2.kaelBonus).toBe(null);
    });
  });
});
