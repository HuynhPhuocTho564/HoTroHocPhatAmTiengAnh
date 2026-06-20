# CURRENT_PROJECT_CONTEXT — Nguồn chân thực hiện tại

Ngày lập: 18/06/2026 (SP1)
Cập nhật: **20/06/2026** — đồng bộ trạng thái thực tế sau SP3b (CD2 12 nhóm) + SP3d (CD4 4 nhóm) + SP4 Mode A (4 UI CĐ4) + SP4 Mode B (acceptedAnswers) + SP7 Batch 1 partial (schema + helpers + tests, Task 1-3/13).
Thay thế: `PROJECT_CONTEXT.md`, `CURRENT_SYSTEM_STATUS.md`, `project_spec.md` (đã archive vào `PLAN/_Archive/`).

Đây là tài liệu nguồn chân thực về trạng thái dự án. Khi code/AI cần biết "hệ thống hiện có gì", đọc file này trước, rồi mới đến `ACTION_PLAN_NEXT_STEPS.md`, `DB_AUDIT_REPORT.md`, `LESSON_SYLLABUS_STRUCTURE.md`.

> ⚠️ **Naming collision — đọc kỹ trước khi dùng tên SP:**
> - "SP2" trong master roadmap = **Data layer v2** (schema + catalog) — ✅ ĐÃ XONG.
> - "SP2" trong `docs/superpowers/specs/2026-06-19-sp2-summary-redesign-design.md` = **summary screen redesin** (commit `0a46f06`) — đây là **subset của master SP4** (engine), KHÔNG phải master SP2.
> - "SP3a" = content CD1 (10 nhóm) + rút audio local — ĐÃ XONG (subset master SP3).
> - "SP3" (defer từ spec summary-redesign) = ý tưởng WPM/per-phoneme-route — **chưa làm, đang pause brainstorm**. Xem mục 10.
> Khi ai nói "SP2/SP3" phải làm rõ là master roadmap hay spec/plan riêng.

## 1. Tech stack thực tế

| Thành phần | Version / trạng thái | Bằng chứng |
|---|---|---|
| Next.js | 16.2.7 (App Router, Turbopack) | `frontend/package.json` |
| React | 18.3.1 | `frontend/package.json` |
| Prisma | 6.19.3 + `@prisma/client` 6.19.3 | `frontend/package.json` |
| Database | PostgreSQL `english_app` (1 DB duy nhất) | `frontend/.env` `DATABASE_URL` |
| Auth | next-auth v5 beta (`next-auth@5.0.0-beta.31`), Credentials + Google | `frontend/src/lib/auth.ts` |
| Audio UI | wavesurfer.js 7.12.7 | `frontend/package.json` |
| Confetti | canvas-confetti ^1.9.4 (SP2 summary) | `frontend/package.json` |
| CSS | Tailwind v4 (`@theme` trong `src/app/globals.css`, không có tailwind.config) | `frontend/src/app/globals.css` |
| Speech | Web Speech API (browser): `SpeechRecognition` (ghi âm) + `speechSynthesis` ("Nghe mẫu câu" sentence mode). KHÔNG có Whisper/ASR backend | `frontend/src/hooks/useSpeechRecognition.ts`, `ExerciseEngineClient.tsx` |
| Test runner | `tsx --test` (Node built-in `node:test` + `node:assert/strict`) | `frontend/package.json` script `test` |
| Backend Python | FastAPI 0.136.3 TỐI THIỂU — chỉ `/` và `/health`, KHÔNG có model/scoring/Whisper | `backend/app/main.py` |
| Node | v24.x | `npx prisma --version` |

## 2. Kiến trúc thực tế

