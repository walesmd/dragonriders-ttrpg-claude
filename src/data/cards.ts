import type { Card, CardDefinition } from './types';

export const CARD_DEFINITIONS: CardDefinition[] = [
  // Dragon Damage
  {
    name: 'Strike',
    cost: 1,
    effectType: 'damage',
    target: 'dragon',
    value: 2,
    secondaryValue: 0,
    description: 'Deal 2 damage to enemy Dragon',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 4,
  },
  {
    name: 'Heavy Blow',
    cost: 3,
    effectType: 'damage',
    target: 'dragon',
    value: 4,
    secondaryValue: 0,
    description: 'Deal 4 damage to enemy Dragon',
    imagePath: 'assets/cards/actions/heavy-blow.png',
    copies: 2,
  },
  {
    name: 'Burning Hit',
    cost: 2,
    effectType: 'burn',
    target: 'dragon',
    value: 1,
    secondaryValue: 1,
    description: 'Deal 1 damage to enemy Dragon and apply 1 Burn',
    imagePath: 'assets/cards/actions/burning-hit.png',
    copies: 2,
  },

  // Rider Damage
  {
    name: 'Weakening Strike',
    cost: 1,
    effectType: 'damage',
    target: 'rider',
    value: 2,
    secondaryValue: 0,
    description: 'Deal 2 damage to enemy Rider',
    imagePath: 'assets/cards/actions/weakening-strike.png',
    copies: 3,
  },
  {
    name: 'Precision Strike',
    cost: 1,
    effectType: 'damage',
    target: 'rider',
    value: 3,
    secondaryValue: 0,
    description: 'Deal 3 damage to enemy Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Crippling Blow',
    cost: 3,
    effectType: 'cripple',
    target: 'rider',
    value: 2,
    secondaryValue: 0,
    description: 'Deal 2 damage to enemy Rider, target becomes Wounded until healed',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 1,
  },

  // Multi-Target
  {
    name: 'Chain Bolt',
    cost: 2,
    effectType: 'chain',
    target: 'both',
    value: 2,
    secondaryValue: 1,
    description: 'Deal 2 damage to enemy Dragon, 1 damage to enemy Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Dual Strike',
    cost: 1,
    effectType: 'dual',
    target: 'both',
    value: 1,
    secondaryValue: 1,
    description: 'Deal 1 damage to enemy Dragon and 1 damage to enemy Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },

  // Control
  {
    name: 'Freeze Ray',
    cost: 2,
    effectType: 'freeze',
    target: 'dragon',
    value: 0,
    secondaryValue: 0,
    description: 'Apply Freeze to enemy Dragon',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Rider Immobilize',
    cost: 3,
    effectType: 'freeze',
    target: 'rider',
    value: 0,
    secondaryValue: 0,
    description: 'Apply Freeze to enemy Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Energy Drain',
    cost: 2,
    effectType: 'drain',
    target: 'opp',
    value: 2,
    secondaryValue: 0,
    description: 'Opponent loses 2 Energy',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Sabotage',
    cost: 2,
    effectType: 'discard',
    target: 'opp',
    value: 2,
    secondaryValue: 0,
    description: 'Opponent discards 2 cards randomly',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },

  // Defense
  {
    name: 'Shield Up',
    cost: 2,
    effectType: 'shield',
    target: 'self',
    value: 2,
    secondaryValue: 0,
    description: 'Your Rider gains 2 Shields',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 3,
  },
  {
    name: 'Shield Disruptor',
    cost: 2,
    effectType: 'strip',
    target: 'dragon',
    value: 0,
    secondaryValue: 0,
    description: 'Destroy all Shields on enemy Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 1,
  },

  // Healing
  {
    name: 'Dragon Heal',
    cost: 2,
    effectType: 'heal',
    target: 'dragon',
    value: 3,
    secondaryValue: 0,
    description: 'Heal your Dragon for 3 HP',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Rider Heal',
    cost: 2,
    effectType: 'heal',
    target: 'rider',
    value: 3,
    secondaryValue: 0,
    description: 'Heal your Rider for 3 HP',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 4,
  },

  // Utility
  {
    name: 'Energy Surge',
    cost: 1,
    effectType: 'energy',
    target: 'self',
    value: 3,
    secondaryValue: 0,
    description: 'Gain 3 Energy',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Thaw',
    cost: 1,
    effectType: 'thaw',
    target: 'self',
    value: 1,
    secondaryValue: 0,
    description: 'Remove Freeze from your Dragon or Rider. Draw 1 card.',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Firebreak',
    cost: 1,
    effectType: 'firebreak',
    target: 'self',
    value: 0,
    secondaryValue: 0,
    description: 'Remove all Burn from your Dragon and Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
  {
    name: 'Energy Shield',
    cost: 2,
    effectType: 'energy_shield',
    target: 'self',
    value: 0,
    secondaryValue: 0,
    description: 'Prevent the next status effect applied to your Rider',
    imagePath: 'assets/cards/actions/strike.png',
    copies: 2,
  },
];

// Generate deterministic card ID from name and copy index
function generateCardId(name: string, copyIndex: number): string {
  // Convert name to lowercase, replace spaces with underscores
  const baseName = name.toLowerCase().replace(/\s+/g, '_');
  return `${baseName}_${copyIndex}`;
}

export function createCardPool(): Card[] {
  const cards: Card[] = [];

  for (const def of CARD_DEFINITIONS) {
    for (let i = 0; i < def.copies; i++) {
      cards.push({
        id: generateCardId(def.name, i),
        name: def.name,
        cost: def.cost,
        effectType: def.effectType,
        target: def.target,
        value: def.value,
        secondaryValue: def.secondaryValue,
        description: def.description,
        imagePath: def.imagePath,
      });
    }
  }

  return cards;
}

// Total cards in pool: 44
export const TOTAL_CARDS = CARD_DEFINITIONS.reduce((sum, def) => sum + def.copies, 0);
export const DECK_SIZE = 20;
