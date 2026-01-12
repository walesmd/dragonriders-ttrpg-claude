interface HealthBarProps {
  current: number;
  max: number;
  woundedThreshold?: number;
  criticalThreshold?: number;
  color?: 'red' | 'blue' | 'green';
  showLabel?: boolean;
  className?: string;
}

export default function HealthBar({
  current,
  max,
  woundedThreshold,
  criticalThreshold,
  color = 'red',
  showLabel = true,
  className = '',
}: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  const woundedPercent = woundedThreshold ? (woundedThreshold / max) * 100 : null;
  const criticalPercent = criticalThreshold ? (criticalThreshold / max) * 100 : null;

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-300">HP</span>
          <span className="text-white font-medium">{current}/{max}</span>
        </div>
      )}
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
        {/* Current HP bar */}
        <div
          className={`absolute inset-y-0 left-0 ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />

        {/* Wounded threshold marker */}
        {woundedPercent !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
            style={{ left: `${woundedPercent}%` }}
            title={`Wounded: ${woundedThreshold}`}
          />
        )}

        {/* Critical threshold marker */}
        {criticalPercent !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-400"
            style={{ left: `${criticalPercent}%` }}
            title={`Critical: ${criticalThreshold}`}
          />
        )}
      </div>
    </div>
  );
}
