# Remaining Work Execution Plan (20/06/2026 - Deadline 28/06)

## Overview

| Phase | SP | Content | Tasks | Est. Time |
|---|---|---|---|---|
| Phase 1 | SP7 Batch 1 | Gem + Shop + Streak Freeze (finish) | 4 tasks | 1-2 days |
| Phase 2 | SP7 Batch 2 | Daily Quests + UI | 7 tasks | 2-3 days |
| Phase 3 | SP6 | Gamification polish (level fix, gating, leaderboard, check-in auto) | 4 tasks | 1-2 days |
| Phase 4 | SP3 + SP4 | 2 CD3 groups + scoring multiplier | 3 tasks | 1 day |
| Phase 5 | SP5 | Admin CRUD 6 model kho | 6 tasks | 2-3 days |

**Total: ~24 small tasks, 7-11 days**

---

## Phase 1: SP7 Batch 1 - Gem + Shop completion (Priority: HIGHEST)

**Wiki reference:** Gamification Engine > XP and Scoring System, Streak and Daily Check-in
**Existing plan:** `docs/superpowers/plans/2026-06-19-sp7-gamification-3-elements.md` (Task 4-6)
**Skills:** `testing`, `project-quality-gate`

### Task 1.1: Submit route gem hook (SP7 Task 4)
- [ ] Hook `computeGemReward(rating)` into `api/exercises/submit/route.ts` after compute rating
- [ ] Add `gems: { increment: gemReward }` to user update
- [ ] Return `gems` + `gemsEarned` in response payload
- [ ] Verify: `npx tsc --noEmit` + `npm test`
- **Files:** `src/app/api/exercises/submit/route.ts`, `src/lib/gamification.ts` (import)

### Task 1.2: Shop route `/api/shop` (SP7 Task 5)
- [ ] Create `src/app/api/shop/route.ts` with POST handler
- [ ] Validate session, find item in `SHOP_ITEMS`, call `validateShopPurchase`
- [ ] Apply effect (decrement gems, increment streakFreezes / unlock flags)
- [ ] Verify: `npx tsc --noEmit`
- **Files:** New `src/app/api/shop/route.ts`
- **Wiki ref:** Admin Dashboard > Permission System (for `getSessionUserId` pattern)

### Task 1.3: GemsDisplay + ShopModal UI (SP7 Task 11)
- [ ] Create `src/components/gamification/GemsDisplay.tsx`
- [ ] Create `src/components/gamification/ShopModal.tsx`
- [ ] Wire `GemsDisplay` into navbar (NavbarClient)
- [ ] Verify: `npx tsc --noEmit` + `npm run build`
- **Files:** New components, modify `src/components/layout/NavbarClient.tsx`
- **Wiki ref:** User Interface Components > Design System and Theming (Tailwind patterns)

### Task 1.4: Quality gate + Batch 1 review
- [ ] Run: `npx prisma validate` + `npx tsc --noEmit` + `npm test` + `npm run build`
- [ ] All pass = Batch 1 complete
- **Skill:** `project-quality-gate`

---

## Phase 2: SP7 Batch 2 - Daily Quests + UI (Priority: HIGH)

**Wiki reference:** Gamification Engine > Gamification Engine.md (quest mechanics)
**Existing plan:** `docs/superpowers/plans/2026-06-19-sp7-gamification-3-elements.md` (Task 7-13)
**Skills:** `testing`, `nextjs_app_router_expert`

### Task 2.1: Quest definitions + helpers (SP7 Task 7)
- [ ] Add `QUEST_TYPES`, `pickDailyQuests()`, `shouldIncrementQuest()` to `gamification.ts`
- [ ] Verify topicId CD2 = `"topic-2-consonants"` in `lesson-catalog.ts`
- [ ] Verify: `npx tsc --noEmit`

### Task 2.2: Quest route `/api/daily-quests` (SP7 Task 8)
- [ ] Create `src/app/api/daily-quests/route.ts` (GET: lazy generate 3 quests/day)
- [ ] Verify: `npx tsc --noEmit`

### Task 2.3: Submit route quest progress hook (SP7 Task 9)
- [ ] Hook quest progress into submit route (find active quests, increment, claim rewards)
- [ ] Return quest updates in response
- [ ] Verify: `npx tsc --noEmit` + `npm test`

