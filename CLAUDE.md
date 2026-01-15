# Dragon Riders - Development Guide

## Project Overview

Dragon Riders is a competitive 1v1 card game where each player controls a Rider (economy engine) and a Dragon (combat unit). Players draft decks and battle to destroy their opponent's Dragon OR Rider.

**Target Platform:** Web-based demo for playtesting
**Game Type:** Turn-based strategy card game
**Players:** 2 (PvP or vs AI)

---

## Quick Start for Developers

### Core Game Loop
```
1. Setup: Each player picks Rider → Dragon → Drafts 20 cards
2. Game: Alternate turns until win condition
3. Turn: Start Phase → Action Phase → End Phase
4. Win: Opponent's Dragon HP ≤ 0 OR Opponent's Rider HP ≤ 0
```

### Key Files in This Directory
- `CLAUDE.md` - This file (development guide)
- `GAME_RULES.md` - Complete rules reference
- `DATA_SCHEMA.md` - Data structures and types
- `AI_LOGIC.md` - AI opponent implementation guide
- `BALANCE_DATA.md` - Win rates and matchup data from simulations

---

## Game State Structure

```typescript
interface GameState {
  turn: number;
  activePlayer: 1 | 2;
  phase: 'start' | 'action' | 'end';
  
  player1: PlayerState;
  player2: PlayerState;
  
  winner: null | 1 | 2;
  winType: null | 'dragon_kill' | 'rider_kill';
}

interface PlayerState {
  rider: Rider;
  dragon: Dragon;
  hand: Card[];
  deck: Card[];
  energy: number;
  
  // Status tracking
  dragonFreezeStacks: number;
  riderFreezeStacks: number;
  dragonFreezeImmune: boolean;
  riderFreezeImmune: boolean;
  dragonBurn: number;
  riderBurn: number;
  
  // Turn tracking
  firstAttackThisTurn: boolean;
  actionsTakenThisTurn: number;
}
```

---

## Turn Flow Implementation

### Start Phase
```typescript
function startPhase(state: GameState, player: 1 | 2): void {
  const p = getPlayer(state, player);
  const opp = getPlayer(state, opponent(player));
  
  // 1. Draw
  drawCards(p, 1);
  
  // 2. Base energy
  p.energy += 3;
  
  // 3. Rider economy
  p.energy += calculateEconomy(p.rider, p.dragon);
  
  // 4. Burn damage
  if (p.dragonBurn > 0) p.dragon.hp -= p.dragonBurn;
  if (p.riderBurn > 0) p.rider.hp -= p.riderBurn;
  
  // 5. Dragon start-of-turn abilities
  if (p.dragon.name === 'Voidmaw') {
    if (p.energy > opp.energy) {
      damageDragon(opp, 2);
    }
  }
  
  // 6. Reset turn flags
  p.firstAttackThisTurn = true;
  p.actionsTakenThisTurn = 0;
  
  // 7. Check win conditions
  checkWinConditions(state);
}
```

### Action Phase
```typescript
function actionPhase(state: GameState, player: 1 | 2): void {
  // Player can take actions until they pass or run out of options
  // Actions: Attack (dragon/rider), Play Card
  
  // Stagger restriction: While frozen, only one action total
  const p = getPlayer(state, player);
  
  const canAttack = (p.dragonFreezeStacks === 0 || p.actionsTakenThisTurn < 1) && p.dragon.hp > 0;
  const canPlayCard = p.dragonFreezeStacks === 0 || p.actionsTakenThisTurn < 1;
}
```

### End Phase
```typescript
function endPhase(state: GameState, player: 1 | 2): void {
  const p = getPlayer(state, player);
  
  // 1. Discard to hand limit
  while (p.hand.length > 5) {
    discardCard(p, selectDiscard(p)); // Player chooses or random
  }
  
  // 2. Reduce freeze stacks, grant immunity when cleared
  if (p.dragonFreezeStacks > 0) {
    p.dragonFreezeStacks = Math.max(0, p.dragonFreezeStacks - 1);
    if (p.dragonFreezeStacks === 0) p.dragonFreezeImmune = true;
  }
  if (p.riderFreezeStacks > 0) {
    p.riderFreezeStacks = Math.max(0, p.riderFreezeStacks - 1);
    if (p.riderFreezeStacks === 0) p.riderFreezeImmune = true;
  }
}

// Called at start of OPPONENT's turn
function clearImmunity(state: GameState, player: 1 | 2): void {
  const p = getPlayer(state, player);
  p.dragonFreezeImmune = false;
  p.riderFreezeImmune = false;
}
```

---

## Combat Implementation

