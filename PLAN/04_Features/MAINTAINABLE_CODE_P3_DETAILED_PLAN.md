# Kế Hoạch Chi Tiết — Priority 3: Refactor An Toàn

## Tổng quan

Priority 3 gồm 2 task lớn nhất, rủi ro cao nhất trong toàn bộ kế hoạch refactor.
Tài liệu này phân tích **đầy đủ dependencies, risks, và biện pháp nghiệp vụ** trước khi thực hiện.

**Nguyên tắc bất di bất dịch:**
1. Không xóa/chuyển bất kỳ export nào mà file khác đang import
2. Mỗi bước refactor phải `tsc --noEmit` + pass 38 tests
3. Snapshot behavior TRƯỚC khi thay đổi (test hoặc ghi chú)

---

## Task 3.1: Tests cho `claimMilestone()` (milestones.ts)

### 3.1.1 — Phân tích target function

**File:** `src/lib/gamification/milestones.ts` (152 dòng)
**Hàm cần test:** `claimMilestone(userId, milestoneId)` — dòng 98-151

**Luồng logic (5 bước tuần tự):**

```
Bước 1: findUnique(MilestoneReward, milestoneId)
        → null → return { error: "MILESTONE_NOT_FOUND" }

Bước 2: findUnique(User, userId) select { level, gems }
        → null → return { error: "USER_NOT_FOUND" }

Bước 3: So sánh user.level < milestone.level
        → true → return { error: "LEVEL_NOT_REACHED" }

Bước 4: findUnique(UserMilestone, { userId_milestoneId })
        → tồn tại → return { error: "ALREADY_CLAIMED" }

Bước 5: $transaction:
        a. create(UserMilestone)
        b. update(User, gems += gemsReward)
        c. Nếu badgeName có:
           - findFirst(Badge, { name: badgeName })
           - Nếu tìm thấy → upsert(UserBadge)
        → return { gems, badgeName }
```

### 3.1.2 — Dependencies cần mock

| Dependency | Loại | Cách mock |
|------------|------|-----------|
| `prisma.milestoneReward.findUnique` | async DB call | Stub function trả về mock data |
| `prisma.user.findUnique` | async DB call | Stub function |
| `prisma.userMilestone.findUnique` | async DB call | Stub function |
| `prisma.$transaction` | async DB call | Stub function chạy callback với mock tx |
| `tx.userMilestone.create` | trong transaction | Mock no-op |
| `tx.user.update` | trong transaction | Mock ghi nhận `increment` value |
| `tx.badge.findFirst` | trong transaction | Stub trả badge mock hoặc null |
| `tx.userBadge.upsert` | trong transaction | Mock no-op |

### 3.1.3 — Biện pháp nghiệp vụ: Extract-and-Test

**Vấn đề:** Project dùng `node:test` (không có vitest/jest), không có mocking framework.
Các test hiện tại chỉ test **pure functions** (gamification.test.ts, mastery.test.ts, scoring.test.ts).

**Giải pháp: Tách validation logic thành pure function**

```ts
// TÁCH RA: pure validation (dễ test, không cần DB)
export type ClaimValidation = 
  | { ok: true }
  | { ok: false; error: "MILESTONE_NOT_FOUND" | "USER_NOT_FOUND" | "LEVEL_NOT_REACHED" | "ALREADY_CLAIMED" };

export function validateClaim(
  milestone: { level: number } | null,
  user: { level: number } | null,
  alreadyClaimed: boolean,
): ClaimValidation {
  if (!milestone) return { ok: false, error: "MILESTONE_NOT_FOUND" };
  if (!user)      return { ok: false, error: "USER_NOT_FOUND" };
  if (user.level < milestone.level) return { ok: false, error: "LEVEL_NOT_REACHED" };
  if (alreadyClaimed) return { ok: false, error: "ALREADY_CLAIMED" };
  return { ok: true };
}
```

**Lý do tách:**
- `validateClaim` là **pure function** — test trực tiếp với `node:test` không cần mock
- `claimMilestone` gọi `validateClaim` cho validation, chỉ giữ DB operations
- Tuân thủ **Single Responsibility**: validation logic ≠ DB orchestration

