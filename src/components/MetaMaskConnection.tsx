import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { useMetaMask } from "../hooks/useMetaMask";

interface MetaMaskConnectionProps {
  className?: string;
}

export function MetaMaskConnection({
  className = "",
}: MetaMaskConnectionProps) {
  const {
    address,
    isConnected: isWalletConnected,
    connectWallet,
    isConnecting,
    error: metamaskError,
    isMetaMaskInstalled,
  } = useMetaMask();

  console.log("[MetaMaskConnection] Component state:", {
    address,
    isWalletConnected,
    isConnecting,
    metamaskError,
    isMetaMaskInstalled,
  });

  const handleConnectWallet = async () => {
    console.log("[MetaMaskConnection] handleConnectWallet called");
    const result = await connectWallet();
    console.log("[MetaMaskConnection] connectWallet result:", result);
  };

  if (!isMetaMaskInstalled) {
    console.log(
      "[MetaMaskConnection] MetaMask not installed, showing install prompt"
    );
    return (
      <div
        className={`bg-amber-900/20 border border-amber-800/30 rounded-lg p-6 text-amber-300 ${className}`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-amber-400" />
          <div>
            <h3 className="font-medium text-lg mb-2">MetaMask Not Detected</h3>
            <p className="text-sm text-amber-200/80 mb-4">
              To play Lockblock, you need to install the MetaMask browser
              extension.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Install MetaMask
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isWalletConnected) {
    console.log(
      "[MetaMaskConnection] Wallet not connected, showing connect UI"
    );
    return (
      <div
        className={`bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-gray-700/40 rounded-lg p-6 ${className}`}
      >
        <div className="text-center space-y-4">
          <Wallet className="h-12 w-12 mx-auto text-blue-400 opacity-80" />
          <div>
            <h3
              className="font-medium text-lg mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "14px",
              }}
            >
              Connect Your Wallet
            </h3>
            <p
              className="text-sm text-gray-400 mb-6"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
              }}
            >
              Connect your MetaMask wallet to start playing Lockblock.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                marginTop: "5vh",
              }}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "10px",
                    }}
                  >
                    Connecting...
                  </span>
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "10px",
                    }}
                  >
                    Connect MetaMask
                  </span>
                </>
              )}
            </button>

            {metamaskError && (
              <p className="mt-4 text-sm text-red-400">{metamaskError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  console.log("[MetaMaskConnection] Wallet connected, showing connected UI");
  return (
    <div
      className={`bg-green-950/30 border border-green-700/40 rounded-lg p-6 ${className}`}
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Wallet className="h-5 w-5 text-green-400" />
          <span
            className="text-green-400 font-medium"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "12px",
            }}
          >
            Wallet Connected
          </span>
        </div>
        <p
          className="text-sm text-gray-400"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
          }}
        >
          {address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connected"}
        </p>
      </div>
    </div>
  );
}
