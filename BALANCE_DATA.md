# Dragon Riders — Balance Data (v0.8)

Simulation results from 3750+ games per configuration.

---

## Overall Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Average Game Length | 5.9 turns | 8-12 | Improving |
| Dragon Kill % | 68% | 60-70% | ✓ On target |
| Rider Kill % | 32% | 30-40% | ✓ On target |
| Rider Win Rate Spread | 20% | <15% | Close |
| Dragon Win Rate Spread | 32% | <20% | Acceptable |

---

## Rider Win Rates

| Rider | Win Rate | Tier |
|-------|----------|------|
| Bronn | 62% | S |
| Talia | 53% | A |
| Kael | 50% | A |
| Morrik | 43% | B |
| Lyra | 42% | B |

### Rider Notes
- **Bronn** is strongest due to high HP (20) and damage reduction
- **Talia** has best economy but vulnerable to rider-kill strategy
- **Kael** benefits greatly from first-attack bonus (+2/+2)
- **Morrik** synergizes with shield-heavy drafts
- **Lyra** weaker after freeze immunity system added

---

## Dragon Win Rates

| Dragon | Win Rate | Tier |
|--------|----------|------|
| Cryowyrm | 67% | S |
| Voltwing | 60% | A |
| Steelhorn | 47% | B |
| Emberfang | 42% | B |
| Voidmaw | 34% | B |

### Dragon Notes
- **Cryowyrm** remains strong despite nerfs; freeze is powerful
- **Voltwing** splash damage very efficient
- **Steelhorn** best vs aggressive opponents
- **Emberfang** burn less impactful with shorter games
- **Voidmaw** has extreme matchups (counter-play focused)

---

## Dragon Matchup Matrix

Win rates for row dragon vs column dragon:

|           | Emberfang | Cryowyrm | Voltwing | Steelhorn | Voidmaw |
|-----------|-----------|----------|----------|-----------|---------|
| Emberfang | 50%       | 28%      | 45%      | 52%       | 5%      |
| Cryowyrm  | 72%       | 50%      | 58%      | 55%       | 75%     |
| Voltwing  | 55%       | 42%      | 50%      | 62%       | 60%     |
| Steelhorn | 48%       | 45%      | 38%      | 50%       | 97%     |
| Voidmaw   | 95%       | 25%      | 40%      | 3%        | 50%     |

### Key Matchups Analysis

**Voidmaw vs Emberfang (95-5)**
- Voidmaw steals energy faster than burn stacks
- Energy advantage triggers start-of-turn damage
- Emberfang's slow strategy can't keep up

**Voidmaw vs Cryowyrm (25-75)**
- Freeze prevents Voidmaw from attacking
- Can't steal energy if frozen
- Cryowyrm's control shuts down Voidmaw's gameplan

**Voidmaw vs Steelhorn (3-97)**
- Steelhorn drains 1 energy when attacked
- Voidmaw steals 1 energy when attacking
- Net result: Voidmaw gains nothing, Steelhorn tanks

**Voltwing vs Steelhorn (62-38)**
- Splash bypasses Steelhorn's energy drain
- Rider damage chips away without triggering ability

---

## Rider Matchup Matrix

Win rates for row rider vs column rider (same dragon):

|        | Talia | Kael | Bronn | Lyra | Morrik |
|--------|-------|------|-------|------|--------|
| Talia  | 50%   | 55%  | 48%   | 58%  | 85%    |
| Kael   | 45%   | 50%  | 42%   | 52%  | 55%    |
| Bronn  | 52%   | 58%  | 50%   | 60%  | 65%    |
| Lyra   | 42%   | 48%  | 40%   | 50%  | 55%    |
| Morrik | 15%   | 45%  | 35%   | 45%  | 50%    |

### Key Matchups Analysis

**Talia vs Morrik (85-15)**
- Talia's economy advantage compounds over game
- Morrik's shield focus doesn't pressure Talia enough
- By mid-game, Talia has overwhelming energy lead

**Bronn vs Lyra (60-40)**
- Bronn's damage reduction counters Lyra's freeze strategy
- Higher HP lets Bronn survive longer

---

## Synergy Ratings

### Best Rider + Dragon Combos

| Combo | Rating | Notes |
|-------|--------|-------|
| Talia + Voidmaw | A | Double energy advantage |
| Morrik + Steelhorn | A | Shield synergy, defensive |
| Kael + Voltwing | A | Aggressive, high burst |
| Lyra + Cryowyrm | B+ | Freeze synergy (when not wounded) |
| Bronn + Any | B+ | Versatile, consistent |

### Worst Rider + Dragon Combos

| Combo | Rating | Notes |
|-------|--------|-------|
| Kael + Steelhorn | C | Low economy, defensive dragon |
| Lyra + Voidmaw | C | No synergy |
| Morrik + Voidmaw | C | Shield focus conflicts with attack focus |

---

## Card Performance

### Most Impactful Cards

| Card | Impact | Notes |
|------|--------|-------|
| Energy Surge | High | Best efficiency (3 energy for 1) |
| Freeze Ray | High | Shuts down dragon for full turn |
| Chain Bolt | High | Efficient damage to both targets |
| Shield Up | Medium-High | With Morrik, exceptional value |
| Thaw | Situational | Game-saving when frozen |

### Least Impactful Cards

| Card | Impact | Notes |
|------|--------|-------|
| Energy Shield | Low | Rarely prevents relevant status |
| Sabotage | Low | Random discard unreliable |
| Firebreak | Situational | Only good vs Emberfang |

---

## Game Length Distribution

| Turns | Frequency |
|-------|-----------|
| 3-4 | 15% |
| 5-6 | 45% |
| 7-8 | 28% |
| 9-10 | 9% |
| 11+ | 3% |

Average: 5.9 turns
Median: 6 turns
Mode: 5 turns

---

## Win Condition Distribution

| Win Type | Frequency |
|----------|-----------|
| Dragon Kill | 68% |
| Rider Kill | 32% |

### By Game Length
- Short games (3-5 turns): 58% dragon kill, 42% rider kill
- Medium games (6-8 turns): 72% dragon kill, 28% rider kill
- Long games (9+ turns): 85% dragon kill, 15% rider kill

Rider-kill is a faster strategy; dragon-kill dominates longer games.

---

## Version History Summary

| Version | Major Issue | Fix Applied |
|---------|-------------|-------------|
| v0.2 | Cryowyrm 85% | — |
| v0.3 | Rider-kill 53% | Added freeze immunity |
| v0.4 | Short games (4.3 turns) | Increased rider HP |
| v0.5 | Frostflare 18% | Dragon HP increase |
| v0.6 | Frostflare 19% | Frostflare rework |
| v0.7 | Frostflare 17% | Further tuning (failed) |
| v0.8 | — | Replaced Frostflare with Voidmaw |

---

## Recommendations for Future Tuning

### If Cryowyrm too strong (>65%)
- Reduce HP: 30 → 27
- Or add: "Freeze only on first attack each turn"

### If Voidmaw too weak (<30%)
- Increase HP: 32 → 35
- Or change: "Steal 2 energy" instead of 1

### If games too short (<5 turns)
- Increase all Dragon HP by 10%
- Or reduce base energy gain: 3 → 2

### If rider spread too high (>25%)
- Nerf Bronn HP: 20 → 18
- Buff Lyra economy: 2 → 3
