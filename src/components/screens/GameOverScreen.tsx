import { useGameStore } from '../../store/gameStore';
import { useSetupStore } from '../../store/setupStore';
import { getLogger } from '../../logging';
import Button from '../ui/Button';

export default function GameOverScreen() {
  const state = useGameStore((s) => s.state);
  const resetGame = useGameStore((s) => s.reset);
  const resetSetup = useSetupStore((s) => s.reset);

  if (!state || !state.winner) {
    return null;
  }

  const winnerPlayer = state.winner === 1 ? state.player1 : state.player2;
  const loserPlayer = state.winner === 1 ? state.player2 : state.player1;

  const handlePlayAgain = () => {
    resetGame();
    resetSetup();
  };

  const handleExportLog = () => {
    const logger = getLogger();
    if (logger) {
      logger.triggerDownload('json');
    } else {
      // Fallback if logger not available (shouldn't happen normally)
      console.warn('Logger not available, using fallback export');
      const setup = useSetupStore.getState();

      const fullLog = {
        gameId: state.gameId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        mode: setup.gameMode,
        aiDifficulty: setup.aiDifficulty,
        setup: {
          player1: {
            rider: setup.player1Rider,
            dragon: setup.player1Dragon,
            deck: setup.player1Deck.map((c) => c.name),
          },
          player2: {
            rider: setup.player2Rider,
            dragon: setup.player2Dragon,
            deck: setup.player2Deck.map((c) => c.name),
          },
        },
        result: {
          winner: state.winner,
          winType: state.winType,
          totalTurns: state.turn,
          finalState: {
            p1DragonHP: state.player1.dragon.hp,
            p1RiderHP: state.player1.rider.hp,
            p2DragonHP: state.player2.dragon.hp,
            p2RiderHP: state.player2.rider.hp,
          },
        },
        actions: state.actionLog,
      };

      const log = JSON.stringify(fullLog, null, 2);
      const blob = new Blob([log], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dragon-riders-${state.gameId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportReadable = () => {
    const logger = getLogger();
    if (logger) {
      logger.triggerDownload('txt');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Victory announcement */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Game Over!
        </h1>
        <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          Player {state.winner} Wins!
        </p>
        <p className="text-gray-400">
          Victory by {state.winType === 'dragon_kill' ? 'Dragon Kill' : 'Rider Kill'}
        </p>
      </div>

      {/* Match summary */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 min-w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Match Summary</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Winner */}
          <div className="text-center">
            <div className="text-yellow-400 font-bold mb-2">Winner</div>
            <div className="text-white font-bold">{winnerPlayer.rider.name}</div>
            <div className="text-gray-400">+ {winnerPlayer.dragon.name}</div>
            <div className="mt-2 text-sm text-gray-500">
              Dragon: {winnerPlayer.dragon.hp} HP
            </div>
            <div className="text-sm text-gray-500">
              Rider: {winnerPlayer.rider.hp} HP
            </div>
          </div>

          {/* Loser */}
          <div className="text-center">
            <div className="text-gray-400 font-bold mb-2">Defeated</div>
            <div className="text-white font-bold">{loserPlayer.rider.name}</div>
            <div className="text-gray-400">+ {loserPlayer.dragon.name}</div>
            <div className="mt-2 text-sm text-gray-500">
              Dragon: {loserPlayer.dragon.hp} HP
            </div>
            <div className="text-sm text-gray-500">
              Rider: {loserPlayer.rider.hp} HP
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <span className="text-gray-400">Total Turns: </span>
          <span className="text-white font-bold">{state.turn}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handlePlayAgain} variant="primary" size="lg">
          Play Again
        </Button>
        <Button onClick={handleExportLog} variant="secondary" size="lg">
          Export JSON
        </Button>
        <Button onClick={handleExportReadable} variant="secondary" size="lg">
          Export Summary
        </Button>
      </div>
    </div>
  );
}
