# Audit cac file trong PLAN

Ngay audit: 14/06/2026

## Ket luan nhanh

- Cac file ke hoach cu da duoc chuyen vao `PLAN` khong bi sua noi dung.
- Da kiem tra bang git blob hash: noi dung file cu va file moi trong `PLAN` trung nhau.
- Cac file moi duoc tao de dieu huong va lam nguon hien tai:
  - `PLAN/README.md`
  - `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`
  - `PLAN/05_AI_Skills/AI_SKILLS_INVENTORY.md`
  - `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`

## Nguon nen uu tien hien tai

| File | Trang thai | Ghi chu |
|---|---|---|
| `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` | Nen dung lam roadmap chinh | Duoc lap sau khi doc code hien tai, phu hop hon cac file cu. |
| `PLAN/00_Project_Context/DE_CUONG_DO_AN.md` | Nen giu lam nguon pham vi do an | Day la tai lieu de cuong, nen uu tien ve muc tieu hoc thuat. |
| `PLAN/02_Database_And_Data/KH_DATA_BAI_TAP_IPA.md` | Nen giu | Phu hop voi huong IPA/bai tap; bang `Phoneme` co the lam sau theo quyet dinh hien tai. |
| `PLAN/05_AI_Skills/AI_SKILLS_INVENTORY.md` | Nen dung khi code | Ghi ro project dang co skill nao va can doc skill nao truoc khi code. |
| `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md` | Nen dung khi code | Mapping phase nao can doc skill nao truoc khi sua code. |
| `PLAN/README.md` | Nen giu | Muc luc va quy tac sap xep tai lieu. |

## File dung duoc nhung can cap nhat truoc khi xem la chinh xac

| File | Van de chinh | Huong xu ly |
|---|---|---|
| `PLAN/00_Project_Context/CURRENT_SYSTEM_STATUS.md` | Co nhieu thong tin lich su; mot so muc da thay doi sau khi schema/database duoc cai tien. Van con ghi Next.js 14 trong khi package hien la Next 16.2.7. | Nen viet lai thanh `CURRENT_SYSTEM_STATUS_2026-06-14.md` sau khi chay lai typecheck/build. |
| `PLAN/00_Project_Context/PROJECT_CONTEXT.md` | Mo ta kien truc cu co SQLAlchemy, Whisper/openai-whisper, `/api/phonemes`; khong khop voi quyet dinh hien tai la FastAPI toi thieu va Web Speech API o browser. | Cap nhat thanh project context moi truoc khi dua cho AI doc. |
| `PLAN/00_Project_Context/project_spec.md` | Co mau thuan: tieu de noi gamification nhung lai ghi "Khong dung XP, khong co Streak"; thuc te schema da co `xp`, `level`, `DailyActivity`. | Nen sua lai hoac dua vao archive. |
| `PLAN/01_Roadmap/KE_HOACH_THUC_HIEN.md` | Ke hoach theo moc 01/06/2026, co noi dung FastAPI xu ly ASR/audio va Next.js 14. | Chi tham khao lich su, khong dung lam roadmap hien tai. |
| `PLAN/01_Roadmap/CAI_TIEN_LO_TRINH_IPA.md` | Y tuong lo trinh IPA tot, nhung co noi dung Whisper/FastAPI cham diem khong khop voi MVP hien tai. | Giu y tuong su pham, sua lai phan ky thuat sang Web Speech/Next API. |
| `PLAN/03_UI_UX/HCI_ACCESSIBILITY_AUDIT.md` | Audit cu, co the khong con dung voi code hien tai. | Can audit lai sau khi UI on dinh. |
| `PLAN/03_UI_UX/UI_COMPONENTS_GUIDE.md` | Huong dan component huu ich, nhung can doi chieu lai component that trong `src/components`. | Cap nhat sau Phase UI/UX. |
| `PLAN/03_UI_UX/COLOR_SYSTEM_GUIDE.md` | Co the giu lam dinh huong mau, nhung can doi chieu CSS/Tailwind hien tai. | Cap nhat sau khi chot UI. |
| `PLAN/04_Features/DAILY_CHECKIN_FEATURE.md` | Noi dung feature co ich, nhung can doi chieu voi API `/api/checkin` va model `DailyActivity` hien tai. | Cap nhat theo schema moi. |
| `PLAN/04_Features/STREAK_GAMIFICATION_GUIDE.md` | Co nhieu chi tiet streak, nhung co the lech voi luong check-in/submit bai that. | Dung lam tham khao khi lam Phase 3. |

