import type { PlayerState, Card } from '../../data/types';
import RiderCard from './RiderCard';
import DragonCard from './DragonCard';
import EnergyDisplay from './EnergyDisplay';

interface PlayerAreaProps {
  player: PlayerState;
  playerNumber: 1 | 2;
  isActive: boolean;
  isOpponent?: boolean;
  selectedCard: Card | null;
  onTargetDragon?: () => void;
  onTargetRider?: () => void;
}

export default function PlayerArea({
  player,
  playerNumber,
  isActive,
  isOpponent = false,
  selectedCard,
  onTargetDragon,
  onTargetRider,
}: PlayerAreaProps) {
  const needsTarget = selectedCard && (selectedCard.target === 'dragon' || selectedCard.target === 'rider');

  return (
    <div className={`flex items-center gap-6 p-4 rounded-xl ${isActive ? 'bg-gray-800/50' : 'bg-gray-900/30'}`}>
      {/* Player indicator */}
      <div className="flex flex-col items-center gap-2">
        <div className={`text-sm font-bold ${isActive ? 'text-yellow-400' : 'text-gray-500'}`}>
          Player {playerNumber}
        </div>
        {isActive && (
          <div className="text-xs text-yellow-400 animate-pulse">Active</div>
        )}
        <EnergyDisplay energy={player.energy} />
        <div className="text-xs text-gray-500 mt-2">
          Deck: {player.deck.length}
        </div>
      </div>

      {/* Rider */}
      <div
        onClick={needsTarget && selectedCard?.target === 'rider' && isOpponent ? onTargetRider : undefined}
        className={needsTarget && selectedCard?.target === 'rider' && isOpponent ? 'cursor-pointer' : ''}
      >
        <RiderCard
          rider={player.rider}
          frozen={player.riderFrozen}
          burn={player.riderBurn}
          isOpponent={isOpponent}
        />
      </div>

      {/* Dragon */}
      <DragonCard
        dragon={player.dragon}
        frozen={player.dragonFrozen}
        burn={player.dragonBurn}
        isOpponent={isOpponent}
        onClick={needsTarget && selectedCard?.target === 'dragon' && isOpponent ? onTargetDragon : undefined}
        highlighted={!!(needsTarget && selectedCard?.target === 'dragon' && isOpponent)}
      />
    </div>
  );
}
