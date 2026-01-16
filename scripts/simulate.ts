import { createInitialGameState } from '../src/engine/state.js';
import { executeStartPhase, executeEndPhase, passTurn } from '../src/engine/phases.js';
import { createCardPool } from '../src/data/cards.js';
import type { RiderName, DragonName, GameState, WinType } from '../src/data/types.js';
import { executeFullAITurn } from '../src/ai/ai.js';

interface SimulationResult {
  winner: 1 | 2;
  winType: WinType;
  turns: number;
  p1Setup: { rider: RiderName; dragon: DragonName };
  p2Setup: { rider: RiderName; dragon: DragonName };
  finalState: {
    p1DragonHP: number;
    p1RiderHP: number;
    p2DragonHP: number;
    p2RiderHP: number;
  };
}

const RIDERS: RiderName[] = ['Talia', 'Kael', 'Bronn', 'Lyra', 'Morrik'];
const DRAGONS: DragonName[] = ['Emberfang', 'Cryowyrm', 'Voltwing', 'Steelhorn', 'Voidmaw'];

function simulateGame(
  p1Rider: RiderName,
  p1Dragon: DragonName,
  p2Rider: RiderName,
  p2Dragon: DragonName,
  maxTurns: number = 50
): SimulationResult {
  // Create decks
  const cardPool = createCardPool();
  const p1Deck = cardPool.slice(0, 20);
  const p2Deck = cardPool.slice(20, 40);

  // Initialize game
  let state = createInitialGameState(p1Rider, p1Dragon, p2Rider, p2Dragon, p1Deck, p2Deck);

  // Run game loop
  while (state.turn <= maxTurns && !state.winner) {
    // Start turn phase
    executeStartPhase(state);
    if (state.winner) break;

    // Action phase - AI takes actions
    state.turnPhase = 'action';
    executeFullAITurn(state, state.activePlayer, 'medium');
    if (state.winner) break;

    // End turn phase
    executeEndPhase(state);
    if (state.winner) break;
  }

  // Game ended (or hit max turns)
  if (!state.winner) {
    // Determine winner by total HP remaining
    const p1Total = state.player1.dragon.hp + state.player1.rider.hp;
    const p2Total = state.player2.dragon.hp + state.player2.rider.hp;
    state.winner = p1Total > p2Total ? 1 : 2;
    state.winType = 'dragon_kill'; // Default
  }

  return {
    winner: state.winner!,
    winType: state.winType!,
    turns: state.turn,
    p1Setup: { rider: p1Rider, dragon: p1Dragon },
    p2Setup: { rider: p2Rider, dragon: p2Dragon },
    finalState: {
      p1DragonHP: state.player1.dragon.hp,
      p1RiderHP: state.player1.rider.hp,
      p2DragonHP: state.player2.dragon.hp,
      p2RiderHP: state.player2.rider.hp,
    },
  };
}

interface AggregateStats {
  totalGames: number;
  avgGameLength: number;
  dragonKillPct: number;
  riderKillPct: number;
  riderWinRates: Record<RiderName, { wins: number; games: number; winRate: number }>;
  dragonWinRates: Record<DragonName, { wins: number; games: number; winRate: number }>;
  gameLengthDistribution: Record<string, number>;
}

function runSimulations(gamesPerMatchup: number): AggregateStats {
  const results: SimulationResult[] = [];
  const riderStats: Record<RiderName, { wins: number; games: number }> = {} as any;
  const dragonStats: Record<DragonName, { wins: number; games: number }> = {} as any;

  // Initialize stats
  RIDERS.forEach(r => riderStats[r] = { wins: 0, games: 0 });
  DRAGONS.forEach(d => dragonStats[d] = { wins: 0, games: 0 });

  let totalGames = 0;
  let dragonKills = 0;
  let riderKills = 0;
  let totalTurns = 0;
  const lengthDistribution: Record<string, number> = {};

  console.log('Starting simulations...');

  // Run all rider vs rider matchups (same dragon)
  for (const dragon of DRAGONS) {
    for (let i = 0; i < RIDERS.length; i++) {
      for (let j = 0; j < RIDERS.length; j++) {
        const p1Rider = RIDERS[i];
        const p2Rider = RIDERS[j];

        for (let game = 0; game < gamesPerMatchup; game++) {
          const result = simulateGame(p1Rider, dragon, p2Rider, dragon);
          results.push(result);

          // Update stats
          totalGames++;
          totalTurns += result.turns;

          if (result.winType === 'dragon_kill') dragonKills++;
          if (result.winType === 'rider_kill') riderKills++;

          // Rider stats
          const winnerRider = result.winner === 1 ? p1Rider : p2Rider;
          riderStats[p1Rider].games++;
          riderStats[p2Rider].games++;
          riderStats[winnerRider].wins++;

          // Dragon stats (both players have same dragon, so both get credit for games)
          dragonStats[dragon].games += 2;
          dragonStats[dragon].wins += 1; // One dragon always wins

          // Length distribution
          const lengthBucket = Math.floor(result.turns / 2) * 2; // Bucket by 2s
          const key = `${lengthBucket}-${lengthBucket + 1}`;
          lengthDistribution[key] = (lengthDistribution[key] || 0) + 1;

          if (totalGames % 100 === 0) {
            console.log(`Completed ${totalGames} games...`);
          }
        }
      }
    }
  }

  // Run dragon vs dragon matchups (same rider)
  for (const rider of RIDERS) {
    for (let i = 0; i < DRAGONS.length; i++) {
      for (let j = 0; j < DRAGONS.length; j++) {
        if (i === j) continue; // Skip mirror matches

        const p1Dragon = DRAGONS[i];
        const p2Dragon = DRAGONS[j];

        for (let game = 0; game < gamesPerMatchup; game++) {
          const result = simulateGame(rider, p1Dragon, rider, p2Dragon);
          results.push(result);

          totalGames++;
          totalTurns += result.turns;

          if (result.winType === 'dragon_kill') dragonKills++;
          if (result.winType === 'rider_kill') riderKills++;

          // Dragon stats
          const winnerDragon = result.winner === 1 ? p1Dragon : p2Dragon;
          dragonStats[p1Dragon].games++;
          dragonStats[p2Dragon].games++;
          dragonStats[winnerDragon].wins++;

          // Rider stats (both have same rider, so both get credit)
          riderStats[rider].games += 2;
          riderStats[rider].wins += 1;

          const lengthBucket = Math.floor(result.turns / 2) * 2;
          const key = `${lengthBucket}-${lengthBucket + 1}`;
          lengthDistribution[key] = (lengthDistribution[key] || 0) + 1;

          if (totalGames % 100 === 0) {
            console.log(`Completed ${totalGames} games...`);
          }
        }
      }
    }
  }

  console.log(`\nCompleted all ${totalGames} games!\n`);

  // Calculate final stats
  const riderWinRates: Record<RiderName, any> = {} as any;
  RIDERS.forEach(r => {
    riderWinRates[r] = {
      wins: riderStats[r].wins,
      games: riderStats[r].games,
      winRate: (riderStats[r].wins / riderStats[r].games) * 100,
    };
  });

  const dragonWinRates: Record<DragonName, any> = {} as any;
  DRAGONS.forEach(d => {
    dragonWinRates[d] = {
      wins: dragonStats[d].wins,
      games: dragonStats[d].games,
      winRate: (dragonStats[d].wins / dragonStats[d].games) * 100,
    };
  });

  return {
    totalGames,
    avgGameLength: totalTurns / totalGames,
    dragonKillPct: (dragonKills / totalGames) * 100,
    riderKillPct: (riderKills / totalGames) * 100,
    riderWinRates,
    dragonWinRates,
    gameLengthDistribution: lengthDistribution,
  };
}

