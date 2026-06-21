# Phase 1: Celebration & Feedback - Kế Hoạch Chi Tiết

> **Phase:** 1/3  
> **Ưu tiên:** CAO NHẤT (dopamine tức thì)  
> **Ước tính:** 3-4 ngày  
> **Skills:** `SKILL/maintainable-code`, `gamification_designer`, `SKILL/nielsen-ux-heuristics`, `SKILL/ui-color-harmony`, `accessibility`, `testing`

---

## Mục tiêu

Sau khi hoàn thành phase này, mỗi hành động của người dùng (làm bài, lên level, hoàn thành quest, nhận gems) đều có **phản hồi trực quan và âm thanh** tạo cảm giác tưởng thưởng.

---

## Kiến trúc kỹ thuật

### 1. Reward Event System (Hệ thống sự kiện thưởng)

```
ExerciseEngineClient.tsx (submit)
    │
    ▼
RewardEventEmitter (client-side)
    │
    ├──→ RewardToast        (hiển thị "+50 XP", "+5 💎")
    ├──→ LevelUpOverlay     (nếu level tăng → fullscreen popup)
    ├──→ QuestCompleteBanner(nếu quest hoàn thành → banner)
    └──→ ConfettiSystem     (pháo giấy khi EXCELLENT hoặc level up)
```

**Thiết kế:**
- `RewardEventEmitter` là 1 React Context provider, wrap toàn bộ app
- Submit response chứa `rewards` data → emitter phát event → các component listener phản ứng
- Không cần WebSocket hay polling — chỉ xử lý 1 lần sau submit

### 2. Cấu trúc thư mục mới

```
src/
├── components/
│   └── gamification/
│       ├── effects/                    ← THƯ MỤC MỚI
│       │   ├── RewardEventContext.tsx  ← Context provider + emitter
│       │   ├── RewardToast.tsx         ← Toast popup "+50 XP"
│       │   ├── LevelUpOverlay.tsx      ← Fullscreen "LÊN CẤP!"
│       │   ├── QuestCompleteBanner.tsx ← Banner quest hoàn thành
│       │   ├── ConfettiSystem.tsx      ← Pháo giấy CSS
│       │   └── StreakFireIndicator.tsx ← Ngọn lửa streak (nếu streak >= 3)
│       └── ... (components hiện có)
├── lib/
│   └── gamification/
│       ├── types.ts                    ← Types cho reward events
│       └── constants.ts                ← Config: durations, thresholds
└── hooks/
    └── useRewardEvents.ts              ← Hook để components subscribe
```

---

## Danh sách Task (8 tasks)

### Task 1.1: RewardEventContext + types

**Mô tả:** Tạo React Context quản lý sự kiện thưởng. Wrap app trong `app/layout.tsx`.

**Files:**
- `src/components/gamification/effects/RewardEventContext.tsx` (mới)
- `src/lib/gamification/types.ts` (mới)

**Thiết kế:**
```typescript
// types.ts
export type RewardEvent = {
  type: "xp" | "gems" | "level_up" | "quest_complete" | "badge_earned" | "streak_milestone";
  amount?: number;
  label: string;
  icon?: string;
  level?: number;        // cho level_up
  questDesc?: string;    // cho quest_complete
  badgeName?: string;    // cho badge_earned
};

// RewardEventContext.tsx
type RewardEventContextValue = {
  emit: (event: RewardEvent) => void;
  subscribe: (handler: (event: RewardEvent) => void) => () => void;
};
```

**Verify:** `tsc --noEmit` pass

---

### Task 1.2: ConfettiSystem (pháo giấy CSS)

**Mô tả:** Component hiển thị pháo giấy rơi, dùng CSS animation thuần (không thư viện ngoài). Tự động ẩn sau 3 giây.

**Files:**
- `src/components/gamification/effects/ConfettiSystem.tsx` (mới)

**Thiết kế:**
- Sinh 50-80 mảnh confetti với màu ngẫu nhiên từ palette
- Mỗi mảnh có animation: `fall` (top: -10% → 110%) + `rotate` + `sway`
- `prefers-reduced-motion: reduce` → tắt animation, hiện text "🎉" thay thế
- Performance: dùng `transform` + `opacity`, không dùng `top/left`

**Verify:** Build pass, visual check trên browser

---

### Task 1.3: RewardToast (popup nhận thưởng)

**Mô tả:** Toast popup hiện "+50 XP", "+5 💎" góc trên phải, tự ẩn sau 2.5s. Có thể stack nhiều toast.

**Files:**
- `src/components/gamification/effects/RewardToast.tsx` (mới)
- `src/hooks/useRewardEvents.ts` (mới)

**Thiết kế:**
- Queue toast: mỗi event → 1 toast entry, tự xóa sau 2.5s
- Animation: slide-in từ phải + fade-out
- Icon: ⭐ cho XP, 💎 cho gems, 🏆 cho badge
- Màu nền: XP = xanh, gems = vàng, badge = tím
- WCAG: `role="status"`, `aria-live="polite"`

**Verify:** `tsc --noEmit` pass, visual check

---

### Task 1.4: LevelUpOverlay (fullscreen lên cấp)

**Mô tả:** Khi user lên level, overlay fullscreen với animation "LÊN CẤP!" + level mới + confetti.

**Files:**
- `src/components/gamification/effects/LevelUpOverlay.tsx` (mới)
- `src/lib/gamification/constants.ts` (mới - milestone config)

