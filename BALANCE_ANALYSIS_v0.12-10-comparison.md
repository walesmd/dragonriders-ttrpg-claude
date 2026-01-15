# Dragon Riders — v0.12-10 Rider Damage Branch Comparison

**Date**: January 15, 2026  
**Baseline (stable)**: `v0.12-rider-shields` @ `e671fe4`  
**Branches compared**:
- **Cost branch**: `v0.12-10-rider-dmg-cost` (Weakening/Precision cost 2 → 1)
- **Power branch**: `v0.12-10-rider-dmg-power` (Weakening/Precision damage 2 → 3)

---

## Headline Comparison

| Metric | Cost Branch | Power Branch | Stable v0.12-9 |
|--------|-------------|--------------|---------------|
| Avg Game Length | **12.4** | 12.7 | 12.5 |
| Dragon Kill % | **81.7%** | **79.6%** | 82.4% |
| Rider Kill % | 18.3% | **20.4%** | 17.6% |
| Cryowyrm Win % | **52.7%** | 51.2% | 49.7% |

**Takeaway:** Power branch delivers the **largest rider‑kill increase**, while cost branch **keeps games slightly shorter** and keeps Cryowyrm highest.

---

## Trend vs Earlier Iterations

- Both branches **improve rider‑kill** vs all v0.12 iterations to date.
- **Power branch** is closest to the rider‑kill target band but still below 25–35%.
- **Cost branch** is the best balance between rider‑kill and pacing.

---

## Recommendation

If the top priority is **rider‑kill rate**:  
**Go with the Power branch** (20.4% rider kills, biggest shift).

If the top priority is **pacing and stability**:  
**Go with the Cost branch** (shorter games, strong Cryowyrm performance).

**Suggested next step**:  
Take the **Cost branch** and add a **smaller rider‑kill nudge** (e.g., +1 value on only one rider‑damage card) to move rider‑kill closer to 20% without lengthening games.

---

## Notes

- The stable point for “RETURN TO STABLE” is **commit `e671fe4` on `v0.12-rider-shields`**.
