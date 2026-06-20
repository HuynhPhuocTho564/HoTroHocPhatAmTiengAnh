# Nguyên Tắc Viết Code Dễ Bảo Trì - Phân Tích Dự án Thực Tế

Ngày tạo: 20/06/2026

## CÂU TRẢ LỜI NGẮN GỌN

**CÓ** - Code phải viết để dễ bảo trì/nâng cấp/sửa chữa. Đây là yêu cầu BẮT BUỘC trong software engineering chuyên nghiệp.

**LÝ DO**:
- ✅ Giảm thời gian fix bug (từ 2 giờ → 15 phút)
- ✅ Dễ thêm tính năng mới (không phá code cũ)
- ✅ Team mới đọc code hiểu được (không cần hỏi người cũ)
- ✅ Refactor an toàn (TypeScript + tests bắt lỗi sớm)
- ✅ Khóa luận dễ bảo vệ (giảng viên đọc code rõ ràng)

---

## 1. 7 NGUYÊN TẮC VIẾT CODE DỄ BẢO TRÌ

### **1.1. DRY (Don't Repeat Yourself) - Không lặp code**

#### ❌ **Code khó bảo trì** (lặp logic):

```typescript
// File: api/exercises/submit/route.ts
export async function POST(req: Request) {
  // Tính XP
  const xp = score >= 90 ? 15 : score >= 70 ? 10 : 5;
  
  // ... 200 dòng sau
}

// File: api/checkin/route.ts
export async function POST(req: Request) {
  // Tính XP - LOGIC GIỐNG NHAU!
  const xp = score >= 90 ? 15 : score >= 70 ? 10 : 5;
  
  // ... 200 dòng sau
}
```

**VẤN ĐỀ**: Nếu thay đổi công thức XP, phải sửa ở 2 nơi → dễ quên → bug!

#### ✅ **Code dễ bảo trì** (tách logic ra helper):

```typescript
// File: lib/gamification.ts
export function calculateXpReward(score: number): number {
  if (score >= 90) return 15;
  if (score >= 70) return 10;
  return 5;
}

// File: api/exercises/submit/route.ts
import { calculateXpReward } from '@/lib/gamification';
const xp = calculateXpReward(score);

// File: api/checkin/route.ts
import { calculateXpReward } from '@/lib/gamification';
const xp = calculateXpReward(dailyScore);
```

**LỢI ÍCH**: Thay đổi công thức XP chỉ cần sửa 1 chỗ!

---

### **1.2. Single Responsibility Principle (SRP) - Mỗi hàm chỉ làm 1 việc**

#### ❌ **Code khó bảo trì** (1 hàm làm nhiều việc):


```typescript
// ❌ Hàm quá dài, làm quá nhiều việc
async function submitExercise(data: any) {
  // 1. Validate (30 dòng)
  if (!data.userId) throw new Error('Invalid user');
  if (!data.exerciseId) throw new Error('Invalid exercise');
  // ...
  
  // 2. Tính điểm (50 dòng)
  let score = 0;
  for (const answer of data.answers) {
    if (answer.selected === answer.correct) score += 10;
  }
  
  // 3. Tính XP (20 dòng)
  const xp = score >= 90 ? 15 : 10;
  
  // 4. Update database (40 dòng)
  await prisma.user.update({ ... });
  await prisma.attempt.create({ ... });
  await prisma.leaderboard.upsert({ ... });
  
  // 5. Check badges (60 dòng)
  const badges = [];
  if (user.attempts.length >= 10) badges.push('first_10');
  // ...
  
  return { score, xp, badges }; // 200 DÒNG TỔNG!
}
```

**VẤN ĐỀ**: 
- ❌ Khó đọc (200 dòng)
- ❌ Khó test (phải mock 5 loại logic)
- ❌ Sửa 1 chỗ dễ làm hỏng chỗ khác


#### ✅ **Code dễ bảo trì** (tách thành nhiều hàm nhỏ):