**Thiết kế:**
- Trigger: `RewardEvent` có `type: "level_up"`
- UI: overlay tối, text "LEVEL UP!" scale từ 0→1, level number lớn, nút "Tiếp tục"
- Confetti bắn trong 3 giây
- Auto-dismiss sau 5s hoặc click "Tiếp tục"
- `prefers-reduced-motion`: chỉ hiện text, không scale animation
- Accessibility: `role="dialog"`, `aria-modal="true"`, focus trap

**Verify:** Build pass, test trên browser

---

### Task 1.5: QuestCompleteBanner (fanfare quest)

**Mô tả:** Banner trượt từ dưới lên khi hoàn thành quest, hiện tên quest + phần thưởng.

**Files:**
- `src/components/gamification/effects/QuestCompleteBanner.tsx` (mới)

**Thiết kế:**
- Trigger: `RewardEvent` có `type: "quest_complete"`
- UI: banner vàng/gradient, icon ✓, text "Nhiệm vụ hoàn thành!", quest desc, "+50 XP +10 💎"
- Slide-up từ bottom, tự ẩn sau 4s
- Có thể stack (nếu hoàn thành 2 quest cùng lúc)
- Accessibility: `role="alert"`, `aria-live="assertive"`

**Verify:** `tsc --noEmit` pass

---

### Task 1.6: Tích hợp RewardEventEmitter vào ExerciseEngineClient

**Mô tả:** Hook RewardEventContext vào submit flow. Sau khi nhận response từ `/api/exercises/submit`, phát các event tương ứng.

**Files:**
- `src/app/exercises/[id]/ExerciseEngineClient.tsx` (sửa)
- `src/app/layout.tsx` (sửa - wrap RewardEventProvider)

**Thay đổi:**
1. Wrap app trong `<RewardEventProvider>` ở layout
2. Trong ExerciseEngineClient, sau khi submit thành công:
   - Nếu `xpEarned > 0` → emit `xp` event
   - Nếu `gemsEarned > 0` → emit `gems` event
   - Nếu `level` tăng (so sánh trước/sau) → emit `level_up` event
   - Nếu `questXpEarned > 0` → emit `quest_complete` event
   - Nếu `badgesAwarded.length > 0` → emit `badge_earned` event cho mỗi badge

**Verify:** `tsc --noEmit` + `npm test` pass

---

### Task 1.7: StreakFireIndicator (ngọn lửa streak)

**Mô tả:** Hiển thị ngọn lửa 🔥 bên cạnh streak count khi streak >= 3. Lửa càng to khi streak càng cao.

**Files:**
- `src/components/gamification/effects/StreakFireIndicator.tsx` (mới)
- `src/components/gamification/StreakBadge.tsx` (sửa - tích hợp)

**Thiết kế:**
- Streak 0-2: không có lửa
- Streak 3-6: 🔥 nhỏ (1 emoji)
- Streak 7-13: 🔥🔥 (2 emoji, pulse animation)
- Streak 14-29: 🔥🔥🔥 (3 emoji, pulse nhanh hơn)
- Streak 30+: 🔥🔥🔥 + glow effect + text "HỎA LONG!"
- `prefers-reduced-motion`: tắt pulse, chỉ hiện emoji tĩnh

**Verify:** Build pass

---

### Task 1.8: Quality Gate + Test

**Mô tả:** Chạy full quality gate, thêm unit test cho reward event logic.

**Files:**
- `src/lib/__tests__/reward-events.test.ts` (mới)

**Test cases:**
- Emit XP event → toast hiện đúng amount + label
- Emit level_up event → overlay hiện đúng level
- Emit quest_complete → banner hiện
- Multiple events cùng lúc → queue đúng thứ tự
- `prefers-reduced-motion` → animation bị tắt

**Quality gate:**
```bash
npx prisma validate
node node_modules\typescript\bin\tsc --noEmit
npm test
npm run build
```

**Verify:** Tất cả pass

---

## Thứ tự thực thi

```
Task 1.1 (Context + types)
  └→ Task 1.2 (Confetti)
  └→ Task 1.3 (Toast)
  └→ Task 1.4 (LevelUp)
  └→ Task 1.5 (QuestBanner)
       └→ Task 1.6 (Tích hợp vào Engine)
            └→ Task 1.7 (Streak fire)
                 └→ Task 1.8 (Quality gate)
```

---

## Checklist Accessibility

- [ ] Mỗi animation có `@media (prefers-reduced-motion: reduce)` fallback
- [ ] Toast có `role="status"` + `aria-live="polite"`
- [ ] LevelUpOverlay có `role="dialog"` + `aria-modal` + focus trap
- [ ] QuestBanner có `role="alert"` + `aria-live="assertive"`
- [ ] Confetti có text thay thế cho screen reader
- [ ] Tất cả nút đóng có `aria-label`
- [ ] Contrast ratio ≥ 4.5:1 cho text trên overlay

---

## Rủi ro & Giải pháp

| Rủi ro | Giải pháp |
|---|---|
| Animation lag trên mobile | Giới hạn số confetti (30 trên mobile, 80 trên desktop) |
| Toast chồng chéo | Queue system, tối đa 3 toast cùng lúc, cũ nhất tự xóa |
| Overlay chặn interaction | Auto-dismiss 5s + nút "Tiếp tục" + Esc key |
| Performance | Dùng `will-change: transform`, `transform` thay vì `top/left` |
| Bundle size | Không thêm thư viện animation, dùng CSS thuần |
