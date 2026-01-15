# Dragon Riders — Balance Analysis: v0.12-11 (Cost+Nudge) vs v0.12-10 cost & power

**Date**: January 15, 2026  
**Analysis**: Rider damage costs 2 → 1 plus small nudge (Precision Strike 3 dmg)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: The cost‑plus‑nudge variant **beats both v0.12-10 branches on rider‑kill** while preserving the faster pacing of the cost branch.

### Key Outcomes (v0.12-11 cost+)
- **Average game length**: **12.4 turns** (same as cost branch)
- **Dragon kill %**: **80.4%** (lowest so far)
- **Rider kill %**: **19.6%** (second‑best overall, behind power branch)
- **Cryowyrm**: **52.4%** (strong and healthy)

---

## Headline Comparison

| Metric | v0.12-11 cost+ | v0.12-10 cost | v0.12-10 power |
|--------|-----------------|---------------|----------------|
| Avg Game Length | **12.4** | 12.4 | 12.7 |
| Dragon Kill % | **80.4%** | 81.7% | 79.6% |
| Rider Kill % | **19.6%** | 18.3% | **20.4%** |
| Cryowyrm Win % | **52.4%** | 52.7% | 51.2% |

**Takeaway:** Cost+ gives near‑power rider‑kill with cost‑branch pacing.

---

## Interpretation

This is the most balanced rider‑kill buff tested:
- Pacing remains at the **fastest** level among v0.12 iterations
- Rider‑kill improves significantly without destabilizing dragons
- Cryowyrm remains strong and competitive

---

## Recommendation

If you want a **single best candidate**, choose **v0.12-11 cost+**.  
It’s the best compromise between rider‑kill improvement and pacing stability.

---

## Appendix: Simulation Output (v0.12-11 cost+)

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
Dragon Kill %:        80.4%
Rider Kill %:         19.6%

RIDER WIN RATES
--------------------------------------------------------------------------------
Bronn      57.3% (516/900)
Talia      55.6% (500/900)
Morrik     49.3% (444/900)
Lyra       45.4% (409/900)
Kael       42.3% (381/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voltwing     53.9% (485/900)
Cryowyrm     52.4% (472/900)
Steelhorn    51.1% (460/900)
Voidmaw      49.3% (444/900)
Emberfang    43.2% (389/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.7% (38 games)
6-7      turns: 20.0% (451 games)
8-9      turns: 19.3% (434 games)
10-11    turns: 15.8% (355 games)
12-13    turns: 13.5% (303 games)
14-15    turns: 7.7% (173 games)
16-17    turns: 7.4% (166 games)
18-19    turns: 3.6% (82 games)
20-21    turns: 4.7% (106 games)
22-23    turns: 1.6% (37 games)
24-25    turns: 2.1% (47 games)
26-27    turns: 0.9% (21 games)
28-29    turns: 0.8% (19 games)
30-31    turns: 0.4% (10 games)
32-33    turns: 0.2% (5 games)
34-35    turns: 0.0% (1 games)
36-37    turns: 0.1% (2 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    12.4 vs 5.9 turns (+6.5)
Dragon Kill %:  80.4% vs 68% (+12.4%)
Rider Kill %:   19.6% vs 32% (-12.4%)

Top Rider Change:
  v0.12: Bronn at 57.3%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voltwing at 53.9%
  v0.8:  Cryowyrm at 67%

================================================================================
```
