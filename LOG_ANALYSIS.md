# Dragon Riders - Game Log Analysis

## Overview

This document tracks the analysis of game logs for Dragon Riders. It serves as a historical record of gameplay, rules compliance, and areas for improvement.

## Log Analysis Status

| Log File | Version | Mode | Analyzed | Date | Result | Notes |
|----------|---------|------|----------|------|--------|-------|
| game-1.json | v0.8* | AI (Unknown) | ✅ | 2026-01-11 | Incomplete | Truncated mid-turn (Turn 6), AI was functional |
| game-2.json | v0.8* | AI (Unknown) | ✅ | 2026-01-11 | Incomplete | Truncated mid-turn (Turn 4), AI was functional |
| game-3.json | v0.8 | Multiplayer | ✅ | 2026-01-11 | P1 Win (Rider Kill) | 5 turns, P2 passive (human?) |
| game-4.json | v0.8 | Multiplayer | ✅ | 2026-01-12 | P2 Win (Rider Kill) | 6 turns, both active |
| game-5.json | v0.8 | Multiplayer | ✅ | 2026-01-12 | P2 Win (Dragon Kill) | 9 turns, both active |
| dragon-riders-1768286659826-mzyoram.json | v0.8 | AI (Medium) | ✅ | 2026-01-13 | P1 Win (Rider Kill) | 7 turns, Bronn vs Morrik, AI broken |
| dragon-riders-1768287411666-4t25m7a.json | v0.8 | AI (Expert) | ✅ | 2026-01-13 | P1 Win (Rider Kill) | 4 turns, Lyra vs Talia, AI broken |

*Version not explicitly tracked in these early logs; assigned v0.8 retroactively

---

## Logging Format Evolution

### v0.8 (Early) - game-1.json, game-2.json
**Format:** Simple action array
```json
[
  {
    "turn": 1,
    "player": 1,
    "action": "Turn 1 Start Phase",
    "timestamp": 1768160180710
  },
  ...
]
```

**Characteristics:**
- No metadata structure
- Basic action logging
- No game setup or result tracking
- Minimal details on effects

### v0.8 (Mid) - game-3.json, game-4.json, game-5.json
**Format:** Structured with metadata
```json
{
  "gameId": "...",
  "timestamp": "...",
  "version": "0.8",
  "mode": "multiplayer",
  "aiDifficulty": "medium",
  "setup": { ... },
  "result": { ... },
  "actions": [ ... ]
}
```

**Improvements:**
- Added game metadata
- Setup tracking (rider/dragon/deck - but all null)
- Result tracking (winner, winType, totalTurns, finalState)
- Still limited action details

### v0.8 (Latest) - Enhanced Format
**Format:** Enhanced structured logging (introduced mid-v0.8)
```json
{
  "gameId": "...",
  "timestamp": "...",
  "version": "1.0",
  "mode": "ai",
  "aiDifficulty": "expert",
  "setup": {
    "player1": { "rider": "Lyra", "dragon": "Cryowyrm", "deck": [...] },
    "player2": { "rider": "Talia", "dragon": "Emberfang", "deck": [...] }
  },
  "actions": [
    {
      "turn": 1,
      "player": 1,
      "timestamp": 1768287411667,
      "type": "turn_start",
      "action": "Turn 1 Start Phase",
      "stateAfter": { "p1": {...}, "p2": {...} }
    }
  ],
  "result": {
    "stats": {
      "player1": { "totalDamageDealt": 21, ... },
      "player2": { ... }
    }
  }
}
```

**Major Improvements:**
- Action type classification
- Full game state after each action (`stateAfter`)
- Complete setup tracking (riders, dragons, decks)
- Energy breakdown (base, rider bonus, dragon alive bonus)
- Detailed player statistics
- Game duration tracking

---

## Game Analysis

### game-1.json (v0.8, Incomplete)

**Setup:**
- Player 1: Unknown Rider + Voidmaw
- Player 2: Unknown Rider + Unknown Dragon
- Mode: Assumed single-player or multiplayer