- **Scoring nằm ở frontend**: `frontend/src/lib/scoring.ts` + `frontend/src/app/api/exercises/submit/route.ts` (transaction Prisma). KHÔNG có ASR backend.
- **Gamification nằm ở frontend**: `frontend/src/lib/gamification.ts` (XP, level, badge, leaderboard, daily bonus).
- **Backend FastAPI**: giữ tối thiểu cho `/health` (mục đích: đáp ứng đề cương có backend, mở rộng sau). Hiện là dead code tối thiểu, không xung đột DB (không có model SQLAlchemy).
- **1 database PostgreSQL** duy nhất — Prisma (frontend) là chủ. Backend chỉ `SELECT 1` check kết nối.
- **Exercise engine** đã tách component: `ExerciseEngineClient.tsx` (~1100 dòng) + `ListenFeedbackSheet.tsx` (feedback trong lúc làm, SP1) + `ExerciseSummaryScreen.tsx` (màn tổng kết 3-tier, SP2 summary) + 4 component Mode A CĐ4 (`TapStressQuestion`, `ChooseWeakQuestion`, `ChooseLinkingQuestion`, `ChooseAssimilationQuestion`) + `useSynthesisAudio.ts` helper.

## 3. Gamification đang chạy thật (NGƯỜI DÙNG YÊU CẦU GIỮ ĐẦY ĐỦ)

| Tính năng | Vị trí | Trạng thái |
|---|---|---|
| XP | `User.xp`, `gamification.ts:calculateLevelFromXp` | chạy thật |
| Điểm hạng / Leaderboard | `Leaderboard` type `tuan`/`thang` (CHƯA có all-time — SP6) | chạy thật |
| Streak | `User.streakCount/longestStreak/totalCheckIns/lastCheckInDate`, `api/checkin/route.ts` | chạy thật |
| Badge | `Badge`/`UserBadge`, `gamification.ts:BADGE_DEFINITIONS` (11 badge) | chạy thật |
| Daily check-in | `DailyActivity`, `api/checkin/route.ts` (+10 XP / +2 ranking) | chạy thật (NHƯNG chưa tự động khi submit — SP6) |
| Daily bonus | `gamification.ts:DAILY_BONUS_TABLE` (2/3/5/8 bài) | chạy thật |
| Auto badge | `checkAndAwardBadges` chạy submit (reason `exercise_submit`, all category) + checkin (reason `daily_checkin`, streak-only) | chạy thật |
| Expose streak/previousBest | submit API trả `previousBestScore` + `streak{count,longest}` (read-only, không update) — SP2 summary commit `0a46f06` | chạy thật |
| **Gem (💎)** | `User.gems`, `gamification.ts:computeGemReward(rating)` (EXCELLENT→+5) | ✅ code xong (SP7 Task 3), **chưa hook submit** (Task 4) |
| **Shop** | `gamification.ts:SHOP_ITEMS` (3 items: IPA Reveal 50💎, Slow Audio 20💎, Streak Freeze 10💎), `validateShopPurchase()` | ✅ code xong (SP7 Task 3), **chưa tạo route /api/shop** (Task 5) |
| **Streak Freeze** | `User.streakFreezes`, `gamification.ts:calculateNextStreak(last, streak, today, freezes)` | ✅ code xong + **đã hook checkin route** (SP7 Task 3) |
| **DailyQuest** | Schema `DailyQuest` model (userId, date, questType, target, progress, completed, rewardXp, rewardGems) | ✅ schema xong (SP7 Task 1), **chưa logic/UI** (Task 7-12) |
| Level | **2 hệ lệch nhau — flag bug SP6 CHƯA fix** | `gamification.ts:calculateLevelFromXp` (XP-based, API dùng, start level 1) vs `levelSystem.ts` (lesson-based, `LevelDisplay.tsx` dùng, start level 0) — off-by-one |

