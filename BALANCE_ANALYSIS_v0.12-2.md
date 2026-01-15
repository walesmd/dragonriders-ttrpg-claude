# Dragon Riders — Balance Analysis: v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Rider HP -2 and rider attack cost reverted to 2  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: The v0.12-2 tweaks (lower rider HP, rider attack cost reverted) **improve rider-kill viability modestly**, but **dragon-kill still dominates** and game length remains long.

### Key Outcomes
- **Rider kill % improved** from **9.4% → 17.2%** (v0.12 → v0.12-2)
- **Dragon kill % decreased** from **90.6% → 82.8%**
- **Game length remains long**: **12.6 → 12.4 turns** (still ~2x v0.8)
- **Meta still favors tank dragons**; Cryowyrm remains suppressed

---

## Detailed Metrics (v0.12-2)

### Overall Game Metrics

| Metric | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|-------|------|-------|
| Average Game Length | **12.4 turns** | 12.6 | 5.9 | Slightly faster than v0.12, still too long |
| Dragon Kill % | **82.8%** | 90.6% | 68% | Improved, still high |
| Rider Kill % | **17.2%** | 9.4% | 32% | Improved, still low |

### Rider Balance

| Rider | v0.12-2 Win Rate | v0.12 Win Rate | v0.8 Win Rate | Change vs v0.12 |
|-------|------------------|----------------|---------------|----------------|
| Bronn | **58.1%** | 60.2% | 62% | -2.1% |
| Talia | **58.0%** | 59.2% | 53% | -1.2% |
| Morrik | **48.1%** | 47.1% | 43% | +1.0% |
| Lyra | **43.4%** | 41.9% | 42% | +1.5% |
| Kael | **42.3%** | 41.6% | 50% | +0.7% |

**Rider Spread**: 15.8% (Bronn 58.1% - Kael 42.3%), slightly tighter than v0.12.

### Dragon Balance

| Dragon | v0.12-2 Win Rate | v0.12 Win Rate | v0.8 Win Rate | Change vs v0.12 |
|--------|------------------|----------------|---------------|----------------|
| Steelhorn | **58.0%** | 59.7% | 47% | -1.7% |
| Voltwing | **57.2%** | 51.2% | 60% | +6.0% |
| Voidmaw | **57.1%** | 59.6% | 34% | -2.5% |
| Emberfang | **49.1%** | 50.2% | 42% | -1.1% |
| Cryowyrm | **28.6%** | 29.3% | 67% | -0.7% |

**Dragon Spread**: 29.4% (Steelhorn 58.0% - Cryowyrm 28.6%), still very wide.

---

## Game Length Distribution (v0.12-2)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.8% |
| 6-9 turns | 38.0% |
| 10-15 turns | 40.6% |
| 16+ turns | 19.6% |

**Observation**: Slightly more 3–9 turn games vs v0.12, but long games still common.

---

## Comparison: v0.12 vs v0.12-2

### Improvements
- **Rider kill % nearly doubled** (9.4% → 17.2%)
- **Dragon kill % reduced** (90.6% → 82.8%)
- **Slightly shorter games** (12.6 → 12.4 turns)
- **Voltwing recovered** (51.2% → 57.2%)

### Persisting Problems
- **Dragon kills still dominate** (82.8%)
- **Cryowyrm still crushed** (~29%)
- **Games still ~2x longer than v0.8**

---

## Comparison vs Pre-0.12 Baselines (v0.8)

| Metric | v0.12-2 | v0.8 | Impact |
|--------|---------|------|--------|
| Avg Game Length | 12.4 | 5.9 | **+110% (still too long)** |
| Dragon Kill % | 82.8% | 68% | **+14.8% (still high)** |
| Rider Kill % | 17.2% | 32% | **-14.8% (still low)** |

**Conclusion**: v0.12-2 moves toward v0.8 but remains far from target balance.

---

## Interpretation

Lowering rider HP by 2 and reverting rider attack cost to 2 **helped**, but not enough to restore the intended dual-target strategy. Riders are still too durable relative to dragons, and the meta still favors dragon-kill and tank strategies.

---

## Recommendations (Next Iteration)

1. **Reduce rider shields or shield scaling** (if still present in v0.12)
2. **Increase rider-kill incentives** (damage cards or attack efficiency)
3. **Buff Cryowyrm or freeze impact** to restore tempo value in longer games
4. **Target 8–10 turn average** and **25–35% rider kills**

---

## Summary

The v0.12-2 changes were **beneficial but insufficient**. They reduce the most extreme outcomes from v0.12, yet the system still leans heavily toward dragon-kill strategies and long games. Further tuning is required to restore strategic balance.

---

## Appendix: Simulation Output (v0.12-2)

```
Running 10 games per matchup...

Starting simulations...
Completed 100 games...
Completed 200 games...
Completed 300 games...
Completed 400 games...
Completed 500 games...
Completed 600 games...
Completed 700 games...
Completed 800 games...
Completed 900 games...
Completed 1000 games...
Completed 1100 games...
Completed 1200 games...
Completed 1300 games...
Completed 1400 games...
Completed 1500 games...
Completed 1600 games...
Completed 1700 games...
Completed 1800 games...
Completed 1900 games...
Completed 2000 games...
Completed 2100 games...
Completed 2200 games...

Completed all 2250 games!

================================================================================
DRAGON RIDERS v0.12 - SIMULATION RESULTS
================================================================================

OVERALL METRICS
--------------------------------------------------------------------------------
Total Games:          2250
Average Game Length:  12.4 turns
Dragon Kill %:        82.8%
Rider Kill %:         17.2%

RIDER WIN RATES
--------------------------------------------------------------------------------
Bronn      58.1% (523/900)
Talia      58.0% (522/900)
Morrik     48.1% (433/900)
Lyra       43.4% (391/900)
Kael       42.3% (381/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Steelhorn    58.0% (522/900)
Voltwing     57.2% (515/900)
Voidmaw      57.1% (514/900)
Emberfang    49.1% (442/900)
Cryowyrm     28.6% (257/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.8% (40 games)
6-7      turns: 20.7% (465 games)
8-9      turns: 17.3% (389 games)
10-11    turns: 16.8% (378 games)
12-13    turns: 14.0% (314 games)
14-15    turns: 9.8% (221 games)
16-17    turns: 5.1% (115 games)
18-19    turns: 2.6% (58 games)
20-21    turns: 4.8% (108 games)
22-23    turns: 2.3% (52 games)
24-25    turns: 2.3% (51 games)
26-27    turns: 1.2% (27 games)
28-29    turns: 0.8% (18 games)
30-31    turns: 0.3% (7 games)
32-33    turns: 0.2% (4 games)
34-35    turns: 0.0% (1 games)
36-37    turns: 0.1% (2 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.4 vs 5.9 turns (+6.5)
Dragon Kill %:  82.8% vs 68% (+14.8%)
Rider Kill %:   17.2% vs 32% (-14.8%)

Top Rider Change:
  v0.12: Bronn at 58.1%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Steelhorn at 58.0%
  v0.8:  Cryowyrm at 67%

================================================================================
```
