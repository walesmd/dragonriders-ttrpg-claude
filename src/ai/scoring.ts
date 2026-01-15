import type { PlayerState, Card, TargetType } from '../data/types';
import { isWounded } from '../data/riders';
import type { AIConfig } from './presets';

export interface AIAction {
  type: 'attack_dragon' | 'attack_rider' | 'play_card' | 'pass';
  card?: Card;
  target?: TargetType;
}

export function scoreAction(
  _state: unknown,
  p: PlayerState,
  opp: PlayerState,
  action: AIAction,
  config: AIConfig
): number {
  let score = 0;

  switch (action.type) {
    case 'pass':
      return -10;

    case 'attack_dragon':
      score = scoreAttackDragon(p, opp, config);
      break;

    case 'attack_rider':
      score = scoreAttackRider(p, opp, config);
      break;

    case 'play_card':
      if (action.card) {
        score = scoreCard(p, opp, action.card, action.target, config);
      }
      break;
  }

  // Add randomness for difficulty
  score += (Math.random() - 0.5) * config.randomness * 2;

  return score;
}

function getExpectedDamage(p: PlayerState): number {
  let damage = p.dragon.attackDamage;
  if (p.rider.name === 'Kael' && p.firstAttackThisTurn) {
    damage += isWounded(p.rider) ? 1 : 2;
  }
  return damage;
}

function scoreAttackDragon(p: PlayerState, opp: PlayerState, config: AIConfig): number {
  let score = 50;
  const damage = getExpectedDamage(p);

  // Bonus for low HP target
  const oppDragonPct = opp.dragon.hp / opp.dragon.maxHp;
  if (oppDragonPct < 0.3) score += 25;
  else if (oppDragonPct < 0.5) score += 10;

  // Bonus if rider shields are down
  if (opp.rider.shields === 0) score += 8;

  // Bonus for lethal
  if (opp.dragon.hp <= damage) score += 50;

  // Dragon ability bonuses
  if (p.dragon.name === 'Emberfang' && p.firstAttackThisTurn) score += 5;
  if (p.dragon.name === 'Voltwing') score += 8;
  if (p.dragon.name === 'Voidmaw') {
    score += 10;
    if (p.energy >= opp.energy) score += 5;
  }

  // Adjust for aggression and focus
  score *= 0.5 + config.aggression * 0.5;
  score *= 1.2 - config.riderFocus * 0.4;

  return score;
}

function scoreAttackRider(p: PlayerState, opp: PlayerState, config: AIConfig): number {
  let score = 45;
  const damage = getExpectedDamage(p);

  // Bonus for low HP target
  const oppRiderPct = opp.rider.hp / opp.rider.maxHp;
  if (oppRiderPct < 0.3) score += 30;
  else if (oppRiderPct < 0.5) score += 15;

  // Bonus for lethal
  if (opp.rider.hp <= damage) score += 60;

  // Bonus if would push into wounded
  if (opp.rider.hp > opp.rider.woundedThreshold &&
      opp.rider.hp - damage <= opp.rider.woundedThreshold) {
    score += 12;
  }

  // Dragon ability bonuses
  if (p.dragon.name === 'Voltwing') score += 8;
  if (p.dragon.name === 'Voidmaw') score += 10;

  // Adjust for aggression and focus
  score *= 0.5 + config.aggression * 0.5;
  score *= 0.8 + config.riderFocus * 0.4;

  return score;
}

function scoreCard(
  p: PlayerState,
  opp: PlayerState,
  card: Card,
  target: TargetType | undefined,
  config: AIConfig
): number {
  let score = 0;

  switch (card.effectType) {
    case 'damage':
      score = scoreDamageCard(card, opp, config);
      break;

    case 'burn':
      score = scoreBurnCard(card, opp);
      break;

    case 'freeze':
      score = scoreFreezeCard(card, p, opp, target);
      break;

    case 'shield':
      score = scoreShieldCard(card, p, config);
      break;

    case 'heal':
      score = scoreHealCard(card, p, config);
      break;

    case 'energy':
      score = 40;
      break;

    case 'drain':
      score = scoreDrainCard(p, opp);
      break;

    case 'chain':
    case 'dual':
      score = scoreMultiTargetCard(card, opp);
      break;

    case 'cripple':
      score = scoreCrippleCard(opp);
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
      score = 35;
      break;

    case 'energy_shield':
      score = 25;
      break;
  }

  // Efficiency bonus
  if (card.value > 0 && card.cost > 0) {
    score += (card.value / card.cost) * 5;
  }

  return score;
}

