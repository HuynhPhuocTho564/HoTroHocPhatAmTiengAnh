# Kế hoạch code bài học IPA theo 4 chủ đề

Ngày lập: 15/06/2026

## 1. Mục tiêu

Code hệ thống bài học phát âm theo cấu trúc 4 chủ đề:

| Chủ đề | Nhóm âm | Số bài | Vai trò |
|---|---:|---:|---|
| 1. Nguyên âm đơn | 6 | 24 | Nền tảng |
| 2. Nguyên âm đôi | 4 | 16 | Sau chủ đề 1 |
| 3. Phụ âm | 11 | 44 | Khối lượng lớn nhất |
| 4. Minimal Pairs khó | 4 | 16 | Tổng hợp, thực chiến sau 1-3 |

Tổng thiết kế đầy đủ: **25 nhóm âm, 100 bài** nếu mỗi nhóm có 4 chế độ.

Không code 100 bài thủ công trong component. Phải đi theo hướng:

```text
Lesson Catalog có cấu trúc
-> seed Phoneme/SoundGroup/WordItem/MinimalPair/SentenceItem/QuestionBankItem
-> generate Exercise/Question cố định cho MVP
-> Learning Map hiển thị theo Topic -> Nhóm âm -> Bài
-> Exercise Engine render theo QuestionType/contentJson
```

## 2. Trạng thái hiện tại của code

Đã có nền tảng phù hợp:

- `prisma/schema.prisma` đã có `Topic`, `LearningMap`, `Exercise`, `Question`, `QuestionType`, `AnswerOption`.
- Đã có kho dữ liệu IPA: `Phoneme`, `SoundGroup`, `SoundGroupPhoneme`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- `src/app/learning_map/page.tsx` đọc topic/map/exercise từ Prisma.
- `src/app/exercises/[id]/page.tsx` đọc câu hỏi thật từ Prisma.
- `src/app/exercises/[id]/ExerciseEngineClient.tsx` đã hỗ trợ:
  - `qtype-1-mc`: nghe/chọn đáp án.
  - `qtype-2-voice`: đọc từ hoặc câu.
  - `qtype-3-minimal-pairs`: đọc cặp minimal pair.
- `POST /api/exercises/submit` đã lưu attempt, chấm điểm, cộng XP/ranking/badge.

Khoảng trống chính:

- Seed hiện tại mới thiên về `/iː/` vs `/ɪ/`, chưa có catalog 4 chủ đề.
- Chưa có script generate bài học từ `QuestionBankItem`.
- Learning Map chưa hiển thị rõ số thứ tự chủ đề/nhóm theo syllabus mới.
- Engine chưa phân biệt rõ UI của `speak_sentence` với `speak_word` nếu cùng dùng `qtype-2-voice`.
- Chưa có quy trình review dữ liệu trước khi bật `ACTIVE`.

## 3. Nguyên tắc thiết kế bài học

### 3.1. Mỗi nhóm âm có 4 chế độ

Mỗi `SoundGroup` sinh 4 `Exercise`:

1. `listen_choose` - Luyện tai.
2. `speak_word` - Luyện miệng từ đơn.
3. `speak_minimal_pair` - Thử thách kép.
4. `speak_sentence` - Thực chiến trong câu.

Mapping kỹ thuật hiện tại:

| Chế độ | QuestionType hiện tại | Ghi chú |
|---|---|---|
| `listen_choose` | `qtype-1-mc` | Có audio, chọn IPA/từ đúng. |
| `speak_word` | `qtype-2-voice` | contentJson cần có `mode: "speak_word"`. |
| `speak_minimal_pair` | `qtype-3-minimal-pairs` | contentJson là cặp từ. |
| `speak_sentence` | `qtype-2-voice` hoặc thêm `qtype-4-sentence` | Nên thêm `mode: "speak_sentence"` trước, sau này tách QuestionType nếu cần. |

### 3.2. Không khóa bài theo XP

Giữ quyết định cũ: không khóa bài vì thiếu XP.

`LOCKED`/`DRAFT` chỉ nên hiểu là trạng thái nội dung chưa sẵn sàng, không phải khóa game.

### 3.3. Chủ đề 4 là tổng hợp

Chủ đề 4 không dạy âm mới.

Nó lấy các cặp khó nhất từ chủ đề 1-3 và tăng độ khó:

- Nhiều âm dễ nhầm trong cùng bài.
- Từ nhiều âm tiết hơn.
- Câu thực tế hơn.
- Tốc độ/chuỗi đọc dài hơn.

