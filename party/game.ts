import type * as Party from "partykit/server";

// Message types for client-server communication
interface BaseMessage {
  type: string;
}

interface JoinMessage extends BaseMessage {
  type: "join";
  playerName?: string;
}

interface SelectRiderMessage extends BaseMessage {
  type: "select_rider";
  rider: string;
}

interface SelectDragonMessage extends BaseMessage {
  type: "select_dragon";
  dragon: string;
}

interface ReadyMessage extends BaseMessage {
  type: "ready";
}

interface DraftCardMessage extends BaseMessage {
  type: "draft_card";
  cardId: string;
}

interface GameActionMessage extends BaseMessage {
  type: "game_action";
  action: "attack_dragon" | "attack_rider" | "play_card" | "end_turn";
  cardId?: string;
  target?: "dragon" | "rider";
}

interface ChatMessage extends BaseMessage {
  type: "chat";
  message: string;
}

interface InitDraftPoolMessage extends BaseMessage {
  type: "init_draft_pool";
  draftPool: string[];
}

interface UpdateGameStateMessage extends BaseMessage {
  type: "update_game_state";
  gameState: unknown;
}

interface GameEndedMessage extends BaseMessage {
  type: "game_ended";
  gameState: unknown;
}

type ClientMessage =
  | JoinMessage
  | SelectRiderMessage
  | SelectDragonMessage
  | ReadyMessage
  | DraftCardMessage
  | GameActionMessage
  | ChatMessage
  | InitDraftPoolMessage
  | UpdateGameStateMessage
  | GameEndedMessage;

// Game room state
interface Player {
  id: string;
  name: string;
  connected: boolean;
  rider: string | null;
  dragon: string | null;
  ready: boolean;
  deck: string[]; // Card IDs
}

interface RoomState {
  phase: "waiting" | "setup" | "draft" | "playing" | "ended";
  players: [Player | null, Player | null];
  hostId: string | null;

  // Draft state
  draftPool: string[]; // Card IDs
  currentDrafter: 1 | 2;

  // Game state (serialized)
  gameState: unknown | null;

  // Metadata
  createdAt: number;
}

export default class GameRoom implements Party.Server {
  state: RoomState;

  constructor(readonly room: Party.Room) {
    this.state = {
      phase: "waiting",
      players: [null, null],
      hostId: null,
      draftPool: [],
      currentDrafter: 1,
      gameState: null,
      createdAt: Date.now(),
    };
  }

  // Load persisted state on room start
  async onStart() {
    const stored = await this.room.storage.get<RoomState>("state");
    if (stored) {
      this.state = stored;
    }
  }

  // Save state to storage
  async saveState() {
    await this.room.storage.put("state", this.state);
  }

  // Broadcast state to all clients
  broadcastState() {
    this.room.broadcast(
      JSON.stringify({
        type: "state_update",
        state: this.state,
      })
    );
  }

