import type { DragonName, DragonState, DragonDefinition } from './types';

export const DRAGONS: Record<DragonName, DragonDefinition> = {
  Emberfang: {
    name: 'Emberfang',
    maxHp: 33,
    shields: 3,
    attackCost: 2,
    attackDamage: 3,
    ability: 'First attack each turn applies +1 Burn to target',
  },
  Cryowyrm: {
    name: 'Cryowyrm',
    maxHp: 30,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks apply Freeze to target (respects immunity)',
  },
  Voltwing: {
    name: 'Voltwing',
    maxHp: 35,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks deal +2 splash damage to the other target',
  },
  Steelhorn: {
    name: 'Steelhorn',
    maxHp: 40,
    shields: 4,
    attackCost: 2,
    attackDamage: 3,
    ability: 'When taking damage from attack, attacker loses 1 energy',
  },
  Voidmaw: {
    name: 'Voidmaw',
    maxHp: 32,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
    ability: 'Attacks steal 1 energy. At turn start, if ahead in energy, deal 2 damage to enemy Dragon',
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
