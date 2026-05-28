"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Settings } from "./useSettings";

export type TimerState = "normal" | "break" | "wrapup";

function isActiveHour(hour: number, s: Settings): boolean {
  return hour >= s.startHour && hour < s.endHour;
}

function getTimerState(date: Date, s: Settings): TimerState {
  const h = date.getHours();
  const m = date.getMinutes();
  if (!isActiveHour(h, s)) return "normal";
  if (m >= s.breakMinute && m < s.wrapupMinute) return "break";
  if (m >= s.wrapupMinute) return "wrapup";
  return "normal";
}

function getSecondsUntilNext(
  state: TimerState,
  date: Date,
  s: Settings
): number {
  const h = date.getHours();
  const m = date.getMinutes();
  const sec = date.getSeconds();

  if (state === "break") {
    return (s.wrapupMinute - m) * 60 - sec;
  }
  if (state === "wrapup") {
    return (60 - m) * 60 - sec;
  }

  // normal: find next break time
  if (isActiveHour(h, s) && m < s.breakMinute) {
    // break is later this hour
    return (s.breakMinute - m) * 60 - sec;
  }
  // find next active hour
  const nextHour = isActiveHour(h, s) ? h + 1 : s.startHour;
  if (nextHour < s.endHour) {
    const hoursLeft = nextHour - h;
    return hoursLeft * 3600 + s.breakMinute * 60 - m * 60 - sec;
  }
  // past end hour — next day
  const hoursToTomorrow = 24 - h + s.startHour;
  return hoursToTomorrow * 3600 + s.breakMinute * 60 - m * 60 - sec;
}

export type TimerEvent = "break" | "wrapup";

export interface UseTimerOptions {
  onEvent?: (event: TimerEvent) => void;
  settings: Settings;
}

export function useTimer({ onEvent, settings }: UseTimerOptions) {
  const [now, setNow] = useState(() => new Date());
  const [state, setState] = useState<TimerState>(() =>
    getTimerState(new Date(), settings)
  );

  const prevStateRef = useRef<TimerState>(getTimerState(new Date(), settings));
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      setNow(current);
      const newState = getTimerState(current, settingsRef.current);
      if (newState !== prevStateRef.current) {
        setState(newState);
        if (newState === "break" || newState === "wrapup") {
          onEventRef.current?.(newState);
        }
        prevStateRef.current = newState;
      }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const newState = getTimerState(now, settings);
    setState(newState);
    prevStateRef.current = newState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const secondsUntilNext = useMemo(
    () => getSecondsUntilNext(state, now, settings),
    [state, now, settings]
  );

  return { now, state, secondsUntilNext };
}