### Task 2.4: Engine maxCombo + soundGroupId (SP7 Task 10)
- [ ] Add `maxCombo` state tracking in `ExerciseEngineClient.tsx`
- [ ] Pass `maxCombo` + `soundGroupId` in submit payload
- [ ] Verify: `npx tsc --noEmit`

### Task 2.5: DailyQuestsWidget UI (SP7 Task 12)
- [ ] Create `src/components/gamification/DailyQuestsWidget.tsx`
- [ ] Wire into dashboard sidebar (`src/app/dashboard/page.tsx`)
- [ ] Verify: `npx tsc --noEmit` + `npm run build`

### Task 2.6: Engine unlock items (SP7 Task 13)
- [ ] Pass `unlockedSlowAudio` + `unlockedIpaReveal` into engine
- [ ] Add slow audio button (x0.5) in sentence components when unlocked
- [ ] Show IPA in speak_sentence when unlocked
- [ ] Verify: `npx tsc --noEmit` + `npm run build`

### Task 2.7: Quality gate + Batch 2 review
- [ ] Run full quality gate
- [ ] All pass = SP7 complete
- **Skill:** `project-quality-gate`

---

## Phase 3: SP6 - Gamification polish (Priority: MEDIUM)

**Wiki reference:** Gamification Engine > Streak and Daily Check-in, Leaderboard and Ranking
**Skills:** `testing`, `postgresql_expert`

### Task 3.1: Fix level 2-he offset (off-by-one bug)
- [ ] `levelSystem.ts` starts level at 0, `gamification.ts` starts at 1
- [ ] Fix: align `LevelDisplay.tsx` to use `gamification.ts:calculateLevelFromXp` instead of `levelSystem.ts`
- [ ] Add test verifying level consistency
- [ ] Verify: `npm test`
- **Files:** `src/lib/levelSystem.ts`, `src/components/gamification/LevelDisplay.tsx`, `src/lib/__tests__/gamification.test.ts`
- **Note:** DO NOT delete `levelSystem.ts` or `mockData.ts` (per user request to keep)

### Task 3.2: All-time leaderboard
- [ ] Add `"all"` to `LeaderboardPeriodType` in `src/lib/period.ts`
- [ ] Add `getAllTimePeriod()` helper
- [ ] Update `/api/leaderboard` route to support `type=all`
- [ ] Update `leaderboard/page.tsx` with "All-time" tab
- [ ] Verify: `npx tsc --noEmit` + `npm test`
- **Files:** `src/lib/period.ts`, `src/app/api/leaderboard/route.ts`, `src/app/leaderboard/page.tsx`

### Task 3.3: Auto check-in on exercise submit
- [ ] In `api/exercises/submit/route.ts`, after user update: call `calculateNextStreak` + update streak fields
- [ ] Import `calculateNextStreak` from `gamification.ts`
- [ ] Verify: `npx tsc --noEmit` + `npm test`
- **Files:** `src/app/api/exercises/submit/route.ts`

### Task 3.4: CD3/CD4 unlock gating 80%
- [ ] In learning map page (`src/app/learning_map/`): check `unlockThresholdPercent` from topic
- [ ] Calculate completion % of prerequisite topic
- [ ] If < 80%: show locked overlay + progress bar
- [ ] Verify: `npx tsc --noEmit` + `npm run build`
- **Files:** `src/app/learning_map/` (client component), `lesson-catalog.ts` (threshold data)

---

## Phase 4: SP3 + SP4 minor (Priority: LOW-MEDIUM)

**Wiki reference:** Database Design > Data Management and Seeding
**Skills:** `question-bank-curator`, `ipa-pronunciation-pedagogy`

### Task 4.1: CD3 group g02 content
- [ ] Add `WORDS_T3_G02`, `MINIMAL_PAIRS_T3_G02`, `SENTENCES_T3_G02` to `lesson-content.ts`
- [ ] Register in `LESSON_CONTENT_BY_SOUND_GROUP` map
- [ ] Add test in `lesson-content.test.ts` (threshold check)
- [ ] Re-seed: `npm run db:seed:lessons`
- **Files:** `prisma/lesson-content.ts`, `src/lib/__tests__/lesson-content.test.ts`
- **Note:** Content must follow IPA pedagogy (reference `ipa-pronunciation-pedagogy` skill)

