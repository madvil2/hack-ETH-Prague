import Phaser from "phaser";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { GameScene } from "./GameScene";
import TouchControls from "./TouchControls";
import type { GameProps } from "./types";
import { getOptimalSettings } from "./performanceUtils";

const Game: React.FC<GameProps> = ({ onGameReady }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const gameSceneRef = useRef<GameScene | null>(null);
  const [currentMap, setCurrentMap] = useState<number>(1);
  const totalMaps = 2; // Currently we have 2 maps, can be expanded
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-switch maps every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      switchToNextMap();
    }, 10000); // Switch every 10 seconds

    return () => clearInterval(interval);
  }, []);

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

  const createGameConfig = (
    parent: HTMLElement
  ): Phaser.Types.Core.GameConfig => {
    const settings = getOptimalSettings();
    return {
      type: settings.renderer === "CANVAS" ? Phaser.CANVAS : Phaser.WEBGL,
      width: 512,
      height: 512,
      parent: parent,
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
      scene: [
        class extends GameScene {
          constructor() {
            super({ key: "GameScene1" });
          }
        },
        class extends GameScene {
          constructor() {
            super({ key: "GameScene2" });
          }
        },
      ],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: parent,
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
  };

  const switchToNextMap = () => {
    if (isTransitioning || !phaserGameRef.current) return;

    setIsTransitioning(true);
    const nextMap = currentMap >= totalMaps ? 1 : currentMap + 1;
    const nextSceneKey = `GameScene${nextMap}`;
    const currentSceneKey = `GameScene${currentMap}`;

    // Stop current scene and start next scene
    const currentScene = phaserGameRef.current.scene.getScene(
      currentSceneKey
    ) as GameScene;
    const nextScene = phaserGameRef.current.scene.getScene(
      nextSceneKey
    ) as GameScene;

    if (currentScene) {
      currentScene.scene.stop();
    }

    if (nextScene) {
      nextScene.scene.start();
      gameSceneRef.current = nextScene;

      // Override handleExit for the new scene
      const originalHandleExit = (nextScene as any).handleExit;
      (nextScene as any).handleExit = function (exitX: number, exitY: number) {
        console.log(`Player reached exit at coordinates: (${exitX}, ${exitY})`);
        // Call original handleExit to show victory screen
        originalHandleExit.call(this, exitX, exitY);

        // Override the repeat and menu handlers to use our navigation
        const originalRepeatHandler = this.repeatHandler;
        const originalMenuHandler = this.menuHandler;

        this.repeatHandler = () => {
          this.scene.restart();
        };

        this.menuHandler = () => {
          window.location.href = "/";
        };
      };
    }

    // Transition animation
    setTimeout(() => {
      setCurrentMap(nextMap);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const config = createGameConfig(gameRef.current);
      phaserGameRef.current = new Phaser.Game(config);

      const checkScene = () => {
        const scene = phaserGameRef.current?.scene.getScene(
          "GameScene1"
        ) as GameScene;
        if (scene?.scene?.isActive()) {
          gameSceneRef.current = scene;
          // Override handleExit to switch maps
          const originalHandleExit = (scene as any).handleExit;
          (scene as any).handleExit = function (exitX: number, exitY: number) {
            console.log(
              `Player reached exit at coordinates: (${exitX}, ${exitY})`
            );
            // Call original handleExit to show victory screen
            originalHandleExit.call(this, exitX, exitY);

            // Override the repeat and menu handlers to use our navigation
            const originalRepeatHandler = this.repeatHandler;
            const originalMenuHandler = this.menuHandler;

            this.repeatHandler = () => {
              this.scene.restart();
            };

            this.menuHandler = () => {
              window.location.href = "/";
            };
          };
          if (onGameReady) {
            onGameReady();
          }
        } else {
          setTimeout(checkScene, 100);
        }
      };

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
    const activeScene = gameSceneRef.current;

    if (activeScene) {
      if (direction === "left") {
        activeScene.setTouchControls(
          true,
          activeScene.isTouchingRight,
          activeScene.isTouchingUp
        );
      } else if (direction === "right") {
        activeScene.setTouchControls(
          activeScene.isTouchingLeft,
          true,
          activeScene.isTouchingUp
        );
      } else if (direction === "up") {
        activeScene.setTouchControls(
          activeScene.isTouchingLeft,
          activeScene.isTouchingRight,
          true
        );
      }
    }
  };

  const handleTouchEnd = (direction: "left" | "right" | "up") => {
    const activeScene = gameSceneRef.current;

    if (activeScene) {
      if (direction === "left") {
        activeScene.setTouchControls(
          false,
          activeScene.isTouchingRight,
          activeScene.isTouchingUp
        );
      } else if (direction === "right") {
        activeScene.setTouchControls(
          activeScene.isTouchingLeft,
          false,
          activeScene.isTouchingUp
        );
      } else if (direction === "up") {
        activeScene.setTouchControls(
          activeScene.isTouchingLeft,
          activeScene.isTouchingRight,
          false
        );
      }
    }
  };

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.singleMapContainer}>
        <div ref={gameRef} className={styles.gameContainer} />
      </div>
      <TouchControls
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
};

export default Game;