Bug/ thiếu đã biết (xử lý SP6, KHÔNG xóa `levelSystem.ts`/`mockData.ts`):
- `levelSystem.ts` lesson-based lệch `gamification.ts` XP-based → UI hiển thị level sai so API (off-by-one: 0 vs 1). **Chưa fix.**
- **All-time leaderboard thiếu** (`LeaderboardPeriodType` chỉ `tuan`/`thang`, `period.ts:1`).
- **Check-in chưa tự động khi submit** (submit route chỉ upsert `dailyActivity`, không update `streakCount`/`lastCheckInDate`; check-in là endpoint riêng).
- **CĐ3/CĐ4 unlock 80% chưa implement** (`unlockThresholdPercent` có trong catalog `lesson-catalog.ts` nhưng KHÔNG được consume để gating — `LearningMapClient.tsx` render tất cả topic clickable, chỉ disable khi `total === 0`).
- Multiplier XP theo loại bài thiếu; giới hạn retake/ngày thiếu.

## 4. Database hiện tại (catalog v2 đã seed)

26 bảng (+ DailyQuest mới SP7). **Catalog v2 ĐÃ thực hiện (SP2 data-layer xong)**: 4 topic + **30 sound group** + 44 phoneme + **112 exercise** (shell 30 nhóm) + 25 learning map + 433 QuestionBankItem + 278 question.

**Content thực tế (xác minh 20/06):**

| Chủ đề | Nhóm có content | Trạng thái |
|---|---|---|
| CĐ1 Nguyên âm (10 nhóm) | **10/10** | ✅ Hoàn thành SP3a (g01–g10, 93 từ) |
| CĐ2 Phụ âm (12 nhóm) | **12/12** | ✅ MỚI — SP3b hoàn thành (g01–g12, ~120 từ + 69 cặp + ~60 câu) |
| CĐ3 Minimal Pairs Khó (4 nhóm) | **2/4** (g01 front-vowel-mix, g03 final-drop) | 🟠 2 nhóm còn shell (g02, g04) |
| CĐ4 Trọng âm & Nối âm (4 nhóm) | **4/4** | ✅ MỚI — SP3d hoàn thành (g01 word-stress có words, g02/03/04 có sentences) |
| **Tổng** | **28/30** | Chỉ còn 2 nhóm CD3 (g02, g04) |

Seed chính: `frontend/prisma/seed_lessons.ts` (idempotent). Content map: `prisma/lesson-content.ts` (`LESSON_CONTENT_BY_SOUND_GROUP`, **28 keys**). Test `src/lib/__tests__/lesson-content.test.ts` threshold `>=10` (thực tế 28).

## 5. Cấu trúc IPA v2 (mục tiêu — catalog ĐÃ xong, content GẦN XONG)

| Chủ đề | Nhóm | Bài | Chế độ | Content |
|---|---:|---:|---|---|
| 1. Nguyên âm (đơn 6 + đôi 4) | 10 | 40 | 4 chế độ chuẩn | ✅ 10/10 |
| 2. Phụ âm (5 tầng: Plosives/Fricatives/Affricates/Nasals/Approximants) | 12 | 48 | 4 chế độ chuẩn | ✅ **12/12** MỚI |
| 3. Minimal Pairs Khó (mở khóa sau CĐ1+2 @80%) | 4 | 16 | 4 chế độ chuẩn, 10 câu/bài | 🟠 2/4 (g02, g04 thiếu) |
| 4. Trọng âm & Nối âm | 4 | 8 | 2 mode đặc thù (A nghe/chọn + B đọc/so khớp `acceptedAnswers`) | ✅ **4/4** MỚI |
| **Tổng** | **30** | **112** | | **28/30** |

Unlock threshold: 0/80/80/80 (CĐ1 mở/free, CĐ2/CĐ3/CĐ4 cần 80% chủ đề trước) — **định nghĩa trong catalog nhưng CHƯA implement gating** (xem bug SP6 mục 3).

## 6. Roadmap thực tế — 7 sub-project (SP1–SP7) — trạng thái 20/06

Tổng ước lượng: **~42% → ~72%** (tăng ~30 điểm so snapshot 18/06). Test: **55 → 74+** (catalog v2, content CĐ1-4, listen-choose-builder, IPA exact-match, scoring SP4, gamification SP7, sfx, confetti). Build OK xuyên suốt.

