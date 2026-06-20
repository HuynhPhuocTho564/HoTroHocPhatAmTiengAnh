import type { LeaderboardPeriodType } from "@/lib/period";
import { getLeaderboardPeriod, startOfLocalDay } from "@/lib/period";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { ExerciseRating } from "@/lib/scoring";

export type RewardInput = {
  exerciseScore: number;
  previousBestScore: number | null;
  completedExercisesTodayBefore: number;
  exerciseCompleted: boolean;
};

export type RewardResult = {
  xpEarned: number;
  baseXp: number;
  dailyBonusXp: number;
  retakeXp: number;
  rankingDelta: number;
  dailyBonusRanking: number;
  retakeRanking: number;
  totalRankingDelta: number;
};

type PrismaTransactionClient = Prisma.TransactionClient;

export type GamificationDbClient = PrismaClient | PrismaTransactionClient;

export type BadgeAwardReason = "exercise_submit" | "daily_checkin" | "leaderboard_update" | "manual";

export type BadgeAward = {
  id: string;
  name: string;
  type: string;
};

export type BadgeProgress = {
  current: number;
  target: number;
  unit: string;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  condition: string;
  type: "COMMON" | "RARE" | "EPIC" | "PERIODIC";
  category: "progress" | "skill" | "streak" | "improvement" | "ranking";
  target?: number;
  unit?: string;
};

const DAILY_BONUS_TABLE = [
  { completedExercises: 8, xp: 30, ranking: 12 },
  { completedExercises: 5, xp: 20, ranking: 8 },
  { completedExercises: 3, xp: 10, ranking: 4 },
  { completedExercises: 2, xp: 5, ranking: 2 },
];

export const CHECKIN_REWARD = {
  xp: 10,
  rankingScore: 2,
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "badge-progress-first-exercise",
    name: "Bước đầu phát âm",
    description: "Hoàn thành bài luyện phát âm đầu tiên.",
    condition: "Hoàn thành 1 bài tập với điểm từ 70 trở lên.",
    type: "COMMON",
    category: "progress",
    target: 1,
    unit: "exercise",
  },
  {
    id: "badge-progress-three-exercises",
    name: "Nhịp học đầu tiên",
    description: "Hoàn thành 3 bài luyện tập.",
    condition: "Hoàn thành 3 bài tập với điểm từ 70 trở lên.",
    type: "COMMON",
    category: "progress",
    target: 3,
    unit: "exercise",
  },
  {
    id: "badge-progress-ten-exercises",
    name: "Người học kiên trì",
    description: "Hoàn thành 10 bài luyện tập.",
    condition: "Hoàn thành 10 bài tập với điểm từ 70 trở lên.",
    type: "RARE",
    category: "progress",
    target: 10,
    unit: "exercise",
  },
  {
    id: "badge-skill-good-listener",
    name: "Tai nghe tinh",
    description: "Đạt điểm cao ở các bài nghe chọn đáp án.",
    condition: "Đạt >= 80 điểm ở 5 bài nghe.",
    type: "RARE",
    category: "skill",
    target: 5,
    unit: "listen_exercise",
  },
  {
    id: "badge-skill-clear-speaker",
    name: "Phát âm rõ ràng",
    description: "Đạt điểm cao ở các bài nói.",
    condition: "Đạt >= 80 điểm ở 5 bài nói.",
    type: "RARE",
    category: "skill",
    target: 5,
    unit: "speaking_exercise",
  },
  {
    id: "badge-skill-excellent-pronunciation",
    name: "Phát âm xuất sắc",
    description: "Đạt thành tích xuất sắc trong một bài nói.",
    condition: "Đạt >= 90 điểm ở bất kỳ bài nói nào.",
    type: "EPIC",
    category: "skill",
    target: 1,
    unit: "excellent_speaking_exercise",
  },
  {
    id: "badge-streak-3",
    name: "Khởi động thói quen",
    description: "Duy trì chuỗi học 3 ngày liên tiếp.",
    condition: "Check-in 3 ngày liên tiếp.",
    type: "COMMON",
    category: "streak",
    target: 3,
    unit: "day",
  },
  {
    id: "badge-streak-7",
    name: "Một tuần bền bỉ",
    description: "Duy trì chuỗi học 7 ngày liên tiếp.",
    condition: "Check-in 7 ngày liên tiếp.",
    type: "RARE",
    category: "streak",
    target: 7,
    unit: "day",
  },
  {
    id: "badge-streak-14",
    name: "Nhịp học ổn định",
    description: "Duy trì chuỗi học 14 ngày liên tiếp.",
    condition: "Check-in 14 ngày liên tiếp.",
    type: "EPIC",
    category: "streak",
    target: 14,
    unit: "day",
  },
  {
    id: "badge-improvement-comeback",
    name: "Tiến bộ rõ rệt",
    description: "Cải thiện điểm bài làm một cách rõ ràng.",
    condition: "Làm lại một bài và tăng ít nhất 20 điểm so với kết quả tốt nhất trước đó.",
    type: "RARE",
    category: "improvement",
    target: 20,
    unit: "score_delta",
  },
  {
    id: "badge-ranking-weekly-top-10",
    name: "Top 10 tuần",
    description: "Có mặt trong top 10 bảng xếp hạng tuần.",
    condition: "Nằm trong top 10 weekly leaderboard của kỳ hiện tại.",
    type: "PERIODIC",
    category: "ranking",
    target: 10,
    unit: "rank",
  },
];

