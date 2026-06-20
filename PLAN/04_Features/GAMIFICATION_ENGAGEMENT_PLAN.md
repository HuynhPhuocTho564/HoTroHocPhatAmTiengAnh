# Kế Hoạch Nâng Cấp Gamification - Tăng Sức Hấp Dẫn (Engagement)

> **Ngày tạo:** 28/06/2026  
> **Trạng thái:** Chờ phê duyệt  
> **Thư mục:** `PLAN/04_Features/`  
> **Mục tiêu:** Biến hệ thống gamification hiện tại từ "bảng tính số liệu" thành trải nghiệm "học mà chơi, chơi mà học" cuốn hút.

---

## 1. Vấn đề hiện tại

Hệ thống gamification đã có đủ **cơ chế** (XP, gems, streak, quests, badges, leaderboard, shop), nhưng **thiếu cảm giác**:

| Yếu tố | Hiện tại | Vấn đề |
|---|---|---|
| Phản hồi sau bài tập | Trả JSON, UI hiển thị số | Không có animation, không có "drama" |
| Lên level | `level` tăng âm thầm | Không có popup, không mở khóa gì |
| Nhận gems/XP | Counter tăng | Không có hiệu ứng "thưởng" |
| Hoàn thành quest | Chỉ cập nhật progress | Không fanfare |
| Hành trình học | Learning map tĩnh | Không có narrative, không milestone |
| Xã hội | Leaderboard xếp hạng | Không có thử thách nhóm, không chia sẻ |

**Kết luận:** Người dùng không nhận được **dopamine hit** — cảm giác tưởng thưởng — khi hoàn thành hành động.

---

## 2. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────┐
│              ENGAGEMENT LAYER (Mới)              │
│                                                  │
│  Phase 1: Celebration & Feedback                 │
│  ├── RewardToast        (popup nhận thưởng)      │
│  ├── LevelUpOverlay     (fullscreen lên cấp)     │
│  ├── QuestCompleteBanner(fanfare quest)          │
│  └── ConfettiSystem     (hiệu ứng pháo giấy)     │
│                                                  │
│  Phase 2: Progression Journey                    │
│  ├── MilestoneRewards   (phần thưởng cột mốc)    │
│  ├── MasteryTree        (cây kỹ năng trực quan)  │
│  ├── ChapterProgress    (tiến trình theo chương) │
│  └── UnlockNotification (mở khóa nội dung)       │
│                                                  │
│  Phase 3: Social & Fun                           │
│  ├── WeeklyChallenges   (thử thách tuần)         │
│  ├── SpinWheel          (vòng quay may mắn)      │
│  ├── AchievementShare   (chia sẻ thành tựu)      │
│  └── SeasonalEvents     (sự kiện giới hạn)       │
│                                                  │
├─────────────────────────────────────────────────┤
│           GAMIFICATION CORE (Đã có)              │
│  gamification.ts | submit/route.ts | badges     │
│  shop | quests | streak | leaderboard            │
├─────────────────────────────────────────────────┤
│              DATABASE (Prisma)                    │
│  User | Badge | DailyQuest | Leaderboard | ...   │
└─────────────────────────────────────────────────┘
```

---

## 3. Thứ tự ưu tiên & Ước tính thời gian

| Phase | Mô tả | Tasks | Ước tính | Tác động |
|---|---|---|---|---|
| **Phase 1** | Celebration & Feedback | 8 tasks | 3-4 ngày | Cao nhất - dopamine tức thì |
| **Phase 2** | Progression Journey | 7 tasks | 4-5 ngày | Cao - giữ người dùng lâu dài |
| **Phase 3** | Social & Fun | 6 tasks | 3-4 ngày | Trung bình - tăng viral/replay |
| **Tổng** | | **21 tasks** | **10-13 ngày** | |

---

## 4. Nguyên tắc kiến trúc (Áp dụng skill `architect-mode`)

### 4.1. Tách biệt Concerns
- **Logic game** → `src/lib/gamification/` (pure functions, testable)
- **API routes** → `src/app/api/` (thin handlers, gọi logic)
- **UI components** → `src/components/gamification/` (presentation only)
- **Types** → `src/lib/gamification/types.ts` (shared types)

### 4.2. Không hardcode
- Mọi config (milestone levels, spin wheel prizes, weekly challenge templates) → database hoặc config file
- Animation durations, colors → Tailwind config hoặc constants

### 4.3. Đóng gói (DRY)
- Mỗi hiệu ứng là 1 component độc lập, tái sử dụng được
- Reward event system: 1 emitter duy nhất, nhiều listener

### 4.4. Testable
- Mỗi function logic có unit test
- UI components có story hoặc manual test checklist

---

## 5. Skills sử dụng

| Skill | Phase | Mục đích |
|---|---|---|
| `architect-mode` | Tất cả | Clean Architecture, SOLID, TypeScript strict |
| `gamification_designer` | Tất cả | Thiết kế cân bằng reward, progression curve |
| `nextjs_app_router_expert` | Tất cả | API routes, server/client components |
| `hci_consultant` | Phase 1, 2 | Luồng tương tác, timing animation |
| `accessibility` | Phase 1, 2 | WCAG cho animation (prefers-reduced-motion) |
| `postgresql_expert` | Phase 2, 3 | Schema mới cho milestones, challenges |
| `testing` | Tất cả | Unit test cho logic, integration test |
| `project-quality-gate` | Cuối mỗi phase | tsc + test + build |

---

## 6. Cấu trúc file kế hoạch

```
PLAN/04_Features/
├── GAMIFICATION_ENGAGEMENT_PLAN.md       ← File này (tổng quan)
├── GAMIFICATION_P1_CELEBRATION_FEEDBACK.md  ← Phase 1 chi tiết
├── GAMIFICATION_P2_PROGRESSION_JOURNEY.md   ← Phase 2 chi tiết
└── GAMIFICATION_P3_SOCIAL_FUN.md            ← Phase 3 chi tiết
```

---

## 7. Điều kiện tiên quyết

- [x] SP7 Gamification cơ bản đã hoàn thành (XP, gems, shop, quests, streak, badges, leaderboard)
- [x] Submit route trả đủ data (rewards, progress, streak, badgesAwarded)
- [x] Dashboard có DailyCheckIn, DailyQuestsWidget, LevelDisplay
- [x] Admin CRUD đầy đủ cho 6 model
- [ ] Database migration cho Phase 2 & 3 (cần schema mới)

---

## 8. Tiêu chí hoàn thành (Definition of Done)

Mỗi phase được coi là hoàn thành khi:

1. **Code:** TypeScript strict pass, không có `any` không cần thiết
2. **Test:** Unit test pass cho mọi logic function mới
3. **Build:** `npm run build` pass không lỗi
4. **Accessibility:** Animation có `prefers-reduced-motion` fallback
5. **Mobile:** Responsive trên mobile (min 375px)
6. **Tài liệu:** JSDoc cho mọi function/component mới
7. **Plan update:** Cập nhật `CURRENT_PROJECT_CONTEXT.md` sau mỗi phase
