# Dragon Riders — AI Logic Implementation

Guide for implementing an AI opponent with configurable difficulty.

---

## Overview

The AI uses a **scoring-based action selection** system:
1. Generate all legal actions
2. Score each action based on game state
3. Select action with highest score (with optional randomness for difficulty)

---

## Core AI Structure

```typescript
interface AIConfig {
  // Randomness factor: 0 = perfect play, higher = more random
  randomness: number;
  
  // Aggression: 0-1, how much to prioritize damage vs defense
  aggression: number;
  
  // Target preference: 0 = dragon focus, 1 = rider focus
  riderFocus: number;
}

const DIFFICULTY_PRESETS: Record<string, AIConfig> = {
  easy: { randomness: 15, aggression: 0.5, riderFocus: 0.3 },
  medium: { randomness: 8, aggression: 0.6, riderFocus: 0.4 },
  hard: { randomness: 3, aggression: 0.7, riderFocus: 0.5 },
  expert: { randomness: 0, aggression: 0.7, riderFocus: 0.5 },
};
```

---

## Action Generation

```typescript
interface AIAction {
  type: 'attack_dragon' | 'attack_rider' | 'play_card' | 'pass';
  card?: Card;
  target?: 'dragon' | 'rider';
}

function generateActions(state: GameState, player: PlayerNumber): AIAction[] {
  const p = getPlayer(state, player);
  const actions: AIAction[] = [];
  
  // Can always pass
  actions.push({ type: 'pass' });
  
  // Check if can attack (stagger: only 1 action while frozen)
  const canAttack = p.dragon.hp > 0 && (p.dragonFreezeStacks === 0 || p.actionsTakenThisTurn < 1);
  const attackCost = calculateAttackCost(p);
  
  if (canAttack && p.energy >= attackCost) {
    actions.push({ type: 'attack_dragon' });
    actions.push({ type: 'attack_rider' });
  }
  
  // Check if can play cards (stagger: only 1 action while frozen)
  const canPlayCards = p.dragonFreezeStacks === 0 || p.actionsTakenThisTurn < 1;
  
  if (canPlayCards) {
    for (const card of p.hand) {
      const cost = calculateCardCost(p, card);
      if (p.energy >= cost) {
        // Some cards need target specification
        if (card.effectType === 'freeze' && card.target === 'dragon') {
          actions.push({ type: 'play_card', card, target: 'dragon' });
        } else if (card.effectType === 'freeze' && card.target === 'rider') {
          actions.push({ type: 'play_card', card, target: 'rider' });
        } else {
          actions.push({ type: 'play_card', card });
        }
      }
    }
  }
  
  return actions;
}

function calculateAttackCost(player: PlayerState): number {
  let cost = player.dragon.attackCost;
  if (player.rider.name === 'Kael' && isCritical(player.rider)) {
    cost += 1;
  }
  return cost;
}

function calculateCardCost(player: PlayerState, card: Card): number {
  let cost = card.cost;
  if (player.rider.name === 'Lyra' && isWounded(player.rider) && card.effectType === 'freeze') {
    cost += 1;
  }
  return cost;
}
```

---

## Scoring System

```typescript
function scoreAction(
  state: GameState,
  player: PlayerNumber,
  action: AIAction,
  config: AIConfig
): number {
  const p = getPlayer(state, player);
  const opp = getOpponent(state, player);
  
  // Base scores by action type
  let score = 0;
  
  switch (action.type) {
    case 'pass':
      return -10; // Avoid passing unless necessary
      
    case 'attack_dragon':
      score = scoreAttackDragon(state, p, opp, config);
      break;
      
    case 'attack_rider':
      score = scoreAttackRider(state, p, opp, config);
      break;
      
    case 'play_card':
      score = scoreCard(state, p, opp, action.card!, config);
      break;
  }
  
  // Add randomness for difficulty
  score += (Math.random() - 0.5) * config.randomness * 2;
  
  return score;
}
```

### Attack Scoring

