import type { PlayerState } from '../data/types';
import { isWounded, isCritical } from '../data/riders';

const BASE_ENERGY = 3;

export function calculateEconomy(player: PlayerState): number {
  const { rider, dragon } = player;
  let eco = rider.baseEconomy;

  switch (rider.name) {
    case 'Talia':
      // +1 if dragon alive, -1 if wounded (critical loses dragon bonus)
      if (isWounded(rider)) {
        eco -= 1;
      }
      if (!isCritical(rider) && dragon.hp > 0) {
        eco += 1;
      }
      break;

    case 'Kael':
    case 'Bronn':
    case 'Lyra':
    case 'Morrik':
      // Base economy only
      break;
  }

  return Math.max(0, eco);
}

export function gainStartOfTurnEnergy(player: PlayerState): number {
  const base = BASE_ENERGY;
  const economy = calculateEconomy(player);
  const total = base + economy;
  player.energy += total;
  return total;
}

export function canAfford(player: PlayerState, cost: number): boolean {
  return player.energy >= cost;
}

export function spendEnergy(player: PlayerState, cost: number): boolean {
  if (!canAfford(player, cost)) return false;
  player.energy -= cost;
  return true;
}