### Task 4.2: CD3 group g04 content
- [ ] Same pattern as Task 4.1 for g04
- [ ] After both: 30/30 groups = SP3 100%

### Task 4.3: Scoring multiplier + retake limit (SP4 remaining)
- [ ] Add XP multiplier by exercise type (listen vs speak) in `gamification.ts`
- [ ] Add max retake/day limit (e.g., 5 retakes per exercise per day)
- [ ] Add test coverage
- [ ] Verify: `npm test`
- **Files:** `src/lib/gamification.ts`, `src/app/api/exercises/submit/route.ts`, `src/lib/__tests__/gamification.test.ts`

---

## Phase 5: SP5 - Admin CRUD 6 model kho (Priority: LOW)

**Wiki reference:** Admin Dashboard > Content Administration Tools, Admin Dashboard wiki
**Skills:** `nextjs_app_router_expert`, `postgresql_expert`

### Task 5.1: Phoneme CRUD
- [ ] Create API route: `src/app/api/admin/phonemes/route.ts` (GET + POST)
- [ ] Create API route: `src/app/api/admin/phonemes/[id]/route.ts` (PATCH + DELETE)
- [ ] Add PhonemeManagement tab to AdminDashboardClient
- **Pattern:** Follow existing `topics/route.ts` + `TopicLevelMapManagement.tsx`

### Task 5.2: WordItem CRUD
- [ ] API routes for WordItem (GET list with filters + POST + PATCH + DELETE)
- [ ] WordItemManagement tab (list, edit meaningVi, reviewNote, status transitions)
- **Pattern:** Same as ExerciseManagement

### Task 5.3: SoundGroup CRUD
- [ ] API routes for SoundGroup (GET + POST + PATCH + DELETE)
- [ ] SoundGroupManagement tab
- **Note:** SoundGroup has relation to Phoneme (SoundGroupPhoneme join table)

### Task 5.4: QuestionBankItem CRUD
- [ ] API routes for QuestionBankItem (GET + POST + PATCH + DELETE)
- [ ] QuestionBankManagement tab
- **Note:** Has relations to QuestionType, SoundGroup, WordItem, MinimalPair, SentenceItem

### Task 5.5: MinimalPair + SentenceItem CRUD
- [ ] API routes for both models
- [ ] Management tabs (similar pattern)

### Task 5.6: User management enhancements + Badges config
- [ ] Extend UserManagement with edit role/status
- [ ] Add BadgeManagement tab (list badges, configure conditions)
- [ ] Verify: `npx tsc --noEmit` + `npm run build`

---

## Skills Usage Guide

| Skill | When to use |
|---|---|
| `testing` | Every task with new logic (write tests first for TDD) |
| `project-quality-gate` | End of each phase (prisma validate + tsc + test + build) |
| `nextjs_app_router_expert` | API routes, server components, page structure |
| `postgresql_expert` | Schema queries, Prisma patterns |
| `ipa-pronunciation-pedagogy` | Content authoring for CD3 groups |
| `question-bank-curator` | Word/sentence content quality |
| `gamification_designer` | SP7 quest design, balance |
| `accessibility` | UI components (WCAG compliance) |

---

## Execution Rules

1. **One task at a time** - Complete checkbox, verify, then move to next
2. **Quality gate after each phase** - All 4 checks must pass before declaring phase complete
3. **Git policy** - Engineer does NOT commit. User commits when convenient
4. **TDD for logic** - Write tests first for new functions, then implement
5. **Comments in code** - Every new function gets a JSDoc comment explaining purpose
6. **Wiki as reference** - When unsure about patterns, check the corresponding wiki section
7. **Dead code preserved** - `levelSystem.ts`, `LevelDisplay.tsx`, `StreakBadge.tsx` - do NOT delete

---

## Progress Tracking

Update this section after completing each phase:

| Phase | Status | Date |
|---|---|---|
| Phase 1: SP7 Batch 1 | Pending | - |
| Phase 2: SP7 Batch 2 | Pending | - |
| Phase 3: SP6 | Pending | - |
| Phase 4: SP3 + SP4 | Pending | - |
| Phase 5: SP5 | Pending | - |
