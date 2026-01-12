import { useSetupStore } from '../../store/setupStore';
import { DRAGONS } from '../../data/dragons';
import type { DragonName } from '../../data/types';

interface DragonSelectProps {
  player: 1 | 2;
}

const DRAGON_COLORS: Record<string, string> = {
  Emberfang: 'from-orange-600 to-red-800 hover:from-orange-500 hover:to-red-700',
  Cryowyrm: 'from-blue-500 to-cyan-700 hover:from-blue-400 hover:to-cyan-600',
  Voltwing: 'from-yellow-500 to-amber-700 hover:from-yellow-400 hover:to-amber-600',
  Steelhorn: 'from-gray-500 to-zinc-700 hover:from-gray-400 hover:to-zinc-600',
  Voidmaw: 'from-purple-600 to-indigo-900 hover:from-purple-500 hover:to-indigo-800',
};

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
        <div className="text-center mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {dragonNames.map((name) => {
            const dragon = DRAGONS[name];
            const isSelected = player1Dragon === name && player === 2;

            return (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                disabled={isSelected}
                className={`
                  p-4 rounded-xl text-left transition-all duration-200
                  bg-gradient-to-br ${DRAGON_COLORS[name]}
                  ${isSelected ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                `}
              >
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>

                <div className="flex gap-3 text-sm mb-3">
                  <span className="text-green-300">{dragon.maxHp} HP</span>
                  <span className="text-blue-300">{dragon.shields} Shields</span>
                </div>

                <div className="flex gap-3 text-sm mb-3">
                  <span className="text-red-300">{dragon.attackDamage} DMG</span>
                  <span className="text-yellow-300">{dragon.attackCost} Cost</span>
                </div>

                <div className="text-xs text-gray-200">
                  <div className="font-semibold mb-1">Ability:</div>
                  {dragon.ability}
                </div>

                {isSelected && (
                  <div className="mt-2 text-white font-bold text-center bg-black/30 rounded py-1">
                    Taken by P1
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
