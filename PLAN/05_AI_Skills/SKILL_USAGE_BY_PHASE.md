# Skill Usage By Phase

Ngay cap nhat: 18/06/2026

Muc tieu: moi dot code nen doc dung skill truoc khi sua file. File nay la ban mapping nhanh theo phase trong `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`.

**Skill bat buoc cho moi phase: `architect-mode`** — luon doc dau tien.

## Phase 1 - Build, Type va Database Contract

Can doc:

- `architect-mode` (bat buoc)
- `postgresql_expert`
- `question-bank-curator`
- `ipa-pronunciation-pedagogy`
- `project-quality-gate`

Ly do:

- Dam bao Clean Architecture layering tu dau.
- Sua Prisma schema va thiet ke cac bang `Phoneme`, `SoundGroup`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Dam bao kho cau hoi co status/source/review metadata.
- Dam bao sound groups dung logic IPA.
- Ket thuc phase phai validate Prisma va TypeScript.

## Phase 2 - API Submit Bai Tap

Can doc:

- `architect-mode` (bat buoc)
- `nextjs_app_router_expert`
- `question-bank-curator`
- `gamification_designer`
- `web_speech_api_expert`
- `project-quality-gate`
- `testing`

Ly do:

- Business logic phai nam trong Services layer, khong trong route handler.
- Tao API route submit theo App Router.
- Server phai cham diem tu question bank/runtime question, khong tin diem client.
- Xu ly transcript/audio metadata cho bai noi.
- Tinh XP/ranking delta dung logic gamification.
- Viet test cho scoring va gamification.

## Phase 3 - Gamification

Can doc:

- `architect-mode` (bat buoc)
- `gamification_designer`
- `nextjs_app_router_expert`
- `postgresql_expert`
- `project-quality-gate`
- `testing`

Ly do:

- XP, streak, badge, leaderboard can update nhat quan trong database.
- Cac update diem/badge nen nam server-side va dung transaction khi can.
- Viet test cho gamification logic.

## Phase 4 - Auth, Session va Phan Quyen

Can doc:

- `architect-mode` (bat buoc)
- `nextjs_app_router_expert`
- `hci_consultant` neu sua login/register UI hoac auth flow nguoi dung
- `accessibility` neu sua form auth, loi dang nhap, focus state, hoac OAuth button
- `project-quality-gate`

Ly do:

- Route/API can lay user tu session, bao ve admin, khong tin `userId` client khi session da san sang.
- Can kiem tra authorization va data exposure.
- Login/register la cua ngo chinh cua nguoi hoc, can label ro rang, error live region, focus state va callbackUrl an toan.

## Phase 5 - FastAPI Toi Thieu

Can doc:

- `architect-mode` (bat buoc)
- `project-quality-gate`
- `deployment` neu setup Docker hoac environment

Ly do:

- Backend hien chua phai phan xu ly chinh; tap trung health/config/CORS va kiem tra compile.
- Docker setup cho backend.

## Phase 6 - UI/UX, HCI va Accessibility

Can doc:

- `architect-mode` (bat buoc)
- `hci_consultant`
- `accessibility`
- `ipa-pronunciation-pedagogy` neu sua noi dung bai hoc/feedback
- `project-quality-gate`

Ly do:

- Giao dien luyen phat am can de dung, ro focus state, aria label va keyboard navigation.
- Feedback phat am phai dung nghiep vu, khong chi dep UI.

## Phase 7 - Admin CRUD va Quan Tri Du Lieu

Can doc:

- `architect-mode` (bat buoc)
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

- `architect-mode` (bat buoc)
- `testing`
- `project-quality-gate`
- `gamification_designer` neu demo XP/badge/leaderboard
- `ipa-pronunciation-pedagogy` neu demo luong bai IPA
- `accessibility` neu cap nhat audit UI
- `deployment` neu chuan bi demo cho bao ve

Ly do:

- Can chot validation, test coverage va giai thich logic nghiep vu khi bao ve.
- Chuan bi environment cho nguoi cham bai chay duoc.

## Lesson Catalog va Seed Bai Hoc IPA

Ap dung khi code theo `PLAN/02_Database_And_Data/LESSON_CODING_PLAN.md`.

Can doc:

- `architect-mode` (bat buoc)
- `seed-data` (chinh)
- `ipa-pronunciation-pedagogy`
- `question-bank-curator`
- `project-quality-gate`
- `postgresql_expert` neu sua Prisma schema hoac seed pipeline can doi schema
- `hci_consultant` va `accessibility` neu sua UI learning map/exercise engine
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

- `architect-mode` (bat buoc)
- `deployment` (chinh)
- `project-quality-gate`
- `testing`

Ly do:

- Can chuan bi Docker, .env, database seed cho nguoi cham bai.
- Dam bao build thanh cong va test pass truoc demo.