## 4. Cấu trúc nội dung cần seed

### Chủ đề 1 - Nguyên âm đơn: 6 nhóm, 24 bài

| Nhóm | Âm | Tên nhóm | Ghi chú |
|---|---|---|---|
| 1 | `/iː/` & `/ɪ/` | Dài & ngắn phía trước | ship/sheep |
| 2 | `/e/` & `/æ/` | Hẹp & mở phía trước | bed/bad |
| 3 | `/ɑː/` & `/ʌ/` & `/ə/` | Nhóm trung tâm | father/fun/about |
| 4 | `/ɒ/` & `/ɔː/` | Tròn ngắn & tròn dài | hot/horse |
| 5 | `/ʊ/` & `/uː/` | Sau ngắn & sau dài | full/fool |
| 6 | `/ɜː/` | Âm giữa đặc biệt | bird/word |

### Chủ đề 2 - Nguyên âm đôi: 4 nhóm, 16 bài

| Nhóm | Âm | Tên nhóm |
|---|---|---|
| 1 | `/eɪ/` & `/aɪ/` | Kết thúc bằng `/ɪ/` |
| 2 | `/ɔɪ/` & `/aʊ/` | `/ɔɪ/` lên, `/aʊ/` xuống-lên |
| 3 | `/əʊ/` & `/eə/` | Nhóm trung tâm |
| 4 | `/ɪə/` & `/ʊə/` | Kết thúc bằng schwa |

### Chủ đề 3 - Phụ âm: 11 nhóm, 44 bài

| Nhóm | Âm | Ghi chú |
|---|---|---|
| 1 | `/p/` & `/b/` | Bilabial |
| 2 | `/t/` & `/d/` | Alveolar tắc |
| 3 | `/k/` & `/g/` | Velar |
| 4 | `/f/` & `/v/` | Labiodental |
| 5 | `/s/` & `/z/` | Alveolar xát |
| 6 | `/ʃ/` & `/ʒ/` | Palato-alveolar |
| 7 | `/tʃ/` & `/dʒ/` | Affricate |
| 8 | `/θ/` & `/ð/` | Dental |
| 9 | `/m/` & `/n/` & `/ŋ/` | Âm mũi |
| 10 | `/l/` & `/r/` | Tiếp cận |
| 11 | `/w/` & `/j/` & `/h/` | Bán nguyên âm & âm hầu |

### Chủ đề 4 - Minimal Pairs khó: 4 nhóm, 16 bài

| Nhóm | Trọng tâm | Lý do |
|---|---|---|
| 1. Nguyên âm dễ nhầm | `/iː/` vs `/ɪ/` vs `/e/` vs `/æ/` | Người Việt hay gộp thành 1-2 âm. |
| 2. Phụ âm đầu từ dễ nhầm | `/l/` vs `/r/` vs `/n/` | Lỗi l/n và không uốn lưỡi `/r/`. |
| 3. Phụ âm cuối từ dễ bỏ | final `/p/` vs `/b/`, `/t/` vs `/d/`, `/k/` vs `/g/` | Người Việt hay nuốt phụ âm cuối. |
| 4. Âm răng & âm xát | `/θ/` vs `/s/` vs `/t/`, `/ð/` vs `/z/` vs `/d/` | Không có âm răng trong tiếng Việt. |

Ví dụ chủ đề 4:

- Nhóm 1: `ship/sheep/shape/sharp`, `bit/beat/bet/bat`, `fill/feel/fell/fall`.
- Nhóm 2: `light/right/night`, `lane/rain/name`, `lead/read/need`.
- Nhóm 3: `cap/cab`, `cat/cad`, `back/bag`, `rope/robe`, `white/wide`, `lock/log`.
- Nhóm 4: `think/sink/tink`, `three/tree/free`, `this/diss/dizz`, `there/dare`.

Lưu ý: `tink`, `diss`, `dizz`, `ther` là dạng minh họa lỗi/nonce word, không nên đưa thành từ thật nếu không giải thích. Khi seed MVP nên ưu tiên từ thật; nonce word chỉ dùng trong feedback hoặc câu hỏi nhận diện lỗi nếu cần.

## 5. Kế hoạch code theo phase

### Phase A - Chuẩn hóa Lesson Catalog

Mục tiêu: có một nguồn cấu hình duy nhất cho 4 chủ đề, 25 nhóm, 100 bài.