### Dragon Attack
```typescript
function dragonAttack(
  state: GameState, 
  attacker: 1 | 2, 
  target: 'dragon' | 'rider'
): void {
  const p = getPlayer(state, attacker);
  const opp = getPlayer(state, opponent(attacker));
  
  // Calculate cost
  let cost = p.dragon.attackCost; // Usually 2
  if (p.rider.name === 'Kael' && p.rider.isCritical()) {
    cost += 1;
  }
  
  if (p.energy < cost) return; // Can't afford
  p.energy -= cost;
  
  // Calculate damage
  let damage = p.dragon.attackDamage; // Usually 3
  
  // Kael first attack bonus
  if (p.rider.name === 'Kael' && p.firstAttackThisTurn) {
    if (!p.rider.isWounded()) {
      damage += 2;
      p.rider.shields += 2;
    } else {
      damage += 1;
      p.rider.shields += 1;
    }
  }
  
  // Apply damage
  if (target === 'dragon') {
    damageDragon(opp, damage, attacker); // attacker for Steelhorn
  } else {
    damageRider(opp, damage);
  }
  
  // Dragon abilities
  applyDragonAbility(state, attacker, target);
  
  p.firstAttackThisTurn = false;
  checkWinConditions(state);
}
```

### Dragon Abilities
```typescript
function applyDragonAbility(
  state: GameState,
  attacker: 1 | 2,
  target: 'dragon' | 'rider'
): void {
  const p = getPlayer(state, attacker);
  const opp = getPlayer(state, opponent(attacker));
  
  switch (p.dragon.name) {
    case 'Emberfang':
      // Burn on first attack only
      if (p.firstAttackThisTurn) {
        if (target === 'dragon') opp.dragonBurn += 1;
        else opp.riderBurn += 1;
      }
      break;
      
    case 'Cryowyrm':
      // Freeze target (respects immunity)
      applyFreeze(opp, target);
      break;
      
    case 'Voltwing':
      // 2 splash to other target
      if (target === 'dragon') damageRider(opp, 2);
      else damageDragon(opp, 2, attacker);
      break;
      
    case 'Voidmaw':
      // Steal 1 energy
      const stolen = Math.min(1, opp.energy);
      opp.energy -= stolen;
      p.energy += stolen;
      break;
      
    // Steelhorn ability triggers on RECEIVING damage, not attacking
  }
}
```

### Damage Functions
```typescript
function damageDragon(
  player: PlayerState, 
  amount: number, 
  attackerPlayer?: 1 | 2
): void {
  // Bronn damage reduction
  if (player.rider.name === 'Bronn' && !player.rider.isCritical()) {
    amount = Math.max(0, amount - 1);
  }
  
  // Steelhorn counter (if attacker specified)
  if (player.dragon.name === 'Steelhorn' && attackerPlayer) {
    getPlayer(state, attackerPlayer).energy -= 1;
  }
  
  // Dragons have no shields in v0.12
  player.dragon.hp -= amount;
}

function damageRider(player: PlayerState, amount: number): void {
  // Bronn reduction (only when not wounded)
  if (player.rider.name === 'Bronn' && !player.rider.isWounded()) {
    amount = Math.max(0, amount - 1);
  }
  
  // Rider shields absorb first
  const shieldAbsorb = Math.min(player.rider.shields, amount);
  player.rider.shields -= shieldAbsorb;
  player.rider.hp -= (amount - shieldAbsorb);
}
```

---

## Status Effects

### Freeze
Freeze stacks. While a unit has any Freeze stacks, they may take only one action per turn. At end of turn, stacks decrease by 1 and immunity is granted when stacks reach 0.
```typescript
function applyFreeze(player: PlayerState, target: 'dragon' | 'rider'): boolean {
  // Check immunity
  if (target === 'dragon' && player.dragonFreezeImmune) return false;
  if (target === 'rider' && player.riderFreezeImmune) return false;
  
  if (target === 'dragon') player.dragonFreezeStacks += 1;
  else player.riderFreezeStacks += 1;
  
  return true;
}
```

### Burn
Burn is a stacking counter. Each stack deals 1 damage at start of turn.
```typescript
// Applied via Emberfang attack or Burning Hit card
player.dragonBurn += 1;
// or
player.riderBurn += 1;

// Removed via Firebreak card
player.dragonBurn = 0;
player.riderBurn = 0;
```

---

## Rider Breakpoints

Riders have HP thresholds that change their abilities:

```typescript
interface Rider {
  name: string;
  hp: number;
  maxHp: number;
  shields: number;
  economy: number;
  woundedThreshold: number;
  criticalThreshold: number;
  forceWounded: boolean; // From Crippling Blow card
  
  isWounded(): boolean {
    return this.hp <= this.woundedThreshold || this.forceWounded;
  }
  
  isCritical(): boolean {
    return this.hp <= this.criticalThreshold;
  }
}
```

See `GAME_RULES.md` for specific breakpoint effects per rider.

---

## Card Implementation

```typescript
interface Card {
  name: string;
  cost: number;
  effectType: CardEffectType;
  target: CardTarget;
  value: number;
  secondaryValue?: number;
}

type CardEffectType = 
  | 'damage'    // Deal damage
  | 'burn'      // Damage + apply burn
  | 'freeze'    // Apply freeze
  | 'shield'    // Add shields
  | 'heal'      // Restore HP
  | 'energy'    // Gain energy
  | 'drain'     // Opponent loses energy
  | 'discard'   // Opponent discards
  | 'chain'     // Damage dragon + rider
  | 'dual'      // Damage both
  | 'cripple'   // Damage + force wounded
  | 'thaw'      // Remove freeze + draw
  | 'firebreak' // Remove burn
  | 'strip';    // Remove shields

type CardTarget = 'dragon' | 'rider' | 'self' | 'opp' | 'both';
```