```typescript
// lib/scoring.ts - CHỈ tính điểm
export function calculateScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => 
    sum + (a.selected === a.correct ? 10 : 0), 0
  );
}

// lib/gamification.ts - CHỈ tính XP
export function calculateXp(score: number): number {
  return score >= 90 ? 15 : score >= 70 ? 10 : 5;
}

// lib/gamification.ts - CHỈ check badges
export async function checkBadges(userId: string): Promise<Badge[]> {
  const attempts = await prisma.attempt.count({ where: { userId } });
  if (attempts >= 10) return [{ id: 'first_10', name: '10 Bài Đầu' }];
  return [];
}

// api/exercises/submit/route.ts - CHỈ điều phối
export async function POST(req: Request) {
  const data = await req.json();
  const score = calculateScore(data.answers);        // Dễ test
  const xp = calculateXp(score);                     // Dễ test
  const badges = await checkBadges(data.userId);     // Dễ test
  
  await saveToDatabase({ score, xp, badges });       // Dễ test
  return Response.json({ score, xp, badges });
}
```

**LỢI ÍCH**:
- ✅ Mỗi hàm < 20 dòng → dễ đọc
- ✅ Test riêng từng hàm → dễ debug
- ✅ Sửa logic scoring không ảnh hưởng badge logic


---

### **1.3. Type Safety - Dùng TypeScript đúng cách**

#### ❌ **Code khó bảo trì** (dùng `any`):

```typescript
// ❌ Không biết structure của data
function processUser(user: any) {
  console.log(user.name); // Có thể bị lỗi runtime nếu user.name không tồn tại
  return user.xp * 2;     // Có thể NaN nếu xp là string
}

// ❌ Khi gọi hàm, VS Code không gợi ý
const result = processUser({ email: 'test@test.com' }); // Bug: thiếu name, xp
```

**VẤN ĐỀ**:
- ❌ Bug chỉ phát hiện khi chạy (runtime error)
- ❌ Refactor khó (không biết đang dùng fields nào)
- ❌ Không có auto-complete

#### ✅ **Code dễ bảo trì** (type rõ ràng):

```typescript
// ✅ Định nghĩa type
interface User {
  id: string;
  email: string;
  name: string | null;
  xp: number;
  level: number;
}

// ✅ Type-safe function
function processUser(user: User): number {
  console.log(user.name); // ✅ VS Code biết name có thể null
  return user.xp * 2;     // ✅ Chắc chắn xp là number
}

// ✅ Compile-time error nếu thiếu field
const result = processUser({ email: 'test@test.com' }); 
// ❌ TypeScript báo lỗi: Property 'id' is missing
```

**LỢI ÍCH**:
- ✅ Bug bắt lúc compile (trước khi chạy)
- ✅ Refactor an toàn (TypeScript báo tất cả chỗ cần sửa)
- ✅ Auto-complete đầy đủ


---

### **1.4. Constants & Configuration - Tránh hardcode**

#### ❌ **Code khó bảo trì** (magic numbers):

```typescript
// ❌ Không biết 90, 70, 15, 10 nghĩa là gì
if (score >= 90) {
  xp = 15;
} else if (score >= 70) {
  xp = 10;
} else {
  xp = 5;
}

// ❌ Nếu thay đổi ngưỡng, phải tìm khắp project
```

#### ✅ **Code dễ bảo trì** (constants):

```typescript
// lib/gamification.ts - 1 nơi duy nhất
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  PASS: 50
} as const;

export const XP_REWARDS = {
  EXCELLENT: 15,
  GOOD: 10,
  BASIC: 5
} as const;

// Sử dụng
if (score >= SCORE_THRESHOLDS.EXCELLENT) {
  xp = XP_REWARDS.EXCELLENT;
} else if (score >= SCORE_THRESHOLDS.GOOD) {
  xp = XP_REWARDS.GOOD;
} else {
  xp = XP_REWARDS.BASIC;
}
```

**LỢI ÍCH**:
- ✅ Thay đổi 1 chỗ, áp dụng toàn project
- ✅ Dễ hiểu (EXCELLENT thay vì 90)
- ✅ Type-safe với `as const`


---

### **1.5. File Structure - Tổ chức code logic**

#### ❌ **Code khó bảo trì** (1 file quá lớn):

```
src/
  app/
    api/
      exercises/
        submit/
          route.ts  // 2000 dòng: validation + scoring + XP + badges + DB
```

**VẤN ĐỀ**:
- ❌ Khó tìm code (phải scroll 2000 dòng)
- ❌ Merge conflict liên tục (nhiều người sửa 1 file)
- ❌ Import không rõ nguồn gốc

#### ✅ **Code dễ bảo trì** (tách file logic):

