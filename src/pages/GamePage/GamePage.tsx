import { useTranslation } from "react-i18next";
import { Heading, Flex, Button, Container, Card, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Game from "@/components/Game";
import paths from "@/routes/paths";
import { MetaMaskConnection } from "@/components/MetaMaskConnection";
import { useMetaMask } from "../../hooks/useMetaMask";

const GamePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isConnected: isWalletConnected, address } = useMetaMask();

  useEffect(() => {
    // Add game-page class to body when component mounts
    document.body.classList.add("game-page");

    // Remove game-page class when component unmounts
    return () => {
      document.body.classList.remove("game-page");
    };
  }, []);

  const handleGameReady = () => {
    // Game ready callback
  };

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

      {!isWalletConnected ? (
        <Container size="2">
          <Card>
            <Flex direction="column" gap="4" p="6" align="center">
              <Heading size="4">
                {t("game.wallet_required", "Wallet Connection Required")}
              </Heading>
              <Text size="3" color="gray" align="center">
                {t(
                  "game.wallet_required_description",
                  "Please connect your MetaMask wallet to start playing the game."
                )}
              </Text>
              <MetaMaskConnection />
            </Flex>
          </Card>
        </Container>
      ) : (
        <Game onGameReady={handleGameReady} />
      )}
    </Flex>
  );
};

export default GamePage;
