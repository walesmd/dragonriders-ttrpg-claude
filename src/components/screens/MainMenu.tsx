import { useState } from 'react';
import { useSetupStore } from '../../store/setupStore';
import HelpPanel from '../ui/HelpPanel';
import CardLibrary from './CardLibrary';

export default function MainMenu() {
  const setGameMode = useSetupStore((s) => s.setGameMode);
  const [showCardLibrary, setShowCardLibrary] = useState(false);

  if (showCardLibrary) {
    return <CardLibrary onBack={() => setShowCardLibrary(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
          Dragon Riders
        </h1>
        <p className="text-gray-400 text-lg">Competitive 1v1 Card Game</p>
      </div>

      {/* Dragon decoration */}
      <div className="text-8xl mb-8">
        <span role="img" aria-label="dragon" className="filter drop-shadow-lg">
          🐉
        </span>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md mb-6">
        <button
          onClick={() => setGameMode('local')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 text-left"
        >
          <div>Local 2-Player</div>
          <div className="text-sm text-blue-200 font-normal mt-1">
            Pass and play on one device
          </div>
        </button>

        <button
          onClick={() => setGameMode('ai')}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 text-left"
        >
          <div>vs AI</div>
          <div className="text-sm text-purple-200 font-normal mt-1">
            Practice against the computer
          </div>
        </button>

        <button
          onClick={() => setGameMode('multiplayer')}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 text-left"
        >
          <div>Online Multiplayer</div>
          <div className="text-sm text-green-200 font-normal mt-1">
            Play against others online
          </div>
        </button>
      </div>

      {/* How to Play */}
      <div className="w-full max-w-md mb-4">
        <HelpPanel title="How to Play" defaultOpen={false}>
          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-white mb-1">Goal</h4>
              <p>Defeat your opponent by reducing their Dragon OR Rider HP to 0.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Setup</h4>
              <p>Each player chooses a Rider (economy engine) and Dragon (combat unit), then drafts a 20-card deck.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Turn Structure</h4>
              <p>• <strong>Start:</strong> Draw card, gain energy, apply burn damage</p>
              <p>• <strong>Action:</strong> Attack with dragon or play cards from hand</p>
              <p>• <strong>End:</strong> Discard down to 5 cards, clear freeze effects</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Key Mechanics</h4>
              <p>• Energy: Spend to attack (2) and play cards (varies)</p>
              <p>• Shields: Absorb damage before HP loss</p>
              <p>• Freeze: Skip your attack, play only 1 card</p>
              <p>• Burn: Take damage each turn until removed</p>
            </div>
          </div>
        </HelpPanel>
      </div>

      {/* Card Library Button */}
      <div className="w-full max-w-md mb-8">
        <button
          onClick={() => setShowCardLibrary(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-4 rounded-lg font-bold transition-all hover:scale-105"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">📚</span>
            <span>Explore Card Library</span>
          </div>
          <div className="text-sm text-indigo-200 font-normal mt-1">
            Browse all Riders, Dragons, and Cards
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="text-gray-600 text-sm">
        v0.8 - Playtest Build
      </div>
    </div>
  );
}
