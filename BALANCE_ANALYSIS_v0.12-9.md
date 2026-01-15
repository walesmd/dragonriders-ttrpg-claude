# Dragon Riders — Balance Analysis: v0.12-9 vs v0.12-8 vs v0.12-7 vs v0.12-6 vs v0.12-5 vs v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Rider‑kill buff lane — reduce rider starting shields by 1  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Reducing rider shields by 1 **improves rider‑kill viability** and **slightly speeds games** without breaking Cryowyrm. This is the **best rider‑kill improvement** since v0.12-2 while keeping dragon balance relatively tight.

### Key Outcomes (v0.12-9)
- **Average game length**: **12.5 turns** (faster than v0.12-8)
- **Dragon kill %**: **82.4%** (lower than recent iterations)
- **Rider kill %**: **17.6%** (highest since v0.12-2)
- **Cryowyrm**: **49.7%** (still viable)

---

## Detailed Metrics (v0.12-9)

### Overall Game Metrics

| Metric | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------|
| Average Game Length | **12.5 turns** | 12.6 | 13.0 | 12.4 | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 | Slightly faster |
| Dragon Kill % | **82.4%** | 83.8% | 83.8% | 83.3% | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% | Improved |
| Rider Kill % | **17.6%** | 16.2% | 16.2% | 16.7% | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% | Improved |

### Rider Balance

| Rider | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-8 |
|-------|---------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Talia | **56.8%** | 58.1% | 56.6% | 58.4% | 58.0% | 57.4% | 55.4% | 58.0% | 59.2% | 53% | -1.3% |
| Bronn | **54.1%** | 57.2% | 57.9% | 57.9% | 56.4% | 57.0% | 57.0% | 58.1% | 60.2% | 62% | -3.1% |
| Morrik | **50.4%** | 49.1% | 47.2% | 48.3% | 47.2% | 48.3% | 49.8% | 48.1% | 47.1% | 43% | +1.3% |
| Lyra | **45.4%** | 45.1% | 46.3% | 45.9% | 45.4% | 46.2% | 46.4% | 43.4% | 41.9% | 42% | +0.3% |
| Kael | **43.2%** | 40.4% | 42.0% | 39.4% | 42.9% | 41.0% | 41.3% | 42.3% | 41.6% | 50% | +2.8% |

**Rider Spread**: 13.6% (Talia 56.8% - Kael 43.2%), tighter than recent iterations.

### Dragon Balance

| Dragon | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-8 |
|--------|---------|---------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Steelhorn | **53.4%** | 52.8% | 54.3% | 58.2% | 53.2% | 53.6% | 52.1% | 58.0% | 59.7% | 47% | +0.6% |
| Voltwing | **52.9%** | 50.9% | 51.8% | 56.0% | 50.4% | 49.9% | 51.4% | 57.2% | 51.2% | 60% | +2.0% |
| Voidmaw | **52.3%** | 53.9% | 55.3% | 59.3% | 54.1% | 54.1% | 54.2% | 57.1% | 59.6% | 34% | -1.6% |
| Cryowyrm | **49.7%** | 49.9% | 46.4% | 28.4% | 49.1% | 49.9% | 49.7% | 28.6% | 29.3% | 67% | -0.2% |
| Emberfang | **41.7%** | 42.6% | 42.1% | 48.0% | 43.1% | 42.6% | 42.6% | 49.1% | 50.2% | 42% | -0.9% |

**Dragon Spread**: 11.7% (Steelhorn 53.4% - Emberfang 41.7%), still tight.

---

## Game Length Distribution (v0.12-9)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.2% |
| 6-9 turns | 36.7% |
| 10-15 turns | 41.3% |
| 16+ turns | 20.8% |

**Observation**: Slightly more mid‑length games and fewer long tail games.

---

## Comparison: v0.12-9 vs v0.12-8

### Improvements
- **Rider kills up** (16.2% → 17.6%)
- **Dragon kills down** (83.8% → 82.4%)
- **Game length slightly shorter** (12.6 → 12.5)
- **Kael recovers** (40.4% → 43.2%)

### Regressions
- **Bronn drops** (57.2% → 54.1%)

---

## Interpretation

Reducing rider shields by 1 is a **clean rider‑kill buff** that moves key metrics in the right direction without destabilizing Cryowyrm or dragon balance. It does not fully restore the 25–35% rider‑kill target, but it is the most promising rider‑kill adjustment so far.

---

## Recommendations (Next Iteration)

1. **Keep rider‑shield reduction**  
   This is the most effective lever so far.

2. **Consider an additional small rider‑kill buff**  
   Example: +1 value to one rider‑damage card or +1 copy of a rider‑damage card in the pool.

3. **Monitor Bronn**  
   His drop suggests rider‑shield nerf hits defensive riders disproportionately; keep an eye on his viability.

---

## Summary

v0.12-9 is a meaningful improvement toward the target balance: rider‑kills rise, dragon‑kills fall slightly, and Cryowyrm stays viable. It still misses the desired rider‑kill and pacing targets but provides a strong base for further tuning.

---

## Appendix: Simulation Output (v0.12-9)

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
Average Game Length:  12.5 turns
Dragon Kill %:        82.4%
Rider Kill %:         17.6%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      56.8% (511/900)
Bronn      54.1% (487/900)
Morrik     50.4% (454/900)
Lyra       45.4% (409/900)
Kael       43.2% (389/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Steelhorn    53.4% (481/900)
Voltwing     52.9% (476/900)
Voidmaw      52.3% (471/900)
Cryowyrm     49.7% (447/900)
Emberfang    41.7% (375/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
2-3      turns: 0.0% (1 games)
4-5      turns: 1.2% (27 games)
6-7      turns: 22.9% (515 games)
8-9      turns: 13.8% (310 games)
10-11    turns: 19.4% (437 games)
12-13    turns: 11.4% (256 games)
14-15    turns: 10.5% (236 games)
16-17    turns: 4.5% (101 games)
18-19    turns: 4.4% (99 games)
20-21    turns: 4.4% (100 games)
22-23    turns: 2.4% (54 games)
24-25    turns: 2.1% (47 games)
26-27    turns: 1.1% (25 games)
28-29    turns: 0.8% (17 games)
30-31    turns: 0.6% (14 games)
32-33    turns: 0.4% (10 games)
34-35    turns: 0.0% (1 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.5 vs 5.9 turns (+6.6)
Dragon Kill %:  82.4% vs 68% (+14.4%)
Rider Kill %:   17.6% vs 32% (-14.4%)

Top Rider Change:
  v0.12: Talia at 56.8%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Steelhorn at 53.4%
  v0.8:  Cryowyrm at 67%

================================================================================
```
