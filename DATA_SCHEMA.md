# Dragon Riders — Data Schema

Complete TypeScript interfaces and constant data for implementation.

---

## Core Types

```typescript
// ============================================================================
// ENUMS
// ============================================================================

type PlayerNumber = 1 | 2;
type GamePhase = 'setup' | 'draft' | 'play' | 'ended';
type TurnPhase = 'start' | 'action' | 'end';
type WinType = 'dragon_kill' | 'rider_kill';
type TargetType = 'dragon' | 'rider';

type RiderName = 'Talia' | 'Kael' | 'Bronn' | 'Lyra' | 'Morrik';
type DragonName = 'Emberfang' | 'Cryowyrm' | 'Voltwing' | 'Steelhorn' | 'Voidmaw';

type CardEffectType = 
  | 'damage'
  | 'burn'
  | 'freeze'
  | 'shield'
  | 'heal'
  | 'energy'
  | 'drain'
  | 'discard'
  | 'chain'
  | 'dual'
  | 'cripple'
  | 'thaw'
  | 'firebreak'
  | 'strip'
  | 'energy_shield';

type CardTarget = 'dragon' | 'rider' | 'self' | 'opp' | 'both';

// ============================================================================
// GAME STATE
// ============================================================================

interface GameState {
  // Game meta
  gameId: string;
  phase: GamePhase;
  turn: number;
  activePlayer: PlayerNumber;
  turnPhase: TurnPhase;
  
  // Players
  player1: PlayerState;
  player2: PlayerState;
  
  // Result
  winner: PlayerNumber | null;
  winType: WinType | null;
  
  // Log
  actionLog: LogEntry[];
}

interface PlayerState {
  // Units
  rider: RiderState;
  dragon: DragonState;
  
  // Cards
  hand: Card[];
  deck: Card[];
  discard: Card[];
  
  // Resources
  energy: number;
  
  // Dragon status
  dragonFreezeStacks: number;
  dragonFreezeImmune: boolean;
  dragonBurn: number;
  
  // Rider status
  riderFreezeStacks: number;
  riderFreezeImmune: boolean;
  riderBurn: number;
  
  // Turn state
  firstAttackThisTurn: boolean;
  burnAppliedThisTurn: boolean; // For Emberfang
  actionsTakenThisTurn: number;
}

// ============================================================================
// UNITS
// ============================================================================

interface RiderState {
  name: RiderName;
  hp: number;
  maxHp: number;
  shields: number;
  baseEconomy: number;
  woundedThreshold: number;
  criticalThreshold: number;
  forceWounded: boolean; // From Crippling Blow
}

interface DragonState {
  name: DragonName;
  hp: number;
  maxHp: number;
  shields: number;
  attackCost: number;
  attackDamage: number;
}

// ============================================================================
// CARDS
// ============================================================================

interface Card {
  id: string; // Unique instance ID
  name: string;
  cost: number;
  effectType: CardEffectType;
  target: CardTarget;
  value: number;
  secondaryValue: number;
  description: string;
}

interface CardDefinition {
  name: string;
  cost: number;
  effectType: CardEffectType;
  target: CardTarget;
  value: number;
  secondaryValue: number;
  description: string;
  copies: number; // How many in the pool
}

// ============================================================================
// ACTIONS
// ============================================================================

type GameAction = 
  | { type: 'ATTACK'; target: TargetType }
  | { type: 'PLAY_CARD'; cardId: string; target?: TargetType }
  | { type: 'PASS' }
  | { type: 'DISCARD'; cardId: string };

interface LogEntry {
  turn: number;
  player: PlayerNumber;
  action: string;
  details?: Record<string, any>;
}
```

---

## Constant Data