export function calculateLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1);
}

export function getNextLevelXp(level: number) {
  return Math.max(1, level) ** 2 * 100;
}

function getDailyBonus(completedExercisesAfter: number, exerciseScore: number) {
  if (exerciseScore < 50) {
    return { xp: 0, ranking: 0 };
  }

  const matched = DAILY_BONUS_TABLE.find((item) => completedExercisesAfter >= item.completedExercises);
  return matched ? { xp: matched.xp, ranking: matched.ranking } : { xp: 0, ranking: 0 };
}

export function calculateExerciseRewards(input: RewardInput): RewardResult {
  const previousBestScore = input.previousBestScore ?? null;
  const isFirstAttempt = previousBestScore === null;
  const improved = previousBestScore !== null && input.exerciseScore > previousBestScore;
  const completedExercisesAfter = input.completedExercisesTodayBefore + (input.exerciseCompleted ? 1 : 0);
  const dailyBonus = input.exerciseCompleted
    ? getDailyBonus(completedExercisesAfter, input.exerciseScore)
    : { xp: 0, ranking: 0 };

  const nominalXp = Math.round(input.exerciseScore);
  let baseXp = 0;
  let retakeXp = 0;
  let rankingDelta = 0;
  let retakeRanking = 0;

  if (isFirstAttempt) {
    baseXp = nominalXp;
    rankingDelta = input.exerciseScore;
  } else if (improved && previousBestScore !== null) {
    baseXp = Math.round(nominalXp * 0.7);
    rankingDelta = input.exerciseScore - previousBestScore;
  } else if (input.exerciseScore >= 50) {
    retakeXp = Math.max(1, Math.round(nominalXp * 0.1));
    retakeRanking = Math.min(5, Math.max(1, Math.round(input.exerciseScore * 0.05)));
  }

  const xpEarned = baseXp + retakeXp + dailyBonus.xp;
  const totalRankingDelta = rankingDelta + retakeRanking + dailyBonus.ranking;

  return {
    xpEarned,
    baseXp,
    dailyBonusXp: dailyBonus.xp,
    retakeXp,
    rankingDelta,
    dailyBonusRanking: dailyBonus.ranking,
    retakeRanking,
    totalRankingDelta,
  };
}

export function getLeaderboardTargets(date = new Date()): Array<{
  type: LeaderboardPeriodType;
  period: string;
}> {
  return [
    { type: "tuan", period: getLeaderboardPeriod("tuan", date) },
    { type: "thang", period: getLeaderboardPeriod("thang", date) },
  ];
}

export function getBadgeDefinition(id: string) {
  return BADGE_DEFINITIONS.find((definition) => definition.id === id) ?? null;
}

