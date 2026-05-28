"use client";

import { useState, useEffect, useCallback } from "react";

export interface Settings {
  breakMinute: number;
  wrapupMinute: number;
}

const DEFAULT_SETTINGS: Settings = {
  breakMinute: 40,
  wrapupMinute: 50,
};

const STORAGE_KEY = "break-timer-settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Settings;
        if (
          typeof parsed.breakMinute === "number" &&
          typeof parsed.wrapupMinute === "number"
        ) {
          setSettings(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  const saveSettings = useCallback((next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  return { settings, saveSettings, loaded };
}