### 3.1.4 — Test cases (12 tests dự kiến)

```
validateClaim tests (pure, no mock):
  1. milestone=null → MILESTONE_NOT_FOUND
  2. user=null → USER_NOT_FOUND
  3. user.level < milestone.level → LEVEL_NOT_REACHED
  4. user.level = milestone.level - 1 → LEVEL_NOT_REACHED (boundary)
  5. user.level = milestone.level → ok (boundary)
  6. user.level > milestone.level → ok
  7. alreadyClaimed=true → ALREADY_CLAIMED
  8. alreadyClaimed=false, đủ điều kiện → ok

claimMilestone integration tests (Prisma mock stub):
  9.  Milestone không tồn tại → error MILESTONE_NOT_FOUND
  10. User level quá thấp → error LEVEL_NOT_REACHED
  11. Đã claim rồi → error ALREADY_CLAIMED
  12. Happy path → gems tăng, badge awarded (nếu có badgeName)
```

### 3.1.5 — Rủi ro & biện pháp phòng ngừa

| Rủi ro | Xác suất | Biện pháp |
|--------|----------|-----------|
| Tách `validateClaim` làm thay đổi behavior | Rất thấp | Logic giống hệt, chỉ extract |
| Prisma mock stub không chính xác | Thấp | Chỉ mock return values, test logic flow |
| Test 12 (happy path) phức tạp vì transaction | Trung bình | Mock `$transaction` chạy callback synchronous |

### 3.1.6 — Thứ tự thực hiện

1. Thêm `validateClaim()` pure function vào `milestones.ts`
2. Sửa `claimMilestone()` gọi `validateClaim()` thay vì inline checks
3. `tsc --noEmit` → verify
4. Tạo `milestones.test.ts` với 8 tests cho `validateClaim`
5. Chạy test → verify pass
6. Thêm 4 integration tests với Prisma mock stub
7. Chạy toàn bộ 42+ tests → verify

---

## Task 3.2: Tách ExerciseEngineClient (695 dòng) thành hooks + sub-components

### 3.2.1 — Dependency Graph đầy đủ

#### A. Files IMPORT FROM ExerciseEngineClient (10 files — CRITICAL)

```
ExerciseEngineClient.tsx
    ├── page.tsx                          → default export: ExerciseEngineClient
    ├── ExerciseSummaryScreen.tsx         → parseWordPrompt, ExerciseData, ExerciseQuestion,
    │                                       IncorrectQuestion, SubmitResult
    ├── ListenFeedbackSheet.tsx           → parseWordPrompt, ExerciseQuestion
    ├── SpeakWordQuestion.tsx             → parseWordPrompt, ExerciseQuestion
    ├── SpeakSentenceQuestion.tsx         → parseWordPrompt, ExerciseQuestion
    ├── SpeakMinimalPairsQuestion.tsx     → ExerciseQuestion (type only)
    ├── TapStressQuestion.tsx             → ExerciseQuestion (type only)
    ├── ChooseWeakQuestion.tsx            → ExerciseQuestion (type only)
    ├── ChooseLinkingQuestion.tsx         → ExerciseQuestion (type only)
    └── ChooseAssimilationQuestion.tsx    → ExerciseQuestion (type only)
```

**Exports PHẢI giữ nguyên (backward compatibility):**
- `export default ExerciseEngineClient` — page.tsx dùng
- `export type ExerciseQuestion` — 8 components dùng
- `export type ExerciseData` — ExerciseSummaryScreen dùng
- `export type SubmitResult` — ExerciseSummaryScreen dùng
- `export type IncorrectQuestion` — ExerciseSummaryScreen dùng
- `export function parseWordPrompt` — 3 components dùng
- `export type WordPrompt` — **KHÔNG export** (chỉ dùng nội bộ)
- `export function normalizeAnswer` — **KHÔNG export** (chỉ dùng nội bộ)

#### B. Dependencies ExerciseEngineClient IMPORT (14 sources)

