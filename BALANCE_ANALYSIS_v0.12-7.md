# Dragon Riders — Balance Analysis: v0.12-7 vs v0.12-6 vs v0.12-5 vs v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Stagger + 1 stack decay + energy tax (+1 cost while frozen)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Adding an energy tax while staggered keeps Cryowyrm viable but **does not improve pacing or rider‑kill frequency**. Results are similar to v0.12-5, with slightly worse rider‑kill and still long games.

### Key Outcomes (v0.12-7)
- **Average game length**: **13.0 turns**
- **Dragon kill %**: **83.8%**
- **Rider kill %**: **16.2%**
- **Cryowyrm**: **46.4%** (viable but weaker than v0.12-5)

---

## Detailed Metrics (v0.12-7)

### Overall Game Metrics

| Metric | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|---------|---------|---------|-------|------|-------|
| Average Game Length | **13.0 turns** | 12.4 | 13.0 | 13.1 | 13.1 | 12.4 | 12.6 | 5.9 | Still long |
| Dragon Kill % | **83.8%** | 83.3% | 83.6% | 84.3% | 83.9% | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **16.2%** | 16.7% | 16.4% | 15.7% | 16.1% | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-6 |
|-------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Bronn | **57.9%** | 57.9% | 56.4% | 57.0% | 57.0% | 58.1% | 60.2% | 62% | +0.0% |
| Talia | **56.6%** | 58.4% | 58.0% | 57.4% | 55.4% | 58.0% | 59.2% | 53% | -1.8% |
| Morrik | **47.2%** | 48.3% | 47.2% | 48.3% | 49.8% | 48.1% | 47.1% | 43% | -1.1% |
| Lyra | **46.3%** | 45.9% | 45.4% | 46.2% | 46.4% | 43.4% | 41.9% | 42% | +0.4% |
| Kael | **42.0%** | 39.4% | 42.9% | 41.0% | 41.3% | 42.3% | 41.6% | 50% | +2.6% |

**Rider Spread**: 15.9% (Bronn 57.9% - Kael 42.0%), similar to recent iterations.

### Dragon Balance

| Dragon | v0.12-7 | v0.12-6 | v0.12-5 | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-6 |
|--------|---------|---------|---------|---------|---------|---------|-------|------|-------------------|
| Voidmaw | **55.3%** | 59.3% | 54.1% | 54.1% | 54.2% | 57.1% | 59.6% | 34% | -4.0% |
| Steelhorn | **54.3%** | 58.2% | 53.2% | 53.6% | 52.1% | 58.0% | 59.7% | 47% | -3.9% |
| Voltwing | **51.8%** | 56.0% | 50.4% | 49.9% | 51.4% | 57.2% | 51.2% | 60% | -4.2% |
| Cryowyrm | **46.4%** | 28.4% | 49.1% | 49.9% | 49.7% | 28.6% | 29.3% | 67% | +18.0% |
| Emberfang | **42.1%** | 48.0% | 43.1% | 42.6% | 42.6% | 49.1% | 50.2% | 42% | -5.9% |

**Dragon Spread**: 13.2% (Voidmaw 55.3% - Emberfang 42.1%), still tighter than pre‑freeze changes.

---

## Game Length Distribution (v0.12-7)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.2% |
| 6-9 turns | 32.7% |
| 10-15 turns | 42.5% |
| 16+ turns | 23.6% |

**Observation**: Pacing remains in the long‑game band despite the energy tax.

---

## Comparison: v0.12-7 vs v0.12-5 (best Cryowyrm viability)

| Metric | v0.12-7 | v0.12-5 | Difference |
|--------|---------|---------|------------|
| Avg Game Length | 13.0 | 13.0 | 0.0 |
| Rider Kill % | 16.2% | 16.4% | -0.2% |
| Cryowyrm Win | 46.4% | 49.1% | -2.7% |

**Conclusion**: Energy tax does not materially improve outcomes and slightly weakens Cryowyrm.

---

## Interpretation

The energy tax on staggered turns **doesn’t shift the meta**: games remain long and rider‑kill stays low. The primary effect is damping top dragons (Voidmaw/Steelhorn) while leaving overall pacing largely unchanged.

---

## Recommendations (Next Iteration)

1. **Keep stagger + 1‑stack decay, remove energy tax**  
   Tax adds friction without improving core outcomes.

2. **Introduce rider‑kill incentives**  
   - Reduce rider shields by 1 across all dragons  
   - Buff rider‑damage card efficiency

3. **Targeted Cryowyrm tuning**  
   - Keep stagger but add a small damage rider chip (e.g., +1 on frozen target)

4. **Re‑evaluate economy snowball**  
   Talia + Voidmaw remain strong in long games; consider small economy nerfs.

---

## Summary

v0.12-7 keeps Cryowyrm viable and maintains a tighter dragon spread, but **fails to improve pacing or rider‑kill rates**. The energy tax doesn’t deliver the balance shift we want; next steps should focus on direct rider‑kill incentives and economy dampening.

---

## Appendix: Simulation Output (v0.12-7)

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
Dragon Kill %:        83.8%
Rider Kill %:         16.2%

RIDER WIN RATES
--------------------------------------------------------------------------------
Bronn      57.9% (521/900)
Talia      56.6% (509/900)
Morrik     47.2% (425/900)
Lyra       46.3% (417/900)
Kael       42.0% (378/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      55.3% (498/900)
Steelhorn    54.3% (489/900)
Voltwing     51.8% (466/900)
Cryowyrm     46.4% (418/900)
Emberfang    42.1% (379/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.2% (28 games)
6-7      turns: 19.1% (430 games)
8-9      turns: 13.6% (307 games)
10-11    turns: 21.0% (473 games)
12-13    turns: 10.6% (239 games)
14-15    turns: 10.9% (245 games)
16-17    turns: 4.7% (105 games)
18-19    turns: 4.8% (109 games)
20-21    turns: 4.4% (99 games)
22-23    turns: 3.9% (88 games)
24-25    turns: 2.4% (53 games)
26-27    turns: 1.2% (28 games)
28-29    turns: 0.8% (19 games)
30-31    turns: 0.5% (12 games)
32-33    turns: 0.4% (9 games)
34-35    turns: 0.1% (3 games)
36-37    turns: 0.0% (1 games)
38-39    turns: 0.1% (2 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    13.0 vs 5.9 turns (+7.1)
Dragon Kill %:  83.8% vs 68% (+15.8%)
Rider Kill %:   16.2% vs 32% (-15.8%)

Top Rider Change:
  v0.12: Bronn at 57.9%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 55.3%
  v0.8:  Cryowyrm at 67%

================================================================================
```
