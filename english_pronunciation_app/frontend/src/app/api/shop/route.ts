import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SHOP_ITEMS, validateShopPurchase } from "@/lib/gamification";

/**
 * POST /api/shop
 * Purchase a shop item using gems.
 * Body: { itemId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Cần đăng nhập để mua hàng" } },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { itemId?: string };
    if (!body.itemId || typeof body.itemId !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "itemId không hợp lệ" } },
        { status: 400 },
      );
    }

    const item = SHOP_ITEMS.find((i) => i.id === body.itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: "ITEM_NOT_FOUND", message: "Vật phẩm không tồn tại" } },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gems: true, streakFreezes: true, unlockedIpaReveal: true, unlockedSlowAudio: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "USER_NOT_FOUND", message: "Không tìm thấy user" } },
        { status: 401 },
      );
    }

    const check = validateShopPurchase(user.gems, item.cost);
    if (!check.ok) {
      return NextResponse.json(
        { success: false, error: { code: check.reason, message: "Không đủ đá quý" } },
        { status: 400 },
      );
    }

    // Build update payload based on item type
    const updateData: Record<string, unknown> = {
      gems: { increment: -item.cost },
    };

    switch (item.id) {
      case "streak_freeze":
        updateData.streakFreezes = { increment: 1 };
        break;
      case "ipa_reveal":
        updateData.unlockedIpaReveal = true;
        break;
      case "slow_audio":
        updateData.unlockedSlowAudio = true;
        break;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { gems: true, streakFreezes: true, unlockedIpaReveal: true, unlockedSlowAudio: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        item: { id: item.id, name: item.name },
        cost: item.cost,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Shop purchase error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Lỗi server khi mua hàng" } },
      { status: 500 },
    );
  }
}
