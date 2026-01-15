# Dragon Riders — Balance Analysis: v0.12-4 vs v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Freeze stacks capped at 2  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Capping freeze stacks at 2 **keeps Cryowyrm viable** but **does not fix pacing** and **further suppresses rider-kill**. The change slightly improves dragon parity but keeps the game long and dragon‑kill dominant.

### Key Outcomes (v0.12-4)
- **Cryowyrm remains viable** at **49.9%**
- **Average game length** stays **13.1 turns**
- **Rider kill % drops** to **15.7%**
- **Dragon kill % rises** to **84.3%**

---

## Detailed Metrics (v0.12-4)

### Overall Game Metrics

| Metric | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|---------|-------|------|-------|
| Average Game Length | **13.1 turns** | 13.1 | 12.4 | 12.6 | 5.9 | Still long |
| Dragon Kill % | **84.3%** | 83.9% | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **15.7%** | 16.1% | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-3 |
|-------|---------|---------|---------|-------|------|-------------------|
| Talia | **57.4%** | 55.4% | 58.0% | 59.2% | 53% | +2.0% |
| Bronn | **57.0%** | 57.0% | 58.1% | 60.2% | 62% | +0.0% |
| Morrik | **48.3%** | 49.8% | 48.1% | 47.1% | 43% | -1.5% |
| Lyra | **46.2%** | 46.4% | 43.4% | 41.9% | 42% | -0.2% |
| Kael | **41.0%** | 41.3% | 42.3% | 41.6% | 50% | -0.3% |

**Rider Spread**: 16.4% (Talia 57.4% - Kael 41.0%), similar to v0.12-3.

### Dragon Balance

| Dragon | v0.12-4 | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-3 |
|--------|---------|---------|---------|-------|------|-------------------|
| Voidmaw | **54.1%** | 54.2% | 57.1% | 59.6% | 34% | -0.1% |
| Steelhorn | **53.6%** | 52.1% | 58.0% | 59.7% | 47% | +1.5% |
| Cryowyrm | **49.9%** | 49.7% | 28.6% | 29.3% | 67% | +0.2% |
| Voltwing | **49.9%** | 51.4% | 57.2% | 51.2% | 60% | -1.5% |
| Emberfang | **42.6%** | 42.6% | 49.1% | 50.2% | 42% | +0.0% |

**Dragon Spread**: 11.5% (Voidmaw 54.1% - Emberfang 42.6%), still tight.

---

## Game Length Distribution (v0.12-4)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.2% |
| 6-9 turns | 33.0% |
| 10-15 turns | 42.5% |
| 16+ turns | 23.3% |

**Observation**: Capping stacks did **not** reduce long-game frequency.

---

## Comparison: v0.12-4 vs v0.12-3

### Improvements
- **No major improvements**; Cryowyrm remains viable and dragon spread stays tight.

### Regressions
- **Rider kills fell slightly** (16.1% → 15.7%)
- **Dragon kills slightly higher** (83.9% → 84.3%)

---

## Comparison vs v0.12-2 and v0.12

- v0.12-4 **preserves Cryowyrm viability** but worsens rider-kill and game length vs v0.12-2.
- v0.12-4 still **far from v0.8 pacing and kill split**.

---

## Interpretation

The cap at 2 stacks prevents runaway freeze chains but **does not address the core issues**: games are still long and rider-kill remains suppressed. Cryowyrm is now balanced, but the overall meta still skews to dragon-kill.

---

## Recommendations (Next Iteration)

1. **Keep freeze stacking but reduce action denial**  
   Example: at ≥1 stack, only 1 action per turn (card **or** attack), not full lock.

2. **Increase freeze decay rate**  
   Remove 2 stacks per turn, or clear 1 at start and 1 at end.

3. **Buff rider-kill pathways**  
   - Reduce rider shields by 1 across all dragons  
   - Buff rider‑damage card efficiency (cost or value)

4. **Restore tempo for aggressive dragons**  
   Consider slight buffs to Emberfang/Voltwing to offset freeze control.

---

## Summary

Capping freeze stacks to 2 stabilizes Cryowyrm without letting it dominate, but **does not fix the slow, dragon‑heavy meta**. To hit the target 8–10 turns and 25–35% rider kills, freeze needs a softer restriction and rider‑kill incentives must be strengthened.

---

## Appendix: Simulation Output (v0.12-4)

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
Average Game Length:  13.1 turns
Dragon Kill %:        84.3%
Rider Kill %:         15.7%

RIDER WIN RATES
--------------------------------------------------------------------------------
Talia      57.4% (517/900)
Bronn      57.0% (513/900)
Morrik     48.3% (435/900)
Lyra       46.2% (416/900)
Kael       41.0% (369/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      54.1% (487/900)
Steelhorn    53.6% (482/900)
Cryowyrm     49.9% (449/900)
Voltwing     49.9% (449/900)
Emberfang    42.6% (383/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.2% (27 games)
6-7      turns: 20.0% (451 games)
8-9      turns: 13.0% (292 games)
10-11    turns: 18.4% (413 games)
12-13    turns: 12.2% (274 games)
14-15    turns: 11.9% (267 games)
16-17    turns: 4.9% (111 games)
18-19    turns: 4.5% (102 games)
20-21    turns: 4.3% (96 games)
22-23    turns: 3.6% (81 games)
24-25    turns: 2.2% (49 games)
26-27    turns: 1.6% (36 games)
28-29    turns: 0.9% (20 games)
30-31    turns: 0.7% (15 games)
32-33    turns: 0.2% (4 games)
34-35    turns: 0.2% (5 games)
36-37    turns: 0.2% (5 games)
38-39    turns: 0.1% (2 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    13.1 vs 5.9 turns (+7.2)
Dragon Kill %:  84.3% vs 68% (+16.3%)
Rider Kill %:   15.7% vs 32% (-16.3%)

Top Rider Change:
  v0.12: Talia at 57.4%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 54.1%
  v0.8:  Cryowyrm at 67%

================================================================================
```
