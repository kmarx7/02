"use client";

import { TimerState } from "@/hooks/useTimer";

interface ClockViewProps {
  now: Date;
  state: TimerState;
  secondsUntilNext: number;
  permissionGranted: boolean;
  onRequestPermission: () => void;
  onOpenSettings: () => void;
  breakMinute: number;
  wrapupMinute: number;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}

const STATE_INFO: Record<TimerState, { label: string; next: string; color: string; bg: string }> = {
  normal: {
    label: "수업 진행 중",
    next: "휴식까지",
    color: "text-blue-300",
    bg: "bg-blue-500/20",
  },
  break: {
    label: "휴식 시간",
    next: "수업 마무리까지",
    color: "text-green-300",
    bg: "bg-green-500/20",
  },
  wrapup: {
    label: "수업 마무리",
    next: "다음 수업까지",
    color: "text-orange-300",
    bg: "bg-orange-500/20",
  },
};

export default function ClockView({
  now,
  state,
  secondsUntilNext,
  permissionGranted,
  onRequestPermission,
  onOpenSettings,
  breakMinute,
  wrapupMinute,
}: ClockViewProps) {
  const info = STATE_INFO[state];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white select-none relative">
      {/* 날짜 */}
      <p className="text-slate-400 text-lg mb-2 animate-slide-up">
        {formatDate(now)}
      </p>

      {/* 시계 */}
      <div className="font-mono text-8xl md:text-9xl font-bold tracking-tight mb-8 tabular-nums animate-slide-up">
        {formatTime(now)}
      </div>

      {/* 현재 상태 뱃지 */}
      <div
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 ${info.bg} ${info.color} border border-current/30 animate-slide-up`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
        {info.label}
      </div>

      {/* 다음 이벤트 카운트다운 */}
      <div className="text-center animate-slide-up">
        <p className="text-slate-400 text-sm mb-1">{info.next}</p>
        <p className={`text-3xl font-semibold tabular-nums ${info.color}`}>
          {formatCountdown(secondsUntilNext)}
        </p>
      </div>

      {/* 시간표 안내 */}
      <div className="mt-12 flex gap-6 text-slate-500 text-sm animate-slide-up">
        <div className="text-center">
          <div className="text-xs mb-1">매 시각</div>
          <div className="text-white font-mono">:00</div>
          <div className="text-xs mt-1">수업 시작</div>
        </div>
        <div className="w-px bg-slate-700" />
        <div className="text-center">
          <div className="text-xs mb-1">매 시각</div>
          <div className="text-green-400 font-mono">:{String(breakMinute).padStart(2, "0")}</div>
          <div className="text-xs mt-1">휴식 시작</div>
        </div>
        <div className="w-px bg-slate-700" />
        <div className="text-center">
          <div className="text-xs mb-1">매 시각</div>
          <div className="text-orange-400 font-mono">:{String(wrapupMinute).padStart(2, "0")}</div>
          <div className="text-xs mt-1">수업 마무리</div>
        </div>
      </div>

      {/* 설정 버튼 */}
      <button
        onClick={onOpenSettings}
        className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-white/5"
        title="시간 설정"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {/* 알림 권한 요청 */}
      {!permissionGranted && (
        <button
          onClick={onRequestPermission}
          className="mt-10 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-slate-300 border border-white/10 transition-all animate-slide-up"
        >
          🔔 브라우저 알림 허용
        </button>
      )}
    </div>
  );
}