export async function ensureBadge(db: GamificationDbClient, definition: BadgeDefinition) {
  return db.badge.upsert({
    where: { id: definition.id },
    create: {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      condition: definition.condition,
      type: definition.type,
    },
    update: {
      name: definition.name,
      description: definition.description,
      condition: definition.condition,
      type: definition.type,
    },
  });
}

async function awardBadge(
  db: GamificationDbClient,
  userId: string,
  definition: BadgeDefinition,
  validPeriod?: string | null,
): Promise<BadgeAward | null> {
  const badge = await ensureBadge(db, definition);

  const existing = await db.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    return null;
  }

  await db.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
      validPeriod: validPeriod ?? null,
    },
  });

  return {
    id: badge.id,
    name: badge.name,
    type: badge.type,
  };
}

function isSpeakingQuestionType(typeId: string, typeName: string) {
  const normalized = `${typeId} ${typeName}`.toLowerCase();
  return (
    normalized.includes("voice") ||
    normalized.includes("speak") ||
    normalized.includes("noi") ||
    normalized.includes("thu") ||
    normalized.includes("doc") ||
    normalized.includes("minimal")
  );
}

function isListeningQuestionType(typeId: string, typeName: string) {
  const normalized = `${typeId} ${typeName}`.toLowerCase();
  return (
    normalized.includes("listen") ||
    normalized.includes("nghe") ||
    normalized.includes("mc") ||
    normalized.includes("multiple")
  );
}

export function getBadgeProgressFromStats(
  definition: BadgeDefinition,
  stats: {
    completedExercises: number;
    listeningHighScoreExercises: number;
    speakingHighScoreExercises: number;
    excellentSpeakingExercises: number;
    streakCount: number;
    bestImprovement: number;
    weeklyRank: number | null;
  },
): BadgeProgress | null {
  switch (definition.id) {
    case "badge-progress-first-exercise":
    case "badge-progress-three-exercises":
    case "badge-progress-ten-exercises":
      return { current: stats.completedExercises, target: definition.target ?? 1, unit: definition.unit ?? "exercise" };
    case "badge-skill-good-listener":
      return {
        current: stats.listeningHighScoreExercises,
        target: definition.target ?? 5,
        unit: definition.unit ?? "listen_exercise",
      };
    case "badge-skill-clear-speaker":
      return {
        current: stats.speakingHighScoreExercises,
        target: definition.target ?? 5,
        unit: definition.unit ?? "speaking_exercise",
      };
    case "badge-skill-excellent-pronunciation":
      return {
        current: stats.excellentSpeakingExercises,
        target: definition.target ?? 1,
        unit: definition.unit ?? "excellent_speaking_exercise",
      };
    case "badge-streak-3":
    case "badge-streak-7":
    case "badge-streak-14":
      return { current: stats.streakCount, target: definition.target ?? 1, unit: definition.unit ?? "day" };
    case "badge-improvement-comeback":
      return { current: stats.bestImprovement, target: definition.target ?? 20, unit: definition.unit ?? "score_delta" };
    case "badge-ranking-weekly-top-10":
      return {
        current: stats.weeklyRank ?? 0,
        target: definition.target ?? 10,
        unit: definition.unit ?? "rank",
      };
    default:
      return null;
  }
}

