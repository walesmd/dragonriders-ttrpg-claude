# Dragon Riders — Complete Game Rules (v0.12)

## Overview

Dragon Riders is a competitive 2-player card game. Each player controls one Rider and one Dragon, using a drafted deck of 20 cards to destroy their opponent's Dragon or Rider.

---

## Win Conditions

You win immediately when:
1. **Dragon Kill:** Opponent's Dragon reaches 0 HP
2. **Rider Kill:** Opponent's Rider reaches 0 HP

If both would die simultaneously, Dragon death is checked first.

---

## Game Setup

1. **Select Riders:** Each player chooses one Rider
2. **Select Dragons:** Each player chooses one Dragon  
3. **Draft Decks:** Players draft 20 cards each from the shared pool
4. **Draw Hands:** Each player draws 4 cards
5. **Determine First Player:** Random

---

## Turn Structure

Each turn has three phases:

### 1. Start Phase
1. Draw 1 card (up to hand limit of 5)
2. Gain +3 Energy
3. Gain Rider economy bonus
4. Resolve Burn damage (1 per stack to each affected target)
5. Resolve Dragon start-of-turn abilities
6. Check win conditions

### 2. Action Phase
Take any number of actions in any order:
- **Attack with Dragon** (costs Energy, usually 2)
- **Play a Card** (costs Energy as listed)
- **Pass** (end your turn)

**Freeze Restriction (Stagger):** If your Dragon has any Freeze stacks, you may take only **one** action total (either play a card or attack).

### 3. End Phase
1. Discard down to hand limit (5 cards)
2. Remove Freeze from your frozen targets
3. Frozen targets gain Freeze Immunity until end of their next turn

---

## Resources

### Energy
- Gained at start of turn (+3 base + Rider economy)
- Spent to attack or play cards
- Does not carry maximum (can accumulate)
- Cannot go below 0

### HP (Hit Points)
- Dragons and Riders each have separate HP
- When HP reaches 0, that unit is defeated
- Can be healed but not above maximum

### Shields (Riders)
- Riders start with shields based on their chosen Dragon
- Shields absorb damage before HP
- Do not regenerate naturally
- Can be added via cards or abilities
- Dragons do NOT have shields

---

## Damage Rules

### Damaging Dragons
1. Apply any damage reduction (Bronn passive)
2. Damage reduces HP directly (dragons have no shields)
3. Trigger Steelhorn ability if applicable

### Damaging Riders
1. Apply any damage reduction (Bronn passive, only if not wounded)
2. Damage hits Rider Shields first
3. Remaining damage reduces HP

---

## Status Effects

### Burn
- Stacks indefinitely
- Each stack deals 1 damage at start of owner's turn
- Can affect Dragons or Riders
- Removed by Firebreak card

### Freeze
- Freeze stacks (each application adds 1 stack)
- While you have any Freeze stacks, you may take only **one** action total
- At end of your turn, Freeze stacks decrease by 1
- When stacks reach 0, you gain Freeze Immunity until end of your next turn

### Freeze Immunity
- Prevents Freeze from being applied
- Lasts until end of target's NEXT turn
- Gained automatically when Freeze wears off

---

## Riders

### Talia
| Stat | Value |
|------|-------|
| HP | 18 |
| Economy | 2 |
| Passive | If your Dragon is alive at start of turn, gain +1 Energy |

**Breakpoints:**
- Wounded (≤13 HP): Economy reduced by 1
- Critical (≤7 HP): Lose Dragon bonus entirely

### Kael
| Stat | Value |
|------|-------|
| HP | 17 |
| Economy | 1 |
| Passive | First attack each turn: +2 damage, gain 2 Shields |

**Breakpoints:**
- Wounded (≤12 HP): First attack bonus reduced to +1 damage, +1 Shield
- Critical (≤6 HP): All attacks cost +1 Energy

### Bronn
| Stat | Value |
|------|-------|
| HP | 20 |
| Economy | 1 |
| Passive | Reduce first damage taken each turn by 1 |

**Breakpoints:**
- Wounded (≤14 HP): Damage reduction only applies to Dragon damage
- Critical (≤8 HP): Lose damage reduction entirely

### Lyra
| Stat | Value |
|------|-------|
| HP | 17 |
| Economy | 2 |
| Passive | Freeze effects you apply last +1 turn |

**Breakpoints:**
- Wounded (≤12 HP): Lose Freeze duration bonus
- Critical (≤6 HP): Freeze cards cost +1 Energy

