import type React from "react";
import { useState, useEffect } from "react";
import { Button, Card, Text, Flex, Badge, Spinner } from "@radix-ui/themes";
import { useMetaMask } from "../../hooks/useMetaMask";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useNitroliteClient } from "../../context/NitroliteClientWrapper";
import { useNitroliteIntegration } from "../../hooks/useNitroliteIntegration";

export const NitroliteConnection: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<string>("");

  const {
    isConnected: isMetaMaskConnected,
    connect: connectMetaMask,
    account,
    isConnecting: isMetaMaskConnecting,
  } = useMetaMask();

  const {
    isConnected: isWebSocketConnected,
    connect: connectWebSocket,
    status: wsStatus,
    hasKeys,
  } = useWebSocketContext();

  const {
    nitroliteClient,
    isReady: isNitroliteReady,
    isInitializing: isNitroliteInitializing,
    error: nitroliteError,
  } = useNitroliteClient();

  const {
    currentChannel,
    isReady: isIntegrationReady,
    isInitializing: isIntegrationInitializing,
    error: integrationError,
  } = useNitroliteIntegration();

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Step 1: Connect MetaMask
      if (!isMetaMaskConnected) {
        setConnectionStep("Connecting to MetaMask...");
        const metaMaskSuccess = await connectMetaMask();
        if (!metaMaskSuccess) {
          throw new Error("Failed to connect to MetaMask");
        }
      }

      // Step 2: Connect WebSocket
      if (!isWebSocketConnected) {
        setConnectionStep("Connecting to WebSocket...");
        const wsSuccess = await connectWebSocket();
        if (!wsSuccess) {
          throw new Error("Failed to connect to WebSocket");
        }
      }

      setConnectionStep("Initializing Nitrolite...");
      // Nitrolite client and integration will initialize automatically
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
      setConnectionStep("");
    }
  };

  const getConnectionStatus = () => {
    if (isIntegrationReady) {
      return {
        status: "connected",
        text: "Fully Connected",
        color: "green" as const,
      };
    }

    if (isConnecting || isNitroliteInitializing || isIntegrationInitializing) {
      return {
        status: "connecting",
        text: "Connecting...",
        color: "yellow" as const,
      };
    }

    if (nitroliteError || integrationError) {
      return {
        status: "error",
        text: "Connection Error",
        color: "red" as const,
      };
    }

    if (!isMetaMaskConnected) {
      return {
        status: "disconnected",
        text: "MetaMask Not Connected",
        color: "gray" as const,
      };
    }

    if (!isWebSocketConnected) {
      return {
        status: "disconnected",
        text: "WebSocket Not Connected",
        color: "gray" as const,
      };
    }

    if (!isNitroliteReady) {
      return {
        status: "disconnected",
        text: "Nitrolite Not Ready",
        color: "gray" as const,
      };
    }

    return {
      status: "disconnected",
      text: "Disconnected",
      color: "gray" as const,
    };
  };

  const connectionStatus = getConnectionStatus();
  const showConnectButton =
    !isIntegrationReady &&
    !isConnecting &&
    !isNitroliteInitializing &&
    !isIntegrationInitializing;

  return (
    <Card style={{ padding: "16px", margin: "16px 0" }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            Nitrolite Connection
          </Text>
          <Badge color={connectionStatus.color}>{connectionStatus.text}</Badge>
        </Flex>

        {connectionStep && (
          <Flex align="center" gap="2">
            <Spinner size="1" />
            <Text size="2" color="gray">
              {connectionStep}
            </Text>
          </Flex>
        )}

        <Flex direction="column" gap="2">
          <Flex justify="between" align="center">
            <Text size="2">MetaMask:</Text>
            <Badge color={isMetaMaskConnected ? "green" : "gray"}>
              {isMetaMaskConnected ? "Connected" : "Disconnected"}
            </Badge>
          </Flex>

          {isMetaMaskConnected && account && (
            <Text size="1" color="gray">
              Account: {account.slice(0, 6)}...{account.slice(-4)}
            </Text>
          )}

          <Flex justify="between" align="center">
            <Text size="2">WebSocket:</Text>
            <Badge
              color={
                isWebSocketConnected
                  ? "green"
                  : wsStatus === "connecting"
                    ? "yellow"
                    : "gray"
              }
            >
              {wsStatus === "connected"
                ? "Connected"
                : wsStatus === "connecting"
                  ? "Connecting"
                  : wsStatus === "error"
                    ? "Error"
                    : "Disconnected"}
            </Badge>
          </Flex>

          <Flex justify="between" align="center">
            <Text size="2">Crypto Keys:</Text>
            <Badge color={hasKeys ? "green" : "gray"}>
              {hasKeys ? "Generated" : "Not Generated"}
            </Badge>
          </Flex>

          <Flex justify="between" align="center">
            <Text size="2">Nitrolite Client:</Text>
            <Badge
              color={
                isNitroliteReady
                  ? "green"
                  : isNitroliteInitializing
                    ? "yellow"
                    : "gray"
              }
            >
              {isNitroliteReady
                ? "Ready"
                : isNitroliteInitializing
                  ? "Initializing"
                  : "Not Ready"}
            </Badge>
          </Flex>

          <Flex justify="between" align="center">
            <Text size="2">Channel:</Text>
            <Badge
              color={
                currentChannel
                  ? "green"
                  : isIntegrationInitializing
                    ? "yellow"
                    : "gray"
              }
            >
              {currentChannel
                ? "Connected"
                : isIntegrationInitializing
                  ? "Initializing"
                  : "Not Connected"}
            </Badge>
          </Flex>

          {currentChannel && (
            <Text size="1" color="gray">
              Channel ID: {currentChannel.id.slice(0, 8)}...
              {currentChannel.id.slice(-4)}
            </Text>
          )}
        </Flex>

        {(nitroliteError || integrationError) && (
          <Text size="2" color="red">
            Error: {nitroliteError || integrationError}
          </Text>
        )}

        {showConnectButton && (
          <Button
            onClick={handleConnect}
            disabled={isMetaMaskConnecting}
            style={{ marginTop: "8px" }}
          >
            {isMetaMaskConnecting ? "Connecting..." : "Connect to Nitrolite"}
          </Button>
        )}

        {isIntegrationReady && (
          <Text
            size="2"
            color="green"
            style={{ textAlign: "center", marginTop: "8px" }}
          >
            ✅ Nitrolite is ready for use!
          </Text>
        )}
      </Flex>
    </Card>
  );
};
