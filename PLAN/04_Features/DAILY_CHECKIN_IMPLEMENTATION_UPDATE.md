# Daily Check-in Implementation Update

Ngay cap nhat: 14/06/2026

## Trang thai hien tai

Daily check-in da duoc chuyen sang luat gamification moi, khong dung `coins` nua.

MVP da co:

- `GET /api/checkin`: tra trang thai streak, `canCheckIn`, reward hom nay.
- `POST /api/checkin`: moi ngay chi tinh 1 lan, cong `+10 XP` va `+2 Ranking Score`.
- Update `User.xp`, `User.level`, `User.streakCount`, `User.longestStreak`, `User.totalCheckIns`, `User.lastCheckInDate`.
- Upsert `DailyActivity` va `Leaderboard` cho ky `tuan`/`thang`.
- Cap badge streak MVP: 3 ngay, 7 ngay, 14 ngay.
- UI `DailyCheckIn.tsx`, `/checkin`, `/dashboard` da doc API that va khong con mock reward coins.

## File da lien quan

- `english_pronunciation_app/frontend/src/app/api/checkin/route.ts`
- `english_pronunciation_app/frontend/src/components/gamification/DailyCheckIn.tsx`
- `english_pronunciation_app/frontend/src/app/checkin/page.tsx`
- `english_pronunciation_app/frontend/src/app/dashboard/page.tsx`
- `english_pronunciation_app/frontend/src/lib/gamification.ts`

## Luu y

File `DAILY_CHECKIN_FEATURE.md` la tai lieu y tuong cu, mot so noi dung van nhac `coins`/popup reward cu. Khi tiep tuc code, uu tien contract trong:

- `PLAN/01_Roadmap/API_CONTRACT_PLAN.md`
- `PLAN/04_Features/SCORING_AND_LEADERBOARD_PLAN.md`
- `PLAN/04_Features/BADGE_SYSTEM_PLAN.md`
