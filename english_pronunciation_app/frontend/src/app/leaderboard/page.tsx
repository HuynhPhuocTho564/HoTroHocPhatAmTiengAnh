"use client";

import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { SkeletonLeaderboardList } from "@/components/ui/Skeleton";

type LeaderboardType = "tuan" | "thang" | "all";

type LeaderboardItem = {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  streak: number;
  score: number;
  correctAnswers: number;
  completedExercises: number;
  badges: Array<{
    name: string;
    type: string;
  }>;
};

type LeaderboardResponse =
  | {
      success: true;
      data: LeaderboardData;
    }
  | {
      success: false;
      error?: {
        code: string;
        message: string;
      };
    };

type LeaderboardData = {
  type: LeaderboardType;
  period: string;
  items: LeaderboardItem[];
  currentUser: {
    rank: number;
    score: number;
  } | null;
};

const filters: Array<{ id: LeaderboardType; name: string }> = [
  { id: "tuan", name: "Tuần này" },
  { id: "thang", name: "Tháng này" },
  { id: "all", name: "Mọi thời đại" },
];

function getRankLabel(rank: number) {
  if (rank === 1) return "1";
  if (rank === 2) return "2";
  if (rank === 3) return "3";
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>("tuan");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leaderboard?type=${type}&limit=20`);
        const body = (await response.json()) as LeaderboardResponse;

        if (cancelled) return;

        if (body.success) {
          setData(body.data);
        } else {
          setError(body.error?.message ?? "Không lấy được bảng xếp hạng.");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError("Không thể kết nối API bảng xếp hạng.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [type]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Bảng xếp hạng</h1>
          <p className="text-lg text-neutral-600">Điểm hạng reset theo tuần/tháng. Mọi thời đại xếp theo tổng XP.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setType(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                type === filter.id
                  ? "bg-primary-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {data?.currentUser && (
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  Thứ hạng của bạn
                  <Badge variant="info" size="sm">
                    {data.type}
                  </Badge>
                </div>
                <div className="text-sm text-neutral-600">
                  {data.type === "all" ? "Mọi thời đại" : `Kỳ ${data.period}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">#{data.currentUser.rank}</div>
                <div className="text-xs text-neutral-600">{data.currentUser.score.toLocaleString("vi-VN")} điểm</div>
              </div>
            </div>
          </Card>
        )}

        {isLoading && <SkeletonLeaderboardList count={5} />}
        {error && <Card className="border-error-200 text-error-600">{error}</Card>}

        {!isLoading && !error && (
          <Card padding="none">
            {data && data.items.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {data.items.map((user) => (
                  <div
                    key={`${user.rank}-${user.userId}`}
                    className={`flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors ${
                      user.rank <= 3 ? "bg-gradient-to-r from-yellow-50/40 to-transparent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          user.rank <= 3
                            ? "bg-yellow-100 border-2 border-yellow-300 text-yellow-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {getRankLabel(user.rank)}
                      </div>

                      <img
                        src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={`${user.username} avatar`}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-neutral-900 truncate">{user.username}</div>
                        <div className="text-sm text-neutral-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Cấp {user.level}</span>
                          <span>{user.completedExercises} bài</span>
                          <span>{user.correctAnswers} câu đúng</span>
                          <span>{user.streak} ngày streak</span>
                        </div>
                        {user.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.badges.map((badge) => (
                              <Badge key={`${user.userId}-${badge.name}`} variant="info" size="sm">
                                {badge.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-neutral-900">{user.score.toLocaleString("vi-VN")}</div>
                      <div className="text-xs text-neutral-500">
                        {data?.type === "all" ? "XP" : "điểm hạng"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-neutral-600">
                Chưa có dữ liệu xếp hạng cho kỳ này. Hãy làm bài hoặc điểm danh để tạo điểm hạng đầu tiên.
              </div>
            )}
          </Card>
        )}

        <Card className="mt-8 bg-primary-50 border-primary-200">
          <h3 className="font-bold text-neutral-900 mb-2">Cách tăng điểm hạng</h3>
          <ul className="text-sm text-neutral-700 space-y-1">
            <li>Hoàn thành bài lần đầu: cộng theo điểm bài làm.</li>
            <li>Làm lại điểm cao hơn: cộng phần cải thiện.</li>
            <li>Làm lại điểm thấp hơn: vẫn có điểm ôn tập nhỏ.</li>
            <li>Điểm danh mỗi ngày: +2 điểm hạng và +10 XP.</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
