import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { useSetupStore } from './store/setupStore'
import { useMultiplayerStore } from './store/multiplayerStore'
import MainMenu from './components/screens/MainMenu'
import SetupFlow from './components/setup/SetupFlow'
import GameScreen from './components/screens/GameScreen'
import GameOverScreen from './components/screens/GameOverScreen'
import MultiplayerWrapper from './components/multiplayer/MultiplayerWrapper'

function App() {
  const gamePhase = useGameStore((state) => state.state?.phase)
  const setupPhase = useSetupStore((state) => state.phase)
  const gameMode = useSetupStore((state) => state.gameMode)
  const resetSetup = useSetupStore((state) => state.reset)
  const resetGame = useGameStore((state) => state.reset)
  const resetMultiplayer = useMultiplayerStore((state) => state.reset)

  // Check for room code in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomCode = params.get('room')
    if (roomCode && !gameMode) {
      // Auto-select multiplayer mode if there's a room code
      useSetupStore.setState({ gameMode: 'multiplayer' })
    }
  }, [gameMode])

  const handleExitMultiplayer = () => {
    resetMultiplayer()
    resetSetup()
    resetGame()
  }

  // Multiplayer mode has its own flow
  if (gameMode === 'multiplayer') {
    return <MultiplayerWrapper onExit={handleExitMultiplayer} />
  }

  // No game started yet
  if (!gameMode) {
    return <MainMenu />
  }

  // In setup/draft phase
  if (setupPhase !== 'complete') {
    return <SetupFlow />
  }

  // Game ended
  if (gamePhase === 'ended') {
    return <GameOverScreen />
  }

  // Active gameplay
  return <GameScreen />
}

export default App
