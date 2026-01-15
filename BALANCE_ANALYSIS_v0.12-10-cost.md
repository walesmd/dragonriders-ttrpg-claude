# Dragon Riders — Balance Analysis: v0.12-10 (Rider Damage Cost) vs v0.12-9 and prior

**Date**: January 15, 2026  
**Analysis**: Rider damage cards cost reduced from 2 → 1  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Lowering rider‑damage costs materially improves rider‑kill viability and speeds games slightly. This is the strongest rider‑kill improvement so far, without destabilizing Cryowyrm.

### Key Outcomes (v0.12-10 cost)
- **Average game length**: **12.4 turns** (faster than v0.12-9)
- **Dragon kill %**: **81.7%** (lowest in the v0.12 series so far)
- **Rider kill %**: **18.3%** (highest so far in v0.12)
- **Cryowyrm**: **52.7%** (viable and competitive)

---

## Detailed Metrics (v0.12-10 cost)

### Overall Game Metrics

| Metric | v0.12-10 cost | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 |
|--------|----------------|---------|---------|---------|---------|---------|---------|---------|---------|-------|------|
| Average Game Length | **12.4** | 12.5 | 12.6 | 13.0 | 12.4 | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 |
| Dragon Kill % | **81.7%** | 82.4% | 83.8% | 83.8% | 83.3% | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% |
| Rider Kill % | **18.3%** | 17.6% | 16.2% | 16.2% | 16.7% | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% |

### Rider Balance

| Rider | v0.12-10 cost | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 |
|-------|----------------|---------|---------|---------|---------|---------|
| Bronn | **58.1%** | 54.1% | 57.2% | 57.9% | 57.9% | 56.4% |
| Talia | **56.3%** | 56.8% | 58.1% | 56.6% | 58.4% | 58.0% |
| Morrik | **48.2%** | 50.4% | 49.1% | 47.2% | 48.3% | 47.2% |
| Lyra | **45.2%** | 45.4% | 45.1% | 46.3% | 45.9% | 45.4% |
| Kael | **42.1%** | 43.2% | 40.4% | 42.0% | 39.4% | 42.9% |

**Rider Spread**: 16.0% (Bronn 58.1% - Kael 42.1%), similar to recent iterations.

### Dragon Balance

| Dragon | v0.12-10 cost | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 |
|--------|----------------|---------|---------|---------|---------|---------|
| Voltwing | **53.7%** | 52.9% | 50.9% | 51.8% | 56.0% | 50.4% |
| Cryowyrm | **52.7%** | 49.7% | 49.9% | 46.4% | 28.4% | 49.1% |
| Voidmaw | **51.0%** | 52.3% | 53.9% | 55.3% | 59.3% | 54.1% |
| Steelhorn | **50.9%** | 53.4% | 52.8% | 54.3% | 58.2% | 53.2% |
| Emberfang | **41.8%** | 41.7% | 42.6% | 42.1% | 48.0% | 43.1% |

**Dragon Spread**: 11.9% (Voltwing 53.7% - Emberfang 41.8%), still tight.

---

## Interpretation

Reducing the rider‑damage card costs to 1 is the **strongest rider‑kill lever** tested so far. It improves rider kills without destabilizing Cryowyrm or causing significant pacing regressions. This variant looks promising as a main‑line candidate.

---

## Recommendations

1. **Keep this change as the primary rider‑kill buff**  
2. **Validate with higher sample size** to confirm stability  
3. **Monitor Bronn** (still strong) and Emberfang (still weak)

---

## Appendix: Simulation Output (v0.12-10 cost)

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
Dragon Kill %:        81.7%
Rider Kill %:         18.3%

RIDER WIN RATES
--------------------------------------------------------------------------------
Bronn      58.1% (523/900)
Talia      56.3% (507/900)
Morrik     48.2% (434/900)
Lyra       45.2% (407/900)
Kael       42.1% (379/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voltwing     53.7% (483/900)
Cryowyrm     52.7% (474/900)
Voidmaw      51.0% (459/900)
Steelhorn    50.9% (458/900)
Emberfang    41.8% (376/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
2-3      turns: 0.0% (1 games)
4-5      turns: 1.3% (29 games)
6-7      turns: 20.5% (462 games)
8-9      turns: 18.2% (409 games)
10-11    turns: 18.4% (415 games)
12-13    turns: 12.1% (272 games)
14-15    turns: 8.3% (186 games)
16-17    turns: 6.9% (156 games)
18-19    turns: 3.6% (80 games)
20-21    turns: 4.7% (105 games)
22-23    turns: 1.2% (28 games)
24-25    turns: 2.0% (44 games)
26-27    turns: 1.1% (24 games)
28-29    turns: 0.8% (19 games)
30-31    turns: 0.5% (11 games)
32-33    turns: 0.2% (4 games)
34-35    turns: 0.1% (2 games)
36-37    turns: 0.1% (3 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.4 vs 5.9 turns (+6.5)
Dragon Kill %:  81.7% vs 68% (+13.7%)
Rider Kill %:   18.3% vs 32% (-13.7%)

Top Rider Change:
  v0.12: Bronn at 58.1%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voltwing at 53.7%
  v0.8:  Cryowyrm at 67%

================================================================================
```
