"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type BadgeItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
};

type BadgeCategory = "achievement" | "streak" | "mastery" | "special";

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "all">("all");

  // Mock data - sẽ fetch từ API
  const badges: BadgeItem[] = [
    {
      id: "first-lesson",
      name: "Bước Đầu Tiên",
      description: "Hoàn thành bài học đầu tiên",
      icon: "🎯",
      rarity: "common",
      condition: "Hoàn thành 1 bài học",
      earned: true,
      earnedDate: "2026-05-15",
    },
    {
      id: "week-warrior",
      name: "Chiến Binh Tuần",
      description: "Học liên tục 7 ngày",
      icon: "🔥",
      rarity: "rare",
      condition: "Duy trì streak 7 ngày",
      earned: true,
      earnedDate: "2026-05-22",
    },
    {
      id: "vowel-master",
      name: "Bậc Thầy Nguyên Âm",
      description: "Hoàn thành tất cả bài học nguyên âm",
      icon: "🎓",
      rarity: "epic",
      condition: "Hoàn thành 20 bài học nguyên âm",
      earned: false,
      progress: 15,
      maxProgress: 20,
    },
    {
      id: "perfect-score",
      name: "Hoàn Hảo",
      description: "Đạt 100% trong 10 bài học",
      icon: "⭐",
      rarity: "rare",
      condition: "Đạt điểm tối đa 10 lần",
      earned: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: "month-champion",
      name: "Nhà Vô Địch Tháng",
      description: "Học liên tục 30 ngày",
      icon: "👑",
      rarity: "epic",
      condition: "Duy trì streak 30 ngày",
      earned: false,
      progress: 7,
      maxProgress: 30,
    },
    {
      id: "phonetic-master",
      name: "Phonetic Master",
      description: "Hoàn thành tất cả 44 âm vị",
      icon: "🏆",
      rarity: "legendary",
      condition: "Hoàn thành 44/44 âm vị",
      earned: false,
      progress: 11,
      maxProgress: 44,
    },
    {
      id: "early-bird",
      name: "Chim Sớm",
      description: "Học trước 8h sáng 5 ngày",
      icon: "🌅",
      rarity: "common",
      condition: "Học sáng sớm 5 lần",
      earned: false,
      progress: 2,
      maxProgress: 5,
    },
    {
      id: "night-owl",
      name: "Cú Đêm",
      description: "Học sau 10h tối 5 ngày",
      icon: "🦉",
      rarity: "common",
      condition: "Học đêm muộn 5 lần",
      earned: false,
      progress: 1,
      maxProgress: 5,
    },
    {
      id: "social-learner",
      name: "Người Học Xã Hội",
      description: "Chia sẻ tiến độ 3 lần",
      icon: "🤝",
      rarity: "rare",
      condition: "Chia sẻ lên mạng xã hội 3 lần",
      earned: false,
      progress: 0,
      maxProgress: 3,
    },
  ];

  const categories = [
    { id: "all" as const, name: "Tất cả", icon: "🎖️" },
    { id: "achievement" as const, name: "Thành tựu", icon: "🏅" },
    { id: "streak" as const, name: "Chuỗi ngày", icon: "🔥" },
    { id: "mastery" as const, name: "Thành thạo", icon: "🎓" },
    { id: "special" as const, name: "Đặc biệt", icon: "✨" },
  ];

  const getRarityColor = (rarity: BadgeItem["rarity"]) => {
    const colors = {
      common: {
        bg: "bg-neutral-100",
        border: "border-neutral-300",
        text: "text-neutral-700",
        badge: "default" as const,
      },
      rare: {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-700",
        badge: "info" as const,
      },
      epic: {
        bg: "bg-purple-100",
        border: "border-purple-300",
        text: "text-purple-700",
        badge: "info" as const,
      },
      legendary: {
        bg: "bg-yellow-100",
        border: "border-yellow-400",
        text: "text-yellow-700",
        badge: "warning" as const,
      },
    };
    return colors[rarity];
  };

  const getRarityLabel = (rarity: BadgeItem["rarity"]) => {
    const labels = {
      common: "Phổ thông",
      rare: "Hiếm",
      epic: "Sử thi",
      legendary: "Huyền thoại",
    };
    return labels[rarity];
  };

  const earnedBadges = badges.filter((b) => b.earned);
  const totalBadges = badges.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Huy Hiệu & Thành Tích
          </h1>
          <p className="text-lg text-neutral-600">
            Thu thập huy hiệu khi hoàn thành các thử thách
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Bộ sưu tập của bạn
              </h2>
              <p className="text-neutral-600">
                {earnedBadges.length} / {totalBadges} huy hiệu đã mở khóa
              </p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(earnedBadges.length / totalBadges) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                selectedCategory === category.id
                  ? "bg-primary-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const rarityColors = getRarityColor(badge.rarity);
            
            return (
              <Card
                key={badge.id}
                className={`relative ${
                  badge.earned ? "" : "opacity-75"
                } ${rarityColors.border} border-2`}
                hover
              >
                {/* Rarity Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={rarityColors.badge} size="sm">
                    {getRarityLabel(badge.rarity)}
                  </Badge>
                </div>

                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl ${rarityColors.bg} flex items-center justify-center text-4xl mb-4 mx-auto ${
                    badge.earned ? "" : "grayscale"
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">
                  {badge.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-600 text-center mb-4">
                  {badge.description}
                </p>

                {/* Condition */}
                <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-neutral-500 text-center">
                    {badge.condition}
                  </p>
                </div>

                {/* Progress or Earned Date */}
                {badge.earned ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đã mở khóa
                    </div>
                    {badge.earnedDate && (
                      <p className="text-xs text-neutral-500 mt-2">
                        {new Date(badge.earnedDate).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>
                ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 mb-1">
                      <span>Tiến độ</span>
                      <span>
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${rarityColors.bg} h-full rounded-full transition-all duration-300`}
                        style={{
                          width: `${(badge.progress / badge.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đã khóa
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </main>
    </div>
  );
}
