# Kế Hoạch Cải Thiện UX/UI Toàn Diện — Production Roadmap

**Ngày tạo:** 2026-06-20
**Dựa trên:** [Đánh Giá UX/UI Toàn Diện](./UI_UX_COMPREHENSIVE_EVALUATION.md)

---

## Tổng Quan 6 Plans

| # | Plan | Tasks | Effort | Impact | Trạng thái |
|---|------|-------|--------|--------|------------|
| P1 | [Quick Wins](./IMPROVEMENT_P1_QUICK_WINS.md) | 5 tasks | 2-3h | HIGH | ⬜ Chưa bắt đầu |
| P2 | [Dashboard & Navigation](./IMPROVEMENT_P2_DASHBOARD_NAVIGATION.md) | 5 tasks | 6-8h | HIGH | ⬜ Chưa bắt đầu |
| P3 | [Ranking & Leaderboard](./IMPROVEMENT_P3_RANKING_LEADERBOARD.md) | 5 tasks | 10-14h | CRITICAL | ⬜ Chưa bắt đầu |
| P4 | [Gamification Economy](./IMPROVEMENT_P4_GAMIFICATION_ECONOMY.md) | 3 tasks | 6-8h | HIGH | ⬜ Chưa bắt đầu |
| P5 | [Exercise & Pedagogy](./IMPROVEMENT_P5_EXERCISE_PEDAGOGY.md) | 4 tasks | 8-10h | HIGH | ⬜ Chưa bắt đầu |
| P6 | [Social & Retention](./IMPROVEMENT_P6_SOCIAL_RETENTION.md) | 5 tasks | 8-10h | MEDIUM | ⬜ Chưa bắt đầu |

**Tổng:** 27 tasks | 40-53 giờ | ~5-7 ngày làm việc full-time

---

## Skills Áp Dụng Cho Mọi Tasks

Mỗi task đều ghi rõ skill nào cần dùng. Tóm tắt:

> **✅ 4 skill đã tồn tại thật** tại `english_pronunciation_app/.agents/skills/SKILL/` (commit `071a510`, 2026-06-21). Mỗi skill có SKILL.md đầy đủ: trigger + checklist + lý thuyết cốt lõi + ví dụ from PLAN + quan hệ skill khác. Đọc skill qua tool Skill của harness khi làm task.

| Skill | Path | Khi nào dùng | Checklist |
|-------|------|-------------|-----------|
| `maintainable-code` | `.agents/skills/SKILL/maintainable-code/SKILL.md` | **MỌI** thay đổi code | KISS, DRY, Type Safety, Constants, Cohesion/Coupling, Naming, SLAP, Tests |
| `nielsen-ux-heuristics` | `.agents/skills/SKILL/nielsen-ux-heuristics/SKILL.md` | Thiết kế UI mới, review UX | 10 heuristics + Cognitive Load (Sweller/Miller) + Fitts/Hick + 4 luật UX (Aesthetic-Usability, Goal-Gradient, Von Restorff, Doherty) |
| `ui-color-harmony` | `.agents/skills/SKILL/ui-color-harmony/SKILL.md` | Thay đổi class màu, theme, Rank Tier color | 60-30-10, semantic colors, color theory HSV, color blindness, WCAG 4.5:1, Tailwind 50-900 scale |
| `web-usability-scales` | `.agents/skills/SKILL/web-usability-scales/SKILL.md` | Đánh giá trước/sau thay đổi, kết thúc sprint | SUS (10 item + công thức) + UEQ (6 scale) + WAMMI (5 scale) heuristic estimation |

**Skill gốc bổ sung khi cần** (không nằm trong `SKILL/`, vẫn còn ở `.agents/skills/`):
- `accessibility` — khi chạm ARIA/keyboard/screen reader/focus state
- `ipa-pronunciation-pedagogy` — khi sửa nội dung bài học/feedback phát âm (task P5)
- `gamification_designer` — khi sửa logic XP/streak/badge/ranking
- `project-quality-gate` — validation cuối sprint (dùng kèm `web-usability-scales`)

> **Lưu ý:** `architect-mode` và `hci_consultant` đã xóa — được thay bởi `maintable-code` và `nielsen-ux-heuristics`. Không tham chiếu 2 tên này nữa.

---

## Dependency Graph

