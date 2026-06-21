# Skill Usage By Phase

Ngay cap nhat: 21/06/2026

Muc tieu: moi dot code nen doc dung skill truoc khi sua file. File nay la ban mapping nhanh theo phase trong `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`.

**Skill bat buoc cho moi phase: `SKILL/maintainable-code`** — luon doc dau tien (thay the `architect-mode` da xoa).

## Nhom skill UI/UX Roadmap (4 skill tai .agents/skills/SKILL/)

Phuc vu 27 task trong `PLAN/03_UI_UX/IMPROVEMENT_P1..P6`:

- `SKILL/maintainable-code` — bat buoc moi thay doi code (thay architect-mode)
- `SKILL/nielsen-ux-heuristics` — thiet ke/review UI, danh gia heuristic (thay hci_consultant)
- `SKILL/ui-color-harmony` — khi thay doi class mau, theme, Rank Tier color
- `SKILL/web-usability-scales` — danh gia UX truoc/sau, ket thuc sprint

## Phase 1 - Build, Type va Database Contract

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `postgresql_expert`
- `question-bank-curator`
- `ipa-pronunciation-pedagogy`
- `project-quality-gate`

Ly do:

- Dam bao Clean Architecture layering tu dau (maintainable-code bao cohesion/coupling/naming/SLAP).
- Sua Prisma schema va thiet ke cac bang `Phoneme`, `SoundGroup`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Dam bao kho cau hoi co status/source/review metadata.
- Dam bao sound groups dung logic IPA.
- Ket thuc phase phai validate Prisma va TypeScript.

## Phase 2 - API Submit Bai Tap

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `nextjs_app_router_expert`
- `question-bank-curator`
- `gamification_designer`
- `web_speech_api_expert`
- `project-quality-gate`
- `testing`

Ly do:

- Business logic phai nam trong Services layer, khong trong route handler (maintainable-code).
- Tao API route submit theo App Router.
- Server phai cham diem tu question bank/runtime question, khong tin diem client.
- Xu ly transcript/audio metadata cho bai noi.
- Tinh XP/ranking delta dung logic gamification.
- Viet test cho scoring va gamification.

## Phase 3 - Gamification

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `gamification_designer`
- `SKILL/ui-color-harmony` neu them tier color / badge color moi
- `SKILL/nielsen-ux-heuristics` neu thay UI leaderboard/badge
- `nextjs_app_router_expert`
- `postgresql_expert`
- `project-quality-gate`
- `testing`

Ly do:

- XP, streak, badge, leaderboard can update nhat quan trong database.
- Tier color va leaderboard UX phai theo 60-30-10 + Nielsen heuristics.
- Cac update diem/badge nen nam server-side va dung transaction khi can.
- Viet test cho gamification logic.

## Phase 4 - Auth, Session va Phan Quyen

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `nextjs_app_router_expert`
- `SKILL/nielsen-ux-heuristics` neu sua login/register UI hoac auth flow (thay hci_consultant)
- `accessibility` neu sua form auth, loi dang nhap, focus state, hoac OAuth button
- `SKILL/ui-color-harmony` neu doi mau form/auth state
- `project-quality-gate`

Ly do:

- Route/API can lay user tu session, bao ve admin, khong tin `userId` client khi session da san sang.
- Can kiem tra authorization va data exposure.
- Login/register la cua ngo chinh cua nguoi hoc, can label ro rang, error live region, focus state va callbackUrl an toan.

## Phase 5 - FastAPI Toi Thieu

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `project-quality-gate`
- `deployment` neu setup Docker hoac environment

Ly do:

- Backend hien chua phai phan xu ly chinh; tap trung health/config/CORS va kiem tra compile.
- Docker setup cho backend.

## Phase 6 - UI/UX, HCI va Accessibility

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `SKILL/nielsen-ux-heuristics` (chinh — thiet ke/review UI, thay hci_consultant)
- `SKILL/ui-color-harmony` (chinh — moi thay doi mau/theme/tier color)
- `accessibility` (ARIA, keyboard navigation, focus state, screen reader)
- `ipa-pronunciation-pedagogy` neu sua noi dung bai hoc/feedback
- `SKILL/web-usability-scales` (danh gia UX truoc/sau, ket thuc sprint)
- `project-quality-gate`

Ly do:

- Giao dien luyen phat am can de dung, ro focus state, aria label va keyboard navigation.
- Feedback phat am phai dung nghiep vu, khong chi dep UI (nielsen H9 + ipa-pronunciation-pedagogy).
- Moi thay doi mau phai theo 60-30-10 + WCAG + Tailwind scale (ui-color-harmony).
- Cuoi sprint danh gia SUS/UEQ/WAMMI (web-usability-scales) de xac nhan cai thien.

## Phase 7 - Admin CRUD va Quan Tri Du Lieu

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `nextjs_app_router_expert`
- `postgresql_expert`
- `question-bank-curator`
- `ipa-pronunciation-pedagogy`
- `project-quality-gate`

Ly do:

- Admin quan ly phoneme, sound group, word item, minimal pair, sentence item va review status.
- Can tranh de item chua duyet thanh `ACTIVE`.

## Phase 8 - Testing, Demo va Tai Lieu

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `testing`
- `project-quality-gate`
- `gamification_designer` neu demo XP/badge/leaderboard
- `ipa-pronunciation-pedagogy` neu demo luong bai IPA
- `SKILL/web-usability-scales` neu bao cao diem UX cuoi dot
- `accessibility` neu cap nhat audit UI
- `deployment` neu chuan bi demo cho bao ve

Ly do:

- Can chot validation, test coverage va giai thich logic nghiep vu khi bao ve.
- Chuan bi environment cho nguoi cham bai chay duoc.

## Lesson Catalog va Seed Bai Hoc IPA

Ap dung khi code theo `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md`.

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `seed-data` (chinh)
- `ipa-pronunciation-pedagogy`
- `question-bank-curator`
- `project-quality-gate`
- `postgresql_expert` neu sua Prisma schema hoac seed pipeline can doi schema
- `SKILL/nielsen-ux-heuristics` + `accessibility` neu sua UI learning map/exercise engine
- `SKILL/ui-color-harmony` neu them color moi cho learning map
- `testing` neu viet test cho lesson catalog structure

Ly do:

- Bai hoc IPA can dung thu tu su pham: nghe -> nhan dien -> doc tu -> doc cap -> doc cau.
- Seed pipeline phai tuan thu metadata, review status, va khong hardcode.
- Question bank can co source/review/status metadata, khong dua item chua duyet thanh `ACTIVE`.
- Chu de 4 la tong hop kho, khong phai day am moi; can tranh tron qua nhieu contrast trong bai beginner.
- Sau khi seed/code phai validate Prisma, typecheck, test va build.

## Deployment & Demo

Ap dung khi setup moi truong, Docker, hay chuan bi bao ve khoa luan.

Can doc:

- `SKILL/maintainable-code` (bat buoc)
- `deployment` (chinh)
- `project-quality-gate`
- `testing`

Ly do:

- Can chuan bi Docker, .env, database seed cho nguoi cham bai.
- Dam bao build thanh cong va test pass truoc demo.

## UI/UX Improvement Roadmap (PLAN/03_UI_UX/IMPROVEMENT_P1..P6)

Ap dung khi thuc hien 27 task cai thien UI/UX. Moi task da ghi ro skill nao dung trong file ke hoach.

Can doc theo loai task:

- **Moi task co thay doi code**: `SKILL/maintainable-code` (bat buoc)
- **Task thiet ke/review UI** (tabbed widget, onboarding tour, podium, skeleton, confirm exit): `SKILL/nielsen-ux-heuristics`
- **Task thay doi mau** (currency gradient, Rank Tier color, semantic states): `SKILL/ui-color-harmony`
- **Task lien quan a11y** (focus state, aria-label, keyboard): `accessibility`
- **Task lien quan IPA/feedback phat am** (phonetic explanation, IPA popup, P5): `ipa-pronunciation-pedagogy`
- **Task gamification logic** (XP, gems, streak, ranking): `gamification_designer`
- **Ket thuc moi sprint**: `SKILL/web-usability-scales` (do SUS/UEQ/WAMMI) + `project-quality-gate` (code quality)

Ly do:

- 4 skill UI/UX roadmap thay the architect-mode + hci_consultant da xoa.
- maintainable-code cho moi thay doi code; nielsen/ui-color cho UI; web-usability-scales cho do lường.
- accessibility + ipa-pronunciation-pedagogy + gamification_designer giu lai vi 4 skill khong bao phu.
