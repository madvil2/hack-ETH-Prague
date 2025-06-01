import { useState, useEffect } from "react";

const FPS_SETTINGS_KEY = "fps_settings";

interface FPSSettings {
  showFPS: boolean;
}

const defaultSettings: FPSSettings = {
  showFPS: false,
};

// Helper function to get initial settings from localStorage
const getInitialSettings = (): FPSSettings => {
  try {
    const savedSettings = localStorage.getItem(FPS_SETTINGS_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn("Failed to load FPS settings:", error);
  }
  return defaultSettings;
};

export const useFPSSettings = () => {
  const [settings, setSettings] = useState<FPSSettings>(getInitialSettings);

  // Load settings from localStorage on mount (fallback)
  useEffect(() => {
    const initialSettings = getInitialSettings();
    setSettings(initialSettings);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FPS_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save FPS settings:", error);
    }
  }, [settings]);

  const toggleFPS = () => {
    setSettings((prev) => ({
      ...prev,
      showFPS: !prev.showFPS,
    }));
  };

  const setShowFPS = (show: boolean) => {
    setSettings((prev) => ({
      ...prev,
      showFPS: show,
    }));
  };

  return {
    showFPS: settings.showFPS,
    toggleFPS,
    setShowFPS,
  };
};

// Global function to get current FPS settings (for use in Phaser)
export const getFPSSettings = (): FPSSettings => {
  try {
    const savedSettings = localStorage.getItem(FPS_SETTINGS_KEY);
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.warn("Failed to load FPS settings:", error);
  }
  return defaultSettings;
};