File dự kiến tạo:

- `english_pronunciation_app/frontend/prisma/lesson-catalog.ts`
- `english_pronunciation_app/frontend/prisma/lesson-content.ts`

Nội dung:

- `topics`: 4 topic.
- `soundGroups`: danh sách nhóm âm theo từng topic.
- `exerciseModes`: 4 mode chuẩn.
- `phonemes`: danh sách IPA cần dùng.
- `wordItems`, `minimalPairs`, `sentenceItems`: dữ liệu ban đầu.

Yêu cầu:

- Mỗi item có `status`, `difficulty`, `sourceType`, `sourceUrl`, `reviewNote`.
- Không dùng Cambridge/Oxford audio/text để seed trực tiếp nếu chưa có license.
- Dữ liệu tự biên soạn để `sourceType: "MANUAL"`.
- Audio từ Free Dictionary API thì `sourceType: "FREE_API"` và lưu `sourceUrl`.

### Phase B - Viết seed pipeline

Mục tiêu: seed được topic/map/exercise/question bank theo catalog.

File dự kiến tạo/sửa:

- Tạo `english_pronunciation_app/frontend/prisma/seed_lessons.ts`
- Sửa `english_pronunciation_app/frontend/package.json` nếu muốn thêm script seed riêng.
- Có thể giữ `prisma/seed_real.ts` làm lịch sử hoặc tách thành seed demo cũ.

Task:

- Upsert `QuestionType`:
  - `qtype-1-mc`
  - `qtype-2-voice`
  - `qtype-3-minimal-pairs`
  - tùy chọn `qtype-4-sentence` nếu muốn tách câu riêng.
- Upsert `Topic`.
- Upsert `Level`.
- Upsert `Phoneme`.
- Upsert `SoundGroup` và `SoundGroupPhoneme`.
- Upsert `WordItem`, `MinimalPair`, `SentenceItem`.
- Upsert `QuestionBankItem`.
- Generate `LearningMap` theo mỗi `SoundGroup`.
- Generate 4 `Exercise` theo mỗi `LearningMap`.
- Generate fixed `Question` cho từng `Exercise` từ `QuestionBankItem`.

Nguyên tắc MVP:

- Không cần seed đủ 100 bài đầy câu hỏi ngay.
- Nhưng cấu trúc catalog phải đủ 100 bài để Learning Map nhìn đúng.
- Các bài chưa đủ dữ liệu để `DRAFT` hoặc `LOCKED`.
- Bài demo để `ACTIVE`.

### Phase C - MVP dữ liệu để demo

Mục tiêu: có dữ liệu thực tế đủ sâu nhưng không quá tải.

Nên seed trước:

1. Chủ đề 1, nhóm `/iː/` & `/ɪ/`: đủ 4 bài, mỗi bài 5 câu.
2. Chủ đề 1, nhóm `/e/` & `/æ/`: đủ 4 bài, mỗi bài 5 câu.
3. Chủ đề 4, nhóm nguyên âm dễ nhầm: đủ 4 bài, mỗi bài 6-8 câu.
4. Chủ đề 4, nhóm phụ âm cuối: đủ 4 bài, mỗi bài 6-8 câu.

Lý do:

- Có bài nền tảng để demo học từ cơ bản.
- Có bài tổng hợp để chứng minh Learning Funnel của chủ đề 4.
- Khối lượng vừa đủ để test XP, điểm hạng, badge, leaderboard.

Các nhóm còn lại:

- Tạo topic/map/exercise shell.
- Để `DRAFT` nếu chưa có câu hỏi sạch.
- Không để `ACTIVE` nếu thiếu audio hoặc thiếu dữ liệu review.

### Phase D - Nâng cấp Exercise Engine cho mode rõ ràng

Mục tiêu: cùng `qtype-2-voice` nhưng UI biết đây là đọc từ hay đọc câu.

File cần sửa:

- `english_pronunciation_app/frontend/src/app/exercises/[id]/ExerciseEngineClient.tsx`
- `english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx`
- `english_pronunciation_app/frontend/src/lib/scoring.ts`

Task:

- Chuẩn hóa `contentJson` có trường:

```json
{
  "mode": "speak_word",
  "word": "ship",
  "ipa": "/ʃɪp/",
  "audioUrl": "...",
  "targetPhonemes": ["/ɪ/"],
  "hint": "Âm /ɪ/ ngắn, không kéo dài."
}
```

Với câu:

