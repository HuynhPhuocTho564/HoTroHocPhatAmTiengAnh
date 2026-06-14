---
name: question-bank-curator
description: Use when creating, reviewing, importing, seeding, or normalizing pronunciation question-bank data for Web_HoTroPhatAmEN, including WordItem, MinimalPair, SentenceItem, QuestionBankItem, IPA, audio metadata, source tracking, and review status.
---

# Question Bank Curator

## Purpose

Use this skill to keep the pronunciation question bank consistent, reviewable, and legally safe. The project uses a database-backed question bank, so content quality matters as much as code structure.

## Required Context

- Read `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md` before adding or changing data models, seed data, or content workflow.
- Read `PLAN/01_Roadmap/API_CONTRACT_PLAN.md` when question-bank data affects submit/scoring payloads.
- Read `references/sources.md` when choosing data, audio, IPA, or assessment-format references.
- Pair with `ipa-pronunciation-pedagogy` when designing phoneme groups or feedback.
- Pair with `postgresql_expert` when changing Prisma schema.

## Curation Workflow

1. Define target `SoundGroup`: phonemes, level, topic, and exercise types.
2. Draft word/minimal-pair/sentence candidates manually or from a permitted source.
3. Cross-check IPA and audio availability.
4. Save records as `NEEDS_REVIEW` unless the source and pronunciation were manually verified.
5. Create `QuestionBankItem` records only from clean source items.
6. Generate fixed MVP exercises from a selected subset before enabling random selection.

## Required Metadata

Every content item should preserve:

- `status`: `DRAFT`, `NEEDS_REVIEW`, `ACTIVE`, or `ARCHIVED`.
- `sourceType`: `MANUAL`, `OPEN_SOURCE`, `FREE_API`, `LICENSED`, or equivalent local enum/string.
- `sourceUrl`: URL only when allowed and useful for review.
- `reviewNote`: short reason when data is uncertain.
- `difficulty`: small controlled set such as `EASY`, `MEDIUM`, `HARD`.

## Quality Rules

- Do not activate items without target phoneme, IPA, and review status.
- Do not use items with missing audio in `listen_choose`.
- Do not create minimal pairs where spelling differs but the target phoneme contrast is unclear.
- Keep answer keys server-verifiable. Do not rely on client-provided correctness.
- Avoid rare vocabulary in MVP unless the word is necessary for a phoneme contrast.
- Keep fixed question sets for leaderboard fairness until normalization is implemented.

## Copyright And Source Rules

- Do not scrape Cambridge, Oxford, or book audio/text into the app.
- Use Cambridge/Oxford only as manual reference unless a license/API explicitly permits app usage.
- Prefer project-authored word lists, project-recorded local audio, open datasets with compatible licenses, or licensed APIs.
- Record attribution requirements for any open dataset before seed data is committed.

## Question Item Rules

- `contentJson` must contain enough structured data for UI rendering without parsing prose.
- Store IDs of source items (`wordItemId`, `minimalPairId`, `sentenceItemId`) whenever possible.
- For random question generation, store the exact selected `questionId` set in the attempt flow.
- When changing schema, keep `QuestionBankItem` separate from runtime `Question` so admin/review data does not leak into live exercises.

## Output Checklist

- List sound group and exercise type.
- List source and review status.
- Mark which items are safe for MVP.
- Mark which items require human review.
- Note copyright/licensing uncertainty instead of silently using questionable data.
