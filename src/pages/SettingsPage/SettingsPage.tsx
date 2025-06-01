import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Box,
  Switch,
  Container,
} from "@radix-ui/themes";

import paths from "../../routes/paths";
import { useFPSSettings } from "../../utils/fpsSettings";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { NitroliteConnection } from "../../components/nitrolite/NitroliteConnection";

const SettingsPage = () => {
  const { t } = useTranslation();
  const { showFPS, toggleFPS } = useFPSSettings();

  return (
    <Container size="2">
      <Flex direction="column" gap="6" py="6">
        {/* Header */}
        <Flex align="center" gap="3">
          <Link to={paths.index}>
            <Button variant="ghost" size="2">
              ← {t("common.back", "Back")}
            </Button>
          </Link>
          <Heading size="6">{t("settings.title", "Settings")}</Heading>
        </Flex>

        {/* Settings Cards */}
        <Flex direction="column" gap="4">
          {/* Performance Settings */}
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="4">
                {t("settings.performance.title", "Performance")}
              </Heading>

              {/* FPS Counter Toggle */}
              <Flex align="center" justify="between">
                <Flex direction="column" gap="1">
                  <Text size="3" weight="medium">
                    {t("settings.performance.fps_counter", "FPS Counter")}
                  </Text>
                  <Text size="2" color="gray">
                    {t(
                      "settings.performance.fps_counter_description",
                      "Show frames per second counter during gameplay"
                    )}
                  </Text>
                </Flex>
                <Switch
                  checked={showFPS}
                  onCheckedChange={toggleFPS}
                  size="2"
                />
              </Flex>
            </Flex>
          </Card>

          {/* Language Settings */}
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="4">
                {t("settings.language.title", "Language")}
              </Heading>

              <Flex align="center" justify="between">
                <Flex direction="column" gap="1">
                  <Text size="3" weight="medium">
                    {t("settings.language.select", "Select Language")}
                  </Text>
                  <Text size="2" color="gray">
                    {t(
                      "settings.language.description",
                      "Choose your preferred language for the interface"
                    )}
                  </Text>
                </Flex>
                <LanguageSwitcher />
              </Flex>
            </Flex>
          </Card>

          {/* Nitrolite Connection Settings */}
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="4">
                {t("settings.nitrolite.title", "Nitrolite Connection")}
              </Heading>

              <NitroliteConnection />
            </Flex>
          </Card>

          {/* Game Settings */}
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="4">{t("settings.game.title", "Game")}</Heading>

              <Text size="2" color="gray">
                {t(
                  "settings.game.coming_soon",
                  "More game settings coming soon..."
                )}
              </Text>
            </Flex>
          </Card>
        </Flex>

        {/* Action Buttons */}
        <Flex gap="3" justify="center" pt="4">
          <Link to={paths.game}>
            <Button size="3" variant="solid">
              {t("settings.play_game", "Play Game")}
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
};

export default SettingsPage;
