"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { TimerState } from "@/hooks/useTimer";
import { usePhotos } from "@/hooks/usePhotos";

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

const SLIDE_INTERVAL = 12000; // 12초마다 이미지 전환

export default function BreakView({ now, state, secondsUntilNext }: BreakViewProps) {
  const { currentPhoto, nextPhoto } = usePhotos();

  const advance = useCallback(() => {
    nextPhoto();
  }, [nextPhoto]);

  useEffect(() => {
    const id = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const isBreak = state === "break";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 배경 이미지 */}
      {currentPhoto ? (
        <Image
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt={currentPhoto.description}
          fill
          className="object-cover animate-fade-in"
          priority
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900" />
      )}

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 상단 현재 시각 */}
      <div className="absolute top-8 right-8 text-white/80 font-mono text-2xl font-light">
        {formatTime(now)}
      </div>

      {/* 중앙 메인 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
        <div className="animate-slide-up">
          {isBreak ? (
            <>
              <div className="text-6xl mb-4">🌿</div>
              <h1 className="text-7xl font-bold mb-4 drop-shadow-2xl">
                휴식 시간
              </h1>
              <p className="text-2xl text-white/80 mb-8 font-light">
                잠시 눈을 감고 휴식하세요
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📚</div>
              <h1 className="text-7xl font-bold mb-4 drop-shadow-2xl">
                수업 마무리
              </h1>
              <p className="text-2xl text-white/80 mb-8 font-light">
                수업을 정리하고 마무리하세요
              </p>
            </>
          )}

          {/* 카운트다운 카드 */}
          <div className="inline-block bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-10 py-5">
            <p className="text-sm text-white/60 mb-1">
              {isBreak ? "수업 마무리까지" : "다음 수업까지"}
            </p>
            <p className="text-4xl font-bold font-mono tabular-nums">
              {formatCountdown(secondsUntilNext)}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 이미지 출처 */}
      {currentPhoto && (
        <div className="absolute bottom-4 right-6 text-white/40 text-xs">
          Photo by {currentPhoto.photographer}
        </div>
      )}

      {/* 이미지 전환 버튼 */}
      <button
        onClick={advance}
        className="absolute bottom-4 left-6 text-white/40 hover:text-white/70 text-xs flex items-center gap-1 transition-colors"
      >
        <span>다음 사진 →</span>
      </button>
    </div>
  );
}
