# PLAN - Thu muc lap ke hoach du an

Thu muc nay gom cac tai lieu lap ke hoach, dac ta, audit va ghi chu dieu phoi cua du an `Web_HoTroPhatAmEN`.
Muc tieu la tach tai lieu quan ly ra khoi ma nguon runtime de sau nay de kiem tra, phe duyet va theo doi tien do.

## Cau truc

- `00_Project_Context/`: boi canh du an, hien trang he thong, de cuong va dac ta tong quan.
  - `CURRENT_PROJECT_CONTEXT.md`: nguon chan thuc hien tai (tech stack, gamification, DB, roadmap SP1-SP6). Doc file nay truoc khi code.
  - `DE_CUONG_DO_AN.md`: de cuong chinh thuc tu truong (giu lam pham vi hoc thuat).
  - Luu y: `project_spec.md`, `CURRENT_SYSTEM_STATUS.md`, `PROJECT_CONTEXT.md` da archive vao `_Archive/` (SP1, 18/06/2026).
- `01_Roadmap/`: lo trinh, PDCA, API contract, kich ban demo, ke hoach thuc hien va cac de xuat cai tien.
- `02_Database_And_Data/`: ke hoach du lieu, kho cau hoi, bai tap IPA, ghi chu ap dung Ship or Sheep va cac tai lieu lien quan schema/database.
  - `LESSON_CODING_PLAN.md`: ke hoach code 4 chu de IPA, 25 nhom am, 100 bai va seed pipeline (v1, con dung).
  - `LESSON_SYLLABUS_STRUCTURE.md`: cau truc v2 muc tieu - 30 nhom/112 bai/4 chu de (SP2-SP4).
  - `DB_AUDIT_REPORT.md`: bao cao audit DB 18/06 + cac sua da thuc hien.
- `03_UI_UX/`: color system, UI component guide, audit HCI/accessibility.
- `04_Features/`: tai lieu tinh nang nhu daily check-in, streak/gamification, badge, scoring/leaderboard. (Luu y: `ADMIN_ACCESS.md` da archive - huong dan mock-token da bo.)
- `05_AI_Skills/`: kiem ke skill va mapping phase-skill. (Luu y: `KH_AI_PROMPTS.md`, `KH_VIBE_CODING.md` da archive - prompt cu, Next.js 14.)
- `_Archive/`: tai lieu lich su, KHONG dung lam quyet dinh. Xem `_Archive/README.md`.

## Nguyen tac su dung

- File ke hoach moi nen dat trong `PLAN`, khong dat rai rac o root, frontend hoac backend.
- Ma nguon ung dung van nam trong `english_pronunciation_app/frontend/src` va `english_pronunciation_app/backend`.
- Cac file skill goc trong `english_pronunciation_app/.agents/skills` khong di chuyen, vi do la noi AI can doc khi code.
- Khi code theo phase, xem `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md` de biet skill nao can doc truoc.
- Truoc khi code mot phase lon, nen cap nhat file roadmap lien quan trong `01_Roadmap/`.
