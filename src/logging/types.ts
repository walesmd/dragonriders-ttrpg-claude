import type { PlayerNumber, WinType, RiderName, DragonName, AIDifficulty } from '../data/types';

// Game version (tracks game rules and AI logic changes, not package version)
export const LOG_VERSION = '0.10';

// ============================================================================
// MAIN GAME LOG STRUCTURE
// ============================================================================

export interface GameLog {
  // Metadata
  gameId: string;
  timestamp: string;
  version: string;

  // Game configuration
  mode: 'local' | 'ai' | 'multiplayer';
  aiDifficulty?: AIDifficulty;

  // Setup information
  setup: GameSetup;

  // Action history (flat list for easy display and analysis)
  actions: ActionEntry[];

  // Game result (null if game incomplete)
  result: GameResult | null;
}

// ============================================================================
// SETUP
// ============================================================================

export interface GameSetup {
  player1: PlayerSetup;
  player2: PlayerSetup;
}

export interface PlayerSetup {
  rider: RiderName | null;
  dragon: DragonName | null;
  deck: string[]; // Card names for analysis
}

// ============================================================================
// ACTIONS
// ============================================================================

export type ActionType =
  | 'turn_start'
  | 'draw_card'
  | 'energy_gain'
  | 'burn_damage'
  | 'dragon_ability'
  | 'action_phase'
  | 'attack'
  | 'play_card'
  | 'end_turn'
  | 'freeze_thaw'
  | 'discard'
  | 'game_end';

export interface ActionEntry {
  // Timing
  turn: number;
  player: PlayerNumber;
  timestamp: number;

  // Action info
  type: ActionType;
  action: string; // Human-readable description

  // Detailed data (varies by action type)
  details?: ActionDetails;

  // State snapshot after this action (optional, for key events)
  stateAfter?: StateSnapshot;
}

export interface ActionDetails {
  // Attack details
  target?: 'dragon' | 'rider';
  damage?: number;
  damageBeforeReduction?: number;
  shieldsAbsorbed?: number;

  // Dragon ability effects
  dragonAbility?: string;
  burnApplied?: number;
  freezeApplied?: boolean;
  splashDamage?: number;
  energyStolen?: number;

  // Rider bonus effects
  kaelBonus?: { damage: number; shields: number } | null;
  morrikBonus?: number;
  bronnReduction?: number;

  // Card details
  cardName?: string;
  cardCost?: number;
  effects?: string[];

  // Energy details
  energyGained?: number;
  energyTotal?: number;
  energyBreakdown?: {
    base: number;
    riderBonus: number;
    dragonAliveBonus?: number;
  };

  // Burn details
  burnDamage?: number;
  burnSource?: 'dragon' | 'rider';
  hpAfter?: number;

  // Other
  cardDrawn?: string;
  discardedCard?: string;
  winner?: PlayerNumber;
  winType?: WinType;
  nextPlayer?: PlayerNumber;
  nextTurn?: number;
}

// ============================================================================
// STATE SNAPSHOT
// ============================================================================

export interface StateSnapshot {
  // Player 1
  p1: PlayerSnapshot;
  // Player 2
  p2: PlayerSnapshot;
}

export interface PlayerSnapshot {
  dragon: {
    hp: number;
    maxHp: number;
    shields: number;
    frozen: boolean;
    burn: number;
  };
  rider: {
    hp: number;
    maxHp: number;
    frozen: boolean;
    burn: number;
    wounded: boolean;
    critical: boolean;
  };
  energy: number;
  handSize: number;
  deckSize: number;
}

// ============================================================================
// GAME RESULT
// ============================================================================

export interface GameResult {
  winner: PlayerNumber;
  winType: WinType;
  totalTurns: number;
  gameDurationMs: number;

  // Final HP values
  finalState: {
    p1DragonHP: number;
    p1RiderHP: number;
    p2DragonHP: number;
    p2RiderHP: number;
  };

  // Aggregated statistics
  stats: GameStats;
}

export interface GameStats {
  player1: PlayerStats;
  player2: PlayerStats;
}

export interface PlayerStats {
  // Damage
  totalDamageDealt: number;
  damageToOpponentDragon: number;
  damageToOpponentRider: number;

  // Actions
  cardsPlayed: number;
  attacksMade: number;

  // Economy
  energySpent: number;
  energyGenerated: number;

  // Status effects applied
  burnApplied: number;
  freezesApplied: number;

  // Healing/shields
  healingDone: number;
  shieldsGained: number;
}
