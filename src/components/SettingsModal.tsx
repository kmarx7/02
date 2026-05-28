"use client";

import { useState } from "react";
import type { Settings } from "@/hooks/useSettings";

interface SettingsModalProps {
  settings: Settings;
  onSave: (next: Settings) => void;
  onClose: () => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function HourSelect({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex-1">
      <label className="block text-slate-400 text-xs mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-blue-500 transition-colors"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>
            {pad(i)}시
          </option>
        ))}
      </select>
    </div>
  );
}

function MinuteInput({
  value,
  onChange,
  label,
  max,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  max: number;
  color: string;
}) {
  return (
    <div className="flex-1">
      <label className="block text-slate-400 text-xs mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <span className={`font-mono text-lg ${color}`}>:</span>
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(parseInt(e.target.value) || 0, 0, max))}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}

export default function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [startHour, setStartHour] = useState(settings.startHour);
  const [endHour, setEndHour] = useState(settings.endHour);
  const [breakMinute, setBreakMinute] = useState(settings.breakMinute);
  const [wrapupMinute, setWrapupMinute] = useState(settings.wrapupMinute);

  const hourError = endHour <= startHour ? "종료 시간이 시작 시간보다 커야 합니다" : null;
  const minuteError = wrapupMinute <= breakMinute ? `마무리 분(${wrapupMinute})이 휴식 분(${breakMinute})보다 커야 합니다` : null;
  const hasError = !!hourError || !!minuteError;

  const handleSave = () => {
    if (hasError) return;
    onSave({ startHour, endHour, breakMinute, wrapupMinute });
    onClose();
  };

  const handleReset = () => {
    setStartHour(9);
    setEndHour(18);
    setBreakMinute(40);
    setWrapupMinute(50);
  };

  // 오늘 예정 알림 목록 생성
  const todaySlots: { time: string; label: string; color: string }[] = [];
  if (!hasError) {
    for (let h = startHour; h < endHour; h++) {
      todaySlots.push({
        time: `${pad(h)}:${pad(breakMinute)}`,
        label: "휴식",
        color: "text-green-400",
      });
      todaySlots.push({
        time: `${pad(h)}:${pad(wrapupMinute)}`,
        label: "마무리",
        color: "text-orange-400",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">시간 설정</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* 수업 운영 시간대 */}
        <div className="mb-5">
          <p className="text-slate-300 text-sm font-medium mb-3">수업 운영 시간대</p>
          <div className="flex gap-3 items-end">
            <HourSelect value={startHour} onChange={setStartHour} label="시작" />
            <span className="text-slate-500 pb-2 text-sm">~</span>
            <HourSelect value={endHour} onChange={setEndHour} label="종료" />
          </div>
          {hourError && <p className="text-red-400 text-xs mt-2">{hourError}</p>}
        </div>

        {/* 알림 시간 (분) */}
        <div className="mb-6">
          <p className="text-slate-300 text-sm font-medium mb-3">매시간 알림 시각 (분)</p>
          <div className="flex gap-3">
            <MinuteInput
              value={breakMinute}
              onChange={setBreakMinute}
              label="휴식 시작"
              max={58}
              color="text-green-400"
            />
            <MinuteInput
              value={wrapupMinute}
              onChange={setWrapupMinute}
              label="수업 마무리"
              max={59}
              color="text-orange-400"
            />
          </div>
          {minuteError && <p className="text-red-400 text-xs mt-2">{minuteError}</p>}
        </div>

        {/* 오늘 알림 스케줄 미리보기 */}
        {!hasError && (
          <div className="bg-slate-900 rounded-xl p-4 mb-6">
            <p className="text-slate-400 text-xs mb-3">오늘 알림 스케줄 ({todaySlots.length}건)</p>
            <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
              {todaySlots.map((slot) => (
                <div
                  key={slot.time}
                  className="flex flex-col items-center bg-slate-800 rounded-lg py-1.5 px-1"
                >
                  <span className={`font-mono text-xs font-bold ${slot.color}`}>
                    {slot.time}
                  </span>
                  <span className="text-slate-500 text-xs mt-0.5">{slot.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 border border-slate-600 hover:border-slate-500 transition-colors"
          >
            기본값
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={hasError}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