```json
{
  "mode": "speak_sentence",
  "sentence": "The ship is near the beach.",
  "targetWords": ["ship", "beach"],
  "targetPhonemes": ["/ɪ/", "/iː/"],
  "hint": "Đọc rõ sự khác nhau giữa ship và beach."
}
```

- Thêm parser an toàn cho `mode`.
- Nếu `mode = speak_sentence`, UI hiển thị câu lớn hơn và target words.
- Nếu `mode = speak_word`, UI giữ dạng từ đơn.
- Scoring MVP vẫn dùng transcript matching, không overclaim là chấm âm vị chuẩn tuyệt đối.

### Phase E - Learning Map UI theo syllabus

Mục tiêu: hiển thị đúng “Chủ đề -> Nhóm âm -> 4 bài”.

File cần sửa:

- `english_pronunciation_app/frontend/src/app/learning_map/page.tsx`
- `english_pronunciation_app/frontend/src/app/learning_map/LearningMapClient.tsx`
- `english_pronunciation_app/frontend/src/app/exercises/page.tsx`

Task:

- Sort topic theo số thứ tự chủ đề, không chỉ sort alphabet.
- Sort sound group theo `orderIndex`.
- Mỗi nhóm âm hiển thị:
  - tên nhóm,
  - IPA targets,
  - số bài active/draft,
  - tiến độ hoàn thành.
- Mỗi exercise hiển thị mode:
  - Luyện tai,
  - Luyện miệng,
  - Thử thách kép,
  - Thực chiến.
- Chủ đề 4 nên có nhãn “Tổng hợp sau chủ đề 1-3”.

Nếu cần sort ổn định, có thể thêm quy ước đặt tên/id:

```text
topic-1-monophthongs
topic-2-diphthongs
topic-3-consonants
topic-4-hard-minimal-pairs

map-t1-g01-i-ih
map-t4-g01-front-vowel-mix
```

### Phase F - Admin review dữ liệu

Mục tiêu: admin kiểm soát được dữ liệu trước khi bật bài.

File cần sửa/tạo:

- `english_pronunciation_app/frontend/src/components/admin/TopicLevelMapManagement.tsx`
- `english_pronunciation_app/frontend/src/components/admin/ExerciseManagement.tsx`
- Có thể tạo component mới:
  - `PhonemeManagement.tsx`
  - `QuestionBankManagement.tsx`
  - `WordItemManagement.tsx`

Task:

- Admin xem/sửa `Phoneme`.
- Admin xem/sửa `SoundGroup`.
- Admin xem/sửa `WordItem`, `MinimalPair`, `SentenceItem`.
- Admin đổi `status`: `DRAFT`, `NEEDS_REVIEW`, `ACTIVE`, `ARCHIVED`.
- Cảnh báo nếu `listen_choose` thiếu audio.
- Cảnh báo nếu `QuestionBankItem` chưa có source/review metadata.

Phase này có thể làm sau MVP nếu mục tiêu trước mắt là demo học tập.

### Phase G - Test và kiểm định dữ liệu

Mục tiêu: tránh seed sai hoặc UI vỡ khi dữ liệu lớn.

File test nên thêm:

- `english_pronunciation_app/frontend/src/lib/__tests__/lesson-catalog.test.ts`
- `english_pronunciation_app/frontend/src/lib/__tests__/question-bank-generation.test.ts`

Kiểm tra cần có:

- Mỗi topic có đúng số nhóm:
  - Topic 1: 6.
  - Topic 2: 4.
  - Topic 3: 11.
  - Topic 4: 4.
- Mỗi sound group sinh đủ 4 exercise mode.
- Không có `ACTIVE listen_choose` thiếu audio.
- Không có minimal pair trùng.
- Không có `Question` active thiếu `answer`.
- `QuestionType` trong seed khớp với engine.

Command quality gate:

```powershell
npx.cmd prisma validate
npx.cmd prisma generate
npx.cmd tsc --noEmit --pretty false
npm.cmd test
npm.cmd run build
```

## 6. Thứ tự thực hiện đề xuất

### Bước 1 - Không code UI vội

Tạo catalog và seed pipeline trước.

Lý do: nếu UI làm trước mà dữ liệu chưa chuẩn, sau này phải sửa lại component nhiều lần.

### Bước 2 - Seed shell đủ 100 bài

Mục tiêu: Learning Map có cấu trúc đầy đủ để demo kế hoạch học.

Trạng thái:

