import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  useRef,
} from "react";
import {
  type WebSocketClient,
  createWebSocketClient,
  type WSStatus,
} from "../utils/nitrolite/websocketClient";
import type { Channel } from "@erc7824/nitrolite";
import type {
  CryptoKeypair,
  WalletSigner,
  WebSocketContextType,
} from "../types/nitrolite";
import { NITROLITE_CONFIG, STORAGE_KEYS } from "../config/nitrolite";
import {
  generateKeyPair,
  createEthersSigner,
} from "../utils/nitrolite/createSigner";
import { getAddressFromPublicKey } from "../utils/nitrolite/websocketClient";
import { WalletStore } from "../store/nitroliteStore";

const WS_URL = NITROLITE_CONFIG.WEBSOCKET.URL;

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [keyPair, setKeyPair] = useState<CryptoKeypair | null>(null);
  const [currentSigner, setCurrentSigner] = useState<WalletSigner | null>(null);
  const [wsChannel, setWsChannel] = useState<Channel | null>(null);
  const [currentNitroliteChannel, setCurrentNitroliteChannel] =
    useState<Channel | null>(null);
  const clientRef = useRef<WebSocketClient | null>(null);

  // Load existing keys from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKeys = localStorage.getItem(STORAGE_KEYS.CRYPTO_KEYPAIR);

      if (savedKeys) {
        try {
          const parsed = JSON.parse(savedKeys) as CryptoKeypair;

          if (parsed.publicKey && !parsed.address) {
            parsed.address = getAddressFromPublicKey(parsed.publicKey);
            localStorage.setItem(
              STORAGE_KEYS.CRYPTO_KEYPAIR,
              JSON.stringify(parsed)
            );
          }
          setKeyPair(parsed);
          console.log("Loaded existing keys from storage");
        } catch (e) {
          console.error("Failed to parse saved keys - will generate new ones");
          localStorage.removeItem(STORAGE_KEYS.CRYPTO_KEYPAIR);
          generateNewKeysAndStore();
        }
      } else {
        console.log("No saved keys found - generating new ones");
        generateNewKeysAndStore();
      }
    }
  }, []);

  const generateNewKeysAndStore = async () => {
    try {
      const newKeyPair = await generateKeyPair();
      setKeyPair(newKeyPair);
      localStorage.setItem(
        STORAGE_KEYS.CRYPTO_KEYPAIR,
        JSON.stringify(newKeyPair)
      );
      console.log("Generated and stored new crypto keys");
      return newKeyPair;
    } catch (error) {
      console.error("Error generating and storing keys:", error);
      return null;
    }
  };

  const generateKeys = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        const savedKeys = localStorage.getItem(STORAGE_KEYS.CRYPTO_KEYPAIR);

        if (savedKeys) {
          try {
            const parsed = JSON.parse(savedKeys) as CryptoKeypair;

            if (
              parsed &&
              typeof parsed.privateKey === "string" &&
              typeof parsed.publicKey === "string"
            ) {
              if (parsed.publicKey && !parsed.address) {
                parsed.address = getAddressFromPublicKey(parsed.publicKey);
                localStorage.setItem(
                  STORAGE_KEYS.CRYPTO_KEYPAIR,
                  JSON.stringify(parsed)
                );
              }
              setKeyPair(parsed);
              const signer = createEthersSigner(parsed.privateKey);
              setCurrentSigner(signer);
              console.log("Using existing keys from storage");
              return parsed;
            }
          } catch (e) {
            console.error("Failed to parse saved keys:", e);
          }
        }

        // Generate new keys if none exist or parsing failed
        const newKeyPair = await generateKeyPair();
        setKeyPair(newKeyPair);
        localStorage.setItem(
          STORAGE_KEYS.CRYPTO_KEYPAIR,
          JSON.stringify(newKeyPair)
        );

        const signer = createEthersSigner(newKeyPair.privateKey);
        setCurrentSigner(signer);
        console.log("Generated new crypto keys");
        return newKeyPair;
      }
      return null;
    } catch (error) {
      console.error("Error in generateKeys:", error);
      return null;
    }
  }, []);

  const clearKeys = useCallback(() => {
    setKeyPair(null);
    setCurrentSigner(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CRYPTO_KEYPAIR);
    }
    console.log("Cleared crypto keys");
  }, []);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Attempting to connect to WebSocket...");

      // Ensure we have keys and signer
      let signer = currentSigner;
      if (!signer || !keyPair) {
        console.log("No signer found, generating keys...");
        const keys = await generateKeys();
        if (!keys) {
          throw new Error("Failed to generate keys");
        }
        signer = createEthersSigner(keys.privateKey);
        setCurrentSigner(signer);
      }

      // Create WebSocket client
      const client = createWebSocketClient(WS_URL, signer, {
        autoReconnect: NITROLITE_CONFIG.WEBSOCKET.AUTO_RECONNECT,
        reconnectDelay: NITROLITE_CONFIG.WEBSOCKET.RECONNECT_DELAY,
        maxReconnectAttempts: NITROLITE_CONFIG.WEBSOCKET.MAX_RECONNECT_ATTEMPTS,
        requestTimeout: NITROLITE_CONFIG.WEBSOCKET.REQUEST_TIMEOUT,
      });

      // Set up event handlers
      client.onStatusChange(setStatus);
      client.onError((error) => {
        console.error("WebSocket error:", error);
      });

      clientRef.current = client;

      // Connect
      await client.connect();
      console.log("WebSocket connected successfully");
      return true;
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setStatus("error");
      return false;
    }
  }, [currentSigner, keyPair, generateKeys]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setStatus("disconnected");
    setWsChannel(null);
    console.log("WebSocket disconnected");
  }, []);

  const setNitroliteChannel = useCallback((channel: Channel) => {
    setCurrentNitroliteChannel(channel);
    if (clientRef.current) {
      clientRef.current.setNitroliteChannel(channel);
    }
    console.log("Set Nitrolite channel:", channel);
  }, []);

  const sendPing = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.sendPing();
    } else {
      throw new Error("WebSocket client not connected");
    }
  }, []);

  const sendRequest = useCallback(async (payload: string): Promise<unknown> => {
    if (clientRef.current) {
      return await clientRef.current.sendRequest(payload);
    } else {
      throw new Error("WebSocket client not connected");
    }
  }, []);

  // Create signer when keyPair changes
  useEffect(() => {
    if (keyPair && keyPair.privateKey && !currentSigner) {
      try {
        const signer = createEthersSigner(keyPair.privateKey);
        setCurrentSigner(signer);
        console.log("Created signer from existing keyPair");
      } catch (error) {
        console.error("Failed to create signer from keyPair:", error);
      }
    }
  }, [keyPair, currentSigner]);

  const contextValue = useMemo<WebSocketContextType>(
    () => ({
      client: clientRef.current,
      status,
      keyPair,
      wsChannel,
      currentNitroliteChannel,
      isConnected: status === "connected",
      hasKeys: !!keyPair,
      generateKeys,
      connect,
      disconnect,
      setNitroliteChannel,
      clearKeys,
      sendPing,
      sendRequest,
    }),
    [
      status,
      keyPair,
      wsChannel,
      currentNitroliteChannel,
      generateKeys,
      connect,
      disconnect,
      setNitroliteChannel,
      clearKeys,
      sendPing,
      sendRequest,
    ]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
