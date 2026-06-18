---
name: testing
description: Use when writing, running, or debugging tests for Web_HoTroPhatAmEN. Covers unit tests, API route tests, scoring/gamification tests, and integration tests. Also use when setting up test infrastructure, adding test scripts, or investigating test failures.
---

# Testing

## Purpose

Guide testing practices for the pronunciation learning app. The project uses Node.js built-in test runner (`node:test`) with `tsx` for TypeScript. Tests are small, focused, and fast — prioritize coverage of business logic over UI snapshots.

## Required Context

- Read `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` to understand which phase is active.
- Read `PLAN/04_Features/SCORING_AND_LEADERBOARD_PLAN.md` when testing scoring logic.
- Read `PLAN/04_Features/BADGE_SYSTEM_PLAN.md` when testing badge logic.
- Pair with `project-quality-gate` for validation commands.
- Pair with `architect-mode` for code structure rules in test files.

---

## 1. Test Infrastructure

### Setup

- **Test runner**: Node.js built-in `node:test` module.
- **TypeScript**: `tsx` for on-the-fly compilation.
- **Test command**: `npm test` runs `tsx --test "src/**/*.test.ts"`.
- **Location**: All tests in `src/lib/__tests__/` (mirroring the source they test).
- **No external test frameworks** (no Jest, no Vitest). Keep dependencies minimal.

### File Naming

```
src/lib/__tests__/
├── scoring.test.ts              # Tests for src/lib/scoring.ts
├── gamification.test.ts         # Tests for src/lib/gamification.ts
├── auth-redirect.test.ts        # Tests for src/lib/auth-redirect.ts
├── period.test.ts               # Tests for src/lib/period.ts
├── normalize.test.ts            # Tests for src/lib/utils.ts (normalize)
├── lesson-catalog.test.ts       # Tests for prisma/lesson-catalog.ts
├── api/
│   ├── exercises-submit.test.ts # Tests for POST /api/exercises/submit
│   ├── checkin.test.ts          # Tests for POST/GET /api/checkin
│   └── leaderboard.test.ts      # Tests for GET /api/leaderboard
```

---

## 2. Testing Strategy by Layer

### 2.1 Unit Tests (Priority: HIGH)

Pure function tests — no database, no network, no framework.

**Must test:**

| Module | What to test | Key cases |
|--------|-------------|-----------|
| `scoring.ts` | `scoreQuestion()`, `calculateExerciseScore()` | MC correct/wrong, voice with accuracy 0/50/80/100, empty transcript, edge scores |
| `gamification.ts` | `calculateXP()`, `checkLevelUp()`, `calculateDailyBonus()`, `calculateRankingDelta()` | Zero score, perfect score, retake improvement, daily bonus tiers, streak calculations |
| `period.ts` | `getCurrentWeek()`, `getCurrentMonth()` | Week boundary (Sunday/Monday), month boundary, timezone handling |
| `utils.ts` | `normalize()` | Empty string, punctuation, extra spaces, mixed case, Unicode diacritics |
| `auth-redirect.ts` | `getSafeCallbackPath()`, `buildAuthHref()` | Open redirect prevention, relative paths, query params |

### 2.2 API Route Tests (Priority: MEDIUM)

Test API handlers with mocked dependencies.

**Pattern:**

```typescript
import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

// Mock Prisma
const mockPrismaTransaction = mock.fn(() => Promise.resolve({}));
const mockPrisma = {
  $transaction: mock.fn((fn) => fn(mockPrismaTransaction)),
  user: { findUnique: mock.fn(() => Promise.resolve({ id: "user-1", xp: 0, level: 1 })) },
  exerciseAttempt: { create: mock.fn(() => Promise.resolve({ id: "attempt-1" })) },
  // ... other models
};
```

**Must test:**

| Endpoint | Key cases |
|----------|-----------|
| `POST /api/exercises/submit` | Valid submission, missing userId, empty transcript, invalid exerciseId, transaction failure |
| `POST /api/checkin` | First check-in today, duplicate check-in, streak continuation, streak reset |
| `GET /api/leaderboard` | Weekly type, monthly type, empty leaderboard, user not in top 10 |
| `POST /api/badges/check` | Badge earned, badge not earned, badge already owned |

### 2.3 Integration / Seed Tests (Priority: LOW)

Validate seed data structure without hitting a real database.

```typescript
// Test catalog structure
import { TOPICS, SOUND_GROUPS } from "../../../prisma/lesson-catalog";

describe("Lesson Catalog", () => {
  it("should have exactly 4 topics", () => {
    assert.strictEqual(TOPICS.length, 4);
  });

  it("each topic should have correct number of sound groups", () => {
    assert.strictEqual(TOPICS[0].groups.length, 6);  // Monophthongs
    assert.strictEqual(TOPICS[1].groups.length, 4);  // Diphthongs
    assert.strictEqual(TOPICS[2].groups.length, 11); // Consonants
    assert.strictEqual(TOPICS[3].groups.length, 4);  // Hard pairs
  });

  it("no duplicate phonemes across sound groups", () => {
    // ... check for duplicates
  });
});
```

