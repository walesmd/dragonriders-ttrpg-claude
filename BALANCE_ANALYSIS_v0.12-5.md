# Dragon Riders — Balance Analysis: v0.12-5 vs v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Stagger model (frozen = only one action per turn)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: The stagger model is a **slight improvement over the stack-cap variant** but still **fails to fix game length and rider-kill viability**. Cryowyrm remains viable, but the meta stays dragon‑kill heavy and slow.

### Key Outcomes (v0.12-5)
- **Average game length**: **13.0 turns** (still long)
- **Dragon kill %**: **83.6%**
- **Rider kill %**: **16.4%**
- **Cryowyrm**: **49.1%** (viable but not dominant)

---

## Detailed Metrics (v0.12-5)

### Overall Game Metrics

| Metric | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|---------|-------|------|-------|
| Average Game Length | **13.0 turns** | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 | Still long |
| Dragon Kill % | **83.6%** | 84.3% | 83.9% | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **16.4%** | 15.7% | 16.1% | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-4 |
|-------|---------|---------|---------|---------|-------|------|-------------------|
| Talia | **58.0%** | 57.4% | 55.4% | 58.0% | 59.2% | 53% | +0.6% |
| Bronn | **56.4%** | 57.0% | 57.0% | 58.1% | 60.2% | 62% | -0.6% |
| Morrik | **47.2%** | 48.3% | 49.8% | 48.1% | 47.1% | 43% | -1.1% |
| Lyra | **45.4%** | 46.2% | 46.4% | 43.4% | 41.9% | 42% | -0.8% |
| Kael | **42.9%** | 41.0% | 41.3% | 42.3% | 41.6% | 50% | +1.9% |

**Rider Spread**: 15.1% (Talia 58.0% - Kael 42.9%), slightly tighter than v0.12-4.

### Dragon Balance

| Dragon | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-4 |
|--------|---------|---------|---------|---------|-------|------|-------------------|
| Voidmaw | **54.1%** | 54.1% | 54.2% | 57.1% | 59.6% | 34% | +0.0% |
| Steelhorn | **53.2%** | 53.6% | 52.1% | 58.0% | 59.7% | 47% | -0.4% |
| Voltwing | **50.4%** | 49.9% | 51.4% | 57.2% | 51.2% | 60% | +0.5% |
| Cryowyrm | **49.1%** | 49.9% | 49.7% | 28.6% | 29.3% | 67% | -0.8% |
| Emberfang | **43.1%** | 42.6% | 42.6% | 49.1% | 50.2% | 42% | +0.5% |

**Dragon Spread**: 11.0% (Voidmaw 54.1% - Emberfang 43.1%), still tight.

---

## Game Length Distribution (v0.12-5)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.1% |
| 6-9 turns | 32.9% |
| 10-15 turns | 42.9% |
| 16+ turns | 23.1% |

**Observation**: Still heavily skewed to 10+ turn games.

---

## Comparison: v0.12-5 vs v0.12-4

### Improvements
- **Rider kills slightly higher** (15.7% → 16.4%)
- **Dragon kills slightly lower** (84.3% → 83.6%)
- **Kael improved** (+1.9%)

### Regressions
- **Cryowyrm slightly weaker** (49.9% → 49.1%)
- **Game length essentially unchanged** (13.1 → 13.0)

---

## Comparison vs v0.12-2 (best rider-kill so far)

| Metric | v0.12-5 | v0.12-2 | Difference |
|--------|---------|---------|------------|
| Avg Game Length | 13.0 | 12.4 | **+0.6 turns** |
| Rider Kill % | 16.4% | 17.2% | **-0.8%** |
| Dragon Kill % | 83.6% | 82.8% | **+0.8%** |

**Conclusion**: Stagger does not outperform v0.12-2 on pacing or rider‑kill.

---

## Interpretation

Stagger softens freeze’s impact without breaking Cryowyrm, but **it still doesn’t restore the dual‑target strategic balance**. Rider‑kill remains too rare and games remain long. The change is directionally better than hard lock, but not enough on its own.

---

## Recommendations (Next Iteration)

1. **Combine stagger with rider‑kill buffs**
   - Reduce rider shields by 1 across all dragons  
   - Buff rider‑damage card efficiency (cost or value)

2. **Accelerate freeze decay**
   - Clear 1 stack at start and 1 at end of turn  
   - Or clear all stacks after one staggered turn

3. **Boost aggressive archetypes**
   - Small buffs to Emberfang or Voltwing to re‑enable fast wins

4. **Retest with higher game samples**
   - The changes are subtle; higher sample size will stabilize results

---

## Summary

The stagger model (v0.12-5) is **slightly better than the stack-cap variant** but still **fails to fix pacing and rider‑kill viability**. It keeps Cryowyrm viable and maintains tight dragon balance, but needs rider‑kill incentives and faster freeze decay to meet target metrics.

---

## Appendix: Simulation Output (v0.12-5)

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
Average Game Length:  13.0 turns
Dragon Kill %:        83.6%
Rider Kill %:         16.4%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      58.0% (522/900)
Bronn      56.4% (508/900)
Morrik     47.2% (425/900)
Lyra       45.4% (409/900)
Kael       42.9% (386/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      54.1% (487/900)
Steelhorn    53.2% (479/900)
Voltwing     50.4% (454/900)
Cryowyrm     49.1% (442/900)
Emberfang    43.1% (388/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.1% (25 games)
6-7      turns: 19.8% (445 games)
8-9      turns: 13.3% (299 games)
10-11    turns: 19.6% (440 games)
12-13    turns: 12.3% (276 games)
14-15    turns: 11.0% (247 games)
16-17    turns: 4.3% (96 games)
18-19    turns: 5.2% (118 games)
20-21    turns: 4.0% (89 games)
22-23    turns: 3.0% (67 games)
24-25    turns: 3.1% (70 games)
26-27    turns: 1.4% (32 games)
28-29    turns: 1.1% (24 games)
30-31    turns: 0.5% (11 games)
32-33    turns: 0.2% (5 games)
34-35    turns: 0.1% (2 games)
36-37    turns: 0.1% (3 games)
38-39    turns: 0.0% (1 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    13.0 vs 5.9 turns (+7.1)
Dragon Kill %:  83.6% vs 68% (+15.6%)
Rider Kill %:   16.4% vs 32% (-15.6%)

Top Rider Change:
  v0.12: Talia at 58.0%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 54.1%
  v0.8:  Cryowyrm at 67%

================================================================================
```