```
ExerciseEngineClient.tsx imports:
    ├── React: useEffect, useMemo, useRef, useState
    ├── next/navigation: useRouter
    ├── @/components/ui: Button, Card, ProgressBar
    ├── @/lib/sfx: playSfx, useSfxMuted
    ├── @/hooks/useComboStreak: useComboStreak
    ├── @/components/gamification/effects/RewardEventContext: useRewardEvents
    └── Local sub-components (7):
        ├── ListenFeedbackSheet
        ├── ExerciseSummaryScreen
        ├── SpeakWordQuestion
        ├── SpeakSentenceQuestion
        ├── SpeakMinimalPairsQuestion
        ├── TapStressQuestion
        ├── ChooseWeakQuestion
        ├── ChooseLinkingQuestion
        └── ChooseAssimilationQuestion
```

#### C. Quan hệ State ↔ Handlers (coupling analysis)

```
STATE (14 biến):
  currentIndex ←──────── handleNextListen, handleNextVoice
  score ←──────────────── handleAnswerListen, handleNextVoice
  incorrectQuestions ←─── addIncorrectQuestion (gọi bởi handleAnswerListen, handleNextVoice)
  answers ←────────────── recordAnswer
  answersRef ←─────────── recordAnswer, submitExercise, finishExercise
  submitStatus ←───────── submitExercise
  submitResult ←───────── submitExercise
  submitError ←────────── submitExercise
  isAnswered ←─────────── handleAnswerListen, handleNextListen
  isCorrect ←──────────── handleAnswerListen
  selectedAnswer ←─────── handleAnswerListen, handleNextListen
  isFinished ←─────────── finishExercise
  muted ←──────────────── header button
  startedAt ←──────────── submitExercise

HANDLERS (6):
  recordAnswer(answer) → answers, answersRef
  submitExercise(answers) → submitStatus, submitResult, submitError, emit rewards
  finishExercise(answers) → isFinished, combo.reset, calls submitExercise
  addIncorrectQuestion(selected) → incorrectQuestions
  handleAnswerListen(correct, opt, optId, textOverride) → isAnswered, isCorrect, selectedAnswer, score, combo, sfx, recordAnswer
  handleNextVoice(correct, transcript) → recordAnswer, score, combo, sfx, currentIndex, finishExercise
  handleNextListen() → currentIndex, isAnswered, selectedAnswer, finishExercise
```

**Nhận xét coupling:**
- `recordAnswer` được dùng bởi cả `handleAnswerListen` và `handleNextVoice` → **shared state**
- `submitExercise` phụ thuộc `exercise.id`, `startedAt`, `maxComboRef` → **closure variables**
- `finishExercise` phụ thuộc `answersRef.current` nếu không传 finalAnswers → **default param**
- `handleAnswerListen` và `handleNextVoice` có **shared pattern**: score update + combo + sfx + incorrect tracking
- `combo` hook (useComboStreak) được dùng ở 4 chỗ: handleAnswerListen, handleNextVoice, finishExercise, render

### 3.2.2 — Kế hoạch tách (5 bước, thực hiện TUẦN TỰ)

---

#### BƯỚC 1: Extract Types → `types.ts`

**File mới:** `src/app/exercises/[id]/types.ts` (~40 dòng)

**Nội dung extract:**
```ts
export type ExerciseQuestionOption = { id: string; content: string };
export type ExerciseQuestion = {
  id: string; name: string | null; content: string;
  type: string; answer: string; score: number;
  acceptedAnswers?: string[] | null;
  options: ExerciseQuestionOption[];
};
export type ExerciseData = {
  id: string; name: string; description: string | null;
  questions: ExerciseQuestion[];
};
export type SubmitAnswer = {
  questionId: string; selectedOptionId?: string | null;
  selectedText?: string | null; transcript?: string | null;
  audioUrl?: string | null; timeSpent?: number | null;
};
export type SubmitResult = { ... }; // giữ nguyên 28 dòng
export type IncorrectQuestion = { question: ExerciseQuestion; selected: string; correct: string };
export type EngineUnlocks = { unlockedSlowAudio: boolean; unlockedIpaReveal: boolean; userLevel?: number };
```

