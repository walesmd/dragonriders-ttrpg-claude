# Dragon Riders — Balance Analysis: v0.12-8 vs v0.12-7 vs v0.12-6 vs v0.12-5 vs v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Cryowyrm “Frostbite” (+1 damage vs already frozen target)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Frostbite **restores Cryowyrm viability** without worsening pacing, but **does not improve rider‑kill frequency**. Overall balance improves slightly on dragon spread while the core pacing/rider‑kill issues remain.

### Key Outcomes (v0.12-8)
- **Average game length**: **12.6 turns** (slightly faster than v0.12-7)
- **Dragon kill %**: **83.8%**
- **Rider kill %**: **16.2%**
- **Cryowyrm**: **49.9%** (viable again)

---

## Detailed Metrics (v0.12-8)

### Overall Game Metrics

| Metric | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------|
| Average Game Length | **12.6 turns** | 13.0 | 12.4 | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 | Slightly faster |
| Dragon Kill % | **83.8%** | 83.8% | 83.3% | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **16.2%** | 16.2% | 16.7% | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-7 |
|-------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Talia | **58.1%** | 56.6% | 58.4% | 58.0% | 57.4% | 55.4% | 58.0% | 59.2% | 53% | +1.5% |
| Bronn | **57.2%** | 57.9% | 57.9% | 56.4% | 57.0% | 57.0% | 58.1% | 60.2% | 62% | -0.7% |
| Morrik | **49.1%** | 47.2% | 48.3% | 47.2% | 48.3% | 49.8% | 48.1% | 47.1% | 43% | +1.9% |
| Lyra | **45.1%** | 46.3% | 45.9% | 45.4% | 46.2% | 46.4% | 43.4% | 41.9% | 42% | -1.2% |
| Kael | **40.4%** | 42.0% | 39.4% | 42.9% | 41.0% | 41.3% | 42.3% | 41.6% | 50% | -1.6% |

**Rider Spread**: 17.7% (Talia 58.1% - Kael 40.4%), wider than v0.12-7.

### Dragon Balance

| Dragon | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-7 |
|--------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Voidmaw | **53.9%** | 55.3% | 59.3% | 54.1% | 54.1% | 54.2% | 57.1% | 59.6% | 34% | -1.4% |
| Steelhorn | **52.8%** | 54.3% | 58.2% | 53.2% | 53.6% | 52.1% | 58.0% | 59.7% | 47% | -1.5% |
| Voltwing | **50.9%** | 51.8% | 56.0% | 50.4% | 49.9% | 51.4% | 57.2% | 51.2% | 60% | -0.9% |
| Cryowyrm | **49.9%** | 46.4% | 28.4% | 49.1% | 49.9% | 49.7% | 28.6% | 29.3% | 67% | **+3.5%** |
| Emberfang | **42.6%** | 42.1% | 48.0% | 43.1% | 42.6% | 42.6% | 49.1% | 50.2% | 42% | +0.5% |

**Dragon Spread**: 11.3% (Voidmaw 53.9% - Emberfang 42.6%), still tight.

---

## Game Length Distribution (v0.12-8)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.5% |
| 6-9 turns | 35.9% |
| 10-15 turns | 41.2% |
| 16+ turns | 21.4% |

**Observation**: Slightly more 6–9 turn games than v0.12-7, but still long overall.

---

## Comparison: v0.12-8 vs v0.12-7

### Improvements
- **Cryowyrm up** (46.4% → 49.9%)
- **Game length down** (13.0 → 12.6)

### Regressions
- **Rider spread widened** (Talia/Kael divergence)
- **Rider kill % unchanged** (16.2%)

---

## Interpretation

Frostbite is a clean Cryowyrm buff that does **not** worsen pacing, but it **doesn’t solve the core meta issue** (dragon‑kill dominance + low rider‑kill). It’s a good targeted buff, but it needs to be paired with rider‑kill incentives.

---

## Recommendations (Next Iteration)

1. **Keep Frostbite**  
   It’s a targeted buff without major side effects.

2. **Add rider‑kill incentives**  
   - Reduce rider shields by 1 across all dragons  
   - Buff rider‑damage cards (cost or value)

3. **Small buff to Kael**  
   Kael continues to underperform in longer games.

---

## Summary

v0.12-8 improves Cryowyrm viability without worsening pacing, but **the core balance problem remains**. The next iteration should focus on **rider‑kill incentives** to restore the dual‑target strategic choice.

---

## Appendix: Simulation Output (v0.12-8)

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
Average Game Length:  12.6 turns
Dragon Kill %:        83.8%
Rider Kill %:         16.2%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      58.1% (523/900)
Bronn      57.2% (515/900)
Morrik     49.1% (442/900)
Lyra       45.1% (406/900)
Kael       40.4% (364/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      53.9% (485/900)
Steelhorn    52.8% (475/900)
Voltwing     50.9% (458/900)
Cryowyrm     49.9% (449/900)
Emberfang    42.6% (383/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.5% (33 games)
6-7      turns: 21.3% (480 games)
8-9      turns: 14.6% (329 games)
10-11    turns: 20.6% (463 games)
12-13    turns: 10.5% (236 games)
14-15    turns: 10.1% (227 games)
16-17    turns: 5.3% (120 games)
18-19    turns: 4.0% (91 games)
20-21    turns: 4.4% (99 games)
22-23    turns: 2.6% (58 games)
24-25    turns: 2.1% (48 games)
26-27    turns: 1.2% (28 games)
28-29    turns: 0.9% (21 games)
30-31    turns: 0.6% (14 games)
32-33    turns: 0.1% (2 games)
34-35    turns: 0.0% (1 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.6 vs 5.9 turns (+6.7)
Dragon Kill %:  83.8% vs 68% (+15.8%)
Rider Kill %:   16.2% vs 32% (-15.8%)

Top Rider Change:
  v0.12: Talia at 58.1%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 53.9%
  v0.8:  Cryowyrm at 67%

================================================================================
```
