interface EnergyDisplayProps {
  energy: number;
  className?: string;
}

export default function EnergyDisplay({ energy, className = '' }: EnergyDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-600/30">
        <span className="text-2xl font-bold text-white">{energy}</span>
      </div>
      <span className="text-yellow-400 text-sm font-medium">Energy</span>
    </div>
  );
}
