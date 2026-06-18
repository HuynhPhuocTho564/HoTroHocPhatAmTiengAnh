# Báo cáo Audit Database so với PLAN

Ngày audit: 18/06/2026
Người thực hiện: AI assistant (ZCode)
Phạm vi: kiểm tra database PostgreSQL `english_app` so với `PLAN/02_Database_And_Data/` và schema Prisma.

## 0. Tóm tắt

| Giai đoạn | Kết quả |
|---|---|
| Audit trước khi sửa | Phát hiện 9 vấn đề (3 NGHIÊM TRỌNG, 2 CAO, 4 VỪA/NHẸ) |
| Hành động | B1 (dọn triệt để) + A (sửa seed) + C (báo cáo này) |
| Trạng thái sau khi sửa | ✅ Tất cả kiểm tra PASS, quality gate (validate + tsc + test + build) pass |

Schema thiết kế (`schema.prisma`) đã đúng từ đầu. Vấn đề nằm ở **dữ liệu đang chạy** sinh bởi seed đời trước.

## 1. Phần ĐÚNG (không cần sửa)

### 1.1. Schema Prisma
`english_pronunciation_app/frontend/prisma/schema.prisma` khớp với `DATA_SEED_PLAN.md` mục 4:
- Đủ các model kho dữ liệu: `Phoneme`, `SoundGroup`, `SoundGroupPhoneme` (n-n), `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Các trường yêu cầu "áp dụng thực tế cho khóa luận" đều có: `status`, `difficulty`, `sourceType`, `audioSource`, `sourceUrl`, `reviewNote`, `reviewedAt`.
- Cấu trúc bảng trong DB thực tế khớp schema (26 bảng, gồm cả join table `_ExerciseAudios`).

### 1.2. Không có xung đột 2 database
Backend Python (`english_pronunciation_app/backend`) chỉ có:
- `app/main.py`: 2 endpoint `/` và `/health`.
- `app/core/database.py`: `check_database()` test `SELECT 1`.
- **Không có model SQLAlchemy nào.**

→ Chỉ có 1 database PostgreSQL `english_app`, dùng chung. Không bị 2 DB song song.

## 2. Vấn đề phát hiện trước khi sửa

### 🔴 NGHIÊM TRỌNG 1 — Tất cả 124 bài tập gán sai vào 1 topic
- **Trước:** 100% `Exercise.topicId = topic-1` (Nguyên âm đơn). Trong khi `SoundGroup` gán đúng 4 topic.
- **Nguyên nhân:** `seed_lessons.ts` (bản cũ) dùng `prisma.topic.findFirst()` rồi gán mọi exercise vào topic đó.
- **Hệ quả:** Bài "Phụ âm /p/ /b/" hiện trong chủ đề "Nguyên âm đơn". Learning Map hiển thị sai phễu học → web "rối".
- **Trái kế hoạch:** `LESSON_CODING_PLAN.md` mục 5 (Phase E): "hiển thị đúng Chủ đề → Nhóm âm → 4 bài".

### 🔴 NGHIÊM TRỌNG 2 — `QuestionBankItem` = 0 dòng
- **Trước:** `QuestionBankItem: 0`, nhưng `Question: 83` được tạo trực tiếp, bỏ qua kho.
- **Trái kế hoạch:** `DATA_SEED_PLAN.md` mục 5 & 11 và `LESSON_CODING_PLAN.md` mục 2 nói rõ pipeline: `QuestionBankItem (kho nguồn) → generate Question (bài thật)`.
- **Hệ quả:** Mất tính năng "admin quản lý kho câu hỏi → rút ra tạo bài" — lý do chính để chọn "Cách B" trong plan. Admin Phase 7 không có dữ liệu để quản lý.

### 🔴 NGHIÊM TRỌNG 3 — 100% WordItem không có audio nhưng `status=ACTIVE`
- **Trước:** 26/26 WordItem `no_audio`, nhưng 26/26 `ACTIVE`.
- **Trái kế hoạch:**
  - `DATA_SEED_PLAN.md` mục 7: "Không lấy audio rỗng cho `listen_choose`".
  - Mục 8, Trường hợp 1: "Item thiếu audio → `status = NEEDS_REVIEW`, không đưa vào `listen_choose`".
- **Hệ quả:** 4 bài `listen_choose` đang `ACTIVE` (mỗi bài 5 câu) nhưng từ nguồn không có audio → học viên bấm "nghe" không có gì → bài vỡ.

### 🟠 CAO 4 — Topic bị trùng và sai tên (9 topic thay vì 4)
- **Trước:** DB có 9 topic: `topic-1`, `topic-1-monophthongs`, `topic-2`, `topic-2-diphthongs`, `topic-3`, `topic-3-consonants`, `topic-4`, `topic-4-hard-pairs`, `topic-5`. Cặp `topic-1`/`topic-1-monophthongs` trùng tên "Nguyên âm đơn"; `topic-3` ghi "Phụ âm vô thanh", `topic-4` ghi "Phụ âm hữu thanh" (sai — plan nói topic 4 là "Minimal Pairs khó"); `topic-5` ngoài kế hoạch.
- **Nguyên nhân:** 5 topic cũ (`topic-1..topic-5`) sót lại từ seed đời trước, chưa dọn.
- **Trái kế hoạch:** `LESSON_CODING_PLAN.md` mục 1: đúng 4 chủ đề.

### 🟠 CAO 5 — AnswerOption là placeholder giả "distractor1/2/3"
- **Trước:** 60 dòng `AnswerOption.content` = `distractor1` / `distractor2` / `distractor3`.
- **Nguyên nhân:** `seed_lessons.ts` (bản cũ): `const options = [word.word, "distractor1", "distractor2", "distractor3"]`.
- **Hệ quả:** Câu trắc nghiệm có 1 đáp án thật + 3 lựa chọn giả giống nhau mọi câu → bài quá dễ, không đo năng lực, không demo/bảo vệ được.

### 🟡 VỪA 6 — Số lượng seed thấp hơn kế hoạch MVP
`DATA_SEED_PLAN.md` mục 10 (cho 3 sound groups đầu):

| Loại | Kế hoạch | Thực tế (trước) |
|---|---:|---:|
| MinimalPair | 24–30 | 14 |
| WordItem | 48–60 | 26 |
| SentenceItem | 18 | 11 |

### 🟡 VỪA 7 — Dữ liệu thừa từ seed cũ
- `Exercise: 124` (plan: 100) → 24 bài thừa, có cả `status=LOCKED` (20 bài) — LOCKED không nằm trong schema default.
- `LearningMap: 33` (plan: 25) → 8 map thừa.
- `ExerciseAttempt: 1`, `Leaderboard: 4`, `User: 2` → dữ liệu test cũ lẫn vào.
- `SoundGroup: 25/25 = DRAFT` nhưng có `Exercise: 20 = ACTIVE` → mâu thuẫn trạng thái nội dung.

### 🟡 VỪA 8 — 3 file seed chồng chéo
`prisma/` có cả `seed.ts` (207 dòng), `seed_real.ts` (306 dòng), `seed_lessons.ts` (613 dòng). `package.json` chỉ chạy `seed_lessons.ts`. 2 file cũ còn đó gây nhầm "seed nào là chính", và việc chạy chồng seed đời trước là nguyên nhân tạo rác ở mục 4 & 7.

### ⚪ NHẸ 9 — Không có migration history
Dùng `prisma db push` (theo `DATA_SEED_PLAN.md` mục 11) thay vì `prisma migrate`. Đối với khóa luận, không có audit trail schema là điểm trừ nhỏ. Có thể làm sau.

## 3. Hành động đã thực hiện

Theo lựa chọn của bạn: **B1 (dọn triệt để) + A (sửa seed) + C (báo cáo này)**.

### 3.1. B1 — Dọn triệt để DB
- Tạo script `english_pronunciation_app/frontend/prisma/db_cleanup.ts`.
- `TRUNCATE` tất cả 26 bảng trong `public` schema + `CASCADE` + `RESTART IDENTITY`.
- Schema (cấu trúc bảng) không thay đổi, chỉ xóa dữ liệu.
- Xóa cả User/Leaderboard/Attempt/Badge test cũ (B1 = triệt để).
- Kết quả: 0 dòng ở 8 bảng chính.

### 3.2. A — Sửa `seed_lessons.ts`
Viết lại `english_pronunciation_app/frontend/prisma/seed_lessons.ts` với các sửa lỗi:

| Lỗi | Cách sửa |
|---|---|
| NGHIÊM TRỌNG 1 (topic) | `generateExercises` gán `topicId: sg.topicId` cho từng exercise, bỏ `findFirst()`. |
| NGHIÊM TRỌNG 2 (kho) | Thêm bước `seedQuestionBankItems()` tạo 94 QuestionBankItem (kho nguồn) trước; `generateQuestions` chỉ sinh Question từ kho. |
| NGHIÊM TRỌNG 3 (audio) | `seedWordItems` fetch audio thật từ Free Dictionary API (`api.dictionaryapi.dev`); item thiếu audio → `status=NEEDS_REVIEW`, không đưa vào `listen_choose`. |
| CAO 5 (distractor) | `buildDistractors` lấy distractor thật: ưu tiên cặp minimal pair của từ mục tiêu, sau đó các từ khác trong cùng sound group. Không còn "distractor1/2/3". |
| content JSON | `Question.content` lưu JSON chuẩn (`{word, ipa, audioUrl, hint, options}`) để `ExerciseEngineClient` render đúng (bản cũ lưu plain text). |

Đặc điểm: dùng `upsert` theo id cố định → idempotent, chạy lại không sinh trùng. `AnswerOption` có `deleteMany` trước khi tạo để re-run sạch.

### 3.3. C — Báo cáo audit
File này.

## 4. Kết quả sau khi sửa (verified)

Script verify (read-only, đã xóa sau khi chạy) kiểm tra tất cả quy tắc:

```
=== CORE COUNTS ===
   Topics=4  SG=25  Phonemes=44  MinimalPairs=17
   WordItems=34  Sentences=14  QBI=94
   Exercises=100  Questions=120  AnswerOptions=108  Maps=25  Users=0

