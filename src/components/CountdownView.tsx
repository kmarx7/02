"use client";

import { useEffect } from "react";
import type { CountdownStatus } from "@/hooks/useCountdown";
import { startAlarm, stopAlarm } from "@/lib/alarm";

interface CountdownViewProps {
  now: Date;
  durationSeconds: number;
  remaining: number;
  status: CountdownStatus;
  onSetDuration: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDismiss: () => void;
}

const HOUR_OPTIONS = Array.from({ length: 25 }, (_, i) => i); // 0~24
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,...,55

function formatClock(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatRemaining(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseDuration(seconds: number) {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  };
}

export default function CountdownView({
  now,
  durationSeconds,
  remaining,
  status,
  onSetDuration,
  onStart,
  onPause,
  onReset,
  onDismiss,
}: CountdownViewProps) {
  const { hours, minutes } = parseDuration(durationSeconds);
  const progress = durationSeconds > 0 ? remaining / durationSeconds : 1;

  // 알람 관리
  useEffect(() => {
    if (status === "done") {
      startAlarm();
    } else {
      stopAlarm();
    }
    return () => stopAlarm();
  }, [status]);

  const handleHourChange = (h: number) => {
    const capped = h === 24 ? 24 * 3600 : h * 3600 + minutes * 60;
    onSetDuration(Math.min(capped, 24 * 3600));
  };

  const handleMinuteChange = (m: number) => {
    if (hours === 24) return; // 24시간이면 분 변경 불가
    onSetDuration(hours * 3600 + m * 60);
  };

  // 종료 알람 화면
  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-950 via-red-900 to-slate-900 text-white text-center px-8 animate-fade-in">
        <div className="text-7xl mb-6 animate-pulse-ring">⏰</div>
        <h1 className="text-6xl font-bold mb-4">시간 종료!</h1>
        <p className="text-xl text-white/60 mb-12">설정한 시간이 끝났습니다</p>
        <button
          onClick={onDismiss}
          className="px-12 py-4 rounded-2xl bg-white text-red-900 font-bold text-xl hover:bg-white/90 transition-colors"
        >
          확인
        </button>
      </div>
    );
  }

  const isRunning = status === "running";
  const isIdle = status === "idle";

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white select-none">
      {/* 현재 시각 */}
      <p className="absolute top-8 right-8 text-slate-400 font-mono text-xl">
        {formatClock(now)}
      </p>

      {/* 남은 시간 표시 */}
      <div className="relative mb-10">
        {/* 원형 프로그레스 */}
        <svg width="280" height="280" className="-rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={isRunning ? "#3b82f6" : "#475569"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-bold tabular-nums">
            {formatRemaining(remaining)}
          </span>
          {!isIdle && (
            <span className="text-slate-400 text-sm mt-2">
              {isRunning ? "진행 중" : "일시정지"}
            </span>
          )}
        </div>
      </div>

      {/* 시간 설정 (idle 상태에서만) */}
      {isIdle && (
        <div className="flex items-center gap-2 mb-6 animate-slide-up">
          <div className="flex flex-col items-center">
            <label className="text-slate-500 text-xs mb-1">시간</label>
            <select
              value={hours}
              onChange={(e) => handleHourChange(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-lg focus:outline-none focus:border-blue-500 transition-colors text-center"
            >
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
          <span className="text-slate-400 text-2xl font-bold mt-4">:</span>
          <div className="flex flex-col items-center">
            <label className="text-slate-500 text-xs mb-1">분 (5분 단위)</label>
            <select
              value={hours === 24 ? 0 : minutes}
              onChange={(e) => handleMinuteChange(Number(e.target.value))}
              disabled={hours === 24}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-lg focus:outline-none focus:border-blue-500 transition-colors text-center disabled:opacity-40"
            >
              {MINUTE_OPTIONS.map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 프리셋 버튼 (idle 상태) */}
      {isIdle && (
        <div className="flex gap-1.5 mb-6 flex-wrap justify-center px-8">
          {[5, 15, 30, 45, 60].map((min) => (
            <button
              key={min}
              onClick={() => onSetDuration(min * 60)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                durationSeconds === min * 60
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {min >= 60 ? `${min / 60}시간` : `${min}분`}
            </button>
          ))}
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="flex gap-3 animate-slide-up">
        {(isIdle || status === "paused") && (
          <button
            onClick={onStart}
            disabled={durationSeconds === 0}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {status === "paused" ? "계속" : "시작"}
          </button>
        )}
        {isRunning && (
          <button
            onClick={onPause}
            className="px-8 py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-bold text-base transition-colors"
          >
            일시정지
          </button>
        )}
        {!isIdle && (
          <button
            onClick={onReset}
            className="px-5 py-3 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-200 font-medium text-base transition-colors"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}
