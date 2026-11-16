import Peer, { type DataConnection } from 'peerjs';
import type { GameState, NetworkMessage } from '../types/game';

export interface P2PEvents {
  onHostReady: (roomCode: string) => void;
  onGuestConnected: (guestName: string, avatar: string) => void;
  onConnectedToHost: () => void;
  onMessageReceived: (message: NetworkMessage) => void;
  onError: (errorMsg: string) => void;
  onDisconnected: () => void;
}

// Global reliable Google STUN servers to bypass NAT / Mobile Carrier firewalls
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

export class P2PManager {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';
  private events: Partial<P2PEvents> = {};

  constructor(events: Partial<P2PEvents>) {
    this.events = events;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  /**
   * Host creates an online room with a clean 4-6 digit code
   */
  public createRoom(roomCode: string, _hostName: string, _avatar: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.isHost = true;
      this.roomCode = roomCode.toUpperCase().trim();
      const peerId = `uno-v2-${this.roomCode}`;

      try {
        if (this.peer) {
          this.peer.destroy();
        }

        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: ICE_SERVERS,
          },
        });

        this.peer.on('open', (id) => {
          this.events.onHostReady?.(this.roomCode);
          resolve(id);
        });

        this.peer.on('connection', (connection) => {
          this.conn = connection;
          this.setupConnectionListeners(connection);
        });

        this.peer.on('error', (err) => {
          console.error('Peer host error:', err);
          let userMsg = 'Xona ochishda xatolik yuz berdi';
          if (err.type === 'unavailable-id') {
            userMsg = `"${this.roomCode}" kodi allaqachon band. Boshqa kod bilan urinib ko'ring.`;
          } else if (err.type === 'network') {
            userMsg = 'Internet tarmog\'iga ulanishda xato.';
          }
          this.events.onError?.(userMsg);
          reject(new Error(userMsg));
        });

        this.peer.on('disconnected', () => {
          // Reconnect automatically if cloud connection flickers
          this.peer?.reconnect();
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'PeerJS ishga tushmadi';
        reject(new Error(msg));
      }
    });
  }

  /**
   * Guest joins an online room using the code
   */
  public joinRoom(roomCode: string, guestName: string, avatar: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isHost = false;
      this.roomCode = roomCode.toUpperCase().trim();
      const hostPeerId = `uno-v2-${this.roomCode}`;

      try {
        if (this.peer) {
          this.peer.destroy();
        }

        // Guest gets a random peer ID
        this.peer = new Peer({
          debug: 1,
          config: {
            iceServers: ICE_SERVERS,
          },
        });

        this.peer.on('open', () => {
          if (!this.peer) return;

          const connection = this.peer.connect(hostPeerId, {
            reliable: true,
          });

          this.conn = connection;

          connection.on('open', () => {
            this.setupConnectionListeners(connection);
            // Send initial join payload to host
            connection.send({
              type: 'PLAYER_JOIN',
              payload: { name: guestName, avatar },
              senderId: this.peer?.id || 'guest',
            });
            this.events.onConnectedToHost?.();
            resolve();
          });

          connection.on('error', (err) => {
            console.error('Connection to host error:', err);
            const userMsg = 'Hostga ulanib bo\'lmadi. Xona kodini tekshiring.';
            this.events.onError?.(userMsg);
            reject(new Error(userMsg));
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer guest error:', err);
          let userMsg = 'Xonaga ulanib bo\'lmadi.';
          if (err.type === 'peer-unavailable') {
            userMsg = `"${this.roomCode}" kodli xona topilmadi. Kod to'g'riligiga ishonch hosil qiling.`;
          }
          this.events.onError?.(userMsg);
          reject(new Error(userMsg));
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Ulanishda xato';
        reject(new Error(msg));
      }
    });
  }

  private setupConnectionListeners(connection: DataConnection) {
    connection.on('data', (data) => {
      const msg = data as NetworkMessage;
      if (msg.type === 'PLAYER_JOIN') {
        this.events.onGuestConnected?.(msg.payload.name, msg.payload.avatar);
      }
      this.events.onMessageReceived?.(msg);
    });

    connection.on('close', () => {
      this.events.onDisconnected?.();
    });

    connection.on('error', (err) => {
      console.error('Data connection error:', err);
      this.events.onError?.('O\'yinchilar orasidagi aloqa uzildi.');
    });
  }

  /**
   * Send network message to the connected peer
   */
  public sendMessage(message: NetworkMessage) {
    if (this.conn && this.conn.open) {
      this.conn.send(message);
    }
  }

  /**
   * Host syncs state to guest
   */
  public syncState(state: GameState) {
    this.sendMessage({
      type: 'SYNC_STATE',
      payload: state,
      senderId: 'host',
    });
  }

  /**
   * Disconnect and clean up
   */
  public destroy() {
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