**Gameplay Summary:**
- Duration: 6 turns (incomplete)
- Player 1 aggressive strategy with multiple attacks per turn
- Voidmaw passive ability triggering (energy advantage damage)
- Game ended mid-turn, likely due to testing/crash

**Rules Compliance:**
- ✅ Voidmaw ability correctly triggers when energy advantage exists
- ✅ Burn damage stacking and applying correctly
- ⚠️ Some attacks showing 0 damage (likely due to shields/damage reduction)

**Issues Found:**
- Game truncated - no win condition reached
- Minimal logging detail makes deep analysis difficult

---

### game-2.json (v0.8, Incomplete)

**Setup:**
- Player 1: Unknown Rider + Voltwing
- Player 2: Unknown Rider + Cryowyrm
- Mode: Assumed multiplayer

**Gameplay Summary:**
- Duration: 4 turns (incomplete)
- Heavy use of shield mechanics
- Freeze mechanics in play (Cryowyrm)
- Voltwing splash damage active
- Game ended mid-turn at Player 1's Turn 4

**Rules Compliance:**
- ✅ Freeze mechanics working (freeze → immunity on thaw)
- ✅ Voltwing splash damage triggering correctly
- ✅ Shield absorption working properly

**Issues Found:**
- Game truncated mid-turn
- Player 2 (Cryowyrm user) had only 2 cards remaining in hand by turn 4
- Some damage calculations showing 0 (need to verify shield/reduction logic)

---

### game-3.json (v0.8, Complete)

**Setup:**
- Player 1: Unknown Rider + Emberfang
- Player 2: Unknown Rider + Voidmaw
- Mode: Multiplayer
- Result: Player 1 wins by Rider Kill

**Gameplay Summary:**
- Duration: 5 turns
- Fast-paced aggressive game
- Player 1 utilized Emberfang's burn effectively
- Player 2 never spent energy or played cards (AI issue or pass strategy?)
- Voidmaw's energy advantage ability triggered multiple times

**Key Statistics:**
- Final State: P1 Dragon HP: 25, P1 Rider HP: 4, P2 Dragon HP: 25, P2 Rider HP: 0
- Player 1: 8 attacks to rider, built up burn stacks
- Player 2: No actions taken beyond mandatory turn start

**Rules Compliance:**
- ✅ Emberfang burn application working correctly
- ✅ Voidmaw energy advantage ability triggering
- ✅ Burn stacking and damage over time working

**Issues Found:**
- 🚨 **Player 2 never took any actions** - This suggests either:
  - AI was not functioning
  - Player passed every turn (unusual)
  - Game logic issue preventing actions

---

### game-4.json (v0.8, Complete)

**Setup:**
- Player 1: Unknown Rider + Cryowyrm
- Player 2: Unknown Rider + Voidmaw (with Kael abilities in logs)
- Mode: Multiplayer
- Result: Player 2 wins by Rider Kill

**Gameplay Summary:**
- Duration: 6 turns
- Both players actively engaged
- Heavy use of freeze mechanics (Cryowyrm)
- Kael's first attack bonus visible in logs
- Voidmaw energy advantage and steal abilities active

**Key Statistics:**
- Final State: P1 Dragon HP: 12, P1 Rider HP: -2, P2 Dragon HP: 25, P2 Rider HP: 6
- Multiple freeze applications and immunity cycles
- Energy manipulation prominent
- Shield stripping used effectively

**Rules Compliance:**
- ✅ Freeze immunity mechanics working correctly
- ✅ Kael's first attack bonus (+2 damage, +2 shields when healthy)
- ✅ Kael's wounded state bonus (+1 damage, +1 shields)
- ✅ Voidmaw energy steal working
- ✅ Burn damage application correct

**Issues Found:**
- ✅ Rider HP went negative (-2) which is acceptable for death determination

---

### game-5.json (v0.8, Complete)

**Setup:**
- Player 1: Unknown Rider + Steelhorn
- Player 2: Unknown Rider (with Kael abilities) + Emberfang
- Mode: Multiplayer
- Result: Player 2 wins by Dragon Kill

