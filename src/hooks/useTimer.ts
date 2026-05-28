"use client";

import { useState, useEffect, useRef, useMemo } from "react";

export type TimerState = "normal" | "break" | "wrapup";

function getTimerState(minutes: number): TimerState {
  if (minutes >= 40 && minutes < 50) return "break";
  if (minutes >= 50) return "wrapup";
  return "normal";
}

function getSecondsUntilNext(state: TimerState, minutes: number, seconds: number): number {
  if (state === "normal") {
    return (40 - minutes) * 60 - seconds;
  } else if (state === "break") {
    return (50 - minutes) * 60 - seconds;
  } else {
    return (60 - minutes) * 60 - seconds;
  }
}

export type TimerEvent = "break" | "wrapup";

export interface UseTimerOptions {
  onEvent?: (event: TimerEvent) => void;
}

export function useTimer({ onEvent }: UseTimerOptions = {}) {
  const [now, setNow] = useState(() => new Date());
  const [state, setState] = useState<TimerState>(() =>
    getTimerState(new Date().getMinutes())
  );

  const prevStateRef = useRef<TimerState>(
    getTimerState(new Date().getMinutes())
  );
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      setNow(current);

      const newState = getTimerState(current.getMinutes());
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

  const secondsUntilNext = useMemo(
    () => getSecondsUntilNext(state, now.getMinutes(), now.getSeconds()),
    [state, now]
  );

  return { now, state, secondsUntilNext };
}
