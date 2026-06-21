import React from "react";

/**
 * PodiumCard — card top-3 cho leaderboard podium (Von Restorff — top 3 khác #4-20).
 *
 * Layout: avatar + crown (champion) → name → score → podium base (gradient theo rank).
 * #1 ở giữa lớn nhất + crown 👑, #2 trái, #3 phải (Fitts — focal point giữa).
 *
 * Medal colors chuẩn: Gold #1, Silver #2, Bronze #3 (ui-color-harmony).
 *
 * @module gamification/PodiumCard
 */

type PodiumUser = {
  username: string;
  avatarUrl: string | null;
  score: number;
};

type PodiumCardProps = {
  user: PodiumUser;
  rank: 1 | 2 | 3;
  height: string;
  isChampion?: boolean;
};

const PODIUM_GRADIENTS: Record<1 | 2 | 3, string> = {
  1: "from-yellow-400 to-amber-500",
  2: "from-neutral-300 to-neutral-400",
  3: "from-amber-600 to-amber-700",
};

function dicebearAvatar(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
}

export default function PodiumCard({ user, rank, height, isChampion = false }: PodiumCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Avatar + crown */}
      <div className={`relative ${isChampion ? "mb-3" : "mb-2"}`}>
        <img
          src={user.avatarUrl ?? dicebearAvatar(user.username)}
          alt={`Avatar của ${user.username}`}
          className={`rounded-full border-4 ${isChampion ? "h-20 w-20" : "h-16 w-16"} border-white shadow-lg bg-white`}
        />
        {isChampion && (
          <span
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
            aria-label="Quán quân"
            role="img"
          >
            👑
          </span>
        )}
      </div>

      {/* Name */}
      <p className="max-w-[110px] truncate text-sm font-bold text-neutral-900">
        {user.username}
      </p>

      {/* Score */}
      <p className="text-xs font-semibold text-neutral-600">
        {user.score.toLocaleString("vi-VN")}
      </p>

      {/* Podium base */}
      <div
        className={`mt-2 flex w-24 items-center justify-center rounded-t-lg bg-gradient-to-t ${PODIUM_GRADIENTS[rank]} ${height}`}
      >
        <span className="text-3xl font-black text-white/90">#{rank}</span>
      </div>
    </div>
  );
}
