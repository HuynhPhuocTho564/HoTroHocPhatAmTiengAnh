/**
 * SEED DEMO DATA - Tạo nhiều user + dữ liệu gamification (XP/level/streak/attempt/leaderboard)
 * để admin dashboard + leaderboard có nội dung demo thực tế.
 *
 * Chạy SAU seed_lessons (cần exercises tồn tại) + seed_demo_user (cần Role).
 * Idempotent: upsert theo email.
 *
 * Chạy: npx tsx prisma/seed_demo_data.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getWeekPeriod, getMonthPeriod } from "../src/lib/period";

const prisma = new PrismaClient();

type DemoUser = {
  username: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  totalCheckIns: number;
  daysAgoCreated: number; // createdAt = today - daysAgoCreated
};

// 6 learner + 1 admin (đã có từ seed_demo_user, nhưng upsert lại cho chắc)
const DEMO_USERS: DemoUser[] = [
  { username: "minh_nguyen", email: "minh@demo.app", password: "demo123456", xp: 2450, level: 3, streakCount: 12, longestStreak: 15, totalCheckIns: 18, daysAgoCreated: 20 },
  { username: "lan_tran", email: "lan@demo.app", password: "demo123456", xp: 1820, level: 2, streakCount: 7, longestStreak: 9, totalCheckIns: 11, daysAgoCreated: 15 },
  { username: "hoang_le", email: "hoang@demo.app", password: "demo123456", xp: 3200, level: 4, streakCount: 21, longestStreak: 25, totalCheckIns: 30, daysAgoCreated: 30 },
  { username: "mai_pham", email: "mai@demo.app", password: "demo123456", xp: 980, level: 2, streakCount: 3, longestStreak: 5, totalCheckIns: 6, daysAgoCreated: 8 },
  { username: "duc_vo", email: "duc@demo.app", password: "demo123456", xp: 4100, level: 5, streakCount: 35, longestStreak: 40, totalCheckIns: 45, daysAgoCreated: 45 },
  { username: "anh_phan", email: "anh@demo.app", password: "demo123456", xp: 560, level: 1, streakCount: 1, longestStreak: 2, totalCheckIns: 2, daysAgoCreated: 3 },
];

async function main() {
  console.log("👥 Seeding demo users + gamification data...\n");

  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: { name: "User" },
  });

  // Lấy exercises ACTIVE để gán attempts (lấy 1 vài bài đầu)
  const exercises = await prisma.exercise.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true },
    take: 20,
  });
  console.log(`   Tìm thấy ${exercises.length} exercises ACTIVE để gán attempts`);

  if (exercises.length === 0) {
    console.warn("   ⚠️  Không có exercise ACTIVE. Chạy seed_lessons trước. Skip attempts.");
  }

  const now = new Date();
  const weekPeriod = getWeekPeriod(now);
  const monthPeriod = getMonthPeriod(now);

  let userCount = 0;
  for (const demo of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(demo.password, 10);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - demo.daysAgoCreated);
    const lastCheckIn = new Date(now);
    lastCheckIn.setDate(lastCheckIn.getDate() - 1); // check-in hôm qua

    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        passwordHash,
        xp: demo.xp,
        level: demo.level,
        streakCount: demo.streakCount,
        longestStreak: demo.longestStreak,
        totalCheckIns: demo.totalCheckIns,
        lastCheckInDate: lastCheckIn,
        status: "ACTIVE",
        roleId: userRole.id,
      },
      create: {
        username: demo.username,
        email: demo.email,
        passwordHash,
        xp: demo.xp,
        level: demo.level,
        streakCount: demo.streakCount,
        longestStreak: demo.longestStreak,
        totalCheckIns: demo.totalCheckIns,
        lastCheckInDate: lastCheckIn,
        status: "ACTIVE",
        roleId: userRole.id,
        createdAt,
      },
      select: { id: true, username: true, xp: true, level: true },
    });
    console.log(`   ✓ ${user.username} | xp=${user.xp} | level=${user.level}`);
    userCount++;

    // Leaderboard entries (tuần + tháng) — score = xp (đơn giản hóa)
    for (const [type, period] of [["tuan", weekPeriod], ["thang", monthPeriod]] as const) {
      await prisma.leaderboard.upsert({
        where: { userId_type_period: { userId: user.id, type, period } },
        update: { score: demo.xp, correctAnswers: Math.floor(demo.xp / 10), completedExercises: Math.floor(demo.xp / 100) },
        create: { userId: user.id, type, period, score: demo.xp, correctAnswers: Math.floor(demo.xp / 10), completedExercises: Math.floor(demo.xp / 100) },
      });
    }

    // Exercise attempts — gán 3-5 attempt ngẫu nhiên (score 60-95)
    if (exercises.length > 0) {
      const numAttempts = Math.min(5, Math.max(3, Math.floor(demo.xp / 800)));
      for (let i = 0; i < numAttempts; i++) {
        const ex = exercises[(i + demo.username.length) % exercises.length];
        const score = 60 + Math.floor(Math.random() * 36); // 60-95
        const attemptDate = new Date(now);
        attemptDate.setDate(attemptDate.getDate() - Math.floor(Math.random() * 7)); // trong 7 ngày qua
        await prisma.exerciseAttempt.create({
          data: {
            userId: user.id,
            exerciseId: ex.id,
            status: "COMPLETED",
            attemptCount: 1 + Math.floor(Math.random() * 3),
            score,
            createdAt: attemptDate,
          },
        });
      }
    }

    // Daily activity hôm nay (xp earned = demo.xp/10, completedExercises = random)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    await prisma.dailyActivity.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: { userId: user.id, date: today, xpEarned: Math.floor(demo.xp / 10), completedExercises: Math.floor(Math.random() * 4), checkIns: 0 },
      update: {},
    });
  }

  const totalUsers = await prisma.user.count();
  const totalAttempts = await prisma.exerciseAttempt.count();
  const totalLeaderboard = await prisma.leaderboard.count();
  console.log(`\n📊 Tổng: ${totalUsers} user, ${totalAttempts} exercise attempts, ${totalLeaderboard} leaderboard entries`);
  console.log("\n✅ Demo data sẵn sàng. Admin dashboard + leaderboard có nội dung.");
  console.log("   Login admin: demo@pronunciation.app / demo123456 → /admin");
  console.log("   Login learner: minh@demo.app (hoặc lan/hoang/mai/duc/anh) @demo.app / demo123456");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed demo data:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
