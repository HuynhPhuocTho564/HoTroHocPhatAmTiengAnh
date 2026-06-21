# Action Plan - Web_HoTroPhatAmEN

Ngay lap: 14/06/2026

## 1. Hien trang da co

- Frontend Next.js App Router da co cac trang chinh: dashboard, learning map, exercises, check-in, badges, leaderboard, admin.
- Auth da co NextAuth, dang ky tai khoan, login route va Prisma adapter/logic lien quan.
- Database PostgreSQL da ket noi qua Prisma voi database `english_app`.
- Schema Prisma da co cac bang cot loi cho user, lesson map, topic, level, exercise, question, option, attempt, badge, leaderboard, daily activity.
- Learning map va exercise detail da doc du lieu tu Prisma.
- Web Speech API da co hook/component co ban cho nhan dien giong noi.
- Gamification UI da co component XP/streak/badge, nhung nhieu trang con dang dung mock data.

## 2. Van de va phan con thieu

- TypeScript hien con loi build/typecheck:
  - `.next/types/validator.ts` dang giu tham chieu cu den route auth da bi doi.
  - `prisma.config.ts` can xu ly `DATABASE_URL` co the undefined.
  - `ExerciseType4.tsx` co loi suy luan type lam bien `matchedOption` bi thanh `never`.
- Exercise engine moi cham diem local, chua co API submit ket qua va chua luu attempt day du.
- Gamification chua chay theo du lieu that o tat ca man hinh.
- Leaderboard, badges, dashboard, check-in va admin con nhieu mock data.
- FastAPI backend gan nhu rong, chua co health endpoint hoac endpoint demo phuc vu bao cao.
- Route protection va phan quyen admin can hoan thien hon.
- Chua co test automation ro rang cho luong hoc, nop bai, check-in va gamification.

## 3. Pham vi de sau

- Chua lam Diagnostic Test / test trinh do dau vao trong roadmap hien tai.
- Chua tu dong goi y lo trinh hoc dua tren test dau vao.
- Chua thay doi learning map theo ket qua test trinh do.

## Phase 1 - On dinh build va contract database

Muc tieu: dua code ve trang thai validate/typecheck sach truoc khi them logic moi.

Trang thai 14/06/2026: Da hoan thanh.

Ket qua:

- Da sua `prisma.config.ts` de `DATABASE_URL` khong con co the undefined.
- Da sua loi type trong `ExerciseType4.tsx`.
- Da them schema kho du lieu IPA/question bank: `Phoneme`, `SoundGroup`, `SoundGroupPhoneme`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Da dong bo PostgreSQL local bang `npx.cmd prisma db push`.
- Da sua `/login` de `useSearchParams()` nam trong `Suspense`, giup production build Next.js 16 pass.
- Da chay thanh cong `npx.cmd prisma validate`, `npx.cmd prisma generate`, `npx.cmd tsc --noEmit --pretty false`, `npm.cmd run build`.

File can xem/sua:

- `english_pronunciation_app/frontend/prisma.config.ts`
- `english_pronunciation_app/frontend/src/components/exercises/ExerciseType4.tsx`
- `english_pronunciation_app/frontend/.next` neu can xoa generated cache
- `english_pronunciation_app/frontend/prisma/schema.prisma`
- `PLAN/02_Database_And_Data/DATA_SEED_PLAN.md`
- `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`

Task:

- Sua `DATABASE_URL` handling trong Prisma config.
- Sua type logic trong `ExerciseType4.tsx`.
- Neu chot Cach B cho kho du lieu, thiet ke schema toi thieu cho `Phoneme`, `SoundGroup`, `WordItem`, `MinimalPair`, `SentenceItem`, `QuestionBankItem`.
- Bo sung status/source/review fields cho kho du lieu de phu hop yeu cau ap dung thuc te cua khoa luan.
- Doc `question-bank-curator` va `ipa-pronunciation-pedagogy` truoc khi them schema/data lien quan kho cau hoi IPA.
- Xoa/cache lai `.next` neu stale generated type con tham chieu route cu.
- Chay lai `npx.cmd prisma validate`, `npx.cmd tsc --noEmit --pretty false`.

## Phase 2 - Hoan thien luong nop bai tap

Muc tieu: nguoi dung lam bai xong thi ket qua duoc luu vao database.

Trang thai 14/06/2026: Da hoan thanh MVP submit flow.

Ket qua:

- Da tao `src/app/api/exercises/submit/route.ts`.
- Da tao `src/lib/scoring.ts`, `src/lib/period.ts`, `src/lib/gamification.ts`.
- Da noi `ExerciseEngineClient.tsx` de gui answers len API khi ket thuc bai.
- Server da tu query `Question`, `QuestionType`, `AnswerOption`, tu cham diem va tao `ExerciseAttempt`/`QuestionAttempt`.
- Da update `User.xp`, `User.level`, `DailyActivity`, `Leaderboard` trong Prisma transaction.
- Da test API submit that tren dev server voi user/exercise mau, sau do xoa attempt test va rollback reward delta.
- Da chay thanh cong `npx.cmd prisma validate`, `npx.cmd tsc --noEmit --pretty false`, `npm.cmd run build`.

Con lai sau MVP:

- `badgesAwarded` trong submit response dang tra `[]`; logic cap badge chi tiet de sang Phase 3.
- Route van ho tro `userId` trong payload theo Phase 2; Phase 4 can chuyen han sang session bat buoc.
- Retake/daily bonus da co cong thuc co ban, nhung chua co bang rieng de cap tran retake bonus theo ngay.

File can tao/sua:

- Tao `english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts`
- Tao `english_pronunciation_app/frontend/src/lib/scoring.ts`
- Tao `english_pronunciation_app/frontend/src/lib/period.ts`
- Tao `english_pronunciation_app/frontend/src/lib/gamification.ts`
- Sua `english_pronunciation_app/frontend/src/app/exercises/[id]/ExerciseEngineClient.tsx`
- Sua cac component exercise trong `english_pronunciation_app/frontend/src/components/exercises/`
- Bam theo `PLAN/01_Roadmap/API_CONTRACT_PLAN.md`

Task:

- Thiet ke request/response submit attempt.
- Luu `QuestionAttempt` voi selected option, score, feedback, time spent va transcript neu co.
- Tinh diem theo loai bai va `accuracyScore`, tach `XP` voi `Ranking Score`.
- Chong farm diem bang cach chi cong leaderboard phan diem cai thien khi user lam lai bai.
- Van cong it XP va it `Ranking Score` on tap khi user lam lai bai hop le nhung diem khong cao hon best score, co tran/ngay.
- Cap nhat progress/user stats sau khi nop bai.
- Dam bao logic scoring khong nam rai rac trong UI.

## Phase 3 - Gamification dung du lieu that

Muc tieu: XP, streak, badge, leaderboard chay theo database.

Trang thai 14/06/2026: Da hoan thanh phan MVP chinh.

Ket qua:

- Da cap nhat `POST /api/checkin` va `GET /api/checkin` theo contract moi: check-in moi ngay cong `+10 XP`, `+2 Ranking Score`, update streak, `DailyActivity`, `Leaderboard` va badge streak trong Prisma transaction.
- Da tao `GET /api/leaderboard` cho bang xep hang `tuan`/`thang` theo `Ranking Score`, khong dung XP tong lam bang xep hang chinh.
- Da tao `GET /api/badges` va `POST /api/badges/check` de doc/cap huy hieu tu database.
- Da cap nhat `src/lib/gamification.ts` voi badge MVP, helper tinh level/reward, badge progress va `checkAndAwardBadges`.
- Da noi `POST /api/exercises/submit` voi logic cap badge sau khi nop bai.
- Da thay mock data o `dashboard`, `checkin`, `badges`, `leaderboard` bang session/API/Prisma data o muc MVP.

Con lai sau MVP:

- Route van tam ho tro `userId` fallback cho API trong khi Phase 4 chua chot session bat buoc.
- Badge popup/toast khi vua dat huy hieu chua lam; hien tai API tra `badgesAwarded` va UI chi hien message don gian.
- Chua co bang rieng de gioi han retake bonus/ranking bonus theo ngay; hien moi co cong thuc MVP trong helper.
- Admin CRUD cho badge/leaderboard/question bank de sang Phase 7.

File can tao/sua:

