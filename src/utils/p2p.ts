import Peer, { type DataConnection } from 'peerjs';
import type { GameState, NetworkMessage } from '../types/game';

export interface P2PEvents {
  onHostReady: (roomCode: string) => void;
  onGuestConnected: (guestName: string, avatar: string) => void;
  onConnectedToHost: () => void;
  onMessageReceived: (message: NetworkMessage) => void;
  onError: (errorMsg: string) => void;
  onDisconnected: () => void;
  onStatusChange?: (status: 'initializing' | 'waiting' | 'connecting' | 'connected' | 'error') => void;
}

// Robust ICE configuration: Google STUN + OpenRelay TURN (supports symmetric NAT and mobile cellular carriers)
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  // OpenRelay Public TURN servers for cellular networks (TCP & UDP)
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

export class P2PManager {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';
  private events: Partial<P2PEvents> = {};
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

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
   * Host creates an online room with a 4-6 digit room code
   */
  public createRoom(roomCode: string, _hostName: string, _avatar: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.isHost = true;
      this.roomCode = roomCode.toUpperCase().trim();
      const peerId = `uno-v3-${this.roomCode}`;
      this.events.onStatusChange?.('initializing');

      try {
        this.destroy();

        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: ICE_SERVERS,
            iceCandidatePoolSize: 10,
          },
        });

        this.peer.on('open', (id) => {
          this.events.onStatusChange?.('waiting');
          this.events.onHostReady?.(this.roomCode);
          resolve(id);
        });

        this.peer.on('connection', (connection) => {
          this.conn = connection;
          this.setupConnectionListeners(connection);
          this.events.onStatusChange?.('connected');
        });

        this.peer.on('error', (err) => {
          console.error('Peer host error:', err);
          let userMsg = 'Xona ochishda xatolik yuz berdi';
          if (err.type === 'unavailable-id') {
            userMsg = `"${this.roomCode}" kodi allaqachon ishlatilmoqda. Yangi xona kodi bilan urinib ko'ring.`;
          } else if (err.type === 'network') {
            userMsg = 'Internet tarmog\'iga ulanishda xato. Aloqani tekshiring.';
          } else if (err.type === 'server-error') {
            userMsg = 'Multiplayer serveri bilan aloqa sekin. Qayta urinib ko\'ring.';
          }
          this.events.onStatusChange?.('error');
          this.events.onError?.(userMsg);
          reject(new Error(userMsg));
        });

        this.peer.on('disconnected', () => {
          this.peer?.reconnect();
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'PeerJS ishga tushmadi';
        this.events.onStatusChange?.('error');
        reject(new Error(msg));
      }
    });
  }

  /**
   * Guest joins an online room using the host's room code
   */
  public joinRoom(roomCode: string, guestName: string, avatar: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isHost = false;
      this.roomCode = roomCode.toUpperCase().trim();
      const hostPeerId = `uno-v3-${this.roomCode}`;
      this.events.onStatusChange?.('connecting');

      try {
        this.destroy();

        // Guest connects with automatic ID
        this.peer = new Peer({
          debug: 1,
          config: {
            iceServers: ICE_SERVERS,
            iceCandidatePoolSize: 10,
          },
        });

        // 18-second timeout guard
        this.connectionTimeout = setTimeout(() => {
          if (!this.conn || !this.conn.open) {
            const timeoutMsg = 'Ulanish vaqti tugadi. Xona kodi to\'g\'riligini va host kutayotganini tekshiring.';
            this.events.onStatusChange?.('error');
            this.events.onError?.(timeoutMsg);
            reject(new Error(timeoutMsg));
          }
        }, 18000);

        this.peer.on('open', () => {
          if (!this.peer) return;

          const connection = this.peer.connect(hostPeerId, {
            reliable: true,
          });

          this.conn = connection;

          connection.on('open', () => {
            if (this.connectionTimeout) {
              clearTimeout(this.connectionTimeout);
              this.connectionTimeout = null;
            }
            this.setupConnectionListeners(connection);

            // Send player profile to host
            connection.send({
              type: 'PLAYER_JOIN',
              payload: { name: guestName, avatar },
              senderId: this.peer?.id || 'guest',
            });

            this.startPing();
            this.events.onStatusChange?.('connected');
            this.events.onConnectedToHost?.();
            resolve();
          });

          connection.on('error', (err) => {
            console.error('Connection to host error:', err);
            const userMsg = 'Hostga to\'g\'ridan-to\'g\'ri ulanib bo\'lmadi. Kodni qayta tekshiring.';
            this.events.onStatusChange?.('error');
            this.events.onError?.(userMsg);
            reject(new Error(userMsg));
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer guest error:', err);
          let userMsg = 'Xonaga ulanib bo\'lmadi.';
          if (err.type === 'peer-unavailable') {
            userMsg = `"${this.roomCode}" kodli xona topilmadi. Host xonani ochganiga ishonch hosil qiling.`;
          } else if (err.type === 'network') {
            userMsg = 'Internet tarmog\'i mavjud emas.';
          }
          this.events.onStatusChange?.('error');
          this.events.onError?.(userMsg);
          reject(new Error(userMsg));
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Ulanishda xato';
        this.events.onStatusChange?.('error');
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

  // Keep-alive ping every 10 seconds to avoid cellular NAT drops
  private startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.conn && this.conn.open) {
        try {
          this.conn.send({ type: 'PING' } as unknown as NetworkMessage);
        } catch {
          // ignore ping drop
        }
      }
    }, 10000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
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
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    this.stopPing();
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
