"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type CountdownStatus = "idle" | "running" | "paused" | "done";

export function useCountdown() {
  const [durationSeconds, setDurationSeconds] = useState(25 * 60); // 기본 25분
  const [remaining, setRemaining] = useState(25 * 60);
  const [status, setStatus] = useState<CountdownStatus>("idle");
  const endTimeRef = useRef<number | null>(null); // 종료 예정 timestamp

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));
      setRemaining(left);
      if (left === 0) {
        setStatus("done");
        clearInterval(id);
      }
    }, 250); // 250ms로 정확도 유지

    return () => clearInterval(id);
  }, [status]);

  const start = useCallback(() => {
    if (durationSeconds === 0) return;
    endTimeRef.current = Date.now() + remaining * 1000;
    setStatus("running");
  }, [durationSeconds, remaining]);

  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setRemaining(durationSeconds);
    endTimeRef.current = null;
  }, [durationSeconds]);

  const dismiss = useCallback(() => {
    setStatus("idle");
    setRemaining(durationSeconds);
    endTimeRef.current = null;
  }, [durationSeconds]);

  const setDuration = useCallback((seconds: number) => {
    setDurationSeconds(seconds);
    setRemaining(seconds);
    setStatus("idle");
    endTimeRef.current = null;
  }, []);

  return { durationSeconds, remaining, status, start, pause, reset, dismiss, setDuration };
}
