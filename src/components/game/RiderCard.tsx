import type { RiderState } from '../../data/types';
import { RIDERS, isWounded, isCritical } from '../../data/riders';
import HealthBar from '../ui/HealthBar';
import { getAssetPath } from '../../utils/assets';

interface RiderCardProps {
  rider: RiderState;
  frozen: boolean;
  burn: number;
  isOpponent?: boolean;
}

export default function RiderCard({
  rider,
  frozen,
  burn,
  isOpponent = false,
}: RiderCardProps) {
  const def = RIDERS[rider.name];
  const wounded = isWounded(rider);
  const critical = isCritical(rider);

  const gradientClasses = `from-${def.visualTheme.primary[0]} to-${def.visualTheme.primary[1]}`;
  const statusText = critical ? 'CRITICAL' : wounded ? 'WOUNDED' : '';
  const statusColor = critical ? 'text-red-400' : wounded ? 'text-yellow-400' : '';

  return (
    <div
      className={`relative rounded-xl p-3 bg-gradient-to-br ${gradientClasses}
        ${frozen ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}
        ${isOpponent ? 'opacity-90' : ''}`}
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

      {/* Avatar and Rider name */}
      <div className="flex gap-2 items-start mb-2">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
          <img
            src={getAssetPath(def.imagePath)}
            alt={rider.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{rider.name}</h3>
          <span className="text-xs text-gray-300">Rider</span>
        </div>

        {/* Shields */}
        {rider.shields > 0 && (
          <div className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-lg">
            <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-200 font-bold">{rider.shields}</span>
          </div>
        )}

        {statusText && (
          <span className={`text-xs font-bold ${statusColor}`}>{statusText}</span>
        )}
      </div>

      {/* HP Bar */}
      <HealthBar
        current={rider.hp}
        max={rider.maxHp}
        woundedThreshold={rider.woundedThreshold}
        criticalThreshold={rider.criticalThreshold}
        color="red"
      />

      {/* Passive ability */}
      <div className="mt-2 text-xs text-gray-200">
        <span className="font-semibold">Passive: </span>
        {critical ? def.criticalEffect : wounded ? def.woundedEffect : def.passive}
      </div>

      {/* Economy indicator */}
      <div className="mt-2 flex items-center gap-1 text-yellow-300 text-sm">
        <span>+{rider.baseEconomy}</span>
        <span className="text-yellow-500">Energy/turn</span>
      </div>
    </div>
  );
}
