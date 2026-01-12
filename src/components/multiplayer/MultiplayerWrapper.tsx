import { useEffect } from 'react';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import MultiplayerLobby from './MultiplayerLobby';
import MultiplayerSetup from './MultiplayerSetup';
import MultiplayerDraft from './MultiplayerDraft';
import MultiplayerGame from './MultiplayerGame';
import GameOverScreen from '../screens/GameOverScreen';

interface MultiplayerWrapperProps {
  onExit: () => void;
}

export default function MultiplayerWrapper({ onExit }: MultiplayerWrapperProps) {
  const {
    isConnected,
    roomState,
    reset,
  } = useMultiplayerStore();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount - allow reconnection
    };
  }, []);

  const handleExit = () => {
    reset();
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.pushState({}, '', url.toString());
    onExit();
  };

  // Not connected - show lobby
  if (!isConnected || !roomState) {
    return <MultiplayerLobby onCancel={handleExit} />;
  }

  // Waiting for second player
  if (roomState.phase === 'waiting') {
    return <MultiplayerLobby onCancel={handleExit} />;
  }

  // Setup phase - rider/dragon selection
  if (roomState.phase === 'setup') {
    return <MultiplayerSetup />;
  }

  // Draft phase
  if (roomState.phase === 'draft') {
    return <MultiplayerDraft />;
  }

  // Playing phase
  if (roomState.phase === 'playing') {
    return <MultiplayerGame />;
  }

  // Game ended
  if (roomState.phase === 'ended') {
    return <GameOverScreen />;
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Unknown game state</div>
    </div>
  );
}
