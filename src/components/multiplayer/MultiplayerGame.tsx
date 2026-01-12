import { useEffect, useRef, useCallback } from 'react';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { useGameStore } from '../../store/gameStore';
import { createCardPool } from '../../data/cards';
import { createInitialGameState } from '../../engine/state';
import { executeStartPhase, passTurn } from '../../engine/phases';
import { executeAttack } from '../../engine/combat';
import { executeCard } from '../../engine/cards';
import { applyWinCondition } from '../../engine/winConditions';
import GameBoard from '../game/GameBoard';
import type { Card, RiderName, DragonName, TargetType, GameState } from '../../data/types';

export default function MultiplayerGame() {
  const {
    playerNumber,
    roomState,
    isHost,
    updateGameState,
    endGame: endMultiplayerGame,
  } = useMultiplayerStore();

  const gameState = useGameStore((s) => s.state);
  const setGameState = useGameStore.setState;

  const cardPoolRef = useRef<Card[]>([]);
  const initializedRef = useRef(false);

  // Initialize card pool
  useEffect(() => {
    if (cardPoolRef.current.length === 0) {
      cardPoolRef.current = createCardPool();
    }
  }, []);

  // Get card by ID
  const getCardById = useCallback((id: string): Card | undefined => {
    return cardPoolRef.current.find(c => c.id === id);
  }, []);

  // Initialize game state (host only)
  useEffect(() => {
    if (!isHost || !roomState || roomState.phase !== 'playing' || initializedRef.current) return;

    const p1 = roomState.players[0];
    const p2 = roomState.players[1];

    if (!p1 || !p2) return;

    // Build decks from card IDs
    const p1Deck = p1.deck.map(id => getCardById(id)).filter((c): c is Card => c !== undefined);
    const p2Deck = p2.deck.map(id => getCardById(id)).filter((c): c is Card => c !== undefined);

    // Create game state
    const state = createInitialGameState(
      p1.rider as RiderName,
      p1.dragon as DragonName,
      p2.rider as RiderName,
      p2.dragon as DragonName,
      p1Deck,
      p2Deck
    );

    // Execute first start phase
    executeStartPhase(state);

    // Set local state
    setGameState({ state, history: [], selectedCard: null });

    // Sync to server
    updateGameState(state);

    initializedRef.current = true;
  }, [isHost, roomState, getCardById, setGameState, updateGameState]);

  // Non-host: sync state from server
  useEffect(() => {
    if (isHost || !roomState?.gameState) return;

    setGameState({
      state: roomState.gameState as GameState,
      history: [],
      selectedCard: null,
    });
  }, [isHost, roomState?.gameState, setGameState]);

  // Listen for game actions from other player
  useEffect(() => {
    const handleGameAction = (event: CustomEvent) => {
      const { senderId, action, cardId, target } = event.detail;

      // Only host processes actions
      if (!isHost) return;

      // Get current state
      const currentState = useGameStore.getState().state;
      if (!currentState) return;

      // Determine which player sent the action
      const senderPlayerIndex = roomState?.players.findIndex(p => p?.id === senderId);
      if (senderPlayerIndex === undefined || senderPlayerIndex === -1) return;

      const playerNum = (senderPlayerIndex + 1) as 1 | 2;

      // Verify it's this player's turn
      if (currentState.activePlayer !== playerNum) return;

      // Execute the action
      let success = false;

      switch (action) {
        case 'attack_dragon':
          const attackDragonResult = executeAttack(currentState, playerNum, 'dragon');
          success = attackDragonResult.success;
          if (success) {
            currentState.actionLog.push({
              turn: currentState.turn,
              player: playerNum,
              action: 'Attacked dragon',
              details: {
                damage: attackDragonResult.damage?.finalDamage,
                kaelBonus: attackDragonResult.kaelBonus,
                dragonAbility: attackDragonResult.dragonAbility,
              },
              timestamp: Date.now(),
            });
          }
          break;

        case 'attack_rider':
          const attackRiderResult = executeAttack(currentState, playerNum, 'rider');
          success = attackRiderResult.success;
          if (success) {
            currentState.actionLog.push({
              turn: currentState.turn,
              player: playerNum,
              action: 'Attacked rider',
              details: {
                damage: attackRiderResult.damage?.finalDamage,
                kaelBonus: attackRiderResult.kaelBonus,
                dragonAbility: attackRiderResult.dragonAbility,
              },
              timestamp: Date.now(),
            });
          }
          break;

        case 'play_card':
          if (cardId) {
            const cardResult = executeCard(currentState, playerNum, cardId, target as TargetType | undefined);
            success = cardResult.success;
            if (success) {
              currentState.actionLog.push({
                turn: currentState.turn,
                player: playerNum,
                action: `Played ${cardResult.cardName}`,
                details: {
                  cost: cardResult.energySpent,
                  morrikBonus: cardResult.morrikBonus,
                  effects: cardResult.effects,
                },
                timestamp: Date.now(),
              });
            }
          }
          break;

        case 'end_turn':
          passTurn(currentState);
          success = true;
          break;
      }

      if (success) {
        // Check win condition
        applyWinCondition(currentState);

        // Update local state
        setGameState({ state: { ...currentState } });

        // Sync to server
        if (currentState.winner) {
          endMultiplayerGame(currentState);
        } else {
          updateGameState(currentState);
        }
      }
    };

    window.addEventListener('multiplayer_game_action', handleGameAction as EventListener);
    return () => {
      window.removeEventListener('multiplayer_game_action', handleGameAction as EventListener);
    };
  }, [isHost, roomState, setGameState, updateGameState, endMultiplayerGame]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Initializing game...</div>
      </div>
    );
  }

  // Determine if it's this player's turn
  const isMyTurn = gameState.activePlayer === playerNumber;

  return (
    <div className="relative">
      {/* Turn indicator overlay */}
      {!isMyTurn && !gameState.winner && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-gray-900/80 px-8 py-4 rounded-xl">
            <span className="text-xl text-yellow-400">
              Waiting for opponent&apos;s turn...
            </span>
          </div>
        </div>
      )}

      <GameBoard
        multiplayerMode={true}
        isMyTurn={isMyTurn}
        playerNumber={playerNumber || 1}
      />
    </div>
  );
}
