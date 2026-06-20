# Phase 3: Social & Fun Mechanics - Kế Hoạch Chi Tiết

> **Phase:** 3/3  
> **Ưu tiên:** TRUNG BÌNH (tăng viral & replay value)  
> **Ước tính:** 3-4 ngày  
> **Skills:** `architect-mode`, `gamification_designer`, `postgresql_expert`, `testing`

---

## Mục tiêu

Thêm yếu tố **bất ngờ và xã hội** để người dùng quay lại mỗi ngày không chỉ vì "phải học" mà vì "muốn xem hôm nay có gì mới".

---

## Kiến trúc kỹ thuật

### 1. Weekly Challenge System

```
Tuần này: "7 ngày liên tiếp" → Ai hoàn thành trước → nhận 200 gems
Tuần sau: "Đạt 90%+ trong 5 bài" → Top 3 nhận huy hiệu đặc biệt
```

### 2. Spin Wheel (Vòng quay may mắn)

```
Điểm danh 3 ngày liên tiếp → 1 lượt quay
Vòng quay: 8 ô (gems, XP, badge, streak freeze, nothing, jackpot...)
```

### 3. Cấu trúc thư mục mới

```
src/
├── components/
│   └── gamification/
│       ├── social/                        ← THƯ MỤC MỚI
│       │   ├── WeeklyChallengeCard.tsx    ← Card thử thách tuần
│       │   ├── SpinWheel.tsx              ← Vòng quay may mắn
│       │   ├── AchievementShare.tsx       ← Chia sẻ thành tựu
│       │   └── SeasonalBanner.tsx         ← Banner sự kiện
│       └── ...
├── lib/
│   └── gamification/
│       ├── weekly-challenge.ts            ← Logic thử thách tuần
│       ├── spin-wheel.ts                  ← Logic vòng quay
│       └── share.ts                       ← Logic tạo share card
├── app/
│   └── api/
│       ├── weekly-challenges/
│       │   ├── route.ts                   ← GET: challenge hiện tại
│       │   └── claim/route.ts             ← POST: claim reward
│       └── spin-wheel/
│           └── route.ts                   ← POST: spin + trả kết quả
```

---

## Danh sách Task (6 tasks)

### Task 3.1: Database migration - WeeklyChallenge + SpinWheelLog

**Mô tả:** Thêm schema cho thử thách tuần + log vòng quay.

**Files:**
- `prisma/schema.prisma` (sửa)
- `prisma/seed-weekly-challenges.ts` (mới)

**Schema mới:**
```prisma
model WeeklyChallenge {
  id           String   @id @default(uuid())
  weekKey      String   @unique  // "2026-W26"
  title        String
  description  String
  targetMetric String            // "streak" | "score" | "exercises" | "perfect_scores"
  targetValue  Int
  rewardGems   Int      @default(0)
  rewardBadge  String?
  startsAt     DateTime
  endsAt       DateTime
  createdAt    DateTime @default(now())
  participants WeeklyChallengeParticipant[]
}

model WeeklyChallengeParticipant {
  id           String   @id @default(uuid())
  challengeId  String
  userId       String
  progress     Int      @default(0)
  completed    Boolean  @default(false)
  claimedAt    DateTime?
  challenge    WeeklyChallenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([challengeId, userId])
}

model SpinWheelLog {
  id          String   @id @default(uuid())
  userId      String
  prize       String             // "gems_10" | "gems_50" | "xp_100" | "streak_freeze" | "nothing" | "jackpot"
  prizeValue  Int      @default(0)
  spunAt      DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, spunAt])
}
```

**Seed data:** Tự động sinh challenge cho tuần hiện tại + tuần sau.

**Verify:** `npx prisma validate` pass

---

### Task 3.2: Weekly Challenge logic + API

**Mô tả:** Logic tính progress thử thách tuần + API GET (xem) + POST (claim).

**Files:**
- `src/lib/gamification/weekly-challenge.ts` (mới)
- `src/app/api/weekly-challenges/route.ts` (mới)
- `src/app/api/weekly-challenges/claim/route.ts` (mới)

