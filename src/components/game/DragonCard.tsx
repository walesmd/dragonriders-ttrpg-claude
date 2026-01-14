import type { DragonState } from '../../data/types';
import { DRAGONS } from '../../data/dragons';
import HealthBar from '../ui/HealthBar';

interface DragonCardProps {
  dragon: DragonState;
  frozen: boolean;
  burn: number;
  isOpponent?: boolean;
  onClick?: () => void;
  highlighted?: boolean;
}

export default function DragonCard({
  dragon,
  frozen,
  burn,
  isOpponent = false,
  onClick,
  highlighted = false,
}: DragonCardProps) {
  const def = DRAGONS[dragon.name];
  const gradientClasses = `from-${def.visualTheme.primary[0]} to-${def.visualTheme.primary[1]}`;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-4 bg-gradient-to-br ${gradientClasses}
        ${frozen ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}
        ${highlighted ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 cursor-pointer hover:scale-105' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${isOpponent ? 'opacity-90' : ''}
        transition-transform duration-200`}
    >
      {/* Status effects */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {frozen && (
          <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
            FROZEN
          </span>
        )}
        {burn > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
            BURN x{burn}
          </span>
        )}
      </div>

      {/* Avatar and Dragon name */}
      <div className="flex gap-2 items-start mb-2">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
          <img
            src={def.imagePath}
            alt={dragon.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{dragon.name}</h3>
          <span className="text-xs text-gray-300">Dragon</span>
        </div>

        {/* Shields */}
        {dragon.shields > 0 && (
          <div className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-lg">
            <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-200 font-bold">{dragon.shields}</span>
          </div>
        )}
      </div>

      {/* HP Bar */}
      <HealthBar
        current={dragon.hp}
        max={dragon.maxHp}
        color="green"
      />

      {/* Ability */}
      <div className="mt-3 text-xs text-gray-200">
        <span className="font-semibold">Ability: </span>
        {def.ability}
      </div>

      {/* Attack stats */}
      <div className="mt-2 flex items-center gap-3 text-sm">
        <span className="text-red-300">
          <span className="font-bold">{dragon.attackDamage}</span> DMG
        </span>
        <span className="text-yellow-300">
          <span className="font-bold">{dragon.attackCost}</span> Cost
        </span>
      </div>
    </div>
  );
}
