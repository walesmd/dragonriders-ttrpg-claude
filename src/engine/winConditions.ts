import type { GameState, PlayerNumber, WinType } from '../data/types';

export interface WinResult {
  hasWinner: boolean;
  winner: PlayerNumber | null;
  winType: WinType | null;
}

export function checkWinConditions(state: GameState): WinResult {
  const p1DragonDead = state.player1.dragon.hp <= 0;
  const p1RiderDead = state.player1.rider.hp <= 0;
  const p2DragonDead = state.player2.dragon.hp <= 0;
  const p2RiderDead = state.player2.rider.hp <= 0;

  // Check dragon deaths first (per rules)
  if (p1DragonDead && p2DragonDead) {
    // Both dragons dead - active player loses (their action caused mutual death)
    const winner = state.activePlayer === 1 ? 2 : 1;
    return { hasWinner: true, winner, winType: 'dragon_kill' };
  }

  if (p1DragonDead) {
    return { hasWinner: true, winner: 2, winType: 'dragon_kill' };
  }

  if (p2DragonDead) {
    return { hasWinner: true, winner: 1, winType: 'dragon_kill' };
  }

  // Check rider deaths
  if (p1RiderDead && p2RiderDead) {
    // Both riders dead - active player loses
    const winner = state.activePlayer === 1 ? 2 : 1;
    return { hasWinner: true, winner, winType: 'rider_kill' };
  }

  if (p1RiderDead) {
    return { hasWinner: true, winner: 2, winType: 'rider_kill' };
  }

  if (p2RiderDead) {
    return { hasWinner: true, winner: 1, winType: 'rider_kill' };
  }

  return { hasWinner: false, winner: null, winType: null };
}

export function applyWinCondition(state: GameState): boolean {
  const result = checkWinConditions(state);

  if (result.hasWinner) {
    state.phase = 'ended';
    state.winner = result.winner;
    state.winType = result.winType;
    return true;
  }

  return false;
}
