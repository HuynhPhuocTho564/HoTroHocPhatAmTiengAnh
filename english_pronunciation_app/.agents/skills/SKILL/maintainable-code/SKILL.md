---
name: maintainable-code
description: Use whenever writing or modifying ANY code for Web_HoTroPhatAmEN — components, services, route handlers, seed scripts, tests. Applies KISS, DRY, type safety, constants, cohesion/coupling, naming, and size limits to keep code readable and changeable. Mandatory before every code change, even small fixes or demo scripts.
---

# Maintainable Code

## Khi nào dùng

**Bắt buộc đọc trước khi viết hoặc sửa bất kỳ dòng code nào** — component React, service trong `src/lib/`, route handler, seed script, test, hook. Áp dụng cho mọi thay đổi lớn nhỏ, kể cả fix 1 dòng, demo script, prototype. Skill này là lens *maintainability* (chất lượng code bên trong 1 file); dùng song song với `architect-mode` (kiến trúc giữa các layer) và `SKILL/maintainable-code` cùng nhóm UI/UX roadmap.

Khi làm task trong `PLAN/03_UI_UX/IMPROVEMENT_P1..P6`, skill này áp dụng cho mọi task có thay đổi code.

## Checklist thực thi

- [ ] Không có magic numbers/strings — tất cả trong `src/lib/constants.ts` hoặc file domain
- [ ] Types đầy đủ, không `any` — dùng `unknown` + type guard khi cần
- [ ] Functions ≤ 50 dòng, components ≤ 200 dòng (ngoại lệ: switch nhiều branch, generated code)
- [ ] Unit test cho pure function mới
- [ ] `tsc --noEmit` pass
- [ ] Mỗi file có 1 trách nhiệm rõ (high cohesion)
- [ ] Tên hàm/biến mô tả WHAT + WHY, không mô tả HOW
- [ ] Không trùng lặp thật (DRY) — đã extract nếu logic xuất hiện 3+ chỗ
- [ ] Mỗi hàm 1 mức trừu tượng (SLAP)

## Lý thuyết cốt lõi

### A. Cohesion & Coupling (Larry Constantine — gốc của maintainability)

**Cohesion** (nội聚力 — mức các phần trong module phục vụ 1 mục đích):
- Cao → thấp: Functional > Sequential > Communicational > Procedural > Temporal > Logical > Coincidental
- Mục tiêu: **Functional cohesion** — mọi phần cùng làm 1 việc
- Ví dụ tốt: hàm `calculateRankingDelta(attempt)` chỉ tính delta, không save DB
- Ví dụ xấu: hàm `processExercise()` vừa chấm điểm + vừa update DB + vừa check badge

**Coupling** (liên kết — mức module phụ thuộc module khác):
- Thấp → cao: Data > Stamp > Control > External > Common > Content
- Mục tiêu: **Data coupling** — module chỉ trao đổi data qua tham số
- Heuristic chẩn đoán: *"Nếu đổi 1 yêu cầu mà phải sửa 3+ file → coupling cao, cần refactor"*

**Khác `architect-mode`:** architect-mode nói *layering* (UI→Controller→Service→Repo), skill này nói *chất lượng bên trong 1 module*. Layering đúng + cohesion cao = maintainability thật.

### B. Naming (intention-revealing — 80% maintainability đến từ đây)

- Tên mô tả **WHAT + WHY**, không mô tả HOW
- **Tránh** từ quá chung: `data`, `info`, `temp`, `handle`, `process`, `manager`, `util`, `helper`
- Đặt theo nghiệp vụ: `calculateRankingDelta()` không `processScore()`; `getUserStreak()` không `getData()`
- Boolean: tiền tố `is/has/can/should` (`isValid`, `hasStreak`, `canRetake`)
- Hàm trả giá trị → danh từ; hàm side-effect → động từ (`getScore()` vs `saveAttempt()`)
- **Rule:** *"Nếu phải đọc thân hàm mới hiểu tên → tên sai"*

### C. KISS — rule of three

