import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { NitroliteClient } from "@erc7824/nitrolite";
import type { NitroliteContextType } from "../types/nitrolite";
import { NITROLITE_CONFIG, STORAGE_KEYS } from "../config/nitrolite";
import { useMetaMask } from "../hooks/useMetaMask";
import { useWebSocketContext } from "./WebSocketContext";

const NitroliteContext = createContext<NitroliteContextType | undefined>(
  undefined,
);

export const NitroliteClientWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nitroliteClient, setNitroliteClient] =
    useState<NitroliteClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConnected: isMetaMaskConnected, signer: metaMaskSigner } =
    useMetaMask();
  const { keyPair, isConnected: isWebSocketConnected } = useWebSocketContext();

  // Initialize Nitrolite client when conditions are met
  useEffect(() => {
    const initializeNitroliteClient = async () => {
      // Check if all required conditions are met
      if (
        !isMetaMaskConnected ||
        !metaMaskSigner ||
        !keyPair ||
        !isWebSocketConnected
      ) {
        console.log("Waiting for all connections:", {
          metaMask: isMetaMaskConnected,
          webSocket: isWebSocketConnected,
          keyPair: !!keyPair,
          signer: !!metaMaskSigner,
        });
        return;
      }

      // Don't reinitialize if already exists
      if (nitroliteClient) {
        console.log("Nitrolite client already initialized");
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        console.log("Initializing Nitrolite client...");

        const client = new NitroliteClient({
          chainId: NITROLITE_CONFIG.CHAIN.ID,
          rpcUrl: NITROLITE_CONFIG.CHAIN.RPC_URL,
          contractAddress: NITROLITE_CONFIG.CONTRACT.ADDRESS,
          signer: metaMaskSigner,
        });

        // Store client reference
        setNitroliteClient(client);

        console.log("Nitrolite client initialized successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Failed to initialize Nitrolite client:", err);
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeNitroliteClient();
  }, [
    isMetaMaskConnected,
    metaMaskSigner,
    keyPair,
    isWebSocketConnected,
    nitroliteClient,
  ]);

  // Clean up client when MetaMask disconnects
  useEffect(() => {
    if (!isMetaMaskConnected && nitroliteClient) {
      console.log("MetaMask disconnected, cleaning up Nitrolite client");
      setNitroliteClient(null);
      setError(null);
    }
  }, [isMetaMaskConnected, nitroliteClient]);

  const contextValue: NitroliteContextType = {
    nitroliteClient,
    isInitializing,
    error,
    isReady: !!nitroliteClient && !isInitializing && !error,
  };

  return (
    <NitroliteContext.Provider value={contextValue}>
      {children}
    </NitroliteContext.Provider>
  );
};

export const useNitroliteClient = (): NitroliteContextType => {
  const context = useContext(NitroliteContext);
  if (context === undefined) {
    throw new Error(
      "useNitroliteClient must be used within a NitroliteClientWrapper",
    );
  }
  return context;
};
