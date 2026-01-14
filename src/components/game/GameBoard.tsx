import { useGameStore } from '../../store/gameStore';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { needsTarget } from '../../engine/validation';
import PlayerArea from './PlayerArea';
import HandDisplay from './HandDisplay';
import ActionBar from './ActionBar';
import GameLog from './GameLog';
import HelpPanel from '../ui/HelpPanel';

interface GameBoardProps {
  multiplayerMode?: boolean;
  isMyTurn?: boolean;
  playerNumber?: 1 | 2;
}

export default function GameBoard({
  multiplayerMode = false,
  isMyTurn = true,
  playerNumber = 1,
}: GameBoardProps) {
  const state = useGameStore((s) => s.state);
  const selectedCard = useGameStore((s) => s.selectedCard);
  const history = useGameStore((s) => s.history);

  const attack = useGameStore((s) => s.attack);
  const playCard = useGameStore((s) => s.playCard);
  const endTurn = useGameStore((s) => s.endTurn);
  const selectCard = useGameStore((s) => s.selectCard);
  const undo = useGameStore((s) => s.undo);
  const canPlayerAttack = useGameStore((s) => s.canPlayerAttack);
  const canPlayerPlayCard = useGameStore((s) => s.canPlayerPlayCard);
  const getAttackCost = useGameStore((s) => s.getAttackCost);
  const getCardCostFn = useGameStore((s) => s.getCardCost);

  const sendGameAction = useMultiplayerStore((s) => s.sendGameAction);

  if (!state) {
    return <div className="text-white">Loading game...</div>;
  }

  // In multiplayer, always show from this player's perspective
  // In local mode, show from active player's perspective
  const viewingPlayer = multiplayerMode ? playerNumber : state.activePlayer;
  const currentPlayer = viewingPlayer === 1 ? state.player1 : state.player2;
  const opponentPlayer = viewingPlayer === 1 ? state.player2 : state.player1;
  const opponentNumber = viewingPlayer === 1 ? 2 : 1;

  // In multiplayer, can only act on your turn
  const canAct = multiplayerMode ? isMyTurn : true;

  const handleTargetDragon = () => {
    if (!canAct) return;

    if (selectedCard) {
      if (multiplayerMode) {
        sendGameAction('play_card', selectedCard.id, 'dragon');
      } else {
        playCard(selectedCard.id, 'dragon');
      }
      selectCard(null);
    } else {
      if (multiplayerMode) {
        sendGameAction('attack_dragon');
      } else {
        attack('dragon');
      }
    }
  };

  const handleTargetRider = () => {
    if (!canAct) return;

    if (selectedCard) {
      if (multiplayerMode) {
        sendGameAction('play_card', selectedCard.id, 'rider');
      } else {
        playCard(selectedCard.id, 'rider');
      }
      selectCard(null);
    } else {
      if (multiplayerMode) {
        sendGameAction('attack_rider');
      } else {
        attack('rider');
      }
    }
  };

  const handleEndTurn = () => {
    if (!canAct) return;

    if (multiplayerMode) {
      sendGameAction('end_turn');
    } else {
      endTurn();
    }
  };

  const handlePlayCard = (cardId: string, target?: 'dragon' | 'rider') => {
    if (!canAct) return;

    if (multiplayerMode) {
      sendGameAction('play_card', cardId, target);
    } else {
      playCard(cardId, target);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 p-4 gap-4">
      {/* Main game area */}
      <div className="flex-grow flex flex-col gap-4">
        {/* Opponent area (top) */}
        <PlayerArea
          player={opponentPlayer}
          playerNumber={opponentNumber}
          isActive={state.activePlayer === opponentNumber}
          isOpponent={true}
          selectedCard={selectedCard}
          onTargetDragon={canAct ? handleTargetDragon : undefined}
          onTargetRider={canAct ? handleTargetRider : undefined}
        />

        {/* Center - Action bar */}
        <ActionBar
          canAttackDragon={canAct && canPlayerAttack('dragon')}
          canAttackRider={canAct && canPlayerAttack('rider')}
          attackCostDragon={getAttackCost('dragon')}
          attackCostRider={getAttackCost('rider')}
          onAttackDragon={handleTargetDragon}
          onAttackRider={handleTargetRider}
          onEndTurn={handleEndTurn}
          onUndo={multiplayerMode ? undefined : undo}
          canUndo={!multiplayerMode && history.length > 0}
          selectedCard={selectedCard !== null}
          onCancelCard={() => selectCard(null)}
          disabled={!canAct}
        />

        {/* Active player area (bottom) */}
        <PlayerArea
          player={currentPlayer}
          playerNumber={viewingPlayer}
          isActive={state.activePlayer === viewingPlayer}
          isOpponent={false}
          selectedCard={selectedCard}
        />

        {/* Hand */}
        <div className="bg-gray-800/50 rounded-xl">
          <HandDisplay
            cards={currentPlayer.hand}
            selectedCard={selectedCard}
            onSelectCard={(card) => {
              if (!canAct) return;
              if (card) {
                if (needsTarget(card)) {
                  selectCard(card);
                } else {
                  handlePlayCard(card.id);
                }
              } else {
                selectCard(null);
              }
            }}
            canPlayCard={(card) => canAct && canPlayerPlayCard(card)}
            getCardCost={getCardCostFn}
          />
        </div>
      </div>

      {/* Game log (right side) */}
      <div className="w-64">
        <GameLog entries={state.actionLog} currentTurn={state.turn} />
      </div>

      {/* Floating help panel */}
      <HelpPanel title="Gameplay Guide" variant="floating">
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-white mb-1">Your Turn</h4>
            <p className="text-xs">1. Draw card & gain energy</p>
            <p className="text-xs">2. Attack or play cards</p>
            <p className="text-xs">3. Click "End Turn"</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Attacking</h4>
            <p className="text-xs">• Click dragon/rider portraits to attack</p>
            <p className="text-xs">• Default cost: 2 energy, 3 damage</p>
            <p className="text-xs">• Can't attack if frozen</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Playing Cards</h4>
            <p className="text-xs">• Click card in hand to select</p>
            <p className="text-xs">• Target cards: click enemy dragon/rider</p>
            <p className="text-xs">• Self cards: auto-cast</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Status Effects</h4>
            <p className="text-xs">• 🧊 <strong>Frozen:</strong> Can't attack, play 1 card max</p>
            <p className="text-xs">• 🔥 <strong>Burn:</strong> Damage each turn start</p>
            <p className="text-xs">• 🛡️ <strong>Shields:</strong> Block damage before HP</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Win Condition</h4>
            <p className="text-xs">Reduce enemy Dragon OR Rider HP to 0</p>
          </div>
        </div>
      </HelpPanel>
    </div>
  );
}