function scoreDamageCard(card: Card, opp: PlayerState, config: AIConfig): number {
  let score = 40 + card.value * 5;

  if (card.target === 'dragon') {
    if (opp.dragon.hp <= card.value) score += 40;
    if (opp.dragon.hp < opp.dragon.maxHp * 0.3) score += 15;
    score *= 1.2 - config.riderFocus * 0.4;
  } else if (card.target === 'rider') {
    if (opp.rider.hp <= card.value) score += 50;
    if (opp.rider.hp < opp.rider.maxHp * 0.3) score += 20;
    if (opp.rider.hp > opp.rider.woundedThreshold &&
        opp.rider.hp - card.value <= opp.rider.woundedThreshold) {
      score += 10;
    }
    score *= 0.8 + config.riderFocus * 0.4;
  }

  return score;
}

function scoreBurnCard(_card: Card, opp: PlayerState): number {
  let score = 45;
  if (opp.dragon.hp > opp.dragon.maxHp * 0.7) score += 10;
  return score;
}

function scoreFreezeCard(
  card: Card,
  p: PlayerState,
  opp: PlayerState,
  target?: TargetType
): number {
  const effectiveTarget = target || card.target;

  if (effectiveTarget === 'dragon') {
    if (opp.dragonFreezeStacks > 0 || opp.dragonFreezeImmune) return 5;
  } else if (effectiveTarget === 'rider') {
    if (opp.riderFreezeStacks > 0 || opp.riderFreezeImmune) return 5;
  }

  let score = 45;
  if (p.rider.name === 'Lyra' && !isWounded(p.rider)) score += 15;

  return score;
}

function scoreShieldCard(_card: Card, p: PlayerState, config: AIConfig): number {
  let score = 30;

  if (p.dragon.hp < p.dragon.maxHp * 0.5) score += 15;
  if (p.rider.name === 'Morrik') score += 15;
  score *= 1.5 - config.aggression * 0.5;

  return score;
}

function scoreHealCard(card: Card, p: PlayerState, config: AIConfig): number {
  const isHealingDragon = card.target === 'dragon';
  const target = isHealingDragon ? p.dragon : p.rider;
  const maxHp = isHealingDragon ? p.dragon.maxHp : p.rider.maxHp;
  const currentPct = target.hp / maxHp;

  if (currentPct > 0.8) return 10;

  let score = 25;
  if (currentPct < 0.3) score += 30;
  else if (currentPct < 0.5) score += 15;

  if (!isHealingDragon && isWounded(p.rider) && !p.rider.forceWounded) {
    if (p.rider.hp + card.value > p.rider.woundedThreshold) score += 15;
  }

  score *= 1.5 - config.aggression * 0.5;

  return score;
}

function scoreThawCard(p: PlayerState): number {
  if (p.dragonFreezeStacks > 0 || p.riderFreezeStacks > 0) return 60;
  return 15;
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

function scoreDrainCard(p: PlayerState, opp: PlayerState): number {
  let score = 35;
  if (p.dragon.name === 'Voidmaw') score += 20;
  if (opp.energy > 5) score += 10;
  return score;
}

function scoreMultiTargetCard(card: Card, opp: PlayerState): number {
  let score = 45;
  if (opp.dragon.hp <= card.value) score += 30;
  if (opp.rider.hp <= card.secondaryValue) score += 40;
  return score;
}

function scoreCrippleCard(opp: PlayerState): number {
  if (isWounded(opp.rider)) return 35;
  return 55;
}
