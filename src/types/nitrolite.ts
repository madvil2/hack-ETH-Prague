import type { Channel } from "@erc7824/nitrolite";
import type { Hex } from "viem";
import type {
  CryptoKeypair,
  WalletSigner,
} from "../utils/nitrolite/createSigner";

// Re-export the interfaces for convenience
export type { CryptoKeypair, WalletSigner };

// WebSocket status types
export type WSStatus =
  | "disconnected"
  | "connecting"
  | "authenticating"
  | "connected"
  | "auth_failed"
  | "error";

// WebSocket client options
export interface WebSocketClientOptions {
  autoReconnect: boolean;
  reconnectDelay: number;
  maxReconnectAttempts: number;
  requestTimeout: number;
}

// Nitrolite context type
export interface NitroliteContextType {
  client: any | null; // NitroliteClient
  loading: boolean;
  error: string | null;
}

// WebSocket context type
export interface WebSocketContextType {
  client: any | null; // WebSocketClient
  status: WSStatus;
  keyPair: CryptoKeypair | null;
  wsChannel: Channel | null;
  currentNitroliteChannel: Channel | null;
  isConnected: boolean;
  hasKeys: boolean;
  generateKeys: () => Promise<CryptoKeypair | null>;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  setNitroliteChannel: (channel: Channel) => void;
  clearKeys: () => void;
  sendPing: () => Promise<void>;
  sendRequest: (payload: string) => Promise<unknown>;
}

// Game state types for lockblock integration
export interface GameSession {
  id: string;
  players: string[];
  state: "waiting" | "active" | "finished";
  channelId?: string;
  createdAt: number;
}

// Channel management types
export interface ChannelInfo {
  channelId: string;
  participants: string[];
  allocations: Array<{
    destination: string;
    token: string;
    amount: bigint;
  }>;
  version: bigint;
  isOpen: boolean;
}

// Transaction types
export interface TransactionRequest {
  to: string;
  data: string;
  value?: bigint;
}

// Error types
export interface NitroliteError {
  code: string;
  message: string;
  details?: any;
}
