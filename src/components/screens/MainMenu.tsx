import { useSetupStore } from '../../store/setupStore';
import Button from '../ui/Button';

export default function MainMenu() {
  const setGameMode = useSetupStore((s) => s.setGameMode);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
          Dragon Riders
        </h1>
        <p className="text-gray-400 text-lg">Competitive 1v1 Card Game</p>
      </div>

      {/* Dragon decoration */}
      <div className="text-8xl mb-12">
        <span role="img" aria-label="dragon" className="filter drop-shadow-lg">
          🐉
        </span>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={() => setGameMode('local')} variant="primary" size="lg">
          Local 2-Player
        </Button>

        <Button onClick={() => setGameMode('ai')} variant="primary" size="lg">
          vs AI
        </Button>

        <Button onClick={() => setGameMode('multiplayer')} variant="primary" size="lg">
          Online Multiplayer
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-gray-600 text-sm">
        v0.8 - Playtest Build
      </div>
    </div>
  );
}
