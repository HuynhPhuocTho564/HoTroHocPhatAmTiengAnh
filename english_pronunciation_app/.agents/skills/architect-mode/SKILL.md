---
name: architect-mode
description: Use whenever writing any code for Web_HoTroPhatAmEN — acts as a mandatory architectural gate. Forces Clean Architecture layering, SOLID/DRY/KISS principles, TypeScript strict mode, and structured error handling before any implementation. Apply even for small changes, one-off fixes, or demo scripts.
---

# Architect Mode

## Purpose

Every line of code generated for this project must comply with the architectural rules below. This skill is not optional — it applies to all files, all layers, all change sizes.

Read this skill **before** writing any new file, refactoring existing code, or reviewing pull requests.

## Required Context

- Read `PLAN/00_Project_Context/PROJECT_CONTEXT.md` for tech stack overview.
- Read `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` to confirm the current phase.
- Pair with other domain skills as needed: `ipa-pronunciation-pedagogy` for lessons, `gamification_designer` for XP/badge logic, `project-quality-gate` before handoff.

---

## 1. System Architecture — Clean Architecture

The codebase must follow a layered architecture with strict dependency direction. Dependencies flow inward only:

```
UI Components (React, Tailwind)
    → Controllers / Route Handlers (Next.js API Routes)
        → Services Layer (Business Logic, Gamification, Scoring)
            → Repositories / Prisma Client (Data Access)
```

### Layer Rules

- **UI Components** (`src/components/`, `src/app/*/page.tsx`): Only handle rendering and user interaction. Call services via hooks or API calls. Never import Prisma directly. Never contain business logic.
- **Controllers / Route Handlers** (`src/app/api/`): Validate input, call services, return responses. Thin layer — delegate logic to services. Never write scoring, XP calculation, or badge logic directly in a route handler.
- **Services Layer** (`src/lib/`, `src/services/`): Contains all business logic — scoring, gamification, normalization, badge checks, streak calculations. Pure TypeScript, no framework dependency when possible. Export testable functions.
- **Repositories / Prisma** (`prisma/`): Database access only via Prisma Client. Schema definitions and seed scripts live here. No business logic in seed scripts beyond data mapping.

### Independence Guarantee

- Changing the database schema must NOT require changes in Services or UI.
- Changing the UI framework must NOT require changes in Services or data access.
- Each layer should be replaceable in isolation.

### File Structure Mapping

```
src/
├── app/                    # Next.js routes (Controllers)
│   ├── api/                # API route handlers
│   └── [route]/page.tsx    # UI pages
├── components/             # UI components (Presentation)
│   ├── admin/
│   ├── exercises/
│   ├── gamification/
│   └── ui/
├── lib/                    # Services Layer (Business Logic)
│   ├── scoring.ts          # Scoring logic
│   ├── gamification.ts     # XP, badge, streak logic
│   ├── period.ts           # Time period helpers
│   ├── utils.ts            # Shared utilities (normalize, etc.)
│   └── constants.ts        # All magic numbers/strings
└── hooks/                  # React hooks (bridge UI → Services)

prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Demo seed
├── seed_lessons.ts         # Lesson content seed
└── lesson-catalog.ts       # Lesson catalog data
```

---

## 2. Code Principles

### 2.1 SOLID

- **Single Responsibility**: Each function/module does ONE thing. If a function does scoring AND gamification AND database update — split it. Each file should have a clear purpose stated in its first comment.
- **Open/Closed**: Extend behavior by adding new functions/modules, not by modifying existing ones. Use strategy patterns for exercise types (`listen_choose`, `speak_word`, `speak_minimal_pair`, `speak_sentence`).
- **Liskov Substitution**: Shared interfaces for exercise types. Any exercise type should be usable through the same scoring interface without special-casing.
- **Interface Segregation**: Small, focused interfaces. Prefer `ScoreQuestion(question, transcript): ScoreResult` over a large `ProcessExercise(attempt): EverythingResult`.
- **Dependency Inversion**: UI depends on service interfaces, not concrete implementations. Services depend on Prisma abstractions, not raw queries.

### 2.2 DRY — Don't Repeat Yourself

- If the same logic appears in 2+ places, extract it to `src/lib/` or `src/hooks/`.
- Common patterns that MUST be shared (never duplicated):
  - Text normalization (`normalize()` in `src/lib/utils.ts`).
  - Period calculation (week/month ISO format).
  - Score threshold checks (70/80/90).
  - XP calculation formulas.
  - Prisma transaction patterns for gamification updates.
  - Session/auth helpers (`requireAuthSession()`, `requireAdminSession()`).
- If copying a code block, stop and create a shared utility first.

### 2.3 KISS — Keep It Simple

- Choose the simplest solution that works. For a thesis project with a June 2026 deadline, maintainability beats clever abstractions.
- Avoid premature abstraction. Three similar functions are fine — extract a pattern when you see four.
- Prefer flat functions over deep class hierarchies.
- Prefer `for...of` over chained `.map().filter().reduce()` when readability matters more than conciseness.
- Add a comment explaining WHY, not WHAT, when the WHY is not obvious from the code.

