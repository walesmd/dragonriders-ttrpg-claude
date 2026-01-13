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
    visualTheme: {
      primary: ['emerald-600', 'emerald-800'],
      hover: ['emerald-500', 'emerald-700'],
    },
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
    visualTheme: {
      primary: ['amber-600', 'amber-800'],
      hover: ['amber-500', 'amber-700'],
    },
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
    visualTheme: {
      primary: ['slate-600', 'slate-800'],
      hover: ['slate-500', 'slate-700'],
    },
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
    visualTheme: {
      primary: ['cyan-600', 'cyan-800'],
      hover: ['cyan-500', 'cyan-700'],
    },
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
    visualTheme: {
      primary: ['purple-600', 'violet-800'],
      hover: ['purple-500', 'violet-700'],
    },
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