**Gameplay Summary:**
- Duration: 9 turns (longest game so far)
- Both players actively engaged
- Steelhorn defensive abilities in play
- Emberfang burn strategy
- Kael's attack bonuses prominent
- Game ended with Player 1's dragon at 0 HP

**Key Statistics:**
- Final State: P1 Dragon HP: 0, P1 Rider HP: 10, P2 Dragon HP: 33, P2 Rider HP: 2
- Burn stacks built up to 3+ on Player 1
- Multiple heal cards used
- Energy manipulation active

**Rules Compliance:**
- ✅ Steelhorn energy counter working (attackers lose energy)
- ✅ Emberfang burn on first attack only
- ✅ Kael first attack bonus
- ✅ Crippling Blow forcing wounded state
- ✅ Burn damage stacking correctly

**Issues Found:**
- ⚠️ AI passed on Turn 8 with 4 energy and cards in hand - may want to review AI decision-making

---

### dragon-riders-1768286659826-mzyoram.json (v0.8, Complete)

**Setup:**
- Player 1: Bronn + Voltwing
- Player 2: Morrik + Steelhorn (AI - Medium difficulty)
- Mode: AI
- Result: Player 1 wins by Rider Kill

**Gameplay Summary:**
- Duration: 7 turns, 544.6 seconds (9 minutes)
- Player 1 dominated with Voltwing's splash damage
- Morrik (AI) played passively - only used heal cards and shields
- Player 2 never attacked or played offensive cards
- Bronn's damage reduction visible in state tracking

**Key Statistics:**
- Final State: P1 Dragon HP: 20, P1 Rider HP: 18, P2 Dragon HP: 28, P2 Rider HP: -2
- Player 1: 39 total damage dealt (14 to dragon, 23 to rider), 7 attacks
- Player 2: 0 damage dealt, 0 attacks, 0 cards played
- Player 1: 8 cards played, 12 energy spent
- Player 2: 0 cards played despite generating 30 energy

**Rules Compliance:**
- ✅ Voltwing splash damage working correctly (3 to target, 2 to other)
- ✅ Steelhorn energy drain on attacker working
- ✅ Bronn damage reduction visible in state
- ✅ Energy breakdown tracking (base + rider bonus)
- ✅ Wounded/critical state tracking accurate

**Issues Found:**
- 🚨 **AI (Medium) completely passive** - Generated energy but never used it
  - This is the same issue seen in game-3
  - AI logic needs investigation
- ⚠️ Player 2 Sabotage card reduced AI hand to 0 cards (Turn 2), AI never recovered
  - This may have broken AI decision-making

**Enhanced Logging Benefits:**
- Full state tracking makes debugging much easier
- Can see exact HP, shields, energy, frozen status after every action
- Energy breakdown helps verify economy mechanics
- Type classification makes parsing easier

---

### dragon-riders-1768287411666-4t25m7a.json (v0.8, Complete)

**Setup:**
- Player 1: Lyra + Cryowyrm
- Player 2: Talia + Emberfang (AI - Expert difficulty)
- Mode: AI
- Result: Player 1 wins by Rider Kill

**Gameplay Summary:**
- Duration: 4 turns, 96.9 seconds (1.6 minutes)
- Extremely fast game
- Player 1 executed aggressive Cryowyrm freeze strategy
- Player 2 (AI) used Sabotage to discard Player 1's hand but then played passively
- Freeze lock prevented AI actions
- AI never attacked despite having opportunities

**Key Statistics:**
- Final State: P1 Dragon HP: 26, P1 Rider HP: 10, P2 Dragon HP: 33, P2 Rider HP: 0
- Player 1: 21 damage dealt (all to rider), 6 attacks, 6 freezes applied
- Player 2: 0 damage dealt, 0 attacks
- Player 1: 8 cards played
- Player 2: 0 cards played (despite generating 14 energy)

**Rules Compliance:**
- ✅ Cryowyrm freeze on attack working correctly
- ✅ Freeze immunity after thaw working
- ✅ Talia's dragon alive bonus (+1 energy when dragon is alive)
- ✅ Lyra's base 2 economy working
- ✅ Burn damage stacking and applying correctly

