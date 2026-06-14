"use client";

import React from "react";
import Card from "@/components/ui/Card";

export default function ReportsAnalytics() {
  // Mock data cho biểu đồ
  const weeklyStats = [
    { day: "T2", users: 45, exercises: 120 },
    { day: "T3", users: 52, exercises: 145 },
    { day: "T4", users: 48, exercises: 130 },
    { day: "T5", users: 61, exercises: 168 },
    { day: "T6", users: 55, exercises: 152 },
    { day: "T7", users: 38, exercises: 95 },
    { day: "CN", users: 32, exercises: 78 },
  ];

  const topExercises = [
    { name: "Ship or Sheep", completions: 234, avgScore: 85 },
    { name: "Think vs This", completions: 189, avgScore: 72 },
    { name: "Bad vs Bed", completions: 156, avgScore: 88 },
  ];

  const maxUsers = Math.max(...weeklyStats.map((s) => s.users));

  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Người dùng mới (7 ngày)</span>
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">127</p>
            <p className="text-xs text-success-600 mt-2">↑ +18% so với tuần trước</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Bài tập hoàn thành</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">888</p>
            <p className="text-xs text-success-600 mt-2">↑ +12% so với tuần trước</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Điểm trung bình</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">82%</p>
            <p className="text-xs text-success-600 mt-2">↑ +3% so với tuần trước</p>
          </div>
        </Card>
      </div>

      {/* Biểu đồ hoạt động theo tuần */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">
            Hoạt động trong tuần
          </h3>

          <div className="space-y-4">
            {weeklyStats.map((stat) => (
              <div key={stat.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700 w-12">
                    {stat.day}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-primary-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(stat.users / maxUsers) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {stat.users}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-600 w-24">
                        {stat.exercises} bài tập
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded"></div>
                <span className="text-neutral-600">Người dùng hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bài tập phổ biến */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">
            Bài tập phổ biến nhất
          </h3>

          <div className="space-y-4">
            {topExercises.map((exercise, index) => (
              <div
                key={exercise.name}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">{exercise.name}</h4>
                  <p className="text-sm text-neutral-600">
                    {exercise.completions} lượt hoàn thành
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900">
                    {exercise.avgScore}%
                  </div>
                  <div className="text-xs text-neutral-600">Điểm TB</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Xuất báo cáo */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Xuất báo cáo</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <button className="flex-1 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-medium">
              📊 Xuất báo cáo Excel
            </button>
            <button className="flex-1 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-medium">
              📄 Xuất báo cáo PDF
            </button>
            <button className="flex-1 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-medium">
              📧 Gửi email báo cáo
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