| SP | Nội dung | Snapshot 19/06 | **Hiện 20/06** | Bằng chứng |
|---|---|---|---|---|
| SP1 | Dọn PLAN stale + xóa orphan + tạo file này | 100% | **100%** ✅ | Không đổi |
| SP2 | Data layer v2: schema 7 trường + catalog 30 nhóm + seed | ~100% | **100%** ✅ | Không đổi |
| SP3 | Content + seed v2: biên soạn 30 nhóm | ~40% | **~93%** 🟠 | **MỚI**: SP3b CD2 12/12 ✅ + SP3d CD4 4/4 ✅. **28/30 nhóm có content**. Còn 2 nhóm CD3 (g02, g04) |
| SP4 | Exercise Engine v2: 4 UI CĐ4 + Mode B + scoring multiplier/retake | ~70% | **~85%** 🟠 | **MỚI**: 4 UI Mode A CĐ4 (`TapStress/ChooseWeak/ChooseLinking/ChooseAssimilation`) ✅ + Mode B `acceptedAnswers` ✅ + mic-denied UX fix ✅. **Còn: scoring multiplier/retake limit** |
| SP5 | Admin CRUD QuestionBank/Phoneme/WordItem/SoundGroup/MinimalPair/SentenceItem + users + badges-config | ~40% | **~40%** ⏸ | Không đổi. 5 model CRUD. **0/6 model kho + users + badges-config chưa đụng** |
| SP6 | Gamification补全: fix level 2 hệ, all-time leaderboard, check-in auto, unlock CĐ3 80% | ~76% | **~76%** ⏸ | Không đổi |
| **SP7** | **Gamification 3 yếu tố: Gem+Shop / Daily Quests / Streak Freeze** | — | **~23%** 🟠 | **MỚI**: Task 1 (schema ✅) + Task 2 (4 test TDD ✅) + Task 3 (helpers + checkin hook ✅). **Còn Task 4-13** (submit gem hook, shop route, quest logic, UI, engine unlock) |
| v1 nền tảng | Auth/scoring/submit/UI | ~88% | **~90%** | SP4 Mode A/B cải thiện UX |

### Cổ phần còn lại (~28%, deadline 28/06 — còn ~8 ngày)

| Ưu tiên | Việc | Khối lượng | Rủi ro |
|---|---|---|---|
| 🔴 | SP7 Task 4-13 (gem hook submit, shop route, quest logic + UI + engine unlock) | 10 task, phức tạp | Trung (logic mới + UI mới) |
| 🟠 | SP6 — unlock CĐ3 gating + fix level 2 hệ + all-time leaderboard + check-in auto | Vừa | Thấp-Trung |
| 🟠 | SP3 — 2 nhóm CD3 còn thiếu (g02, g04) | Nhỏ | Thấp |
| 🟡 | SP4 — scoring multiplier/retake limit | Nhỏ | Thấp |
| 🟡 | SP5 — admin 6 model kho + users + badges-config | Nhiều route+UI | Thấp (không chặn demo lõi) |

### Khuyến nghị 8 ngày tới

1. **SP7 là ưu tiên cao nhất** — 10 task còn lại (Task 4-13). Batch 1 (gem hook + shop route) trước, Batch 2 (quests + UI) sau.
2. **SP6 unlock CĐ3 + fix level 2 hệ** nên làm sớm (ảnh hưởng UX demo: level sai hiển thị, CĐ3 không khóa đúng).
3. **SP3 2 nhóm CD3** — nhỏ, có thể làm nhanh khi cần lấp đầy content.
4. **SP5 để cuối** (thịt thêm, không chặn demo).
5. **Demo data đã dọn sạch** (20/06) — cần tạo admin user hoặc register mới để test. Pipeline re-seed: `db_cleanup → seed_lessons → seed_audio_local → seed_listen_choose_audio → seed_demo_user`.

Đối chiếu `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` (roadmap phase cũ): Phase 1–5 + 7-read đã có code; Phase 6, 8 đang dở — SP2–SP6 là kế hoạch nâng v2 đè lên các phase còn dở.

