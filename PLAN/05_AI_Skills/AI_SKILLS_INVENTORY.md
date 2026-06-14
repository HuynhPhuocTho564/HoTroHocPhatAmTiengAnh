# AI Skills Inventory

Du an da co cac skill noi bo cho AI trong:

`english_pronunciation_app/.agents/skills`

Khong nen di chuyen cac file nay vao `PLAN`, vi chung la cau truc huong dan de AI doc truc tiep khi thuc hien code. `PLAN` chi luu ban kiem ke va cach dung.

## Danh sach skill

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

## Nguyen tac khi AI code

- Truoc khi code mot phan lien quan, doc day du `SKILL.md` phu hop.
- Neu task lien quan nhieu mang, doc skill theo thu tu anh huong: database -> backend/API -> frontend/UI -> accessibility.
- Neu task lien quan noi dung phat am, doc `ipa-pronunciation-pedagogy` truoc khi tao/sua bai hoc.
- Neu task lien quan du lieu seed/kho cau hoi, doc `question-bank-curator` truoc khi sua schema/seed.
- Truoc khi ket thuc mot dot code co thay doi file, doc `project-quality-gate` va chay checks phu hop.
- Khong di chuyen hoac doi ten thu muc `.agents/skills` neu khong co ly do ro rang.
- Sau moi phase, cap nhat lai `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` hoac file roadmap lien quan.