  // Handle new connection
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Send current state to new connection
    conn.send(
      JSON.stringify({
        type: "state_update",
        state: this.state,
        yourConnectionId: conn.id,
      })
    );
  }

  // Handle disconnection
  async onClose(conn: Party.Connection) {
    // Mark player as disconnected but don't remove them
    for (let i = 0; i < 2; i++) {
      const player = this.state.players[i];
      if (player && player.id === conn.id) {
        player.connected = false;
        break;
      }
    }

    await this.saveState();
    this.broadcastState();
  }

  // Handle messages from clients
  async onMessage(message: string, sender: Party.Connection) {
    let data: ClientMessage;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    switch (data.type) {
      case "join":
        await this.handleJoin(sender, data);
        break;
      case "select_rider":
        await this.handleSelectRider(sender, data);
        break;
      case "select_dragon":
        await this.handleSelectDragon(sender, data);
        break;
      case "ready":
        await this.handleReady(sender);
        break;
      case "draft_card":
        await this.handleDraftCard(sender, data);
        break;
      case "game_action":
        await this.handleGameAction(sender, data);
        break;
      case "chat":
        await this.handleChat(sender, data);
        break;
      case "init_draft_pool":
        await this.handleInitDraftPool(sender, data);
        break;
      case "update_game_state":
        await this.handleUpdateGameState(sender, data);
        break;
      case "game_ended":
        await this.handleGameEnded(sender, data);
        break;
    }
  }

  // Player joins the room
  async handleJoin(conn: Party.Connection, data: JoinMessage) {
    const existingPlayerIndex = this.state.players.findIndex(
      (p) => p && p.id === conn.id
    );

    // Reconnecting player
    if (existingPlayerIndex !== -1) {
      this.state.players[existingPlayerIndex]!.connected = true;
      await this.saveState();
      this.broadcastState();
      return;
    }

    // New player - find empty slot
    const emptySlot = this.state.players.findIndex((p) => p === null);
    if (emptySlot === -1) {
      // Room is full
      conn.send(JSON.stringify({ type: "error", message: "Room is full" }));
      return;
    }

    const playerName = data.playerName || `Player ${emptySlot + 1}`;
    const newPlayer: Player = {
      id: conn.id,
      name: playerName,
      connected: true,
      rider: null,
      dragon: null,
      ready: false,
      deck: [],
    };

    this.state.players[emptySlot] = newPlayer;

    // First player becomes host
    if (this.state.hostId === null) {
      this.state.hostId = conn.id;
    }

    // If both players joined, move to setup
    if (this.state.players[0] && this.state.players[1]) {
      this.state.phase = "setup";
    }

    await this.saveState();
    this.broadcastState();

    // Send player their assignment
    conn.send(
      JSON.stringify({
        type: "player_assigned",
        playerNumber: emptySlot + 1,
        isHost: this.state.hostId === conn.id,
      })
    );
  }

  // Player selects rider
  async handleSelectRider(conn: Party.Connection, data: SelectRiderMessage) {
    const playerIndex = this.state.players.findIndex((p) => p && p.id === conn.id);
    if (playerIndex === -1) return;

    this.state.players[playerIndex]!.rider = data.rider;
    this.state.players[playerIndex]!.ready = false;

    await this.saveState();
    this.broadcastState();
  }

  // Player selects dragon
  async handleSelectDragon(conn: Party.Connection, data: SelectDragonMessage) {
    const playerIndex = this.state.players.findIndex((p) => p && p.id === conn.id);
    if (playerIndex === -1) return;

    this.state.players[playerIndex]!.dragon = data.dragon;
    this.state.players[playerIndex]!.ready = false;

    await this.saveState();
    this.broadcastState();
  }

  // Player marks ready
  async handleReady(conn: Party.Connection) {
    const playerIndex = this.state.players.findIndex((p) => p && p.id === conn.id);
    if (playerIndex === -1) return;

    const player = this.state.players[playerIndex]!;

    // Must have rider and dragon selected
    if (!player.rider || !player.dragon) return;

    player.ready = true;

    // Check if both players are ready
    const allReady = this.state.players.every((p) => p && p.ready);

    if (allReady && this.state.phase === "setup") {
      // Initialize draft
      this.state.phase = "draft";
      this.state.currentDrafter = 1;
      // Draft pool will be initialized by the host client
    }

    await this.saveState();
    this.broadcastState();
  }

  // Handle draft card selection
  async handleDraftCard(conn: Party.Connection, data: DraftCardMessage) {
    const playerIndex = this.state.players.findIndex((p) => p && p.id === conn.id);
    if (playerIndex === -1) return;

    // Verify it's this player's turn to draft
    if (this.state.currentDrafter !== playerIndex + 1) return;

    // Remove card from pool and add to player's deck
    const cardIndex = this.state.draftPool.indexOf(data.cardId);
    if (cardIndex === -1) return;

    this.state.draftPool.splice(cardIndex, 1);
    this.state.players[playerIndex]!.deck.push(data.cardId);

    // Switch drafter
    this.state.currentDrafter = this.state.currentDrafter === 1 ? 2 : 1;

    // Check if draft is complete (both have 20 cards)
    const p1DeckSize = this.state.players[0]?.deck.length || 0;
    const p2DeckSize = this.state.players[1]?.deck.length || 0;

    if (p1DeckSize >= 20 && p2DeckSize >= 20) {
      this.state.phase = "playing";
      // Game state will be initialized by the host client
    }

    await this.saveState();
    this.broadcastState();
  }

  // Handle game actions (attacks, cards, end turn)
  async handleGameAction(conn: Party.Connection, data: GameActionMessage) {
    // Forward to all clients - host will validate and update game state
    this.room.broadcast(
      JSON.stringify({
        type: "game_action",
        senderId: conn.id,
        action: data.action,
        cardId: data.cardId,
        target: data.target,
      })
    );
  }

  // Initialize draft pool (host only)
  async handleInitDraftPool(conn: Party.Connection, data: InitDraftPoolMessage) {
    // Only host can initialize draft pool
    if (conn.id !== this.state.hostId) return;

    this.state.draftPool = data.draftPool;
    await this.saveState();
    this.broadcastState();
  }

  // Update game state (host only)
  async handleUpdateGameState(conn: Party.Connection, data: UpdateGameStateMessage) {
    // Only host can update game state
    if (conn.id !== this.state.hostId) return;

    this.state.gameState = data.gameState;
    await this.saveState();
    this.broadcastState();
  }

  // Handle game ended (host only)
  async handleGameEnded(conn: Party.Connection, data: GameEndedMessage) {
    // Only host can end game
    if (conn.id !== this.state.hostId) return;

    this.state.phase = "ended";
    this.state.gameState = data.gameState;
    await this.saveState();
    this.broadcastState();
  }

  // CORS headers for cross-origin requests
  corsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }

  // Receive game state updates from host
  async onRequest(req: Party.Request): Promise<Response> {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: this.corsHeaders(),
      });
    }

    if (req.method === "GET") {
      return new Response("OK", {
        status: 200,
        headers: this.corsHeaders(),
      });
    }

    if (req.method === "POST") {
      const body = await req.json() as { type: string; gameState?: unknown; draftPool?: string[] };

      if (body.type === "update_game_state") {
        this.state.gameState = body.gameState;
        await this.saveState();
        this.broadcastState();
        return new Response("OK", { headers: this.corsHeaders() });
      }

      if (body.type === "init_draft_pool") {
        this.state.draftPool = body.draftPool || [];
        await this.saveState();
        this.broadcastState();
        return new Response("OK", { headers: this.corsHeaders() });
      }

      if (body.type === "game_ended") {
        this.state.phase = "ended";
        this.state.gameState = body.gameState;
        await this.saveState();
        this.broadcastState();
        return new Response("OK", { headers: this.corsHeaders() });
      }
    }

    return new Response("Not found - updated", { status: 404, headers: this.corsHeaders() });
  }

  // Handle chat messages
  async handleChat(conn: Party.Connection, data: ChatMessage) {
    const playerIndex = this.state.players.findIndex((p) => p && p.id === conn.id);
    const playerName = playerIndex !== -1
      ? this.state.players[playerIndex]!.name
      : "Unknown";

    this.room.broadcast(
      JSON.stringify({
        type: "chat",
        sender: playerName,
        message: data.message,
        timestamp: Date.now(),
      })
    );
  }
}