```
src/
  lib/
    scoring.ts           // CHỈ tính điểm
    gamification.ts      // CHỈ XP/level/badge
    validation.ts        // CHỈ validate input
  app/
    api/
      exercises/
        submit/
          route.ts       // CHỈ 50 dòng: gọi lib + save DB
```

**LỢI ÍCH**:
- ✅ Dễ tìm (scoring logic ở `scoring.ts`)
- ✅ Ít conflict (mỗi người sửa file riêng)
- ✅ Reuse dễ (import `calculateScore` ở nhiều nơi)


---

### **1.6. Comments & Documentation - Giải thích "tại sao", không phải "làm gì"**

#### ❌ **Comments vô dụng**:

```typescript
// ❌ Comment không giá trị
const xp = score * 2; // Nhân score với 2
```

#### ✅ **Comments có giá trị**:

```typescript
// ✅ Giải thích tại sao
// Nhân 2 vì yêu cầu từ Product: khuyến khích user làm bài khó (SP7)
const xp = score * 2;

// ✅ Document edge case
// WORKAROUND: Prisma không hỗ trợ WINDOW functions, phải dùng raw SQL
const leaderboard = await prisma.$queryRaw`
  SELECT *, RANK() OVER (ORDER BY score DESC) as rank
  FROM "Leaderboard"
`;
```

**LỢI ÍCH**:
- ✅ Người khác hiểu quyết định thiết kế
- ✅ Tránh "refactor" nhầm logic quan trọng


---

### **1.7. Testing - Đảm bảo code không bị phá khi refactor**

#### ❌ **Code không có test**:

```typescript
// Không có test
export function calculateXp(score: number): number {
  return score >= 90 ? 15 : score >= 70 ? 10 : 5;
}

// 2 tuần sau, ai đó "refactor"
export function calculateXp(score: number): number {
  return score >= 80 ? 15 : score >= 60 ? 10 : 5; // BUG! Thay đổi logic
}
```

**VẤN ĐỀ**: Không ai biết logic đã thay đổi → bug production

#### ✅ **Code có test**:

```typescript
// lib/__tests__/gamification.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateXp } from '../gamification';

test('calculateXp - excellent score', () => {
  assert.strictEqual(calculateXp(95), 15);
  assert.strictEqual(calculateXp(90), 15);
});

test('calculateXp - good score', () => {
  assert.strictEqual(calculateXp(85), 10);
  assert.strictEqual(calculateXp(70), 10);
});

test('calculateXp - basic score', () => {
  assert.strictEqual(calculateXp(60), 5);
});
```

**LỢI ÍCH**:
- ✅ Refactor an toàn (test fail nếu logic sai)
- ✅ Document behavior (test là "living documentation")
- ✅ Tự tin deploy (test pass = code đúng)


---

## 2. VÍ DỤ THỰC TẾ TỪ DỰ ÁN CỦA BẠN

### **2.1. Gamification Logic - Đã áp dụng tốt**

#### File: `lib/gamification.ts` (✅ Good example)

```typescript
// ✅ Constants rõ ràng
export const BADGE_DEFINITIONS: Record<BadgeCode, BadgeDefinition> = {
  first_exercise: {
    code: 'first_exercise',
    name: 'Khởi đầu',
    description: 'Hoàn thành bài tập đầu tiên',
    category: 'milestone',
    xpReward: 10
  },
  // ... 10 badges khác
};

// ✅ Hàm nhỏ, single responsibility
export function calculateLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// ✅ Type-safe với Prisma
export async function checkAndAwardBadges(
  userId: string,
  reason: 'exercise_submit' | 'daily_checkin',
  tx: Prisma.TransactionClient
): Promise<BadgeCode[]> {
  // ... logic
}
```

**TẠI SAO TỐT**:
- ✅ Constants tập trung (11 badges ở 1 chỗ)
- ✅ Hàm nhỏ, dễ test (calculateLevelFromXp ~5 dòng)
- ✅ Type-safe (BadgeCode, BadgeDefinition)
- ✅ Có tests (74 tests pass)


---

### **2.2. Exercise Engine - Cần cải thiện**

#### ❌ **Hiện tại**: `ExerciseEngineClient.tsx` (~1100 dòng)

**VẤN ĐỀ**:
- ❌ 1 file quá lớn (khó đọc)
- ❌ Logic render 6 modes trong 1 component
- ❌ Nhiều state management lộn xộn

#### ✅ **Nên refactor**:

