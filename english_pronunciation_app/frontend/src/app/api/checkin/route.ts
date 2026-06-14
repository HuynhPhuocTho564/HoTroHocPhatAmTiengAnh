import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  CHECKIN_REWARD,
  calculateLevelFromXp,
  checkAndAwardBadges,
  getLeaderboardTargets,
} from "@/lib/gamification";
import { formatLocalDate, startOfLocalDay } from "@/lib/period";
import { prisma } from "@/lib/prisma";

function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function failure(code: string, message: string, status = 400, data?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
      ...(data ? { data } : {}),
    },
    { status },
  );
}

async function getSessionUserId() {
  const session = await auth();
  return session?.user?.id;
}

function calculateNextStreak(lastCheckInDate: Date | null, currentStreak: number, today: Date) {
  if (!lastCheckInDate) {
    return { alreadyCheckedIn: false, streak: 1 };
  }

  const lastCheckInDay = startOfLocalDay(lastCheckInDate);
  const diffDays = Math.floor((today.getTime() - lastCheckInDay.getTime()) / 86400000);

  if (diffDays === 0) {
    return { alreadyCheckedIn: true, streak: currentStreak };
  }

  if (diffDays === 1) {
    return { alreadyCheckedIn: false, streak: currentStreak + 1 };
  }

  return { alreadyCheckedIn: false, streak: 1 };
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return failure("UNAUTHENTICATED", "Cần đăng nhập để xem điểm danh", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
        longestStreak: true,
        totalCheckIns: true,
        lastCheckInDate: true,
        xp: true,
        level: true,
      },
    });

    if (!user) {
      return failure("USER_NOT_FOUND", "Không tìm thấy user", 404);
    }

    const today = startOfLocalDay(new Date());
    const streakStatus = calculateNextStreak(user.lastCheckInDate, user.streakCount, today);

    return success({
      currentStreak: user.streakCount,
      longestStreak: user.longestStreak,
      totalCheckIns: user.totalCheckIns,
      lastCheckInDate: user.lastCheckInDate,
      canCheckIn: !streakStatus.alreadyCheckedIn,
      todayReward: CHECKIN_REWARD,
      progress: {
        currentXp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Get check-in status error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi lấy trạng thái điểm danh", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await request.json().catch(() => ({}));
    const userId = await getSessionUserId();

    if (!userId) {
      return failure("UNAUTHENTICATED", "Cần đăng nhập để điểm danh", 401);
    }

    const now = new Date();
    const today = startOfLocalDay(now);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        xp: true,
        level: true,
        streakCount: true,
        longestStreak: true,
        totalCheckIns: true,
        lastCheckInDate: true,
      },
    });

    if (!user) {
      return failure("USER_NOT_FOUND", "Không tìm thấy user", 404);
    }

    const streakStatus = calculateNextStreak(user.lastCheckInDate, user.streakCount, today);

    if (streakStatus.alreadyCheckedIn) {
      return failure("ALREADY_CHECKED_IN", "Hôm nay đã điểm danh", 409, {
        currentStreak: user.streakCount,
        canCheckIn: false,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const nextXp = user.xp + CHECKIN_REWARD.xp;
      const nextLevel = Math.max(user.level, calculateLevelFromXp(nextXp));

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          xp: { increment: CHECKIN_REWARD.xp },
          level: nextLevel,
          lastCheckInDate: now,
          streakCount: streakStatus.streak,
          longestStreak: Math.max(streakStatus.streak, user.longestStreak),
          totalCheckIns: { increment: 1 },
        },
        select: {
          xp: true,
          level: true,
          streakCount: true,
          longestStreak: true,
          totalCheckIns: true,
          lastCheckInDate: true,
        },
      });

      const dailyActivity = await tx.dailyActivity.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        create: {
          userId,
          date: today,
          xpEarned: CHECKIN_REWARD.xp,
          checkIns: 1,
        },
        update: {
          xpEarned: { increment: CHECKIN_REWARD.xp },
          checkIns: { increment: 1 },
        },
      });

      for (const target of getLeaderboardTargets(now)) {
        await tx.leaderboard.upsert({
          where: {
            userId_type_period: {
              userId,
              type: target.type,
              period: target.period,
            },
          },
          create: {
            userId,
            type: target.type,
            period: target.period,
            score: CHECKIN_REWARD.rankingScore,
          },
          update: {
            score: { increment: CHECKIN_REWARD.rankingScore },
          },
        });
      }

      const badgesAwarded = await checkAndAwardBadges(tx, userId, "daily_checkin", now);

      return {
        updatedUser,
        dailyActivity,
        badgesAwarded,
      };
    });

    return success({
      message: "Check-in successful",
      currentStreak: result.updatedUser.streakCount,
      longestStreak: result.updatedUser.longestStreak,
      totalCheckIns: result.updatedUser.totalCheckIns,
      lastCheckInDate: result.updatedUser.lastCheckInDate,
      reward: CHECKIN_REWARD,
      progress: {
        currentXp: result.updatedUser.xp,
        level: result.updatedUser.level,
      },
      dailyActivity: {
        date: formatLocalDate(today),
        xpEarned: result.dailyActivity.xpEarned,
        checkIns: result.dailyActivity.checkIns,
      },
      badgesAwarded: result.badgesAwarded,
      canCheckIn: false,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi điểm danh", 500);
  }
}
