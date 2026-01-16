import type { GameState, PlayerNumber, WinType, Card, AIDifficulty, RiderName, DragonName } from '../data/types';
import type {
  GameLog,
  ActionEntry,
  ActionType,
  ActionDetails,
  StateSnapshot,
  PlayerSnapshot,
  PlayerStats,
  PlayerSetup,
} from './types';
import { LOG_VERSION } from './types';

// ============================================================================
// GAME LOGGER CLASS
// ============================================================================

export class GameLogger {
  private log: GameLog;
  private gameStartTime: number;
  private stats: { player1: PlayerStats; player2: PlayerStats };

  constructor() {
    this.gameStartTime = Date.now();
    this.stats = {
      player1: this.createEmptyStats(),
      player2: this.createEmptyStats(),
    };
    this.log = this.createEmptyLog();
  }

  private createEmptyLog(): GameLog {
    return {
      gameId: this.generateGameId(),
      timestamp: new Date().toISOString(),
      version: LOG_VERSION,
      mode: 'local',
      setup: {
        player1: { rider: null, dragon: null, deck: [] },
        player2: { rider: null, dragon: null, deck: [] },
      },
      actions: [],
      result: null,
    };
  }

  private generateGameId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${random}`;
  }

  private createEmptyStats(): PlayerStats {
    return {
      totalDamageDealt: 0,
      damageToOpponentDragon: 0,
      damageToOpponentRider: 0,
      cardsPlayed: 0,
      attacksMade: 0,
      energySpent: 0,
      energyGenerated: 0,
      burnApplied: 0,
      freezesApplied: 0,
      healingDone: 0,
      shieldsGained: 0,
    };
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  initialize(
    mode: 'local' | 'ai' | 'multiplayer',
    p1Rider: RiderName | null,
    p1Dragon: DragonName | null,
    p1Deck: Card[],
    p2Rider: RiderName | null,
    p2Dragon: DragonName | null,
    p2Deck: Card[],
    aiDifficulty?: AIDifficulty
  ): void {
    this.gameStartTime = Date.now();
    this.stats = {
      player1: this.createEmptyStats(),
      player2: this.createEmptyStats(),
    };

    this.log = {
      gameId: this.generateGameId(),
      timestamp: new Date().toISOString(),
      version: LOG_VERSION,
      mode,
      aiDifficulty,
      setup: {
        player1: {
          rider: p1Rider,
          dragon: p1Dragon,
          deck: p1Deck.map(c => c.name),
        },
        player2: {
          rider: p2Rider,
          dragon: p2Dragon,
          deck: p2Deck.map(c => c.name),
        },
      },
      actions: [],
      result: null,
    };
  }

  // Update setup info (useful for multiplayer where setup happens separately)
  updateSetup(player: PlayerNumber, setup: Partial<PlayerSetup>): void {
    const playerSetup = player === 1 ? this.log.setup.player1 : this.log.setup.player2;
    if (setup.rider !== undefined) playerSetup.rider = setup.rider;
    if (setup.dragon !== undefined) playerSetup.dragon = setup.dragon;
    if (setup.deck !== undefined) playerSetup.deck = setup.deck;
  }

  // ===========================================================================
  // STATE SNAPSHOTS
  // ===========================================================================

  private createSnapshot(state: GameState): StateSnapshot {
    return {
      p1: this.createPlayerSnapshot(state, 1),
      p2: this.createPlayerSnapshot(state, 2),
    };
  }

  private createPlayerSnapshot(state: GameState, player: PlayerNumber): PlayerSnapshot {
    const p = player === 1 ? state.player1 : state.player2;
    return {
      dragon: {
        hp: p.dragon.hp,
        maxHp: p.dragon.maxHp,
        shields: p.dragon.shields,
        frozen: p.dragonFreezeStacks > 0,
        burn: p.dragonBurn,
      },
      rider: {
        hp: p.rider.hp,
        maxHp: p.rider.maxHp,
        shields: p.rider.shields,
        frozen: p.riderFreezeStacks > 0,
        burn: p.riderBurn,
        wounded: p.rider.hp <= p.rider.woundedThreshold || p.rider.forceWounded,
        critical: p.rider.hp <= p.rider.criticalThreshold,
      },
      energy: p.energy,
      handSize: p.hand.length,
      deckSize: p.deck.length,
    };
  }

  // ===========================================================================
  // LOGGING METHODS
  // ===========================================================================

  logAction(
    state: GameState,
    type: ActionType,
    action: string,
    details?: ActionDetails,
    includeSnapshot = false
  ): void {
    const entry: ActionEntry = {
      turn: state.turn,
      player: state.activePlayer,
      timestamp: Date.now(),
      type,
      action,
      details,
    };

    if (includeSnapshot) {
      entry.stateAfter = this.createSnapshot(state);
    }

    this.log.actions.push(entry);
  }

  // Convenience methods for common actions

  logTurnStart(state: GameState): void {
    this.logAction(state, 'turn_start', `Turn ${state.turn} Start Phase`, undefined, true);
  }

  logDrawCard(state: GameState, cardName: string): void {
    this.logAction(state, 'draw_card', 'Drew a card', { cardDrawn: cardName });
  }

  logEnergyGain(
    state: GameState,
    amount: number,
    total: number,
    breakdown?: { base: number; riderBonus: number; dragonAliveBonus?: number }
  ): void {
    const stats = state.activePlayer === 1 ? this.stats.player1 : this.stats.player2;
    stats.energyGenerated += amount;

    this.logAction(state, 'energy_gain', 'Gained energy', {
      energyGained: amount,
      energyTotal: total,
      energyBreakdown: breakdown,
    });
  }

  logBurnDamage(
    state: GameState,
    source: 'dragon' | 'rider',
    damage: number,
    hpAfter: number
  ): void {
    this.logAction(state, 'burn_damage', `${source === 'dragon' ? 'Dragon' : 'Rider'} took burn damage`, {
      burnDamage: damage,
      burnSource: source,
      hpAfter,
    });
  }

  logDragonAbility(state: GameState, description: string, details?: ActionDetails): void {
    this.logAction(state, 'dragon_ability', description, details);
  }

  logActionPhase(state: GameState): void {
    this.logAction(state, 'action_phase', 'Entered Action Phase');
  }

  logAttack(
    state: GameState,
    target: 'dragon' | 'rider',
    damage: number,
    details: {
      damageBeforeReduction?: number;
      shieldsAbsorbed?: number;
      dragonAbility?: string;
      kaelBonus?: { damage: number; shields: number } | null;
      bronnReduction?: number;
      burnApplied?: number;
      freezeApplied?: boolean;
      splashDamage?: number;
      energyStolen?: number;
    } = {}
  ): void {
    const stats = state.activePlayer === 1 ? this.stats.player1 : this.stats.player2;
    stats.attacksMade++;
    stats.totalDamageDealt += damage;

    if (target === 'dragon') {
      stats.damageToOpponentDragon += damage;
    } else {
      stats.damageToOpponentRider += damage;
    }

    if (details.burnApplied) {
      stats.burnApplied += details.burnApplied;
    }
    if (details.freezeApplied) {
      stats.freezesApplied++;
    }
    if (details.splashDamage) {
      stats.totalDamageDealt += details.splashDamage;
      if (target === 'dragon') {
        stats.damageToOpponentRider += details.splashDamage;
      } else {
        stats.damageToOpponentDragon += details.splashDamage;
      }
    }

    this.logAction(
      state,
      'attack',
      `Attacked ${target}`,
      {
        target,
        damage,
        ...details,
      },
      true
    );
  }

  logCardPlayed(
    state: GameState,
    cardName: string,
    cost: number,
    effects: string[],
    details: {
      morrikBonus?: number;
      damage?: number;
      target?: 'dragon' | 'rider';
      healing?: number;
      shieldsGained?: number;
      burnApplied?: number;
      freezeApplied?: boolean;
    } = {}
  ): void {
    const stats = state.activePlayer === 1 ? this.stats.player1 : this.stats.player2;
    stats.cardsPlayed++;
    stats.energySpent += cost;

    if (details.damage) {
      stats.totalDamageDealt += details.damage;
      if (details.target === 'dragon') {
        stats.damageToOpponentDragon += details.damage;
      } else if (details.target === 'rider') {
        stats.damageToOpponentRider += details.damage;
      }
    }
    if (details.healing) {
      stats.healingDone += details.healing;
    }
    if (details.shieldsGained) {
      stats.shieldsGained += details.shieldsGained;
    }
    if (details.burnApplied) {
      stats.burnApplied += details.burnApplied;
    }
    if (details.freezeApplied) {
      stats.freezesApplied++;
    }

    this.logAction(
      state,
      'play_card',
      `Played ${cardName}`,
      {
        cardName,
        cardCost: cost,
        effects,
        morrikBonus: details.morrikBonus,
      },
      true
    );
  }

  logEndTurn(state: GameState, nextPlayer: PlayerNumber, nextTurn: number): void {
    this.logAction(state, 'end_turn', 'Passed', { nextPlayer, nextTurn });
  }

  logFreezeThaw(state: GameState, target: 'dragon' | 'rider'): void {
    this.logAction(state, 'freeze_thaw', `${target === 'dragon' ? 'Dragon' : 'Rider'} thawed and gained freeze immunity`);
  }

  logDiscard(state: GameState, cardName: string): void {
    this.logAction(state, 'discard', 'Discarded to hand limit', { discardedCard: cardName });
  }

  logGameEnd(state: GameState, winner: PlayerNumber, winType: WinType): void {
    this.logAction(
      state,
      'game_end',
      `Game ended - Player ${winner} wins by ${winType}`,
      { winner, winType },
      true
    );

    // Set result
    this.log.result = {
      winner,
      winType,
      totalTurns: state.turn,
      gameDurationMs: Date.now() - this.gameStartTime,
      finalState: {
        p1DragonHP: state.player1.dragon.hp,
        p1RiderHP: state.player1.rider.hp,
        p2DragonHP: state.player2.dragon.hp,
        p2RiderHP: state.player2.rider.hp,
      },
      stats: this.stats,
    };
  }

  // ===========================================================================
  // EXPORT
  // ===========================================================================

  getLog(): GameLog {
    return this.log;
  }

  getActions(): ActionEntry[] {
    return this.log.actions;
  }

  exportJSON(): string {
    return JSON.stringify(this.log, null, 2);
  }

  exportReadable(): string {
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════════════════');
    lines.push('                    DRAGON RIDERS GAME LOG');
    lines.push('═══════════════════════════════════════════════════════════════════');
    lines.push('');
    lines.push(`Game ID:    ${this.log.gameId}`);
    lines.push(`Date:       ${this.log.timestamp}`);
    lines.push(`Mode:       ${this.log.mode}${this.log.aiDifficulty ? ` (AI: ${this.log.aiDifficulty})` : ''}`);
    lines.push(`Version:    ${this.log.version}`);
    lines.push('');

    lines.push('─── SETUP ───────────────────────────────────────────────────────────');
    lines.push(`Player 1:   ${this.log.setup.player1.rider || '?'} + ${this.log.setup.player1.dragon || '?'}`);
    lines.push(`Player 2:   ${this.log.setup.player2.rider || '?'} + ${this.log.setup.player2.dragon || '?'}`);
    lines.push('');

    lines.push('─── GAME ACTIONS ────────────────────────────────────────────────────');

    let currentTurn = 0;
    for (const action of this.log.actions) {
      // Turn separator
      if (action.type === 'turn_start' && action.turn !== currentTurn) {
        currentTurn = action.turn;
        lines.push('');
        lines.push(`╔══ Turn ${action.turn} (Player ${action.player}) ══════════════════════════════════════╗`);
      }

      // Skip turn_start itself (we already printed it)
      if (action.type === 'turn_start') continue;

      // Format action
      const prefix = action.type === 'action_phase' ? '  ──' : '  •';
      let line = `${prefix} ${action.action}`;

      // Add key details
      if (action.details) {
        const d = action.details;
        if (d.damage !== undefined) line += ` (${d.damage} dmg)`;
        if (d.cardCost !== undefined) line += ` [${d.cardCost} energy]`;
        if (d.energyGained !== undefined) line += ` (+${d.energyGained} → ${d.energyTotal})`;
        if (d.burnDamage !== undefined) line += ` (${d.burnDamage} burn → ${d.hpAfter} HP)`;
        if (d.dragonAbility) line += ` [${d.dragonAbility}]`;
      }

      lines.push(line);
    }

    lines.push('');
    lines.push('─── RESULT ──────────────────────────────────────────────────────────');

    if (this.log.result) {
      const r = this.log.result;
      lines.push(`Winner:     Player ${r.winner} (${r.winType})`);
      lines.push(`Turns:      ${r.totalTurns}`);
      lines.push(`Duration:   ${Math.round(r.gameDurationMs / 1000)}s`);
      lines.push('');
      lines.push('Final HP:');
      lines.push(`  P1 Dragon: ${r.finalState.p1DragonHP}  |  P1 Rider: ${r.finalState.p1RiderHP}`);
      lines.push(`  P2 Dragon: ${r.finalState.p2DragonHP}  |  P2 Rider: ${r.finalState.p2RiderHP}`);
      lines.push('');

      lines.push('─── STATISTICS ──────────────────────────────────────────────────────');
      lines.push('');
      lines.push('                          Player 1    Player 2');
      lines.push(`  Total Damage:           ${String(r.stats.player1.totalDamageDealt).padStart(8)}    ${String(r.stats.player2.totalDamageDealt).padStart(8)}`);
      lines.push(`  → Dragon Damage:        ${String(r.stats.player1.damageToOpponentDragon).padStart(8)}    ${String(r.stats.player2.damageToOpponentDragon).padStart(8)}`);
      lines.push(`  → Rider Damage:         ${String(r.stats.player1.damageToOpponentRider).padStart(8)}    ${String(r.stats.player2.damageToOpponentRider).padStart(8)}`);
      lines.push(`  Attacks Made:           ${String(r.stats.player1.attacksMade).padStart(8)}    ${String(r.stats.player2.attacksMade).padStart(8)}`);
      lines.push(`  Cards Played:           ${String(r.stats.player1.cardsPlayed).padStart(8)}    ${String(r.stats.player2.cardsPlayed).padStart(8)}`);
      lines.push(`  Energy Generated:       ${String(r.stats.player1.energyGenerated).padStart(8)}    ${String(r.stats.player2.energyGenerated).padStart(8)}`);
      lines.push(`  Energy Spent:           ${String(r.stats.player1.energySpent).padStart(8)}    ${String(r.stats.player2.energySpent).padStart(8)}`);
      lines.push(`  Burns Applied:          ${String(r.stats.player1.burnApplied).padStart(8)}    ${String(r.stats.player2.burnApplied).padStart(8)}`);
      lines.push(`  Freezes Applied:        ${String(r.stats.player1.freezesApplied).padStart(8)}    ${String(r.stats.player2.freezesApplied).padStart(8)}`);
      lines.push(`  Healing Done:           ${String(r.stats.player1.healingDone).padStart(8)}    ${String(r.stats.player2.healingDone).padStart(8)}`);
      lines.push(`  Shields Gained:         ${String(r.stats.player1.shieldsGained).padStart(8)}    ${String(r.stats.player2.shieldsGained).padStart(8)}`);
    } else {
      lines.push('Game incomplete - no result recorded');
    }

    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  // ===========================================================================
  // AUTO-SAVE
  // ===========================================================================

  triggerDownload(format: 'json' | 'txt' = 'json'): void {
    const content = format === 'json' ? this.exportJSON() : this.exportReadable();
    const filename = `dragon-riders-${this.log.gameId}.${format}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let currentLogger: GameLogger | null = null;

export function initializeLogger(
  mode: 'local' | 'ai' | 'multiplayer',
  p1Rider: RiderName | null,
  p1Dragon: DragonName | null,
  p1Deck: Card[],
  p2Rider: RiderName | null,
  p2Dragon: DragonName | null,
  p2Deck: Card[],
  aiDifficulty?: AIDifficulty
): GameLogger {
  currentLogger = new GameLogger();
  currentLogger.initialize(mode, p1Rider, p1Dragon, p1Deck, p2Rider, p2Dragon, p2Deck, aiDifficulty);
  return currentLogger;
}

export function getLogger(): GameLogger | null {
  return currentLogger;
}

export function clearLogger(): void {
  currentLogger = null;
}
