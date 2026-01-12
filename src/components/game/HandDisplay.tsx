import type { Card } from '../../data/types';
import CardComponent from './CardComponent';

interface HandDisplayProps {
  cards: Card[];
  selectedCard: Card | null;
  onSelectCard: (card: Card | null) => void;
  canPlayCard: (card: Card) => boolean;
  getCardCost: (card: Card) => number;
  disabled?: boolean;
}

export default function HandDisplay({
  cards,
  selectedCard,
  onSelectCard,
  canPlayCard,
  getCardCost,
  disabled = false,
}: HandDisplayProps) {
  const handleCardClick = (card: Card) => {
    if (disabled) return;

    if (selectedCard?.id === card.id) {
      onSelectCard(null);
    } else if (canPlayCard(card)) {
      onSelectCard(card);
    }
  };

  return (
    <div className="flex justify-center items-end gap-2 py-4 px-8">
      {cards.length === 0 ? (
        <div className="text-gray-500 italic">No cards in hand</div>
      ) : (
        cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              transform: `rotate(${(index - (cards.length - 1) / 2) * 3}deg)`,
              zIndex: selectedCard?.id === card.id ? 10 : index,
            }}
          >
            <CardComponent
              card={card}
              selected={selectedCard?.id === card.id}
              playable={canPlayCard(card) && !disabled}
              cost={getCardCost(card)}
              onClick={() => handleCardClick(card)}
            />
          </div>
        ))
      )}
    </div>
  );
}
