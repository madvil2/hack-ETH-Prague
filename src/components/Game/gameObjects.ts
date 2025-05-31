import type { GameScene } from "./GameScene";
import type { Block, Player } from "./types";

export const createPlayer = (
  scene: Phaser.Scene,
  x: number,
  y: number,
): Player => {
  const sprite = scene.physics.add.sprite(x, y, "player");
  sprite.anims.play("player_idle");
  sprite.setBounce(0.0);
  sprite.setCollideWorldBounds(true);
  sprite.displayWidth = 16;
  sprite.displayHeight = 16;
  sprite.setScale(2);
  sprite.body.setSize(16, 16);

  return {
    alive: true,
    scene,
    sprite,
    jump: (strength: number) => {
      if (sprite.body.touching.down) {
        sprite.setVelocityY(-400 * strength);
      }
    },
    resetPosition: () => {
      sprite.setX(16);
      sprite.setY(450);
    },
    disableMovement: () => {
      const keyCodes = [
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.D,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
      ];
      for (const keyCode of keyCodes) {
        scene.input.keyboard?.removeKey(keyCode);
      }
    },
    enableMovement: () => {
      const gameScene = scene as GameScene;
      if (scene.input.keyboard) {
        gameScene.wasd = scene.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as {
          up: Phaser.Input.Keyboard.Key;
          left: Phaser.Input.Keyboard.Key;
          down: Phaser.Input.Keyboard.Key;
          right: Phaser.Input.Keyboard.Key;
        };
        gameScene.cursors = scene.input.keyboard.createCursorKeys();
      }
    },
  };
};

export const createBlock = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  type: string,
): Block => {
  const sprite = scene.physics.add.staticSprite(x, y, type);
  sprite.setScale(1);

  return {
    sprite,
    type,
  };
};