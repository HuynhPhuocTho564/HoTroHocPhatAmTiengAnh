/**
 * SEED DEMO USER - Tạo Role + User demo để auth flow hoạt động sau db_cleanup.
 *
 * Vấn đề: db_cleanup.ts TRUNCATE cả bảng User + Role. seed_lessons.ts chỉ lo lessons
 * (không tạo user). Vậy sau db_cleanup + seed_lessons, bảng User rỗng → session user
 * cũ không tồn tại → submit route "Không tìm thấy user" (USER_NOT_FOUND 404).
 *
 * Script này tạo:
 * - Role "User" (default cho learner) + Role "Admin" (cho admin dashboard)
 * - 1 User demo (credentials: email + password biết trước) để login demo.
 *
 * Idempotent: upsert theo email. Chạy sau db_cleanup + seed_lessons.
 *
 * Chạy: npx tsx prisma/seed_demo_user.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Demo credentials — đổi nếu cần. Ghi trong báo cáo demo.
const DEMO_EMAIL = "demo@pronunciation.app";
const DEMO_USERNAME = "demo_user";
const DEMO_PASSWORD = "demo123456";

async function main() {
  console.log("👤 Seeding demo user + roles...\n");

  // Role "User" (learner) — upsert theo name
  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: { name: "User" },
  });
  console.log(`   ✓ Role "User" (id: ${userRole.id})`);

  // Role "Admin" (admin dashboard) — upsert theo name
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });
  console.log(`   ✓ Role "Admin" (id: ${adminRole.id})`);

  // Demo user — upsert theo email (unique). Dùng Role "Admin" để truy cập admin dashboard demo.
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      // Re-seed: giữ xp/level/streak nếu đã có (không reset). Chỉ đảm bảo passwordHash + role.
      passwordHash,
      roleId: adminRole.id,
      status: "ACTIVE",
    },
    create: {
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      passwordHash,
      roleId: adminRole.id,
      status: "ACTIVE",
    },
    select: { id: true, username: true, email: true, xp: true, level: true, streakCount: true },
  });

  console.log(`   ✓ Demo user (id: ${demoUser.id})`);
  console.log(`     email: ${demoUser.email}`);
  console.log(`     username: ${demoUser.username}`);
  console.log(`     password: ${DEMO_PASSWORD}`);
  console.log(`     role: Admin (truy cập /admin dashboard)`);
  console.log(`     xp: ${demoUser.xp} | level: ${demoUser.level} | streak: ${demoUser.streakCount}`);

  const totalUsers = await prisma.user.count();
  const totalRoles = await prisma.role.count();
  console.log(`\n📊 Tổng: ${totalUsers} user, ${totalRoles} role`);
  console.log("\n✅ Demo user sẵn sàng. Login tại /login với email + password trên.");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed demo user:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
