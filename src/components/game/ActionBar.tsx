import Button from '../ui/Button';

interface ActionBarProps {
  canAttack: boolean;
  attackCost: number;
  onAttackDragon: () => void;
  onAttackRider: () => void;
  onEndTurn: () => void;
  onUndo?: () => void;
  canUndo: boolean;
  disabled?: boolean;
  selectedCard: boolean;
  onCancelCard: () => void;
}

export default function ActionBar({
  canAttack,
  attackCost,
  onAttackDragon,
  onAttackRider,
  onEndTurn,
  onUndo,
  canUndo,
  disabled = false,
  selectedCard,
  onCancelCard,
}: ActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4 bg-gray-800/50 rounded-xl">
      {selectedCard ? (
        <>
          <div className="text-yellow-400 font-medium">Select target for card</div>
          <Button onClick={onCancelCard} variant="secondary">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={onAttackDragon}
            disabled={!canAttack || disabled}
            variant="danger"
          >
            Attack Dragon ({attackCost})
          </Button>

          <Button
            onClick={onAttackRider}
            disabled={!canAttack || disabled}
            variant="danger"
          >
            Attack Rider ({attackCost})
          </Button>

          <div className="w-px h-8 bg-gray-600" />

          <Button onClick={onEndTurn} disabled={disabled} variant="secondary">
            End Turn
          </Button>

          {onUndo && (
            <Button onClick={onUndo} disabled={!canUndo || disabled} variant="secondary" size="sm">
              Undo
            </Button>
          )}
        </>
      )}
    </div>
  );
}
