# Dragon Riders — Balance Analysis: v0.12-3 vs v0.12-2 vs v0.12 vs v0.8

**Date**: January 15, 2026  
**Analysis**: Freeze stacks like Burn (stacking freeze duration)  
**Sample Size**: 2,250 games (comprehensive simulation)  
**Methodology**: AI vs AI (medium difficulty), all rider/dragon combinations  

---

## Executive Summary

**Primary Finding**: Freeze stacking **dramatically buffs Cryowyrm** but **lengthens games** and **further suppresses rider-kill**. The change improves one dragon’s viability at the cost of overall pacing and strategic balance.

### Key Outcomes (v0.12-3)
- **Cryowyrm recovered** to **49.7%** (from ~29% in v0.12/v0.12-2)
- **Average game length increased** to **13.1 turns**
- **Rider kill % dropped** to **16.1%** (worse than v0.12-2)
- **Dragon kill % rose** to **83.9%**

---

## Detailed Metrics (v0.12-3)

### Overall Game Metrics

| Metric | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Trend |
|--------|---------|---------|-------|------|-------|
| Average Game Length | **13.1 turns** | 12.4 | 12.6 | 5.9 | Slower |
| Dragon Kill % | **83.9%** | 82.8% | 90.6% | 68% | Still high |
| Rider Kill % | **16.1%** | 17.2% | 9.4% | 32% | Still low |

### Rider Balance

| Rider | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-2 |
|-------|---------|---------|-------|------|-------------------|
| Bronn | **57.0%** | 58.1% | 60.2% | 62% | -1.1% |
| Talia | **55.4%** | 58.0% | 59.2% | 53% | -2.6% |
| Morrik | **49.8%** | 48.1% | 47.1% | 43% | +1.7% |
| Lyra | **46.4%** | 43.4% | 41.9% | 42% | +3.0% |
| Kael | **41.3%** | 42.3% | 41.6% | 50% | -1.0% |

**Rider Spread**: 15.7% (Bronn 57.0% - Kael 41.3%), similar to v0.12-2.

### Dragon Balance

| Dragon | v0.12-3 | v0.12-2 | v0.12 | v0.8 | Change vs v0.12-2 |
|--------|---------|---------|-------|------|-------------------|
| Voidmaw | **54.2%** | 57.1% | 59.6% | 34% | -2.9% |
| Steelhorn | **52.1%** | 58.0% | 59.7% | 47% | -5.9% |
| Voltwing | **51.4%** | 57.2% | 51.2% | 60% | -5.8% |
| Cryowyrm | **49.7%** | 28.6% | 29.3% | 67% | **+21.1%** |
| Emberfang | **42.6%** | 49.1% | 50.2% | 42% | -6.5% |

**Dragon Spread**: 11.6% (Voidmaw 54.2% - Emberfang 42.6%), far tighter than prior versions.

---

## Game Length Distribution (v0.12-3)

| Turn Range | Frequency |
|------------|-----------|
| 3-5 turns | 1.0% |
| 6-9 turns | 33.1% |
| 10-15 turns | 42.6% |
| 16+ turns | 23.3% |

**Observation**: Freeze stacking pushes more games into 10+ turn territory.

---

## Comparison: v0.12-3 vs v0.12-2

### Improvements
- **Cryowyrm is viable** (49.7% vs 28.6%)
- **Dragon spread improved** (11.6% vs 29.4%)

### Regressions
- **Games longer** (13.1 vs 12.4 turns)
- **Rider kills lower** (16.1% vs 17.2%)
- **Aggressive dragons weaker** (Emberfang, Voltwing down)

---

## Comparison vs v0.12 and v0.8

### vs v0.12
- **Cryowyrm recovered** (49.7% vs 29.3%)
- **Dragon dominance persists** (83.9% dragon kills)
- **Game length worse** (13.1 vs 12.6)

### vs v0.8
- **Game length still ~2x** (13.1 vs 5.9)
- **Rider kills still half** (16.1% vs 32%)
- **Meta still skewed toward dragon-kill**

---

## Interpretation

Freeze stacking fixed Cryowyrm’s viability and compressed dragon win-rate spread, but did so by **slowing the game further** and **suppressing rider-kill**. This change improves one axis (dragon balance) while worsening the core design goals (tempo and dual-target strategy).

---

## Recommendations (Next Iteration)

1. **Cap freeze stacks at 2**  
   Keeps Cryowyrm strong without creating long freeze chains.

2. **Decay freeze faster**  
   Reduce stacks by 1 at both end and start of turn, or clear 2 stacks per turn when frozen.

3. **Switch from “hard lock” to “stagger” at 2+ stacks**  
   Example: at 2+ stacks, target can act but only one action total (card or attack).

4. **Buff rider-kill incentives in parallel**  
   If freeze stays strong, offset by reducing rider shields or improving rider damage card efficiency.

5. **Revisit Cryowyrm ability scope**  
   Consider “freeze only on first attack each turn” or “freeze + energy tax” to keep control value without extended lockouts.

---

## Summary

Freeze stacking is **powerful but destabilizing**. It solves Cryowyrm’s weakness but makes the overall game slower and more dragon-focused. A capped or softened stacking model is likely necessary to keep Cryowyrm viable without sacrificing pacing and rider-kill viability.

---

## Appendix: Simulation Output (v0.12-3)

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
Dragon Kill %:        83.9%
Rider Kill %:         16.1%

RIDER WIN RATES
--------------------------------------------------------------------------------
Bronn      57.0% (513/900)
Talia      55.4% (499/900)
Morrik     49.8% (448/900)
Lyra       46.4% (418/900)
Kael       41.3% (372/900)

DRAGON WIN RATES
--------------------------------------------------------------------------------
Voidmaw      54.2% (488/900)
Steelhorn    52.1% (469/900)
Voltwing     51.4% (463/900)
Cryowyrm     49.7% (447/900)
Emberfang    42.6% (383/900)

GAME LENGTH DISTRIBUTION
--------------------------------------------------------------------------------
4-5      turns: 1.0% (23 games)
6-7      turns: 20.2% (455 games)
8-9      turns: 12.9% (291 games)
10-11    turns: 19.5% (438 games)
12-13    turns: 11.0% (247 games)
14-15    turns: 11.8% (265 games)
16-17    turns: 4.6% (103 games)
18-19    turns: 5.2% (116 games)
20-21    turns: 4.2% (94 games)
22-23    turns: 3.7% (83 games)
24-25    turns: 2.5% (57 games)
26-27    turns: 1.8% (40 games)
28-29    turns: 0.6% (13 games)
30-31    turns: 0.4% (9 games)
32-33    turns: 0.3% (6 games)
34-35    turns: 0.1% (3 games)
36-37    turns: 0.0% (1 games)
38-39    turns: 0.2% (4 games)
40-41    turns: 0.1% (2 games)

COMPARISON TO BASELINE (v0.8)
--------------------------------------------------------------------------------
Game Length:    13.1 vs 5.9 turns (+7.2)
Dragon Kill %:  83.9% vs 68% (+15.9%)
Rider Kill %:   16.1% vs 32% (-15.9%)

Top Rider Change:
  v0.12: Bronn at 57.0%
  v0.8:  Bronn at 62%

Top Dragon Change:
  v0.12: Voidmaw at 54.2%
  v0.8:  Cryowyrm at 67%

================================================================================
```