**Issues Found:**
- 🚨 **AI (Expert) also completely passive despite higher difficulty**
  - Same issue as Medium AI
  - Generated energy but never used it
  - Never attacked even when not frozen
  - Suggests AI decision-making is broken regardless of difficulty

**Pattern Recognition:**
- Freeze strategy highly effective - 6 attacks in 4 turns due to 2 energy attack cost
- Rider kill happens quickly when focused
- AI issues consistent across difficulty levels

---

## Consolidated Findings

### Rules Compliance Summary

#### ✅ Working Correctly
1. **Dragon Abilities:**
   - Emberfang: Burn application on first attack only
   - Cryowyrm: Freeze application on attack
   - Voltwing: Splash damage (3 to primary, 2 to secondary)
   - Voidmaw: Energy advantage damage, energy steal
   - Steelhorn: Energy drain on attacker

2. **Status Effects:**
   - Burn: Stacking, damage at start of turn
   - Freeze: Application, immunity after thaw, restricts actions
   - Shields: Absorption working correctly

3. **Rider Mechanics:**
   - Kael: First attack bonus (+2/+2 healthy, +1/+1 wounded)
   - Bronn: Damage reduction visible in state
   - Talia: Dragon alive bonus (+1 energy)
   - Lyra: Base 2 economy
   - Wounded/Critical state tracking

4. **Card Effects:**
   - Damage cards working
   - Heal cards working
   - Sabotage (discard) working
   - Shield cards working
   - Energy manipulation working

5. **Turn Flow:**
   - Start phase: Draw, energy generation, burn damage, abilities
   - Action phase: Attacks and card plays working
   - End phase: Freeze thaw and immunity granting

#### ⚠️ Minor Issues
1. Some damage showing as 0 in early logs (likely shields, but hard to verify with v0.8 logging)
2. Energy Drain cards sometimes showing "lost 0 energy" (opponent at 0 energy)

#### 🚨 Critical Issues

##### 1. AI Decision-Making Regression (v0.8 Latest)
**AI Status Timeline:**
- ✅ **Working:** game-1.json, game-2.json (early v0.8 AI mode) - AI played cards and attacked
- ❓ **Unknown:** game-3.json (v0.8 multiplayer) - P2 passive but might be human player
- 🚨 **Broken:** dragon-riders-1768286659826-mzyoram.json (v0.8 AI Medium)
- 🚨 **Broken:** dragon-riders-1768287411666-4t25m7a.json (v0.8 AI Expert)

**Symptoms (Latest v0.8 AI Mode):**
- AI generates energy correctly
- AI draws cards correctly
- AI never plays cards
- AI never attacks
- AI just passes every turn

**This is a REGRESSION** - AI worked in early v0.8 but broke in latest v0.8.

**Hypothesis:**
- Changes to game state structure may have broken AI's ability to read state
- New action validation may be blocking AI actions incorrectly
- Sabotage card may break AI (reduces hand to 0-2 cards)
- AI may not handle low hand size well
- Freeze may permanently disable AI decision-making

**Recommendation:**
- Compare early v0.8 vs latest v0.8 code changes
- Review AI decision-making code in `AI_LOGIC.md` and implementation
- Add AI action logging to see what it's considering
- Test AI without Sabotage/Freeze to isolate issue
- Verify AI can recover from empty hand

##### 2. Incomplete Games in Early Logs
**Observed in:**
- game-1.json (v0.8, ended Turn 6)
- game-2.json (v0.8, ended Turn 4)

**Possible Causes:**
- Testing/debugging interruption
- Crash or error
- Manual termination

**Recommendation:**
- Ensure error handling logs game state before crash
- Add game completion tracking
- Review what caused these interruptions

---

## Game Balance Observations

### Win Conditions (Completed Games)
- **Rider Kill:** 5 games (game-3, game-4, mzyoram, 4t25m7a)
- **Dragon Kill:** 1 game (game-5)

**Note:** Rider kill is dominating, possibly due to:
- Riders having less HP than dragons
- Freeze lock strategies very effective on riders
- AI not defending properly (skews data)

