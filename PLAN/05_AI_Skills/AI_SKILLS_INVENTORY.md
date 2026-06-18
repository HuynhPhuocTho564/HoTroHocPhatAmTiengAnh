# AI Skills Inventory

Du an da co cac skill noi bo cho AI trong:

`english_pronunciation_app/.agents/skills`

Khong nen di chuyen cac file nay vao `PLAN`, vi chung la cau truc huong dan de AI doc truc tiep khi thuc hien code. `PLAN` chi luu ban kiem ke va cach dung.

## Danh sach skill

**Skill goc (10):**

- `accessibility`: dung khi sua WCAG, aria-label, keyboard navigation, contrast, focus state.
- `gamification_designer`: dung khi thiet ke XP, streak, badge, reward va leaderboard.
- `google_search`: dung khi can tra cuu tai lieu/nguon ben ngoai.
- `hci_consultant`: dung khi ra quyet dinh UI/UX, luong thao tac va tinh de dung.
- `ipa-pronunciation-pedagogy`: dung khi thiet ke bai hoc IPA, minimal pairs, feedback phat am va thu tu bai luyen.
- `nextjs_app_router_expert`: dung khi sua Next.js App Router, route handler, server/client component, auth va data fetching.
- `postgresql_expert`: dung khi sua schema, Prisma, index, constraint va truy van PostgreSQL.
- `project-quality-gate`: dung truoc khi ket thuc mot dot code de chay validate/typecheck/build/test phu hop va bao cao ro nhung gi da/chua kiem tra.
- `question-bank-curator`: dung khi tao, seed, review hoac chuan hoa kho cau hoi, WordItem, MinimalPair, SentenceItem, QuestionBankItem, IPA/audio/source metadata.
- `web_speech_api_expert`: dung khi sua ghi am, speech recognition, transcript va fallback trinh duyet.

**Skill moi (4 - them 18/06/2026):**

- `architect-mode`: dung KHI BAT KY khi viet code — bao gom Clean Architecture, SOLID/DRY/KISS, TypeScript strict mode, khong hardcode, xu ly loi tap trung. Day la skill bat buoc cho moi thay doi code.
- `seed-data`: dung khi tao, sua, chay seed script, lesson catalog, phoneme/sound-group content, word items, minimal pairs, sentence items, question bank items.
- `testing`: dung khi viet, chay, hoac debug test — unit test, API route test, scoring/gamification test. Huong dan mock Prisma, test data fixtures, coverage goals.
- `deployment`: dung khi setup moi truong, Docker, .env, hay chuan bi demo/ bao ve khoa luan. Huong dan cai dat nhanh cho nguoi cham bai.

## Nguyen tac khi AI code

- **Bat buoc doc `architect-mode` truoc khi viet bat ky dong code nao.** Day la skill co so, ap dung cho moi thay doi.
- Neu task lien quan nhieu mang, doc skill theo thu tu anh huong: architect-mode -> database -> backend/API -> frontend/UI -> accessibility -> testing -> deployment.
- Neu task lien quan noi dung phat am, doc `ipa-pronunciation-pedagogy` truoc khi tao/sua bai hoc.
- Neu task lien quan du lieu seed/kho cau hoi, doc `seed-data` va `question-bank-curator` truoc khi sua schema/seed.
- Neu task lien quan viet test, doc `testing` truoc khi tao file test.
- Neu task lien quan deploy/docker/chay project, doc `deployment` truoc khi thao tac.
- Truoc khi ket thuc mot dot code co thay doi file, doc `project-quality-gate` va chay checks phu hop.
- Khong di chuyen hoac doi ten thu muc `.agents/skills` neu khong co ly do ro rang.
- Sau moi phase, cap nhat lai `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` hoac file roadmap lien quan.
