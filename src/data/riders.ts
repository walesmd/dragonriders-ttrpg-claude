import type { RiderName, RiderState, RiderDefinition } from './types';

export const RIDERS: Record<RiderName, RiderDefinition> = {
  Talia: {
    name: 'Talia',
    maxHp: 18,
    baseEconomy: 2,
    woundedThreshold: 13,
    criticalThreshold: 7,
    passive: '+1 Economy while Dragon is alive',
    woundedEffect: 'Economy reduced by 1',
    criticalEffect: 'Loses Dragon bonus',
  },
  Kael: {
    name: 'Kael',
    maxHp: 17,
    baseEconomy: 1,
    woundedThreshold: 12,
    criticalThreshold: 6,
    passive: 'First attack each turn: +2 damage, Dragon gains 2 shields',
    woundedEffect: 'Bonus reduced to +1 damage, +1 shield',
    criticalEffect: 'Attack costs +1 energy',
  },
  Bronn: {
    name: 'Bronn',
    maxHp: 20,
    baseEconomy: 1,
    woundedThreshold: 14,
    criticalThreshold: 8,
    passive: 'Reduce all damage to Dragon and Rider by 1',
    woundedEffect: 'Only Dragon damage reduced',
    criticalEffect: 'No damage reduction',
  },
  Lyra: {
    name: 'Lyra',
    maxHp: 17,
    baseEconomy: 2,
    woundedThreshold: 12,
    criticalThreshold: 6,
    passive: 'Freeze effects last an additional turn',
    woundedEffect: 'Freeze cards cost +1 energy',
    criticalEffect: 'Cannot play Freeze cards',
  },
  Morrik: {
    name: 'Morrik',
    maxHp: 19,
    baseEconomy: 2,
    woundedThreshold: 14,
    criticalThreshold: 8,
    passive: '+1 energy when playing Shield cards',
    woundedEffect: 'Shield cards only grant half shields (rounded up)',
    criticalEffect: 'Cannot play Shield cards',
  },
};

export function createRider(name: RiderName): RiderState {
  const def = RIDERS[name];
  return {
    name: def.name,
    hp: def.maxHp,
    maxHp: def.maxHp,
    baseEconomy: def.baseEconomy,
    woundedThreshold: def.woundedThreshold,
    criticalThreshold: def.criticalThreshold,
    forceWounded: false,
  };
}

export function isWounded(rider: RiderState): boolean {
  return rider.hp <= rider.woundedThreshold || rider.forceWounded;
}

export function isCritical(rider: RiderState): boolean {
  return rider.hp <= rider.criticalThreshold;
}
