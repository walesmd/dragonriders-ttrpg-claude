import { describe, it, expect } from 'vitest';
import { executeCard } from '../cards';
import { createTestGameState, createTestCard, addCardsToHand, advanceToActionPhase } from './testUtils';

describe('Card Effects', () => {
  describe('Damage cards', () => {
    it('should deal damage to dragon', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      const card = createTestCard({ effectType: 'damage', target: 'dragon', value: 5 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialHp = state.player2.dragon.hp;

      const result = executeCard(state, 1, card.id, 'dragon');

      expect(result.success).toBe(true);
      expect(result.totalDamage).toBe(5);
      expect(state.player2.dragon.hp).toBe(initialHp - 5);
    });

    it('should deal damage to rider', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ effectType: 'damage', target: 'rider', value: 4 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialHp = state.player2.rider.hp;

      const result = executeCard(state, 1, card.id, 'rider');

      expect(result.success).toBe(true);
      expect(result.totalDamage).toBe(4);
      expect(state.player2.rider.hp).toBe(initialHp - 4);
    });

    it('should remove card from hand after playing', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ effectType: 'damage', target: 'dragon', value: 3 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id, 'dragon');

      expect(state.player1.hand).not.toContainEqual(card);
      expect(state.player1.discard).toContainEqual(card);
    });

    it('should deduct energy cost', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ cost: 3, effectType: 'damage', target: 'dragon', value: 5 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id, 'dragon');

      expect(state.player1.energy).toBe(7); // 10 - 3
    });
  });

  describe('Burn cards', () => {
    it('should deal damage and apply burn stacks', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      const card = createTestCard({
        effectType: 'burn',
        target: 'dragon',
        value: 3,
        secondaryValue: 2,
      });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialHp = state.player2.dragon.hp;

      const result = executeCard(state, 1, card.id, 'dragon');

      expect(result.success).toBe(true);
      expect(result.totalDamage).toBe(3);
      expect(result.burnApplied).toBe(2);
      expect(state.player2.dragon.hp).toBe(initialHp - 3);
      expect(state.player2.dragonBurn).toBe(2);
    });
  });

  describe('Freeze cards', () => {
    it('should freeze target', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ effectType: 'freeze', target: 'dragon' });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id, 'dragon');

      expect(result.success).toBe(true);
      expect(result.freezeApplied).toBe(true);
      expect(state.player2.dragonFrozen).toBe(true);
    });

    it('should not freeze if immune', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.dragonFreezeImmune = true;
      const card = createTestCard({ effectType: 'freeze', target: 'dragon' });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id, 'dragon');

      expect(result.success).toBe(true);
      // freezeApplied is not set when immunity prevents freeze
      expect(result.freezeApplied).toBeUndefined();
      expect(state.player2.dragonFrozen).toBe(false);
    });
  });

  describe('Shield cards', () => {
    it('should add shields', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ effectType: 'shield', target: 'self', value: 4 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialShields = state.player1.dragon.shields;

      const result = executeCard(state, 1, card.id);

      expect(result.success).toBe(true);
      expect(result.shieldsGained).toBe(4);
      expect(state.player1.dragon.shields).toBe(initialShields + 4);
    });

    it('should halve shields for wounded Morrik', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.energy = 10;
      state.player1.dragon.shields = 0;
      const card = createTestCard({ effectType: 'shield', target: 'self', value: 5 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.shieldsGained).toBe(3); // ceil(5/2)
      expect(state.player1.dragon.shields).toBe(3);
    });

    it('should give Morrik +1 energy when healthy', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.energy = 5;
      const card = createTestCard({ effectType: 'shield', target: 'self', value: 3, cost: 2 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.morrikBonus).toBe(1);
      expect(state.player1.energy).toBe(4); // 5 - 2 (cost) + 1 (bonus)
    });

    it('should not give Morrik energy when wounded', () => {
      const state = createTestGameState('Morrik', 'Emberfang');
      state.player1.rider.hp = state.player1.rider.woundedThreshold;
      state.player1.energy = 5;
      const card = createTestCard({ effectType: 'shield', target: 'self', value: 3, cost: 2 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.morrikBonus).toBe(0);
      expect(state.player1.energy).toBe(3); // 5 - 2 (no bonus)
    });
  });

  describe('Heal cards', () => {
    it('should heal dragon', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player1.dragon.hp = state.player1.dragon.maxHp - 10;
      const card = createTestCard({ effectType: 'heal', target: 'dragon', value: 5 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.healingDone).toBe(5);
      expect(state.player1.dragon.hp).toBe(state.player1.dragon.maxHp - 5);
    });

    it('should heal rider', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player1.rider.hp = state.player1.rider.maxHp - 8;
      const card = createTestCard({ effectType: 'heal', target: 'rider', value: 4 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.healingDone).toBe(4);
      expect(state.player1.rider.hp).toBe(state.player1.rider.maxHp - 4);
    });
  });

  describe('Energy cards', () => {
    it('should gain energy', () => {
      const state = createTestGameState();
      state.player1.energy = 5;
      const card = createTestCard({ effectType: 'energy', target: 'self', value: 3, cost: 1 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player1.energy).toBe(7); // 5 - 1 (cost) + 3 (gain)
    });
  });

  describe('Drain cards', () => {
    it('should drain opponent energy', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.energy = 5;
      const card = createTestCard({ effectType: 'drain', target: 'opp', value: 2 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player2.energy).toBe(3);
    });

    it('should not drain below 0', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.energy = 1;
      const card = createTestCard({ effectType: 'drain', target: 'opp', value: 5 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player2.energy).toBe(0);
    });
  });

  describe('Chain cards', () => {
    it('should damage both dragon and rider', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.dragon.shields = 0;
      const card = createTestCard({
        effectType: 'chain',
        target: 'both',
        value: 3,
        secondaryValue: 2,
      });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialDragonHp = state.player2.dragon.hp;
      const initialRiderHp = state.player2.rider.hp;

      const result = executeCard(state, 1, card.id);

      expect(result.totalDamage).toBe(5);
      expect(state.player2.dragon.hp).toBe(initialDragonHp - 3);
      expect(state.player2.rider.hp).toBe(initialRiderHp - 2);
    });
  });

  describe('Cripple cards', () => {
    it('should damage rider and force wounded', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      const card = createTestCard({ effectType: 'cripple', target: 'rider', value: 3 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player2.rider.forceWounded).toBe(true);
    });
  });

  describe('Thaw cards', () => {
    it('should remove freeze and draw a card', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player1.dragonFrozen = true;
      state.player1.deck = [createTestCard({ name: 'Deck Card' })];
      const card = createTestCard({ effectType: 'thaw', target: 'self' });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);
      const initialHandSize = state.player1.hand.length;

      executeCard(state, 1, card.id);

      expect(state.player1.dragonFrozen).toBe(false);
      expect(state.player1.hand.length).toBe(initialHandSize); // -1 for played card, +1 for drawn
    });
  });

  describe('Firebreak cards', () => {
    it('should remove all burn', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player1.dragonBurn = 3;
      state.player1.riderBurn = 2;
      const card = createTestCard({ effectType: 'firebreak', target: 'self' });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player1.dragonBurn).toBe(0);
      expect(state.player1.riderBurn).toBe(0);
    });
  });

  describe('Strip cards', () => {
    it('should remove all shields from opponent dragon', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player2.dragon.shields = 5;
      const card = createTestCard({ effectType: 'strip', target: 'opp' });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player2.dragon.shields).toBe(0);
    });
  });

  describe('Card validation', () => {
    it('should fail if not enough energy', () => {
      const state = createTestGameState();
      state.player1.energy = 1;
      const card = createTestCard({ cost: 3 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      const result = executeCard(state, 1, card.id);

      expect(result.success).toBe(false);
    });

    it('should fail if card not in hand', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      advanceToActionPhase(state);

      const result = executeCard(state, 1, 'nonexistent-card-id');

      expect(result.success).toBe(false);
    });

    it('should track cards played while frozen', () => {
      const state = createTestGameState();
      state.player1.energy = 10;
      state.player1.dragonFrozen = true;
      const card = createTestCard({ cost: 1 });
      addCardsToHand(state.player1, [card]);
      advanceToActionPhase(state);

      executeCard(state, 1, card.id);

      expect(state.player1.cardsPlayedWhileFrozen).toBe(1);
    });
  });
});