```typescript
function scoreAttackDragon(
  state: GameState,
  p: PlayerState,
  opp: PlayerState,
  config: AIConfig
): number {
  let score = 50;
  
  // Calculate expected damage
  let damage = p.dragon.attackDamage;
  if (p.rider.name === 'Kael' && p.firstAttackThisTurn && !isWounded(p.rider)) {
    damage += 2;
  }
  
  // Bonus for low HP target
  const oppDragonPct = opp.dragon.hp / opp.dragon.maxHp;
  if (oppDragonPct < 0.3) score += 25;
  else if (oppDragonPct < 0.5) score += 10;
  
  // Bonus for lethal
  if (opp.dragon.hp <= damage) score += 50;
  
  // Dragon ability bonuses
  if (p.dragon.name === 'Emberfang' && p.firstAttackThisTurn) {
    score += 5; // Burn value
  }
  if (p.dragon.name === 'Voltwing') {
    score += 8; // Splash value
  }
  if (p.dragon.name === 'Voidmaw') {
    score += 10; // Energy steal value
    if (p.energy >= opp.energy) score += 5; // Maintain advantage
  }
  
  // Adjust for aggression config
  score *= (0.5 + config.aggression * 0.5);
  
  // Adjust for dragon focus (inverse of riderFocus)
  score *= (1.2 - config.riderFocus * 0.4);
  
  return score;
}

function scoreAttackRider(
  state: GameState,
  p: PlayerState,
  opp: PlayerState,
  config: AIConfig
): number {
  let score = 45;
  
  let damage = p.dragon.attackDamage;
  if (p.rider.name === 'Kael' && p.firstAttackThisTurn && !isWounded(p.rider)) {
    damage += 2;
  }
  
  // Bonus for low HP target
  const oppRiderPct = opp.rider.hp / opp.rider.maxHp;
  if (oppRiderPct < 0.3) score += 30;
  else if (oppRiderPct < 0.5) score += 15;
  
  // Bonus for lethal
  if (opp.rider.hp <= damage) score += 60;
  
  // Bonus if rider shields are down
  if (opp.rider.shields === 0) score += 8;

  // Bonus if would push into wounded/critical
  if (opp.rider.hp > opp.rider.woundedThreshold && 
      opp.rider.hp - damage <= opp.rider.woundedThreshold) {
    score += 12;
  }
  
  // Dragon ability bonuses
  if (p.dragon.name === 'Voltwing') {
    score += 8;
  }
  if (p.dragon.name === 'Voidmaw') {
    score += 10;
  }
  
  // Adjust for aggression
  score *= (0.5 + config.aggression * 0.5);
  
  // Adjust for rider focus
  score *= (0.8 + config.riderFocus * 0.4);
  
  return score;
}
```

### Card Scoring

