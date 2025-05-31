import { createPlayer, createBlock } from "./gameObjects";
import type { GameSceneState, Player } from "./types";
import { getOptimalSettings, PerformanceMonitor } from "./performanceUtils";
import { AdaptiveQuality } from "./optimizations";

export class GameScene extends Phaser.Scene {
  private state: GameSceneState = {
    player: null,
    platform: null,
    mapData: [],
    isTouchingLeft: false,
    isTouchingRight: false,
    isTouchingUp: false,
    cursors: null,
    wasd: null,
  };

  private performanceMonitor = new PerformanceMonitor();
  private adaptiveQuality = new AdaptiveQuality();

  constructor() {
    super({ key: "GameScene" });
  }

  get player() {
    if (!this.state.player) {
      throw new Error("Player not initialized");
    }
    return this.state.player;
  }
  set player(value: Player) {
    this.state.player = value;
  }

  get platform() {
    if (!this.state.platform) {
      throw new Error("Platform not initialized");
    }
    return this.state.platform;
  }
  set platform(value: Phaser.Physics.Arcade.StaticGroup) {
    this.state.platform = value;
  }

  get mapData() {
    return this.state.mapData;
  }
  set mapData(value: string[][]) {
    this.state.mapData = value;
  }

  get isTouchingLeft() {
    return this.state.isTouchingLeft;
  }
  set isTouchingLeft(value: boolean) {
    this.state.isTouchingLeft = value;
  }

  get isTouchingRight() {
    return this.state.isTouchingRight;
  }
  set isTouchingRight(value: boolean) {
    this.state.isTouchingRight = value;
  }

  get isTouchingUp() {
    return this.state.isTouchingUp;
  }
  set isTouchingUp(value: boolean) {
    this.state.isTouchingUp = value;
  }

  get cursors() {
    if (!this.state.cursors) {
      throw new Error("Cursors not initialized");
    }
    return this.state.cursors;
  }
  set cursors(value: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.state.cursors = value;
  }

  get wasd() {
    if (!this.state.wasd) {
      throw new Error("WASD keys not initialized");
    }
    return this.state.wasd;
  }
  set wasd(
    value: {
      up: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    } | null
  ) {
    this.state.wasd = value;
  }

  preload() {
    const assets = [
      {
        type: "spritesheet",
        key: "player",
        url: "/sprites/Knight.png",
        config: { frameWidth: 48, frameHeight: 48 },
      },
      { type: "image", key: "platform", url: "/sprites/platform_tile.png" },
      { type: "image", key: "sky", url: "/sprites/sky_tile.png" },
      {
        type: "spritesheet",
        key: "boing",
        url: "/sprites/boing_sheet.png",
        config: { frameWidth: 32, frameHeight: 32 },
      },
      {
        type: "spritesheet",
        key: "fire",
        url: "/sprites/fire_sheet.png",
        config: { frameWidth: 32, frameHeight: 32 },
      },
      {
        type: "spritesheet",
        key: "flag",
        url: "/sprites/flag_sheet.png",
        config: { frameWidth: 32, frameHeight: 32 },
      },
      { type: "text", key: "map", url: "/map.txt" },
    ];

    for (const asset of assets) {
      switch (asset.type) {
        case "spritesheet":
          if (asset.config) {
            this.load.spritesheet(asset.key, asset.url, asset.config);
          }
          break;
        case "image":
          this.load.image(asset.key, asset.url);
          break;
        case "text":
          this.load.text(asset.key, asset.url);
          break;
      }
    }
  }

  create() {
    this.initializeMap();
    this.initializePhysics();
    this.createSkyBackground();
    this.createAnimations();
    this.initializePlayer();
    this.createMapElements();
    this.setupControls();
    this.setupTouchControls();
  }

