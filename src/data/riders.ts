import type { RiderName, RiderState, RiderDefinition } from './types';

export const RIDERS: Record<RiderName, RiderDefinition> = {
  Talia: {
    name: 'Talia',
    maxHp: 20,
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
    imagePath: 'assets/cards/riders/thalia.png',
    shortIntro: 'A brilliant broker of war and wealth, Talia turns every living Dragon into a steady river of power.',
    backstory: `Talia was never meant to be a battlefield hero. She was raised in the sky-markets of Aurelion Spire, where war was waged with contracts, not swords. While other Riders trained to command Dragons through dominance, Talia learned how to bind them through incentive. She pioneered a revolutionary system of Dragon charters: arcane contracts that reward cooperation with escalating flows of energy.

As long as a Dragon fights under her banner, it feeds her resources—mana, gold, influence—drawn from ancient ley lines. But when her Dragon falls, those contracts collapse, leaving her scrambling to rebuild. Talia is feared not for her firepower, but because wherever she goes, the economy of war tilts in her favor.`,
  },
  Kael: {
    name: 'Kael',
    maxHp: 19,
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
    imagePath: 'assets/cards/riders/kael.png',
    shortIntro: 'Kael believes the first strike should decide the battle—and he makes sure it nearly does.',
    backstory: `Kael was bred in the Iron Pits, where Riders fought without Dragons, using only brutal tactics and improvised weapons. When he was finally granted a Dragon, he brought that same kill-or-be-killed philosophy with him. His signature technique, the *Crimson Opening*, is a perfectly timed assault that overwhelms enemies before they can react.

That first devastating blow doesn't just hurt—it fortifies his Dragon, layering it in kinetic shields formed by the shock of impact. But Kael's style is unsustainable. As wounds accumulate, his ability to strike cleanly falters, and desperation creeps in. In his critical state, every attack costs more because he's forcing his battered body and Dragon beyond their limits.`,
  },
  Bronn: {
    name: 'Bronn',
    maxHp: 22,
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
    imagePath: 'assets/cards/riders/bronn.png',
    shortIntro: 'An unbreakable wall in a world of fire and claws, Bronn keeps his allies alive through sheer stubborn will.',
    backstory: `Bronn was once the last defender of a shattered mountain fortress, holding off three Dragons with nothing but a tower shield and his own indomitable spirit. Though he lost the fortress, he earned a legend—and a place among the Riders. His defensive aura is not magic, but something rarer: unshakable resolve that dampens incoming force itself.

When Bronn is healthy, even Dragons struggle to deal full damage near him. But as he weakens, that protective field begins to collapse. First he can only shield Dragons. Then, when he's truly near death, even that fades. Bronn's tragedy is that he doesn't lose because he makes mistakes—he loses because eventually, even mountains crumble.`,
  },
  Lyra: {
    name: 'Lyra',
    maxHp: 19,
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
    imagePath: 'assets/cards/riders/lyra.png',
    shortIntro: 'Lyra bends time and ice to lock her enemies in helpless stillness.',
    backstory: `Lyra hails from the Cryost Archives, a frozen city where time itself was studied as a manipulable force. She discovered that true freeze magic doesn't just stop bodies—it delays outcomes. When Lyra freezes a target, she stretches the moment, making it last longer than it should.

But her powers are delicate. As she becomes wounded, the magic grows harder to control, costing more energy to wield. When she's critical, the backlash becomes too dangerous to risk—her own mind starts freezing along with her targets. Lyra is a master of control, but she walks a razor's edge between domination and self-destruction.`,
  },
  Morrik: {
    name: 'Morrik',
    maxHp: 21,
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
    imagePath: 'assets/cards/riders/morrik.png',
    shortIntro: 'Morrik turns defense into fuel, forging power from every barrier he raises.',
    backstory: `Morrik was an artificer before he was ever a Rider, famous for crafting living shields that adapted to damage. His creations don't just block attacks—they absorb the force and convert it into usable energy. When Morrik enters battle, every shield he deploys strengthens his position, turning defense into momentum.

As he becomes wounded, his craftsmanship falters. His shields grow thinner, less effective. And when Morrik is critically injured, his hands simply cannot hold the arcane tools required to create shields at all. Without his barriers, he becomes terrifyingly vulnerable—a builder without materials.`,
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
