# Phase 2: Progression Journey - Kế Hoạch Chi Tiết

> **Phase:** 2/3  
> **Ưu tiên:** CAO (giữ người dùng lâu dài)  
> **Ước tính:** 4-5 ngày  
> **Skills:** `SKILL/maintainable-code`, `gamification_designer`, `postgresql_expert`, `SKILL/nielsen-ux-heuristics`, `SKILL/ui-color-harmony`, `accessibility`, `testing`

---

## Mục tiêu

Tạo cảm giác **hành trình có đích đến** — người dùng biết mình đang ở đâu, đã đi được bao xa, và điều gì đang chờ phía trước.

---

## Kiến trúc kỹ thuật

### 1. Milestone Reward System (Phần thưởng cột mốc)

```
User lên Level 5  →  MilestoneCheck  →  Award: 50 gems + Badge "Khởi Đầu"
User lên Level 10 →  MilestoneCheck  →  Award: 100 gems + Badge "Kiên Trì" + Unlock avatar frame
User lên Level 20 →  MilestoneCheck  →  Award: 200 gems + Badge "Bậc Thầy" + Unlock theme
```

**Schema mới:**
```prisma
model MilestoneReward {
  id          String   @id @default(uuid())
  level       Int      @unique           // Level cần đạt
  gemsReward  Int      @default(0)
  badgeName   String?                    // Tên badge thưởng
  unlockType  String?                    // "avatar_frame" | "theme" | "feature"
  unlockValue String?                    // Giá trị mở khóa
  title       String                     // "Khởi Đầu", "Kiên Trì"
  description String
  createdAt   DateTime @default(now())
}

model UserMilestone {
  id          String   @id @default(uuid())
  userId      String
  milestoneId String
  claimedAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  milestone   MilestoneReward @relation(fields: [milestoneId], references: [id])
  @@unique([userId, milestoneId])
}
```

### 2. Cấu trúc thư mục mới

```
src/
├── components/
│   └── gamification/
│       ├── progression/                   ← THƯ MỤC MỚI
│       │   ├── MilestonePopup.tsx         ← Popup khi đạt cột mốc
│       │   ├── MasteryTree.tsx            ← Cây kỹ năng trực quan
│       │   ├── ChapterProgress.tsx        ← Tiến trình chương CĐ1→CĐ4
│       │   ├── LevelRoadmap.tsx           ← Roadmap level + milestone tiếp theo
│       │   └── UnlockNotification.tsx     ← "Đã mở khóa: ..."
│       └── ...
├── lib/
│   └── gamification/
│       ├── milestones.ts                  ← Logic kiểm tra + claim milestone
│       ├── mastery.ts                     ← Logic tính mastery % per topic
│       └── constants.ts                   ← (đã có từ Phase 1)
├── app/
│   └── api/
│       └── milestones/
│           ├── route.ts                   ← GET: danh sách milestone + claim status
│           └── claim/route.ts             ← POST: claim milestone reward
```

---

## Danh sách Task (7 tasks)

### Task 2.1: Database migration - MilestoneReward + UserMilestone

**Mô tả:** Thêm 2 model mới vào `prisma/schema.prisma`, chạy migration, seed data cột mốc.

**Files:**
- `prisma/schema.prisma` (sửa - thêm 2 model)
- `prisma/seed-milestones.ts` (mới - seed data)

**Seed data:**
| Level | Gems | Badge | Title | Mô tả |
|---|---|---|---|---|
| 5 | 50 | milestone_starter | Khởi Đầu | Bước đầu trên hành trình phát âm |
| 10 | 100 | milestone_persistent | Kiên Trì | 10 cấp độ kiên trì |
| 15 | 100 | milestone_explorer | Khám Phá | Mở khóa toàn bộ CĐ1-CĐ4 |
| 20 | 200 | milestone_master | Bậc Thầy | Thành thạo phát âm tiếng Anh |
| 30 | 300 | milestone_legend | Huyền Thoại | Level thần thoại |

**Verify:** `npx prisma validate` + `npx prisma migrate dev` pass

---

### Task 2.2: Milestone logic + API routes

**Mô tả:** Tạo logic kiểm tra milestone + API GET (list) + POST (claim).

**Files:**
- `src/lib/gamification/milestones.ts` (mới)
- `src/app/api/milestones/route.ts` (mới - GET)
- `src/app/api/milestones/claim/route.ts` (mới - POST)

**Logic:**
```typescript
// milestones.ts
export function getReachedMilestones(currentLevel: number): MilestoneReward[];
export function getUnclaimedMilestones(userId: string, currentLevel: number): Promise<MilestoneReward[]>;
export function claimMilestone(userId: string, milestoneId: string): Promise<{ gems: number; badgeName?: string }>;
```

**API:**
- `GET /api/milestones` → `{ milestones: [...], claimed: [...], nextMilestone: {...} }`
- `POST /api/milestones/claim` → body `{ milestoneId }` → award gems + badge

**Verify:** `tsc --noEmit` pass

---

### Task 2.3: MilestonePopup component

**Mô tả:** Popup đẹp khi user đạt level có milestone. Tích hợp vào RewardEventEmitter từ Phase 1.

**Files:**
- `src/components/gamification/progression/MilestonePopup.tsx` (mới)