---

## UI Components Needed

### Game Board
- Player 1 area (top)
- Player 2 area (bottom)
- Each area shows: Rider, Dragon, Hand, Energy, Deck count

### Rider Display
- Portrait/icon
- HP bar with breakpoint markers
- Economy indicator
- Passive ability text
- Status effects (frozen, burn stacks)

### Dragon Display
- Portrait/icon
- HP bar
- Shield counter
- Ability text
- Status effects (frozen, burn stacks)

### Hand Display
- 0-5 cards
- Each card shows: Name, Cost, Effect
- Playable cards highlighted
- Click to select, click target to play

### Action Controls
- Attack Dragon button
- Attack Rider button
- End Turn button
- Energy display

### Game Log
- Scrollable history of actions
- "Emberfang attacks Cryowyrm for 3 damage"
- "Talia plays Strike on Steelhorn"

---

## Recommended Tech Stack

### Frontend
- **React** or **Vue** for UI
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### State Management
- **Zustand** or **Redux** for game state
- Immutable state updates important for undo/replay

### Multiplayer (Optional)
- **Socket.io** for real-time
- **Supabase** for quick backend
- Can start with local 2-player or vs AI

### AI Opponent
- See `AI_LOGIC.md` for implementation
- Scoring-based action selection
- Difficulty via randomness factor

---

## Testing Priorities

1. **Win conditions** - Dragon kill, Rider kill, simultaneous
2. **Damage calculation** - Rider shields, Bronn reduction, Steelhorn counter
3. **Freeze mechanics** - Application, immunity, action restriction
4. **Burn mechanics** - Stacking, start-of-turn damage
5. **Rider breakpoints** - Threshold effects activating correctly
6. **Dragon abilities** - Each ability in all scenarios
7. **Card effects** - All 44 cards working correctly
8. **Energy economy** - Generation, spending, stealing

---

## Common Edge Cases

1. **Simultaneous death** - Check dragon death before rider death
2. **Steelhorn vs Voidmaw** - Both trigger on attack, resolve attacker first
3. **Bronn wounded breakpoint** - Reduction changes from "all" to "dragon only"
4. **Kael wounded** - First attack bonus changes from +2/+2 to +1/+1
5. **Freeze immunity timing** - Clears at start of opponent's turn, not your own
6. **Empty deck** - Drawing from empty deck does nothing (no fatigue)
7. **Morrik shield energy** - +1 energy triggers when playing Shield Up card

---

## File Structure Suggestion

```
/dragon-riders
  /src
    /components
      GameBoard.tsx
      PlayerArea.tsx
      RiderCard.tsx
      DragonCard.tsx
      HandDisplay.tsx
      CardComponent.tsx
      ActionBar.tsx
      GameLog.tsx
    /game
      state.ts        # GameState types
      actions.ts      # Game actions
      combat.ts       # Damage calculations
      cards.ts        # Card effects
      ai.ts           # AI opponent
      constants.ts    # Rider/Dragon/Card data
    /hooks
      useGameState.ts
      useGameActions.ts
    /utils
      helpers.ts
    App.tsx
    main.tsx
  /public
    /images
      /riders
      /dragons
      /cards
  CLAUDE.md
  GAME_RULES.md
  ...
```

---

## Quick Reference: All Numbers

### Riders
| Name | HP | Economy | Wounded | Critical |
|------|-----|---------|---------|----------|
| Talia | 18 | 2 (+1 if dragon alive) | ≤13 | ≤7 |
| Kael | 17 | 1 | ≤12 | ≤6 |
| Bronn | 20 | 1 | ≤14 | ≤8 |
| Lyra | 17 | 2 | ≤12 | ≤6 |
| Morrik | 19 | 2 (+1 per shield card) | ≤14 | ≤8 |

### Dragons
| Name | HP | Rider Shields | Attack | Ability |
|------|-----|---------|--------|---------|
| Emberfang | 33 | 3 | 3 dmg, 2 cost | +1 burn (first attack) |
| Cryowyrm | 30 | 2 | 3 dmg, 2 cost | Apply freeze |
| Voltwing | 35 | 2 | 3 dmg, 2 cost | +2 splash |
| Steelhorn | 40 | 4 | 3 dmg, 2 cost | Attacker -1 energy |
| Voidmaw | 32 | 2 | 3 dmg, 2 cost | Steal 1 energy; +2 dmg if ahead |

---

## Need Help?

Refer to these files for more detail:
- `GAME_RULES.md` - Complete rules text
- `DATA_SCHEMA.md` - Full TypeScript interfaces
- `AI_LOGIC.md` - AI implementation guide
- `BALANCE_DATA.md` - Simulation results and matchup data
