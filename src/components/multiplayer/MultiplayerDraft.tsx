import { useEffect, useMemo } from 'react';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { createCardPool, DECK_SIZE } from '../../data/cards';
import CardComponent from '../game/CardComponent';
import type { Card } from '../../data/types';

// We need to map card IDs to actual card objects
// The server only stores card IDs, but we need full card data for display
// Card IDs are now deterministic (based on name + copy index), so all clients
// will generate the same IDs when calling createCardPool()

export default function MultiplayerDraft() {
  const {
    playerNumber,
    roomState,
    isHost,
    draftCard,
    initDraftPool,
  } = useMultiplayerStore();

  // Create card pool immediately (not in useEffect) so it's available for rendering
  // Card IDs are deterministic, so both players will have the same ID -> card mapping
  const cardPool = useMemo(() => createCardPool(), []);

  // Host initializes the draft pool when entering draft phase
  useEffect(() => {
    if (isHost && roomState?.phase === 'draft' && roomState.draftPool.length === 0) {
      initDraftPool(cardPool.map(c => c.id));
    }
  }, [isHost, roomState?.phase, roomState?.draftPool.length, initDraftPool, cardPool]);

  if (!roomState || !playerNumber) return null;

  const myPlayer = roomState.players[playerNumber - 1];
  const opponent = roomState.players[playerNumber === 1 ? 1 : 0];

  const isMyTurn = roomState.currentDrafter === playerNumber;

  // Map card IDs back to card objects
  const getCardById = (id: string): Card | undefined => {
    return cardPool.find(c => c.id === id);
  };

  const draftPoolCards = roomState.draftPool
    .map(id => getCardById(id))
    .filter((c): c is Card => c !== undefined);

  const myDeckCards = myPlayer?.deck
    .map(id => getCardById(id))
    .filter((c): c is Card => c !== undefined) || [];

  const handleDraft = (cardId: string) => {
    if (!isMyTurn) return;
    draftCard(cardId);
  };

  const p1Progress = roomState.players[0]?.deck.length || 0;
  const p2Progress = roomState.players[1]?.deck.length || 0;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Card Draft</h1>
          <p className="text-gray-400">
            {isMyTurn ? (
              <span className="text-yellow-400">Your turn to draft!</span>
            ) : (
              <span>Waiting for {opponent?.name || 'opponent'} to pick...</span>
            )}
          </p>
        </div>

        {/* Progress bars */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">
              {roomState.players[0]?.name}: {roomState.players[0]?.rider} + {roomState.players[0]?.dragon}
              {playerNumber === 1 && <span className="text-yellow-400 ml-2">(You)</span>}
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
              {roomState.players[1]?.name}: {roomState.players[1]?.rider} + {roomState.players[1]?.dragon}
              {playerNumber === 2 && <span className="text-yellow-400 ml-2">(You)</span>}
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

        {/* Card pool */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {draftPoolCards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              size="medium"
              onClick={() => handleDraft(card.id)}
              playable={isMyTurn}
            />
          ))}
        </div>

        {draftPoolCards.length === 0 && roomState.draftPool.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Initializing draft pool...
          </div>
        )}

        {/* Your drafted cards */}
        {myDeckCards.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-3">Your Drafted Cards ({myDeckCards.length})</h3>
            <div className="flex flex-wrap gap-2">
              {myDeckCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300"
                >
                  {card.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
