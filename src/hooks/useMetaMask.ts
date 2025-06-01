import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface MetaMaskState {
  isConnected: boolean;
  address: string;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  error: string | null;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>(() => {
    // Try to restore state from localStorage
    try {
      const savedState = localStorage.getItem("metamask-state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          isConnected: parsed.isConnected || false,
          address: parsed.address || "",
          provider: null, // Provider will be recreated
          isConnecting: false,
          error: null,
        };
      }
    } catch (error) {
      console.error(
        "[useMetaMask] Error restoring state from localStorage:",
        error
      );
    }

    return {
      isConnected: false,
      address: "",
      provider: null,
      isConnecting: false,
      error: null,
    };
  });

  console.log("[useMetaMask] Current state:", state);

  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = useCallback((): boolean => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  }, []);

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    console.log("[useMetaMask] connectWallet called");
    try {
      console.log("[useMetaMask] Setting isConnecting to true");
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      if (!checkIfMetaMaskInstalled()) {
        console.log("[useMetaMask] MetaMask not installed");
        throw new Error("MetaMask is not installed");
      }

      console.log("[useMetaMask] MetaMask detected, requesting accounts");
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);

      // Request accounts access
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("[useMetaMask] Accounts received:", accounts);
      const address = ethers.getAddress(accounts[0]);
      console.log("[useMetaMask] Formatted address:", address);

      // Update state with connection details
      const newState = {
        isConnected: true,
        address,
        provider,
        isConnecting: false,
        error: null,
      };
      console.log("[useMetaMask] Setting new state:", newState);
      setState(newState);
      // Save to localStorage
      localStorage.setItem(
        "metamask-state",
        JSON.stringify({
          isConnected: true,
          address,
        })
      );

      console.log(
        "[useMetaMask] Connection successful, returning address:",
        address
      );
      return address;
    } catch (error: any) {
      console.error("[useMetaMask] Error connecting to MetaMask:", error);
      const errorState = {
        isConnecting: false,
        isConnected: false,
        error: error.message || "Failed to connect to MetaMask",
      };
      console.log("[useMetaMask] Setting error state:", errorState);
      setState((prev) => ({
        ...prev,
        ...errorState,
      }));
      return null;
    }
  }, [checkIfMetaMaskInstalled]);

  // Disconnect from MetaMask
  const disconnectWallet = useCallback(async () => {
    try {
      // MetaMask cannot be programmatically disconnected for security reasons
      // Instead, we clear the local state and request new permissions
      // This effectively simulates a disconnect by requiring user to reconnect
      if (checkIfMetaMaskInstalled()) {
        const { ethereum } = window as any;
        // Request new permissions to simulate disconnect
        await ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      // User cancelled or error occurred, still clear local state
      console.log("Disconnect cancelled or error:", error);
    } finally {
      // Always clear local state
      setState({
        isConnected: false,
        address: "",
        provider: null,
        isConnecting: false,
        error: null,
      });

      // Clear localStorage
      localStorage.removeItem("metamask-state");
    }
  }, [checkIfMetaMaskInstalled]);

  // Listen for account changes
  useEffect(() => {
    if (!checkIfMetaMaskInstalled()) return;

    const { ethereum } = window as any;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("[useMetaMask] Accounts changed:", accounts);
      if (accounts.length === 0) {
        // User disconnected
        setState((prev) => ({
          ...prev,
          isConnected: false,
          address: "",
          provider: null,
        }));
        // Clear localStorage
        localStorage.removeItem("metamask-state");
      } else {
        // User switched accounts
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const newAddress = ethers.getAddress(accounts[0]);
        setState((prev) => ({
          ...prev,
          isConnected: true,
          address: newAddress,
          provider,
        }));
        // Update localStorage
        localStorage.setItem(
          "metamask-state",
          JSON.stringify({
            isConnected: true,
            address: newAddress,
          })
        );
      }
    };

    const handleChainChanged = () => {
      // Handle chain change by refreshing the page
      window.location.reload();
    };

    // Subscribe to events
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    // Check if already connected
    console.log("[useMetaMask] Checking existing accounts");
    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        console.log("[useMetaMask] Existing accounts found:", accounts);
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(ethereum);
          const connectedState = {
            isConnected: true,
            address: ethers.getAddress(accounts[0]),
            provider,
            isConnecting: false,
            error: null,
          };
          console.log(
            "[useMetaMask] Setting connected state from existing accounts:",
            connectedState
          );
          setState(connectedState);
          // Save to localStorage
          localStorage.setItem(
            "metamask-state",
            JSON.stringify({
              isConnected: true,
              address: connectedState.address,
            })
          );
        } else {
          console.log("[useMetaMask] No existing accounts found");
        }
      })
      .catch((err: Error) => {
        console.error("[useMetaMask] Error checking accounts:", err);
      });

    // Cleanup listeners on unmount
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [checkIfMetaMaskInstalled, disconnectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled: checkIfMetaMaskInstalled(),
  };
}