```typescript
// ============================================================================
// RIDER DEFINITIONS
// ============================================================================

const RIDERS: Record<RiderName, Omit<RiderState, 'hp' | 'forceWounded'>> = {
  Talia: {
    name: 'Talia',
    maxHp: 18,
    baseEconomy: 2,
    woundedThreshold: 13,
    criticalThreshold: 7,
  },
  Kael: {
    name: 'Kael',
    maxHp: 17,
    baseEconomy: 1,
    woundedThreshold: 12,
    criticalThreshold: 6,
  },
  Bronn: {
    name: 'Bronn',
    maxHp: 20,
    baseEconomy: 1,
    woundedThreshold: 14,
    criticalThreshold: 8,
  },
  Lyra: {
    name: 'Lyra',
    maxHp: 17,
    baseEconomy: 2,
    woundedThreshold: 12,
    criticalThreshold: 6,
  },
  Morrik: {
    name: 'Morrik',
    maxHp: 19,
    baseEconomy: 2,
    woundedThreshold: 14,
    criticalThreshold: 8,
  },
};

// ============================================================================
// DRAGON DEFINITIONS
// ============================================================================

const DRAGONS: Record<DragonName, Omit<DragonState, 'hp'>> = {
  Emberfang: {
    name: 'Emberfang',
    maxHp: 33,
    shields: 3,
    attackCost: 2,
    attackDamage: 3,
  },
  Cryowyrm: {
    name: 'Cryowyrm',
    maxHp: 30,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
  },
  Voltwing: {
    name: 'Voltwing',
    maxHp: 35,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
  },
  Steelhorn: {
    name: 'Steelhorn',
    maxHp: 40,
    shields: 4,
    attackCost: 2,
    attackDamage: 3,
  },
  Voidmaw: {
    name: 'Voidmaw',
    maxHp: 32,
    shields: 2,
    attackCost: 2,
    attackDamage: 3,
  },
};

// ============================================================================
// CARD DEFINITIONS
// ============================================================================

const CARD_DEFINITIONS: CardDefinition[] = [
  // Dragon Damage
  {
    name: 'Strike',
    cost: 1,
    effectType: 'damage',
    target: 'dragon',
    value: 2,
    secondaryValue: 0,
    description: 'Deal 2 damage to enemy Dragon',
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
    copies: 2,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createRider(name: RiderName): RiderState {
  const def = RIDERS[name];
  return {
    ...def,
    hp: def.maxHp,
    forceWounded: false,
  };
}

function createDragon(name: DragonName): DragonState {
  const def = DRAGONS[name];
  return {
    ...def,
    hp: def.maxHp,
  };
}

function createCardPool(): Card[] {
  const cards: Card[] = [];
  let id = 0;
  
  for (const def of CARD_DEFINITIONS) {
    for (let i = 0; i < def.copies; i++) {
      cards.push({
        id: `card_${id++}`,
        name: def.name,
        cost: def.cost,
        effectType: def.effectType,
        target: def.target,
        value: def.value,
        secondaryValue: def.secondaryValue,
        description: def.description,
      });
    }
  }
  
  return cards;
}

function isWounded(rider: RiderState): boolean {
  return rider.hp <= rider.woundedThreshold || rider.forceWounded;
}

function isCritical(rider: RiderState): boolean {
  return rider.hp <= rider.criticalThreshold;
}

function calculateEconomy(rider: RiderState, dragon: DragonState): number {
  let eco = rider.baseEconomy;
  
  // Talia adjustments
  if (rider.name === 'Talia') {
    if (isWounded(rider)) {
      eco -= 1;
    }
    if (!isCritical(rider) && dragon.hp > 0) {
      eco += 1;
    }
  }
  
  return Math.max(0, eco);
}
```

---

## Initial State Factory

```typescript
function createInitialGameState(
  player1Rider: RiderName,
  player1Dragon: DragonName,
  player2Rider: RiderName,
  player2Dragon: DragonName,
  player1Deck: Card[],
  player2Deck: Card[]
): GameState {
  return {
    gameId: generateId(),
    phase: 'play',
    turn: 1,
    activePlayer: 1,
    turnPhase: 'start',
    
    player1: {
      rider: createRider(player1Rider),
      dragon: createDragon(player1Dragon),
      hand: [],
      deck: shuffleArray([...player1Deck]),
      discard: [],
      energy: 0,
      dragonFreezeStacks: 0,
      dragonFreezeImmune: false,
      dragonBurn: 0,
      riderFreezeStacks: 0,
      riderFreezeImmune: false,
      riderBurn: 0,
      firstAttackThisTurn: true,
      burnAppliedThisTurn: false,
      actionsTakenThisTurn: 0,
    },
    
    player2: {
      rider: createRider(player2Rider),
      dragon: createDragon(player2Dragon),
      hand: [],
      deck: shuffleArray([...player2Deck]),
      discard: [],
      energy: 0,
      dragonFreezeStacks: 0,
      dragonFreezeImmune: false,
      dragonBurn: 0,
      riderFreezeStacks: 0,
      riderFreezeImmune: false,
      riderBurn: 0,
      firstAttackThisTurn: true,
      burnAppliedThisTurn: false,
      actionsTakenThisTurn: 0,
    },
    
    winner: null,
    winType: null,
    actionLog: [],
  };
}
```
