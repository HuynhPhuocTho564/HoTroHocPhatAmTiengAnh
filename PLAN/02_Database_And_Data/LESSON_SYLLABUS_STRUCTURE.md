# Cấu trúc Hệ thống học IPA (Syllabus v2 — mục tiêu)

Ngày ghi: 18/06/2026
Trạng thái: tài liệu mục tiêu (chưa triển khai vào catalog/seed).
Tài liệu liên quan: `LESSON_CODING_PLAN.md` (bản v1, 25 nhóm/100 bài — đang seed), `DATA_SEED_PLAN.md`, `DB_AUDIT_REPORT.md`.

> Ghi chú: đây là cấu trúc do người dùng chốt ngày 18/06/2026. Nó là **bản v2** khác với cấu trúc đang chạy (v1 ở `LESSON_CODING_PLAN.md`). Trạng thái hiện tại đã được dọn + seed lại theo v1 (xem `DB_AUDIT_REPORT.md`). Để hiện thực v2 cần cập nhật `lesson-catalog.ts`, `lesson-content.ts`, có thể thêm QuestionType/UI mới cho Chủ đề 4 (xem mục 5).

## Tổng quan

4 chủ đề, 30 nhóm, 112 bài.
- Chủ đề 1 — Nguyên âm: 10 nhóm, 40 bài.
- Chủ đề 2 — Phụ âm: 12 nhóm, 48 bài.
- Chủ đề 3 — Minimal Pairs Khó: 4 nhóm, 16 bài.
- Chủ đề 4 — Trọng âm & Nối âm: 4 nhóm, 8 bài (chế độ đặc thù).

Mỗi nhóm của Chủ đề 1–3 có 4 chế độ chuẩn: `listen_choose`, `speak_word`, `speak_minimal_pair`, `speak_sentence`.
Chủ đề 4 dùng 2 chế độ đặc thù riêng (Mode A trắc nghiệm nghe + Mode B đọc/so khớp).

---

## Chủ đề 1 — Nguyên âm (Vowels)

10 nhóm × 4 chế độ = 40 bài.

### 1.1 Nguyên âm đơn (Monophthongs) — 6 nhóm × 4 chế độ = 24 bài

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 1 | /iː/ & /ɪ/ | Dài & Ngắn phía trước |
| 2 | /e/ & /æ/ | Hẹp & Mở phía trước |
| 3 | /ɑː/ & /ʌ/ & /ə/ | Nhóm trung tâm (+ schwa) |
| 4 | /ɒ/ & /ɔː/ | Tròn ngắn & Tròn dài |
| 5 | /ʊ/ & /uː/ | Sau ngắn & Sau dài |
| 6 | /ɜː/ | Âm giữa đặc biệt (không có cặp) |

### 1.2 Nguyên âm đôi (Diphthongs) — 4 nhóm × 4 chế độ = 16 bài

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 1 | /eɪ/ & /aɪ/ | Kết thúc bằng /ɪ/ (nhóm lên) |
| 2 | /ɔɪ/ & /aʊ/ | /ɔɪ/ lên, /aʊ/ xuống-lên |
| 3 | /əʊ/ & /eə/ | Nhóm trung tâm |
| 4 | /ɪə/ & /ʊə/ | Kết thúc bằng schwa |

Tổng Chủ đề 1: 10 nhóm — 40 bài.

---

## Chủ đề 2 — Phụ âm (Consonants)

12 nhóm × 4 chế độ = 48 bài. Chia theo 5 tầng ngữ âm.

### TẦNG 1 — Plosives (Âm tắc)

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 1 | /p/ & /b/ | Bilabial (Môi hai bên) |
| 2 | /t/ & /d/ | Alveolar (Đầu lưỡi chân răng) |
| 3 | /k/ & /g/ | Velar (Cuống lưỡi) |

### TẦNG 2 — Fricatives (Âm xát)

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 4 | /f/ & /v/ | Labiodental (Môi răng) |
| 5 | /θ/ & /ð/ | Dental (Răng) ← khó nhất người Việt |
| 6 | /s/ & /z/ | Alveolar (Lợi) |
| 7 | /ʃ/ & /ʒ/ | Post-alveolar (Sau lợi) |
| 8 | /h/ | Glottal (Thanh hầu) ← không có cặp |

