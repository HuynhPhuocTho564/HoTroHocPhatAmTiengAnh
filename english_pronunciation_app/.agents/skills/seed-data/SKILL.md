---
name: seed-data
description: Use when creating, modifying, or debugging seed scripts, lesson catalog data, phoneme/sound-group content, word items, minimal pairs, sentence items, or question bank items for Web_HoTroPhatAmEN. Also use when running seed commands, validating seed output, or troubleshooting seed errors.
---

# Seed Data — IPA Lesson Content Pipeline

## Purpose

Guide the creation and management of seed data for the pronunciation learning system. The project seeds 4 topics, 25 sound groups, and up to 100 exercises from structured data, not hardcoded components. This skill ensures seed scripts produce clean, valid, reviewable data.

## Required Context

- Read `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md` for the overall data strategy.
- Read `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md` for the 4-topic/25-group/100-exercise plan.
- Pair with `ipa-pronunciation-pedagogy` when choosing phonemes, minimal pairs, or sentence content.
- Pair with `question-bank-curator` when creating QuestionBankItem records or handling review status.
- Pair with `project-quality-gate` before finalizing seed changes.

---

## 1. Seed Pipeline Architecture

The data flows through a strict pipeline. Never skip a step:

```
1. Define Lesson Catalog (topics, sound groups, phonemes)
       ↓
2. Create Content Items (WordItem, MinimalPair, SentenceItem)
       ↓
3. Cross-check IPA & Audio (manual or API validation)
       ↓
4. Save as NEEDS_REVIEW (not ACTIVE)
       ↓
5. Generate QuestionBankItem from verified items
       ↓
6. Generate fixed Exercise + Question sets for MVP
       ↓
7. Set verified exercises to ACTIVE
```

---

## 2. File Responsibilities

| File | Purpose | Edit frequency |
|------|---------|---------------|
| `prisma/lesson-catalog.ts` | Structure: 4 topics, 25 sound groups, phoneme assignments | Rare — only when adding new groups |
| `prisma/lesson-content.ts` | Content data: words, pairs, sentences per sound group | Medium — when adding new content |
| `prisma/seed_lessons.ts` | Pipeline script: reads catalog + content, upserts to DB | Medium — when pipeline logic changes |
| `prisma/seed_real.ts` | Legacy demo seed (users, basic exercises) | Rare — kept for history |

**Rule:** Never put raw content data inside `seed_lessons.ts`. Content goes in `lesson-content.ts`. Pipeline logic goes in `seed_lessons.ts`.

---

## 3. Data Requirements Per Sound Group

Each sound group must have ALL of the following before it can be ACTIVE:

### Minimum for ACTIVE

| Item Type | Minimum count | Required fields |
|-----------|--------------:|----------------|
| `Phoneme` | 2 (the contrast pair) | symbol, name, category, description |
| `WordItem` | 8-10 per phoneme (16-20 total) | word, ipa, phonemeId, meaningVi, difficulty, status, sourceType |
| `MinimalPair` | 8-10 | wordAId, wordBId, soundGroupId, note, difficulty, status |
| `SentenceItem` | 6 | text, targetWords, soundGroupId, difficulty, status, sourceType |
| `QuestionBankItem` | 16-18 (5 listen + 5 speak_word + 3-5 minimal_pair + 3 sentence) | questionTypeId, soundGroupId, content, answer, score, status |

### Shell vs Deep Seed

- **Shell seed**: Create Topic, Level, SoundGroup, LearningMap, and Exercise records with `status: DRAFT`. No questions needed. Used for Learning Map structure display.
- **Deep seed**: Create all content items AND QuestionBankItem AND fixed Question records. Used for exercises users can actually play.
- MVP deep seed: 16 exercises (8 from Topic 1 + 8 from Topic 4).

---

## 4. Metadata Rules

Every content item MUST have:

- **`status`**: `DRAFT`, `NEEDS_REVIEW`, `ACTIVE`, or `ARCHIVED`. Default to `NEEDS_REVIEW` for new content.
- **`sourceType`**: `MANUAL`, `FREE_API`, `OPEN_SOURCE`, `LICENSED`. Never leave null.
- **`sourceUrl`**: URL if applicable. `null` is acceptable for `MANUAL`.
- **`reviewNote`**: Brief note on data quality concerns. Can be empty string, never null.
- **`difficulty`**: `EASY`, `MEDIUM`, or `HARD`. Must match the group's intended level.

**Critical:** An item WITHOUT these metadata fields must NEVER be set to `ACTIVE`.

---

## 5. Seed Script Patterns

### 5.1 Upsert Pattern

Always use `upsert` to allow re-running scripts without duplicates:

```typescript
await prisma.phoneme.upsert({
  where: { symbol: "/iː/" },
  update: {},
  create: {
    symbol: "/iː/",
    name: "Close front unrounded long",
    category: "VOWEL",
    // ...
  },
});
```

### 5.2 Dependency Order

The seed MUST insert in this order (foreign keys require parent to exist first):

1. `QuestionType` (qtype-1-mc, qtype-2-voice, qtype-3-minimal-pairs)
2. `Role` (if not exists)
3. `Topic`
4. `Level`
5. `Phoneme`
6. `SoundGroup`
7. `SoundGroupPhoneme` (join table)
8. `WordItem` (references Phoneme)
9. `MinimalPair` (references WordItem + SoundGroup)
10. `SentenceItem` (references SoundGroup)
11. `QuestionBankItem` (references SoundGroup + QuestionType + content items)
12. `LearningMap` (references Topic + Level + SoundGroup)
13. `Exercise` (references LearningMap + QuestionType)
14. `Question` + `AnswerOption` (fixed set from QuestionBankItem)

