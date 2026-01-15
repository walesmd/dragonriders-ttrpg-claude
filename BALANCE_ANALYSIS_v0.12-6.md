# Dragon Riders — Balance Analysis: v0.12-6 vs v0.12-5 vs v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Stagger model + faster decay (remove 2 stacks per end phase)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Faster decay improves pacing slightly, but it **collapses Cryowyrm back into weakness** and **does not materially restore rider‑kill viability**. Overall, this is **worse than v0.12-5** for Cryowyrm and **no better for rider kills**.

### Key Outcomes (v0.12-6)
- **Average game length**: **12.4 turns** (faster than v0.12-5)
- **Dragon kill %**: **83.3%**
- **Rider kill %**: **16.7%** (slightly higher)
- **Cryowyrm**: **28.4%** (regresses to pre‑buff levels)

---

## Detailed Metrics (v0.12-6)

### Overall Game Metrics

| Metric | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|---------|---------|-------|------|-------|
| Average Game Length | **12.4 turns** | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 | Slightly faster |
| Dragon Kill % | **83.3%** | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **16.7%** | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-5 |
|-------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Talia | **58.4%** | 58.0% | 57.4% | 55.4% | 58.0% | 59.2% | 53% | +0.4% |
| Bronn | **57.9%** | 56.4% | 57.0% | 57.0% | 58.1% | 60.2% | 62% | +1.5% |
| Morrik | **48.3%** | 47.2% | 48.3% | 49.8% | 48.1% | 47.1% | 43% | +1.1% |
| Lyra | **45.9%** | 45.4% | 46.2% | 46.4% | 43.4% | 41.9% | 42% | +0.5% |
| Kael | **39.4%** | 42.9% | 41.0% | 41.3% | 42.3% | 41.6% | 50% | **-3.5%** |

**Rider Spread**: 19.0% (Talia 58.4% - Kael 39.4%), wider than v0.12-5.

### Dragon Balance

| Dragon | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-5 |
|--------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Voidmaw | **59.3%** | 54.1% | 54.1% | 54.2% | 57.1% | 59.6% | 34% | **+5.2%** |
| Steelhorn | **58.2%** | 53.2% | 53.6% | 52.1% | 58.0% | 59.7% | 47% | **+5.0%** |
| Voltwing | **56.0%** | 50.4% | 49.9% | 51.4% | 57.2% | 51.2% | 60% | +5.6% |
| Emberfang | **48.0%** | 43.1% | 42.6% | 42.6% | 49.1% | 50.2% | 42% | +4.9% |
| Cryowyrm | **28.4%** | 49.1% | 49.9% | 49.7% | 28.6% | 29.3% | 67% | **-20.7%** |

**Dragon Spread**: 30.9% (Voidmaw 59.3% - Cryowyrm 28.4%), large again.

---

## Game Length Distribution (v0.12-6)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.6% |
| 6-9 turns | 38.4% |
| 10-15 turns | 39.8% |
| 16+ turns | 20.2% |

**Observation**: Faster decay pulls some games back into 6–9 turns, but long games remain common.

---

## Comparison: v0.12-6 vs v0.12-5

### Improvements
- **Slightly faster games** (13.0 → 12.4)
- **Rider kills up slightly** (16.4% → 16.7%)

### Regressions
- **Cryowyrm collapses** (49.1% → 28.4%)
- **Dragon spread widens** (11.0% → 30.9%)
- **Kael drops sharply** (-3.5%)

---

## Interpretation

Faster decay undermines the Cryowyrm fix and restores the previous imbalance. While pacing improves slightly, the system **reverts to the old problem**: Cryowyrm underperforms and dragon dominance persists.

---

## Recommendations (Next Iteration)

1. **Keep stagger, but cap decay to 1 stack per turn**  
   Faster decay breaks Cryowyrm; use 1‑stack decay instead.

2. **Add rider‑kill incentives directly**  
   Reduce rider shields by 1 across all dragons, or buff rider damage card efficiency.

3. **Consider “stagger + energy tax”**  
   Frozen targets can act once, but pay +1 energy for that action.

4. **Re‑evaluate Voidmaw/Talia economy loop**  
   They spike again as Cryowyrm weakens.

---

## Summary

The stagger + faster decay variant (v0.12-6) **improves pacing slightly** but **re‑breaks Cryowyrm** and widens dragon imbalance. It is a step backward versus v0.12-5 in terms of dragon balance and Cryowyrm viability.

---

## Appendix: Simulation Output (v0.12-6)

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
Dragon Kill %:        83.3%
Rider Kill %:         16.7%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      58.4% (526/900)
Bronn      57.9% (521/900)
Morrik     48.3% (435/900)
Lyra       45.9% (413/900)
Kael       39.4% (355/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      59.3% (534/900)
Steelhorn    58.2% (524/900)
Voltwing     56.0% (504/900)
Emberfang    48.0% (432/900)
Cryowyrm     28.4% (256/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.6% (37 games)
6-7      turns: 20.7% (466 games)
8-9      turns: 17.7% (398 games)
10-11    turns: 17.8% (400 games)
12-13    turns: 13.2% (298 games)
14-15    turns: 8.8% (199 games)
16-17    turns: 5.6% (127 games)
18-19    turns: 2.9% (65 games)
20-21    turns: 4.5% (102 games)
22-23    turns: 2.0% (44 games)
24-25    turns: 2.3% (51 games)
26-27    turns: 1.4% (31 games)
28-29    turns: 0.8% (19 games)
30-31    turns: 0.3% (6 games)
32-33    turns: 0.2% (5 games)
36-37    turns: 0.0% (1 games)
38-39    turns: 0.0% (1 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.4 vs 5.9 turns (+6.5)
Dragon Kill %:  83.3% vs 68% (+15.3%)
Rider Kill %:   16.7% vs 32% (-15.3%)

Top Rider Change:
  v0.12: Talia at 58.4%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 59.3%
  v0.8:  Cryowyrm at 67%

================================================================================
```
