"use client";

import { useState } from "react";
import type { Settings } from "@/hooks/useSettings";

interface SettingsModalProps {
  settings: Settings;
  onSave: (next: Settings) => void;
  onClose: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function SettingsModal({
  settings,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [breakMinute, setBreakMinute] = useState(settings.breakMinute);
  const [wrapupMinute, setWrapupMinute] = useState(settings.wrapupMinute);

  const breakError =
    breakMinute < 0 || breakMinute > 58
      ? "0~58 사이 값을 입력하세요"
      : null;
  const wrapupError =
    wrapupMinute <= breakMinute || wrapupMinute > 59
      ? `휴식 시작(${breakMinute}분)보다 커야 합니다`
      : null;
  const hasError = !!breakError || !!wrapupError;

  const handleSave = () => {
    if (hasError) return;
    onSave({ breakMinute, wrapupMinute });
    onClose();
  };

  const handleReset = () => {
    setBreakMinute(40);
    setWrapupMinute(50);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">시간 설정</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* 미리보기 */}
        <div className="bg-slate-900 rounded-xl p-4 mb-6 text-sm">
          <p className="text-slate-400 text-xs mb-2">매시간 스케줄 미리보기</p>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-mono text-blue-400">:00</span>
            <span className="text-slate-500">→</span>
            <span>수업 시작</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 mt-1">
            <span className="font-mono text-green-400">
              :{String(breakMinute).padStart(2, "0")}
            </span>
            <span className="text-slate-500">→</span>
            <span>휴식 시작</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 mt-1">
            <span className="font-mono text-orange-400">
              :{String(wrapupMinute).padStart(2, "0")}
            </span>
            <span className="text-slate-500">→</span>
            <span>수업 마무리</span>
          </div>
        </div>

        {/* 휴식 시작 */}
        <div className="mb-5">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            휴식 시작 <span className="text-slate-500">(분, 0~58)</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-mono text-lg">:</span>
            <input
              type="number"
              min={0}
              max={58}
              value={breakMinute}
              onChange={(e) =>
                setBreakMinute(clamp(parseInt(e.target.value) || 0, 0, 58))
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          {breakError && (
            <p className="text-red-400 text-xs mt-1">{breakError}</p>
          )}
        </div>

        {/* 수업 마무리 */}
        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            수업 마무리 <span className="text-slate-500">(분, 0~59)</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-mono text-lg">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={wrapupMinute}
              onChange={(e) =>
                setWrapupMinute(clamp(parseInt(e.target.value) || 0, 0, 59))
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          {wrapupError && (
            <p className="text-red-400 text-xs mt-1">{wrapupError}</p>
          )}
        </div>

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
