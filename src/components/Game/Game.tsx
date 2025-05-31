import Phaser from "phaser";
import type React from "react";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { GameScene } from "./GameScene";
import TouchControls from "./TouchControls";
import type { GameProps } from "./types";
import { getOptimalSettings } from "./performanceUtils";

const Game: React.FC<GameProps> = ({ onGameReady }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const gameSceneRef = useRef<GameScene | null>(null);

  // Prevent pinch zoom on mobile devices
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add event listeners to prevent zoom
    document.addEventListener("touchmove", preventZoom, { passive: false });
    document.addEventListener("touchstart", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventZoom);
      document.removeEventListener("touchstart", preventZoom);
    };
  }, []);

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const settings = getOptimalSettings();

      const config: Phaser.Types.Core.GameConfig = {
        type: settings.renderer === "CANVAS" ? Phaser.CANVAS : Phaser.WEBGL,
        width: 512,
        height: 512,
        parent: gameRef.current,
        fps: {
          target: settings.fps,
          forceSetTimeOut: true,
          smoothStep: true,
          panicMax: 120,
        },
        render: settings.render,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 1000 },
            debug: false,
            tileBias: settings.physics.tileBias,
            overlapBias: settings.physics.overlapBias,
            fps: settings.fps,
            fixedStep: false,
            timeScale: 1,
          },
        },
        scene: GameScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          fullscreenTarget: gameRef.current,
          expandParent: true,
          autoRound: true,
        },
        powerPreference: settings.powerPreference as
          | "high-performance"
          | "low-power",
        disableContextMenu: true,
        backgroundColor: "#87CEEB",
        loader: {
          crossOrigin: "anonymous",
          maxParallelDownloads: 4,
        },
        dom: {
          createContainer: false,
        },
        input: {
          touch: {
            capture: false,
          },
        },
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Wait for the scene to be properly initialized
      const checkScene = () => {
        const scene = phaserGameRef.current?.scene.getScene(
          "GameScene"
        ) as GameScene;
        if (scene?.scene?.isActive()) {
          gameSceneRef.current = scene;
          if (onGameReady) {
            onGameReady();
          }
        } else {
          setTimeout(checkScene, 100);
        }
      };

      // Start checking for scene readiness
      setTimeout(checkScene, 100);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onGameReady]);

  const handleTouchStart = (direction: "left" | "right" | "up") => {
    if (gameSceneRef.current) {
      const scene = gameSceneRef.current;
      if (direction === "left") {
        scene.setTouchControls(true, scene.isTouchingRight, scene.isTouchingUp);
      } else if (direction === "right") {
        scene.setTouchControls(scene.isTouchingLeft, true, scene.isTouchingUp);
      } else if (direction === "up") {
        scene.setTouchControls(
          scene.isTouchingLeft,
          scene.isTouchingRight,
          true
        );
      }
    }
  };

  const handleTouchEnd = (direction: "left" | "right" | "up") => {
    if (gameSceneRef.current) {
      const scene = gameSceneRef.current;
      if (direction === "left") {
        scene.setTouchControls(
          false,
          scene.isTouchingRight,
          scene.isTouchingUp
        );
      } else if (direction === "right") {
        scene.setTouchControls(scene.isTouchingLeft, false, scene.isTouchingUp);
      } else if (direction === "up") {
        scene.setTouchControls(
          scene.isTouchingLeft,
          scene.isTouchingRight,
          false
        );
      }
    }
  };

  return (
    <div className={styles.gameWrapper}>
      <div ref={gameRef} className={styles.gameContainer} />
      <TouchControls
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
};

export default Game;
