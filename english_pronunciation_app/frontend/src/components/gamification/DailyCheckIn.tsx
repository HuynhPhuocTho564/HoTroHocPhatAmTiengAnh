"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DailyRewardsPopup from "./DailyRewardsPopup";

type DailyCheckInProps = {
  userId?: string; // User ID để gọi API
  currentStreak?: number;
  longestStreak?: number;
  lastCheckIn?: string;
  onCheckIn?: () => void;
};

/**
 * DailyCheckIn Component - Điểm danh tự động
 * 
 * Logic mới:
 * - Tự động ghi nhận khi user hoàn thành ít nhất 1 bài tập/ngày
 * - Hiển thị popup rương quà khi mở app lần đầu trong ngày
 * - Streak tăng tự động, không cần bấm nút
 */
export default function DailyCheckIn({
  userId = "mock-user-id",
  currentStreak = 3,
  longestStreak = 15,
  lastCheckIn,
  onCheckIn,
}: DailyCheckInProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [streak, setStreak] = useState(currentStreak);
  const [longest, setLongest] = useState(longestStreak);
  const [canClaim, setCanClaim] = useState(false);

  // Kiểm tra có thể claim reward không khi component mount
  useEffect(() => {
    checkCanClaim();
  }, []);

  const checkCanClaim = async () => {
    try {
      const response = await fetch(`/api/checkin?userId=${userId}`);
      const data = await response.json();
      
      if (data.canCheckIn) {
        setCanClaim(true);
        // Tự động hiển thị popup nếu chưa claim hôm nay
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
    }
  };

  const handleClaimReward = async (day: number) => {
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setStreak(data.currentStreak);
        setLongest(data.longestStreak);
        setCanClaim(false);
        
        if (onCheckIn) {
          onCheckIn();
        }
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  // Tạo lịch 7 ngày
  const weekDays = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    checked: streak >= i + 1,
  }));

  return (
    <>
      <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Chuỗi Ngày Học
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Hoàn thành bài tập mỗi ngày để tăng streak
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowPopup(true)}
            className={canClaim ? "animate-pulse" : ""}
            aria-label="Nhận quà hàng ngày"
          >
            {canClaim ? "🎁 Nhận quà" : "✅ Đã nhận"}
          </Button>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <div className="text-3xl font-bold text-primary-600 flex items-center gap-2">
              🔥 {streak}
            </div>
            <div className="text-sm text-neutral-600 mt-1">Chuỗi hiện tại</div>
            <div className="text-xs text-neutral-500 mt-1">ngày liên tiếp</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-accent-200">
            <div className="text-3xl font-bold text-accent-600 flex items-center gap-2">
              🏆 {longest}
            </div>
            <div className="text-sm text-neutral-600 mt-1">Kỷ lục cá nhân</div>
            <div className="text-xs text-neutral-500 mt-1">ngày liên tiếp</div>
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="mt-4 flex gap-2 justify-center">
          {weekDays.map((day) => (
            <div
              key={day.day}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                day.checked
                  ? "bg-success-500 text-white shadow-md"
                  : "bg-white text-neutral-400 border border-neutral-200"
              }`}
              aria-label={`Ngày ${day.day}: ${day.checked ? "Đã hoàn thành" : "Chưa hoàn thành"}`}
            >
              {day.checked ? "✓" : day.day}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-4 bg-white rounded-lg p-3 border border-primary-200">
          <p className="text-xs text-neutral-600 text-center">
            💡 Hoàn thành ít nhất 1 bài tập mỗi ngày để duy trì streak
          </p>
        </div>
      </Card>

      {/* Daily Rewards Popup */}
      {showPopup && (
        <DailyRewardsPopup
          currentStreak={streak}
          onClaim={handleClaimReward}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
