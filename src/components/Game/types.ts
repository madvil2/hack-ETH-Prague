export interface GameProps {
  onGameReady?: () => void;
}

export interface Player {
  alive: boolean;
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  jump: (strength: number) => void;
  resetPosition: () => void;
  disableMovement: () => void;
  enableMovement: () => void;
}

export interface Block {
  sprite: Phaser.Physics.Arcade.Sprite;
  type: string;
}

export interface GameSceneState {
  player: Player | null;
  platform: Phaser.Physics.Arcade.StaticGroup | null;
  mapData: string[][];
  isTouchingLeft: boolean;
  isTouchingRight: boolean;
  isTouchingUp: boolean;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
  wasd: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  } | null;
}