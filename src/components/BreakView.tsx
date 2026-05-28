"use client";

import { TimerState } from "@/hooks/useTimer";

interface BreakViewProps {
  now: Date;
  state: TimerState;
  secondsUntilNext: number;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}분 ${String(s).padStart(2, "0")}초` : `${s}초`;
}

export default function BreakView({ now, state, secondsUntilNext }: BreakViewProps) {
  const isBreak = state === "break";

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center text-white text-center px-8 ${
        isBreak
          ? "bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900"
          : "bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900"
      }`}
    >
      {/* 상단 현재 시각 */}
      <div className="absolute top-8 right-8 text-white/60 font-mono text-2xl font-light">
        {formatTime(now)}
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="animate-slide-up">
        {isBreak ? (
          <>
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-7xl font-bold mb-4">휴식 시간</h1>
            <p className="text-2xl text-white/60 mb-8 font-light">
              잠시 눈을 감고 휴식하세요
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-7xl font-bold mb-4">수업 마무리</h1>
            <p className="text-2xl text-white/60 mb-8 font-light">
              수업을 정리하고 마무리하세요
            </p>
          </>
        )}

        {/* 카운트다운 카드 */}
        <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-10 py-5">
          <p className="text-sm text-white/50 mb-1">
            {isBreak ? "수업 마무리까지" : "다음 수업까지"}
          </p>
          <p className="text-4xl font-bold font-mono tabular-nums">
            {formatCountdown(secondsUntilNext)}
          </p>
        </div>
      </div>
    </div>
  );
}
