import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Box,
  Grid,
  Badge,
  Separator,
  Container,
} from "@radix-ui/themes";
import paths from "@/routes/paths";

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      {/* Hero Section */}
      <Container size={{ initial: "2", sm: "3", md: "4" }}>
        <Flex
          direction="column"
          align="center"
          gap={{ initial: "4", sm: "5", md: "6" }}
          py={{ initial: "6", sm: "8", md: "9" }}
        >
          <Badge
            size="2"
            color="blue"
            variant="solid"
            style={{
              backgroundColor: "#ff0080",
              color: "#000",
              border: "2px solid #ff0080",
              fontFamily: "Press Start 2P",
              fontSize: "10px",
              padding: "4px 8px",
            }}
          >
            NEW GAME
          </Badge>
          <Heading
            size={{ initial: "6", sm: "7", md: "9" }}
            align="center"
            weight="bold"
            style={{
              color: "#ff0080",
              fontFamily: "Press Start 2P",
              textShadow: "4px 4px 0px #000",
              marginBottom: "20px",
            }}
          >
            LOCKBLOCK
          </Heading>
          <Text
            size={{ initial: "3", sm: "4", md: "5" }}
            align="center"
            style={{
              color: "#8000ff",
              fontFamily: "Press Start 2P",
              textShadow: "2px 2px 0px #000",
              marginBottom: "30px",
              lineHeight: "1.8",
            }}
          >
            The Ultimate Blockchain Gaming Experience
          </Text>
          <Text
            size={{ initial: "2", sm: "3", md: "4" }}
            align="center"
            style={{
              maxWidth: "600px",
              color: "#cccccc",
              fontFamily: "monospace",
              padding: "0 10px",
            }}
          >
            Explore, own, and monetize custom platformer levels in a
            decentralized gaming ecosystem. Wager tokens, find the correct exit,
            and win rewards in this skill-based GameFi experience.
          </Text>
          <Flex gap="4" align="center">
            <Button
              size="4"
              asChild
              style={{
                backgroundColor: "#ff0080",
                color: "#ffffff",
                border: "3px solid #ff0080",
                fontFamily: "Press Start 2P",
                fontSize: "14px",
                padding: "15px 30px",
                boxShadow: "4px 4px 0px #000",
                textDecoration: "none",
              }}
            >
              <Link to={paths.game}>START PLAYING</Link>
            </Button>
            <Button
              size="4"
              variant="outline"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "3px solid #00d4ff",
                boxShadow: "4px 4px 0px #000",
              }}
            >
              LEARN MORE
            </Button>
          </Flex>
        </Flex>
      </Container>

      <Separator size="4" />

      {/* Core Features */}
      <Container
        size={{ initial: "2", sm: "3", md: "4" }}
        py={{ initial: "6", sm: "7", md: "8" }}
      >
        <Flex direction="column" gap={{ initial: "4", sm: "5", md: "6" }}>
          <Heading
            size={{ initial: "5", sm: "6", md: "8" }}
            align="center"
            style={{
              color: "#ff0080",
              fontFamily: "Press Start 2P",
              textShadow: "4px 4px 0px #000",
              marginBottom: "40px",
            }}
          >
            CORE FEATURES
          </Heading>
          <Grid
            columns={{ initial: "1", sm: "2", md: "3" }}
            gap={{ initial: "4", sm: "5", md: "6" }}
            width="auto"
          >
            <Card
              style={{
                backgroundColor: "#1a0a1a",
                border: "3px solid #ff0080",
                boxShadow: "4px 4px 0px #000",
              }}
            >
              <Flex direction="column" gap="3">
                <Badge
                  size="2"
                  color="green"
                  variant="solid"
                  style={{ backgroundColor: "#00ff41", color: "#000" }}
                >
                  NFT OWNERSHIP
                </Badge>
                <Heading
                  size="5"
                  style={{
                    color: "#ff0080",
                    fontFamily: "Press Start 2P",
                    marginBottom: "15px",
                  }}
                >
                  BUILD & OWN
                </Heading>
                <Text
                  style={{
                    color: "#8000ff",
                    fontFamily: "Press Start 2P",
                    fontSize: "10px",
                    lineHeight: "1.6",
                  }}
                >
                  Purchase land chunks as NFTs and build your empire in the
                  blockchain metaverse.
                </Text>
              </Flex>
            </Card>

            <Card
              style={{
                backgroundColor: "#1a0a1a",
                border: "3px solid #8000ff",
                boxShadow: "4px 4px 0px #000",
              }}
            >
              <Flex direction="column" gap="3">
                <Badge
                  variant="solid"
                  style={{
                    backgroundColor: "#8000ff",
                    color: "#000",
                    fontFamily: "Press Start 2P",
                    fontSize: "8px",
                  }}
                >
                  PLAY-TO-EARN
                </Badge>
                <Heading
                  size="5"
                  style={{
                    color: "#8000ff",
                    fontFamily: "Press Start 2P",
                    marginBottom: "15px",
                  }}
                >
                  EARN TOKENS
                </Heading>
                <Text
                  style={{
                    color: "#ff0080",
                    fontFamily: "Press Start 2P",
                    fontSize: "10px",
                    lineHeight: "1.6",
                  }}
                >
                  Complete challenges, defeat enemies, and collect rewards in
                  our native LOCK tokens.
                </Text>
              </Flex>
            </Card>

            <Card
              style={{
                backgroundColor: "#1a0a1a",
                border: "3px solid #0080ff",
                boxShadow: "4px 4px 0px #000",
              }}
            >
              <Flex direction="column" gap="3">
                <Badge
                  variant="solid"
                  style={{
                    backgroundColor: "#0080ff",
                    color: "#000",
                    fontFamily: "Press Start 2P",
                    fontSize: "8px",
                  }}
                >
                  MULTIPLAYER
                </Badge>
                <Heading
                  size="5"
                  style={{
                    color: "#0080ff",
                    fontFamily: "Press Start 2P",
                    marginBottom: "15px",
                  }}
                >
                  COMPETE & COLLABORATE
                </Heading>
                <Text
                  style={{
                    color: "#ff8000",
                    fontFamily: "Press Start 2P",
                    fontSize: "10px",
                    lineHeight: "1.6",
                  }}
                >
                  Join forces with other players or compete in epic battles
                  across the blockchain universe.
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>

      <Separator size="4" />

      {/* Token Economy */}
      <Container
        size={{ initial: "2", sm: "3", md: "4" }}
        py={{ initial: "6", sm: "7", md: "8" }}
      >
        <Flex direction="column" gap={{ initial: "4", sm: "5", md: "6" }}>
          <Heading
            size={{ initial: "5", sm: "6", md: "8" }}
            align="center"
            style={{
              color: "#ff8000",
              fontFamily: "Press Start 2P",
              textShadow: "4px 4px 0px #000",
              marginBottom: "40px",
            }}
          >
            TOKEN ECONOMY
          </Heading>
          <Grid
            columns={{ initial: "1", sm: "1", md: "2" }}
            gap={{ initial: "4", sm: "5", md: "6" }}
          >
            <Card
              size="3"
              style={{
                backgroundColor: "#0f3460",
                border: "3px solid #00d4ff",
              }}
            >
              <Flex direction="column" gap="4">
                <Heading size="5" style={{ color: "#00d4ff" }}>
                  ENTRY FEE DISTRIBUTION
                </Heading>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                      REWARD POOL
                    </Text>
                    <Badge
                      color="green"
                      style={{ backgroundColor: "#00ff41", color: "#000" }}
                    >
                      60%
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                      CHUNK OWNER
                    </Text>
                    <Badge
                      color="blue"
                      style={{ backgroundColor: "#00d4ff", color: "#000" }}
                    >
                      25%
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                      PROTOCOL TREASURY
                    </Text>
                    <Badge
                      color="orange"
                      style={{ backgroundColor: "#ff6b35", color: "#000" }}
                    >
                      10%
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                      MODERATION FUND
                    </Text>
                    <Badge
                      color="purple"
                      style={{ backgroundColor: "#a855f7", color: "#000" }}
                    >
                      5%
                    </Badge>
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            <Card
              size="3"
              style={{
                backgroundColor: "#0f3460",
                border: "3px solid #ff6b35",
              }}
            >
              <Flex direction="column" gap="4">
                <Heading size="5" style={{ color: "#ff6b35" }}>
                  REWARD MECHANICS
                </Heading>
                <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                  Winners receive{" "}
                  <strong style={{ color: "#00ff41" }}>D × N TOKENS</strong>,
                  where D is the entry deposit and N is the number of exits in
                  the level.
                </Text>
                <Text style={{ color: "#ffffff", fontFamily: "monospace" }}>
                  Higher risk levels with more exits offer greater rewards but
                  lower probability of winning.
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>

      <Separator size="4" />

      {/* How It Works */}
      <Container
        size={{ initial: "2", sm: "3", md: "4" }}
        py={{ initial: "6", sm: "7", md: "8" }}
      >
        <Flex direction="column" gap={{ initial: "4", sm: "5", md: "6" }}>
          <Heading
            size={{ initial: "5", sm: "6", md: "8" }}
            align="center"
            style={{
              color: "#ff0080",
              fontFamily: "Press Start 2P",
              textShadow: "4px 4px 0px #000",
              marginBottom: "40px",
            }}
          >
            HOW IT WORKS
          </Heading>
          <Grid
            columns={{ initial: "1", sm: "2", md: "4" }}
            gap={{ initial: "4", sm: "4", md: "4" }}
          >
            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0",
                  backgroundColor: "#ff0080",
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                1
              </Box>
              <Heading size="4" align="center" style={{ color: "#00ff41" }}>
                EXPLORE MAP
              </Heading>
              <Text
                size="2"
                align="center"
                style={{
                  color: "#8000ff",
                  fontFamily: "Press Start 2P",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                Connect your wallet and purchase LOCK tokens to enter the game
                world.
              </Text>
            </Flex>

            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0",
                  backgroundColor: "#8000ff",
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                2
              </Box>
              <Heading size="4" align="center" style={{ color: "#00d4ff" }}>
                DEPOSIT TOKENS
              </Heading>
              <Text
                size="2"
                align="center"
                style={{
                  color: "#ff0080",
                  fontFamily: "Press Start 2P",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                Choose your land chunk and start building your custom platformer
                level.
              </Text>
            </Flex>

            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0",
                  backgroundColor: "#0080ff",
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                3
              </Box>
              <Heading size="4" align="center" style={{ color: "#ff6b35" }}>
                PLAY LEVEL
              </Heading>
              <Text
                size="2"
                align="center"
                style={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                Navigate the platformer level and choose the correct exit
              </Text>
            </Flex>

            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0",
                  backgroundColor: "#a855f7",
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                4
              </Box>
              <Heading size="4" align="center" style={{ color: "#a855f7" }}>
                WIN REWARDS
              </Heading>
              <Text
                size="2"
                align="center"
                style={{
                  color: "#ff8000",
                  fontFamily: "Press Start 2P",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                Play levels, earn LOCK tokens, and compete with players
                worldwide!
              </Text>
            </Flex>
          </Grid>
        </Flex>
      </Container>

      <Separator size="4" />

      {/* CTA Section */}
      <Container
        size={{ initial: "2", sm: "3", md: "4" }}
        py={{ initial: "6", sm: "7", md: "9" }}
      >
        <Card
          size="4"
          style={{
            backgroundColor: "#1a0a1a",
            border: "3px solid #ff0080",
            boxShadow: "4px 4px 0px #000",
          }}
        >
          <Flex
            direction="column"
            align="center"
            gap={{ initial: "4", sm: "5", md: "6" }}
            p={{ initial: "4", sm: "5", md: "6" }}
          >
            <Heading
              size={{ initial: "4", sm: "5", md: "6" }}
              align="center"
              style={{
                color: "#ff0080",
                textShadow: "4px 4px 0px #000",
              }}
            >
              READY TO START YOUR ADVENTURE?
            </Heading>
            <Text
              size={{ initial: "2", sm: "3", md: "4" }}
              align="center"
              style={{
                color: "#8000ff",
                fontFamily: "Press Start 2P",
                padding: "0 10px",
              }}
            >
              Join the decentralized gaming revolution. Own land, create levels,
              and earn rewards.
            </Text>
            <Flex
              gap={{ initial: "3", sm: "4", md: "4" }}
              align="center"
              direction={{ initial: "column", sm: "row" }}
            >
              <Button
                size={{ initial: "3", sm: "4", md: "4" }}
                asChild
                style={{
                  backgroundColor: "#ff0080",
                  color: "#ffffff",
                  border: "3px solid #ff0080",
                  boxShadow: "4px 4px 0px #000",
                  width: "100%",
                  maxWidth: "200px",
                }}
              >
                <Link to={paths.game}>LAUNCH GAME</Link>
              </Button>
              <Button
                size={{ initial: "3", sm: "4", md: "4" }}
                variant="outline"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "3px solid #00d4ff",
                  boxShadow: "4px 4px 0px #000",
                  width: "100%",
                  maxWidth: "200px",
                }}
              >
                VIEW WHITEPAPER
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
};

export default MainPage;
