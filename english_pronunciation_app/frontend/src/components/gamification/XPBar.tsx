import React from "react";
import ProgressBar from "@/components/ui/ProgressBar";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

/**
 * XPBar Component - Hiển thị tiến độ kinh nghiệm
 * Gamification: Visual feedback cho progress
 */
export default function XPBar({ currentXP, nextLevelXP, level, className = "" }: XPBarProps) {
  return (
    <div className={`bg-white p-4 rounded-xl border border-neutral-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold shadow-md">
            {level}
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cấp độ</p>
            <p className="text-sm font-bold text-neutral-900">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kinh nghiệm</p>
          <p className="text-sm font-bold text-neutral-900">
            {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </p>
        </div>
      </div>
      
      <ProgressBar 
        value={currentXP} 
        max={nextLevelXP} 
        color="primary"
        size="lg"
        showPercentage={false}
      />
      
      <p className="text-xs text-neutral-500 mt-2 text-center">
        Còn {(nextLevelXP - currentXP).toLocaleString()} XP để lên cấp {level + 1}
      </p>
    </div>
  );
}
