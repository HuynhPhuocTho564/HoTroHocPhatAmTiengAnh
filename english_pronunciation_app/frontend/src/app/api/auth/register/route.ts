import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type RegisterPayload = {
  username?: string;
  email?: string;
  password?: string;
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json().catch(() => ({}))) as RegisterPayload;
    const username = payload.username?.trim();
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password ?? "";

    if (!username || !email || !password) {
      return failure("VALIDATION_ERROR", "Thiếu thông tin bắt buộc", 400);
    }

    if (username.length < 3) {
      return failure("VALIDATION_ERROR", "Tên hiển thị phải có ít nhất 3 ký tự", 400);
    }

    if (!isValidEmail(email)) {
      return failure("VALIDATION_ERROR", "Email không hợp lệ", 400);
    }

    if (password.length < 6) {
      return failure("VALIDATION_ERROR", "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (existingUser?.email === email) {
      return failure("EMAIL_EXISTS", "Email đã được sử dụng", 409);
    }

    if (existingUser?.username === username) {
      return failure("USERNAME_EXISTS", "Tên hiển thị đã được sử dụng", 409);
    }

    const defaultRole = await prisma.role.upsert({
      where: { name: "User" },
      update: {},
      create: { name: "User" },
    });
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        roleId: defaultRole.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return success(
      {
        message: "Đăng ký thành công",
        user,
      },
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi đăng ký", 500);
  }
}
