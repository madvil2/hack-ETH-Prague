import type React from "react";
import { useRef, useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface TouchControlsProps {
  onTouchStart: (direction: "left" | "right" | "up") => void;
  onTouchEnd: (direction: "left" | "right" | "up") => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({
  onTouchStart,
  onTouchEnd,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const upButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        ) ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // Only set up event listeners if on mobile
    if (!isMobile) return;

    // Set up non-passive touch event listeners for each button
    const setupNonPassiveEvents = (
      ref: React.RefObject<HTMLButtonElement | null>,
      direction: "left" | "right" | "up"
    ) => {
      const element = ref.current;
      if (!element) return;

      const touchStartHandler = (e: TouchEvent) => {
        e.preventDefault();
        onTouchStart(direction);
      };

      const touchEndHandler = (e: TouchEvent) => {
        e.preventDefault();
        onTouchEnd(direction);
      };

      element.addEventListener("touchstart", touchStartHandler, {
        passive: false,
      });
      element.addEventListener("touchend", touchEndHandler, { passive: false });

      return () => {
        element.removeEventListener("touchstart", touchStartHandler);
        element.removeEventListener("touchend", touchEndHandler);
      };
    };

    const cleanupLeft = setupNonPassiveEvents(leftButtonRef, "left");
    const cleanupUp = setupNonPassiveEvents(upButtonRef, "up");
    const cleanupRight = setupNonPassiveEvents(rightButtonRef, "right");

    return () => {
      cleanupLeft?.();
      cleanupUp?.();
      cleanupRight?.();
    };
  }, [isMobile, onTouchStart, onTouchEnd]);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const handleMouseDown = (
    direction: "left" | "right" | "up",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onTouchStart(direction);
  };

  const handleMouseUp = (
    direction: "left" | "right" | "up",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onTouchEnd(direction);
  };

  return (
    <div className={styles.touchControls}>
      <button
        ref={leftButtonRef}
        type="button"
        className={styles.controlButton}
        onMouseDown={(e) => handleMouseDown("left", e)}
        onMouseUp={(e) => handleMouseUp("left", e)}
        onMouseLeave={(e) => handleMouseUp("left", e)}
      >
        ◄
      </button>
      <button
        ref={upButtonRef}
        type="button"
        className={styles.controlButton}
        onMouseDown={(e) => handleMouseDown("up", e)}
        onMouseUp={(e) => handleMouseUp("up", e)}
        onMouseLeave={(e) => handleMouseUp("up", e)}
      >
        ▲
      </button>
      <button
        ref={rightButtonRef}
        type="button"
        className={styles.controlButton}
        onMouseDown={(e) => handleMouseDown("right", e)}
        onMouseUp={(e) => handleMouseUp("right", e)}
        onMouseLeave={(e) => handleMouseUp("right", e)}
      >
        ►
      </button>
    </div>
  );
};

export default TouchControls;