### TẦNG 3 — Affricates (Âm tắc xát)

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 9 | /tʃ/ & /dʒ/ | Post-alveolar |

### TẦNG 4 — Nasals (Âm mũi)

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 10 | /m/ /n/ /ŋ/ | 3 âm mũi học cùng nhau |

### TẦNG 5 — Approximants (Âm tiếp cận)

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 11 | /l/ & /r/ | Liquids ← khó nhất người Việt |
| 12 | /w/ & /j/ | Glides (Bán nguyên âm) |

Tổng Chủ đề 2: 12 nhóm — 48 bài.

---

## Chủ đề 3 — Minimal Pairs Khó

4 nhóm × 4 chế độ = 16 bài.
**Mở khóa sau khi hoàn thành Chủ đề 1 & 2.**

| Nhóm | Trọng tâm | Ghi chú |
|---|---|---|
| 1 | /iː/ vs /ɪ/ vs /e/ vs /æ/ | Nguyên âm phía trước dễ nhầm |
| 2 | /l/ vs /r/ vs /n/ | Phụ âm đầu từ dễ nhầm |
| 3 | /p-b/ /t-d/ /k-g/ cuối từ | Phụ âm cuối bị nuốt |
| 4 | /θ/ vs /s/ vs /t/ | Âm răng vs âm thay thế |

Đặc điểm khác biệt (so với Chủ đề 1–2):
- Từ phức tạp hơn, đa âm tiết.
- Mỗi bài 10 câu thay vì 8.
- Câu Thực Chiến dài 8–12 từ.

Tổng Chủ đề 3: 4 nhóm — 16 bài.

---

## Chủ đề 4 — Trọng âm & Nối âm (Stress & Connected Speech)

4 nhóm × 2 chế độ = 8 bài.
**Chế độ đặc thù, khác với 4 chế độ chuẩn của Chủ đề 1–3.**

### Nhóm 1: Word Stress (Trọng âm từ)

- **Mode A — Tap the Stress:** Nghe từ → bấm vào âm tiết được nhấn.
  - UI: chia từ thành khối — `[pho] [TO] [gra] [phy]`.
- **Mode B — Đọc từ đúng trọng âm:** Đọc từ → so khớp string.

### Nhóm 2: Weak Forms (Âm lướt / Từ chức năng)

- **Mode A:** Nghe câu → chọn từ nào bị đọc lướt thành /ə/.
  - can, to, for, and, at → /kən/ /tə/ /fə/ /ən/ /ət/.
- **Mode B:** Đọc cả câu → so khớp, chấp nhận nhiều dạng.

### Nhóm 3: Linking (Nối âm)

- **Mode A:** Nghe cụm từ → chọn cách phát âm đúng (trắc nghiệm).
  - C+V: "hold on" → /həʊl dɒn/.
  - C+C: "bad dog" → /bæ dɒg/ (không đọc 2 chữ d).
- **Mode B:** Đọc cụm từ → so khớp string.

### Nhóm 4: Assimilation & Elision (Biến âm & Nuốt âm)

- **Mode A:** Nghe câu tự nhiên → chọn câu vừa nghe.
  - /t/+/j/=/tʃ/: "meet you" → "meetcha".
  - /d/+/j/=/dʒ/: "did you" → "didja".
- **Mode B:** Đọc câu → chấp nhận nhiều dạng trong DB.
  - "did you eat yet" | "didju eat yet" | "dija eat yet".

Tổng Chủ đề 4: 4 nhóm — 8 bài.

---

## Tổng kết toàn hệ thống

| Chủ đề | Phân loại | Nhóm | Bài |
|---|---|---:|---:|
| 1. Nguyên âm | 1.1 Nguyên âm đơn (6 nhóm) | 6 | 24 |
| | 1.2 Nguyên âm đôi (4 nhóm) | 4 | 16 |
| | **Cộng Chủ đề 1** | **10** | **40** |
| 2. Phụ âm | 5 tầng (12 nhóm) | 12 | 48 |
| 3. Minimal Pairs Khó | Tổng hợp (4 nhóm) | 4 | 16 |
| 4. Trọng âm & Nối âm | 4 nhóm đặc thù | 4 | 8 |
| | **Tổng** | **30** | **112** |

---

## 5. So với trạng thái hiện tại (v1 đang seed) và việc cần làm để lên v2

