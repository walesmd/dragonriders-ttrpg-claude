import { create } from 'zustand';
import PartySocket from 'partysocket';
import type { RiderName, DragonName, GameState } from '../data/types';

// Room state from server
interface Player {
  id: string;
  name: string;
  connected: boolean;
  rider: string | null;
  dragon: string | null;
  ready: boolean;
  deck: string[];
}

interface RoomState {
  phase: 'waiting' | 'setup' | 'draft' | 'playing' | 'ended';
  players: [Player | null, Player | null];
  hostId: string | null;
  draftPool: string[];
  currentDrafter: 1 | 2;
  gameState: GameState | null;
  createdAt: number;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

interface MultiplayerStore {
  // Connection state
  socket: PartySocket | null;
  roomId: string | null;
  connectionId: string | null;
  isConnected: boolean;
  isHost: boolean;
  playerNumber: 1 | 2 | null;

  // Room state (synced from server)
  roomState: RoomState | null;

  // Chat
  chatMessages: ChatMessage[];

  // Error handling
  error: string | null;

  // Actions
  createRoom: () => Promise<string>;
  joinRoom: (roomId: string, playerName?: string) => Promise<void>;
  disconnect: () => void;

  // Setup actions
  selectRider: (rider: RiderName) => void;
  selectDragon: (dragon: DragonName) => void;
  setReady: () => void;

  // Draft actions
  initDraftPool: (cardIds: string[]) => void;
  draftCard: (cardId: string) => void;

  // Game actions
  sendGameAction: (action: 'attack_dragon' | 'attack_rider' | 'play_card' | 'end_turn', cardId?: string, target?: 'dragon' | 'rider') => void;
  updateGameState: (state: GameState) => void;
  endGame: (state: GameState) => void;

  // Chat
  sendChat: (message: string) => void;

  // Reset
  reset: () => void;
}

// Generate a random room ID
function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// PartyKit host - change this when deploying
const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || 'localhost:1999';

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  socket: null,
  roomId: null,
  connectionId: null,
  isConnected: false,
  isHost: false,
  playerNumber: null,
  roomState: null,
  chatMessages: [],
  error: null,

  createRoom: async () => {
    const roomId = generateRoomId();
    await get().joinRoom(roomId);
    return roomId;
  },

  joinRoom: async (roomId: string, playerName?: string) => {
    // Disconnect existing socket
    get().disconnect();

    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
    });

    socket.addEventListener('open', () => {
      set({ isConnected: true, error: null });

      // Send join message
      socket.send(JSON.stringify({
        type: 'join',
        playerName,
      }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'state_update':
          set({
            roomState: data.state,
            connectionId: data.yourConnectionId || get().connectionId,
          });
          break;

        case 'player_assigned':
          set({
            playerNumber: data.playerNumber,
            isHost: data.isHost,
          });
          break;

        case 'error':
          set({ error: data.message });
          break;

        case 'chat':
          set((state) => ({
            chatMessages: [...state.chatMessages, {
              sender: data.sender,
              message: data.message,
              timestamp: data.timestamp,
            }],
          }));
          break;

        case 'game_action':
          // This is handled by the game component listening to the store
          // Emit a custom event or handle via callback
          window.dispatchEvent(new CustomEvent('multiplayer_game_action', {
            detail: data,
          }));
          break;
      }
    });

    socket.addEventListener('close', () => {
      set({ isConnected: false });
    });

    socket.addEventListener('error', () => {
      set({ error: 'Connection error' });
    });

    set({ socket, roomId });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
    }
    set({
      socket: null,
      isConnected: false,
      roomState: null,
      playerNumber: null,
      isHost: false,
    });
  },

  selectRider: (rider: RiderName) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'select_rider',
      rider,
    }));
  },

  selectDragon: (dragon: DragonName) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'select_dragon',
      dragon,
    }));
  },

  setReady: () => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'ready',
    }));
  },

  initDraftPool: (cardIds: string[]) => {
    const { socket, isHost } = get();
    if (!socket || !isHost) return;

    // Send via WebSocket to server
    socket.send(JSON.stringify({
      type: 'init_draft_pool',
      draftPool: cardIds,
    }));
  },

  draftCard: (cardId: string) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'draft_card',
      cardId,
    }));
  },

  sendGameAction: (action, cardId, target) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'game_action',
      action,
      cardId,
      target,
    }));
  },

  updateGameState: (state: GameState) => {
    const { socket, isHost } = get();
    if (!socket || !isHost) return;

    // Send via WebSocket to server
    socket.send(JSON.stringify({
      type: 'update_game_state',
      gameState: state,
    }));
  },

  endGame: (state: GameState) => {
    const { socket, isHost } = get();
    if (!socket || !isHost) return;

    // Send via WebSocket to server
    socket.send(JSON.stringify({
      type: 'game_ended',
      gameState: state,
    }));
  },

  sendChat: (message: string) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'chat',
      message,
    }));
  },

  reset: () => {
    get().disconnect();
    set({
      socket: null,
      roomId: null,
      connectionId: null,
      isConnected: false,
      isHost: false,
      playerNumber: null,
      roomState: null,
      chatMessages: [],
      error: null,
    });
  },
}));
