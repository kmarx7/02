"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useNotification } from "@/hooks/useNotification";
import { playChime } from "@/lib/audio";
import ClockView from "@/components/ClockView";
import BreakView from "@/components/BreakView";

const NOTIFICATIONS = {
  break: {
    title: "휴식 시간입니다 🌿",
    body: "10분간 휴식하세요. 눈을 감고 편안하게 쉬세요.",
  },
  wrapup: {
    title: "수업 마무리 시간입니다 📚",
    body: "10분 후 수업이 시작됩니다. 내용을 정리하세요.",
  },
};

export default function Home() {
  const { permission, requestPermission, notify } = useNotification();
  const audioUnlocked = useRef(false);

  const handleEvent = useCallback(
    (event: "break" | "wrapup") => {
      const n = NOTIFICATIONS[event];
      notify(n.title, n.body);
      playChime(event);
    },
    [notify]
  );

  const { now, state, secondsUntilNext } = useTimer({ onEvent: handleEvent });

  // 첫 클릭으로 오디오 컨텍스트 잠금 해제
  useEffect(() => {
    const unlock = () => {
      if (!audioUnlocked.current) {
        audioUnlocked.current = true;
      }
    };
    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, []);

  const isBreakScreen = state === "break" || state === "wrapup";

  return (
    <main className="h-screen w-screen overflow-hidden">
      {isBreakScreen ? (
        <BreakView now={now} state={state} secondsUntilNext={secondsUntilNext} />
      ) : (
        <ClockView
          now={now}
          state={state}
          secondsUntilNext={secondsUntilNext}
          permissionGranted={permission === "granted"}
          onRequestPermission={requestPermission}
        />
      )}
    </main>
  );
}
