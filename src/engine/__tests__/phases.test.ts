import { describe, it, expect } from 'vitest';
import { executeStartPhase, executeEndPhase, passTurn } from '../phases';
import { createTestGameState, createTestCard, addCardsToHand } from './testUtils';

describe('Turn Phases', () => {
  describe('executeStartPhase', () => {
    it('should draw a card', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.deck = [createTestCard({ name: 'Test Card' })];
      const initialHandSize = state.player1.hand.length;

      executeStartPhase(state);

      expect(state.player1.hand.length).toBe(initialHandSize + 1);
      expect(state.player1.deck.length).toBe(0);
    });

    it('should gain energy', () => {
      const state = createTestGameState('Talia', 'Emberfang');
      state.turnPhase = 'start';
      state.player1.energy = 0;

      executeStartPhase(state);

      // Talia: 3 base + 2 economy + 1 dragon = 6
      expect(state.player1.energy).toBe(6);
    });

    it('should apply burn damage', () => {
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

    it('should reset turn flags', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.firstAttackThisTurn = false;
      state.player1.burnAppliedThisTurn = true;
      state.player1.cardsPlayedWhileFrozen = 5;

      executeStartPhase(state);

      expect(state.player1.firstAttackThisTurn).toBe(true);
      expect(state.player1.burnAppliedThisTurn).toBe(false);
      expect(state.player1.cardsPlayedWhileFrozen).toBe(0);
    });

    it('should clear opponent freeze immunity', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player2.dragonFreezeImmune = true;
      state.player2.riderFreezeImmune = true;

      executeStartPhase(state);

      expect(state.player2.dragonFreezeImmune).toBe(false);
      expect(state.player2.riderFreezeImmune).toBe(false);
    });

    it('should transition to action phase', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';

      executeStartPhase(state);

      expect(state.turnPhase).toBe('action');
    });

    it('should check win conditions after burn damage', () => {
      const state = createTestGameState();
      state.turnPhase = 'start';
      state.player1.dragon.hp = 2;
      state.player1.dragonBurn = 5;

      executeStartPhase(state);

      expect(state.phase).toBe('ended');
      expect(state.winner).toBe(2);
    });
  });

  describe('executeEndPhase', () => {
    it('should discard down to hand limit (5 cards)', () => {
      const state = createTestGameState();
      const cards = [
        createTestCard({ name: 'Card 1' }),
        createTestCard({ name: 'Card 2' }),
        createTestCard({ name: 'Card 3' }),
        createTestCard({ name: 'Card 4' }),
        createTestCard({ name: 'Card 5' }),
        createTestCard({ name: 'Card 6' }),
        createTestCard({ name: 'Card 7' }),
      ];
      addCardsToHand(state.player1, cards);

      executeEndPhase(state);

      expect(state.player1.hand.length).toBe(5);
      expect(state.player1.discard.length).toBe(2);
    });

    it('should not discard if at or below hand limit', () => {
      const state = createTestGameState();
      const cards = [
        createTestCard({ name: 'Card 1' }),
        createTestCard({ name: 'Card 2' }),
        createTestCard({ name: 'Card 3' }),
      ];
      addCardsToHand(state.player1, cards);

      executeEndPhase(state);

      expect(state.player1.hand.length).toBe(3);
      expect(state.player1.discard.length).toBe(0);
    });

    it('should clear freeze and grant immunity', () => {
      const state = createTestGameState();
      state.player1.dragonFrozen = true;
      state.player1.riderFrozen = true;

      executeEndPhase(state);

      expect(state.player1.dragonFrozen).toBe(false);
      expect(state.player1.riderFrozen).toBe(false);
      expect(state.player1.dragonFreezeImmune).toBe(true);
      expect(state.player1.riderFreezeImmune).toBe(true);
    });

    it('should not grant immunity if not frozen', () => {
      const state = createTestGameState();
      state.player1.dragonFrozen = false;

      executeEndPhase(state);

      expect(state.player1.dragonFreezeImmune).toBe(false);
    });

    it('should switch active player', () => {
      const state = createTestGameState();
      state.activePlayer = 1;

      executeEndPhase(state);

      expect(state.activePlayer).toBe(2);
    });

    it('should increment turn when switching to player 1', () => {
      const state = createTestGameState();
      state.activePlayer = 2;
      state.turn = 5;

      executeEndPhase(state);

      expect(state.activePlayer).toBe(1);
      expect(state.turn).toBe(6);
    });

    it('should not increment turn when switching to player 2', () => {
      const state = createTestGameState();
      state.activePlayer = 1;
      state.turn = 5;

      executeEndPhase(state);

      expect(state.activePlayer).toBe(2);
      expect(state.turn).toBe(5);
    });

    it('should transition to start phase', () => {
      const state = createTestGameState();

      executeEndPhase(state);

      expect(state.turnPhase).toBe('start');
    });
  });

  describe('passTurn', () => {
    it('should execute end phase then start phase', () => {
      const state = createTestGameState();
      state.activePlayer = 1;
      state.turnPhase = 'action';
      state.player1.dragonFrozen = true;
      state.player2.deck = [createTestCard()];
      state.player2.energy = 0;

      passTurn(state);

      // End phase effects cleared freeze and granted immunity
      expect(state.player1.dragonFrozen).toBe(false);
      // But then start phase for player 2 cleared player 1's immunity
      expect(state.player1.dragonFreezeImmune).toBe(false);

      // Now player 2's turn
      expect(state.activePlayer).toBe(2);
      expect(state.turnPhase).toBe('action'); // After start phase

      // Start phase effects
      expect(state.player2.hand.length).toBeGreaterThan(0); // Drew card
      expect(state.player2.energy).toBeGreaterThan(0); // Gained energy
    });

    it('should not execute start phase if game ended', () => {
      const state = createTestGameState();
      state.phase = 'ended';
      state.winner = 1;
      state.turnPhase = 'action';

      passTurn(state);

      // End phase was executed (setting turnPhase to 'start')
      // But start phase was NOT executed due to game being ended
      expect(state.turnPhase).toBe('start');
      expect(state.phase).toBe('ended');
    });

    it('should handle multiple turn passes', () => {
      const state = createTestGameState('Kael', 'Emberfang', 'Kael', 'Cryowyrm');
      state.turnPhase = 'action';
      state.turn = 1;

      // Pass player 1's turn
      passTurn(state);
      expect(state.activePlayer).toBe(2);
      expect(state.turn).toBe(1);

      // Pass player 2's turn
      passTurn(state);
      expect(state.activePlayer).toBe(1);
      expect(state.turn).toBe(2);
    });
  });

  describe('Full turn cycle integration', () => {
    it('should properly cycle through all phases', () => {
      const state = createTestGameState();
      state.player1.deck = [createTestCard()];
      state.player2.deck = [createTestCard()];
      state.turnPhase = 'start';
      state.activePlayer = 1;
      state.turn = 1;

      // Start phase
      executeStartPhase(state);
      expect(state.turnPhase).toBe('action');
      expect(state.player1.hand.length).toBeGreaterThan(0);
      expect(state.player1.energy).toBeGreaterThan(0);

      // Action phase (simulated by advancing manually)
      state.turnPhase = 'end';

      // End phase
      executeEndPhase(state);
      expect(state.activePlayer).toBe(2);
      expect(state.turnPhase).toBe('start');
    });

    it('should handle freeze immunity cycle correctly', () => {
      const state = createTestGameState();
      state.turnPhase = 'action';
      state.activePlayer = 1;

      // Freeze player 1
      state.player1.dragonFrozen = true;

      // End player 1's turn - clears freeze, grants immunity
      executeEndPhase(state);
      expect(state.player1.dragonFrozen).toBe(false);
      expect(state.player1.dragonFreezeImmune).toBe(true);
      expect(state.activePlayer).toBe(2);

      // Start player 2's turn - clears player 1's immunity
      executeStartPhase(state);
      expect(state.player1.dragonFreezeImmune).toBe(false);
      expect(state.activePlayer).toBe(2);
    });

    it('should accumulate energy over multiple turns', () => {
      const state = createTestGameState('Kael', 'Emberfang');
      state.turnPhase = 'start';
      state.player1.energy = 0;

      // Turn 1
      executeStartPhase(state);
      const energyAfterTurn1 = state.player1.energy;
      expect(energyAfterTurn1).toBe(4); // 3 base + 1 economy

      // Simulate spending some energy
      state.player1.energy -= 2;

      // Turn 2
      state.turnPhase = 'start';
      executeStartPhase(state);
      expect(state.player1.energy).toBe(energyAfterTurn1 - 2 + 4);
    });
  });
});
