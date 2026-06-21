"use client";

import React, { useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import AchievementShare from "@/components/gamification/AchievementShare";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";
import { localizeBadgeType } from "@/lib/badges";

type BadgeCategory = "progress" | "skill" | "streak" | "improvement" | "ranking";

type BadgeProgress = {
  current: number;
  target: number;
  unit: string;
} | null;

type EarnedBadge = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  image: string | null;
  condition: string | null;
  category: BadgeCategory;
  earnedAt: string;
  validPeriod: string | null;
};

type AvailableBadge = {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string | null;
  condition: string;
  category: BadgeCategory;
  progress: BadgeProgress;
};

type BadgesData = {
  earned: EarnedBadge[];
  available: AvailableBadge[];
  summary: {
    earnedCount: number;
    totalCount: number;
  };
};

type BadgesResponse =
  | {
      success: true;
      data: BadgesData;
    }
  | {
      success: false;
      error?: {
        code: string;
        message: string;
      };
    };

const categories: Array<{ id: BadgeCategory | "all"; name: string }> = [
  { id: "all", name: "Tất cả" },
  { id: "progress", name: "Tiến độ" },
  { id: "skill", name: "Kỹ năng" },
  { id: "streak", name: "Chuỗi ngày" },
  { id: "improvement", name: "Cải thiện" },
  { id: "ranking", name: "Xếp hạng" },
];

function getBadgeVariant(type: string) {
  if (type === "COMMON") return "default" as const;
  if (type === "RARE") return "info" as const;
  if (type === "EPIC") return "warning" as const;
  if (type === "PERIODIC") return "success" as const;
  return "default" as const;
}

function BadgeCard({
  badge,
  earned,
}: {
  badge: EarnedBadge | AvailableBadge;
  earned: boolean;
}) {
  const progress = "progress" in badge ? badge.progress : null;
  const progressPercent = progress ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0;

  return (
    <Card className={`${earned ? "" : "opacity-80"} border-2`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl font-bold text-neutral-800">
          {badge.name.slice(0, 1).toUpperCase()}
        </div>
        <Badge variant={getBadgeVariant(badge.type)} size="sm">
          {localizeBadgeType(badge.type)}
        </Badge>
      </div>

      <h3 className="text-xl font-bold text-neutral-900 mb-2">{badge.name}</h3>
      <p className="text-sm text-neutral-600 mb-4">{badge.description}</p>

      <div className="bg-neutral-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-neutral-500">{badge.condition}</p>
      </div>

      {earned && "earnedAt" in badge ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              Đã đạt
            </Badge>
            <span className="text-xs text-neutral-500">{new Date(badge.earnedAt).toLocaleDateString("vi-VN")}</span>
          </div>
          {/* Task 6.1: share button cho badge đã đạt (Nielsen H7 — flexibility) */}
          <AchievementShare
            variant="compact"
            icon="🏅"
            title={`Tôi vừa đạt huy hiệu "${badge.name}" trên PhatAmEN!`}
            description={badge.description ?? `Huy hiệu ${localizeBadgeType(badge.type)}`}
          />
        </div>
      ) : progress ? (
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1">
            <span>Tiến độ</span>
            <span>
              {progress.current}/{progress.target}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : (
        <Badge variant="default" size="sm">
          Chưa đạt
        </Badge>
      )}
    </Card>
  );
}

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "all">("all");
  const [data, setData] = useState<BadgesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBadges() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/badges");
        const body = (await response.json()) as BadgesResponse;

        if (cancelled) return;

        if (body.success) {
          setData(body.data);
        } else {
          setError(body.error?.message ?? "Không lấy được danh sách huy hiệu.");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError("Không thể kết nối API huy hiệu.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBadges();

    return () => {
      cancelled = true;
    };
  }, []);

  const badges = useMemo(() => {
    if (!data) return [];

    const allBadges = [
      ...data.earned.map((badge) => ({ badge, earned: true })),
      ...data.available.map((badge) => ({ badge, earned: false })),
    ];

    if (selectedCategory === "all") {
      return allBadges;
    }

    return allBadges.filter((item) => item.badge.category === selectedCategory);
  }, [data, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Huy hiệu & thành tích</h1>
          <p className="text-lg text-neutral-600">Theo dõi các mốc học tập đã đạt và mục tiêu tiếp theo.</p>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Bộ sưu tập của bạn</h2>
              <p className="text-neutral-600">
                {data ? `${data.summary.earnedCount} / ${data.summary.totalCount} huy hiệu đã mở khóa` : "Đang tải dữ liệu"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-700">{data?.summary.earnedCount ?? 0}</div>
              <div className="text-xs text-neutral-500">đã đạt</div>
            </div>
          </div>
          {data && (
            <div className="mt-4">
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(data.summary.earnedCount / data.summary.totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Card>

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
              {category.name}
            </button>
          ))}
        </div>

        {isLoading && <SkeletonCardGrid count={6} />}
        {error && <Card className="border-error-200 text-error-600">{error}</Card>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((item) => (
              <BadgeCard key={item.badge.id} badge={item.badge} earned={item.earned} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
