import type { GameState, PlayerState, TargetType, PlayerNumber } from '../data/types';
import { getPlayer, getOpponentPlayer } from './state';
import { getAttackCost, canAttack } from './validation';
import { isWounded, isCritical } from '../data/riders';

// ============================================================================
// STATUS EFFECTS
// ============================================================================

export function applyFreeze(player: PlayerState, target: TargetType): boolean {
  if (target === 'dragon') {
    if (player.dragonFreezeImmune) return false;
    player.dragonFrozen = true;
    return true;
  } else {
    if (player.riderFreezeImmune) return false;
    player.riderFrozen = true;
    return true;
  }
}

export function applyBurn(player: PlayerState, target: TargetType, stacks: number): void {
  if (target === 'dragon') {
    player.dragonBurn += stacks;
  } else {
    player.riderBurn += stacks;
  }
}

export function clearFreeze(player: PlayerState, target: TargetType): void {
  if (target === 'dragon') {
    player.dragonFrozen = false;
  } else {
    player.riderFrozen = false;
  }
}

export function grantFreezeImmunity(player: PlayerState, target: TargetType): void {
  if (target === 'dragon') {
    player.dragonFreezeImmune = true;
  } else {
    player.riderFreezeImmune = true;
  }
}

export function clearFreezeImmunity(player: PlayerState): void {
  player.dragonFreezeImmune = false;
  player.riderFreezeImmune = false;
}

// ============================================================================
// DAMAGE
// ============================================================================

export interface DamageResult {
  rawDamage: number;
  damageReduction: number;
  shieldAbsorbed: number;
  finalDamage: number;
  triggeredSteelhorn: boolean;
}

export function calculateDamageReduction(
  defender: PlayerState,
  target: TargetType
): number {
  // Bronn reduces damage
  if (defender.rider.name === 'Bronn') {
    if (isCritical(defender.rider)) {
      // Critical: no reduction
      return 0;
    }
    if (isWounded(defender.rider)) {
      // Wounded: only dragon damage reduced
      return target === 'dragon' ? 1 : 0;
    }
    // Normal: all damage reduced by 1
    return 1;
  }
  return 0;
}

export function damageDragon(
  state: GameState,
  defender: PlayerState,
  amount: number,
  attackerPlayer?: PlayerNumber
): DamageResult {
  const reduction = calculateDamageReduction(defender, 'dragon');
  const reducedAmount = Math.max(0, amount - reduction);

  // Damage goes directly to HP (no shield absorption)
  defender.dragon.hp -= reducedAmount;

  // Steelhorn counter - attacker loses 1 energy
  let triggeredSteelhorn = false;
  if (
    defender.dragon.name === 'Steelhorn' &&
    attackerPlayer !== undefined &&
    reducedAmount > 0
  ) {
    const attacker = getPlayer(state, attackerPlayer);
    attacker.energy = Math.max(0, attacker.energy - 1);
    triggeredSteelhorn = true;
  }

  return {
    rawDamage: amount,
    damageReduction: reduction,
    shieldAbsorbed: 0,
    finalDamage: reducedAmount,
    triggeredSteelhorn,
  };
}

export function damageRider(
  defender: PlayerState,
  amount: number
): DamageResult {
  const reduction = calculateDamageReduction(defender, 'rider');
  const reducedAmount = Math.max(0, amount - reduction);

  // Shields absorb damage before HP
  const shieldAbsorbed = Math.min(defender.rider.shields, reducedAmount);
  defender.rider.shields -= shieldAbsorbed;
  const hpDamage = reducedAmount - shieldAbsorbed;
  defender.rider.hp -= hpDamage;

  return {
    rawDamage: amount,
    damageReduction: reduction,
    shieldAbsorbed,
    finalDamage: hpDamage,
    triggeredSteelhorn: false,
  };
}

export function healDragon(player: PlayerState, amount: number): number {
  const maxHeal = player.dragon.maxHp - player.dragon.hp;
  const actualHeal = Math.min(amount, maxHeal);
  player.dragon.hp += actualHeal;
  return actualHeal;
}