## 7. Spec & plan docs (superpowers workflow)

Spec/plan lưu tại `docs/superpowers/specs/` + `docs/superpowers/plans/` (format `YYYY-MM-DD-<topic>-design.md` / `.md`). Danh sách 20/06:

| Topic | Spec | Plan | Trạng thái |
|---|---|---|---|
| SP1 cleanup + orphan | `2026-06-18-sp1-cleanup-plan-and-orphan-code-design.md` | `.md` | ✅ done |
| SP1 in-exercise feedback | `2026-06-18-sp1-in-exercise-feedback-design.md` | `.md` | ✅ done |
| SP2 data-layer v2 (master) | `2026-06-18-sp2-data-layer-v2-design.md` | `.md` | ✅ done |
| listen_choose 3-stage phoneme ID | `2026-06-18-listen-choose-3stage-phoneme-id-design.md` | `.md` | ✅ done |
| SP3a content CD1 + audio local | `2026-06-18-sp3a-content-cd1-audio-local-design.md` | `.md` | ✅ done |
| SP3a-fix subcategory + back button | `2026-06-18-sp3a-fix-subcategory-back-button-design.md` | `.md` | ✅ done |
| SP2 summary-redesign (engine subset) | `2026-06-19-sp2-summary-redesign-design.md` | `2026-06-19-sp2-summary-redesign.md` | ✅ done |
| SP3b content CD2 (12 nhóm Phụ âm) | `2026-06-19-sp3b-content-cd2-design.md` | `2026-06-19-sp3b-content-cd2.md` | ✅ done |
| SP3b pilot sentence IPA | `2026-06-19-sp3b-pilot-sentence-ipa-design.md` | — | ✅ done |
| SP3d content CD4 (4 nhóm Trọng âm & Nối âm) | `2026-06-19-sp3d-content-cd4-design.md` | `2026-06-19-sp3d-content-cd4.md` | ✅ done |
| SP4 Mode A CĐ4 UI (4 dạng listen-style) | `2026-06-19-sp4-modea-cd4-ui-design.md` | `2026-06-19-sp4-modea-cd4-ui.md` | ✅ done |
| SP4 Mode B acceptedAnswers multi-answer | `2026-06-19-sp4-modeb-accepted-answers-design.md` | `2026-06-19-sp4-modeb-accepted-answers.md` | ✅ done |
| SP4a voice waveform + speak feedback | `2026-06-19-sp4a-voice-redesign-waveform-design.md` + `sp4a-speak-feedback-bottomsheet-design.md` + `sp4a-minimalpairs-waveform-retake-design.md` | `.md` | ✅ done |
| **SP7 gamification 3 yếu tố** | `2026-06-19-sp7-gamification-3-elements-design.md` | `2026-06-19-sp7-gamification-3-elements.md` | 🟠 **Task 1-3/13 done** |
| SP3 (defer — WPM/phoneme route) | — | — | ⏸ pause brainstorm (xem mục 11) |

## 8. Nguồn ưu tiên đọc khi code

1. `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` (file này)
2. `docs/superpowers/specs/` + `docs/superpowers/plans/` (chi tiết từng feature)
3. `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`
4. `PLAN/02_Database_And_Data/DB_AUDIT_REPORT.md`
5. `PLAN/02_Database_And_Data/LESSON_SYLLABUS_STRUCTURE.md`
6. `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md` (v1, còn dùng cho seed hiện tại)
7. `english_pronunciation_app/.agents/skills/<skill>/SKILL.md` (theo `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`)

## 9. Quy ước