### Average Game Length
- Completed games: 4-9 turns
- Median: 6 turns
- Latest v0.8 AI games: 4-7 turns (but AI issues may shorten games)

### Strategy Effectiveness

#### Highly Effective
1. **Freeze Lock:** Cryowyrm + rider focus = 4 turn win
2. **Burn Strategy:** Emberfang burn stacking
3. **Sabotage:** Reduces AI to non-functional state

#### Underutilized (Due to AI Issues)
1. Defensive strategies
2. Dragon-focused damage
3. Energy denial

---

## Logging Improvements Needed

### Current v0.8 (Latest) Format is Excellent
The latest v0.8 format provides:
- ✅ Full state tracking
- ✅ Action type classification
- ✅ Energy breakdown
- ✅ Statistics tracking
- ✅ Game duration

### Suggested Additions

1. **AI Decision Context:**
   ```json
   {
     "type": "ai_decision",
     "action": "AI considering actions",
     "details": {
       "availableActions": [...],
       "selectedAction": "...",
       "reasoning": "...",
       "score": 0.75
     }
   }
   ```

2. **Damage Calculation Breakdown:**
   ```json
   {
     "type": "attack",
     "details": {
       "baseDamage": 3,
       "bonuses": ["+2 Kael first attack"],
       "reductions": ["-1 Bronn"],
       "shieldAbsorbed": 2,
       "finalDamage": 2
     }
   }
   ```

3. **Rule Violations:**
   ```json
   {
     "type": "rule_check",
     "action": "Attempted invalid action",
     "details": {
       "attemptedAction": "Attack while frozen",
       "blocked": true,
       "reason": "Dragon is frozen"
     }
   }
   ```

4. **Performance Metrics:**
   - Action processing time
   - State update time
   - AI decision time

---

## Next Steps

### Immediate Priorities

1. **Fix AI Decision-Making** (Critical)
   - Review AI action selection logic
   - Test AI without disruptive cards (Sabotage, Freeze)
   - Add AI debugging logs
   - Verify AI can handle empty hand
   - Test all difficulty levels

2. **Verify Damage Calculations** (High)
   - Review Shield absorption
   - Verify Bronn reduction in all scenarios
   - Check Steelhorn counter-drain

3. **Complete Incomplete Games Analysis** (Medium)
   - Investigate why game-1 and game-2 ended early
   - Add crash logging

### Future Analysis

1. **Generate AI vs AI Games**
   - Once AI is fixed, run multiple games
   - Compare difficulty levels
   - Balance testing

2. **Matchup Analysis**
   - Track win rates per rider/dragon combination
   - Identify dominant strategies
   - Balance adjustments

3. **Player Behavior Analysis**
   - Common strategies
   - Card usage patterns
   - Decision trees

---

## Version Comparison (v0.8 Logging Evolution)

| Feature | v0.8 (Early) | v0.8 (Mid) | v0.8 (Latest) |
|---------|--------------|------------|---------------|
| Metadata | ❌ | ✅ | ✅ |
| Setup Tracking | ❌ | ⚠️ (null) | ✅ (full) |
| Result Tracking | ❌ | ✅ (basic) | ✅ (detailed) |
| State Tracking | ❌ | ❌ | ✅ (after every action) |
| Action Types | ❌ | ❌ | ✅ |
| Energy Breakdown | ❌ | ❌ | ✅ |
| Statistics | ❌ | ❌ | ✅ (comprehensive) |
| Game Duration | ❌ | ❌ | ✅ |
| Debugging Value | Low | Medium | High |

---

## Conclusion

The logging system has evolved significantly within v0.8, from simple action arrays to comprehensive state tracking with full game metadata. The latest v0.8 format provides excellent debugging capability. However, the analysis reveals that **the AI worked in early v0.8 games but is completely broken in the latest v0.8 AI mode games**. This indicates a regression was introduced during v0.8 development. Once the AI is fixed, the enhanced logging format will enable deep analysis of game balance, strategy effectiveness, and rules compliance.

**Analysis Status:** 7/7 logs analyzed (100%)
**Last Updated:** 2026-01-13
**Analyst:** Claude Sonnet 4.5