### 5.3 Validation After Seed

After running any seed script, verify:

```powershell
npx.cmd prisma validate
npx.cmd tsc --noEmit --pretty false
npm.cmd test
```

And run data validation queries:

- No `ACTIVE` item with `sourceType = null`.
- No `ACTIVE` `listen_choose` question with empty audioUrl.
- No `MinimalPair` where `wordAId === wordBId`.
- No `QuestionBankItem` with null `answer`.
- Each `SoundGroup` has at least 2 `Phoneme` linked.

---

## 6. Topic & Sound Group Catalog

### 4 Topics (do not change order)

| # | Slug | Vietnamese Name | Groups |
|---|------|-----------------|-------:|
| 1 | `monophthongs` | Nguyên âm đơn | 6 |
| 2 | `diphthongs` | Nguyên âm đôi | 4 |
| 3 | `consonants` | Phụ âm | 11 |
| 4 | `hard-minimal-pairs` | Minimal Pairs khó | 4 |

### Sound Groups (25 total)

See `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md` Section 4 for the complete list with phoneme mappings and notes.

**Rules:**
- Topic 4 groups MUST reference phonemes already taught in Topics 1-3. Do NOT introduce new phonemes in Topic 4.
- Each group's `order` field determines display sequence. Use multiples of 10 (10, 20, 30...) to allow insertion later.
- Group names should be descriptive for Vietnamese learners (e.g., "Dài & ngắn phía trước" not just "/iː/ vs /ɪ/").

---

## 7. Exercise Generation Rules

### Per Sound Group: 4 Modes

Each `SoundGroup` generates exactly 4 `Exercise` records, one per mode:

| Mode | QuestionType | Question count (deep seed) | Description |
|------|-------------|----------------------------:|-------------|
| `listen_choose` | `qtype-1-mc` | 5 | Listen to audio, select correct word/IPA |
| `speak_word` | `qtype-2-voice` | 5 | Read a single word aloud |
| `speak_minimal_pair` | `qtype-3-minimal-pairs` | 3-5 | Read two confusable words |
| `speak_sentence` | `qtype-2-voice` | 3 | Read a sentence containing target sounds |

### contentJson Structure

Each `QuestionBankItem.contentJson` must include:

For `listen_choose`:
```json
{
  "mode": "listen_choose",
  "audioUrl": "https://...",
  "options": ["ship", "sheep", "chip", "cheap"],
  "correctIndex": 0,
  "targetPhoneme": "/ɪ/"
}
```

For `speak_word`:
```json
{
  "mode": "speak_word",
  "word": "ship",
  "ipa": "/ʃɪp/",
  "audioUrl": "https://...",
  "targetPhonemes": ["/ɪ/"],
  "hint": "Âm /ɪ/ ngắn, không kéo dài."
}
```

For `speak_minimal_pair`:
```json
{
  "mode": "speak_minimal_pair",
  "wordA": "ship",
  "wordB": "sheep",
  "ipaA": "/ʃɪp/",
  "ipaB": "/ʃiːp/",
  "audioUrlA": "https://...",
  "audioUrlB": "https://...",
  "targetPhonemes": ["/ɪ/", "/iː/"],
  "hint": "Ship có âm ngắn /ɪ/, Sheep có âm dài /iː/."
}
```

For `speak_sentence`:
```json
{
  "mode": "speak_sentence",
  "sentence": "The ship is near the beach.",
  "targetWords": ["ship", "beach"],
  "targetPhonemes": ["/ɪ/", "/iː/"],
  "hint": "Đọc rõ sự khác nhau giữa ship và beach."
}
```

### Fixed vs Random Questions

- **MVP uses fixed question sets.** Each Exercise has a predefined set of Questions.
- Do NOT implement random selection until after MVP is stable.
- Store the `questionId` list used in each attempt for scoring reproducibility.

---

## 8. Audio Source Rules

- **Preferred**: `sourceType: "MANUAL"` — project-recorded audio or TTS-generated fallbacks.
- **Acceptable**: `sourceType: "FREE_API"` — audio from Free Dictionary API or similar free services. Must include `sourceUrl`.
- **Never**: Scraping audio from Cambridge/Oxford without a license.
- **Fallback**: If audio is unavailable, the WordItem can still be used for `speak_word` (user reads, no audio playback needed). But it CANNOT be used for `listen_choose`.

---

## 9. Common Pitfalls

| Pitfall | Prevention |
|---------|-----------|
| Seed fails on re-run due to duplicate keys | Always use `upsert`, never `create` |
| IPA symbol mismatch (different Unicode chars) | Normalize IPA to a single standard form in catalog |
| MinimalPair links to deleted/missing WordItem | Validate FK existence before creating MinimalPair |
| ACTIVE exercises with missing questions | Check `Question.count > 0` before setting status |
| Seed script times out on large data | Use batch inserts (Prisma `createMany`) for bulk data |
| contentJson is invalid JSON | Validate JSON structure in seed script before upsert |

---

## 10. Checklist

Before claiming seed work is complete:

- [ ] All content items have `status`, `sourceType`, `sourceUrl`, `reviewNote`, `difficulty`.
- [ ] No `ACTIVE` item with null required metadata.
- [ ] No `ACTIVE` `listen_choose` with empty `audioUrl`.
- [ ] No duplicate phonemes, words, or minimal pairs.
- [ ] Each SoundGroup has exactly 4 Exercise records (one per mode).
- [ ] Deep-seeded exercises have 5+ questions each.
- [ ] contentJson is valid JSON and contains required `mode` field.
- [ ] `prisma validate` passes.
- [ ] `tsc --noEmit` passes.
- [ ] `npm test` passes (if seed tests exist).
