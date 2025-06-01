import { useState, useEffect } from 'react';
import type { WalletClient } from 'viem';
import type { Address } from 'viem';

/**
 * Simple store implementation for state management
 */
export class Store<T> {
  private state: T;
  private listeners: (() => void)[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * Get the current state
   */
  getState(): T {
    return this.state;
  }

  /**
   * Set a property in the state
   */
  set<K extends keyof T>(key: K, value: T[K]): void {
    this.state = { ...this.state, [key]: value };
    this.notifyListeners();
  }

  /**
   * Update the entire state
   */
  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

/**
 * Hook to use store state in React components
 */
export function useStore<T>(store: Store<T>): T {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);

  return state;
}

// Nitrolite Store State Interface
interface NitroliteStoreState {
  client: any; // NitroliteClient from the package
  isInitialized: boolean;
}

// Wallet Store State Interface
interface WalletStoreState {
  walletAddress: string | null;
  chainId: number | null;
  isConnected: boolean;
  channelOpen: boolean;
  walletClient: WalletClient | null;
  channelToken: Address | null;
  channelAmount: string | null;
}

// Create Nitrolite Store
const nitroliteStore = new Store<NitroliteStoreState>({
  client: null,
  isInitialized: false,
});

// Create Wallet Store
const walletStore = new Store<WalletStoreState>({
  walletAddress: null,
  chainId: null,
  isConnected: false,
  channelOpen: false,
  walletClient: null,
  channelToken: null,
  channelAmount: null,
});

// Nitrolite Store Actions
export const NitroliteStore = {
  state: nitroliteStore,
  
  setClient(client: any): void {
    nitroliteStore.set("client", client);
    nitroliteStore.set("isInitialized", true);
  },
  
  getClient(): any {
    return nitroliteStore.getState().client;
  },
  
  isInitialized(): boolean {
    return nitroliteStore.getState().isInitialized;
  },
  
  reset(): void {
    nitroliteStore.setState({
      client: null,
      isInitialized: false,
    });
  },
};

// Wallet Store Actions
export const WalletStore = {
  state: walletStore,
  
  setWalletAddress(address: string | null): void {
    walletStore.set("walletAddress", address);
  },
  
  setChainId(chainId: number | null): void {
    walletStore.set("chainId", chainId);
  },
  
  setConnected(isConnected: boolean): void {
    walletStore.set("isConnected", isConnected);
  },
  
  setChannelOpen(channelOpen: boolean): void {
    walletStore.set("channelOpen", channelOpen);
  },
  
  setWalletClient(walletClient: WalletClient | null): void {
    walletStore.set("walletClient", walletClient);
    
    if (walletClient?.account?.address) {
      walletStore.set("walletAddress", walletClient.account.address);
    }
  },
  
  setChannelToken(token: Address | null): void {
    walletStore.set("channelToken", token);
  },
  
  setChannelAmount(amount: string | null): void {
    walletStore.set("channelAmount", amount);
  },
  
  getWalletClient(): WalletClient | null {
    return walletStore.getState().walletClient;
  },
  
  getWalletAddress(): string | null {
    return walletStore.getState().walletAddress;
  },
  
  isConnected(): boolean {
    return walletStore.getState().isConnected;
  },
  
  isChannelOpen(): boolean {
    return walletStore.getState().channelOpen;
  },
  
  reset(): void {
    walletStore.setState({
      walletAddress: null,
      chainId: null,
      isConnected: false,
      channelOpen: false,
      walletClient: null,
      channelToken: null,
      channelAmount: null,
    });
  },
};