```typescript
function scoreCard(
  state: GameState,
  p: PlayerState,
  opp: PlayerState,
  card: Card,
  config: AIConfig
): number {
  let score = 0;
  
  switch (card.effectType) {
    case 'damage':
      score = scoreDamageCard(card, p, opp, config);
      break;
      
    case 'burn':
      score = scoreBurnCard(card, p, opp, config);
      break;
      
    case 'freeze':
      score = scoreFreezeCard(card, p, opp, config);
      break;
      
    case 'shield':
      score = scoreShieldCard(card, p, config);
      break;
      
    case 'heal':
      score = scoreHealCard(card, p, config);
      break;
      
    case 'energy':
      score = scoreEnergyCard(card, p, config);
      break;
      
    case 'drain':
      score = scoreDrainCard(card, p, opp, config);
      break;
      
    case 'chain':
    case 'dual':
      score = scoreMultiTargetCard(card, opp, config);
      break;
      
    case 'cripple':
      score = scoreCrippleCard(card, opp, config);
      break;
      
    case 'thaw':
      score = scoreThawCard(p);
      break;
      
    case 'firebreak':
      score = scoreFirebreakCard(p);
      break;
      
    case 'strip':
      score = scoreStripCard(opp);
      break;
      
    case 'discard':
      score = 35; // Moderate value
      break;
      
    case 'energy_shield':
      score = 25; // Low priority unless expecting status
      break;
  }
  
  // Efficiency bonus (damage per energy)
  if (card.value > 0 && card.cost > 0) {
    const efficiency = card.value / card.cost;
    score += efficiency * 5;
  }
  
  return score;
}

function scoreDamageCard(card: Card, p: PlayerState, opp: PlayerState, config: AIConfig): number {
  let score = 40 + card.value * 5;
  
  if (card.target === 'dragon') {
    // Lethal check
    if (opp.dragon.hp <= card.value) score += 40;
    // Low HP bonus
    if (opp.dragon.hp < opp.dragon.maxHp * 0.3) score += 15;
    // Adjust for focus
    score *= (1.2 - config.riderFocus * 0.4);
  } else if (card.target === 'rider') {
    // Lethal check
    if (opp.rider.hp <= card.value) score += 50;
    // Low HP bonus
    if (opp.rider.hp < opp.rider.maxHp * 0.3) score += 20;
    // Breakpoint bonus
    if (opp.rider.hp > opp.rider.woundedThreshold && 
        opp.rider.hp - card.value <= opp.rider.woundedThreshold) {
      score += 10;
    }
    // Adjust for focus
    score *= (0.8 + config.riderFocus * 0.4);
  }
  
  return score;
}

function scoreFreezeCard(card: Card, p: PlayerState, opp: PlayerState, config: AIConfig): number {
  // Check if freeze would apply
  if (card.target === 'dragon') {
    if (opp.dragonFreezeStacks > 0 || opp.dragonFreezeImmune) return 5;
  } else {
    if (opp.riderFreezeStacks > 0 || opp.riderFreezeImmune) return 5;
  }
  
  let score = 45;
  
  // Lyra bonus
  if (p.rider.name === 'Lyra' && !isWounded(p.rider)) {
    score += 15;
  }
  
  return score;
}

function scoreShieldCard(card: Card, p: PlayerState, config: AIConfig): number {
  let score = 30;
  
  // More valuable when rider is low
  if (p.rider.hp < p.rider.maxHp * 0.5) {
    score += 15;
  }
  
  // Morrik bonus
  if (p.rider.name === 'Morrik') {
    score += 15; // Extra shields + energy
  }
  
  // Defensive adjustment
  score *= (1.5 - config.aggression * 0.5);
  
  return score;
}

function scoreHealCard(card: Card, p: PlayerState, config: AIConfig): number {
  const target = card.target === 'dragon' ? p.dragon : p.rider;
  const maxHp = card.target === 'dragon' ? p.dragon.maxHp : p.rider.maxHp;
  const currentPct = target.hp / maxHp;
  
  // Don't heal if already high
  if (currentPct > 0.8) return 10;
  
  let score = 25;
  
  // More valuable when low
  if (currentPct < 0.3) score += 30;
  else if (currentPct < 0.5) score += 15;
  
  // Rider heal can remove wounded status
  if (card.target === 'rider' && isWounded(p.rider) && !p.rider.forceWounded) {
    if (p.rider.hp + card.value > p.rider.woundedThreshold) {
      score += 15;
    }
  }
  
  // Defensive adjustment
  score *= (1.5 - config.aggression * 0.5);
  
  return score;
}

function scoreThawCard(p: PlayerState): number {
  if (p.dragonFreezeStacks > 0 || p.riderFreezeStacks > 0) {
    return 60; // High priority to unfreeze
  }
  return 15; // Just for the draw
}

function scoreFirebreakCard(p: PlayerState): number {
  const totalBurn = p.dragonBurn + p.riderBurn;
  if (totalBurn === 0) return 5;
  return 20 + totalBurn * 12;
}

function scoreStripCard(opp: PlayerState): number {
  if (opp.rider.shields === 0) return 5;
  return 20 + opp.rider.shields * 10;
}

function scoreDrainCard(card: Card, p: PlayerState, opp: PlayerState, config: AIConfig): number {
  let score = 35;
  
  // Voidmaw synergy
  if (p.dragon.name === 'Voidmaw') {
    score += 20;
  }
  
  // More valuable if opponent has high energy
  if (opp.energy > 5) score += 10;
  
  return score;
}

function scoreMultiTargetCard(card: Card, opp: PlayerState, config: AIConfig): number {
  let score = 45;
  
  // Check for lethals
  if (opp.dragon.hp <= card.value) score += 30;
  if (opp.rider.hp <= card.secondaryValue) score += 40;
  
  return score;
}

function scoreCrippleCard(card: Card, opp: PlayerState, config: AIConfig): number {
  // Less valuable if already wounded
  if (isWounded(opp.rider)) return 35;
  return 55;
}

function scoreBurnCard(card: Card, p: PlayerState, opp: PlayerState, config: AIConfig): number {
  let score = 45;
  
  // Value increases with expected game length
  // More valuable early game
  if (opp.dragon.hp > opp.dragon.maxHp * 0.7) score += 10;
  
  return score;
}

function scoreEnergyCard(card: Card, p: PlayerState, config: AIConfig): number {
  // Energy Surge is generally good
  return 40;
}
```

