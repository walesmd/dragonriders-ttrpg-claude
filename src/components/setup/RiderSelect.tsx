import { useSetupStore } from '../../store/setupStore';
import { RIDERS } from '../../data/riders';
import type { RiderName } from '../../data/types';
import HelpPanel from '../ui/HelpPanel';
import { getAssetPath } from '../../utils/assets';

interface RiderSelectProps {
  player: 1 | 2;
}

export default function RiderSelect({ player }: RiderSelectProps) {
  const selectRider = useSetupStore((s) => s.selectRider);
  const player1Rider = useSetupStore((s) => s.player1Rider);

  const riderNames = Object.keys(RIDERS) as RiderName[];

  const handleSelect = (name: RiderName) => {
    selectRider(player, name);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Player {player}: Choose Your Rider
          </h1>
          <p className="text-gray-400">
            Your Rider provides economy bonuses and passive abilities
          </p>
        </div>

        {/* Rider Tips */}
        <div className="mb-6">
          <HelpPanel title="Rider Tips">
            <div className="space-y-2">
              <p><strong>HP:</strong> Riders are an alternate win condition. Protect them!</p>
              <p><strong>Rider Shields:</strong> Your Dragon grants starting shields that protect Rider HP</p>
              <p><strong>Economy:</strong> Higher base economy = more energy per turn</p>
              <p><strong>Breakpoints:</strong> Riders change abilities when wounded (≤threshold) or critical (≤critical threshold)</p>
              <p><strong>Strategy:</strong> Talia excels at economic advantage, Kael at aggressive attacks, Bronn at defense, Lyra at control, and Morrik at shield synergy</p>
            </div>
          </HelpPanel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {riderNames.map((name) => {
            const rider = RIDERS[name];
            const isSelected = player1Rider === name && player === 2;
            const gradientClasses = `from-${rider.visualTheme.primary[0]} to-${rider.visualTheme.primary[1]} hover:from-${rider.visualTheme.hover[0]} hover:to-${rider.visualTheme.hover[1]}`;

            return (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                disabled={isSelected}
                className={`
                  rounded-xl text-left transition-all duration-200 overflow-hidden
                  bg-gradient-to-br ${gradientClasses}
                  ${isSelected ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                `}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getAssetPath(rider.imagePath)}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="text-white font-bold text-xl">Taken by P1</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{name}</h3>

                  <div className="flex gap-4 text-sm mb-3">
                    <span className="text-red-300">{rider.maxHp} HP</span>
                    <span className="text-yellow-300">+{rider.baseEconomy} Eco</span>
                  </div>

                  <div className="text-xs text-gray-200 mb-3 italic">
                    "{rider.shortIntro}"
                  </div>

                  <div className="text-xs text-gray-200 mb-2">
                    <div className="font-semibold mb-1">Passive:</div>
                    {rider.passive}
                  </div>

                  <div className="text-xs text-yellow-200/70">
                    <div className="font-semibold">Wounded ({rider.woundedThreshold}HP):</div>
                    {rider.woundedEffect}
                  </div>

                  <div className="text-xs text-red-200/70 mt-1">
                    <div className="font-semibold">Critical ({rider.criticalThreshold}HP):</div>
                    {rider.criticalEffect}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