=== KIỂM TRA KHỚP KẾ HOẠCH ===
   ✓ Topic = 4
   ✓ SoundGroup = 25
   ✓ Phoneme = 44
   ✓ Exercise = 100 = 25x4
   ✓ LearningMap = 25
   ✓ QuestionBankItem > 0 (sửa lỗi NGHIÊM TRỌNG 2) = 94
   ✓ User = 0 (dọn triệt để B1)

=== Exercise theo topicId (sửa lỗi NGHIÊM TRỌNG 1) ===
   topic-1-monophthongs: 24   (6 nhóm x 4 mode)
   topic-2-diphthongs: 16     (4 nhóm x 4 mode)
   topic-3-consonants: 44     (11 nhóm x 4 mode)
   topic-4-hard-pairs: 16     (4 nhóm x 4 mode)
   ✓ Exercise phân bổ vào 4 topic
   ✓ Số exercise/topic đúng kế hoạch: 24/16/44/16 = 100

=== Sửa lỗi CAO 5: distractor ===
   ✓ AnswerOption "distractor*" = 0
   Mẫu AnswerOption thật: shape, sharp, feel, ship, sheep, spot

=== Sửa lỗi NGHIÊM TRỌNG 3: audio + status ===
   ✓ WordItem ACTIVE thiếu audio = 0
   WordItem ACTIVE có audio: 25, NEEDS_REVIEW (thiếu audio): 9
   ✓ Câu listen_choose ACTIVE thiếu audio = 0 (thiếu=0, có=27)
   ✓ Exercise ACTIVE nhưng không có câu ACTIVE = 0
   ✓ Topic id đúng 4 chủ đề mới
   ✓ Question.content (speak) là JSON hợp lệ cho engine render

