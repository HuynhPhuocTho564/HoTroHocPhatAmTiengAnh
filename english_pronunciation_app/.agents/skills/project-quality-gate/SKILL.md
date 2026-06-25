---
name: project-quality-gate
description: Use before finishing code changes in Web_HoTroPhatAmEN, especially after Prisma schema edits, Next.js route/API changes, auth/session changes, gamification/scoring changes, seed data changes, or UI changes that should pass validation before handoff.
---

# Project Quality Gate

## Purpose

Use this skill to finish coding work with explicit validation. The goal is not to run every possible command every time, but to run the checks that match the changed surface and report any skipped checks honestly.

## Required Context

- Read `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` to confirm the current phase.
- Read `PLAN/01_Roadmap/API_CONTRACT_PLAN.md` when API payloads/responses changed.
- Read `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md` when schema or seed content changed.
- Read `references/validation-checks.md` when deciding which commands to run.

## Validation Matrix

- Prisma schema changed: run `npx.cmd prisma validate`; run `npx.cmd prisma generate`; use `db push` or migration only when intentionally syncing DB.
- TypeScript/React/API changed: run `npx.cmd tsc --noEmit --pretty false`.
- Next.js route/page/layout changed: run the typecheck and, when feasible, `npm run build`.
- Scoring/gamification changed: add or run focused tests if available; verify updates happen server-side and inside a transaction where needed.
- Auth/admin/API changed: verify session usage, authorization, request validation, and no trust in client-provided user role/score.
- UI/accessibility changed: verify keyboard/focus/aria basics and run a browser check when the change is visual or interactive.
- Seed/question-bank changed: verify no `ACTIVE` item lacks required source/review metadata.

## Command Rules

- In PowerShell, use `npx.cmd`, not bare `npx`.
- Run commands from `english_pronunciation_app/frontend` unless the target is backend-specific.
- Remove stale generated Next.js types only when errors clearly point at obsolete `.next/types` references.
- Do not use destructive git commands to make checks pass.
- Do not hide validation failures. Fix them or report the blocker.

## Security And Data Checks

- Never trust client-submitted score, XP, ranking delta, role, or completion state.
- Do not expose private user data in leaderboard or public badge responses.
- Validate route params and JSON payloads at the API boundary.
- Avoid writing raw audio blobs to PostgreSQL; store references/metadata unless a later design explicitly changes this.
- Keep database updates that must stay consistent inside Prisma transactions.

## Handoff Format

When finishing a coding task, report:

- Files changed.
- Checks run and result.
- Checks not run and why.
- Remaining risk or next step, if any.
