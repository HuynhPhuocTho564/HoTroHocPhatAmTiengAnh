# Skill Usage By Phase

Ngay cap nhat: 14/06/2026

Muc tieu: moi dot code nen doc dung skill truoc khi sua file. File nay la ban mapping nhanh theo phase trong `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md`.

## Phase 1 - Build, Type va Database Contract

Can doc:

- `postgresql_expert`
- `question-bank-curator`
- `ipa-pronunciation-pedagogy`
- `project-quality-gate`

Ly do:

- Sua Prisma schema va thiet ke cac bang `Phoneme`, `SoundGroup`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Dam bao kho cau hoi co status/source/review metadata.
- Dam bao sound groups dung logic IPA.
- Ket thuc phase phai validate Prisma va TypeScript.

## Phase 2 - API Submit Bai Tap

Can doc:

- `nextjs_app_router_expert`
- `question-bank-curator`
- `gamification_designer`
- `web_speech_api_expert`
- `project-quality-gate`

Ly do:

- Tao API route submit theo App Router.
- Server phai cham diem tu question bank/runtime question, khong tin diem client.
- Xu ly transcript/audio metadata cho bai noi.
- Tinh XP/ranking delta dung logic gamification.

## Phase 3 - Gamification That

Can doc:

- `gamification_designer`
- `nextjs_app_router_expert`
- `postgresql_expert`
- `project-quality-gate`

Ly do:

- XP, streak, badge, leaderboard can update nhat quan trong database.
- Cac update diem/badge nen nam server-side va dung transaction khi can.

## Phase 4 - Auth, Session va Phan Quyen

Can doc:

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

- `project-quality-gate`

Ly do:

- Backend hien chua phai phan xu ly chinh; tap trung health/config/CORS va kiem tra compile.

## Phase 6 - UI/UX, HCI va Accessibility

Can doc:

- `hci_consultant`
- `accessibility`
- `ipa-pronunciation-pedagogy` neu sua noi dung bai hoc/feedback
- `project-quality-gate`

Ly do:

- Giao dien luyen phat am can de dung, ro focus state, aria label va keyboard navigation.
- Feedback phat am phai dung nghiep vu, khong chi dep UI.

## Phase 7 - Admin CRUD va Quan Tri Du Lieu

Can doc:

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

- `project-quality-gate`
- `gamification_designer` neu demo XP/badge/leaderboard
- `ipa-pronunciation-pedagogy` neu demo luong bai IPA
- `accessibility` neu cap nhat audit UI

Ly do:

- Can chot validation, demo scenario va giai thich logic nghiep vu khi bao ve.
