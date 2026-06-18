# CURRENT_PROJECT_CONTEXT — Nguồn chân thực hiện tại

Ngày lập: 18/06/2026 (SP1)
Thay thế: `PROJECT_CONTEXT.md`, `CURRENT_SYSTEM_STATUS.md`, `project_spec.md` (đã archive vào `PLAN/_Archive/`).

Đây là tài liệu nguồn chân thực về trạng thái dự án. Khi code/AI cần biết "hệ thống hiện có gì", đọc file này trước, rồi mới đến `ACTION_PLAN_NEXT_STEPS.md`, `DB_AUDIT_REPORT.md`, `LESSON_SYLLABUS_STRUCTURE.md`.

## 1. Tech stack thực tế

| Thành phần | Version / trạng thái | Bằng chứng |
|---|---|---|
| Next.js | 16.2.7 (App Router, Turbopack) | `frontend/package.json` |
| React | 18.3.1 | `frontend/package.json` |
| Prisma | 6.19.3 + `@prisma/client` 6.19.3 | `frontend/package.json` |
| Database | PostgreSQL `english_app` (1 DB duy nhất) | `frontend/.env` `DATABASE_URL` |
| Auth | next-auth v5 beta (`next-auth@5.0.0-beta.31`), Credentials + Google | `frontend/src/lib/auth.ts` |
| Audio UI | wavesurfer.js 7.12.7 | `frontend/package.json` |
| CSS | Tailwind v4 (`@theme` trong `src/app/globals.css`, không có tailwind.config) | `frontend/src/app/globals.css` |
| Speech | Web Speech API (browser), KHÔNG có Whisper/ASR backend | `frontend/src/hooks/useSpeechRecognition.ts` |
| Backend Python | FastAPI 0.136.3 TỐI THIỂU — chỉ `/` và `/health`, KHÔNG có model/scoring/Whisper | `backend/app/main.py`, `backend/app/core/database.py` |
| Node | v24.x | `npx prisma --version` |

## 2. Kiến trúc thực tế

- **Scoring nằm ở frontend**: `frontend/src/lib/scoring.ts` + `frontend/src/app/api/exercises/submit/route.ts` (transaction Prisma). KHÔNG có ASR backend.
- **Gamification nằm ở frontend**: `frontend/src/lib/gamification.ts` (XP, level, badge, leaderboard, daily bonus).
- **Backend FastAPI**: giữ tối thiểu cho `/health` (mục đích: đáp ứng đề cương có backend, mở rộng sau). Hiện là dead code tối thiểu, không xung đột DB (không có model SQLAlchemy).
- **1 database PostgreSQL** duy nhất — Prisma (frontend) là chủ. Backend chỉ `SELECT 1` check kết nối.

## 3. Gamification đang chạy thật (NGƯỜI DÙNG YÊU CẦU GIỮ ĐẦY ĐỦ)

| Tính năng | Vị trí | Trạng thái |
|---|---|---|
| XP | `User.xp`, `gamification.ts:calculateLevelFromXp` | chạy thật |
| Điểm hạng / Leaderboard tuần-tháng | `Leaderboard` (type `tuan`/`thang`), `api/leaderboard/route.ts` | chạy thật |
| Streak | `User.streakCount/longestStreak/totalCheckIns/lastCheckInDate`, `api/checkin/route.ts` | chạy thật |
| Badge | `Badge`/`UserBadge`, `gamification.ts:BADGE_DEFINITIONS` (11 badge) | chạy thật |
| Daily check-in | `DailyActivity`, `api/checkin/route.ts` (+10 XP / +2 ranking) | chạy thật |
| Daily bonus | `gamification.ts:DAILY_BONUS_TABLE` (2/3/5/8 bài) | chạy thật |
| Level | 2 hệ lệch nhau — flag bug, fix ở SP6 | `gamification.ts:calculateLevelFromXp` (XP-based, API dùng) vs `levelSystem.ts` (lesson-based, `LevelDisplay.tsx` dùng) |

Bug đã biết (xử lý SP6, KHÔNG xóa `levelSystem.ts`/`mockData.ts` trong SP1):
- `levelSystem.ts` lesson-based lệch `gamification.ts` XP-based → UI hiển thị level sai so API.
- All-time leaderboard thiếu; badge `leaderboard_update` chưa auto; check-in chưa tự động khi submit; multiplier XP theo loại bài thiếu; giới hạn retake/ngày thiếu.

## 4. Database hiện tại (đã dọn + seed lại v1 sạch 18/06)