```
P1 (Quick Wins) ─────────────────────────────────────────┐
  ├─ 1.1 Currency unification                             │
  ├─ 1.2 Dead code cleanup                                │
  ├─ 1.3 Text fixes                                       │
  ├─ 1.4 Skeleton loading                                 │
  └─ 1.5 Remove warning block                             │
                                                          │
P2 (Dashboard) ──────── phụ thuộc P1 (currency fix) ─────┤
  ├─ 2.1 Tabbed widgets                                   │
  ├─ 2.2 "Gợi ý hôm nay"                                  │
  ├─ 2.3 Onboarding tour ── phụ thuộc 2.1                 │
  ├─ 2.4 Navbar icons                                     │
  └─ 2.5 Confirm exit exercise                            │
                                                          │
P3 (Ranking) ────────── CRITICAL, làm song song P1 ──────┤
  ├─ 3.1 Ranking in Summary                               │
  ├─ 3.2 Rank Tiers ── phụ thuộc 3.1                      │
  ├─ 3.3 Podium ── phụ thuộc 3.2                          │
  ├─ 3.4 Rank change notification ── phụ thuộc 3.1        │
  └─ 3.5 Season ceremony ── phụ thuộc 3.2, 3.3            │
                                                          │
P4 (Economy) ────────── phụ thuộc P1 (currency) ─────────┤
  ├─ 4.1 Expand gem earning                               │
  ├─ 4.2 Expand shop ── phụ thuộc 4.1                     │
  └─ 4.3 Gems visibility ── phụ thuộc 4.1                 │
                                                          │
P5 (Exercise) ───────── độc lập ─────────────────────────┤
  ├─ 5.1 Phonetic explanation                             │
  ├─ 5.2 Countdown timer                                  │
  ├─ 5.3 IPA popup ── phụ thuộc 5.1                       │
  └─ 5.4 Difficulty indicator                             │
                                                          │
P6 (Social) ─────────── phụ thuộc P3 (ranking) ──────────┘
  ├─ 6.1 Wire AchievementShare
  ├─ 6.2 Streak warning
  ├─ 6.3 New content badge
  ├─ 6.4 Skill radar chart
  └─ 6.5 Quest reminder
```

---

## Lịch Trình Đề Xuất (Production Sprint)

### Sprint 1: Nền Tảng (Ngày 1-2) — 12-16h
- **P1:** Tất cả 5 tasks (2-3h)
- **P2:** 2.4 Navbar icons + 2.5 Confirm exit (2h)
- **P3:** 3.1 Ranking in Summary (2h) + 3.2 Rank Tiers (4-6h)

### Sprint 2: Core Experience (Ngày 3-4) — 14-18h
- **P2:** 2.2 Gợi ý hôm nay (2h) + 2.1 Tabbed widgets (4h)
- **P3:** 3.4 Notification (2h) + 3.3 Podium (4h)
- **P4:** 4.1 Gem earning + 4.3 Visibility (4h)

### Sprint 3: Depth & Polish (Ngày 5-6) — 14-18h
- **P5:** 5.2 Countdown + 5.4 Difficulty (3h) + 5.1 Phonetic (4-6h)
- **P6:** 6.1 Share + 6.2 Streak warning + 6.3 New badge (4h)
- **P4:** 4.2 Shop expansion (4-6h)

### Sprint 4: Completion (Ngày 7) — 8-10h
- **P2:** 2.3 Onboarding tour (4h)
- **P3:** 3.5 Season ceremony (3h)
- **P5:** 5.3 IPA popup (2h)
- **P6:** 6.4 Skill radar + 6.5 Quest reminder (3h)

---

## Evaluation Checklist (Sau Mỗi Sprint)

Sau mỗi sprint, đánh giá bằng các skills:

### maintainable-code Checklist
- [ ] Không có magic numbers
- [ ] Types đầy đủ, không `any`
- [ ] Functions ≤ 50 dòng, components ≤ 200 dòng
- [ ] Unit tests cho pure functions mới
- [ ] `tsc --noEmit` pass

### nielsen-ux-heuristics Checklist
- [ ] H1: Loading/progress states visible
- [ ] H3: Escape/back options rõ ràng
- [ ] H4: Consistent với existing patterns
- [ ] H5: Confirmation cho destructive actions
- [ ] H8: Không thêm clutter

### ui-color-harmony Checklist
- [ ] 60-30-10 ratio maintained
- [ ] Semantic colors đúng (green=success, red=error)
- [ ] WCAG contrast ≥ 4.5:1 cho text mới
- [ ] Dùng theme tokens, không hardcode hex

### web-usability-scales Checklist
- [ ] Estimated SUS score cải thiện
- [ ] UEQ Stimulation scale cải thiện (gamification features)
- [ ] WAMMI Helpfulness cải thiện (help/onboarding features)
