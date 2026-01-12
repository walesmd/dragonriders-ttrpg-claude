# Dragon Riders Test Suite

This document describes the comprehensive test suite for Dragon Riders, covering all core gameplay mechanics.

## Overview

The test suite includes **172 tests** across **8 test files**, validating the most critical aspects of the game:

- **Win Conditions** - All win scenarios including simultaneous deaths
- **Damage Calculation** - Shields, damage reduction, Steelhorn counter
- **Freeze Mechanics** - Application, immunity, and timing
- **Burn Mechanics** - Stacking and start-of-turn damage
- **Rider Breakpoints** - HP thresholds and their effects
- **Dragon Abilities** - All 5 dragon special abilities
- **Card Effects** - All card effect types (damage, freeze, heal, etc.)
- **Energy Economy** - Energy generation and spending
- **Turn Phases** - Start, action, and end phase logic

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode (auto-reruns on file changes)
npm test

# Run all tests once
npm run test:run

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Files

### 1. Win Conditions (`winConditions.test.ts`)
**13 tests** covering:
- Dragon kill victories
- Rider kill victories
- Simultaneous deaths (active player loses)
- Prioritization of dragon deaths over rider deaths
- Negative HP handling
- Game state updates on win

### 2. Damage Calculation (`combat-damage.test.ts`)
**32 tests** covering:
- Basic damage to dragons and riders
- Shield absorption mechanics
- Bronn damage reduction at different HP thresholds
- Steelhorn energy counter
- Healing mechanics
- Shield addition (including Morrik's wounded penalty)

### 3. Freeze Mechanics (`freeze.test.ts`)
**19 tests** covering:
- Freezing dragons and riders
- Freeze immunity
- Clearing freeze
- Granting/clearing immunity
- Freeze flow cycle (freeze → clear → immunity → clear immunity)
- Independent tracking for dragon and rider

### 4. Burn Mechanics (`burn.test.ts`)
**16 tests** covering:
- Applying burn stacks
- Burn stacking on multiple applications
- Independent tracking for dragon and rider
- Start-of-turn burn damage
- Burn persistence across turns
- Lethal burn damage triggering win conditions

### 5. Rider Breakpoints & Economy (`riders-economy.test.ts`)
**24 tests** covering:
- Wounded and critical state detection
- Force wounded flag (from Crippling Blow)
- Talia's economy changes at different HP levels
- Kael's attack cost increase when critical
- Bronn's damage reduction at different HP levels
- Energy breakdown calculations
- All 5 riders' threshold values

### 6. Dragon Abilities (`dragon-abilities.test.ts`)
**23 tests** covering:
- **Emberfang**: Burn on first attack only
- **Cryowyrm**: Freeze on every attack, respecting immunity
- **Voltwing**: 2 splash damage to other target
- **Steelhorn**: Energy counter when taking damage (not when shielded)
- **Voidmaw**: Energy steal + bonus damage when ahead
- **Kael + Dragon**: First attack damage/shield bonus

### 7. Card Effects (`cards.test.ts`)
**24 tests** covering:
- Damage cards (dragon and rider targets)
- Burn cards (damage + burn stacks)
- Freeze cards (with immunity checks)
- Shield cards (including Morrik's wounded penalty and energy bonus)
- Heal cards (dragon and rider)
- Energy cards (gain energy)
- Drain cards (opponent loses energy)
- Chain cards (damage both)
- Cripple cards (damage + force wounded)
- Thaw cards (remove freeze + draw)
- Firebreak cards (remove all burn)
- Strip cards (remove all shields)
- Card validation (cost, hand presence)
- Frozen card play tracking

### 8. Turn Phases (`phases.test.ts`)
**21 tests** covering:
- **Start Phase**: Draw card, gain energy, burn damage, reset flags, clear opponent immunity
- **End Phase**: Discard to hand limit, clear freeze + grant immunity, switch players, turn increment
- **Pass Turn**: Full end-to-start phase cycle
- Freeze immunity timing
- Energy accumulation across turns
- Game end handling

## Test Utilities

Located in `src/engine/__tests__/testUtils.ts`:

- `createTestGameState()` - Creates a basic game state for testing
- `createTestCard()` - Creates cards with customizable properties
- `setPlayerHp()` - Sets specific HP values for breakpoint testing
- `setPlayerEnergy()` - Sets player energy
- `addCardsToHand()` - Adds cards to a player's hand
- `createCombatTestState()` - Sets up state ready for combat
- `createNearWinState()` - Sets up state on the brink of victory
- `advanceToActionPhase()` - Moves state to action phase

## Coverage Goals

The test suite focuses on **core game logic** in `src/engine/`:

✅ **state.ts** - Player state, drawing, discarding
✅ **combat.ts** - Damage, healing, status effects, attacks
✅ **phases.ts** - Start, end, and turn passing
✅ **cards.ts** - All card effect types
✅ **economy.ts** - Energy calculations
✅ **winConditions.ts** - All win scenarios
✅ **riders** (via data/riders.ts) - Breakpoints and abilities
✅ **dragons** (via data/dragons.ts) - All dragon abilities

UI components (`src/components/`) and stores (`src/store/`) are excluded from coverage as they require different testing approaches.

## Key Testing Priorities (from CLAUDE.md)

All 8 testing priorities from the game design doc are covered:

1. ✅ **Win conditions** - 13 tests
2. ✅ **Damage calculation** - 32 tests
3. ✅ **Freeze mechanics** - 19 tests
4. ✅ **Burn mechanics** - 16 tests
5. ✅ **Rider breakpoints** - 24 tests
6. ✅ **Dragon abilities** - 23 tests
7. ✅ **Card effects** - 24 tests
8. ✅ **Energy economy** - 21 tests (covered in phases + riders-economy)

## Common Edge Cases Tested

✅ Simultaneous dragon/rider deaths
✅ Steelhorn vs Voidmaw interactions
✅ Bronn wounded breakpoint changes
✅ Kael wounded bonus changes
✅ Freeze immunity timing
✅ Empty deck drawing
✅ Morrik shield energy interaction
✅ Damage reduction not going negative
✅ Healing not exceeding max HP
✅ Burn persisting until removed
✅ Force wounded flag behavior

## Continuous Integration

To add CI/CD testing:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:run
```

## Future Test Additions

Areas that could be expanded:

- **Integration tests** - Full game scenarios from setup to victory
- **AI behavior tests** - Validate AI decision making
- **Multiplayer sync tests** - PartyKit state synchronization
- **Performance tests** - Large hand/deck scenarios
- **Stress tests** - Very long games, extreme stat values

## Contributing Tests

When adding new features:

1. Add tests to the appropriate test file
2. Use existing test utilities for consistency
3. Follow the "Arrange-Act-Assert" pattern
4. Test both success and failure cases
5. Test edge cases and boundaries
6. Run `npm run test:run` before committing

## Test Philosophy

This test suite follows these principles:

- **Unit-focused** - Test individual functions in isolation
- **Fast execution** - All 172 tests run in ~300ms
- **Readable** - Clear test names describing what is being tested
- **Maintainable** - Utilities reduce duplication
- **Comprehensive** - Cover all critical game mechanics
- **Deterministic** - No randomness in test outcomes

---

**Total Test Coverage**: 172 tests ensuring core gameplay integrity
