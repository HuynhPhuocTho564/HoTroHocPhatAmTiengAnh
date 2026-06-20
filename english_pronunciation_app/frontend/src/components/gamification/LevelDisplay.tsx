"use client";

import React from "react";
import { calculateLevelFromXp, getNextLevelXp } from "@/lib/gamification";
import Card from "@/components/ui/Card";

type LevelDisplayProps = {
  xp: number;
  variant?: "compact" | "full";
};

/**
 * LevelDisplay Component - Hiển thị cấp độ XP (gamification.ts-based)
 * Aligned with calculateLevelFromXp: level = floor(sqrt(xp/100)) + 1
 *
 * Props:
 * - xp: Tổng XP của user
 * - variant: "compact" (nhỏ gọn) hoặc "full" (đầy đủ)
 */
export default function LevelDisplay({
  xp,
  variant = "compact",
}: LevelDisplayProps) {
  const level = calculateLevelFromXp(xp);
  const nextLevelXp = getNextLevelXp(level);
  const previousLevelXp = level <= 1 ? 0 : getNextLevelXp(level - 1);
  const progress = nextLevelXp === previousLevelXp
    ? 0
    : Math.min(100, Math.round(((xp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100));

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-300 bg-primary-50 px-3 py-1.5">
        <span className="text-xl">🎓</span>
        <div className="text-left">
          <div className="text-xs font-bold text-primary-700">
            Cấp {level}
          </div>
          <div className="text-xs text-neutral-600">{xp.toLocaleString()} XP</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-primary-300 bg-primary-50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-5xl">🎓</div>
          <div>
            <div className="text-2xl font-bold text-primary-700">
              Cấp {level}
            </div>
            <div className="text-sm text-neutral-600">{xp.toLocaleString()} XP</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="mb-2 flex justify-between text-xs text-neutral-600">
          <span>Tiến độ lên cấp</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Next Level Info */}
      <div className="text-center text-xs text-neutral-600">
        Còn <span className="font-bold text-neutral-900">{(nextLevelXp - xp).toLocaleString()} XP</span> để lên{" "}
        <span className="font-bold">Cấp {level + 1}</span>
      </div>
    </Card>
  );
}
