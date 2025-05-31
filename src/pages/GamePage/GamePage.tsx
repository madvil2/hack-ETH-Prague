import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Flex } from "@radix-ui/themes";
import Game from "@/components/Game";

const GamePage = () => {
  const { t } = useTranslation();
  const [isGameReady, setIsGameReady] = useState(false);

  const handleGameReady = () => {
    setIsGameReady(true);
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="6" align="center">
        {t("game.title", "Platformer Game")}
      </Heading>
      <Game onGameReady={handleGameReady} />
    </Flex>
  );
};

export default GamePage;