---

## AI Turn Execution

```typescript
async function executeAITurn(state: GameState, player: PlayerNumber, config: AIConfig): Promise<void> {
  // Start phase is automatic
  executeStartPhase(state, player);
  
  // Action phase - keep taking actions until pass
  let actionCount = 0;
  const maxActions = 20; // Safety limit
  
  while (!state.winner && actionCount < maxActions) {
    const actions = generateActions(state, player);
    
    // If only action is pass, we're done
    if (actions.length === 1 && actions[0].type === 'pass') {
      break;
    }
    
    // Score all actions
    const scoredActions = actions.map(action => ({
      action,
      score: scoreAction(state, player, action, config),
    }));
    
    // Sort by score descending
    scoredActions.sort((a, b) => b.score - a.score);
    
    // Select best action (or pass if best score is negative)
    const best = scoredActions[0];
    if (best.action.type === 'pass' || best.score < 0) {
      break;
    }
    
    // Execute action
    executeAction(state, player, best.action);
    actionCount++;
    
    // Small delay for UI (optional)
    await sleep(300);
  }
  
  // End phase is automatic
  executeEndPhase(state, player);
}
```

---

## Dragon-Specific AI Adjustments

```typescript
function getDragonAIModifiers(dragonName: DragonName): Partial<AIConfig> {
  switch (dragonName) {
    case 'Voidmaw':
      // Prioritize attacks and energy drain
      return { aggression: 0.8 };
      
    case 'Emberfang':
      // Value burn cards more, patient play
      return { aggression: 0.6 };
      
    case 'Cryowyrm':
      // Value freeze, control-oriented
      return { aggression: 0.5 };
      
    case 'Steelhorn':
      // Defensive, let enemy come to you
      return { aggression: 0.4 };
      
    case 'Voltwing':
      // Aggressive, maximize splash value
      return { aggression: 0.8 };
      
    default:
      return {};
  }
}
```

---

## Testing the AI

```typescript
// Simulate many games to verify AI doesn't do obviously wrong things
async function testAI(): Promise<void> {
  const results = {
    wins: 0,
    losses: 0,
    avgTurns: 0,
  };
  
  for (let i = 0; i < 100; i++) {
    const state = createRandomGame();
    
    while (!state.winner) {
      if (state.activePlayer === 1) {
        // AI plays
        await executeAITurn(state, 1, DIFFICULTY_PRESETS.hard);
      } else {
        // Random opponent for testing
        await executeRandomTurn(state, 2);
      }
      nextTurn(state);
    }
    
    if (state.winner === 1) results.wins++;
    else results.losses++;
    results.avgTurns += state.turn;
  }
  
  results.avgTurns /= 100;
  console.log('AI Test Results:', results);
  // Hard AI should win >70% vs random
}
```