- `english_pronunciation_app/frontend/src/app/dashboard/page.tsx`
- `english_pronunciation_app/frontend/src/app/badges/page.tsx`
- `english_pronunciation_app/frontend/src/app/leaderboard/page.tsx`
- `english_pronunciation_app/frontend/src/app/checkin/page.tsx`
- `english_pronunciation_app/frontend/src/app/api/checkin/route.ts`
- `english_pronunciation_app/frontend/src/app/api/leaderboard/route.ts`
- `english_pronunciation_app/frontend/src/app/api/badges/route.ts`
- `english_pronunciation_app/frontend/src/app/api/badges/check/route.ts`
- `english_pronunciation_app/frontend/src/lib/gamification.ts`
- Tao/cap nhat API route neu can trong `english_pronunciation_app/frontend/src/app/api/`
- `PLAN/01_Roadmap/API_CONTRACT_PLAN.md`

Task:

- Thay mock data bang Prisma query.
- Dong bo XP/level/streak/badge voi ket qua nop bai va daily check-in.
- Them daily bonus XP va daily bonus `Ranking Score` khi user hoan thanh nhieu bai hop le trong mot ngay, co gioi han tran.
- Them daily check-in MVP: +10 XP va +2 Ranking Score moi ngay.
- Them nguong danh gia bai lam: >=70 hoan thanh, >=80 tot, >=90 xuat sac/badge.
- Thiet ke/cap huy hieu MVP theo `PLAN/04_Features/BADGE_SYSTEM_PLAN.md`.
- Cap nhat leaderboard theo `Ranking Score` tuan/thang, khong dung XP tong lam bang xep hang chinh.
- Khong khoa bai hoc theo XP; XP chi dung cho level, badge, streak va dong luc hoc.

## Phase 4 - Auth, session va phan quyen

Muc tieu: route nhay cam dung user/session that.

Trang thai 14/06/2026: Da hoan thanh MVP session guard.

Ket qua:

- Da them type augmentation cho NextAuth session/JWT de doc `session.user.id` va `session.user.role` ro rang.
- Da bao ve `/dashboard`, `/checkin`, `/badges`, `/leaderboard`, `/admin` bang `src/proxy.ts`.
- Da cap nhat `Navbar` doc session server-side: user chua dang nhap thay login/register, user da dang nhap thay avatar/logout, admin link chi hien cho role `Admin`.
- Da bo `userId` client fallback trong cac API ca nhan/gamification nhay cam: submit bai, check-in, badges, badges/check.
- Leaderboard van public top list, nhung `currentUser` chi lay tu session.
- Da sua login/register UI text bi loi ma hoa va bo nut Google gia.
- Da cap nhat API register voi validation co ban, response JSON chuan va check trung email/username.
- Da bao ve `/exercises` va `/exercises/[id]` bang proxy de user phai dang nhap truoc khi lam/nop bai.
- Da thay trang `/exercises` mock bang server page doc danh sach bai tap that tu Prisma va link dung `/exercises/[id]`.
- Da thiet ke lai giao dien `/login` va `/register` theo HCI/accessibility: shell chung, label ro rang, aria-live cho loi, focus state, link giu `callbackUrl`, va khong con scrollbar do `min-h-screen` long trong layout.
- Da them Google OAuth co dieu kien theo env `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` hoac `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.
- Da them logic lien ket/tao `User` Prisma khi dang nhap Google lan dau, giu `session.user.id` va `session.user.role` cho cac API hoc tap/gamification.
- Da them `.env.example` cho Auth.js/Google OAuth va test sanitizer callback URL.

Con lai sau MVP:

- Chua test luong dang ky/dang nhap tren browser voi user that sau khi build.
- Admin API authorization helper da them trong Phase 7; can tiep tuc noi form UI admin vao API.

File can xem/sua:

- `english_pronunciation_app/frontend/src/lib/auth.ts`
- `english_pronunciation_app/frontend/src/lib/auth.config.ts`
- `english_pronunciation_app/frontend/src/lib/auth-providers.ts`
- `english_pronunciation_app/frontend/src/lib/auth-redirect.ts`
- `english_pronunciation_app/frontend/src/types/next-auth.d.ts`
- `english_pronunciation_app/frontend/src/proxy.ts`
- `english_pronunciation_app/frontend/src/components/layout/Navbar.tsx`
- `english_pronunciation_app/frontend/src/components/layout/SignOutButton.tsx`
- `english_pronunciation_app/frontend/src/components/auth/AuthShell.tsx`
- `english_pronunciation_app/frontend/src/components/auth/GoogleMark.tsx`
- `english_pronunciation_app/frontend/src/app/login/LoginForm.tsx`
- `english_pronunciation_app/frontend/src/app/register/page.tsx`
- `english_pronunciation_app/frontend/src/app/register/RegisterForm.tsx`
- `english_pronunciation_app/frontend/src/app/exercises/page.tsx`
- `english_pronunciation_app/frontend/src/app/api/auth/register/route.ts`
- `english_pronunciation_app/frontend/src/app/admin/page.tsx`
- Cac route API can session trong `english_pronunciation_app/frontend/src/app/api/`

Task:

- Bao ve dashboard/exercises/admin theo session.
- An/chan admin UI neu user khong co role admin.
- Dam bao logout/login/register flow on dinh.
- Cau hinh Google Console redirect URI: `http://localhost:3000/api/auth/callback/google` khi muon bat nut Google.

