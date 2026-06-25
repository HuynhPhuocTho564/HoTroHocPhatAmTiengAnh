---
name: ipa-pronunciation-pedagogy
description: Use when designing or reviewing IPA pronunciation lessons, minimal-pair sequences, learner feedback, word/sentence practice, or phoneme-focused exercise flows for Web_HoTroPhatAmEN, especially for Vietnamese learners of English.
---

# IPA Pronunciation Pedagogy

## Purpose

Use this skill to keep pronunciation content pedagogically sound, IPA-centered, and aligned with the project's focus on English pronunciation practice. Prefer clear learning value over adding many exercise variants.

## Required Context

- Read `PLAN/00_Project_Context/DE_CUONG_DO_AN.md` when checking fit with the thesis scope.
- Read `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md` when the task affects seed data or sound groups.
- Read `references/sources.md` when choosing or citing pronunciation references.

## Lesson Design Rules

- Start from a specific pronunciation target: one phoneme, one contrast, or one sound group.
- Use IPA as the stable representation, but avoid forcing beginners to learn technical labels before practice.
- Prefer minimal pairs for confusing contrasts: listen, identify, repeat, then use in short sentences.
- Keep one lesson focused. Do not mix unrelated contrasts such as `/i:/` vs `/ɪ/` and `/θ/` vs `/ð/` in the same beginner exercise.
- Sequence tasks from receptive to productive: hear the contrast, choose the answer, speak one word, speak a pair, speak a short sentence.
- For Vietnamese learners, mark likely confusion points in `commonMistake` or feedback fields instead of hiding them in UI text only.

## Exercise Design Rules

- For `listen_choose`, include balanced targets across the contrasted phonemes and require audio availability.
- For `speak_word`, choose short words with a clear target sound and avoid homographs or rare words in beginner lessons.
- For `speak_minimal_pair`, choose pairs that differ mainly by the target phoneme.
- For `speak_sentence`, keep sentences short and include only one or two target words for MVP.
- Store useful feedback at item level where possible: target sound, expected IPA, mouth hint, and likely mistake.

## Feedback Rules

- Feedback must be specific enough to guide the next attempt: identify the target sound and the likely substitution.
- Do not overclaim phoneme-level accuracy if the implementation only uses Web Speech transcript matching.
- Separate transcript correctness from pronunciation quality when the system cannot reliably measure acoustic phonetics.
- Use neutral wording. Prefer "try opening the vowel more" over failure-focused messages.

## Data Rules

- Treat IPA/audio as reviewable content. Do not auto-activate imported items.
- Keep `status`, `sourceType`, `sourceUrl`, and review notes when adding word, minimal-pair, or sentence data.
- Do not copy exercise sentences or audio from copyrighted books/sites unless the project has permission.
- Cambridge/Oxford may be used for manual cross-checking only unless a valid license/API is available.

## Output Checklist

- State the target phoneme or contrast.
- State learner level and exercise type.
- Ensure item difficulty is consistent.
- Ensure the data can map to `Phoneme`, `SoundGroup`, `WordItem`, `MinimalPair`, `SentenceItem`, or `QuestionBankItem`.
- Note any item that needs human review before `ACTIVE`.