### Morrik
| Stat | Value |
|------|-------|
| HP | 19 |
| Economy | 2 |
| Passive | Shields you gain have +2 durability. Gain +1 Energy when playing Shield cards. |

**Breakpoints:**
- Wounded (≤14 HP): Shield bonus reduced to +1
- Critical (≤8 HP): Shields enter exhausted (cannot absorb damage the turn gained)

---

## Dragons

All Dragons have Attack Cost 2 and Attack Damage 3.

### Emberfang
| Stat | Value |
|------|-------|
| HP | 33 |
| Rider Shields | 3 |
| Ability | On your first attack each turn, apply 1 Burn to the target |

### Cryowyrm
| Stat | Value |
|------|-------|
| HP | 30 |
| Rider Shields | 2 |
| Ability | On hit, apply Freeze to the target (respects Freeze Immunity). Deals +1 damage to already Frozen targets. |

### Voltwing
| Stat | Value |
|------|-------|
| HP | 35 |
| Rider Shields | 2 |
| Ability | On attack, deal 2 splash damage to the other enemy (if you attack Dragon, splash hits Rider and vice versa) |

### Steelhorn
| Stat | Value |
|------|-------|
| HP | 40 |
| Rider Shields | 4 |
| Ability | Whenever Steelhorn takes damage, the attacker loses 1 Energy |

### Voidmaw
| Stat | Value |
|------|-------|
| HP | 32 |
| Rider Shields | 2 |
| Ability | On attack, steal 1 Energy from opponent. At start of your turn, if you have more Energy than opponent, deal 2 damage to their Dragon. |

---

## Card Pool (44 Cards)

### Dragon Damage Cards (8)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Strike | 1 | Deal 2 damage to enemy Dragon | 4 |
| Heavy Blow | 3 | Deal 4 damage to enemy Dragon | 2 |
| Burning Hit | 2 | Deal 1 damage to enemy Dragon and apply 1 Burn | 2 |

### Rider Damage Cards (6)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Weakening Strike | 1 | Deal 2 damage to enemy Rider | 3 |
| Precision Strike | 1 | Deal 3 damage to enemy Rider | 2 |
| Crippling Blow | 3 | Deal 2 damage to enemy Rider, target becomes Wounded until healed | 1 |

### Multi-Target Cards (4)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Chain Bolt | 2 | Deal 2 damage to enemy Dragon, 1 damage to enemy Rider | 2 |
| Dual Strike | 1 | Deal 1 damage to enemy Dragon and 1 damage to enemy Rider | 2 |

### Control Cards (8)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Freeze Ray | 2 | Apply Freeze to enemy Dragon | 2 |
| Rider Immobilize | 3 | Apply Freeze to enemy Rider | 2 |
| Energy Drain | 2 | Opponent loses 2 Energy | 2 |
| Sabotage | 2 | Opponent discards 2 cards randomly | 2 |

### Defense Cards (4)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Shield Up | 2 | Your Rider gains 2 Shields | 3 |
| Shield Disruptor | 2 | Destroy all Shields on enemy Rider | 1 |

### Healing Cards (6)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Dragon Heal | 2 | Heal your Dragon for 3 HP | 2 |
| Rider Heal | 2 | Heal your Rider for 3 HP | 4 |

### Utility Cards (8)
| Card | Cost | Effect | Copies |
|------|------|--------|--------|
| Energy Surge | 1 | Gain 3 Energy | 2 |
| Thaw | 1 | Remove Freeze from your Dragon or Rider, draw 1 card | 2 |
| Firebreak | 1 | Remove all Burn from your Dragon and Rider | 2 |
| Energy Shield | 2 | Prevent the next status effect applied to your Rider | 2 |

---

## Glossary

| Term | Definition |
|------|------------|
| **Stack** | Multiple instances of an effect (Burn stacks, Shields stack) |
| **Splash** | Secondary damage to another target |
| **Wounded** | Mid-tier Rider breakpoint state |
| **Critical** | Severe Rider breakpoint state |
| **Exhausted** | Cannot be used this turn |
| **Economy** | Energy gained at start of turn from Rider |

---

## Rules Precedence

When rules conflict, resolve in this order:
1. Win conditions
2. Card text
3. Freeze Immunity
4. Rider breakpoints
5. Dragon abilities
6. Rider passives
7. Base rules
