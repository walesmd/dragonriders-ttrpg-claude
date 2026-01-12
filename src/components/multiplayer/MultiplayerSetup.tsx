import { useMultiplayerStore } from '../../store/multiplayerStore';
import { RIDERS } from '../../data/riders';
import { DRAGONS } from '../../data/dragons';
import type { RiderName, DragonName } from '../../data/types';
import Button from '../ui/Button';

export default function MultiplayerSetup() {
  const {
    playerNumber,
    roomState,
    selectRider,
    selectDragon,
    setReady,
  } = useMultiplayerStore();

  if (!roomState || !playerNumber) return null;

  const myPlayer = roomState.players[playerNumber - 1];
  const opponent = roomState.players[playerNumber === 1 ? 1 : 0];

  const riderNames = Object.keys(RIDERS) as RiderName[];
  const dragonNames = Object.keys(DRAGONS) as DragonName[];

  const canReady = myPlayer?.rider && myPlayer?.dragon;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Team</h1>
          <p className="text-gray-400">
            You are <span className="text-yellow-400">Player {playerNumber}</span>
          </p>
        </div>

        {/* Opponent Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400">Opponent: </span>
              <span className="text-white font-medium">{opponent?.name || 'Waiting...'}</span>
            </div>
            <div className="flex items-center gap-4">
              {opponent?.rider && (
                <span className="text-sm text-gray-400">
                  Rider: <span className="text-white">{opponent.rider}</span>
                </span>
              )}
              {opponent?.dragon && (
                <span className="text-sm text-gray-400">
                  Dragon: <span className="text-white">{opponent.dragon}</span>
                </span>
              )}
              {opponent?.ready && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Ready</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rider Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Select Rider</h2>
            <div className="space-y-3">
              {riderNames.map((name) => {
                const rider = RIDERS[name];
                const isSelected = myPlayer?.rider === name;

                return (
                  <div
                    key={name}
                    onClick={() => selectRider(name)}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all
                      ${isSelected
                        ? 'bg-blue-900 border-2 border-blue-500'
                        : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{rider.passive}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-400">HP: <span className="text-white">{rider.maxHp}</span></div>
                        <div className="text-gray-400">Economy: <span className="text-yellow-400">+{rider.baseEconomy}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dragon Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Select Dragon</h2>
            <div className="space-y-3">
              {dragonNames.map((name) => {
                const dragon = DRAGONS[name];
                const isSelected = myPlayer?.dragon === name;

                return (
                  <div
                    key={name}
                    onClick={() => selectDragon(name)}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all
                      ${isSelected
                        ? 'bg-orange-900 border-2 border-orange-500'
                        : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{dragon.ability}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-400">HP: <span className="text-white">{dragon.maxHp}</span></div>
                        <div className="text-gray-400">Shields: <span className="text-blue-400">{dragon.shields}</span></div>
                        <div className="text-gray-400">Attack: <span className="text-red-400">{dragon.attackDamage}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ready Button */}
        <div className="mt-8 text-center">
          {myPlayer?.ready ? (
            <div className="bg-green-900/50 border border-green-700 text-green-300 px-6 py-3 rounded-lg inline-block">
              Waiting for opponent to be ready...
            </div>
          ) : (
            <Button
              onClick={setReady}
              variant="primary"
              size="lg"
              disabled={!canReady}
            >
              {canReady ? "I'm Ready!" : 'Select Rider and Dragon'}
            </Button>
          )}
        </div>

        {/* Your Selection Summary */}
        {(myPlayer?.rider || myPlayer?.dragon) && (
          <div className="mt-6 text-center text-gray-400">
            Your selection:{' '}
            <span className="text-white">{myPlayer?.rider || '?'}</span>
            {' + '}
            <span className="text-white">{myPlayer?.dragon || '?'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
