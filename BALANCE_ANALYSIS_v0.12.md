# Dragon Riders — v0.12 Consolidated Balance Analysis

**Date**: January 15, 2026  
**Current Stable Commit**: `38cc55a` on `v0.12-rider-shields`  
**Stable Gameplay State (RETURN TO STABLE)**: `e671fe4` on `v0.12-rider-shields`  
**Methodology**: AI vs AI (medium difficulty), 2,250 games per iteration

---

## Current Stable Snapshot

**Iteration**: v0.12-11 cost+ (cost reduction + small rider-damage nudge)  
**Average Game Length**: **12.4 turns**  
**Dragon Kill %**: **80.4%**  
**Rider Kill %**: **19.6%**  
**Cryowyrm**: **52.4%**

**Why it’s stable:** Best balance so far between rider-kill increase and pacing, while keeping Cryowyrm viable.

---

## Iteration Summary Table

| Iteration | Core Change | Avg Length | Dragon Kill % | Rider Kill % |
|-----------|-------------|------------|--------------|--------------|
| v0.12 | Rider shields introduced | 12.6 | 90.6% | 9.4% |
| v0.12-2 | Baseline logs (post fixes) | 12.4 | 82.8% | 17.2% |
| v0.12-3 | Freeze stacks (uncapped) | 13.1 | 83.9% | 16.1% |
| v0.12-4 | Freeze stacks capped at 2 | 13.1 | 84.3% | 15.7% |
| v0.12-5 | Stagger (1 action) | 13.0 | 83.6% | 16.4% |
| v0.12-6 | Stagger + faster decay | 12.4 | 83.3% | 16.7% |
| v0.12-7 | Stagger + energy tax | 13.0 | 83.8% | 16.2% |
| v0.12-8 | Cryowyrm Frostbite | 12.6 | 83.8% | 16.2% |
| v0.12-9 | Rider shields -1 | 12.5 | 82.4% | 17.6% |
| v0.12-10 cost | Rider dmg cost 2→1 | 12.4 | 81.7% | 18.3% |
| v0.12-10 power | Rider dmg 2→3 | 12.7 | 79.6% | 20.4% |
| v0.12-11 cost+ | Cost 2→1 + Precision 3 dmg | 12.4 | 80.4% | 19.6% |

---

## Key Trends

- **Rider-kill improves** once rider shields are reduced and rider-damage efficiency is buffed.
- **Freeze reworks** help Cryowyrm but do **not** fix rider-kill or pacing on their own.
- **Power branch** has the highest rider-kill but slows games slightly.
- **Cost branch** preserves pacing and yields strong Cryowyrm results.
- **Cost+ (v0.12-11)** is the best overall compromise so far.

---

## Recommendations (Going Forward)

1. **Keep v0.12-11 cost+ as the stable baseline.**
2. **If rider-kill needs more nudging**, consider:
   - +1 value to only one rider-damage card (already done in v0.12-11)
   - +1 copy of a rider-damage card in the pool
3. **Monitor Bronn** as rider shields drop (his win rate dips).
4. **Avoid global freeze reworks** unless Cryowyrm falls below ~45%.

---

## Notes

- All previous v0.12 analysis files were consolidated into this document.