**Tác động lên files khác:**
- `ExerciseEngineClient.tsx` → xóa type definitions, thêm `import type { ... } from "./types"`
- `ExerciseEngineClient.tsx` → **re-export** types: `export type { ExerciseQuestion, ExerciseData, SubmitResult, IncorrectQuestion } from "./types"`
  - Để 8 file đang import KHÔNG cần thay đổi import path
- 10 files consumers → **KHÔNG cần sửa** nhờ re-export

**Rủi ro:** Rất thấp — pure type extraction, zero runtime impact.
**Verify:** `tsc --noEmit`

---

#### BƯỚC 2: Extract `parseWordPrompt` + `normalizeAnswer` → `parse-word-prompt.ts`

**File mới:** `src/app/exercises/[id]/parse-word-prompt.ts` (~50 dòng)

**Nội dung extract:**
```ts
import type { WordPrompt } from "./types"; // WordPrompt giữ internal (không export từ types.ts)

// Định nghĩa WordPrompt ở đây (chỉ file này dùng)
type WordPrompt = { word: string; ipa?: string; audioUrl?: string; ... };

export function normalizeAnswer(value: string): string { ... }
export function parseWordPrompt(content: string): WordPrompt { ... }
export type { WordPrompt }; // export cho ai cần
```

**Tác động:**
- `ExerciseEngineClient.tsx` → xóa 2 functions, thêm `import { parseWordPrompt, normalizeAnswer } from "./parse-word-prompt"`
- Re-export: `export { parseWordPrompt } from "./parse-word-prompt"` (ListenFeedbackSheet, SpeakWord/SentenceQuestion đang import từ engine)
- **3 files** import `parseWordPrompt` → KHÔNG cần sửa nhờ re-export

**Rủi ro:** Rất thấp.
**Verify:** `tsc --noEmit`

---

#### BƯỚC 3: Extract `AudioButton` + `ListenChooseQuestion` + `PraisePopup` → `components/`

**3 file mới trong** `src/app/exercises/[id]/components/`:

| File | Dòng | Nội dung |
|------|------|----------|
| `AudioButton.tsx` | ~45 | Audio playback button (standalone, không phụ thuộc engine state) |
| `ListenChooseQuestion.tsx` | ~120 | Question type 1 renderer (phụ thuộc AudioButton + parseWordPrompt) |
| `PraisePopup.tsx` | ~15 | Praise popup (standalone) |

**Tác động:**
- `ExerciseEngineClient.tsx` → xóa 3 inline components, import từ `./components/`
- Consumers → KHÔNG bị ảnh hưởng (3 component này là internal, không ai import)

**Rủi ro:** Rất thấp — chỉ di chuyển code, không thay đổi logic.
**Verify:** `tsc --noEmit` + chạy app thủ công (ListenChoose question type)

---

#### BƯỚC 4: Extract `useExerciseEngine` hook (core logic)

**File mới:** `src/app/exercises/[id]/useExerciseEngine.ts` (~180 dòng)

**Đây là bước QUAN TRỌNG NHẤT và RỦI RO CAO NHẤT.**

Hook encapsulate TOÀN BỘ state + handlers:

```ts
export function useExerciseEngine(exercise: ExerciseData, unlocks: EngineUnlocks) {
  // === State ===
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>([]);
  const [submitStatus, setSubmitStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // === Hooks ===
  const combo = useComboStreak();
  const { emit } = useRewardEvents();
  const [muted, setMuted] = useSfxMuted();

  // === Refs ===
  const previousLevelRef = useRef(unlocks.userLevel ?? 0);
  const [startedAt] = useState(() => new Date().toISOString());
  const answersRef = useRef<SubmitAnswer[]>([]);
  const maxComboRef = useRef(0);

  // === Derived ===
  const currentQuestion = exercise.questions[currentIndex];
  const progressPercent = ...;
  const currentHint = ...;

  // === Handlers (recordAnswer, submitExercise, finishExercise, etc.) ===
  // ... giữ nguyên logic, chỉ di chuyển

  return {
    // State
    currentIndex, score, incorrectQuestions, submitStatus, submitResult,
    submitError, isAnswered, isCorrect, selectedAnswer, isFinished,
    muted, setMuted,
    // Derived
    currentQuestion, progressPercent, currentHint,
    // Handlers
    handleAnswerListen, handleNextVoice, handleNextListen,
    // Combo (cho render 🔥)
    combo,
  };
}
```

