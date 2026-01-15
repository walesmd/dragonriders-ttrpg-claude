import { useSetupStore } from '../../store/setupStore';
import { DRAGONS } from '../../data/dragons';
import type { DragonName } from '../../data/types';
import HelpPanel from '../ui/HelpPanel';
import { getAssetPath } from '../../utils/assets';

interface DragonSelectProps {
  player: 1 | 2;
}

export default function DragonSelect({ player }: DragonSelectProps) {
  const selectDragon = useSetupStore((s) => s.selectDragon);
  const player1Dragon = useSetupStore((s) => s.player1Dragon);
  const player1Rider = useSetupStore((s) => s.player1Rider);
  const player2Rider = useSetupStore((s) => s.player2Rider);

  const dragonNames = Object.keys(DRAGONS) as DragonName[];

  const handleSelect = (name: DragonName) => {
    selectDragon(player, name);
  };

  const currentRider = player === 1 ? player1Rider : player2Rider;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Player {player}: Choose Your Dragon
          </h1>
          <p className="text-gray-400">
            Playing as <span className="text-white font-bold">{currentRider}</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Your Dragon is your main combat unit
          </p>
        </div>

        {/* Dragon Tips */}
        <div className="mb-6">
          <HelpPanel title="Dragon Tips">
            <div className="space-y-2">
              <p><strong>Attacking:</strong> Costs 2 energy, deals 3 damage by default</p>
              <p><strong>Shields:</strong> Starting shields absorb damage before HP loss</p>
              <p><strong>Abilities:</strong> Each dragon has a unique combat ability</p>
              <p><strong>Strategy:</strong> Emberfang for DoT, Cryowyrm for control, Voltwing for spread damage, Steelhorn for defense, Voidmaw for energy advantage</p>
            </div>
          </HelpPanel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {dragonNames.map((name) => {
            const dragon = DRAGONS[name];
            const isSelected = player1Dragon === name && player === 2;
            const gradientClasses = `from-${dragon.visualTheme.primary[0]} to-${dragon.visualTheme.primary[1]} hover:from-${dragon.visualTheme.hover[0]} hover:to-${dragon.visualTheme.hover[1]}`;

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
                    src={getAssetPath(dragon.imagePath)}
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

                  <div className="flex gap-3 text-sm mb-3">
                    <span className="text-green-300">{dragon.maxHp} HP</span>
                    <span className="text-blue-300">{dragon.shields} Rider Shields</span>
                  </div>

                  <div className="flex gap-3 text-sm mb-3">
                    <span className="text-red-300">{dragon.attackDamage} DMG</span>
                    <span className="text-yellow-300">{dragon.attackCost} Cost</span>
                  </div>

                  <div className="text-xs text-gray-200 mb-3 italic">
                    "{dragon.shortIntro}"
                  </div>

                  <div className="text-xs text-gray-200">
                    <div className="font-semibold mb-1">Ability:</div>
                    {dragon.ability}
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
