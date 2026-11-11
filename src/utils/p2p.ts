import Peer, { type DataConnection } from 'peerjs';
import type { GameState, NetworkMessage } from '../types/game';

export interface P2PEvents {
  onConnected: (peerId: string) => void;
  onPlayerJoined: (playerName: string, avatar: string, connectionId: string) => void;
  onMessageReceived: (message: NetworkMessage) => void;
  onError: (error: string) => void;
  onDisconnected: () => void;
}

export class P2PManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private roomCode: string = '';
  private events: Partial<P2PEvents> = {};

  constructor(events: Partial<P2PEvents>) {
    this.events = events;
  }

  /**
   * Host creates a room with an easy 5-digit code
   */
  public createRoom(roomCode: string, _hostName: string, _avatar: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.roomCode = roomCode.toUpperCase().trim();
      const peerId = `uno-room-${this.roomCode}`;

      try {
        this.peer = new Peer(peerId, {
          debug: 1,
        });

        this.peer.on('open', (id) => {
          this.events.onConnected?.(id);
          resolve(this.roomCode);
        });

        this.peer.on('connection', (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.events.onError?.(err.message || 'Xonaga ulanishda xatolik yuz berdi');
          reject(err);
        });

        this.peer.on('disconnected', () => {
          this.events.onDisconnected?.();
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'PeerJS ishga tushmadi';
        reject(new Error(message));
      }
    });
  }

  /**
   * Guest joins an existing room using the 5-digit code
   */
  public joinRoom(roomCode: string, guestName: string, avatar: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomCode = roomCode.toUpperCase().trim();
      const hostPeerId = `uno-room-${this.roomCode}`;

      try {
        this.peer = new Peer({
          debug: 1,
        });

        this.peer.on('open', () => {
          if (!this.peer) return;
          const conn = this.peer.connect(hostPeerId, {
            reliable: true,
          });

          conn.on('open', () => {
            this.connections.set('host', conn);
            // Send initial join message
            conn.send({
              type: 'PLAYER_JOIN',
              payload: { name: guestName, avatar },
              senderId: this.peer?.id || 'guest',
            });
            this.events.onConnected?.(this.peer?.id || '');
            resolve();
          });

          conn.on('data', (data) => {
            this.events.onMessageReceived?.(data as NetworkMessage);
          });

          conn.on('close', () => {
            this.events.onDisconnected?.();
          });

          conn.on('error', (err) => {
            this.events.onError?.(err.message || 'Host bilan aloqa uzildi');
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer join error:', err);
          this.events.onError?.("Xona topilmadi yoki kod noto'g'ri: " + this.roomCode);
          reject(err);
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Xonaga ulanishda xato';
        reject(new Error(message));
      }
    });
  }

  private handleIncomingConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      const msg = data as NetworkMessage;
      if (msg.type === 'PLAYER_JOIN') {
        this.events.onPlayerJoined?.(msg.payload.name, msg.payload.avatar, conn.peer);
      }
      this.events.onMessageReceived?.(msg);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Broadcast message to all connected peers
   */
  public broadcast(message: NetworkMessage) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  /**
   * Broadcast updated game state to everyone
   */
  public broadcastState(gameState: GameState) {
    this.broadcast({
      type: 'SYNC_STATE',
      payload: gameState,
      senderId: 'host',
    });
  }

  /**
   * Disconnect and clean up
   */
  public destroy() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
