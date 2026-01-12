import { useState, useEffect } from 'react';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import Button from '../ui/Button';

interface MultiplayerLobbyProps {
  onCancel: () => void;
}

export default function MultiplayerLobby({ onCancel }: MultiplayerLobbyProps) {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const {
    roomId,
    isConnected,
    playerNumber,
    roomState,
    error,
    createRoom,
    joinRoom,
  } = useMultiplayerStore();

  // Check URL for room code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) {
      setJoinCode(roomCode);
    }
  }, []);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const newRoomId = await createRoom();
      // Update URL with room code
      const url = new URL(window.location.href);
      url.searchParams.set('room', newRoomId);
      window.history.pushState({}, '', url.toString());
    } catch (err) {
      console.error('Failed to create room:', err);
    }
    setIsCreating(false);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    try {
      await joinRoom(joinCode.trim().toUpperCase(), playerName || undefined);
      // Update URL with room code
      const url = new URL(window.location.href);
      url.searchParams.set('room', joinCode.trim().toUpperCase());
      window.history.pushState({}, '', url.toString());
    } catch (err) {
      console.error('Failed to join room:', err);
    }
    setIsJoining(false);
  };

  const shareUrl = roomId
    ? (() => {
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        return url.toString();
      })()
    : '';

  const copyShareUrl = async () => {
    try {
      // Try modern Clipboard API first (requires HTTPS)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      // Could show a toast notification here
    }
  };

  // If connected to a room, show waiting screen
  if (isConnected && roomId) {
    const player1 = roomState?.players[0];
    const player2 = roomState?.players[1];

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Multiplayer Lobby
          </h2>

          {/* Room Code */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-400 mb-1">Room Code</div>
            <div className="text-3xl font-mono font-bold text-yellow-400 tracking-wider">
              {roomId}
            </div>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Share this link with your opponent:</div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-gray-700 text-gray-300 px-3 py-2 rounded text-sm"
              />
              <Button onClick={copyShareUrl} variant="secondary" size="sm">
                Copy
              </Button>
            </div>
          </div>

          {/* Players */}
          <div className="space-y-3 mb-6">
            <div className="text-sm text-gray-400 mb-2">Players:</div>

            {/* Player 1 */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              player1?.connected ? 'bg-green-900/30 border border-green-700' : 'bg-gray-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  player1?.connected ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-white font-medium">
                  {player1?.name || 'Waiting for Player 1...'}
                </span>
                {playerNumber === 1 && (
                  <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white">You</span>
                )}
              </div>
              {player1?.connected && (
                <span className="text-green-400 text-sm">Connected</span>
              )}
            </div>

            {/* Player 2 */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              player2?.connected ? 'bg-green-900/30 border border-green-700' : 'bg-gray-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  player2?.connected ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-white font-medium">
                  {player2?.name || 'Waiting for Player 2...'}
                </span>
                {playerNumber === 2 && (
                  <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white">You</span>
                )}
              </div>
              {player2?.connected && (
                <span className="text-green-400 text-sm">Connected</span>
              )}
            </div>
          </div>

          {/* Status */}
          {roomState?.phase === 'waiting' && (
            <div className="text-center text-gray-400 mb-6">
              Waiting for another player to join...
            </div>
          )}

          {roomState?.phase === 'setup' && (
            <div className="text-center text-green-400 mb-6">
              Both players connected! Starting setup...
            </div>
          )}

          {/* Cancel */}
          <div className="text-center">
            <Button onClick={onCancel} variant="secondary">
              Leave Lobby
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial screen - create or join
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Multiplayer
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Your Name (optional)</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Create Room */}
        <div className="mb-8">
          <Button
            onClick={handleCreateRoom}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create New Game'}
          </Button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Create a room and share the code with your opponent
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-800 px-4 text-gray-500">or</span>
          </div>
        </div>

        {/* Join Room */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Room Code</label>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            maxLength={6}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-center text-2xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <Button
          onClick={handleJoinRoom}
          variant="secondary"
          size="lg"
          className="w-full mb-6"
          disabled={isJoining || joinCode.length < 6}
        >
          {isJoining ? 'Joining...' : 'Join Game'}
        </Button>

        {/* Back */}
        <div className="text-center">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
