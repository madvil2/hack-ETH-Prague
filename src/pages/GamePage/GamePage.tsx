import { useTranslation } from "react-i18next";
import { Heading, Flex, Button } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Game from "@/components/Game";
import paths from "@/routes/paths";
import { useMetaMask } from "../../hooks/useMetaMask";

const GamePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isConnected: isWalletConnected,
    address,
    isConnecting,
  } = useMetaMask();

  console.log("[GamePage] Rendered with wallet state:", {
    isWalletConnected,
    address,
  });

  useEffect(() => {
    // Add game-page class to body when component mounts
    document.body.classList.add("game-page");

    // Remove game-page class when component unmounts
    return () => {
      document.body.classList.remove("game-page");
    };
  }, []);

  useEffect(() => {
    console.log(
      "[GamePage] useEffect triggered - wallet connected:",
      isWalletConnected,
      "isConnecting:",
      isConnecting
    );
    // Redirect to settings if wallet is not connected and not currently connecting
    if (!isWalletConnected && !isConnecting) {
      console.log(
        "[GamePage] Wallet not connected and not connecting, redirecting to settings"
      );
      navigate(paths.settings);
    } else {
      console.log(
        "[GamePage] Wallet is connected or connecting, staying on game page"
      );
    }
  }, [isWalletConnected, isConnecting, navigate]);

  const handleGameReady = () => {
    // Game ready callback
  };

  console.log(
    "[GamePage] Rendering with isWalletConnected:",
    isWalletConnected
  );

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Heading size="6">{t("game.title", "Platformer Game")}</Heading>
        {isWalletConnected && (
          <Button
            onClick={() => navigate(paths.levelEditor)}
            variant="outline"
            size="3"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            +
          </Button>
        )}
      </Flex>

      {isWalletConnected ? (
        <>
          {console.log("[GamePage] Rendering Game component")}
          <Game onGameReady={handleGameReady} />
        </>
      ) : isConnecting ? (
        <>
          {console.log("[GamePage] Wallet connecting, showing loading")}
          <div>Connecting wallet...</div>
        </>
      ) : (
        <>
          {console.log("[GamePage] Wallet not connected, should redirect soon")}
          <div>Redirecting to settings...</div>
        </>
      )}
    </Flex>
  );
};

export default GamePage;
