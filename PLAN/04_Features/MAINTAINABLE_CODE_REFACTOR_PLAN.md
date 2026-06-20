# Kế Hoạch Refactor Gamification theo Maintainable-Code

## Tổng quan

Áp dụng 9 nguyên tắc `maintainable-code` để cải thiện 27 file gamification (3,508 dòng).
Thực hiện theo 3 priority levels — từ an toàn nhất đến phức tạp nhất.

**Nguyên tắc thực hiện:**
- Mỗi task phải pass `tsc --noEmit` sau khi sửa
- Chạy test sau mỗi task để đảm bảo không regression
- Không refactor nhiều thứ cùng lúc

---

## Priority 1 — Quick Wins (An toàn, ít rủi ro)

### Task 1.1: DRY — Extract `toMilestoneInfo()` helper trong `milestones.ts`

**Nguyên tắc:** DRY (Don't Repeat Yourself)
**File:** `src/lib/gamification/milestones.ts`
**Vấn đề:** Mapping Prisma row → MilestoneInfo lặp 3 lần (L35-43, L66-74, L88-96)

**Cách sửa:**
```ts
// Thêm helper function ở đầu file
function toMilestoneInfo(r: {
  id: string; level: number; gemsReward: number;
  badgeName: string | null; unlockType: string | null;
  title: string; description: string;
}): MilestoneInfo {
  return {
    id: r.id, level: r.level, gemsReward: r.gemsReward,
    badgeName: r.badgeName, unlockType: r.unlockType,
    title: r.title, description: r.description,
  };
}
```
Rồi thay 3 chỗ `.map((r) => ({...}))` bằng `.map(toMilestoneInfo)`.

**Rủi ro:** Rất thấp — pure refactor, không thay đổi behavior.

---

### Task 1.2: Magic Numbers → Named Constants

**Nguyên tắc:** Constants Over Magic Numbers
**Files thay đổi:**

| File | Số magic | Constant mới |
|------|----------|--------------|
| `constants.ts` | — | Thêm `MS_PER_DAY`, `MS_PER_HOUR`, `SPIN_ANIMATION_MS` |
| `mastery.ts` L27,29 | `100`, `0.6`, `0.4` | `MAX_EXERCISE_SCORE`, `COMPLETION_WEIGHT`, `SCORE_WEIGHT` |
| `spin-wheel.ts` L68 | `3`, `3` | `MIN_FULL_SPINS`, `EXTRA_SPINS_RANGE` |
| `weekly-challenge.ts` L50 | `86400000` | Import `MS_PER_DAY` từ constants |
| `SpinWheel.tsx` L74,111 | `3500`, `3.5s` | Import `SPIN_ANIMATION_MS`, tính `s` từ ms |
| `WeeklyChallengeCard.tsx` L69-70 | `86400000`, `3600000` | Import `MS_PER_DAY`, `MS_PER_HOUR` |

**Rủi ro:** Rất thấp — chỉ đổi tên biến.

---

### Task 1.3: DRY — Consolidate MasteryTree tier styles

**Nguyên tắc:** DRY
**File:** `src/components/gamification/progression/MasteryTree.tsx`
**Vấn đề:** 2 hàm `getTierColor()` và `getProgressBarColor()` switch trên cùng 4 tiers (L12-36)

**Cách sửa:** Gộp thành 1 config object:
```ts
const TIER_STYLES: Record<MasteryNode["tier"], { node: string; bar: string }> = {
  gold:   { node: "bg-amber-400 text-amber-900", bar: "bg-amber-400" },
  silver: { node: "bg-blue-400 text-blue-900",   bar: "bg-blue-400" },
  bronze: { node: "bg-orange-300 text-orange-800", bar: "bg-orange-300" },
  none:   { node: "bg-neutral-200 text-neutral-500", bar: "bg-neutral-200" },
};
```

**Rủi ro:** Rất thấp.

---

### Task 1.4: DRY — Extract participants include trong weekly-challenges route

**Nguyên tắc:** DRY
**File:** `src/app/api/weekly-challenges/route.ts`
**Vấn đề:** Block `include.participants` lặp 2 lần (L29-35, L50-56)

**Cách sửa:** Extract constant:
```ts
const PARTICIPANTS_INCLUDE = {
  participants: {
    orderBy: { progress: "desc" as const },
    take: 5,
    include: { user: { select: { username: true, avatarUrl: true } } },
  },
} as const;
```

**Rủi ro:** Rất thấp.

---

### Task 1.5: DRY — Dùng `SPIN_ELIGIBLE_STREAK` thay vì hardcode `3`

**Nguyên tắc:** DRY + Constants
**File:** `src/app/api/spin-wheel/route.ts` L41-43
**Vấn đề:** `user.streakCount < 3` hardcode thay vì dùng constant từ `spin-wheel.ts`

**Cách sửa:**
```ts
import { canSpin, spinWheel, SPIN_ELIGIBLE_STREAK } from "@/lib/gamification/spin-wheel";
// ...
code: user.streakCount < SPIN_ELIGIBLE_STREAK ? "STREAK_TOO_LOW" : ...
```

**Rủi ro:** Rất thấp.

---

## Priority 2 — Cấu trúc lại (Medium effort, giá trị cao)

### Task 2.1: Extract mastery route business logic vào `lib/`

**Nguyên tắc:** Single Responsibility + Clean File Structure
**File:** `src/app/api/mastery/route.ts` L53-96 → `src/lib/gamification/mastery.ts`
**Vấn đề:** 44 dòng data transformation nằm trực tiếp trong API route handler

**Cách sửa:**
- Tạo hàm `buildMasteryData(topics, userAttempts)` trong `mastery.ts`
- Route chỉ gọi hàm này rồi trả JSON
- Route giảm từ 100 dòng → ~55 dòng

**Rủi ro:** Thấp — extract pure function, test dễ.

---

### Task 2.2: Fix dynamic import inconsistency trong milestones route

**Nguyên tắc:** Clean File Structure + KISS
**File:** `src/app/api/milestones/route.ts` L20-25
**Vấn đề:** Dùng `await import("@/lib/prisma")` dynamic import thay vì static import

**Cách sửa:** Đổi thành `import { prisma } from "@/lib/prisma"` ở đầu file, giống mọi route khác.

**Rủi ro:** Rất thấp.

---

### Task 2.3: Thêm comments giải thích business rules

**Nguyên tắc:** Meaningful Comments — Explain "Why"
**Files:**

| File | Thiếu comment | Cần thêm |
|------|--------------|----------|
| `mastery.ts` L29 | Formula 60/40 | Tại sao completion > score |
| `weekly-challenge.ts` L10-39 | Template values | Gem economy balance rationale |
| `spin-wheel.ts` L18-27 | Prize weights | Expected value per spin, jackpot 1% |
| `constants.ts` L34-38 | Streak thresholds 3,7,14,30 | Weekly doubling pattern |

**Rủi ro:** Zero — chỉ thêm comment.

---

## Priority 3 — Refactor lớn (Cẩn thận, test trước)

### Task 3.1: Thêm tests cho `milestones.ts` claimMilestone

**Nguyên tắc:** Testing for Safety
**File mới:** `src/lib/__tests__/milestones.test.ts`
**Vấn đề:** `claimMilestone` có 4 error paths + 1 happy path, không có test

**Cần test:**
1. `MILESTONE_NOT_FOUND` — milestoneId không tồn tại
2. `USER_NOT_FOUND` — userId không tồn tại
3. `LEVEL_NOT_REACHED` — user.level < milestone.level
4. `ALREADY_CLAIMED` — đã claim rồi
5. Happy path — claim thành công, gems tăng, badge awarded

**Note:** Cần mock Prisma. Dùng approach đơn giản: test các pure logic parts, skip DB tests.

**Rủi ro:** Trung bình — cần setup mock.

---

### Task 3.2: Tách ExerciseEngineClient thành hooks + sub-components

**Nguyên tắc:** Single Responsibility
**File:** `src/app/exercises/[id]/ExerciseEngineClient.tsx` (695 dòng)
**Vấn đề:** 1 file làm 6+ nhiệm vụ khác nhau

**Kế hoạch tách:**

| Extract ra | Nội dung | Dòng ước tính |
|------------|----------|--------------|
| `useExerciseSubmit.ts` hook | submitExercise + reward emission + error handling | ~80 dòng |
| `useExerciseNavigation.ts` hook | currentIndex, recordAnswer, finish logic | ~60 dòng |
| `QuestionRenderer.tsx` component | Switch 7 question types → render | ~60 dòng |
| `AudioButton.tsx` → `components/ui/` | Audio playback button | ~45 dòng |
| Types → `types.ts` | ExerciseQuestion, ExerciseData, etc. | ~30 dòng |

Sau khi tách: `ExerciseEngineClient.tsx` còn ~200 dòng (orchestration + UI layout).

**Rủi ro:** Cao — file lớn nhất, nhiều dependencies. Cần:
1. Viết test capture behavior hiện tại TRƯỚC
2. Extract từng cái một
3. Verify sau mỗi bước

---

## Kiểm chứng sau mỗi Priority

Sau khi hoàn thành mỗi priority level:
```bash
# 1. TypeScript clean
node node_modules\typescript\bin\tsc --noEmit

# 2. All tests pass
node --import tsx --test src\lib\__tests__\*.test.ts
```

---

## Timeline ước tính

| Priority | Tasks | Thời gian |
|----------|-------|-----------|
| P1 — Quick Wins | 1.1 → 1.5 | ~30 phút |
| P2 — Cấu trúc lại | 2.1 → 2.3 | ~45 phút |
| P3 — Refactor lớn | 3.1 → 3.2 | ~2-3 giờ |
| **Tổng** | **10 tasks** | **~3-4 giờ** |