function printResults(stats: AggregateStats) {
  console.log('='.repeat(80));
  console.log('DRAGON RIDERS v0.12 - SIMULATION RESULTS');
  console.log('='.repeat(80));
  console.log();

  console.log('OVERALL METRICS');
  console.log('-'.repeat(80));
  console.log(`Total Games:          ${stats.totalGames}`);
  console.log(`Average Game Length:  ${stats.avgGameLength.toFixed(1)} turns`);
  console.log(`Dragon Kill %:        ${stats.dragonKillPct.toFixed(1)}%`);
  console.log(`Rider Kill %:         ${stats.riderKillPct.toFixed(1)}%`);
  console.log();

  console.log('RIDER WIN RATES');
  console.log('-'.repeat(80));
  const ridersSorted = Object.entries(stats.riderWinRates)
    .sort(([, a], [, b]) => b.winRate - a.winRate);
  ridersSorted.forEach(([name, data]) => {
    console.log(`${name.padEnd(10)} ${data.winRate.toFixed(1)}% (${data.wins}/${data.games})`);
  });
  console.log();

  console.log('DRAGON WIN RATES');
  console.log('-'.repeat(80));
  const dragonsSorted = Object.entries(stats.dragonWinRates)
    .sort(([, a], [, b]) => b.winRate - a.winRate);
  dragonsSorted.forEach(([name, data]) => {
    console.log(`${name.padEnd(12)} ${data.winRate.toFixed(1)}% (${data.wins}/${data.games})`);
  });
  console.log();

  console.log('GAME LENGTH DISTRIBUTION');
  console.log('-'.repeat(80));
  const lengthsSorted = Object.entries(stats.gameLengthDistribution)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));
  lengthsSorted.forEach(([range, count]) => {
    const pct = (count / stats.totalGames) * 100;
    console.log(`${range.padEnd(8)} turns: ${pct.toFixed(1)}% (${count} games)`);
  });
  console.log();

  console.log('COMPARISON TO BASELINE (v0.8)');
  console.log('-'.repeat(80));
  console.log(`Game Length:    ${stats.avgGameLength.toFixed(1)} vs 5.9 turns (${stats.avgGameLength > 5.9 ? '+' : ''}${(stats.avgGameLength - 5.9).toFixed(1)})`);
  console.log(`Dragon Kill %:  ${stats.dragonKillPct.toFixed(1)}% vs 68% (${stats.dragonKillPct > 68 ? '+' : ''}${(stats.dragonKillPct - 68).toFixed(1)}%)`);
  console.log(`Rider Kill %:   ${stats.riderKillPct.toFixed(1)}% vs 32% (${stats.riderKillPct > 32 ? '+' : ''}${(stats.riderKillPct - 32).toFixed(1)}%)`);
  console.log();

  // Compare top riders
  console.log('Top Rider Change:');
  const topRider = ridersSorted[0];
  console.log(`  v0.12: ${topRider[0]} at ${topRider[1].winRate.toFixed(1)}%`);
  console.log(`  v0.8:  Bronn at 62%`);
  console.log();

  // Compare top dragons
  console.log('Top Dragon Change:');
  const topDragon = dragonsSorted[0];
  console.log(`  v0.12: ${topDragon[0]} at ${topDragon[1].winRate.toFixed(1)}%`);
  console.log(`  v0.8:  Cryowyrm at 67%`);
  console.log();

  console.log('='.repeat(80));
}

// Run simulation
const GAMES_PER_MATCHUP = 10; // Increase for more accuracy
console.log(`Running ${GAMES_PER_MATCHUP} games per matchup...`);
console.log();

const stats = runSimulations(GAMES_PER_MATCHUP);
printResults(stats);
