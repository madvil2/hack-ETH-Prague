// Performance optimization utilities for mobile devices

export const isMobileDevice = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
};

export const getOptimalSettings = () => {
  const mobile = isMobileDevice();
  const isLowEndDevice = mobile && navigator.hardwareConcurrency <= 4;

  return {
    fps: 120,
    renderer: "WEBGL",
    animationFrameRate: isLowEndDevice ? 6 : mobile ? 8 : 12,
    deathAnimationFrameRate: mobile ? 2 : 3,
    powerPreference: "high-performance",
    physics: {
      tileBias: mobile ? 16 : 32,
      overlapBias: mobile ? 8 : 16,
    },
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
      transparent: false,
      clearBeforeRender: true,
      preserveDrawingBuffer: false,
      batchSize: isLowEndDevice ? 500 : mobile ? 1000 : 2000,
      maxTextures: isLowEndDevice ? 4 : mobile ? 8 : 16,
      mipmapFilter: "LINEAR",
      powerPreference: "high-performance",
    },
  };
};

// Throttle function for performance-sensitive operations
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Memory management utilities
export const cleanupResources = (scene: Phaser.Scene) => {
  // Clean up unused textures and sounds
  scene.textures.each((texture: Phaser.Textures.Texture) => {
    if (!texture.manager.exists(texture.key)) {
      texture.destroy();
    }
  }, scene);

  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;

  update(): number {
    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime)
      );
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }

  isPerformancePoor(): boolean {
    return this.fps < (isMobileDevice() ? 20 : 45);
  }
}