**Return type contract:**
```ts
type UseExerciseEngineReturn = {
  currentIndex: number;
  score: number;
  // ... đầy đủ types
};
```

**Tác động:**
- `ExerciseEngineClient.tsx` giảm từ ~350 dòng logic → ~150 dòng (chỉ render + gọi hook)
- Consumers → KHÔNG bị ảnh hưởng

**Rủi ro & Biện pháp phòng ngừa:**

| Rủi ro | Mức độ | Biện pháp |
|--------|--------|-----------|
| Closure variables (exercise, unlocks) không transfer đúng | Trung bình | Truyền explicit params vào hook |
| `useRewardEvents()` throw nếu không trong Provider | Thấp | Hook vẫn gọi trong component tree, Provider wrap ở layout |
| `useRouter()` trong hook → sai context | Thấp | KHÔNG đưa router vào hook; giữ `router.push` ở component |
| Refs (answersRef, maxComboRef) mất reference | Rất thấp | useRef trong hook hoạt động bình thường |
| `submitExercise` closure over `startedAt` | Rất thấp | `startedAt` là state trong hook |
| `finishExercise` default param `answersRef.current` | Rất thấp | Giữ nguyên pattern trong hook |

**Lý do KHÔNG tách thành 2 hooks (submit + navigation):**
- `recordAnswer` là shared state giữa submit và navigation
- `handleAnswerListen` và `handleNextVoice` vừa update navigation vừa update submit data
- Tách 2 hooks → phải share state qua params → phức tạp hơn gộp 1 hook
- **KISS principle**: 1 hook ~180 dòng vẫn dễ đọc hơn 2 hooks phải coordinate

---

#### BƯỚC 5: Extract `QuestionRenderer` component (optional)

**File mới:** `src/app/exercises/[id]/components/QuestionRenderer.tsx` (~80 dòng)

```tsx
type QuestionRendererProps = {
  question: ExerciseQuestion;
  unlocks: EngineUnlocks;
  isAnswered: boolean;
  selectedAnswer: string | null;
  onAnswerListen: (...) => void;
  onNextVoice: (...) => void;
};

export function QuestionRenderer({ question, unlocks, ... }: QuestionRendererProps) {
  // Switch 7 question types → render đúng component
}
```

**Tác động:**
- `ExerciseEngineClient.tsx` giảm thêm ~60 dòng JSX conditional
- Consumers → KHÔNG bị ảnh hưởng

**Rủi ro:** Thấp — chỉ di chuyển JSX, không thay đổi logic.

**Đánh giá optional:**
- Nếu Bước 4 đã giảm engine xuống ~150 dòng → QuestionRenderer chỉ tiết kiệm thêm 60 dòng
- File còn ~90 dòng (layout + header + footer) → rất clean
- **Recommendation: NÊN làm** để component hoàn toàn chỉ lo orchestration + layout

---

### 3.2.3 — Tổng kết sau refactor

| File | Trước | Sau | Thay đổi |
|------|-------|-----|----------|
| `ExerciseEngineClient.tsx` | 695 dòng | ~90 dòng | **-87%** |
| `types.ts` (mới) | — | ~40 dòng | Types |
| `parse-word-prompt.ts` (mới) | — | ~50 dòng | Pure functions |
| `useExerciseEngine.ts` (mới) | — | ~180 dòng | Core hook |
| `components/AudioButton.tsx` (mới) | — | ~45 dòng | UI component |
| `components/ListenChooseQuestion.tsx` (mới) | — | ~120 dòng | Question renderer |
| `components/PraisePopup.tsx` (mới) | — | ~15 dòng | UI component |
| `components/QuestionRenderer.tsx` (mới) | — | ~80 dòng | Type switch |

