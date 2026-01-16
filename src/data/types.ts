// ============================================================================
// ENUMS AND TYPES
// ============================================================================

export type PlayerNumber = 1 | 2;
export type GamePhase = 'setup' | 'draft' | 'play' | 'ended';
export type TurnPhase = 'start' | 'action' | 'end';
export type WinType = 'dragon_kill' | 'rider_kill';
export type TargetType = 'dragon' | 'rider';

export type RiderName = 'Talia' | 'Kael' | 'Bronn' | 'Lyra' | 'Morrik';
export type DragonName = 'Emberfang' | 'Cryowyrm' | 'Voltwing' | 'Steelhorn' | 'Voidmaw';

export type CardEffectType =
  | 'damage'
  | 'burn'
  | 'freeze'
  | 'shield'
  | 'heal'
  | 'energy'
  | 'drain'
  | 'discard'
  | 'chain'
  | 'dual'
  | 'cripple'
  | 'thaw'
  | 'firebreak'
  | 'strip'
  | 'energy_shield';

export type CardTarget = 'dragon' | 'rider' | 'self' | 'opp' | 'both';

// ============================================================================
// GAME STATE INTERFACES
// ============================================================================

export interface GameState {
  gameId: string;
  phase: GamePhase;
  turn: number;
  activePlayer: PlayerNumber;
  turnPhase: TurnPhase;
  player1: PlayerState;
  player2: PlayerState;
  winner: PlayerNumber | null;
  winType: WinType | null;
  actionLog: LogEntry[];
}

export interface PlayerState {
  rider: RiderState;
  dragon: DragonState;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  energy: number;
  dragonFreezeStacks: number;
  dragonFreezeImmune: boolean;
  dragonBurn: number;
  riderFreezeStacks: number;
  riderFreezeImmune: boolean;
  riderBurn: number;
  firstAttackThisTurn: boolean;
  burnAppliedThisTurn: boolean;
  actionsTakenThisTurn: number;
}

// ============================================================================
// UNIT INTERFACES
// ============================================================================

export interface VisualTheme {
  primary: [string, string]; // [from-color, to-color]
  hover: [string, string]; // [from-color, to-color]
}

export interface RiderState {
  name: RiderName;
  hp: number;
  maxHp: number;
  shields: number;
  baseEconomy: number;
  woundedThreshold: number;
  criticalThreshold: number;
  forceWounded: boolean;
}

export interface RiderDefinition {
  name: RiderName;
  maxHp: number;
  baseEconomy: number;
  woundedThreshold: number;
  criticalThreshold: number;
  passive: string;
  woundedEffect: string;
  criticalEffect: string;
  visualTheme: VisualTheme;
  imagePath: string;
  shortIntro: string;
  backstory: string;
}

export interface DragonState {
  name: DragonName;
  hp: number;
  maxHp: number;
  shields: number;
  attackCost: number;
  attackDamage: number;
}

export interface DragonDefinition {
  name: DragonName;
  maxHp: number;
  shields: number;
  attackCost: number;
  attackDamage: number;
  ability: string;
  visualTheme: VisualTheme;
  imagePath: string;
  shortIntro: string;
  backstory: string;
}

// ============================================================================
// CARD INTERFACES
// ============================================================================

export interface Card {
  id: string;
  name: string;
  cost: number;
  effectType: CardEffectType;
  target: CardTarget;
  value: number;
  secondaryValue: number;
  description: string;
}

export interface CardDefinition {
  name: string;
  cost: number;
  effectType: CardEffectType;
  target: CardTarget;
  value: number;
  secondaryValue: number;
  description: string;
  copies: number;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export type GameAction =
  | { type: 'ATTACK'; target: TargetType }
  | { type: 'PLAY_CARD'; cardId: string; target?: TargetType }
  | { type: 'PASS' }
  | { type: 'DISCARD'; cardId: string };

export interface LogEntry {
  turn: number;
  player: PlayerNumber;
  action: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// ============================================================================
// SETUP TYPES
// ============================================================================

export type GameMode = 'local' | 'ai' | 'multiplayer';
export type SetupPhase = 'menu' | 'p1-rider' | 'p2-rider' | 'p1-dragon' | 'p2-dragon' | 'draft' | 'complete';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
