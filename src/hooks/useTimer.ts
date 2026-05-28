"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Settings } from "./useSettings";

export type TimerState = "normal" | "break" | "wrapup";

function getTimerState(minutes: number, settings: Settings): TimerState {
  if (minutes >= settings.breakMinute && minutes < settings.wrapupMinute)
    return "break";
  if (minutes >= settings.wrapupMinute) return "wrapup";
  return "normal";
}

function getSecondsUntilNext(
  state: TimerState,
  minutes: number,
  seconds: number,
  settings: Settings
): number {
  if (state === "normal") {
    return (settings.breakMinute - minutes) * 60 - seconds;
  } else if (state === "break") {
    return (settings.wrapupMinute - minutes) * 60 - seconds;
  } else {
    return (60 - minutes) * 60 - seconds;
  }
}

export type TimerEvent = "break" | "wrapup";

export interface UseTimerOptions {
  onEvent?: (event: TimerEvent) => void;
  settings: Settings;
}

export function useTimer({ onEvent, settings }: UseTimerOptions) {
  const [now, setNow] = useState(() => new Date());
  const [state, setState] = useState<TimerState>(() =>
    getTimerState(new Date().getMinutes(), settings)
  );

  const prevStateRef = useRef<TimerState>(
    getTimerState(new Date().getMinutes(), settings)
  );
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      setNow(current);

      const newState = getTimerState(current.getMinutes(), settingsRef.current);
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

  // settings 변경 시 현재 상태 즉시 재계산
  useEffect(() => {
    const newState = getTimerState(now.getMinutes(), settings);
    setState(newState);
    prevStateRef.current = newState;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const secondsUntilNext = useMemo(
    () =>
      getSecondsUntilNext(state, now.getMinutes(), now.getSeconds(), settings),
    [state, now, settings]
  );

  return { now, state, secondsUntilNext };
}