export async function getUserBadgeStats(db: GamificationDbClient, userId: string, date = new Date()) {
  const weeklyPeriod = getLeaderboardPeriod("tuan", date);

  const [user, attempts, weeklyLeaderboard] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
      },
    }),
    db.exerciseAttempt.findMany({
      where: {
        userId,
      },
      select: {
        score: true,
        exerciseId: true,
        exercise: {
          select: {
            questions: {
              select: {
                type: {
              select: {
                id: true,
                name: true,
              },
            },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    db.leaderboard.findMany({
      where: {
        type: "tuan",
        period: weeklyPeriod,
      },
      select: {
        userId: true,
        score: true,
      },
      orderBy: [{ score: "desc" }, { updatedAt: "asc" }],
      take: 50,
    }),
  ]);

  const bestByExercise = new Map<
    string,
    {
      score: number;
      hasListening: boolean;
      hasSpeaking: boolean;
    }
  >();

  let bestImprovement = 0;

  for (const attempt of attempts) {
    const questionTypes = attempt.exercise.questions.map((question) => question.type);
    const hasListening = questionTypes.some((type) => isListeningQuestionType(type.id, type.name));
    const hasSpeaking = questionTypes.some((type) => isSpeakingQuestionType(type.id, type.name));
    const previous = bestByExercise.get(attempt.exerciseId);

    if (previous) {
      bestImprovement = Math.max(bestImprovement, attempt.score - previous.score);
      if (attempt.score > previous.score) {
        bestByExercise.set(attempt.exerciseId, {
          score: attempt.score,
          hasListening: previous.hasListening || hasListening,
          hasSpeaking: previous.hasSpeaking || hasSpeaking,
        });
      }
    } else {
      bestByExercise.set(attempt.exerciseId, {
        score: attempt.score,
        hasListening,
        hasSpeaking,
      });
    }
  }

  const bestAttempts = Array.from(bestByExercise.values());
  const completedExercises = bestAttempts.filter((attempt) => attempt.score >= 70).length;
  const listeningHighScoreExercises = bestAttempts.filter(
    (attempt) => attempt.hasListening && attempt.score >= 80,
  ).length;
  const speakingHighScoreExercises = bestAttempts.filter(
    (attempt) => attempt.hasSpeaking && attempt.score >= 80,
  ).length;
  const excellentSpeakingExercises = bestAttempts.filter(
    (attempt) => attempt.hasSpeaking && attempt.score >= 90,
  ).length;
  const weeklyRankIndex = weeklyLeaderboard.findIndex((item) => item.userId === userId);

  return {
    completedExercises,
    listeningHighScoreExercises,
    speakingHighScoreExercises,
    excellentSpeakingExercises,
    streakCount: user?.streakCount ?? 0,
    bestImprovement: Math.max(0, bestImprovement),
    weeklyRank: weeklyRankIndex >= 0 ? weeklyRankIndex + 1 : null,
    weeklyPeriod,
  };
}

export async function checkAndAwardBadges(
  db: GamificationDbClient,
  userId: string,
  reason: BadgeAwardReason = "manual",
  date = new Date(),
): Promise<BadgeAward[]> {
  const stats = await getUserBadgeStats(db, userId, date);
  const awarded: BadgeAward[] = [];

  for (const definition of BADGE_DEFINITIONS) {
    if (reason === "daily_checkin" && definition.category !== "streak") {
      continue;
    }

    const progress = getBadgeProgressFromStats(definition, stats);
    if (!progress) {
      continue;
    }

    const isRankingBadge = definition.category === "ranking";
    const achieved = isRankingBadge
      ? stats.weeklyRank !== null && stats.weeklyRank <= (definition.target ?? 10)
      : progress.current >= progress.target;

    if (!achieved) {
      continue;
    }

    const badge = await awardBadge(
      db,
      userId,
      definition,
      definition.type === "PERIODIC" ? stats.weeklyPeriod : null,
    );

    if (badge) {
      awarded.push(badge);
    }
  }

  return awarded;
}

// === SP7: Gem + Shop + Streak Freeze ===

export function computeGemReward(rating: ExerciseRating): number {
  return rating === "EXCELLENT" ? 5 : 0;
}

export function validateShopPurchase(
  userGems: number,
  itemCost: number,
): { ok: true } | { ok: false; reason: "NOT_ENOUGH_GEMS" } {
  if (userGems < itemCost) return { ok: false, reason: "NOT_ENOUGH_GEMS" };
  return { ok: true };
}

export const SHOP_ITEMS = [
  { id: "ipa_reveal", name: "Kính Lúp IPA", cost: 50, desc: "Xem IPA câu khó trong Thực chiến" },
  { id: "slow_audio", name: "Loa Ma Thuật", cost: 20, desc: "Nghe giọng bản xứ chậm x0.5" },
  { id: "streak_freeze", name: "Bùa Đóng Băng", cost: 10, desc: "Giữ chuỗi ngày khi lỡ 1 ngày" },
] as const;

export function calculateNextStreak(
  lastCheckInDate: Date | null,
  currentStreak: number,
  today: Date,
  streakFreezes: number = 0,
): { alreadyCheckedIn: boolean; streak: number; usedFreeze: boolean } {
  if (!lastCheckInDate) {
    return { alreadyCheckedIn: false, streak: 1, usedFreeze: false };
  }
  const lastDay = startOfLocalDay(lastCheckInDate);
  const diffDays = Math.floor((today.getTime() - lastDay.getTime()) / 86400000);
  if (diffDays === 0) {
    return { alreadyCheckedIn: true, streak: currentStreak, usedFreeze: false };
  }
  if (diffDays === 1) {
    return { alreadyCheckedIn: false, streak: currentStreak + 1, usedFreeze: false };
  }
  if (streakFreezes > 0) {
    return { alreadyCheckedIn: false, streak: currentStreak, usedFreeze: true };
  }
  return { alreadyCheckedIn: false, streak: 1, usedFreeze: false };
}

// === SP7: Daily Quests ===

/** Quest type definitions - pool of daily quests available for rotation */
export const QUEST_TYPES = [
  { type: "PRACTICE_3", target: 3, desc: "Luyện 3 bài hôm nay", rewardXp: 50, rewardGems: 10 },
  { type: "CD2_3", target: 3, desc: "Hoàn thành 3 bài CĐ2 Phụ âm", rewardXp: 50, rewardGems: 10 },
  { type: "CD4_LINKING_3", target: 3, desc: "Hoàn thành 3 bài CĐ4 nối âm (g03)", rewardXp: 50, rewardGems: 10 },
] as const;

export type QuestType = (typeof QUEST_TYPES)[number]["type"];

/** Randomly pick 3 quests from the pool for a daily rotation */
export function pickDailyQuests(): {
  type: string;
  target: number;
  desc: string;
  rewardXp: number;
  rewardGems: number;
}[] {
  const shuffled = [...QUEST_TYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((q) => ({
    type: q.type,
    target: q.target,
    desc: q.desc,
    rewardXp: q.rewardXp,
    rewardGems: q.rewardGems,
  }));
}

/**
 * Check if an exercise submit should increment a quest's progress.
 * Returns true if the quest type conditions are met.
 */
export function shouldIncrementQuest(
  questType: string,
  payload: { exerciseCompleted: boolean; topicId: string; soundGroupId: string },
): boolean {
  if (questType === "PRACTICE_3") return payload.exerciseCompleted;
  if (questType === "CD2_3") return payload.exerciseCompleted && payload.topicId === "topic-2-consonants";
  if (questType === "CD4_LINKING_3") return payload.exerciseCompleted && payload.soundGroupId === "map-t4-g03-linking";
  return false;
}

// === SP4: Scoring multiplier + Retake limit ===

/** Maximum retakes allowed per exercise per day before XP is capped */
export const MAX_RETAKE_PER_DAY = 5;

/**
 * Compute XP multiplier based on exercise question types.
 * Speaking exercises earn full XP; listening exercises earn 80%.
 */
export function computeXpMultiplier(questionTypeIds: string[]): number {
  if (questionTypeIds.length === 0) return 1;
  const speakingCount = questionTypeIds.filter(
    (id) => id.includes("voice") || id.includes("minimal-pairs"),
  ).length;
  const ratio = speakingCount / questionTypeIds.length;
  // If majority speaking: 1.0, if majority listening: 0.8, else 0.9
  if (ratio >= 0.5) return 1.0;
  return 0.8;
}

/**
 * Check if user has exceeded the daily retake limit for a specific exercise.
 * Returns true if the user should receive reduced XP (retake limit hit).
 */
export function isRetakeLimitExceeded(attemptCountToday: number): boolean {
  return attemptCountToday >= MAX_RETAKE_PER_DAY;
}