## Phase 5 - FastAPI toi thieu cho bao cao

Muc tieu: backend Python khong con rong va co vai tro ro trong kien truc.

Trang thai 14/06/2026: Da hoan thanh MVP backend toi thieu.

Ket qua:

- Da tao FastAPI app trong `backend/app/main.py`.
- Da them CORS cho frontend local qua `backend/app/core/config.py`.
- Da them `GET /` va `GET /health`.
- Da them helper database health check trong `backend/app/core/database.py`; neu `DATABASE_URL` chua cau hinh thi health tra `not_configured` thay vi lam app crash.
- Da cap nhat `backend/.env.example` va `backend/README.md` voi huong dan chay local.

Con lai sau MVP:

- Chua them endpoint scoring/analytics that; tam thoi frontend Next.js API van xu ly submit/scoring/gamification.
- Chua ket noi SQLAlchemy models voi Prisma schema; chi co health check DB.

File can tao/sua:

- `english_pronunciation_app/backend/app/main.py`
- `english_pronunciation_app/backend/app/core/config.py`
- `english_pronunciation_app/backend/app/core/database.py`
- `english_pronunciation_app/backend/README.md`

Task:

- Them `/health`.
- Cau hinh CORS cho frontend local.
- Neu phu hop, them endpoint placeholder cho scoring/analytics de trinh bay kien truc.

## Phase 6 - UI/UX, HCI va accessibility

Muc tieu: giao dien dong nhat, de dung, dat muc can thiet cho bao cao.

Trang thai 14/06/2026: Dang thuc hien, da hoan thanh dot cai thien dau.

Ket qua da lam:

- Da thay `/learning_map` mock/hardcode bang server page lay du lieu that tu Prisma.
- Da bo dummy topics va bo logic ep `isLocked = false`.
- Da them tien do theo best score cua user: bai dat khi best score >= 70.
- Da hien thi trang thai map/exercise theo database (`ACTIVE`, `LOCKED`, `DRAFT`, `ARCHIVED`) va ghi ro day la trang thai noi dung, khong phai khoa theo XP.
- Da doi cac card click bang `button`/`Link` that de ho tro keyboard navigation va focus state.
- Da them skip link trong Navbar, active link voi `aria-current`, mobile navigation co `aria-expanded`/`aria-controls`.
- Da tach Navbar server/client de vua doc session server-side, vua dung `usePathname()` cho active state.
- Da them `role="contentinfo"` va footer nav landmark.
- Da doi root layout tu `<main>` boc toan app sang `div#main-content` de tranh nested `<main>` khi page con da co main landmark.
- Da cai thien dashboard: stats semantic `dl`, quick links co focus state, dem bai dat theo exercise duy nhat, khong dem trung retake.
- Da cai thien `DailyCheckIn`: stats semantic, chu ky 7 ngay la list, message co live region, bo ky tu tick loi ma hoa.
- Da viet lai `ExerciseEngineClient.tsx` theo huong typed hon, bo `any`/`alert()`, sua text loi ma hoa, them label/focus state cho nut audio/record/close/next, giu submit API contract hien co.
- Da sua `exercises/[id]/page.tsx` de parser option khong dung `any` va bo comment/text loi ma hoa.
- Da chay thanh cong `npx.cmd tsc --noEmit --pretty false` va `npm.cmd run build`.

File can xem/sua:

- `english_pronunciation_app/frontend/src/components/layout/Navbar.tsx`
- `english_pronunciation_app/frontend/src/components/layout/NavbarClient.tsx`
- `english_pronunciation_app/frontend/src/components/ui/*`
- `english_pronunciation_app/frontend/src/app/*/page.tsx`
- `PLAN/03_UI_UX/HCI_ACCESSIBILITY_AUDIT.md`

Task:

- [x] Kiem tra va sua learning map: keyboard navigation, focus state, route link dung, du lieu that.
- [x] Them skip link, active nav state va mobile menu cho Navbar.
- [x] Them footer landmark.
- [ ] Kiem tra cac page con con mojibake/emoji/label thieu ro nghia.
- [x] Thiet ke lai trang login/register theo HCI/accessibility va bo UI gay nhieu/scroll thua.
- [x] Kiem tra dashboard semantics va quick links.
- [x] Kiem tra exercise engine UI: text loi ma hoa, nut audio/record, feedback bar, mobile layout.
- [ ] Dong nhat color system va spacing.
- [ ] Giam mock/placeholder text khong can thiet trong man hinh chinh.

## Phase 7 - Admin CRUD va quan tri du lieu

Muc tieu: admin co the quan ly bai hoc/bai tap/nguoi dung o muc demo tot.

Trang thai 14/06/2026: Da hoan thanh admin read-only MVP, admin write API toi thieu va UI CRUD bai tap/cau hoi co ban.

Ket qua da lam:

- Da doi `src/app/admin/page.tsx` thanh server component query Prisma that.
- Da tao `AdminDashboardClient.tsx` de xu ly tab UI client-side.
- Da thay mock stats bang so lieu database: users, active users, exercises, audio files, completed attempts, average score 7 ngay.
- Da thay `UserManagement`, `ExerciseManagement`, `AudioManagement`, `ReportsAnalytics` sang nhan props du lieu that thay vi tu tao mock.
- Da bo mojibake/emoji trong admin UI vua sua, them caption/label/focus state cho bang/search/filter tabs.
- Da them `src/lib/admin-api.ts` de gom response JSON, validation co ban va `requireAdminSession()` cho role `Admin`.
- Da them `GET/POST /api/admin/exercises` de doc/tao bai tap.
- Da them `GET/PATCH/DELETE /api/admin/exercises/[id]` de doc/sua/xoa mem bai tap bang `status = ARCHIVED`.
- Da them `GET/POST /api/admin/exercises/[id]/questions` de doc/them cau hoi va option vao bai tap.
- Da them `GET/PATCH/DELETE /api/admin/questions/[questionId]` de doc/sua/xoa mem cau hoi bang `status = ARCHIVED`.
- Da cap nhat `src/app/admin/page.tsx` de truyen `topic/level/map` options cho form quan ly bai tap.
- Da noi `ExerciseManagement.tsx` voi API admin: tao bai tap, sua metadata/trang thai, xoa mem bai tap va cap nhat state sau khi thanh cong.
- Da truyen `QuestionType` options vao admin UI.
- Da noi `ExerciseManagement.tsx` voi API cau hoi: tai danh sach cau hoi theo bai, tao cau hoi, sua cau hoi/options, xoa mem cau hoi va cap nhat `questionCount`.
- Da them admin API `topics`, `levels`, `maps` de tao/sua/xoa hoac luu tru du lieu nen.
- Da tao `TopicLevelMapManagement.tsx` va noi tab `Chu de` voi API topic/level/learning map.
- Da cap nhat luong hoc/nop bai de chi dung bai tap/cau hoi `ACTIVE`, tranh user vao truc tiep bai `DRAFT`/`ARCHIVED`.
- Da chay thanh cong `npm.cmd test`, `npx.cmd prisma validate`, `npx.cmd tsc --noEmit --pretty false` va `npm.cmd run build`.

File can xem/sua:

- `english_pronunciation_app/frontend/src/app/admin/page.tsx`
- `english_pronunciation_app/frontend/src/components/admin/AdminDashboardClient.tsx`
- `english_pronunciation_app/frontend/src/components/admin/UserManagement.tsx`
- `english_pronunciation_app/frontend/src/components/admin/ExerciseManagement.tsx`
- `english_pronunciation_app/frontend/src/components/admin/AudioManagement.tsx`
- `english_pronunciation_app/frontend/src/components/admin/ReportsAnalytics.tsx`
- `english_pronunciation_app/frontend/src/lib/admin-api.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/exercises/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/exercises/[id]/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/exercises/[id]/questions/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/questions/[questionId]/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/topics/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/topics/[id]/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/levels/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/levels/[id]/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/maps/route.ts`
- `english_pronunciation_app/frontend/src/app/api/admin/maps/[id]/route.ts`
- `english_pronunciation_app/frontend/src/app/admin/page.tsx`
- `english_pronunciation_app/frontend/src/components/admin/TopicLevelMapManagement.tsx`

