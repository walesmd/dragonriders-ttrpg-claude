import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSetupStore } from '../../store/setupStore';
import { executeAIAction } from '../../ai/ai';
import { getAIConfig } from '../../ai/presets';
import { passTurn } from '../../engine/phases';
import GameBoard from '../game/GameBoard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function GameScreen() {
  const state = useGameStore((s) => s.state);
  const initializeGame = useGameStore((s) => s.initializeGame);
  const gameMode = useSetupStore((s) => s.gameMode);
  const aiDifficulty = useSetupStore((s) => s.aiDifficulty);
  const [showTurnTransition, setShowTurnTransition] = useState(false);
  const [lastPlayer, setLastPlayer] = useState<1 | 2 | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    if (!state) {
      initializeGame();
    }
  }, [state, initializeGame]);

  // Handle turn transitions for local mode
  useEffect(() => {
    if (state && gameMode === 'local') {
      if (lastPlayer !== null && lastPlayer !== state.activePlayer) {
        setShowTurnTransition(true);
      }
      setLastPlayer(state.activePlayer);
    }
  }, [state?.activePlayer, state?.turn, gameMode, lastPlayer]);

  // Handle AI turns
  const executeAITurn = useCallback(async () => {
    if (!state || state.phase === 'ended' || state.activePlayer !== 2) return;

    setAiThinking(true);

    const config = getAIConfig(aiDifficulty, state.player2.dragon.name);
    let actionCount = 0;
    const maxActions = 20;

    // Execute actions with delays
    const takeAction = async () => {
      if (state.winner || actionCount >= maxActions) {
        // End AI turn
        if (!state.winner) {
          passTurn(state);
          useGameStore.setState({ state: { ...state } });
        }
        setAiThinking(false);
        return;
      }

      const result = executeAIAction(state, 2, config);
      useGameStore.setState({ state: { ...state } });

      if (result.finished) {
        // End AI turn
        if (!state.winner) {
          passTurn(state);
          useGameStore.setState({ state: { ...state } });
        }
        setAiThinking(false);
        return;
      }

      actionCount++;

      // Delay between actions for visibility
      setTimeout(takeAction, 500);
    };

    // Start after initial delay
    setTimeout(takeAction, 800);
  }, [state, aiDifficulty]);

  // Trigger AI turn when it's AI's turn
  useEffect(() => {
    if (
      state &&
      gameMode === 'ai' &&
      state.activePlayer === 2 &&
      !state.winner &&
      !aiThinking
    ) {
      executeAITurn();
    }
  }, [state?.activePlayer, state?.turn, gameMode, state?.winner, aiThinking, executeAITurn]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GameBoard />

      {/* AI thinking indicator */}
      {aiThinking && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-6 py-3 rounded-full shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full" />
            <span className="text-yellow-400 font-medium">AI is thinking...</span>
          </div>
        </div>
      )}

      {/* Turn transition modal for local mode */}
      <Modal
        isOpen={showTurnTransition}
        onClose={() => setShowTurnTransition(false)}
        title="Turn Transition"
      >
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Pass the device to</p>
          <p className="text-3xl font-bold text-white mb-8">
            Player {state.activePlayer}
          </p>
          <Button onClick={() => setShowTurnTransition(false)} variant="primary" size="lg">
            Ready
          </Button>
        </div>
      </Modal>
    </div>
  );
}
