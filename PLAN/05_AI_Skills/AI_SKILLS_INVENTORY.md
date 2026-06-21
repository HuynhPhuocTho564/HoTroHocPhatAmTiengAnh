# AI Skills Inventory

Du an da co cac skill noi bo cho AI trong:

`english_pronunciation_app/.agents/skills`

Khong nen di chuyen cac file nay vao `PLAN`, vi chung la cau truc huong dan de AI doc truc tiep khi thuc hien code. `PLAN` chi luu ban kiem ke va cach dung.

## Nhom skill moi — UI/UX Roadmap (4 skill)

Nam tai `english_pronunciation_app/.agents/skills/SKILL/`, phuc vu 27 task trong `PLAN/03_UI_UX/IMPROVEMENT_P1..P6`. 4 skill nay thay the 2 skill cu (architect-mode, hci_consultant) da xoa de tranh trung lap.

- `maintainable-code`: dung KHI BAT KY khi viet/sua code — KISS, DRY, type safety, constants, cohesion/coupling, naming, SLAP, boy-scout rule. Day la skill bat buoc cho moi thay doi code (thay the `architect-mode` da xoa).
- `nielsen-ux-heuristics`: dung khi thiet ke UI moi, review UX truoc/sau thay doi, danh gia heuristic — 10 Nielsen heuristics + Cognitive Load (Sweller, Miller 7±2) + Fitts/Hick + 4 luat UX (Aesthetic-Usability, Goal-Gradient, Von Restorff, Doherty). Thay the `hci_consultant` da xoa.
- `ui-color-harmony`: dung khi thay doi class mau, them UI co mau, lam theme, Rank Tier color — 60-30-10, semantic colors, color theory HSV, color blindness testing, WCAG 2.1 contrast, theme tokens, Tailwind 50-900 scale, tier color.
- `web-usability-scales`: dung khi danh gia UX truoc/sau thay doi, do cai thien, ket thuc sprint — SUS (10 item + cong thuc cham), UEQ (6 scale), WAMMI (5 scale) bang heuristic estimation khi khong co user that.

## Danh sach skill con lai (12)

- `accessibility`: dung khi sua WCAG, aria-label, keyboard navigation, contrast, focus state. (Phan mau giao voi ui-color-harmony nhung accessibility bao ARIA/keyboard/screen reader — giu lai.)
- `gamification_designer`: dung khi thiet ke XP, streak, badge, reward va leaderboard.
- `google_search`: dung khi can tra cuu tai lieu/nguon ben ngoai.
- `ipa-pronunciation-pedagogy`: dung khi thiet ke bai hoc IPA, minimal pairs, feedback phat am va thu tu bai luyen.
- `nextjs_app_router_expert`: dung khi sua Next.js App Router, route handler, server/client component, auth va data fetching.
- `postgresql_expert`: dung khi sua schema, Prisma, index, constraint va truy van PostgreSQL.
- `project-quality-gate`: dung truoc khi ket thuc mot dot code de chay validate/typecheck/build/test phu hop va bao cao ro nhung gi da/chua kiem tra.
- `question-bank-curator`: dung khi tao, seed, review hoac chuan hoa kho cau hoi, WordItem, MinimalPair, SentenceItem, QuestionBankItem, IPA/audio/source metadata.
- `web_speech_api_expert`: dung khi sua ghi am, speech recognition, transcript va fallback trinh duyet.
- `seed-data`: dung khi tao, sua, chay seed script, lesson catalog, phoneme/sound-group content, word items, minimal pairs, sentence items, question bank items.
- `testing`: dung khi viet, chay, hoac debug test — unit test, API route test, scoring/gamification test. Huong dan mock Prisma, test data fixtures, coverage goals.
- `deployment`: dung khi setup moi truong, Docker, .env, hay chuan bi demo/ bao ve khoa luan. Huong dan cai dat nhanh cho nguoi cham bai.

## Skill da xoa (2) — bo vi trung lap

- `architect-mode`: da thay boi `SKILL/maintainable-code` (KISS/DRY/type-safety/constants + bo sung cohesion/coupling, naming, SLAP).
- `hci_consultant`: da thay boi `SKILL/nielsen-ux-heuristics` (10 Nielsen + bo sung Fitts/Hick + 4 luat UX).

## Nguyen tac khi AI code

- **Bat buoc doc `SKILL/maintain-code` truoc khi viet bat ky dong code nao.** Day la skill co so, ap dung cho moi thay doi (thay the architect-mode cu).
- Neu task lien quan nhieu mang, doc skill theo thu tu anh huong: maintainable-code -> database -> backend/API -> frontend/UI -> ui-color-harmony -> testing -> deployment.
- Neu task lien quan thiet ke/review UI, doc `SKILL/nielsen-ux-heuristics` truoc khi thiet ke. Khi doi mau, doc them `SKILL/ui-color-harmony`.
- Neu task lien quan danh gia/do lường UX truoc/sau thay doi hoac ket thuc sprint, doc `SKILL/web-usability-scales` (dung kem `project-quality-gate`).
- Neu task lien quan noi dung phat am, doc `ipa-pronunciation-pedagogy` truoc khi tao/sua bai hoc.
- Neu task lien quan du lieu seed/kho cau hoi, doc `seed-data` va `question-bank-curator` truoc khi sua schema/seed.
- Neu task lien quan viet test, doc `testing` truoc khi tao file test.
- Neu task lien quan deploy/docker/chay project, doc `deployment` truoc khi thao tac.
- Truoc khi ket thuc mot dot code co thay doi file, doc `project-quality-gate` va chay checks phu hop.
- Khong di chuyen hoac doi ten thu muc `.agents/skills` neu khong co ly do ro rang.
- Sau moi phase, cap nhat lai `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` hoac file roadmap lien quan.
