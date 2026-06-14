import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email đã được sử dụng' }, { status: 400 });
    }

    // Lấy Role 'User' mặc định
    let defaultRole = await prisma.role.findUnique({
      where: { name: 'User' }
    });

    // Tạo role User nếu chưa có (thường sẽ được tạo bằng seed, đây là fallback)
    if (!defaultRole) {
      defaultRole = await prisma.role.create({
        data: { name: 'User' }
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        roleId: defaultRole.id,
      },
    });

    return NextResponse.json(
      { message: 'Đăng ký thành công', user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    return NextResponse.json({ message: 'Lỗi server khi đăng ký' }, { status: 500 });
  }
}
