import type { Card } from '../../data/types';
import { getAssetPath } from '../../utils/assets';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  playable?: boolean;
  cost?: number; // Effective cost (may differ from base)
  size?: 'small' | 'medium' | 'large';
}

const EFFECT_COLORS: Record<string, string> = {
  damage: 'border-red-500 bg-red-900/30',
  burn: 'border-orange-500 bg-orange-900/30',
  freeze: 'border-cyan-500 bg-cyan-900/30',
  shield: 'border-blue-500 bg-blue-900/30',
  heal: 'border-green-500 bg-green-900/30',
  energy: 'border-yellow-500 bg-yellow-900/30',
  drain: 'border-purple-500 bg-purple-900/30',
  discard: 'border-pink-500 bg-pink-900/30',
  chain: 'border-red-400 bg-red-900/30',
  dual: 'border-red-400 bg-red-900/30',
  cripple: 'border-red-600 bg-red-900/30',
  thaw: 'border-teal-500 bg-teal-900/30',
  firebreak: 'border-orange-400 bg-orange-900/30',
  strip: 'border-gray-500 bg-gray-900/30',
  energy_shield: 'border-indigo-500 bg-indigo-900/30',
};

export default function CardComponent({
  card,
  onClick,
  selected = false,
  playable = true,
  cost,
  size = 'large',
}: CardComponentProps) {
  const effectColor = EFFECT_COLORS[card.effectType] || 'border-gray-500 bg-gray-900/30';
  const displayCost = cost ?? card.cost;

  // Small: name + cost only (for hand display in compact mode)
  if (size === 'small') {
    return (
      <div
        onClick={onClick}
        className={`
          rounded-lg p-2 border-2 ${effectColor}
          ${onClick ? 'cursor-pointer' : ''}
          ${selected ? 'ring-2 ring-yellow-400' : ''}
          ${!playable ? 'opacity-50' : ''}
          transition-all duration-200
          hover:scale-105
        `}
      >
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{card.name}</span>
          <span className="bg-yellow-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {displayCost}
          </span>
        </div>
      </div>
    );
  }

  // Medium: compact but shows all info (for draft screen)
  if (size === 'medium') {
    return (
      <div
        onClick={onClick}
        className={`
          rounded-lg p-2.5 border-2 ${effectColor}
          w-40 h-32 flex flex-col
          ${onClick ? 'cursor-pointer hover:scale-105' : ''}
          ${selected ? 'ring-2 ring-yellow-400' : ''}
          ${!playable ? 'opacity-50' : ''}
          transition-all duration-200
        `}
      >
        {/* Image */}
        <div className="mb-1 h-10 rounded-md overflow-hidden bg-black/20">
          <img
            src={getAssetPath(card.imagePath)}
            alt={card.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Header: Name + Cost */}
        <div className="flex justify-between items-start gap-1 mb-1">
          <h4 className="text-sm font-bold text-white leading-tight">{card.name}</h4>
          <span className="bg-yellow-600 text-white text-xs font-bold px-1.5 py-0.5 rounded shrink-0">
            {displayCost}
          </span>
        </div>

        {/* Effect type */}
        <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
          {card.effectType.replace('_', ' ')}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 flex-grow leading-snug line-clamp-3">
          {card.description}
        </p>

        {/* Target */}
        <div className="mt-auto pt-1">
          <span className="text-xs text-gray-500">
            Target: {card.target}
          </span>
        </div>
      </div>
    );
  }

  // Large: full card (for hand display)
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl p-3 border-2 ${effectColor}
        w-36 h-48 flex flex-col
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${selected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 -translate-y-4' : ''}
        ${!playable ? 'opacity-50 grayscale' : ''}
        transition-all duration-200
      `}
    >
      {/* Cost */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold">{displayCost}</span>
      </div>

      {/* Name */}
      <div className="mt-2 mb-2">
        <h4 className="text-sm font-bold text-white leading-tight">{card.name}</h4>
      </div>

      {/* Image */}
      <div className="mb-2 h-16 rounded-md overflow-hidden bg-black/20">
        <img
          src={getAssetPath(card.imagePath)}
          alt={card.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Effect type badge */}
      <div className="mb-2">
        <span className="text-xs uppercase tracking-wide text-gray-400">
          {card.effectType.replace('_', ' ')}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-300 flex-grow">{card.description}</p>

      {/* Target indicator */}
      <div className="mt-auto">
        <span className="text-xs text-gray-500">
          Target: {card.target}
        </span>
      </div>
    </div>
  );
}