**Thiết kế:**
- Trigger: LevelUpOverlay phát thêm event `milestone_reached`
- UI: popup với title milestone, icon huy hiệu, gems reward, nút "Nhận"
- Animation: scale-in + glow effect
- Sau click "Nhận" → gọi API claim → hiển thị "Đã nhận!"
- Accessibility: `role="dialog"`, focus trap

**Verify:** Build pass

---

### Task 2.4: LevelRoadmap (roadmap cấp độ)

**Mô tả:** Component hiển thị roadmap level hiện tại → level tiếp theo → milestone gần nhất.

**Files:**
- `src/components/gamification/progression/LevelRoadmap.tsx` (mới)
- `src/app/dashboard/page.tsx` (sửa - thêm LevelRoadmap)

**Thiết kế:**
- Horizontal progress bar: Level hiện tại → Level kế tiếp
- Marker milestone trên bar (icon 🎁 tại level 5, 10, 15, 20, 30)
- Text: "Còn X XP để lên Level Y" + "Còn Z cấp đến milestone 'Kiên Trì'"
- Responsive: mobile hiển thị dọc

**Verify:** `tsc --noEmit` pass

---

### Task 2.5: MasteryTree (cây kỹ năng)

**Mô tả:** Hiển thị cây kỹ năng trực quan - % hoàn thành mỗi chủ đề (CĐ1, CĐ2, CĐ3, CĐ4).

**Files:**
- `src/components/gamification/progression/MasteryTree.tsx` (mới)
- `src/lib/gamification/mastery.ts` (mới - logic tính %)
- `src/app/api/mastery/route.ts` (mới - GET mastery data)

**Thiết kế:**
```
Cây kỹ năng:
├── CĐ1 Nguyên âm (75% ████████░░)
│   ├── /iː/ /ɪ/  ████████████ 100%
│   ├── /e/ /æ/   ████████░░░░  67%
│   └── ...
├── CĐ2 Phụ âm (40% ████░░░░░░)
├── CĐ3 Năng cao (10% █░░░░░░░░)
└── CĐ4 Nối âm  (0%  ░░░░░░░░░░)
```

- Mỗi node có màu: xám (0%), vàng (1-49%), xanh (50-99%), vàng kim (100%)
- Click vào node → link đến learning map của nhóm đó
- Tổng mastery % hiển thị ở gốc cây

**Logic tính mastery:**
```typescript
// mastery.ts
export function computeMasteryPercentage(
  soundGroupId: string,
  completedExercises: number,
  totalExercises: number,
  avgScore: number
): number {
  // weight: completion 60% + avgScore 40%
}
```

**Verify:** `tsc --noEmit` + `npm test` pass

---

### Task 2.6: ChapterProgress (tiến trình chương)

**Mô tả:** Component hiển thị tiến trình qua 4 chương (CĐ1→CĐ4) dạng "hành trình".

**Files:**
- `src/components/gamification/progression/ChapterProgress.tsx` (mới)
- `src/app/dashboard/page.tsx` (sửa - thêm ChapterProgress)

**Thiết kế:**
- 4 chấm lớn đại diện 4 chương, nối bằng đường mũi tên
- Mỗi chấm: icon + tên + % hoàn thành
- Chương khóa (completion < 80% chương trước): icon 🔒
- Chương mở khóa: icon ✓ + màu sáng
- Animation: khi mở khóa chương mới → glow + pulse

**Verify:** Build pass

---

### Task 2.7: UnlockNotification + Quality Gate

**Mô tả:** Toast thông báo khi mở khóa nội dung mới (chương, sound group). Chạy quality gate.

**Files:**
- `src/components/gamification/progression/UnlockNotification.tsx` (mới)
- `src/lib/__tests__/milestones.test.ts` (mới)
- `src/lib/__tests__/mastery.test.ts` (mới)

**Thiết kế UnlockNotification:**
- Trigger: khi user hoàn thành bài cuối của nhóm → check xem nhóm tiếp theo có unlock không
- UI: toast xanh "🔓 Đã mở khóa: [Tên nhóm âm]" + link đến bài học
- Tự ẩn sau 5s

**Test cases:**
- `getReachedMilestones(12)` → trả về milestone level 5 + 10
- `getUnclaimedMilestones` → chỉ trả milestone chưa claim
- `claimMilestone` → increment gems + tạo UserMilestone + award badge
- `computeMasteryPercentage` → đúng công thức
- Edge case: level 0, level 100, claim trùng

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
Task 2.1 (DB migration + seed)
  └→ Task 2.2 (Logic + API)
       └→ Task 2.3 (MilestonePopup)
       └→ Task 2.4 (LevelRoadmap)
       └→ Task 2.5 (MasteryTree)
       └→ Task 2.6 (ChapterProgress)
            └→ Task 2.7 (UnlockNotif + Quality gate)
```

---

## Schema thay đổi tổng hợp

```sql
-- Thêm vào schema.prisma
model MilestoneReward {
  id          String   @id @default(uuid())
  level       Int      @unique
  gemsReward  Int      @default(0)
  badgeName   String?
  unlockType  String?
  unlockValue String?
  title       String
  description String
  createdAt   DateTime @default(now())
  userMilestones UserMilestone[]
}

model UserMilestone {
  id          String   @id @default(uuid())
  userId      String
  milestoneId String
  claimedAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  milestone   MilestoneReward @relation(fields: [milestoneId], references: [id])
  @@unique([userId, milestoneId])
}

-- Thêm vào User model
model User {
  // ... existing fields
  userMilestones UserMilestone[]
}
```