- Prisma, không raw SQL; transaction cho thao tác phức tạp.
- TDD cho logic mới (scoring, gamification, generation, builder). Dọn file/doc không cần TDD.
- Test runner `tsx --test`, pattern `node:test` + `node:assert/strict` (xem `src/lib/__tests__/sfx.test.ts` làm mẫu mock `window`).
- Quality gate trước khi khai báo xong: `npx prisma validate` + `npx tsc --noEmit` + `npm test` + `npm run build` — tất cả pass.
- Seed idempotent (upsert theo id), fetch audio thật cho `sourceType: FREE_API`.
- Component tách ra file riêng khi engine phình (pattern `ListenFeedbackSheet` / `ExerciseSummaryScreen`).

## 10. Nguồn dữ liệu (SP3a, 18/06/2026)

- **IPA**: CMU Pronouncing Dictionary (open data) + Free Dictionary API (verify).
- **Audio mp3 (từ)**: Free Dictionary API (audio từ Wiktionary, CC-BY-SA 3.0) → tải về `frontend/public/audio/` qua `seed_audio_local.ts` (chạy 1 lần, idempotent). App runtime đọc audio local → tự chứa, không phụ thuộc API → an toàn bảo vệ phản biện.
- **Audio (câu)**: Web Speech API (`window.speechSynthesis`) runtime, voice cài trên trình duyệt.
- **Minimal pair / câu**: tự biên soạn (MANUAL), tham khảo phương pháp từ Ship or Sheep (Baker), English Pronunciation in Use (Hancock). KHÔNG copy text/audio sách.
- **Cambridge/Oxford**: chỉ đối chiếu IPA thủ công, KHÔNG scrape, KHÔNG lưu audio.
- **Credit**: ghi trong `frontend/README.md` + báo cáo khóa luận.

## 11. SP3 (defer) — note cho session sau

Spec SP2 summary-redesign có section "Defer SP3" mô tả **SAI thực tế** (cần sửa khi tiện):
- "WPM (Mode D)" → **Mode D không tồn tại**. Có 6 mode: `listen_choose`, `speak_word`, `speak_minimal_pair`, `speak_sentence`, `mode_a_listen_choose` (CĐ4), `mode_b_speak_match` (CĐ4). `fluencyScore` là column reserved-but-unused.
- "per-phoneme coloring (Mode B)" → **Mode B không phải per-phoneme** (CĐ4 read&match `acceptedAnswers`). Per-phoneme coloring **đã có** trong `listen_choose` (`ListenFeedbackSheet.tsx:55-66` highlight target + Stage 2 skeleton).
- "route theo phoneme" → **đúng, chưa có** — feature thực sự.

3 sub-project độc lập (nếu làm, mỗi cái 1 spec riêng, KHÔNG gộp):
- **A** WPM/fluency mode mới — lớn nhất, rủi ro cao (SpeechRecognition timing không chuẩn cross-browser).
- **B** Route theo phoneme ("/θ/ cụ thể") — giá trị rõ learner VN, data `targetPhoneme` đã có trong content JSON, rủi ro thấp. **Khuyến nghị khi resume.**
- **C** Per-phoneme coloring polish — nhỏ, gộp được vào B.

Brainstorming pause ở bước chọn scope A/B/C (19/06). Khi resume: hỏi user chốt scope, rồi theo flow brainstorming skill.

## 12. Database state (20/06/2026)

**Demo data đã dọn sạch** (20/06): 0 user, 0 role, 0 gamification data. Content data nguyên vẹn (28/30 nhóm).

**Pipeline re-seed chuẩn:**
```bash
cd english_pronunciation_app/frontend
npx tsx prisma/db_cleanup.ts          # TRUNCATE tất cả
npm run db:seed:lessons               # Seed lessons (28/30 nhóm content)
npx tsx prisma/seed_audio_local.ts    # Rút mp3 local (idempotent, 197 file)
npx tsx prisma/seed_listen_choose_audio.ts  # Bake contrast audio
npx tsx prisma/seed_demo_user.ts      # Tạo Admin demo user (demo@pronunciation.app)
```

> ⚠️ `seed_demo_data.ts` (7 fake learners + gamification data) vẫn còn trên disk nhưng **không nên chạy** nếu muốn dữ liệu thật. User register qua `/register` để tạo account thật.
