import assert from "node:assert/strict";
import test from "node:test";
import {
  BADGE_DEFINITIONS,
  CHECKIN_REWARD,
  calculateExerciseRewards,
  calculateLevelFromXp,
  getBadgeDefinition,
  getBadgeProgressFromStats,
  getLeaderboardTargets,
  getNextLevelXp,
  computeGemReward,
  validateShopPurchase,
  calculateNextStreak,
  computeXpMultiplier,
  isRetakeLimitExceeded,
  MAX_RETAKE_PER_DAY,
} from "../gamification";

test("first exercise attempt earns score-based XP and ranking score", () => {
  const rewards = calculateExerciseRewards({
    exerciseScore: 85,
    previousBestScore: null,
    completedExercisesTodayBefore: 0,
    exerciseCompleted: true,
  });

  assert.equal(rewards.baseXp, 85);
  assert.equal(rewards.retakeXp, 0);
  assert.equal(rewards.dailyBonusXp, 0);
  assert.equal(rewards.xpEarned, 85);
  assert.equal(rewards.rankingDelta, 85);
  assert.equal(rewards.totalRankingDelta, 85);
});

test("improved retake earns partial XP and only the improved ranking delta", () => {
  const rewards = calculateExerciseRewards({
    exerciseScore: 90,
    previousBestScore: 70,
    completedExercisesTodayBefore: 0,
    exerciseCompleted: true,
  });

  assert.equal(rewards.baseXp, 63);
  assert.equal(rewards.retakeXp, 0);
  assert.equal(rewards.rankingDelta, 20);
  assert.equal(rewards.totalRankingDelta, 20);
});

test("lower retake still earns a small practice reward", () => {
  const rewards = calculateExerciseRewards({
    exerciseScore: 80,
    previousBestScore: 85,
    completedExercisesTodayBefore: 0,
    exerciseCompleted: true,
  });

  assert.equal(rewards.baseXp, 0);
  assert.equal(rewards.retakeXp, 8);
  assert.equal(rewards.rankingDelta, 0);
  assert.equal(rewards.retakeRanking, 4);
  assert.equal(rewards.totalRankingDelta, 4);
});

test("daily completion bonus applies at configured milestones", () => {
  const secondCompleted = calculateExerciseRewards({
    exerciseScore: 75,
    previousBestScore: null,
    completedExercisesTodayBefore: 1,
    exerciseCompleted: true,
  });
  const thirdCompleted = calculateExerciseRewards({
    exerciseScore: 75,
    previousBestScore: null,
    completedExercisesTodayBefore: 2,
    exerciseCompleted: true,
  });
  const fifthCompleted = calculateExerciseRewards({
    exerciseScore: 75,
    previousBestScore: null,
    completedExercisesTodayBefore: 4,
    exerciseCompleted: true,
  });
  const eighthCompleted = calculateExerciseRewards({
    exerciseScore: 75,
    previousBestScore: null,
    completedExercisesTodayBefore: 7,
    exerciseCompleted: true,
  });

  assert.equal(secondCompleted.dailyBonusXp, 5);
  assert.equal(secondCompleted.dailyBonusRanking, 2);
  assert.equal(thirdCompleted.dailyBonusXp, 10);
  assert.equal(thirdCompleted.dailyBonusRanking, 4);
  assert.equal(fifthCompleted.dailyBonusXp, 20);
  assert.equal(fifthCompleted.dailyBonusRanking, 8);
  assert.equal(eighthCompleted.dailyBonusXp, 30);
  assert.equal(eighthCompleted.dailyBonusRanking, 12);
});

test("low-score unfinished attempts do not receive practice or daily rewards", () => {
  const rewards = calculateExerciseRewards({
    exerciseScore: 45,
    previousBestScore: 80,
    completedExercisesTodayBefore: 7,
    exerciseCompleted: false,
  });

  assert.equal(rewards.xpEarned, 0);
  assert.equal(rewards.totalRankingDelta, 0);
});

test("level thresholds are derived from cumulative XP", () => {
  assert.equal(calculateLevelFromXp(-10), 1);
  assert.equal(calculateLevelFromXp(0), 1);
  assert.equal(calculateLevelFromXp(99), 1);
  assert.equal(calculateLevelFromXp(100), 2);
  assert.equal(calculateLevelFromXp(399), 2);
  assert.equal(calculateLevelFromXp(400), 3);
  assert.equal(getNextLevelXp(2), 400);
});

