import { describe, it, expect } from 'vitest';
import { checkWinConditions, applyWinCondition } from '../winConditions';
import { createTestGameState } from './testUtils';

describe('Win Conditions', () => {
  describe('checkWinConditions', () => {
    it('should detect no winner when all units are alive', () => {
      const state = createTestGameState();
      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(false);
      expect(result.winner).toBe(null);
      expect(result.winType).toBe(null);
    });

    it('should detect player 2 wins when player 1 dragon dies', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2);
      expect(result.winType).toBe('dragon_kill');
    });

    it('should detect player 1 wins when player 2 dragon dies', () => {
      const state = createTestGameState();
      state.player2.dragon.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(1);
      expect(result.winType).toBe('dragon_kill');
    });

    it('should detect player 2 wins when player 1 rider dies', () => {
      const state = createTestGameState();
      state.player1.rider.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2);
      expect(result.winType).toBe('rider_kill');
    });

    it('should detect player 1 wins when player 2 rider dies', () => {
      const state = createTestGameState();
      state.player2.rider.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(1);
      expect(result.winType).toBe('rider_kill');
    });

    it('should handle simultaneous dragon deaths - active player loses', () => {
      const state = createTestGameState();
      state.activePlayer = 1;
      state.player1.dragon.hp = 0;
      state.player2.dragon.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2); // Player 1 (active) loses
      expect(result.winType).toBe('dragon_kill');
    });

    it('should handle simultaneous dragon deaths - player 2 active loses', () => {
      const state = createTestGameState();
      state.activePlayer = 2;
      state.player1.dragon.hp = 0;
      state.player2.dragon.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(1); // Player 2 (active) loses
      expect(result.winType).toBe('dragon_kill');
    });

    it('should handle simultaneous rider deaths - active player loses', () => {
      const state = createTestGameState();
      state.activePlayer = 1;
      state.player1.rider.hp = 0;
      state.player2.rider.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2);
      expect(result.winType).toBe('rider_kill');
    });

    it('should prioritize dragon deaths over rider deaths', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = 0;
      state.player2.rider.hp = 0;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2); // P1 dragon died
      expect(result.winType).toBe('dragon_kill');
    });

    it('should handle negative HP as death', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = -5;

      const result = checkWinConditions(state);

      expect(result.hasWinner).toBe(true);
      expect(result.winner).toBe(2);
      expect(result.winType).toBe('dragon_kill');
    });
  });

  describe('applyWinCondition', () => {
    it('should update game state when win condition is met', () => {
      const state = createTestGameState();
      state.player2.dragon.hp = 0;

      const hasWinner = applyWinCondition(state);

      expect(hasWinner).toBe(true);
      expect(state.phase).toBe('ended');
      expect(state.winner).toBe(1);
      expect(state.winType).toBe('dragon_kill');
    });

    it('should not update game state when no win condition is met', () => {
      const state = createTestGameState();

      const hasWinner = applyWinCondition(state);

      expect(hasWinner).toBe(false);
      expect(state.phase).toBe('play');
      expect(state.winner).toBe(null);
      expect(state.winType).toBe(null);
    });

    it('should only trigger once when called multiple times', () => {
      const state = createTestGameState();
      state.player1.dragon.hp = 0;

      applyWinCondition(state);
      const winner1 = state.winner;

      applyWinCondition(state);
      const winner2 = state.winner;

      expect(winner1).toBe(winner2);
      expect(state.phase).toBe('ended');
    });
  });
});