Trạng thái hiện tại (đã dọn + seed lại theo `LESSON_CODING_PLAN.md` v1): **4 chủ đề, 25 nhóm, 100 bài**.
Cấu trúc v2 này: **4 chủ đề, 30 nhóm, 112 bài**.

Bảng chênh:

| Khía cạnh | v1 (hiện tại) | v2 (mục tiêu này) |
|---|---|---|
| Chủ đề 1 | "Nguyên âm đơn" — 6 nhóm (24 bài) | "Nguyên âm" — 10 nhóm (6 đơn + 4 đôi = 40 bài). Gộp nguyên âm đôi (v1 là Chủ đề 2) vào đây. |
| Chủ đề 2 | "Phụ âm" — 11 nhóm (44 bài) | "Phụ âm" — 12 nhóm (48 bài). Tách /h/ thành nhóm riêng, tách /w//j/ khỏi /h/, thêm cấu trúc 5 tầng. |
| Chủ đề 3 | "Minimal Pairs khó" (v1 là Chủ đề 4) — 4 nhóm (16 bài) | "Minimal Pairs Khó" — 4 nhóm (16 bài) nhưng: mở khóa sau CĐ1+2, 10 câu/bài, câu thực chiến 8–12 từ. |
| Chủ đề 4 | (v1 là Minimal Pairs khó) | **MỚI** — "Trọng âm & Nối âm" — 4 nhóm × 2 chế độ = 8 bài. |

Để hiện thực v2 (chưa làm, chỉ ghi kế hoạch):

1. **`lesson-catalog.ts`**: cập nhật `TOPICS` (đổi id/tên chủ đề), `SOUND_GROUPS` (30 nhóm với id/`topicId`/`orderIndex` mới), `PHONEMES` (đảm bảo đủ cho 12 nhóm phụ âm tách /h/ và /w//j/).
2. **`lesson-content.ts`**: thêm content cho các nhóm mới (đặc biệt 12 nhóm phụ âm hiện đang DRAFT, và 4 nhóm Chủ đề 4).
3. **Schema + QuestionType mới cho Chủ đề 4**: hiện schema chỉ có `qtype-1-mc`, `qtype-2-voice`, `qtype-3-minimal-pairs`. Chủ đề 4 cần:
   - `qtype-4-tap-stress` (Mode A Word Stress — UI bấm âm tiết).
   - `qtype-5-choose-weak` (Mode A Weak Forms — chọn từ bị lướt).
   - `qtype-6-choose-linking` (Mode A Linking — chọn phát âm đúng).
   - `qtype-7-choose-assimilation` (Mode A Assimilation — chọn câu vừa nghe).
   - Mode B các nhóm có thể tái dùng `qtype-2-voice` + `contentJson.mode` + chấp nhận nhiều dạng answer (cần logic so khớp nhiều đáp án trong `scoring.ts`).
4. **UI mới**: component "Tap the Stress" (chia từ thành khối âm tiết), UI chọn weak form, UI chọn linking/assimilation. Không nằm trong `ExerciseEngineClient` hiện tại.
5. **Logic mở khóa** Chủ đề 3: cần trường/trạng thái "đã hoàn thành CĐ1+CĐ2" trên user/progress (hiện chưa có). Mục 3.2 `LESSON_CODING_PLAN.md` đang nói "không khóa bài theo XP" — v2 yêu cầu khóa có điều kiện, cần quyết định lại.
6. **Re-seed**: sau khi cập nhật catalog, chạy `db_cleanup.ts` rồi `seed_lessons.ts` lại. Lưu ý 9 từ `NEEDS_REVIEW` hiện vẫn thiếu audio (xem `DB_AUDIT_REPORT.md` mục 5).

Quyết định cần chốt trước khi code v2 (xem `LESSON_CODING_PLAN.md` mục 9 để đối chiếu):
- Có giữ "không khóa theo XP" không, hay thêm khóa có điều kiện cho Chủ đề 3?
- Chủ đề 4 làm trong MVP hay để phase sau (vì cần QuestionType + UI mới)?
- ID convention cho 30 nhóm mới (gợi ý theo `LESSON_CODING_PLAN.md` mục 5: `map-t1-g01-i-ih`, `map-t2-g01-ei-ai`, `map-t4-g01-word-stress`...).
