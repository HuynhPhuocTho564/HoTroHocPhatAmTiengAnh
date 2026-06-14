"use client";

import React, { useState } from "react";
import DailyCheckIn from "@/components/gamification/DailyCheckIn";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type CheckInStatus = {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
  todayReward: {
    xp: number;
    rankingScore: number;
  };
};

const milestones = [
  {
    days: 3,
    title: "Khởi động thói quen",
    reward: "Huy hiệu COMMON",
  },
  {
    days: 7,
    title: "Một tuần bền bỉ",
    reward: "Huy hiệu RARE",
  },
  {
    days: 14,
    title: "Nhịp học ổn định",
    reward: "Huy hiệu EPIC",
  },
];

export default function CheckInPage() {
  const [status, setStatus] = useState<CheckInStatus | null>(null);
  const currentStreak = status?.currentStreak ?? 0;
  const longestStreak = status?.longestStreak ?? 0;
  const totalCheckIns = status?.totalCheckIns ?? 0;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Điểm danh hằng ngày</h1>
          <p className="text-lg text-neutral-600">
            Mỗi ngày điểm danh thành công sẽ cộng +10 XP và +2 điểm hạng.
          </p>
        </div>

        <div className="mb-8">
          <DailyCheckIn onCheckIn={setStatus} onStatusLoaded={setStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-4xl font-bold text-primary-600">{currentStreak}</div>
            <div className="text-sm font-medium text-neutral-700 mt-2">Chuỗi hiện tại</div>
            <div className="text-xs text-neutral-500 mt-1">ngày liên tiếp</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl font-bold text-accent-600">{longestStreak}</div>
            <div className="text-sm font-medium text-neutral-700 mt-2">Kỷ lục cá nhân</div>
            <div className="text-xs text-neutral-500 mt-1">ngày liên tiếp</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl font-bold text-neutral-900">{totalCheckIns}</div>
            <div className="text-sm font-medium text-neutral-700 mt-2">Tổng số ngày</div>
            <div className="text-xs text-neutral-500 mt-1">đã điểm danh</div>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Cột mốc streak</h2>

          <div className="space-y-4">
            {milestones.map((milestone) => {
              const achieved = currentStreak >= milestone.days;
              const remaining = Math.max(0, milestone.days - currentStreak);
              const progressPercent = Math.min(100, Math.round((currentStreak / milestone.days) * 100));

              return (
                <div
                  key={milestone.days}
                  className={`rounded-xl p-5 border-2 transition-all ${
                    achieved ? "bg-success-50 border-success-200" : "bg-white border-neutral-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-neutral-900">{milestone.title}</h3>
                        {achieved && (
                          <Badge variant="success" size="sm">
                            Đã đạt
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        Điểm danh liên tục {milestone.days} ngày để mở khóa.
                      </p>
                      <Badge variant={achieved ? "success" : "info"} size="sm">
                        {milestone.reward}
                      </Badge>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-bold text-neutral-900">
                        {Math.min(currentStreak, milestone.days)}/{milestone.days}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {achieved ? "Đã hoàn thành" : `Còn ${remaining} ngày`}
                      </div>
                    </div>
                  </div>

                  {!achieved && (
                    <div className="mt-4">
                      <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-primary-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mt-8 bg-primary-50 border-primary-200">
          <h3 className="font-bold text-neutral-900 mb-2">Lưu ý tính điểm</h3>
          <p className="text-sm text-neutral-700">
            Điểm danh chỉ được tính một lần mỗi ngày. Điểm check-in có cộng vào XP và leaderboard, nhưng mức cộng nhỏ để
            khuyến khích quay lại học mà không làm bảng xếp hạng bị spam.
          </p>
        </Card>
      </main>
    </div>
  );
}
