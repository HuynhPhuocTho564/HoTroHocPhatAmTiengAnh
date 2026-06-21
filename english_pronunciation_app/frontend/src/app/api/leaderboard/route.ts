import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeaderboardPeriod, type LeaderboardPeriodType } from "@/lib/period";
import { prisma } from "@/lib/prisma";

function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function failure(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status },
  );
}

function parseType(value: string | null): LeaderboardPeriodType | null {
  if (value === "tuan" || value === "thang" || value === "all") {
    return value;
  }

  return null;
}

function parseLimit(value: string | null) {
  if (!value) {
    return 10;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 10;
  }

  return Math.min(parsed, 50);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = parseType(searchParams.get("type") ?? "tuan");
    const period = searchParams.get("period");
    const limit = parseLimit(searchParams.get("limit"));

    if (!type) {
      return failure("INVALID_LEADERBOARD_TYPE", "type phải là tuần, tháng hoặc all", 400);
    }

    const session = await auth();

    // All-time leaderboard: rank users by total XP
    if (type === "all") {
      const [rows, totalPlayers] = await Promise.all([
        prisma.user.findMany({
          where: { status: "ACTIVE" },
          orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
          take: limit,
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            level: true,
            xp: true,
            streakCount: true,
          },
        }),
        // Task 3.2.3: total players để client tính rank tier (percentile)
        prisma.user.count({ where: { status: "ACTIVE" } }),
      ]);

      const items = rows.map((row, index) => ({
        rank: index + 1,
        userId: row.id,
        username: row.username,
        avatarUrl: row.avatarUrl,
        level: row.level,
        streak: row.streakCount,
        score: row.xp,
        correctAnswers: 0,
        completedExercises: 0,
        badges: [],
      }));

      const currentUserId = session?.user?.id;
      let currentUser = null;
      if (currentUserId) {
        const currentUserRow = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { xp: true },
        });
        if (currentUserRow) {
          const betterCount = await prisma.user.count({
            where: { xp: { gt: currentUserRow.xp }, status: "ACTIVE" },
          });
          currentUser = { rank: betterCount + 1, score: currentUserRow.xp };
        }
      }

      return success({ type: "all" as const, period: "all", items, currentUser, totalPlayers });
    }

    // Period-based leaderboard (tuan/thang)
    const targetPeriod = period || getLeaderboardPeriod(type, new Date());

    const [periodSession, rows, totalPlayers] = await Promise.all([
      auth(),
      prisma.leaderboard.findMany({
        where: {
          type,
          period: targetPeriod,
        },
        orderBy: [{ score: "desc" }, { updatedAt: "asc" }],
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              level: true,
              streakCount: true,
              userBadges: {
                orderBy: {
                  earnedAt: "desc",
                },
                take: 2,
                include: {
                  badge: {
                    select: {
                      name: true,
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      // Task 3.2.3: total players trong kỳ để client tính rank tier
      prisma.leaderboard.count({ where: { type, period: targetPeriod } }),
    ]);

    const items = rows.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      username: row.user.username,
      avatarUrl: row.user.avatarUrl,
      level: row.user.level,
      streak: row.user.streakCount,
      score: row.score,
      correctAnswers: row.correctAnswers,
      completedExercises: row.completedExercises,
      badges: row.user.userBadges.map((userBadge) => ({
        name: userBadge.badge.name,
        type: userBadge.badge.type,
      })),
    }));

    const currentUserId = periodSession?.user?.id;
    let currentUser = null;

    if (currentUserId) {
      const currentUserRow = await prisma.leaderboard.findUnique({
        where: {
          userId_type_period: {
            userId: currentUserId,
            type,
            period: targetPeriod,
          },
        },
        select: {
          score: true,
        },
      });

      if (currentUserRow) {
        const betterCount = await prisma.leaderboard.count({
          where: {
            type,
            period: targetPeriod,
            score: {
              gt: currentUserRow.score,
            },
          },
        });

        currentUser = {
          rank: betterCount + 1,
          score: currentUserRow.score,
        };
      }
    }

    return success({
      type,
      period: targetPeriod,
      items,
      currentUser,
      totalPlayers,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi lấy bảng xếp hạng", 500);
  }
}
