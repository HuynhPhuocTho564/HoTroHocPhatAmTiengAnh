import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API: POST /api/checkin
 * Logic: Xử lý điểm danh tự động khi user hoàn thành bài tập
 * 
 * Flow:
 * 1. Kiểm tra lastCheckInDate
 * 2. Nếu là ngày hôm qua -> Tăng streak +1
 * 3. Nếu là hôm nay -> Không làm gì (đã điểm danh)
 * 4. Nếu cách >48h -> Reset streak về 1
 * 5. Cập nhật lastCheckInDate
 * 6. Kiểm tra milestone và cấp huy hiệu
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Lấy thông tin user hiện tại
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        lastCheckInDate: true,
        streakCount: true,
        longestStreak: true,
        totalCheckIns: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let newStreak = user.streakCount;
    let shouldUpdate = false;
    let reward = null;
    let milestone = null;

    // Case 1: Chưa từng check-in
    if (!user.lastCheckInDate) {
      newStreak = 1;
      shouldUpdate = true;
      reward = { type: "coins", amount: 10 };
    } else {
      const lastCheckIn = new Date(user.lastCheckInDate);
      const lastCheckInDay = new Date(
        lastCheckIn.getFullYear(),
        lastCheckIn.getMonth(),
        lastCheckIn.getDate()
      );

      const diffTime = today.getTime() - lastCheckInDay.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Case 2: Đã check-in hôm nay rồi
      if (diffDays === 0) {
        return NextResponse.json({
          success: false,
          message: "Already checked in today",
          currentStreak: user.streakCount,
          canCheckIn: false,
        });
      }

      // Case 3: Check-in ngày hôm qua -> Tăng streak
      if (diffDays === 1) {
        newStreak = user.streakCount + 1;
        shouldUpdate = true;
        
        // Tính phần thưởng theo chu kỳ 7 ngày
        const dayInCycle = (newStreak % 7) || 7;
        const rewardAmounts = [10, 15, 20, 25, 30, 40, 50];
        reward = { type: "coins", amount: rewardAmounts[dayInCycle - 1] };

        // Ngày 7 thêm huy hiệu
        if (dayInCycle === 7) {
          reward = { type: "badge", name: "Tuần Hoàn Hảo", coins: 50 };
        }
      }

      // Case 4: Bỏ lỡ >1 ngày -> Reset streak
      if (diffDays > 1) {
        newStreak = 1;
        shouldUpdate = true;
        reward = { type: "coins", amount: 10 };
      }
    }

    // Cập nhật database nếu cần
    if (shouldUpdate) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          lastCheckInDate: now,
          streakCount: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
          totalCheckIns: user.totalCheckIns + 1,
        },
      });

      await prisma.dailyActivity.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        create: {
          userId,
          date: today,
          checkIns: 1,
        },
        update: {
          checkIns: { increment: 1 },
        },
      });

      // Kiểm tra milestone và cấp huy hiệu
      milestone = await checkAndAwardMilestone(userId, newStreak);

      return NextResponse.json({
        success: true,
        message: "Check-in successful",
        currentStreak: newStreak,
        longestStreak: updatedUser.longestStreak,
        totalCheckIns: updatedUser.totalCheckIns,
        reward,
        milestone,
        canCheckIn: false,
      });
    }

    return NextResponse.json({
      success: false,
      message: "No update needed",
      currentStreak: user.streakCount,
    });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API: GET /api/checkin?userId=xxx
 * Lấy thông tin streak hiện tại của user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
        longestStreak: true,
        totalCheckIns: true,
        lastCheckInDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Kiểm tra có thể check-in hôm nay không
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let canCheckIn = true;

    if (user.lastCheckInDate) {
      const lastCheckIn = new Date(user.lastCheckInDate);
      const lastCheckInDay = new Date(
        lastCheckIn.getFullYear(),
        lastCheckIn.getMonth(),
        lastCheckIn.getDate()
      );

      const diffTime = today.getTime() - lastCheckInDay.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      canCheckIn = diffDays > 0;
    }

    return NextResponse.json({
      currentStreak: user.streakCount,
      longestStreak: user.longestStreak,
      totalCheckIns: user.totalCheckIns,
      lastCheckInDate: user.lastCheckInDate,
      canCheckIn,
    });

  } catch (error) {
    console.error("Get check-in status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Kiểm tra và cấp huy hiệu khi đạt milestone
 */
async function checkAndAwardMilestone(userId: string, streak: number) {
  const milestones = [
    { days: 3, badgeName: "Khởi Đầu Tốt", description: "Điểm danh 3 ngày liên tiếp" },
    { days: 7, badgeName: "Tuần Hoàn Hảo", description: "Điểm danh 7 ngày liên tiếp" },
    { days: 14, badgeName: "Hai Tuần Kiên Trì", description: "Điểm danh 14 ngày liên tiếp" },
    { days: 30, badgeName: "Tháng Vàng", description: "Điểm danh 30 ngày liên tiếp" },
    { days: 60, badgeName: "Hai Tháng Bền Bỉ", description: "Điểm danh 60 ngày liên tiếp" },
    { days: 100, badgeName: "Trăm Ngày Huyền Thoại", description: "Điểm danh 100 ngày liên tiếp" },
  ];

  const milestone = milestones.find((m) => m.days === streak);

  if (milestone) {
    // Kiểm tra xem đã có huy hiệu này chưa
    const existingBadge = await prisma.badge.findFirst({
      where: { name: milestone.badgeName },
    });

    let badgeId = existingBadge?.id;

    // Nếu chưa có, tạo mới
    if (!existingBadge) {
      const newBadge = await prisma.badge.create({
        data: {
          name: milestone.badgeName,
          description: milestone.description,
          type: "PERMANENT",
          condition: `Điểm danh ${milestone.days} ngày liên tiếp`,
        },
      });
      badgeId = newBadge.id;
    }

    // Cấp huy hiệu cho user (nếu chưa có)
    if (badgeId) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId,
            badgeId,
          },
        },
        create: {
          userId,
          badgeId,
        },
        update: {}, // Không update gì nếu đã có
      });

      return {
        achieved: true,
        badgeName: milestone.badgeName,
        description: milestone.description,
        days: milestone.days,
      };
    }
  }

  return null;
}
