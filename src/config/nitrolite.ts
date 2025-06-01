import { polygon } from "viem/chains";
import type { ContractAddresses } from "@erc7824/nitrolite";

// Nitrolite configuration for lockblock game
export const NITROLITE_CONFIG = {
  // Chain configuration
  CHAIN: polygon,
  CHAIN_ID: 137,

  // WebSocket configuration
  WEBSOCKET: {
    URL: "wss://clearnet.yellow.com/ws",
    AUTO_RECONNECT: true,
    RECONNECT_DELAY: 1000,
    MAX_RECONNECT_ATTEMPTS: 5,
    REQUEST_TIMEOUT: 10000,
  },

  // Contract addresses for Polygon mainnet
  CONTRACT_ADDRESSES: {
    custody: "0x1096644156Ed58BF596e67d35827Adc97A25D940" as `0x${string}`,
    adjudicator: "0xa3f2f64455c9f8D68d9dCAeC2605D64680FaF898" as `0x${string}`,
    guestAddress: "0x3c93C321634a80FB3657CFAC707718A11cA57cBf" as `0x${string}`,
    tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as `0x${string}`, // USDC
  } as ContractAddresses,

  // Channel configuration
  CHALLENGE_DURATION: 100n,

  // Authentication
  AUTH: {
    DOMAIN: {
      name: "Nitro Aura",
      version: "1",
      chainId: 137,
      verifyingContract:
        "0xa3f2f64455c9f8D68d9dCAeC2605D64680FaF898" as `0x${string}`, // adjudicator address
    },
    SCOPE: "console",
    EXPIRE_TIME: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  },
};

// Storage keys
export const STORAGE_KEYS = {
  CRYPTO_KEYPAIR: "lockblock_crypto_keypair",
  JWT_TOKEN: "lockblock_jwt_token",
  CHANNEL_ID: "lockblock_channel_id",
  CHANNEL_STATE: "lockblock_channel_state",
};