---

## 3. TypeScript Strict Mode

### 3.1 Types First

- `strict: true` must be enabled in `tsconfig.json`.
- Define `interface` or `type` for every data shape passed between functions.
- No `any` — ever. Use `unknown` and narrow with type guards if the type is genuinely uncertain.
- All API request/response shapes must have named interfaces.

### 3.2 Naming Conventions

- Interfaces: PascalCase with descriptive names (`ExerciseSubmitPayload`, `ScoreResult`, `BadgeCheckResult`).
- Type aliases for union types (`ExerciseMode = "listen_choose" | "speak_word" | "speak_minimal_pair" | "speak_sentence"`).
- Constants: UPPER_SNAKE_CASE (`BASE_SCORE_LISTEN_CHOOSE`, `XP_MULTIPLIER_SPEAK_WORD`).

### 3.3 No Implicit Any

- Every function parameter and return type must be explicitly typed.
- Prisma query results should be typed via `Prisma.<Model>GetPayload<T>` or select-specific types.
- JSON parsing must be followed by validation (zod, or manual type guard).

---

## 4. No Hardcoding

### 4.1 Constants File

All magic numbers and static strings must live in `src/lib/constants.ts` or a domain-specific constants file.

**Examples of what MUST be constants:**

```typescript
// Scoring
export const BASE_SCORE_LISTEN_CHOOSE = 5;
export const BASE_SCORE_SPEAK_WORD = 10;
export const BASE_SCORE_SPEAK_MINIMAL_PAIR = 15;
export const BASE_SCORE_SPEAK_SENTENCE = 20;

// XP multipliers
export const XP_MULTIPLIER = {
  listen_choose: 0.5,
  speak_word: 0.8,
  speak_minimal_pair: 1.0,
  speak_sentence: 1.2,
} as const;

// Score thresholds
export const SCORE_THRESHOLD_COMPLETE = 70;
export const SCORE_THRESHOLD_GOOD = 80;
export const SCORE_THRESHOLD_EXCELLENT = 90;

// Daily check-in
export const CHECKIN_XP_REWARD = 10;
export const CHECKIN_RANKING_REWARD = 2;

// Daily bonus tiers
export const DAILY_BONUS_TIERS = [
  { exercises: 2, xp: 5, ranking: 2 },
  { exercises: 3, xp: 10, ranking: 4 },
  { exercises: 5, xp: 20, ranking: 8 },
  { exercises: 8, xp: 30, ranking: 12 },
] as const;
```

### 4.2 Configuration

- Environment variables accessed via `process.env.KEY` with fallbacks or validation at startup.
- URLs, API endpoints, and external service config in constants — not scattered in components.

---

## 5. Error Handling

### 5.1 Centralized Try/Catch

- Every API route handler wraps its body in try/catch.
- Use a consistent error response shape:

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}
```

- Never expose raw Prisma errors or stack traces to the client.

### 5.2 Error Categories

- **Validation errors** (400): Missing fields, wrong types, out-of-range values. Return immediately.
- **Auth errors** (401/403): Not logged in, wrong role. Use `NextResponse.redirect()` or JSON error.
- **Not found** (404): Resource does not exist. Return `null` for queries, 404 for mutations.
- **Server errors** (500): Unexpected failures. Log the real error, return generic message to client.

### 5.3 Logging

- Use `console.error()` for unexpected errors with context (what operation failed, what input).
- Use `console.warn()` for degraded but handled situations (fallback used, retry attempted).
- Do NOT use `console.log()` for normal flow — remove before handoff.

### 5.4 Transaction Safety

- All multi-table updates (submit exercise, check-in, badge award) MUST use `prisma.$transaction()`.
- If a transaction fails, the system must be in a consistent state — partial updates are never acceptable.

---

## 6. File Size & Organization

- Target: each file under **200 lines**. If a file exceeds 200 lines, split by responsibility.
- Each file starts with a one-line comment explaining its purpose.
- Group related exports at the bottom of the file.
- Avoid barrel files (`index.ts` re-exporting everything) unless the directory has 4+ modules.

---

## 7. Checklist

Before claiming any code change is complete, verify:

- [ ] Each file has a single clear responsibility.
- [ ] No `any` types — all types explicit.
- [ ] No hardcoded magic numbers/strings — all in constants.
- [ ] Business logic lives in `src/lib/`, not in route handlers or components.
- [ ] Prisma is only imported in route handlers, services, and seed scripts — never in components.
- [ ] Error handling follows the centralized pattern with consistent response shape.
- [ ] Multi-table updates use `prisma.$transaction()`.
- [ ] No duplicated logic — shared code extracted to `src/lib/` or hooks.
- [ ] File is under 200 lines (split if needed).
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`).