### 2.4 What NOT to Test

- UI component rendering (no React Testing Library setup — not worth the config cost for thesis deadline).
- CSS/styling.
- NextAuth internals.
- Prisma ORM behavior itself.
- Browser Web Speech API.

---

## 3. Test Writing Rules

### 3.1 Structure

Each test file follows this structure:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// 1. Import the module under test
import { calculateExerciseScore } from "../scoring";

// 2. Define test data fixtures at file level
const FIXTURE_MC_CORRECT = { /* ... */ };
const FIXTURE_VOICE_80 = { /* ... */ };

describe("calculateExerciseScore", () => {
  // 3. Group related cases
  describe("multiple choice questions", () => {
    it("returns base score for correct answer", () => {
      const result = calculateExerciseScore(FIXTURE_MC_CORRECT);
      assert.strictEqual(result.score, 5);
    });

    it("returns 0 for wrong answer", () => {
      const result = calculateExerciseScore(FIXTURE_MC_WRONG);
      assert.strictEqual(result.score, 0);
    });
  });
});
```

### 3.2 Assertion Style

- Use `assert.strictEqual()` for equality checks (not `assert.equal()` which uses `==`).
- Use `assert.ok()` for boolean truthiness.
- Use `assert.throws()` for error cases.
- Use descriptive error messages in all assertions:

```typescript
// Good
assert.strictEqual(result.score, 85, "should calculate 85/100 for given input");

// Bad
assert.strictEqual(result.score, 85);
```

### 3.3 Test Data

- Use descriptive fixture names (`FIXTURE_MC_CORRECT`, `FIXTURE_VOICE_EMPTY_TRANSCRIPT`).
- Keep fixtures minimal — only include fields the function actually uses.
- Avoid shared mutable state between tests.

---

## 4. Mocking Conventions

### 4.1 Mock Scope

- Mock only external dependencies (Prisma, NextAuth, Web Speech API).
- Do NOT mock the module under test.
- Do NOT mock utility functions in the same package — test them for real.

### 4.2 Prisma Mock Pattern

When testing API routes that use Prisma:

```typescript
// Create a mock object matching Prisma's shape
const createMockPrisma = (overrides = {}) => ({
  $transaction: mock.fn(async (fn) => fn({})),
  user: {
    findUnique: mock.fn(() => Promise.resolve(null)),
    update: mock.fn(() => Promise.resolve({})),
    ...overrides.user,
  },
  exerciseAttempt: {
    create: mock.fn(() => Promise.resolve({ id: "att-1" })),
    findFirst: mock.fn(() => Promise.resolve(null)),
    ...overrides.exerciseAttempt,
  },
  // ... other models as needed
});
```

### 4.3 Mock Module Imports

For Next.js API route tests, mock framework modules:

```typescript
// Mock Next.js server helpers
mock.module("next/server", {
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => new Response(JSON.stringify(data), init),
  },
});
```

---

## 5. Running Tests

### Commands

```powershell
# Run all tests
npm test

# Run specific test file
npx.cmd tsx --test "src/lib/__tests__/scoring.test.ts"

# Run tests with verbose output (Node 20+)
NODE_OPTIONS="--test-reporter=spec" npm test
```

### Before Committing

Always run the full suite AND typecheck:

```powershell
npm test && npx.cmd tsc --noEmit --pretty false
```

### CI Integration

If CI is configured, the test command is already `npm test`. No additional setup needed.

---

## 6. Test Coverage Goals (for Thesis)

Not a strict requirement, but aim for:

| Layer | Target | Priority |
|-------|--------|----------|
| `scoring.ts` | 100% (all functions, all edge cases) | 🔴 Must have |
| `gamification.ts` | 100% (XP, levels, badges, streak) | 🔴 Must have |
| `period.ts` | 100% (week/month boundaries) | 🔴 Must have |
| `utils.ts` (normalize) | 100% | 🔴 Must have |
| `auth-redirect.ts` | 100% (security-critical) | 🔴 Must have |
| API routes (submit, checkin) | Main happy + error paths | 🟡 Nice to have |
| Lesson catalog | Structure validation | 🟡 Nice to have |

---

## 7. Checklist

Before claiming test work is complete:

- [ ] All existing tests pass (`npm test`).
- [ ] TypeScript compiles (`tsc --noEmit`).
- [ ] New tests cover the changed functions.
- [ ] Edge cases tested: empty input, null, boundary values.
- [ ] Mocked dependencies match real Prisma shapes.
- [ ] No `console.log` left in test files.
- [ ] Test file names match `*.test.ts` pattern.
- [ ] Descriptive assertion messages on all asserts.
- [ ] No shared mutable state between test cases.
