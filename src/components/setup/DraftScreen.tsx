import { useEffect, useState } from 'react';
import { useSetupStore } from '../../store/setupStore';
import { useGameStore } from '../../store/gameStore';
import { DECK_SIZE } from '../../data/cards';
import CardComponent from '../game/CardComponent';
import HelpPanel from '../ui/HelpPanel';

export default function DraftScreen() {
  const visiblePool = useSetupStore((s) => s.visiblePool);
  const draftPool = useSetupStore((s) => s.draftPool);
  const player1Deck = useSetupStore((s) => s.player1Deck);
  const player2Deck = useSetupStore((s) => s.player2Deck);
  const currentDrafter = useSetupStore((s) => s.currentDrafter);
  const draftCard = useSetupStore((s) => s.draftCard);
  const phase = useSetupStore((s) => s.phase);
  const gameMode = useSetupStore((s) => s.gameMode);

  const player1Rider = useSetupStore((s) => s.player1Rider);
  const player2Rider = useSetupStore((s) => s.player2Rider);
  const player1Dragon = useSetupStore((s) => s.player1Dragon);
  const player2Dragon = useSetupStore((s) => s.player2Dragon);

  const initializeGame = useGameStore((s) => s.initializeGame);

  const [showTips, setShowTips] = useState(true);

  // AI auto-drafts
  useEffect(() => {
    if (gameMode === 'ai' && currentDrafter === 2 && player2Deck.length < DECK_SIZE) {
      // AI picks a random card after a short delay
      const timer = setTimeout(() => {
        if (visiblePool.length > 0) {
          const randomIndex = Math.floor(Math.random() * visiblePool.length);
          draftCard(visiblePool[randomIndex].id);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameMode, currentDrafter, player2Deck.length, visiblePool, draftCard]);

  // Start game when draft is complete
  useEffect(() => {
    if (phase === 'complete') {
      initializeGame();
    }
  }, [phase, initializeGame]);

  const handleDraft = (cardId: string) => {
    if (gameMode === 'ai' && currentDrafter === 2) return;
    draftCard(cardId);
  };

  const p1Progress = player1Deck.length;
  const p2Progress = player2Deck.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Card Draft</h1>
          <p className="text-gray-400">
            {gameMode === 'ai' && currentDrafter === 2 ? (
              <span className="text-yellow-400">AI is drafting...</span>
            ) : (
              <>
                <span className="text-yellow-400">Player {currentDrafter}</span> - Select a card
              </>
            )}
          </p>
        </div>

        {/* Draft Instructions */}
        {showTips && (
          <div className="mb-4">
            <HelpPanel title="Draft Instructions" defaultOpen={true}>
              <div className="space-y-2">
                <p><strong>Goal:</strong> Build a 20-card deck. Players alternate picking cards.</p>
                <p><strong>Strategy:</strong> Balance damage, defense (shields/heal), energy, and control (freeze/burn)</p>
                <p><strong>Tip:</strong> Consider your Rider and Dragon abilities when drafting</p>
                <button
                  onClick={() => setShowTips(false)}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Hide tips
                </button>
              </div>
            </HelpPanel>
          </div>
        )}

        {/* Progress bars */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">
              P1: {player1Rider} + {player1Dragon}
            </div>
            <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(p1Progress / DECK_SIZE) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{p1Progress}/{DECK_SIZE}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">
              P2: {player2Rider} + {player2Dragon}
            </div>
            <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(p2Progress / DECK_SIZE) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{p2Progress}/{DECK_SIZE}</div>
          </div>
        </div>

        {/* Card type legend */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-red-500 bg-red-900/30"></span>
              <span className="text-gray-400">Damage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-orange-500 bg-orange-900/30"></span>
              <span className="text-gray-400">Burn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-cyan-500 bg-cyan-900/30"></span>
              <span className="text-gray-400">Freeze</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-900/30"></span>
              <span className="text-gray-400">Shield</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-green-500 bg-green-900/30"></span>
              <span className="text-gray-400">Heal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-yellow-500 bg-yellow-900/30"></span>
              <span className="text-gray-400">Energy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-purple-500 bg-purple-900/30"></span>
              <span className="text-gray-400">Drain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-pink-500 bg-pink-900/30"></span>
              <span className="text-gray-400">Discard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-teal-500 bg-teal-900/30"></span>
              <span className="text-gray-400">Thaw</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-gray-500 bg-gray-900/30"></span>
              <span className="text-gray-400">Strip</span>
            </div>
          </div>
        </div>

        {/* Card pool indicator */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-400">
            Showing <span className="text-yellow-400 font-semibold">{visiblePool.length}</span> cards
            {draftPool.length > 0 && (
              <>
                {' • '}
                <span className="text-gray-500">{draftPool.length} remaining in pool</span>
              </>
            )}
          </p>
        </div>

        {/* Card pool - 5 cards max */}
        <div className="flex justify-center gap-3 flex-wrap">
          {visiblePool.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              size="medium"
              onClick={() => handleDraft(card.id)}
              playable={!(gameMode === 'ai' && currentDrafter === 2)}
            />
          ))}

          {/* Empty slots when fewer than 5 cards visible */}
          {Array.from({ length: 5 - visiblePool.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-40 h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-600 text-sm">Empty</span>
            </div>
          ))}
        </div>

        {visiblePool.length === 0 && draftPool.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            All cards have been drafted!
          </div>
        )}
      </div>
    </div>
  );
}