## File nen dua vao Archive hoac chi de tham khao lich su

| File | Ly do |
|---|---|
| `PLAN/03_UI_UX/COLOR_SYSTEM.md` | File rong, khong co noi dung. |
| `PLAN/04_Features/ADMIN_ACCESS.md` | Co huong dan mock token `mock-token-123`, khong phu hop auth that. |
| `PLAN/05_AI_Skills/KH_AI_PROMPTS.md` | Prompt cu, nhac duong dan `project/PROJECT_CONTEXT.md` da khong con dung sau khi chuyen vao `PLAN`; nhieu prompt con dung Next.js 14. |
| `PLAN/05_AI_Skills/KH_VIBE_CODING.md` | Prompt cu, co noi "DB chua co `xp`, `level`" trong khi schema hien da co. |

## File co the giu nguyen

| File | Ly do |
|---|---|
| `PLAN/01_Roadmap/PDCA.md` | Tai lieu quy trinh ngan, khong gay mau thuan lon. |

## Mau thuan quan trong can nho

- Version code hien tai: `next` trong `frontend/package.json` la `^16.2.7`, nhung nhieu file ke hoach cu ghi Next.js 14.
- Schema hien tai da co `User.xp`, `User.level`, `DailyActivity`, `QuestionAttempt.selectedOptionId`, `accuracyScore`, `fluencyScore`; cac prompt noi "DB chua co xp/level" da loi thoi.
- De cuong va code hien tai co gamification, nen cau "Khong dung XP, khong co Streak" trong `project_spec.md` khong nen dung lam quyet dinh hien tai.
- FastAPI hien nen giu toi thieu cho `/health` hoac vai tro mo rong; khong nen dua Whisper/audio scoring vao MVP neu chua co quyet dinh moi.

## De xuat buoc tiep theo

1. Tao `PLAN/_Archive` va chuyen cac file rong/cu vao do.
2. Viet lai mot file `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` lam nguon chinh moi.
3. Cap nhat roadmap chinh trong `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` sau moi phase.

## Cap nhat 18/06/2026 (SP1 - da thuc hien)

Ca 3 de xuat tren da duoc thuc hien trong sub-project SP1:

- Da tao `PLAN/_Archive/` va `git mv` 7 file stale: `project_spec.md`, `CURRENT_SYSTEM_STATUS.md`, `PROJECT_CONTEXT.md`, `COLOR_SYSTEM.md`, `ADMIN_ACCESS.md`, `KH_AI_PROMPTS.md`, `KH_VIBE_CODING.md`. Xem `_Archive/README.md`.
- Da tao `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` lam nguon chan thuc moi (tech stack that, gamification dang chay, DB v1 da don sach, roadmap SP1-SP6).
- Da cap nhat tham chieu cheo trong `ACTION_PLAN_NEXT_STEPS.md` va `PLAN/README.md`.
- Da xoa 6 file code orphan (seed.ts, seed_real.ts, ExerciseType1/3/4.tsx, audioData.ts) - da verify khong import.
- Quality gate pass: prisma validate + tsc + 17 test + build.

Nguon uu tien hien tai khi code: `CURRENT_PROJECT_CONTEXT.md` (thay the `CURRENT_SYSTEM_STATUS.md` va `project_spec.md`).
