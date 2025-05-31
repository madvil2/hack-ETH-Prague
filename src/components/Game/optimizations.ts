// Additional performance optimizations for the game

// Type definitions for navigator extensions
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
  };
}

// Debounce function for touch events
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// RAF-based throttle for smooth animations
export const rafThrottle = <T extends (...args: unknown[]) => unknown>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  return function throttledFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
};

// Memory pool for frequently created objects
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get(): T {
    if (this.pool.length > 0) {
      const item = this.pool.pop();
      if (!item) {
        return this.createFn();
      }
      return item;
    }
    return this.createFn();
  }

  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  clear(): void {
    this.pool.length = 0;
  }
}

// Device capability detection
export const getDeviceCapabilities = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  return {
    webglSupported: !!gl,
    maxTextureSize: gl
      ? (gl as WebGLRenderingContext).getParameter(
          (gl as WebGLRenderingContext).MAX_TEXTURE_SIZE
        )
      : 0,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    deviceMemory: (navigator as NavigatorWithMemory).deviceMemory || 4,
    connectionType:
      (navigator as NavigatorWithConnection).connection?.effectiveType ||
      "unknown",
  };
};

// Adaptive quality settings based on performance
export class AdaptiveQuality {
  private performanceHistory: number[] = [];
  private currentQuality = 1.0;
  private readonly maxHistory = 60; // 1 second at 60fps

  updatePerformance(fps: number): void {
    this.performanceHistory.push(fps);
    if (this.performanceHistory.length > this.maxHistory) {
      this.performanceHistory.shift();
    }

    // Adjust quality based on average FPS
    const avgFPS =
      this.performanceHistory.reduce((a, b) => a + b, 0) /
      this.performanceHistory.length;

    if (avgFPS < 25 && this.currentQuality > 0.5) {
      this.currentQuality = Math.max(0.5, this.currentQuality - 0.1);
    } else if (avgFPS > 50 && this.currentQuality < 1.0) {
      this.currentQuality = Math.min(1.0, this.currentQuality + 0.05);
    }
  }

  getQuality(): number {
    return this.currentQuality;
  }

  shouldSkipFrame(): boolean {
    return this.currentQuality < 0.8 && Math.random() > this.currentQuality;
  }
}
