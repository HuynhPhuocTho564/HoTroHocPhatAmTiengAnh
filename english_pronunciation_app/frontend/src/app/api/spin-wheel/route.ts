import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canSpin, spinWheel, SPIN_ELIGIBLE_STREAK } from "@/lib/gamification/spin-wheel";

/**
 * POST /api/spin-wheel
 *
 * Spin the prize wheel. Returns the prize won.
 * Requires streak >= 3 and no spin today.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const userId = session.user.id;

  // Check eligibility
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streakCount: true },
  });
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "USER_NOT_FOUND" } }, { status: 404 });
  }

  // Get last spin date
  const lastSpin = await prisma.spinWheelLog.findFirst({
    where: { userId },
    orderBy: { spunAt: "desc" },
    select: { spunAt: true },
  });

  if (!canSpin(user.streakCount, lastSpin?.spunAt ?? null, new Date())) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: user.streakCount < SPIN_ELIGIBLE_STREAK ? "STREAK_TOO_LOW" : "ALREADY_SPUN_TODAY",
          message: user.streakCount < SPIN_ELIGIBLE_STREAK
            ? `Cần chuỗi ${SPIN_ELIGIBLE_STREAK} ngày liên tiếp để quay`
            : "Bạn đã quay hôm nay rồi",
        },
      },
      { status: 403 },
    );
  }

  // Spin!
  const { prize, rotationDegrees } = spinWheel();

  // Log the spin + award prize in transaction
  await prisma.$transaction(async (tx) => {
    await tx.spinWheelLog.create({
      data: {
        userId,
        prize: prize.id,
        prizeValue: prize.value.gems ?? prize.value.xp ?? 0,
      },
    });

    // Build update data based on prize type
    const updateData: { gems?: number; xp?: number; streakFreezes?: number } = {};
    if (prize.value.gems) updateData.gems = prize.value.gems;
    if (prize.value.xp) updateData.xp = prize.value.xp;
    if (prize.value.streakFreezes) updateData.streakFreezes = prize.value.streakFreezes;

    if (Object.keys(updateData).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(updateData.gems ? { gems: { increment: updateData.gems } } : {}),
          ...(updateData.xp ? { xp: { increment: updateData.xp } } : {}),
          ...(updateData.streakFreezes ? { streakFreezes: { increment: updateData.streakFreezes } } : {}),
        },
      });
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      prize: {
        id: prize.id,
        label: prize.label,
        value: prize.value,
      },
      rotationDegrees,
    },
  });
}
