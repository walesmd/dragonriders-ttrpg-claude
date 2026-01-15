# Dragon Riders — Balance Analysis: v0.12-10 (Rider Damage Power) vs v0.12-9 and prior

**Date**: January 15, 2026  
**Analysis**: Rider damage cards increased from 2 → 3 damage (cost stays 2)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Increasing rider‑damage values yields the **largest rider‑kill boost** so far, but slightly **slows games** compared to the cost‑reduction approach. Cryowyrm remains viable and dragon spread stays tight.

### Key Outcomes (v0.12-10 power)
- **Average game length**: **12.7 turns**
- **Dragon kill %**: **79.6%**
- **Rider kill %**: **20.4%** (highest in v0.12 series)
- **Cryowyrm**: **51.2%**

---

## Detailed Metrics (v0.12-10 power)

### Overall Game Metrics

| Metric | v0.12-10 power | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 |
|--------|-----------------|---------|---------|---------|---------|---------|---------|---------|---------|-------|------|
| Average Game Length | **12.7** | 12.5 | 12.6 | 13.0 | 12.4 | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 |
| Dragon Kill % | **79.6%** | 82.4% | 83.8% | 83.8% | 83.3% | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% |
| Rider Kill % | **20.4%** | 17.6% | 16.2% | 16.2% | 16.7% | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% |

### Rider Balance

| Rider | v0.12-10 power | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 |
|-------|-----------------|---------|---------|---------|---------|---------|
| Talia | **56.7%** | 56.8% | 58.1% | 56.6% | 58.4% | 58.0% |
| Bronn | **56.4%** | 54.1% | 57.2% | 57.9% | 57.9% | 56.4% |
| Morrik | **48.9%** | 50.4% | 49.1% | 47.2% | 48.3% | 47.2% |
| Lyra | **46.7%** | 45.4% | 45.1% | 46.3% | 45.9% | 45.4% |
| Kael | **41.3%** | 43.2% | 40.4% | 42.0% | 39.4% | 42.9% |

**Rider Spread**: 15.4% (Talia 56.7% - Kael 41.3%), similar to recent iterations.

### Dragon Balance

| Dragon | v0.12-10 power | v0.12-9 | v0.12-8 | v0.12-7 | v0.12-6 | v0.12-5 |
|--------|-----------------|---------|---------|---------|---------|---------|
| Voltwing | **53.2%** | 52.9% | 50.9% | 51.8% | 56.0% | 50.4% |
| Steelhorn | **51.9%** | 53.4% | 52.8% | 54.3% | 58.2% | 53.2% |
| Cryowyrm | **51.2%** | 49.7% | 49.9% | 46.4% | 28.4% | 49.1% |
| Voidmaw | **50.6%** | 52.3% | 53.9% | 55.3% | 59.3% | 54.1% |
| Emberfang | **43.1%** | 41.7% | 42.6% | 42.1% | 48.0% | 43.1% |

**Dragon Spread**: 10.1% (Voltwing 53.2% - Emberfang 43.1%), tight.

---

## Interpretation

Increasing rider‑damage values is the **strongest rider‑kill lever** tested so far. It yields the highest rider‑kill rate in v0.12 while keeping Cryowyrm viable. The tradeoff is a slightly longer average game than the cost‑reduction variant.

---

## Recommendations

1. **Prefer power buff if rider‑kill is top priority**  
   It moves rider‑kill the most.

2. **Consider hybrid with cost‑reduction for one card only**  
   If pacing is a concern, reduce the cost of only one rider‑damage card and keep the other at 3 damage.

---

## Appendix: Simulation Output (v0.12-10 power)

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
Average Game Length:  12.7 turns
Dragon Kill %:        79.6%
Rider Kill %:         20.4%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      56.7% (510/900)
Bronn      56.4% (508/900)
Morrik     48.9% (440/900)
Lyra       46.7% (420/900)
Kael       41.3% (372/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voltwing     53.2% (479/900)
Steelhorn    51.9% (467/900)
Cryowyrm     51.2% (461/900)
Voidmaw      50.6% (455/900)
Emberfang    43.1% (388/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.0% (22 games)
6-7      turns: 21.5% (484 games)
8-9      turns: 15.7% (353 games)
10-11    turns: 18.4% (413 games)
12-13    turns: 11.7% (264 games)
14-15    turns: 10.0% (224 games)
16-17    turns: 4.9% (111 games)
18-19    turns: 4.3% (96 games)
20-21    turns: 4.0% (91 games)
22-23    turns: 2.6% (58 games)
24-25    turns: 2.3% (51 games)
26-27    turns: 1.1% (25 games)
28-29    turns: 1.1% (24 games)
30-31    turns: 0.7% (16 games)
32-33    turns: 0.7% (15 games)
36-37    turns: 0.1% (2 games)
38-39    turns: 0.0% (1 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.7 vs 5.9 turns (+6.8)
Dragon Kill %:  79.6% vs 68% (+11.6%)
Rider Kill %:   20.4% vs 32% (-11.6%)

Top Rider Change:
  v0.12: Talia at 56.7%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voltwing at 53.2%
  v0.8:  Cryowyrm at 67%

================================================================================
```