  private initializeMap() {
    const mapText = this.cache.text.get("map");
    this.mapData = mapText
      .split("\n")
      .map((row: string) => row.replace(/[\[\],\r']/g, "").split(" "));
  }

  private initializePhysics() {
    this.platform = this.physics.add.staticGroup();
  }

  private createSkyBackground() {
    // Use a single tileSprite instead of multiple individual sprites for better performance
    const skyBackground = this.add.tileSprite(0, 0, 512, 512, "sky");
    skyBackground.setOrigin(0, 0);
    skyBackground.setDepth(-1); // Ensure it's behind other objects
  }

  private initializePlayer() {
    const INITIAL_X = 16;
    const INITIAL_Y = 450;
    this.player = createPlayer(this, INITIAL_X, INITIAL_Y);
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
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
    }
  }

  private setupTouchControls() {
    const handlePointerEvent = (
      pointer: Phaser.Input.Pointer,
      isDown: boolean
    ) => {
      const screenWidth = this.game.config.width as number;
      const leftThird = screenWidth / 3;
      const rightThird = (screenWidth / 3) * 2;

      if (pointer.x < leftThird) {
        this.isTouchingLeft = isDown;
      } else if (pointer.x > rightThird) {
        this.isTouchingRight = isDown;
      } else {
        this.isTouchingUp = isDown;
      }
    };

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      handlePointerEvent(pointer, true);
    });
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      handlePointerEvent(pointer, false);
    });
  }

  private createAnimations() {
    const settings = getOptimalSettings();
    const baseFrameRate = settings.animationFrameRate;
    const deathFrameRate = settings.deathAnimationFrameRate;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const animations = [
      {
        key: "slime",
        sprite: "boing",
        start: 0,
        end: 3,
        frameRate: isMobile ? Math.max(4, baseFrameRate - 2) : baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
      {
        key: "fire",
        sprite: "fire",
        start: 0,
        end: 3,
        frameRate: isMobile ? Math.max(4, baseFrameRate - 2) : baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
      {
        key: "player_idle",
        sprite: "player",
        start: 0,
        end: 5,
        frameRate: baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
      {
        key: "player_run",
        sprite: "player",
        start: 24,
        end: 27,
        frameRate: baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
      {
        key: "player_death",
        sprite: "player",
        start: 80,
        end: 83,
        frameRate: deathFrameRate,
        repeat: 0,
        skipMissedFrames: false,
      },
      {
        key: "player_fall",
        sprite: "player",
        start: 64,
        end: 67,
        frameRate: baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
      {
        key: "flag-gif",
        sprite: "flag",
        start: 0,
        end: 4,
        frameRate: isMobile ? Math.max(4, baseFrameRate - 2) : baseFrameRate,
        repeat: -1,
        skipMissedFrames: true,
      },
    ];

    for (const anim of animations) {
      if (!this.anims.exists(anim.key)) {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNumbers(anim.sprite, {
            start: anim.start,
            end: anim.end,
          }),
          frameRate: anim.frameRate,
          repeat: anim.repeat,
          skipMissedFrames: anim.skipMissedFrames,
        });
      }
    }
  }

  private createMapElements() {
    const TILE_SIZE = 32;
    const TILE_OFFSET = 16;

    const tileHandlers = {
      p: (x: number, y: number) => {
        this.platform.create(x, y, "platform").refreshBody();
        this.physics.add.collider(this.player.sprite, this.platform);
      },
      F: (x: number, y: number) => {
        const fire = createBlock(this, x, y, "fire");
        this.physics.add.collider(
          this.player.sprite,
          fire.sprite,
          this.die,
          undefined,
          this
        );
        fire.sprite.anims.play("fire");
      },
      E: (x: number, y: number) => {
        const flag = createBlock(this, x, y, "flag");
        this.physics.add.collider(
          this.player.sprite,
          flag.sprite,
          this.nextChunk,
          undefined,
          this
        );
        flag.sprite.anims.play("flag-gif");
        flag.sprite.setDisplayOrigin(5, 16);
      },
      J: (x: number, y: number) => {
        const boing = createBlock(this, x, y, "boing");
        this.physics.add.collider(
          this.player.sprite,
          boing.sprite,
          this.jumpBoing,
          undefined,
          this
        );
        boing.sprite.anims.play("slime");
      },
    } as const;

    for (let rowIndex = 0; rowIndex < this.mapData.length; rowIndex++) {
      const row = this.mapData[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const tile = row[colIndex];
        const handler = tileHandlers[tile as keyof typeof tileHandlers];
        if (handler) {
          const x = colIndex * TILE_SIZE + TILE_OFFSET;
          const y = rowIndex * TILE_SIZE + TILE_OFFSET;
          handler(x, y);
        }
      }
    }
  }

  update() {
    // Performance monitoring
    const currentFPS = this.performanceMonitor.update();
    this.adaptiveQuality.updatePerformance(currentFPS);

    // Adaptive frame skipping based on quality
    if (this.adaptiveQuality.shouldSkipFrame()) {
      return;
    }

    // Performance monitoring without console output

    if (!this.player.alive) return;

    this.handlePlayerMovement();

    // Cleanup resources periodically on mobile (less frequent)
    if (this.time.now % 15000 < 16) {
      // Every 15 seconds
      this.optimizePerformance();
    }
  }

  private optimizePerformance() {
    // Clean up unused textures and optimize memory
    this.textures.each((texture: Phaser.Textures.Texture) => {
      if (!texture.manager.exists(texture.key)) {
        texture.destroy();
      }
    }, this);

    // Skip dynamic animation optimization to avoid performance issues

    // Optimize physics engine
    if (this.physics.world) {
      // Adjust physics time scale for low-end devices
      const quality = this.adaptiveQuality.getQuality();
      if (quality < 0.6) {
        this.physics.world.timeScale = 1.2; // Slightly slower physics for better performance
      } else {
        this.physics.world.timeScale = 1.0; // Normal physics speed
      }
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  private handlePlayerMovement() {
    const MOVE_SPEED = 250;
    const JUMP_STRENGTH = 1;

    // Emergency stop if player is dead
    if (!this.player.alive) {
      this.player.sprite.setVelocityY(0);
      return;
    }

    const isOnGround = this.player.sprite.body
      ? (this.player.sprite.body as Phaser.Physics.Arcade.Body).touching.down
      : false;

    // Check input states
    const isLeftPressed =
      this.isTouchingLeft ||
      (this.state.cursors?.left.isDown ?? false) ||
      (this.state.wasd?.left.isDown ?? false);
    const isRightPressed =
      this.isTouchingRight ||
      (this.state.cursors?.right.isDown ?? false) ||
      (this.state.wasd?.right.isDown ?? false);
    const isUpPressed =
      this.isTouchingUp ||
      (this.state.cursors?.up.isDown ?? false) ||
      (this.state.wasd?.up.isDown ?? false);

    // Handle horizontal movement
    if (isLeftPressed) {
      this.player.sprite.setVelocityX(-MOVE_SPEED);
      if (!this.player.sprite.flipX) {
        this.player.sprite.setFlipX(true);
      }
      if (this.player.sprite.anims.currentAnim?.key !== "player_run") {
        this.player.sprite.anims.play("player_run", true);
      }
    } else if (isRightPressed) {
      this.player.sprite.setVelocityX(MOVE_SPEED);
      if (this.player.sprite.flipX) {
        this.player.sprite.setFlipX(false);
      }
      if (this.player.sprite.anims.currentAnim?.key !== "player_run") {
        this.player.sprite.anims.play("player_run", true);
      }
    } else {
      this.player.sprite.setVelocityX(0);
      if (isOnGround) {
        if (this.player.sprite.anims.currentAnim?.key !== "player_idle") {
          this.player.sprite.anims.play("player_idle", true);
        }
      } else {
        if (this.player.sprite.anims.currentAnim?.key !== "player_fall") {
          this.player.sprite.anims.play("player_fall", true);
        }
      }
    }

    // Handle jumping
    if (isUpPressed && isOnGround) {
      this.player.jump(JUMP_STRENGTH);
    }
  }

  private die() {
    const DEATH_ANIMATION_DURATION = 666;

    this.resetTouchControls();

    if (!this.player.alive) return;

    if (this.player.sprite.body) {
      (this.player.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(
        false
      );
    }
    this.player.alive = false;
    this.player.disableMovement();
    this.player.sprite.anims.play("player_death", true);

    this.time.delayedCall(DEATH_ANIMATION_DURATION, () => {
      this.respawnPlayer();
    });
  }

  private resetTouchControls() {
    this.isTouchingLeft = false;
    this.isTouchingRight = false;
    this.isTouchingUp = false;
  }

  private respawnPlayer() {
    this.player.resetPosition();
    this.player.enableMovement();
    this.player.alive = true;
    if (this.player.sprite.body) {
      (this.player.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(
        true
      );
    }
  }

  private nextChunk() {
    const SPAWN_X = 16;
    const SPAWN_Y = 450;
    this.player.sprite.setX(SPAWN_X);
    this.player.sprite.setY(SPAWN_Y);
  }

  private jumpBoing(
    object1:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile,
    _object2:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile
  ) {
    const BOUNCE_MULTIPLIER = 1.2;
    const BASE_JUMP_VELOCITY = -400;

    // Ensure we're working with a GameObjectWithBody (the player sprite)
    if ("setVelocityY" in object1) {
      (object1 as unknown as Phaser.Physics.Arcade.Sprite).setVelocityY(
        BASE_JUMP_VELOCITY * BOUNCE_MULTIPLIER
      );
    }
  }

  setTouchControls(left: boolean, right: boolean, up: boolean) {
    this.isTouchingLeft = left;
    this.isTouchingRight = right;
    this.isTouchingUp = up;
  }
}
