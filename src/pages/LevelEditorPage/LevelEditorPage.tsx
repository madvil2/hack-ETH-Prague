import { useTranslation } from "react-i18next";
import { Heading, Flex, Button, Grid, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import styles from "./styles.module.scss";

const TILE_TYPES = {
  "*": { name: "Empty", color: "#87CEEB", texture: "/sprites/sky_tile.png" },
  p: {
    name: "Platform",
    color: "#8B4513",
    texture: "/sprites/platform_tile.png",
  },
  F: { name: "Fire", color: "#FF4500", texture: "/sprites/fire_sheet.png" },
  E: { name: "Exit", color: "#32CD32", texture: "/sprites/flag_sheet.png" },
  J: {
    name: "Jump Pad",
    color: "#FFD700",
    texture: "/sprites/boing_sheet.png",
  },
  "+": {
    name: "Player Start",
    color: "#FF69B4",
    texture: "/sprites/Knight.png",
  },
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
                border: `3px solid ${info.color}`,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={info.texture}
                alt={info.name}
                style={{
                  width: "24px",
                  height: "24px",
                  objectFit: "cover",
                  imageRendering: "pixelated",
                }}
              />
              {info.name}
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
                    backgroundImage: `url(${
                      TILE_TYPES[tile as keyof typeof TILE_TYPES]?.texture ||
                      "/sprites/sky_tile.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    imageRendering: "pixelated",
                  }}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  title={`${rowIndex},${colIndex}: ${
                    TILE_TYPES[tile as keyof typeof TILE_TYPES]?.name || tile
                  }`}
                ></button>
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