- `ACTIVE`: các bài có dữ liệu sạch.
- `DRAFT`: các bài chưa đủ câu hỏi.

### Bước 3 - Seed sâu 16 bài MVP

Ưu tiên:

- 8 bài nền tảng thuộc chủ đề 1.
- 8 bài tổng hợp thuộc chủ đề 4.

### Bước 4 - Nâng cấp engine theo `mode`

Sau khi có dữ liệu thật, sửa UI luyện bài theo dữ liệu.

### Bước 5 - Polish Learning Map

Hiển thị đúng phễu học tập:

```text
Nền tảng âm đơn/đôi/phụ âm
-> nhận diện và đọc đúng từng nhóm
-> chủ đề 4 tổng hợp các lỗi khó nhất
-> luyện trong từ/câu thực tế
```

## 7. File cần tạo/chỉnh khi bắt đầu code

### Seed/data

- Tạo `english_pronunciation_app/frontend/prisma/lesson-catalog.ts`
- Tạo `english_pronunciation_app/frontend/prisma/lesson-content.ts`
- Tạo `english_pronunciation_app/frontend/prisma/seed_lessons.ts`
- Sửa `english_pronunciation_app/frontend/package.json`
- Có thể sửa `english_pronunciation_app/frontend/prisma/schema.prisma` nếu cần thêm field sort rõ hơn.

### Runtime lesson

- Sửa `english_pronunciation_app/frontend/src/app/learning_map/page.tsx`
- Sửa `english_pronunciation_app/frontend/src/app/learning_map/LearningMapClient.tsx`
- Sửa `english_pronunciation_app/frontend/src/app/exercises/page.tsx`
- Sửa `english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx`
- Sửa `english_pronunciation_app/frontend/src/app/exercises/[id]/ExerciseEngineClient.tsx`
- Sửa `english_pronunciation_app/frontend/src/lib/scoring.ts`

### Admin

- Sửa `english_pronunciation_app/frontend/src/components/admin/ExerciseManagement.tsx`
- Sửa `english_pronunciation_app/frontend/src/components/admin/TopicLevelMapManagement.tsx`
- Sau MVP, tạo thêm admin quản lý question bank nếu cần.

### Plan/docs

- Cập nhật `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md`
- Cập nhật `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`
- Cập nhật `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md` nếu thêm phase riêng cho lesson catalog.

## 8. Skill cần đọc trước khi code

Bắt buộc:

- `english_pronunciation_app/.agents/skills/ipa-pronunciation-pedagogy/SKILL.md`
- `english_pronunciation_app/.agents/skills/question-bank-curator/SKILL.md`
- `english_pronunciation_app/.agents/skills/project-quality-gate/SKILL.md`

Nếu sửa schema:

- Đọc thêm skill PostgreSQL/Prisma nếu đã có trong bộ skill.

Nếu sửa UI bài học:

- Đọc thêm HCI/accessibility skill nếu đã có trong bộ skill.

## 9. Quyết định cần chốt trước khi code

1. Có chấp nhận tạo đủ shell 100 bài trong Learning Map không?
   - Đề xuất: có, nhưng chỉ active bài có dữ liệu sạch.
2. MVP seed sâu bao nhiêu bài?
   - Đề xuất: 16 bài, gồm 8 bài chủ đề 1 và 8 bài chủ đề 4.
3. Có thêm `qtype-4-sentence` không?
   - Đề xuất: chưa cần ngay. Dùng `qtype-2-voice` + `contentJson.mode = "speak_sentence"` trước.
4. Audio demo lấy từ đâu?
   - Đề xuất: Free Dictionary API nếu có audio, cộng fallback local/manual cho bài bảo vệ.
5. Có dùng từ minh họa không phải từ thật như `tink`, `dizz` không?
   - Đề xuất: không đưa vào MVP active; chỉ dùng như ví dụ lỗi trong ghi chú/feedback nếu cần.

## 10. Tiêu chí hoàn thành MVP bài học

MVP bài học được xem là xong khi:

- Learning Map hiển thị đủ 4 chủ đề.
- Chủ đề 1 và chủ đề 4 có bài `ACTIVE` đủ để demo.
- Mỗi bài active có ít nhất 5 câu.
- Làm bài xong lưu attempt thật.
- XP/ranking/badge vẫn chạy.
- Không có bài active thiếu câu hỏi.
- Không có listen question active thiếu audio.
- Typecheck, test, build đều pass.