**Tổng dòng sau refactor:** ~620 dòng (thêm ~75 dòng overhead types/imports)
**Giá trị:** Mỗi file 1 responsibility, dễ test, dễ sửa, dễ tìm code.

### 3.2.4 — Ma trận backward compatibility

**10 files consumers KHÔNG CẦN SỬA** nếu giữ re-exports:

```ts
// ExerciseEngineClient.tsx — re-export facade
export type { ExerciseQuestion, ExerciseData, SubmitResult, IncorrectQuestion } from "./types";
export { parseWordPrompt } from "./parse-word-prompt";
export type { WordPrompt } from "./parse-word-prompt";
export default function ExerciseEngineClient(...) { ... }
```

| Consumer file | Import gì | Vẫn hoạt động? |
|----------------|-----------|----------------|
| `page.tsx` | `ExerciseEngineClient` (default) | ✓ |
| `ExerciseSummaryScreen.tsx` | `parseWordPrompt, ExerciseData, ExerciseQuestion, IncorrectQuestion, SubmitResult` | ✓ (re-export) |
| `ListenFeedbackSheet.tsx` | `parseWordPrompt, ExerciseQuestion` | ✓ (re-export) |
| `SpeakWordQuestion.tsx` | `parseWordPrompt, ExerciseQuestion` | ✓ (re-export) |
| `SpeakSentenceQuestion.tsx` | `parseWordPrompt, ExerciseQuestion` | ✓ (re-export) |
| `SpeakMinimalPairsQuestion.tsx` | `ExerciseQuestion` | ✓ (re-export) |
| `TapStressQuestion.tsx` | `ExerciseQuestion` | ✓ (re-export) |
| `ChooseWeakQuestion.tsx` | `ExerciseQuestion` | ✓ (re-export) |
| `ChooseLinkingQuestion.tsx` | `ExerciseQuestion` | ✓ (re-export) |
| `ChooseAssimilationQuestion.tsx` | `ExerciseQuestion` | ✓ (re-export) |

### 3.2.5 — Checklist verify sau MỖI bước

```bash
# 1. TypeScript clean
node node_modules\typescript\bin\tsc --noEmit

# 2. All tests pass
node --import tsx --test src\lib\__tests__\*.test.ts

# 3. Dev server chạy (optional, nếu muốn verify UI)
npm run dev
# → Truy cập /exercises/[id] → làm 1 bài listen-choose + 1 bài speak → verify:
#   - Audio phát được
#   - Chọn đáp án → feedback sheet hiện
#   - Submit → summary screen hiện với XP/rewards
#   - Combo 🔥 hiện khi đúng liên tiếp
#   - Mute button hoạt động
```

---

## Thứ tự thực hiện TỔNG THỂ

```
Task 3.1: Milestones tests
  ├── 3.1a: Extract validateClaim() pure function
  ├── 3.1b: Sửa claimMilestone() gọi validateClaim()
  ├── 3.1c: tsc --noEmit
  ├── 3.1d: Tạo milestones.test.ts (8 pure tests)
  ├── 3.1e: Chạy tests
  ├── 3.1f: Thêm 4 integration tests (Prisma mock stub)
  └── 3.1g: Chạy toàn bộ tests

Task 3.2: ExerciseEngineClient decomposition
  ├── 3.2a: Extract types.ts
  ├── 3.2b: tsc --noEmit + tests
  ├── 3.2c: Extract parse-word-prompt.ts
  ├── 3.2d: tsc --noEmit + tests
  ├── 3.2e: Extract AudioButton + ListenChooseQuestion + PraisePopup
  ├── 3.2f: tsc --noEmit + tests
  ├── 3.2g: Extract useExerciseEngine hook (BƯỚC RỦI RO CAO NHẤT)
  ├── 3.2h: tsc --noEmit + tests
  ├── 3.2i: Extract QuestionRenderer
  ├── 3.2j: tsc --noEmit + tests
  └── 3.2k: Final verification — all 42+ tests pass
```

**Tổng thời gian ước tính:** 2-3 giờ (3.1: ~30 phút, 3.2: ~1.5-2.5 giờ)