export function healRider(player: PlayerState, amount: number): number {
  const maxHeal = player.rider.maxHp - player.rider.hp;
  const actualHeal = Math.min(amount, maxHeal);
  player.rider.hp += actualHeal;

  // Healing above wounded threshold removes forceWounded
  if (player.rider.hp > player.rider.woundedThreshold) {
    player.rider.forceWounded = false;
  }

  return actualHeal;
}

export function addShields(player: PlayerState, amount: number): number {
  // Morrik wounded: shields are halved (rounded up)
  let finalAmount = amount;
  if (player.rider.name === 'Morrik' && isWounded(player.rider)) {
    finalAmount = Math.ceil(amount / 2);
  }
  player.rider.shields += finalAmount;
  return finalAmount;
}

// ============================================================================
// ATTACK EXECUTION
// ============================================================================

export interface AttackResult {
  success: boolean;
  damage: DamageResult | null;
  splashDamage: DamageResult | null;
  kaelBonus: { damage: number; shields: number } | null;
  dragonAbility: string | null;
  frozeTarget: boolean;
  burnApplied: number;
  energyStolen: number;
}

export function executeAttack(
  state: GameState,
  attackerNum: PlayerNumber,
  target: TargetType
): AttackResult {
  const attacker = getPlayer(state, attackerNum);
  const defender = getOpponentPlayer(state, attackerNum);

  const result: AttackResult = {
    success: false,
    damage: null,
    splashDamage: null,
    kaelBonus: null,
    dragonAbility: null,
    frozeTarget: false,
    burnApplied: 0,
    energyStolen: 0,
  };

  if (!canAttack(state, attacker, target)) {
    return result;
  }

  // Pay cost
  const cost = getAttackCost(attacker, target);
  attacker.energy -= cost;

  // Base damage
  let damage = attacker.dragon.attackDamage;

  // Kael first attack bonus
  if (attacker.rider.name === 'Kael' && attacker.firstAttackThisTurn) {
    if (isWounded(attacker.rider)) {
      damage += 1;
      attacker.rider.shields += 1;
      result.kaelBonus = { damage: 1, shields: 1 };
    } else {
      damage += 2;
      attacker.rider.shields += 2;
      result.kaelBonus = { damage: 2, shields: 2 };
    }
  }

  // Apply damage to target
  if (target === 'dragon') {
    result.damage = damageDragon(state, defender, damage, attackerNum);
  } else {
    result.damage = damageRider(defender, damage);
  }

  // Dragon abilities
  switch (attacker.dragon.name) {
    case 'Emberfang':
      // Burn on first attack only
      if (attacker.firstAttackThisTurn && !attacker.burnAppliedThisTurn) {
        applyBurn(defender, target, 1);
        attacker.burnAppliedThisTurn = true;
        result.burnApplied = 1;
        result.dragonAbility = 'Emberfang applied 1 Burn';
      }
      break;

    case 'Cryowyrm':
      // Freeze target
      if (applyFreeze(defender, target)) {
        result.frozeTarget = true;
        result.dragonAbility = 'Cryowyrm froze target';
      } else {
        result.dragonAbility = 'Target was immune to freeze';
      }
      break;

    case 'Voltwing':
      // Splash damage to other target
      const splashTarget: TargetType = target === 'dragon' ? 'rider' : 'dragon';
      if (splashTarget === 'dragon') {
        result.splashDamage = damageDragon(state, defender, 2, attackerNum);
      } else {
        result.splashDamage = damageRider(defender, 2);
      }
      result.dragonAbility = `Voltwing dealt 2 splash to ${splashTarget}`;
      break;

    case 'Voidmaw':
      // Steal 1 energy
      const stolen = Math.min(1, defender.energy);
      defender.energy -= stolen;
      attacker.energy += stolen;
      result.energyStolen = stolen;
      result.dragonAbility = `Voidmaw stole ${stolen} energy`;
      break;

    case 'Steelhorn':
      // Steelhorn's ability triggers when taking damage, handled in damageDragon
      break;
  }

  attacker.firstAttackThisTurn = false;
  result.success = true;

  return result;
}
