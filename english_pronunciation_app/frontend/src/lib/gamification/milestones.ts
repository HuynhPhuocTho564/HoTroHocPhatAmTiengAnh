/**
 * Milestone Reward Logic
 *
 * Pure functions + DB operations for milestone rewards.
 * Called by API routes and potentially by the submit flow.
 *
 * @module gamification/milestones
 */

import { prisma } from "@/lib/prisma";

export type MilestoneInfo = {
  id: string;
  level: number;
  gemsReward: number;
  badgeName: string | null;
  unlockType: string | null;
  title: string;
  description: string;
};

export type MilestoneStatus = {
  milestone: MilestoneInfo;
  reached: boolean;
  claimed: boolean;
};

/**
 * Get all milestone rewards from DB, sorted by level ascending.
 */
export async function getAllMilestones(): Promise<MilestoneInfo[]> {
  const rows = await prisma.milestoneReward.findMany({
    orderBy: { level: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    level: r.level,
    gemsReward: r.gemsReward,
    badgeName: r.badgeName,
    unlockType: r.unlockType,
    title: r.title,
    description: r.description,
  }));
}

/**
 * Get milestones that the user has reached but not yet claimed.
 */
export async function getUnclaimedMilestones(
  userId: string,
  currentLevel: number,
): Promise<MilestoneInfo[]> {
  const allMilestones = await prisma.milestoneReward.findMany({
    where: { level: { lte: currentLevel } },
    orderBy: { level: "asc" },
  });

  const claimedIds = await prisma.userMilestone.findMany({
    where: { userId, milestoneId: { in: allMilestones.map((m) => m.id) } },
    select: { milestoneId: true },
  });
  const claimedSet = new Set(claimedIds.map((c) => c.milestoneId));

  return allMilestones
    .filter((m) => !claimedSet.has(m.id))
    .map((r) => ({
      id: r.id,
      level: r.level,
      gemsReward: r.gemsReward,
      badgeName: r.badgeName,
      unlockType: r.unlockType,
      title: r.title,
      description: r.description,
    }));
}

/**
 * Get the next milestone the user hasn't reached yet (for progress display).
 */
export async function getNextMilestone(
  currentLevel: number,
): Promise<MilestoneInfo | null> {
  const row = await prisma.milestoneReward.findFirst({
    where: { level: { gt: currentLevel } },
    orderBy: { level: "asc" },
  });
  if (!row) return null;
  return {
    id: row.id,
    level: row.level,
    gemsReward: row.gemsReward,
    badgeName: row.badgeName,
    unlockType: row.unlockType,
    title: row.title,
    description: row.description,
  };
}

/**
 * Claim a milestone reward for a user.
 * Awards gems + optional badge. Returns the reward details.
 */
export async function claimMilestone(
  userId: string,
  milestoneId: string,
): Promise<{ gems: number; badgeName: string | null } | { error: string }> {
  // Verify milestone exists and user qualifies
  const milestone = await prisma.milestoneReward.findUnique({
    where: { id: milestoneId },
  });
  if (!milestone) return { error: "MILESTONE_NOT_FOUND" };

  // Check user level
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true, gems: true },
  });
  if (!user) return { error: "USER_NOT_FOUND" };
  if (user.level < milestone.level) return { error: "LEVEL_NOT_REACHED" };

  // Check not already claimed
  const existing = await prisma.userMilestone.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
  });
  if (existing) return { error: "ALREADY_CLAIMED" };

  // Claim: create UserMilestone + award gems in transaction
  await prisma.$transaction(async (tx) => {
    await tx.userMilestone.create({
      data: { userId, milestoneId },
    });
    await tx.user.update({
      where: { id: userId },
      data: { gems: { increment: milestone.gemsReward } },
    });

    // Award badge if badgeName is set
    if (milestone.badgeName) {
      const badge = await tx.badge.findFirst({
        where: { name: milestone.badgeName },
        select: { id: true },
      });
      if (badge) {
        await tx.userBadge.upsert({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
          update: {},
          create: { userId, badgeId: badge.id },
        });
      }
    }
  });

  return { gems: milestone.gemsReward, badgeName: milestone.badgeName };
}