26 bảng, schema khớp `DATA_SEED_PLAN.md` mục 4. Chi tiết:
- Audit + sửa: `PLAN/02_Database_And_Data/DB_AUDIT_REPORT.md`.
- Cấu trúc v2 mục tiêu: `PLAN/02_Database_And_Data/LESSON_SYLLABUS_STRUCTURE.md` (30 nhóm/112 bài, 4 chủ đề).

Trạng thái v1 đang chạy: 4 topic, 25 sound group, 44 phoneme, 100 exercise, 25 learning map, 94 QuestionBankItem, 120 question. 5/25 nhóm có content đầy đủ, 20 nhóm shell DRAFT. Seed chính: `frontend/prisma/seed_lessons.ts` (idempotent, fetch audio thật từ Free Dictionary API).

## 5. Cấu trúc IPA v2 (mục tiêu, thực hiện SP2–SP4)

| Chủ đề | Nhóm | Bài | Chế độ |
|---|---:|---:|---|
| 1. Nguyên âm (đơn 6 + đôi 4) | 10 | 40 | 4 chế độ chuẩn |
| 2. Phụ âm (5 tầng) | 12 | 48 | 4 chế độ chuẩn |
| 3. Minimal Pairs Khó (mở khóa sau CĐ1+2) | 4 | 16 | 4 chế độ chuẩn, 10 câu/bài |
| 4. Trọng âm & Nối âm | 4 | 8 | 2 mode đặc thù (A nghe/chọn + B đọc/so khớp nhiều dạng) |
| **Tổng** | **30** | **112** | |

## 6. Roadmap thực tế — 6 sub-project (SP1–SP6)

| SP | Nội dung | Trạng thái |
|---|---|---|
| SP1 | Dọn PLAN stale + xóa orphan + tạo file này | đang thực hiện |
| SP2 | Data layer v2: schema thêm trường CĐ4 + unlock + `Topic.orderIndex`; catalog 30 nhóm | chờ |
| SP3 | Content + seed v2: 20 nhóm DRAFT + 4 nhóm CĐ4; re-seed | chờ |
| SP4 | Exercise Engine v2: 4 UI mới (tap-stress/weak/linking/assimilation) + Mode B multi-answer + scoring multiplier/retake | chờ |
| SP5 | Admin CRUD QuestionBank/Phoneme/WordItem/SoundGroup/MinimalPair/SentenceItem | chờ |
| SP6 | Gamification补全: fix level 2 hệ, all-time leaderboard, auto badge, check-in auto, unlock CĐ3, mailer (tùy chọn) | chờ |

Đối chiếu `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` (roadmap phase cũ): Phase 1–5 + 7-read đã có code; Phase 6, 8 đang dở — SP2–SP6 là kế hoạch nâng v2 đè lên các phase còn dở.

## 7. Nguồn ưu tiên đọc khi code

1. `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` (file này)
2. `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`
3. `PLAN/02_Database_And_Data/DB_AUDIT_REPORT.md`
4. `PLAN/02_Database_And_Data/LESSON_SYLLABUS_STRUCTURE.md`
5. `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md` (v1, còn dùng cho seed hiện tại)
6. `english_pronunciation_app/.agents/skills/<skill>/SKILL.md` (theo `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`)

## 8. Quy ước

- Prisma, không raw SQL; transaction cho thao tác phức tạp.
- TDD cho logic mới (scoring, gamification, generation). Dọn file/doc không cần TDD.
- Quality gate trước khi khai báo xong: `npx prisma validate` + `npx tsc --noEmit --pretty false` + `npm test` + `npm run build` — tất cả pass.
- Seed idempotent (upsert theo id), fetch audio thật cho `sourceType: FREE_API`.

## 9. Nguồn dữ liệu (SP3a, 18/06/2026)

- **IPA**: CMU Pronouncing Dictionary (open data) + Free Dictionary API (verify).
- **Audio mp3 (từ)**: Free Dictionary API (audio từ Wiktionary, CC-BY-SA 3.0) → tải về `frontend/public/audio/` qua `seed_audio_local.ts` (chạy 1 lần, idempotent). App runtime đọc audio local → tự chứa, không phụ thuộc API → an toàn bảo vệ phản biện.
- **Audio (câu)**: Web Speech API (`window.speechSynthesis`) runtime, voice cài trên trình duyệt.
- **Minimal pair / câu**: tự biên soạn (MANUAL), tham khảo phương pháp từ Ship or Sheep (Baker), English Pronunciation in Use (Hancock). KHÔNG copy text/audio sách.
- **Cambridge/Oxford**: chỉ đối chiếu IPA thủ công, KHÔNG scrape, KHÔNG lưu audio.
- **Credit**: ghi trong `frontend/README.md` + báo cáo khóa luận.
