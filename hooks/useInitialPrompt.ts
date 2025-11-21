"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "omnis_initial_prompt";

export function useInitialPrompt() {
  const [initialPrompt, setInitialPromptState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Safe localStorage operations
  const safeGetItem = (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    return null;
  };

  const safeSetItem = (key: string, value: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
    return false;
  };

  const safeRemoveItem = (key: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    return false;
  };

  useEffect(() => {
    // Load the initial prompt from localStorage when the component mounts
    const savedPrompt = safeGetItem(STORAGE_KEY);
    if (savedPrompt) {
      console.log(
        "Loading saved prompt from localStorage:",
        savedPrompt.substring(0, 20) + "..."
      );
      setInitialPromptState(savedPrompt);
    }
    setIsLoaded(true);
  }, []);

  const setInitialPrompt = (prompt: string) => {
    // Don't set empty prompts
    if (!prompt || prompt.trim() === "") {
      console.warn("Attempted to set empty prompt");
      return;
    }

    console.log("Setting initial prompt:", prompt.substring(0, 20) + "...");

    // Save to localStorage
    safeSetItem(STORAGE_KEY, prompt);

    // Update state
    setInitialPromptState(prompt);
  };

  const clearInitialPrompt = () => {
    console.log("Clearing initial prompt");
    safeRemoveItem(STORAGE_KEY);
    setInitialPromptState("");
  };

  return {
    initialPrompt,
    setInitialPrompt,
    clearInitialPrompt,
    isLoaded,
  };
}
