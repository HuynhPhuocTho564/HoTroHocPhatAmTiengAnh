"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type LeaderboardUser = {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  completedLessons: number;
  streak: number;
  level: number;
};

type TimeFilter = "week" | "month" | "allTime";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  // Mock data - sẽ fetch từ API
  const leaderboardData: Record<TimeFilter, LeaderboardUser[]> = {
    week: [
      {
        rank: 1,
        username: "Minh Nguyen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        score: 2850,
        completedLessons: 28,
        streak: 7,
        level: 15,
      },
      {
        rank: 2,
        username: "Thu Tran",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu",
        score: 2640,
        completedLessons: 25,
        streak: 6,
        level: 14,
      },
      {
        rank: 3,
        username: "Huy Le",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
        score: 2420,
        completedLessons: 23,
        streak: 5,
        level: 13,
      },
      {
        rank: 4,
        username: "Linh Pham",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
        score: 2180,
        completedLessons: 21,
        streak: 4,
        level: 12,
      },
      {
        rank: 5,
        username: "Nam Vo",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
        score: 1950,
        completedLessons: 19,
        streak: 3,
        level: 11,
      },
    ],
    month: [
      {
        rank: 1,
        username: "Thu Tran",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu",
        score: 8640,
        completedLessons: 42,
        streak: 28,
        level: 18,
      },
      {
        rank: 2,
        username: "Minh Nguyen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        score: 8350,
        completedLessons: 40,
        streak: 25,
        level: 17,
      },
      {
        rank: 3,
        username: "Huy Le",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
        score: 7920,
        completedLessons: 38,
        streak: 22,
        level: 16,
      },
    ],
    allTime: [
      {
        rank: 1,
        username: "Minh Nguyen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        score: 15850,
        completedLessons: 44,
        streak: 45,
        level: 22,
      },
      {
        rank: 2,
        username: "Thu Tran",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu",
        score: 14640,
        completedLessons: 44,
        streak: 42,
        level: 21,
      },
      {
        rank: 3,
        username: "Huy Le",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
        score: 13420,
        completedLessons: 42,
        streak: 38,
        level: 20,
      },
    ],
  };

  const currentUser = {
    rank: 12,
    username: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    score: 1250,
    completedLessons: 15,
    streak: 5,
    level: 8,
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: "🥇", color: "text-yellow-500" };
    if (rank === 2) return { emoji: "🥈", color: "text-neutral-400" };
    if (rank === 3) return { emoji: "🥉", color: "text-orange-600" };
    return { emoji: `#${rank}`, color: "text-neutral-600" };
  };

  const getTimeFilterLabel = (filter: TimeFilter) => {
    const labels = {
      week: "Tuần này",
      month: "Tháng này",
      allTime: "Mọi thời điểm",
    };
    return labels[filter];
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Bảng Xếp Hạng
          </h1>
          <p className="text-lg text-neutral-600">
            Cạnh tranh với các học viên khác và leo lên top đầu
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {(["week", "month", "allTime"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                timeFilter === filter
                  ? "bg-primary-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {getTimeFilterLabel(filter)}
            </button>
          ))}
        </div>

        {/* Current User Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                {currentUser.rank}
              </div>
              <img
                src={currentUser.avatar}
                alt="Your avatar"
                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
              />
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  {currentUser.username}
                  <Badge variant="info" size="sm">
                    Bạn
                  </Badge>
                </div>
                <div className="text-sm text-neutral-600">
                  Cấp độ {currentUser.level}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {currentUser.score.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-600">điểm</div>
            </div>
          </div>
        </Card>

        {/* Leaderboard List */}
        <Card>
          <div className="divide-y divide-neutral-100">
            {leaderboardData[timeFilter].map((user) => {
              const rankBadge = getRankBadge(user.rank);
              
              return (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors ${
                    user.rank <= 3 ? "bg-gradient-to-r from-yellow-50/30 to-transparent" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        user.rank <= 3
                          ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      <span className={rankBadge.color}>{rankBadge.emoji}</span>
                    </div>

                    {/* Avatar & Info */}
                    <img
                      src={user.avatar}
                      alt={`${user.username} avatar`}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-neutral-900">{user.username}</div>
                      <div className="text-sm text-neutral-600 flex items-center gap-3">
                        <span>Cấp {user.level}</span>
                        <span className="text-neutral-300">•</span>
                        <span>{user.completedLessons} bài</span>
                        <span className="text-neutral-300">•</span>
                        <span className="flex items-center gap-1">
                          🔥 {user.streak} ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-neutral-900">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">điểm</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-primary-50 border-primary-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">Cách tăng điểm</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>• Hoàn thành bài học: +100 điểm</li>
                <li>• Đạt điểm hoàn hảo (100%): +50 điểm bonus</li>
                <li>• Duy trì streak hàng ngày: +10 điểm/ngày</li>
                <li>• Lên cấp: +200 điểm</li>
              </ul>
            </div>
          </div>
        </Card>

      </main>
    </div>
  );
}
