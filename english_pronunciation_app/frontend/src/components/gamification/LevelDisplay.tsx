"use client";

import React from "react";
import { getLevelInfo, getLevelColor } from "@/lib/levelSystem";
import Card from "@/components/ui/Card";

type LevelDisplayProps = {
  completedLessons: number;
  variant?: "compact" | "full";
};

/**
 * LevelDisplay Component - Hiển thị cấp độ và tiến trình
 * 
 * Props:
 * - completedLessons: Số bài học đã hoàn thành
 * - variant: "compact" (nhỏ gọn) hoặc "full" (đầy đủ)
 */
export default function LevelDisplay({
  completedLessons,
  variant = "compact",
}: LevelDisplayProps) {
  const levelInfo = getLevelInfo(completedLessons);
  const colors = getLevelColor(levelInfo.level);

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${colors.bg} ${colors.border}`}
      >
        <span className="text-xl">{levelInfo.icon}</span>
        <div className="text-left">
          <div className={`text-xs font-bold ${colors.text}`}>
            Cấp {levelInfo.level}
          </div>
          <div className="text-xs text-neutral-600">{levelInfo.title}</div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`${colors.bg} border-2 ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{levelInfo.icon}</div>
          <div>
            <div className={`text-2xl font-bold ${colors.text}`}>
              Cấp {levelInfo.level}
            </div>
            <div className="text-sm text-neutral-600">{levelInfo.title}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-neutral-600 mb-2">
          <span>Tiến độ lên cấp</span>
          <span>
            {levelInfo.currentLessons}/5 bài
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              levelInfo.level <= 2
                ? "bg-sky-500"
                : levelInfo.level <= 4
                ? "bg-primary-500"
                : levelInfo.level <= 6
                ? "bg-purple-500"
                : levelInfo.level <= 8
                ? "bg-accent-500"
                : "bg-yellow-500"
            }`}
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
      </div>

      {/* Next Level Info */}
      <div className="text-xs text-neutral-600 text-center">
        {levelInfo.lessonsForNextLevel > 0 ? (
          <>
            Còn <span className="font-bold text-neutral-900">{levelInfo.lessonsForNextLevel} bài</span> để lên{" "}
            <span className="font-bold">Cấp {levelInfo.level + 1}</span>
          </>
        ) : (
          <span className="font-bold text-success-600">
            🎉 Đã đạt cấp độ tối đa!
          </span>
        )}
      </div>
    </Card>
  );
}
