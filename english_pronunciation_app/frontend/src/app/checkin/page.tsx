"use client";

import React from "react";
import DailyCheckIn from "@/components/gamification/DailyCheckIn";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type StreakMilestone = {
  days: number;
  title: string;
  icon: string;
  reward: string;
  achieved: boolean;
};

export default function CheckInPage() {
  // Mock data - sẽ fetch từ API
  const currentStreak = 5;
  const longestStreak = 15;
  const totalCheckIns = 42;
  const lastCheckIn = "2026-05-31T10:30:00"; // Hôm qua

  const milestones: StreakMilestone[] = [
    {
      days: 3,
      title: "Khởi đầu tốt",
      icon: "🌱",
      reward: "Huy hiệu Người mới",
      achieved: true,
    },
    {
      days: 7,
      title: "Tuần hoàn hảo",
      icon: "⭐",
      reward: "50 xu + Huy hiệu",
      achieved: true,
    },
    {
      days: 14,
      title: "Hai tuần kiên trì",
      icon: "🎖️",
      reward: "100 xu + Huy hiệu",
      achieved: true,
    },
    {
      days: 30,
      title: "Tháng vàng",
      icon: "👑",
      reward: "300 xu + Huy hiệu Vàng",
      achieved: false,
    },
    {
      days: 60,
      title: "Hai tháng bền bỉ",
      icon: "💎",
      reward: "500 xu + Huy hiệu Kim Cương",
      achieved: false,
    },
    {
      days: 100,
      title: "Trăm ngày huyền thoại",
      icon: "🏆",
      reward: "1000 xu + Huy hiệu Huyền Thoại",
      achieved: false,
    },
  ];

  const handleCheckIn = () => {
    // TODO: Gọi API để lưu check-in
    console.log("Check-in successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        
        {/* Header with colorful accent */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl animate-bounce">🔥</div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Điểm Danh Hàng Ngày
          </h1>
          <p className="text-lg text-neutral-600">
            Duy trì chuỗi ngày học để nhận phần thưởng hấp dẫn
          </p>
        </div>

        {/* Daily Check-in Card */}
        <div className="mb-8">
          <DailyCheckIn
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            lastCheckIn={lastCheckIn}
            onCheckIn={handleCheckIn}
          />
        </div>

        {/* Stats Grid with vibrant colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-3 animate-pulse">🔥</div>
            <div className="text-4xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-sm font-medium text-orange-700 mt-2">Chuỗi hiện tại</div>
            <div className="text-xs text-orange-600 mt-1">ngày liên tiếp</div>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-3">🏆</div>
            <div className="text-4xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-sm font-medium text-purple-700 mt-2">Kỷ lục cá nhân</div>
            <div className="text-xs text-purple-600 mt-1">ngày liên tiếp</div>
          </Card>

          <Card className="text-center bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-3">📅</div>
            <div className="text-4xl font-bold text-teal-600">{totalCheckIns}</div>
            <div className="text-sm font-medium text-teal-700 mt-2">Tổng số ngày</div>
            <div className="text-xs text-teal-600 mt-1">đã điểm danh</div>
          </Card>
        </div>

        {/* Milestones with colorful design */}
        <Card className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 shadow-lg">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Cột mốc thành tích
            </span>
          </h2>

          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              // Màu sắc đa dạng cho từng milestone
              const colors = [
                { bg: "from-green-50 to-green-100", border: "border-green-300", icon: "bg-green-100 border-green-400", text: "text-green-700" },
                { bg: "from-blue-50 to-blue-100", border: "border-blue-300", icon: "bg-blue-100 border-blue-400", text: "text-blue-700" },
                { bg: "from-purple-50 to-purple-100", border: "border-purple-300", icon: "bg-purple-100 border-purple-400", text: "text-purple-700" },
                { bg: "from-yellow-50 to-yellow-100", border: "border-yellow-300", icon: "bg-yellow-100 border-yellow-400", text: "text-yellow-700" },
                { bg: "from-pink-50 to-pink-100", border: "border-pink-300", icon: "bg-pink-100 border-pink-400", text: "text-pink-700" },
                { bg: "from-orange-50 to-orange-100", border: "border-orange-300", icon: "bg-orange-100 border-orange-400", text: "text-orange-700" },
              ];
              const color = colors[index % colors.length];
              
              return (
              <div
                key={milestone.days}
                className={`relative rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  milestone.achieved
                    ? `bg-gradient-to-r ${color.bg} ${color.border}`
                    : "bg-white border-neutral-200 opacity-75"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon with color */}
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-3 shadow-md ${
                      milestone.achieved
                        ? `${color.icon}`
                        : "bg-neutral-100 border-2 border-neutral-300 grayscale"
                    }`}
                  >
                    {milestone.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${milestone.achieved ? color.text : "text-neutral-700"}`}>
                        {milestone.title}
                      </h3>
                      {milestone.achieved && (
                        <Badge variant="success" size="sm">
                          ✅ Đã đạt
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Điểm danh liên tục {milestone.days} ngày
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        🎁 {milestone.reward}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="text-right">
                    {milestone.achieved ? (
                      <div className="text-5xl">✅</div>
                    ) : (
                      <div>
                        <div className="text-3xl font-bold text-neutral-900">
                          {currentStreak}/{milestone.days}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          Còn {milestone.days - currentStreak} ngày
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar with gradient */}
                {!milestone.achieved && (
                  <div className="mt-4">
                    <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-md"
                        style={{
                          width: `${Math.min((currentStreak / milestone.days) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </Card>

        {/* Tips Card with gradient */}
        <Card className="mt-8 bg-gradient-to-r from-sky-50 via-purple-50 to-pink-50 border-2 border-sky-300 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Mẹo duy trì chuỗi ngày
              </h3>
              <ul className="text-sm text-neutral-700 space-y-3">
                <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
                  <span className="text-2xl">⏰</span>
                  <span>Đặt lịch nhắc hàng ngày vào cùng một giờ</span>
                </li>
                <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
                  <span className="text-2xl">✅</span>
                  <span>Điểm danh ngay sau khi hoàn thành bài học</span>
                </li>
                <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
                  <span className="text-2xl">🌙</span>
                  <span>Nếu quên, hãy điểm danh trước 23:59 cùng ngày</span>
                </li>
                <li className="flex items-start gap-3 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
                  <span className="text-2xl">👥</span>
                  <span>Chia sẻ tiến độ với bạn bè để tạo động lực</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

      </main>
    </div>
  );
}
