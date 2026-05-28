"use client";

import { useState, useEffect, useCallback } from "react";

export interface Settings {
  startHour: number;
  endHour: number;
  breakMinute: number;
  wrapupMinute: number;
}

const DEFAULT_SETTINGS: Settings = {
  startHour: 9,
  endHour: 18,
  breakMinute: 40,
  wrapupMinute: 50,
};

const STORAGE_KEY = "break-timer-settings";

function isValid(s: unknown): s is Settings {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.startHour === "number" &&
    typeof o.endHour === "number" &&
    typeof o.breakMinute === "number" &&
    typeof o.wrapupMinute === "number"
  );
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValid(parsed)) setSettings(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const saveSettings = useCallback((next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  return { settings, saveSettings, loaded };
}
