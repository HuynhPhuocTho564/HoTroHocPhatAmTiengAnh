# Frontend — Web_HoTroPhatAmEN (English Pronunciation App)

Ứng dụng học phát âm tiếng Anh cho người Việt, xây dựng bằng Next.js 16 + Prisma + PostgreSQL.

## Cài đặt

1. Cài dependencies: `npm install`
2. Cấu hình `DATABASE_URL` trong `.env` (PostgreSQL).
3. Tạo/cập nhật schema: `npx prisma db push`
4. (Tùy chọn) dọn DB sạch: `npx tsx prisma/db_cleanup.ts`
5. Seed content (topic/nhóm/exercise/question): `npm run db:seed:lessons`
6. **Tải audio mp3 về local** (chạy 1 lần, idempotent): `npx tsx prisma/seed_audio_local.ts`
7. Chạy dev: `npm run dev`

## Nguồn dữ liệu

- **IPA**: CMU Pronouncing Dictionary (open data) + Free Dictionary API (verify).
- **Audio mp3 (từ)**: Free Dictionary API (audio từ Wiktionary, CC-BY-SA 3.0) → tải về `public/audio/` qua `seed_audio_local.ts` (chạy 1 lần, idempotent). App runtime đọc audio local → tự chứa, không phụ thuộc API runtime → an toàn khi bảo vệ phản biện (không rớt mạng).
- **Audio (câu)**: Web Speech API (`window.speechSynthesis`) runtime, voice cài trên trình duyệt Chrome/Edge.
- **Minimal pair / câu**: tự biên soạn (MANUAL), tham khảo phương pháp từ Ship or Sheep (Baker), English Pronunciation in Use (Hancock). **KHÔNG copy text/audio sách** (bản quyền).
- **Cambridge/Oxford**: chỉ đối chiếu IPA thủ công, KHÔNG scrape, KHÔNG lưu audio.

## Lưu ý

- Audio mp3 **KHÔNG commit** vào git (`.gitignore`: `frontend/public/audio/*.mp3`). Chạy `seed_audio_local.ts` để tải về local.
- Một số từ Free Dictionary API không có audio → giữ `status: NEEDS_REVIEW`, không đưa vào `listen_choose` (theo `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md` mục 8).

## Credit

- Audio: Wiktionary (CC-BY-SA 3.0) via Free Dictionary API.
- IPA: CMU Pronouncing Dictionary.
- Phương pháp sư phạm: Ship or Sheep (Ann Baker), English Pronunciation in Use (Mark Hancock), Clear Speech (Judy B. Gilbert), English Phonetics and Phonology (Peter Roach).