Task:

- [x] Thay mock data bang query that o admin overview/list.
- [x] Them accessibility co ban cho admin tabs, search, table caption, filter group.
- [x] Them API route admin trong `src/app/api/admin/`.
- [x] Them validation va phan quyen admin helper cho API ghi du lieu.
- [x] Them CRUD API toi thieu cho exercise/question/option.
- [x] Noi form UI admin vao API tao/sua/xoa mem bai tap.
- [x] Noi form UI admin vao API tao/sua/xoa mem cau hoi va option.
- [x] Them CRUD topic/level/map co ban.
- [ ] Them CRUD question-bank/phoneme/sound group theo pipeline duyet data.
- [ ] Them API route admin cho user role/status neu can demo quan tri user.

## Phase 8 - Testing, demo va tai lieu

Muc tieu: san sang demo va bao ve do an.

Trang thai 14/06/2026: Da bat dau automation test cho logic cot loi.

Ket qua da lam:

- Da them script `npm.cmd test` dung `tsx --test "src/**/*.test.ts"`.
- Da them `src/lib/__tests__/scoring.test.ts` cho normalize, multiple choice, voice word-overlap, score summary va nguong rating/completion.
- Da them `src/lib/__tests__/gamification.test.ts` cho first attempt, retake cai thien, retake diem thap, daily bonus, level, check-in reward, leaderboard period va badge progress.
- Da chay pass 14/14 tests.
- Da chay pass `npx.cmd prisma validate`, `npx.cmd tsc --noEmit --pretty false` va `npm.cmd run build`.

File can tao/sua:

- `english_pronunciation_app/frontend/package.json`
- Test files duoi `english_pronunciation_app/frontend/src/**/__tests__` neu them test unit.
- `PLAN/01_Roadmap/`
- `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` (nguon chan thuc hien tai; `CURRENT_SYSTEM_STATUS.md` da archive vao `PLAN/_Archive/` ngay 18/06/2026 - SP1)
- `PLAN/01_Roadmap/DEMO_SCENARIO_PLAN.md`
- `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`

Task:

- [x] Them test cho scoring/gamification cot loi.
- [x] Chay test/typecheck/build sau dot code.
- [ ] Them test API route quan trong neu can mock session/Prisma.
- [ ] Cap nhat tai lieu cai dat, database, seed data va kich ban demo.
- [ ] Cap nhat `DEMO_SCENARIO_PLAN.md` thanh script demo chi tiet sau khi UI/API gan hoan thien.

## Skill can dung khi code

- Next.js/App Router/Auth/API: doc `english_pronunciation_app/.agents/skills/nextjs_app_router_expert/SKILL.md`.
- Database/Prisma/PostgreSQL: doc `english_pronunciation_app/.agents/skills/postgresql_expert/SKILL.md`.
- IPA/minimal pairs/feedback phat am: doc `english_pronunciation_app/.agents/skills/ipa-pronunciation-pedagogy/SKILL.md`.
- Question bank/seed/source review: doc `english_pronunciation_app/.agents/skills/question-bank-curator/SKILL.md`.
- Web Speech/recording: doc `english_pronunciation_app/.agents/skills/web_speech_api_expert/SKILL.md`.
- XP/streak/badge/leaderboard: doc `english_pronunciation_app/.agents/skills/gamification_designer/SKILL.md`.
- UI/UX (thiet ke/review): doc `english_pronunciation_app/.agents/skills/SKILL/nielsen-ux-heuristics/SKILL.md` (thay hci_consultant da xoa).
- UI/UX (doi mau/theme/tier color): doc `english_pronunciation_app/.agents/skills/SKILL/ui-color-harmony/SKILL.md`.
- UI/UX (do SUS/UEQ/WAMMI): doc `english_pronunciation_app/.agents/skills/SKILL/web-usability-scales/SKILL.md`.
- Code moi thay doi: doc `english_pronunciation_app/.agents/skills/SKILL/maintainable-code/SKILL.md` (thay architect-mode da xoa).
- Accessibility: doc `english_pronunciation_app/.agents/skills/accessibility/SKILL.md`.
- Quality gate truoc khi ket thuc code: doc `english_pronunciation_app/.agents/skills/project-quality-gate/SKILL.md`.
- Mapping skill theo phase: xem `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`.
