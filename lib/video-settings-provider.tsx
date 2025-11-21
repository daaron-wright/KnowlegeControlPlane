"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define all available videos in the application
export type VideoKey = "measles" | "chatOutput" | "entities" | "dohDeepDive";

// Define the settings interface
interface VideoSettings {
  [key: string]: boolean;
}

// Define the context type
interface VideoSettingsContextType {
  videoSettings: VideoSettings;
  toggleVideoSetting: (key: VideoKey) => void;
  isVideoEnabled: (key: VideoKey) => boolean;
}

// Create the context with default values
const VideoSettingsContext = createContext<VideoSettingsContextType>({
  videoSettings: {},
  toggleVideoSetting: () => {},
  isVideoEnabled: () => true,
});

// Create a hook to use the video settings
export const useVideoSettings = () => useContext(VideoSettingsContext);

// Define default settings for all videos (enabled by default)
const DEFAULT_SETTINGS: VideoSettings = {
  measles: true, // /videos/Use Case Measles.mp4
  chatOutput: true, // /videos/Chat output.mp4
  entities: true, // /videos/55 Entities.mp4
  dohDeepDive: true, // /videos/DOH Deep Dive New.mp4
};

// Storage key for local storage
const STORAGE_KEY = "omnis_video_settings";

// Provider component
export function VideoSettingsProvider({ children }: { children: ReactNode }) {
  // Initialize state with default values
  const [videoSettings, setVideoSettings] =
    useState<VideoSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const loadSettings = () => {
      try {
        if (typeof window !== "undefined") {
          const savedSettings = localStorage.getItem(STORAGE_KEY);
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Merge with defaults to ensure new videos are always included
            setVideoSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
            return;
          }
        }
      } catch (error) {
        console.error("Error loading video settings:", error);
      }

      // If no settings found or error, use defaults
      setVideoSettings(DEFAULT_SETTINGS);
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videoSettings));
      }
    } catch (error) {
      console.error("Error saving video settings:", error);
    }
  }, [videoSettings]);

  // Toggle a specific video setting
  const toggleVideoSetting = (key: VideoKey) => {
    setVideoSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Check if a video is enabled
  const isVideoEnabled = (key: VideoKey) => {
    return videoSettings[key] === true;
  };

  return (
    <VideoSettingsContext.Provider
      value={{
        videoSettings,
        toggleVideoSetting,
        isVideoEnabled,
      }}
    >
      {children}
    </VideoSettingsContext.Provider>
  );
}