- 1 lần similar: giữ nguyên
- 2 lần: chấp nhận, ghi nhận (chưa đủ signal)
- 3 lần: extract (pattern đã rõ)
- Tránh **premature abstraction**: trừu tượng sai tốn công sửa hơn duplication
- Khi nào ngoại lệ: prototype, demo cho demo, deadline gấp — ghi TODO extract sau

### D. DRY — trùng lặp thật vs tình cờ

- **Trùng thật:** cùng intent + cùng logic → extract (function/hook/utility)
- **Trùng tình cờ:** cùng code nhưng intent khác → **giữ tách biệt** (ghép lại là "wrong DRY", phá tính độc lập)
- Kiểm tra phân biệt: *"Nếu sửa chỗ A, chỗ B cũng phải sửa cùng cách → trùng thật. Nếu sửa A không ảnh hưởng B → tình cờ, giữ tách."*
- Kỹ thuật extract: function (logic thuần) → hook (state + logic) → utility module (cross-cutting)

### E. Type Safety

- **Cấm `any`** — `any` tắt type-checker, bug chạy được rồi lỗi runtime
- Dùng `unknown` + type guard: `typeof`, `in`, `instanceof`, hoặc `zod` cho parsing external data
- **Explicit return type** cho hàm public/exported (giúp AI/developer hiểu contract không cần đọc thân)
- Query Prisma: `Prisma.<Model>GetPayload<{ select: {...} }>` cho kết quả có `select` cụ thể
- Naming: Interface PascalCase (`ExerciseSubmitPayload`), type alias cho union (`ExerciseMode`), const UPPER_SNAKE_CASE (`BASE_SCORE_LISTEN_CHOOSE`)

### F. Constants

- **Magic number/string** = giá trị literal không tự giải thích: `5`, `0.8`, `"weekly"`, `7`
- Bắt buộc constant: threshold (70/80/90), multiplier (0.5/0.8), config (URL, API key), enum-like string ("weekly"/"monthly"), reward tiers
- UPPER_SNAKE_CASE, group trong `src/lib/constants.ts` hoặc file domain (`src/lib/gamification/constants.ts`)
- Khi nào tách file riêng: khi >20 constant hoặc theo domain riêng biệt
- Ngoại lệ không phải magic: giá trị index loop (`i = 0`), literal rõ nghĩa (`+1` cho offset)

### G. Boy Scout Rule (Uncle Bob)

- *"Leave the code cleaner than you found it"*
- Mỗi lần sửa file: sửa thêm 1 việc nhỏ phụ (đổi tên biến xấu, xóa import không dùng, tách hàm quá dài)
- **Giới hạn:** không refactor ngoài scope task hiện tại → tránh scope creep. Chỉ sửa những gì chạm vào tay.

### H. SLAP (Single Level of Abstraction)

- Mỗi hàm chỉ 1 mức trừu tượng. Không trộn `validate()` với `if (x > 5)` cùng cấp
- Hàm cao gọi hàm thấp, phân tầng rõ
- Lợi: đọc top-down, hiểu flow mà không cần chi tiết; chi tiết ẩn ở hàm thấp
- Ví dụ xấu: `submitAttempt()` vừa gọi `prisma.$transaction` vừa đếm `for (const q of questions)`

### I. Composition over inheritance

- Ưu tiên compose small objects/functions thay vì class extends sâu
- Inheritance > 2 tầng → khó hiểu, **fragile base class** (sửa base phá derived)
- TypeScript: dùng interface + function thay abstract class khi có thể

### J. Giới hạn kích thước

- Functions ≤ 50 dòng, components ≤ 200 dòng
- Lý do: cognitive load — con người giữ **7±2 ý** (Miller) trong working memory; hàm dài quá 7±2 khối logic → khó theo
- Ngoại lệ được phép: switch-case nhiều branch (vừa đủ rõ), generated code, test fixture
- Khi quá giới hạn: tách theo trách nhiệm, không tách cơ học theo dòng

### K. Testability