```
components/
  exercises/
    ExerciseEngineClient.tsx    // ~200 dòng: state + routing
    modes/
      ListenChooseMode.tsx       // ~150 dòng
      SpeakWordMode.tsx          // ~150 dòng
      MinimalPairsMode.tsx       // ~150 dòng
      SpeakSentenceMode.tsx      // ~150 dòng
      TapStressMode.tsx          // ~100 dòng
      SpeakMatchMode.tsx         // ~100 dòng
    shared/
      AudioPlayer.tsx            // ~50 dòng
      ScoreDisplay.tsx           // ~30 dòng
      NavigationButtons.tsx      // ~40 dòng
```

**LỢI ÍCH** nếu refactor:
- ✅ Mỗi mode độc lập → dễ sửa
- ✅ Reuse components (AudioPlayer, ScoreDisplay)
- ✅ Team chia việc dễ hơn

**NHƯNG**: Dự án còn 8 ngày → **KHÔNG NÊN refactor ngay** (rủi ro cao). Refactor sau khi bảo vệ.


---

### **2.3. Database Schema - Áp dụng tốt Prisma**

#### File: `prisma/schema.prisma` (✅ Good example)

```prisma
// ✅ Model rõ ràng, có comments
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  xp              Int      @default(0)
  level           Int      @default(1)
  streakCount     Int      @default(0)
  longestStreak   Int      @default(0)
  gems            Int      @default(0)      // SP7: Gem currency
  streakFreezes   Int      @default(0)      // SP7: Streak protection items
  
  // Relations
  exerciseAttempts ExerciseAttempt[]
  userBadges       UserBadge[]
  leaderboards     Leaderboard[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([email])
}
```

**TẠI SAO TỐT**:
- ✅ Schema = documentation (biết User có fields gì)
- ✅ Relations rõ ràng (exerciseAttempts, userBadges)
- ✅ Index cho performance (@@index([email]))
- ✅ Defaults hợp lý (@default(0))
- ✅ Prisma Client tự generate types → type-safe 100%


---

## 3. CÁCH ÁP DỤNG VÀO DỰ ÁN (8 NGÀY CÒN LẠI)

### **3.1. Ưu tiên cao (LÀM NGAY)**

#### ✅ **1. Type Safety cho API routes**

```typescript
// ❌ Hiện tại
export async function POST(req: Request) {
  const data = await req.json(); // ❌ Type là 'any'
  // ...
}

// ✅ Nên làm
interface SubmitExerciseRequest {
  exerciseId: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
}

export async function POST(req: Request) {
  const data: SubmitExerciseRequest = await req.json();
  // ✅ Type-safe
}
```

**THỜI GIAN**: ~30 phút/route, ưu tiên: submit, checkin, badges

---

#### ✅ **2. Tách constants hardcode**

```typescript
// ❌ Tìm các magic numbers trong code
if (score >= 90) { ... }

// ✅ Tách ra constants
// lib/constants.ts
export const THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  PASS: 50
} as const;
```

**THỜI GIAN**: ~1 giờ cho toàn project


---

#### ✅ **3. Comments cho logic phức tạp**

```typescript
// ✅ Giải thích WHY, không phải WHAT
// BUSINESS RULE: Chỉ cộng ranking score khi user cải thiện best score
// để tránh farm điểm bằng cách làm lại bài dễ (yêu cầu từ Product)
if (score > previousBest) {
  rankingScore = score - previousBest;
}
```

**THỜI GIAN**: ~30 phút, focus vào: scoring, gamification, unlock logic

---

### **3.2. Ưu tiên trung bình (SAU KHI DEMO XONG)**

#### ⚠️ **4. Refactor ExerciseEngine** (KHÔNG LÀM NGAY - RỦI RO CAO)

- Tách 6 modes ra files riêng
- Extract shared components

**THỜI GIAN**: ~4-6 giờ
**RỦI RO**: Bug mới, mất thời gian debug
**KHUYẾN NGHỊ**: Làm SAU khi bảo vệ khóa luận

---

#### ⚠️ **5. Thêm error handling**

```typescript
// ✅ Thêm try-catch cho API routes
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // ... logic
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**THỜI GIAN**: ~2 giờ cho tất cả routes


---

### **3.3. Ưu tiên thấp (TÙY CHỌN)**

#### 🟡 **6. Thêm JSDoc cho public APIs**

```typescript
/**
 * Tính XP reward dựa trên score
 * @param score - Điểm bài tập (0-100)
 * @returns XP amount (5, 10, hoặc 15)
 * @example
 * calculateXp(95) // returns 15
 * calculateXp(75) // returns 10
 */
