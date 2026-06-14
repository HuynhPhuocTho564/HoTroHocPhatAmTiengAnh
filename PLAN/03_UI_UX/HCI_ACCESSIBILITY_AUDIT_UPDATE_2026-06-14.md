# HCI Accessibility Audit Update - 14/06/2026

## Da thuc hien

- `frontend/src/app/learning_map/page.tsx`: doc topic/map/exercise tu Prisma, bo dummy topic, bo `any`, them best score cua user neu da dang nhap.
- `frontend/src/app/learning_map/LearningMapClient.tsx`: thay card `div onClick` bang `button`/`Link`, them focus ring, aria-label, progress theo best score, hien trang thai noi dung theo DB.
- `frontend/src/components/layout/Navbar.tsx`: giu server session va chuyen UI sang client component.
- `frontend/src/components/layout/NavbarClient.tsx`: them skip link, `aria-current`, mobile menu, `aria-expanded`, `aria-controls`.
- `frontend/src/components/layout/Footer.tsx`: them `role="contentinfo"` va footer navigation landmark.
- `frontend/src/app/layout.tsx`: them `div#main-content` lam dich cua skip link, tranh boc ca app bang `<main>` de page con khong bi nested landmark.
- `frontend/src/app/dashboard/page.tsx`: chuyen stats sang `dl`, them section heading/aria-label, quick links co focus state, dem bai hoan thanh theo exercise duy nhat thay vi dem moi attempt.
- `frontend/src/components/gamification/DailyCheckIn.tsx`: chuyen stats sang `dl`, chu ky 7 ngay sang `ul/li`, them live region cho message, bo ky tu loi ma hoa.
- `frontend/src/app/exercises/[id]/ExerciseEngineClient.tsx`: viet lai UI engine theo huong typed hon, bo `any`/`alert()`, them accessible label/focus state cho nut audio/record/close/next, giu contract submit `/api/exercises/submit`.
- `frontend/src/app/exercises/[id]/page.tsx`: parser option co type guard, bo `any` va comment loi ma hoa.

## Kiem chung

- `npx.cmd tsc --noEmit --pretty false`: pass.
- `npm.cmd run build`: pass.

## Con lai nen lam tiep

- Admin: table caption, label cho search input, aria-label cho action buttons.