- **Pure function** (no side effect) → unit test dễ nhất, ưu tiên
- Side effect (DB, network, time, random) → inject dependency, mock Prisma client
- Test **hành vi**, không test implementation (không assert gọi hàm nào, assert kết quả ra)
- Khi viết service: tách logic tính toán ra (pure) khỏi logic DB (side effect) → test phần tính toán không cần mock DB

## Ví dụ before/after (từ PLAN IMPROVEMENT)

### Ví dụ 1: Constant thay magic number (P1-1.1, DAILY_REWARD_GEMS)

```typescript
// TRƯỚC — magic number rải trong component
{ day: 1, gems: 5 }
{ day: 2, gems: 8 }
{ day: 7, gems: 25 }

// SAU — constant trong src/lib/gamification/constants.ts
export const DAILY_REWARD_GEMS = [
  { day: 1, gems: 5 },
  { day: 2, gems: 8 },
  { day: 3, gems: 10 },
  { day: 4, gems: 12 },
  { day: 5, gems: 15 },
  { day: 6, gems: 20 },
  { day: 7, gems: 25 },
] as const;
// Component import và map qua — đổi giá trị 1 chỗ
```

### Ví dụ 2: DRY — extract function (P1-1.3, localizeBadgeType)

```typescript
// TRƯỚC — inline switch lặp 3 chỗ (BadgeCard, BadgeList, BadgeDetail)
{badge.type === "COMMON" ? "Thường" :
 badge.type === "RARE" ? "Hiếm" :
 badge.type === "EPIC" ? "Huyền thoại" : badge.type}

// SAU — extract 1 function trong src/lib/badges.ts
const BADGE_TYPE_LABELS: Record<string, string> = {
  COMMON: "Thường",
  RARE: "Hiếm",
  EPIC: "Huyền thoại",
  PERIODIC: "Theo kỳ",
};
export function localizeBadgeType(type: string): string {
  return BADGE_TYPE_LABELS[type] ?? type;
}
// 3 chỗ gọi: {localizeBadgeType(badge.type)}
```

### Ví dụ 3: Skeleton pattern nhất quán (P1-1.4, DRY cross-cutting)

```tsx
// TRƯỚC — badges/leaderboard page mỗi chỗ viết skeleton khác nhau
{isLoading && <Card>Đang tải...</Card>}

// SAU — shared Skeleton component trong src/components/ui/Skeleton.tsx
<SkeletonCard count={6} />      // badges page
<SkeletonList count={5} />      // leaderboard page
// Đổi skeleton style 1 chỗ, áp dụng mọi page
```

### Ví dụ 4: Pure function cho testability (scoring)

```typescript
// TRƯỚC — logic lẫn với DB
async function submitExercise(userId, attempt) {
  const score = calculateScore(attempt);  // lẫn trong transaction
  await prisma.$transaction([...]);
  return score;
}

// SAU — tách pure function ra
// src/lib/scoring.ts — pure, test không cần mock
export function calculateRankingDelta(attempt: Attempt): number {
  if (attempt.isFirstAttempt) return attempt.score;
  if (attempt.score > attempt.previousBest) return attempt.score - attempt.previousBest;
  return Math.min(attempt.score, 5); // cap retake thấp
}
// src/app/api/exercises/route.ts — side effect, gọi pure function
const delta = calculateRankingDelta(attempt);
await prisma.$transaction([/* update ranking by delta */]);
```

## Quan hệ với skill khác

- **Complement `architect-mode`** (skill gốc): architect-mode nói *dependency direction giữa các layer* (UI→Controller→Service→Repo), skill này nói *chất lượng code bên trong 1 file*. Dùng song song: đọc architect-mode trước để biết layer nào, rồi maintainable-code trong từng file.
- **Không thay thế `testing`** (skill gốc): testing cho *kỹ thuật viết test* (mock Prisma, fixture), skill này chỉ yêu cầu testability. Khi viết test thật, đọc thêm `testing`.
- **Không thay thế `project-quality-gate`**: quality-gate cho *validation cuối* (build/typecheck pass), skill này cho *cách viết* để validation dễ pass.
