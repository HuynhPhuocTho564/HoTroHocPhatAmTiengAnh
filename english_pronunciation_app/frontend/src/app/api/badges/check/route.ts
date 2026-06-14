import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAndAwardBadges, type BadgeAwardReason } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

type CheckBadgesPayload = {
  reason?: BadgeAwardReason;
};

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

function isValidReason(reason: unknown): reason is BadgeAwardReason {
  return (
    reason === "exercise_submit" ||
    reason === "daily_checkin" ||
    reason === "leaderboard_update" ||
    reason === "manual" ||
    reason === undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as CheckBadgesPayload;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return failure("UNAUTHENTICATED", "Cần đăng nhập để kiểm tra huy hiệu", 401);
    }

    if (!isValidReason(payload.reason)) {
      return failure("VALIDATION_ERROR", "reason không hợp lệ", 400);
    }

    const badgesAwarded = await prisma.$transaction((tx) =>
      checkAndAwardBadges(tx, userId, payload.reason ?? "manual", new Date()),
    );

    return success({
      badgesAwarded,
    });
  } catch (error) {
    console.error("Check badges error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi kiểm tra huy hiệu", 500);
  }
}