**Logic:**
```typescript
// weekly-challenge.ts
export function getCurrentWeekKey(): string; // "2026-W26"
export function generateWeeklyChallenge(weekKey: string): WeeklyChallengeConfig;
export async function updateChallengeProgress(
  userId: string,
  metric: string,
  value: number,
): Promise<void>;
export async function getChallengeStatus(userId: string): Promise<{
  challenge: WeeklyChallenge;
  progress: number;
  completed: boolean;
  claimed: boolean;
  topParticipants: { username: string; progress: number }[];
}>;
```

**Tích hợp vào submit route:** Sau khi exercise submit thành công → gọi `updateChallengeProgress` với metric tương ứng.

**Verify:** `tsc --noEmit` pass

---

### Task 3.3: WeeklyChallengeCard UI

**Mô tả:** Card hiển thị thử thách tuần hiện tại + progress + top participants.

**Files:**
- `src/components/gamification/social/WeeklyChallengeCard.tsx` (mới)
- `src/app/dashboard/page.tsx` (sửa - thêm card)

**Thiết kế:**
- Card nổi bật với gradient màu tuần này
- Title + description + progress bar + reward preview
- Top 5 participants (avatar mini + username + progress)
- Nút "Nhận thưởng" khi completed (disabled khi chưa)
- Countdown timer đến hết thử thách
- Responsive: mobile full width, desktop sidebar

**Verify:** Build pass

---

### Task 3.4: Spin Wheel (vòng quay may mắn)

**Mô tả:** Vòng quay 8 ô, quay được khi đủ điều kiện (3 ngày check-in liên tiếp).

**Files:**
- `src/components/gamification/social/SpinWheel.tsx` (mới)
- `src/lib/gamification/spin-wheel.ts` (mới)
- `src/app/api/spin-wheel/route.ts` (mới)

**Thiết kế vòng quay:**
```
┌─────────┬─────────┐
│ 10 💎   │ 100 XP  │
├─────────┼─────────┤
│ 50 💎   │ NOTHING │  ← 8 ô, xen kẽ màu
├─────────┼─────────┤
│ FREEZE  │ JACKPOT │
├─────────┼─────────┤
│ 20 💎   │ 5 💎    │
└─────────┴─────────┘
```

**Logic:**
```typescript
// spin-wheel.ts
export const SPIN_WHEEL_PRIZES = [
  { id: "gems_10", label: "10 💎", weight: 25, value: { gems: 10 } },
  { id: "gems_50", label: "50 💎", weight: 10, value: { gems: 50 } },
  { id: "xp_100", label: "100 XP", weight: 20, value: { xp: 100 } },
  { id: "streak_freeze", label: "Bùa Đóng Băng", weight: 15, value: { streakFreezes: 1 } },
  { id: "gems_5", label: "5 💎", weight: 15, value: { gems: 5 } },
  { id: "gems_20", label: "20 💎", weight: 10, value: { gems: 20 } },
  { id: "nothing", label: "Hên xui!", weight: 4, value: {} },
  { id: "jackpot", label: "JACKPOT 100💎", weight: 1, value: { gems: 100 } },
] as const;

export function canSpin(lastCheckInDate: Date | null, today: Date, currentStreak: number): boolean;
export function spinWheel(): { prize: SpinPrize; angle: number };
```

**UI:**
- Vòng quay CSS (conic-gradient), mũi tên chỉ định ở trên
- Animation: rotate 3-5 vòng + dừng tại ô trúng
- Hiệu ứng: glow ô trúng + popup prize
- `prefers-reduced-motion`: hiện ngay kết quả, không quay
- Accessibility: `role="button"`, keyboard support (Enter/Space)

**Verify:** `tsc --noEmit` + `npm test` pass

---

### Task 3.5: AchievementShare (chia sẻ thành tựu)

**Mô tả:** Nút "Chia sẻ" cho badge, streak milestone, level up. Tạo card ảnh chia sẻ.