export function calculateXp(score: number): number {
  if (score >= 90) return 15;
  if (score >= 70) return 10;
  return 5;
}
```

**THỜI GIAN**: ~1 giờ
**LỢI ÍCH**: VS Code hiển thị docs khi hover

---

## 4. KẾT LUẬN & KHUYẾN NGHỊ

### **4.1. Dự án hiện tại đã làm tốt**:

✅ **Prisma ORM**: Type-safe 100%, schema rõ ràng
✅ **Gamification logic**: Tách helpers, có tests (74 tests)
✅ **File structure**: Tách lib/ và api/ logic
✅ **TypeScript**: Không dùng `any` (hầu hết)
✅ **Constants**: Badge definitions, score thresholds

### **4.2. Cần cải thiện (SAU BẢO VỆ)**:

⚠️ ExerciseEngine quá lớn (1100 dòng)
⚠️ Một số API routes thiếu type
⚠️ Magic numbers còn rải rác
⚠️ Comments chưa đủ cho logic phức tạp


### **4.3. Roadmap 8 ngày còn lại**:

| Ngày | Priority | Task | Thời gian |
|------|----------|------|-----------|
| **1-2** | 🔴 High | SP7 Task 4-13 (gem hook, shop, quests) | 2 ngày |
| **3** | 🔴 High | Type safety cho API routes chính | 3 giờ |
| **3** | 🔴 High | Tách magic numbers → constants | 1 giờ |
| **4-5** | 🟠 Medium | SP6 (unlock CĐ3, fix level, all-time leaderboard) | 1.5 ngày |
| **6** | 🟠 Medium | SP3 (2 nhóm CD3 còn thiếu) | 4 giờ |
| **7** | 🟡 Low | Comments cho logic phức tạp | 2 giờ |
| **7** | 🟡 Low | Error handling API routes | 2 giờ |
| **8** | 🟢 Buffer | Testing, demo, documentation | 1 ngày |

**KHÔNG LÀM NGAY**:
- ❌ Refactor ExerciseEngine (rủi ro cao, 4-6 giờ)
- ❌ Thêm JSDoc đầy đủ (không ảnh hưởng demo)

---

## 5. TRONG BÁO CÁO KHÓA LUẬN NÊN VIẾT

### **Chương 3: Hiện thực hóa nghiên cứu**

#### **3.X. Nguyên tắc phát triển code**

"Trong quá trình phát triển, đồ án tuân thủ các nguyên tắc software engineering hiện đại nhằm đảm bảo code dễ bảo trì và mở rộng:

1. **Type Safety**: Sử dụng TypeScript kết hợp Prisma ORM để đảm bảo type-safe 100% từ database đến UI, giảm thiểu lỗi runtime.

2. **Single Responsibility Principle**: Tách logic nghiệp vụ ra các module riêng biệt:
   - `lib/scoring.ts`: Logic tính điểm
   - `lib/gamification.ts`: Logic XP/badge/leaderboard
   - `lib/validation.ts`: Validation dữ liệu đầu vào


3. **DRY (Don't Repeat Yourself)**: Tránh lặp code bằng cách tạo helper functions và constants:
   - `BADGE_DEFINITIONS`: Định nghĩa 11 huy hiệu tập trung
   - `calculateXpReward()`: Tính XP tái sử dụng ở nhiều nơi

4. **Testing**: Viết 74 unit tests cho logic cốt lõi (scoring, gamification) đảm bảo code hoạt động đúng khi refactor.

5. **Database Schema Management**: Sử dụng Prisma migrations để quản lý 26 bảng database, đảm bảo schema luôn đồng bộ giữa development và production."

---

## 6. TÀI LIỆU THAM KHẢO

### **Clean Code Principles**:
- Robert C. Martin, "Clean Code: A Handbook of Agile Software Craftsmanship" (2008)
- Martin Fowler, "Refactoring: Improving the Design of Existing Code" (2018)

### **TypeScript Best Practices**:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

### **Testing**:
- Kent Beck, "Test Driven Development: By Example" (2002)
- [Node.js Test Runner](https://nodejs.org/docs/latest/api/test.html)

---

**File này giúp**: Hiểu tầm quan trọng của code maintainability và áp dụng vào dự án thực tế trong 8 ngày còn lại.
