import type { GameState, TargetType, PlayerNumber } from '../data/types';
import { getPlayer, getOpponentPlayer, drawCard, discardCard } from './state';
import { getCardCost, canPlayCard } from './validation';
import { isWounded } from '../data/riders';
import {
  damageDragon,
  damageRider,
  healDragon,
  healRider,
  addShields,
  applyFreeze,
  applyBurn,
  clearFreeze,
  DamageResult,
} from './combat';
import { shuffleArray } from '../utils/helpers';

// ============================================================================
// CARD EFFECT RESULTS
// ============================================================================

export interface CardEffectResult {
  success: boolean;
  cardName: string;
  energySpent: number;
  morrikBonus: number;
  effects: string[];
  // Raw damage results
  damageDealt?: DamageResult;
  secondaryDamage?: DamageResult;
  // Aggregated tracking for logging
  totalDamage?: number;
  damageTarget?: 'dragon' | 'rider' | 'both';
  healingDone?: number;
  shieldsGained?: number;
  burnApplied?: number;
  freezeApplied?: boolean;
}

// ============================================================================
// CARD EXECUTION
// ============================================================================

export function executeCard(
  state: GameState,
  playerNum: PlayerNumber,
  cardId: string,
  target?: TargetType
): CardEffectResult {
  const player = getPlayer(state, playerNum);
  const opponent = getOpponentPlayer(state, playerNum);

  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, cardName: '', energySpent: 0, morrikBonus: 0, effects: ['Card not found'] };
  }

  const card = player.hand[cardIndex];

  if (!canPlayCard(state, player, card)) {
    return { success: false, cardName: card.name, energySpent: 0, morrikBonus: 0, effects: ['Cannot play card'] };
  }

  const result: CardEffectResult = {
    success: true,
    cardName: card.name,
    energySpent: 0,
    morrikBonus: 0,
    effects: [],
  };

  // Pay cost
  const cost = getCardCost(player, card);
  player.energy -= cost;
  result.energySpent = cost;

  // Morrik bonus for shield cards
  if (player.rider.name === 'Morrik' && card.effectType === 'shield') {
    if (!isWounded(player.rider)) {
      player.energy += 1;
      result.morrikBonus = 1;
      result.effects.push('Morrik gained 1 energy from shield card');
    }
  }

  // Track frozen card play
  if (player.dragonFrozen) {
    player.cardsPlayedWhileFrozen++;
  }

  // Remove card from hand
  player.hand.splice(cardIndex, 1);
  player.discard.push(card);

  // Execute effect
  switch (card.effectType) {
    case 'damage':
      if (card.target === 'dragon' || target === 'dragon') {
        result.damageDealt = damageDragon(state, opponent, card.value, playerNum);
        result.totalDamage = result.damageDealt.finalDamage;
        result.damageTarget = 'dragon';
        result.effects.push(`Dealt ${result.damageDealt.finalDamage} damage to enemy Dragon`);
      } else {
        result.damageDealt = damageRider(opponent, card.value);
        result.totalDamage = result.damageDealt.finalDamage;
        result.damageTarget = 'rider';
        result.effects.push(`Dealt ${result.damageDealt.finalDamage} damage to enemy Rider`);
      }
      break;

    case 'burn':
      if (card.target === 'dragon' || target === 'dragon') {
        result.damageDealt = damageDragon(state, opponent, card.value, playerNum);
        applyBurn(opponent, 'dragon', card.secondaryValue);
        result.totalDamage = result.damageDealt.finalDamage;
        result.damageTarget = 'dragon';
        result.burnApplied = card.secondaryValue;
        result.effects.push(`Dealt ${result.damageDealt.finalDamage} damage and applied ${card.secondaryValue} Burn to enemy Dragon`);
      } else {
        result.damageDealt = damageRider(opponent, card.value);
        applyBurn(opponent, 'rider', card.secondaryValue);
        result.totalDamage = result.damageDealt.finalDamage;
        result.damageTarget = 'rider';
        result.burnApplied = card.secondaryValue;
        result.effects.push(`Dealt ${result.damageDealt.finalDamage} damage and applied ${card.secondaryValue} Burn to enemy Rider`);
      }
      break;

    case 'freeze':
      if (card.target === 'dragon' || target === 'dragon') {
        if (applyFreeze(opponent, 'dragon')) {
          result.freezeApplied = true;
          result.effects.push('Froze enemy Dragon');
        } else {
          result.effects.push('Enemy Dragon was immune to freeze');
        }
      } else {
        if (applyFreeze(opponent, 'rider')) {
          result.freezeApplied = true;
          result.effects.push('Froze enemy Rider');
        } else {
          result.effects.push('Enemy Rider was immune to freeze');
        }
      }
      break;

    case 'shield':
      const shieldsAdded = addShields(player, card.value);
      result.shieldsGained = shieldsAdded;
      result.effects.push(`Dragon gained ${shieldsAdded} shields`);
      break;

    case 'heal':
      if (card.target === 'dragon') {
        const healed = healDragon(player, card.value);
        result.healingDone = healed;
        result.effects.push(`Healed Dragon for ${healed} HP`);
      } else if (card.target === 'rider') {
        const healed = healRider(player, card.value);
        result.healingDone = healed;
        result.effects.push(`Healed Rider for ${healed} HP`);
      }
      break;

    case 'energy':
      player.energy += card.value;
      result.effects.push(`Gained ${card.value} energy`);
      break;

    case 'drain':
      const drained = Math.min(card.value, opponent.energy);
      opponent.energy -= drained;
      result.effects.push(`Opponent lost ${drained} energy`);
      break;

    case 'discard':
      // Randomly discard cards
      const toDiscard = Math.min(card.value, opponent.hand.length);
      const shuffledHand = shuffleArray([...opponent.hand]);
      for (let i = 0; i < toDiscard; i++) {
        const discardedCard = shuffledHand[i];
        discardCard(opponent, discardedCard.id);
      }
      result.effects.push(`Opponent discarded ${toDiscard} cards`);
      break;

    case 'chain':
      // Damage dragon first, then rider
      result.damageDealt = damageDragon(state, opponent, card.value, playerNum);
      result.secondaryDamage = damageRider(opponent, card.secondaryValue);
      result.totalDamage = result.damageDealt.finalDamage + result.secondaryDamage.finalDamage;
      result.damageTarget = 'both';
      result.effects.push(
        `Dealt ${result.damageDealt.finalDamage} to Dragon and ${result.secondaryDamage.finalDamage} to Rider`
      );
      break;

    case 'dual':
      // Equal damage to both
      result.damageDealt = damageDragon(state, opponent, card.value, playerNum);
      result.secondaryDamage = damageRider(opponent, card.secondaryValue);
      result.totalDamage = result.damageDealt.finalDamage + result.secondaryDamage.finalDamage;
      result.damageTarget = 'both';
      result.effects.push(
        `Dealt ${result.damageDealt.finalDamage} to Dragon and ${result.secondaryDamage.finalDamage} to Rider`
      );
      break;

    case 'cripple':
      result.damageDealt = damageRider(opponent, card.value);
      opponent.rider.forceWounded = true;
      result.totalDamage = result.damageDealt.finalDamage;
      result.damageTarget = 'rider';
      result.effects.push(
        `Dealt ${result.damageDealt.finalDamage} to Rider and forced Wounded state`
      );
      break;

    case 'thaw':
      // Remove freeze from dragon or rider (whichever is frozen)
      if (player.dragonFrozen) {
        clearFreeze(player, 'dragon');
        result.effects.push('Removed freeze from Dragon');
      } else if (player.riderFrozen) {
        clearFreeze(player, 'rider');
        result.effects.push('Removed freeze from Rider');
      } else {
        result.effects.push('Nothing to thaw');
      }
      // Draw a card
      const drawn = drawCard(player);
      if (drawn) {
        result.effects.push(`Drew ${drawn.name}`);
      }
      break;

    case 'firebreak':
      const dragonBurn = player.dragonBurn;
      const riderBurn = player.riderBurn;
      player.dragonBurn = 0;
      player.riderBurn = 0;
      result.effects.push(`Removed ${dragonBurn + riderBurn} burn stacks`);
      break;

    case 'strip':
      const shieldsRemoved = opponent.dragon.shields;
      opponent.dragon.shields = 0;
      result.effects.push(`Removed ${shieldsRemoved} shields from enemy Dragon`);
      break;

    case 'energy_shield':
      // This prevents the next status effect - we need a flag
      // For now, grant temporary immunity
      opponent.dragonFreezeImmune = true;
      result.effects.push('Dragon is protected from next status effect');
      break;
  }

  return result;
}