test("check-in reward and leaderboard targets remain explicit", () => {
  const targets = getLeaderboardTargets(new Date("2026-06-14T12:00:00+07:00"));

  assert.deepEqual(CHECKIN_REWARD, {
    xp: 10,
    rankingScore: 2,
  });
  assert.deepEqual(
    targets.map((target) => target.type),
    ["tuan", "thang"],
  );
  assert.equal(targets[0].period, "2026-W24");
  assert.equal(targets[1].period, "2026-06");
});

test("badge definitions expose progress metadata for the badge page", () => {
  const firstExercise = getBadgeDefinition("badge-progress-first-exercise");
  const streakSeven = BADGE_DEFINITIONS.find((definition) => definition.id === "badge-streak-7");

  assert.ok(firstExercise);
  assert.ok(streakSeven);
  assert.deepEqual(
    getBadgeProgressFromStats(firstExercise, {
      completedExercises: 1,
      listeningHighScoreExercises: 0,
      speakingHighScoreExercises: 0,
      excellentSpeakingExercises: 0,
      streakCount: 0,
      bestImprovement: 0,
      weeklyRank: null,
    }),
    {
      current: 1,
      target: 1,
      unit: "exercise",
    },
  );
});

// ===== SP7: Gem + Streak Freeze =====

test("gem reward: rating EXCELLENT → +5 gems, others → 0", () => {
  assert.equal(computeGemReward("EXCELLENT"), 5);
  assert.equal(computeGemReward("GOOD"), 0);
  assert.equal(computeGemReward("PASS"), 0);
  assert.equal(computeGemReward("NEEDS_PRACTICE"), 0);
});

test("streakFreeze: missed 1 day + has freeze → keep streak, use 1 freeze", () => {
  const today = new Date("2026-06-19");
  const lastCheckIn = new Date("2026-06-17"); // 2 days ago (diffDays = 2 > 1)
  const result = calculateNextStreak(lastCheckIn, 10, today, 2);
  assert.equal(result.streak, 10);
  assert.equal(result.usedFreeze, true);
});

test("streakFreeze: missed 1 day + 0 freezes → reset streak to 1", () => {
  const today = new Date("2026-06-19");
  const lastCheckIn = new Date("2026-06-17");
  const result = calculateNextStreak(lastCheckIn, 10, today, 0);
  assert.equal(result.streak, 1);
  assert.equal(result.usedFreeze, false);
});

test("shop validate: enough gems → OK; insufficient → NOT_ENOUGH_GEMS", () => {
  assert.deepEqual(validateShopPurchase(50, 50), { ok: true });
  assert.deepEqual(validateShopPurchase(49, 50), { ok: false, reason: "NOT_ENOUGH_GEMS" });
});

// ===== SP4: Scoring multiplier + Retake limit =====

test("computeXpMultiplier: majority speaking → 1.0", () => {
  assert.equal(computeXpMultiplier(["qtype-2-voice", "qtype-2-voice", "qtype-1-mc"]), 1.0);
});

test("computeXpMultiplier: majority listening → 0.8", () => {
  assert.equal(computeXpMultiplier(["qtype-1-mc", "qtype-1-mc", "qtype-2-voice"]), 0.8);
});

test("computeXpMultiplier: empty array → 1.0", () => {
  assert.equal(computeXpMultiplier([]), 1);
});

test("computeXpMultiplier: all speaking → 1.0", () => {
  assert.equal(computeXpMultiplier(["qtype-2-voice", "qtype-3-minimal-pairs"]), 1.0);
});

test("isRetakeLimitExceeded: under limit → false", () => {
  assert.equal(isRetakeLimitExceeded(4), false);
});

test("isRetakeLimitExceeded: at limit → true", () => {
  assert.equal(isRetakeLimitExceeded(MAX_RETAKE_PER_DAY), true);
});

test("isRetakeLimitExceeded: over limit → true", () => {
  assert.equal(isRetakeLimitExceeded(MAX_RETAKE_PER_DAY + 1), true);
});

test("MAX_RETAKE_PER_DAY is 5", () => {
  assert.equal(MAX_RETAKE_PER_DAY, 5);
});
