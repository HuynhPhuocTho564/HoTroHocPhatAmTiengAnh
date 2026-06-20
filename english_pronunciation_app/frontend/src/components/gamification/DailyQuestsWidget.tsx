"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

type Quest = {
  id: string;
  questType: string;
  target: number;
  progress: number;
  completed: boolean;
  rewardXp: number;
  rewardGems: number;
};

type QuestApiResponse = {
  success: boolean;
  data?: { quests: Quest[] };
  error?: { code: string; message: string };
};

/** Quest type display labels */
const QUEST_LABELS: Record<string, string> = {
  PRACTICE_3: "Luyện 3 bài hôm nay",
  CD2_3: "Hoàn thành 3 bài CĐ2 Phụ âm",
  CD4_LINKING_3: "Hoàn thành 3 bài CĐ4 nối âm",
};

/**
 * DailyQuestsWidget - Hiển thị 3 nhiệm vụ hằng ngày trong sidebar dashboard.
 * Fetch từ /api/daily-quests (lazy generate 3 quest/ngày).
 */
export default function DailyQuestsWidget() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadQuests() {
      try {
        const response = await fetch("/api/daily-quests");
        const body = (await response.json()) as QuestApiResponse;

        if (!cancelled && body.success && body.data) {
          setQuests(body.data.quests);
        }
      } catch {
        // Silently fail - widget shows empty state
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadQuests();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <h3 className="mb-3 text-lg font-bold text-neutral-900">Nhiệm vụ hằng ngày</h3>
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-12 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-12 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </Card>
    );
  }

  if (quests.length === 0) return null;

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <Card className="mb-6 border-primary-200 bg-primary-50">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">Nhiệm vụ hằng ngày</h3>
        <span className="text-xs font-bold text-primary-600">
          {completedCount}/{quests.length}
        </span>
      </div>

      <ul className="space-y-3">
        {quests.map((quest) => {
          const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));
          const label = QUEST_LABELS[quest.questType] ?? quest.questType;

          return (
            <li
              key={quest.id}
              className={`rounded-lg border p-3 transition-colors ${
                quest.completed
                  ? "border-success-200 bg-success-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-sm font-semibold ${quest.completed ? "text-success-700" : "text-neutral-800"}`}>
                  {quest.completed ? "✓ " : ""}{label}
                </span>
                <span className="text-xs font-bold text-amber-600">
                  +{quest.rewardGems}💎 +{quest.rewardXp}XP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                  <div
                    className={`h-1.5 rounded-full transition-all ${quest.completed ? "bg-success-500" : "bg-primary-500"}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-neutral-500">
                  {quest.progress}/{quest.target}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
