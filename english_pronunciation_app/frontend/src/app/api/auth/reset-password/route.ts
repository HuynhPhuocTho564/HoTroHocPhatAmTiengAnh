import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/password-reset";

type ResetPasswordPayload = {
  token?: string;
  password?: string;
};

function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function failure(code: string, message: string, status = 400) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as ResetPasswordPayload;
    const token = payload.token?.trim();
    const password = payload.password ?? "";

    if (!token) {
      return failure("VALIDATION_ERROR", "Thiếu token đặt lại mật khẩu", 400);
    }

    if (password.length < 6) {
      return failure("VALIDATION_ERROR", "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const tokenHash = hashPasswordResetToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      return failure("TOKEN_INVALID", "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id },
        },
        data: { usedAt: new Date() },
      }),
    ]);

    return success({ message: "Mật khẩu đã được cập nhật. Bạn có thể đăng nhập lại." });
  } catch (error) {
    console.error("Reset password error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi đặt lại mật khẩu", 500);
  }
}
