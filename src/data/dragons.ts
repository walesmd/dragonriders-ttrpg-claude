import type { DragonName, DragonState, DragonDefinition } from './types';

export const DRAGONS: Record<DragonName, DragonDefinition> = {
  Emberfang: {
    name: 'Emberfang',
    maxHp: 33,
    shields: 3,
    attackCost: 2,
    attackDamage: 3,
    ability: 'First attack each turn applies +1 Burn to target',
    visualTheme: {
      primary: ['orange-600', 'red-800'],
      hover: ['orange-500', 'red-700'],
    },
  },
  Cryowyrm: {
    name: 'Cryowyrm',
    maxHp: 30,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks apply Freeze to target (respects immunity)',
    visualTheme: {
      primary: ['blue-500', 'cyan-700'],
      hover: ['blue-400', 'cyan-600'],
    },
  },
  Voltwing: {
    name: 'Voltwing',
    maxHp: 35,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks deal +2 splash damage to the other target',
    visualTheme: {
      primary: ['yellow-500', 'amber-700'],
      hover: ['yellow-400', 'amber-600'],
    },
  },
  Steelhorn: {
    name: 'Steelhorn',
    maxHp: 40,
    shields: 4,
    attackCost: 2,
    attackDamage: 3,
    ability: 'When taking damage from attack, attacker loses 1 energy',
    visualTheme: {
      primary: ['gray-500', 'zinc-700'],
      hover: ['gray-400', 'zinc-600'],
    },
  },
  Voidmaw: {
    name: 'Voidmaw',
    maxHp: 32,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks steal 1 energy. At turn start, if ahead in energy, deal 2 damage to enemy Dragon',
    visualTheme: {
      primary: ['purple-600', 'indigo-900'],
      hover: ['purple-500', 'indigo-800'],
    },
  },
};

export function createDragon(name: DragonName): DragonState {
  const def = DRAGONS[name];
  return {
    name: def.name,
    hp: def.maxHp,
    maxHp: def.maxHp,
    shields: def.shields,
    attackCost: def.attackCost,
    attackDamage: def.attackDamage,
  };
}
