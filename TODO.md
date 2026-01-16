# Technical Debt & Future Improvements

This document tracks known technical debt, refactoring opportunities, and future improvements for the Dragon Riders project.

---

## State Immutability Issues

**Priority:** Medium
**Branch:** v0.10-5-card-draft
**Date:** 2026-01-14

### Issue: Direct Mutation of `state.actionLog` in gameStore

The following locations directly mutate `state.actionLog` using `.push()`, which violates immutability principles and can cause issues with state tracking:

#### Location 1: `src/store/gameStore.ts` (lines 93-105)
In the `attack()` function:
```typescript
state.actionLog.push({
  turn: state.turn,
  player: state.activePlayer,
  action: `Attacked ${target === 'dragon' ? 'Dragon' : 'Rider'}`,
  // ...
});
```

**Problem:** Mutates `state.actionLog` with `.push()` which keeps the same array reference.

**Solution:** Create a new array when adding entries:
```typescript
const newLogEntry = {
  turn: state.turn,
  player: state.activePlayer,
  action: `Attacked ${target === 'dragon' ? 'Dragon' : 'Rider'}`,
  // ...
};
set({
  state: {
    ...state,
    actionLog: [...state.actionLog, newLogEntry]
  }
});
```

#### Location 2: `src/store/gameStore.ts` (lines 145-156)
In the `playCard()` function:
```typescript
state.actionLog.push({
  turn: state.turn,
  player: state.activePlayer,
  action: `Played ${result.cardName || 'Unknown'}`,
  // ...
});
```

**Problem:** Same as above - direct mutation of `state.actionLog`.

**Solution:** Use immutable update pattern:
```typescript
const newLogEntry = {
  turn: state.turn,
  player: state.activePlayer,
  action: `Played ${result.cardName || 'Unknown'}`,
  details: {
    cost: result.energySpent,
    morrikBonus: result.morrikBonus,
    effects: result.effects,
  },
  timestamp: Date.now(),
};
state.actionLog = [...state.actionLog, newLogEntry];
```

#### Location 3: `src/ai/ai.ts`
Check for any mutations in `src/ai/ai.ts` that modify `state.actionLog` directly.

**Affected Files:**
- `src/store/gameStore.ts` (attack and playCard functions)
- `src/ai/ai.ts` (AI action execution)

**Impact:**
- May cause issues with undo/redo functionality
- Could lead to stale state in UI components
- Violates Zustand best practices for immutability

---

## Future Improvements

### Draft Pool Architecture
- Increase card artwork height in draft pool screen
- Consider refactoring multiplayer draft to use server-side visible/hidden pool separation for better fairness
- Current implementation uses client-side slicing which could allow clients to inspect upcoming cards

### Code Duplication
- Extract card type legend into shared component (duplicated in `DraftScreen.tsx` and `MultiplayerDraft.tsx`)
- Refactor drafter switching logic in `setupStore.ts` to reduce duplication between player 1 and player 2 branches
