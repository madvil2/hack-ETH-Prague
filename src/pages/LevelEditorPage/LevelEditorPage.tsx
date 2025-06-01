import { useTranslation } from "react-i18next";
import { Heading, Flex, Button, Grid, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import styles from "./styles.module.scss";

const TILE_TYPES = {
  "*": { name: "Empty", color: "#87CEEB" },
  p: { name: "Platform", color: "#8B4513" },
  F: { name: "Fire", color: "#FF4500" },
  E: { name: "Exit", color: "#32CD32" },
  J: { name: "Jump Pad", color: "#FFD700" },
  "+": { name: "Player Start", color: "#FF69B4" },
};

const LevelEditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTile, setSelectedTile] = useState("*");
  const [mapData, setMapData] = useState(() => {
    // Initialize with empty 16x16 grid
    return Array(16)
      .fill(null)
      .map(() => Array(16).fill("*"));
  });

  const handleTileClick = (row: number, col: number) => {
    const newMapData = [...mapData];
    newMapData[row][col] = selectedTile;
    setMapData(newMapData);
  };

  const exportMap = () => {
    const mapString = mapData
      .map((row) => `['${row.join("', '")}'],`)
      .join("\n");

    const blob = new Blob([mapString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom_map.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearMap = () => {
    setMapData(
      Array(16)
        .fill(null)
        .map(() => Array(16).fill("*"))
    );
  };

  return (
    <Flex direction="column" gap="4" className={styles.container}>
      <Flex justify="between" align="center">
        <Heading size="6">{t("levelEditor.title", "Level Editor")}</Heading>
        <Button onClick={() => navigate(paths.game)} variant="outline">
          ← Back to Game
        </Button>
      </Flex>

      {/* Tile Palette */}
      <Flex direction="column" gap="2">
        <Text size="3" weight="bold">
          Tile Palette:
        </Text>
        <Flex gap="2" wrap="wrap">
          {Object.entries(TILE_TYPES).map(([symbol, info]) => (
            <Button
              key={symbol}
              onClick={() => setSelectedTile(symbol)}
              variant={selectedTile === symbol ? "solid" : "outline"}
              style={{
                backgroundColor:
                  selectedTile === symbol ? info.color : "transparent",
                color: selectedTile === symbol ? "white" : info.color,
                border: `2px solid ${info.color}`,
              }}
            >
              {symbol} - {info.name}
            </Button>
          ))}
        </Flex>
      </Flex>

      {/* Map Grid */}
      <Flex direction="column" gap="2">
        <Text size="3" weight="bold">
          Map Grid (16x16):
        </Text>
        <div className={styles.mapGrid}>
          {mapData.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.mapRow}>
              {row.map((tile, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={styles.mapTile}
                  style={{
                    backgroundColor:
                      TILE_TYPES[tile as keyof typeof TILE_TYPES]?.color ||
                      "#87CEEB",
                  }}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  title={`${rowIndex},${colIndex}: ${tile}`}
                >
                  {tile}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Flex>

      {/* Controls */}
      <Flex gap="3">
        <Button onClick={exportMap} variant="solid">
          Export Map
        </Button>
        <Button onClick={clearMap} variant="outline" color="red">
          Clear Map
        </Button>
      </Flex>
    </Flex>
  );
};

export default LevelEditorPage;