=== KẾT QUẢ: TẤT CẢ PASS ✅ ===
```

### 4.1. Giải thích số liệu
- **MinimalPairs=17, WordItems=34:** catalog `lesson-content.ts` định nghĩa 18 cặp / 36 từ; 1 cặp `hot/taught` bị bỏ vì `taught` không có trong word list (chỉ có `caught`); 2 từ trùng (`sheep`, `ship` xuất hiện ở cả topic 1 và topic 4) được gộp do `@@unique([word, ipa, phonemeId])`. Đây là hành vi đúng của schema, không phải lỗi.
- **NEEDS_REVIEW=9:** 9 từ (`bit`, `bet`, `bat`, `cap`, `cab`, `cat`, `cad`, `back`, `bag`) Free Dictionary API không trả về audio. Đã giữ `NEEDS_REVIEW` và không đưa vào `listen_choose` đúng quy tắc. Cần bổ sung audio local/manual sau (xem mục 5).
- **QBI=94, Questions=120:** kho nguồn có 94 item; 120 câu hỏi sinh ra (listen_choose tạo cả AnswerOption, các mode khác 1 câu/bank item). Số chênh vì 1 số bank item NEEDS_REVIEW không sinh Question ACTIVE.

### 4.2. Quality gate (theo `LESSON_CODING_PLAN.md` mục 5)
| Bước | Kết quả |
|---|---|
| `npx prisma validate` | ✅ Schema valid |
| `npx tsc --noEmit --pretty false` | ✅ Không lỗi type (gồm cả `prisma/seed_lessons.ts`) |
| `npm test` | ✅ 17/17 pass |
| `npm run build` | ✅ Build thành công (Next.js 16.2.7, 24 route) |

## 5. Việc còn lại (không nằm trong phạm vi audit, gợi ý)

1. **Audio cho 9 từ NEEDS_REVIEW** (`bit/bet/bat/cap/cab/cat/cad/back/bag`): Free Dictionary API không có. Nên ghi âm local hoặc tìm nguồn mở khác, rồi đổi `status` sang `ACTIVE` để thêm vào `listen_choose`. Có thể làm qua admin Phase 7 hoặc script bổ sung.
2. **Chuyển sang `prisma migrate dev`** (NHẸ 9): để có migration history phục vụ báo cáo khóa luận.
3. **Xóa 2 file seed cũ** `seed.ts`, `seed_real.ts` (VỪA 8): tránh nhầm lẫn. Chỉ giữ `seed_lessons.ts` làm seed chính. Nên xác nhận lại trước khi xóa vì có thể còn tham chiếu.
4. **Seed sâu thêm** các nhóm còn DRAFT (VỪA 6): hiện 5/25 nhóm có content. Các nhóm còn `DRAFT` đã có shell exercise đúng vị trí, chỉ thiếu content — phù hợp làm theo Phase C trong `LESSON_CODING_PLAN.md`.

## 6. File đã tạo/sửa

| File | Hành động | Mục đích |
|---|---|---|
| `english_pronunciation_app/frontend/prisma/db_cleanup.ts` | tạo mới | Script dọn triệt để DB (B1) |
| `english_pronunciation_app/frontend/prisma/seed_lessons.ts` | viết lại | Seed đúng: topic, distractor thật, QuestionBankItem, audio thật, content JSON (A) |
| `PLAN/02_Database_And_Data/DB_AUDIT_REPORT.md` | tạo mới | Báo cáo này (C) |
