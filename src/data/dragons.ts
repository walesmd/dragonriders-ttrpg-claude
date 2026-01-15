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
    imagePath: 'assets/cards/dragons/emberfang.png',
    shortIntro: `Emberfang doesn't just burn enemies—he makes them keep burning.`,
    backstory: `Emberfang's flames are cursed. Anything struck by his first attack each turn ignites with an eternal ember, a living brand that continues to sear flesh and scale long after the impact. These burns are not simple fire—they are fragments of Emberfang's own fury, refusing to go out.

He was once worshiped as a god of war, and even now his wrath smolders beneath every strike. He prefers long fights, where his enemies slowly realize they are already dead—they just haven't stopped burning yet.`,
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
    imagePath: 'assets/cards/dragons/cryoworm.png',
    shortIntro: `Cryowyrm freezes foes solid, stealing their turns as surely as their heat.`,
    backstory: `Cryowyrm comes from the endless polar rifts, where Dragons evolved not to kill, but to immobilize. His frost is intelligent, seeping into joints, nerves, and magic itself, halting movement and action.

Each time he strikes, he doesn't just deal damage—he *claims time* from his enemy, locking them in place while the battle moves on without them. Some say Cryowyrm doesn't care if he wins, only that his foes never get the chance to fight back.`,
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
    imagePath: 'assets/cards/dragons/voltwing.png',
    shortIntro: `Voltwing turns every strike into a lightning storm that hits everything nearby.`,
    backstory: `Voltwing's body is a living conductor of arcane electricity. When he attacks one target, the energy discharges outward, arcing into anything else nearby. No blow is ever clean—every strike creates collateral devastation.

He thrives in chaos, overwhelming careful strategies with unpredictable bursts of destruction. Voltwing is beloved by aggressive Riders and feared by everyone else, because wherever he fights, nowhere is safe.`,
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
    imagePath: 'assets/cards/dragons/steelhorn.png',
    shortIntro: `Every blow against Steelhorn comes at a price.`,
    backstory: `Steelhorn was forged in a forgotten age when Dragons were armored living fortresses. His plated hide is not just tough—it is retaliatory. Every time he is struck, the impact rebounds into his attacker, draining their energy and momentum.

Steelhorn does not chase enemies. He lets them break themselves against him. In wars of attrition, Steelhorn is inevitable.`,
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
    imagePath: 'assets/cards/dragons/voidmaw.png',
    shortIntro: `Voidmaw doesn't just attack—he steals the future from his enemies.`,
    backstory: `Voidmaw feeds on energy itself. Each of his attacks siphons power directly from his opponent, weakening them while strengthening his own side. And if he ever pulls ahead, he turns that surplus into raw destruction, tearing into the enemy Dragon before they can recover.

Ancient texts describe Voidmaw as a walking singularity—wherever he goes, resources collapse inward, leaving nothing but advantage in his wake. He is not a predator of flesh, but of opportunity.`,
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