**Files:**
- `src/components/gamification/social/AchievementShare.tsx` (mới)
- `src/lib/gamification/share.ts` (mới)

**Thiết kế:**
- Nút "Chia sẻ" xuất hiện trên: badge card, streak milestone, level up overlay
- Click → tạo card preview (CSS, không canvas):
  - Background gradient
  - Avatar user + username
  - Thành tựu: "Đạt streak 30 ngày!" / "Lên Level 15!" / "Huy hiệu: Bậc Thầy"
  - QR code link app (optional)
  - Nút "Tải ảnh" (html-to-image hoặc screenshot API)
  - Nút "Sao chép link"
- Không cần backend - pure client-side

**Verify:** Build pass

---

### Task 3.6: Quality Gate + Test

**Mô tả:** Chạy full quality gate, thêm test cho weekly challenge + spin wheel.

**Files:**
- `src/lib/__tests__/weekly-challenge.test.ts` (mới)
- `src/lib/__tests__/spin-wheel.test.ts` (mới)

**Test cases weekly-challenge:**
- `getCurrentWeekKey()` → đúng format ISO week
- `generateWeeklyChallenge` → tạo challenge hợp lệ
- `updateChallengeProgress` → increment đúng metric
- Edge case: user mới chưa có participant record

**Test cases spin-wheel:**
- `canSpin` → streak >= 3 → true; streak < 3 → false
- `spinWheel` → tổng weight = 100, prize luôn hợp lệ
- Spin 1000 lần → phân bố prize gần với weight (±5%)
- Jackpot weight = 1% → xuất hiện ít nhất 0/1000 (không保证 xuất hiện)

**Quality gate:**
```bash
npx prisma validate
node node_modules\typescript\bin\tsc --noEmit
npm test
npm run build
```

**Verify:** Tất cả pass

---

## Thứ tự thực thi

```
Task 3.1 (DB migration + seed)
  └→ Task 3.2 (Weekly challenge logic + API)
       └→ Task 3.3 (WeeklyChallengeCard UI)
  └→ Task 3.4 (Spin wheel)
       └→ Task 3.5 (Achievement share)
            └→ Task 3.6 (Quality gate)
```

---

## Schema thay đổi tổng hợp

```sql
-- Thêm vào schema.prisma
model WeeklyChallenge {
  id           String   @id @default(uuid())
  weekKey      String   @unique
  title        String
  description  String
  targetMetric String
  targetValue  Int
  rewardGems   Int      @default(0)
  rewardBadge  String?
  startsAt     DateTime
  endsAt       DateTime
  createdAt    DateTime @default(now())
  participants WeeklyChallengeParticipant[]
}

model WeeklyChallengeParticipant {
  id           String   @id @default(uuid())
  challengeId  String
  userId       String
  progress     Int      @default(0)
  completed    Boolean  @default(false)
  claimedAt    DateTime?
  challenge    WeeklyChallenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([challengeId, userId])
}

model SpinWheelLog {
  id          String   @id @default(uuid())
  userId      String
  prize       String
  prizeValue  Int      @default(0)
  spunAt      DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, spunAt])
}

-- Thêm vào User model
model User {
  // ... existing fields
  challengeParticipants WeeklyChallengeParticipant[]
  spinWheelLogs         SpinWheelLog[]
}
```

---

## Ý tưởng mở rộng (tương lai, không thuộc phase này)

| Ý tưởng | Mô tả | Khi nào làm |
|---|---|---|
| Seasonal Events | Sự kiện Tết, Giáng Sinh, Hè với challenge đặc biệt | Khi có >= 50 active users |
| Guild/Team | Nhóm học tập, challenge nhóm | Khi có >= 100 active users |
| PvP Pronunciation Battle | Thi phát âm 1-1 real-time | Khi có WebSocket infrastructure |
| Daily Login Streak Tree | Cây lớn dần theo streak (như Forest app) | Nếu user thích streak |
| Achievement Gallery | Trang gallery tất cả badge đã nhận | Nếu user muốn show off |
