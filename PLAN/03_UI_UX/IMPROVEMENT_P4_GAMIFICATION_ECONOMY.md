# Kế Hoạch Gamification Economy Deepening (Ưu tiên 4)

**Mục tiêu:** Biến gems economy thành meaningful reward loop. Hiện tại gems earn quá chậm, shop quá ít items.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md) — Phần 8.6

**Skills bắt buộc áp dụng:**
- `maintainable-code` — Constants cho gem values, type-safe shop items
- `nielsen-ux-heuristics` — H1 (Visibility: gem balance luôn thấy), H5 (Error Prevention: confirm purchase)
- `ui-color-harmony` — Shop items dùng purple (premium/gems color), earn sources dùng green

---

## Task 4.1: Mở Rộng Nguồn Gems Earn

**Vấn đề:** Hiện chỉ earn 5 gems per EXCELLENT exercise → quá chậm, user mất motivation mua shop items.

**File thay đổi:**
- `frontend/src/lib/gamification.ts` — `computeGemReward()`
- `frontend/src/app/api/exercises/submit/route.ts` — gem calculation
- `frontend/src/app/api/checkin/route.ts` — check-in gems

### Bước 4.1.1: Mở rộng gem earning table

**File:** `frontend/src/lib/gamification.ts`

```tsx
// TRƯỚC
export function computeGemReward(rating: ExerciseRating): number {
  return rating === "EXCELLENT" ? 5 : 0;
}

// SAU — nhiều nguồn gems hơn
export const GEM_REWARDS = {
  excellent_exercise: 5,   // Score >= 90
  good_exercise: 2,       // Score >= 70 (MỚI)
  daily_checkin: 3,       // Check-in mỗi ngày (MỚI)
  streak_7_bonus: 15,     // Streak 7 ngày (MỚI)
  streak_14_bonus: 30,    // Streak 14 ngày (MỚI)
  daily_quest_complete: 10, // Quest hoàn thành (đã có)
  weekly_challenge: 25,   // Weekly challenge (đã có)
} as const;

export function computeGemReward(rating: ExerciseRating): number {
  if (rating === "EXCELLENT") return GEM_REWARDS.excellent_exercise;
  if (rating === "GOOD") return GEM_REWARDS.good_exercise;
  return 0;
}
```

### Bước 4.1.2: Thêm gems vào check-in reward

**File:** `frontend/src/app/api/checkin/route.ts`

```tsx
// THÊM gems reward vào check-in response
const gemsEarned = GEM_REWARDS.daily_checkin;
await tx.user.update({
  where: { id: userId },
  data: { gems: { increment: gemsEarned } },
});
```

### Bước 4.1.3: Gems earning summary UI

Thêm vào DailyCheckIn success message:
```tsx
// Sau khi check-in thành công
setMessage(`Đã điểm danh: +10 XP, +2 điểm hạng, +${gemsEarned} 💎`);
```

**Skills áp dụng:**
- `maintainable-code`: GEM_REWARDS là constants object, không magic numbers
- `nielsen-ux-heuristics`: H1 (Visibility) — user thấy gem earn ở MỌI action

**Verification:**
- [ ] Exercise GOOD (≥70) → +2 gems
- [ ] Exercise EXCELLENT (≥90) → +5 gems
- [ ] Check-in → +3 gems
- [ ] Unit tests updated

---

## Task 4.2: Mở Rộng Shop Items

**Vấn đề:** Chỉ 3 items → user không có gì để tiêu gems.

**File thay đổi:**
- `frontend/src/lib/gamification.ts` — SHOP_ITEMS
- `frontend/src/components/gamification/GemsDisplay.tsx` — shop modal UI

### Bước 4.2.1: Mở rộng SHOP_ITEMS

```tsx
// TRƯỚC (3 items)
export const SHOP_ITEMS = [
  { id: "ipa_reveal", name: "Kính Lúp IPA", cost: 50 },
  { id: "slow_audio", name: "Loa Ma Thuật", cost: 20 },
  { id: "streak_freeze", name: "Bùa Đóng Băng", cost: 10 },
] as const;

// SAU (10 items, phân loại)
export type ShopCategory = "power_up" | "cosmetic" | "protection";

export const SHOP_ITEMS = [
  // Power-ups (functional)
  { id: "ipa_reveal", name: "Kính Lúp IPA", cost: 50, category: "power_up" as const, desc: "Xem IPA transcription cho câu khó trong Thực chiến", icon: "🔍" },
  { id: "slow_audio", name: "Loa Ma Thuật", cost: 20, category: "power_up" as const, desc: "Nghe audio chậm x0.5 trong 1 bài", icon: "🔊" },
  { id: "xp_boost", name: "Sách Thần", cost: 40, category: "power_up" as const, desc: "x1.5 XP trong 3 bài tiếp theo", icon: "📖" },
  { id: "hint_token", name: "Gợi Ý Vàng", cost: 15, category: "power_up" as const, desc: "Xem gợi ý 1 lần trong bài nghe", icon: "💡" },

  // Protection (streak/safety)
  { id: "streak_freeze", name: "Bùa Đóng Băng", cost: 10, category: "protection" as const, desc: "Giữ chuỗi ngày khi lỡ 1 ngày", icon: "❄️" },
  { id: "second_chance", name: "Cơ Hội Thứ Hai", cost: 30, category: "protection" as const, desc: "Được làm lại 1 câu sai trong bài (không mất điểm)", icon: "🔄" },

  // Cosmetic (avatar/profile)
  { id: "frame_gold", name: "Khung Avatar Vàng", cost: 80, category: "cosmetic" as const, desc: "Khung viền vàng cho avatar", icon: "🖼️" },
  { id: "frame_fire", name: "Khung Avatar Lửa", cost: 100, category: "cosmetic" as const, desc: "Khung viền lửa cho avatar (streak ≥14)", icon: "🔥" },
  { id: "title_scholar", name: "Danh Hiệu: Học Giả", cost: 60, category: "cosmetic" as const, desc: "Hiển thị danh hiệu dưới tên", icon: "🎓" },
  { id: "title_champion", name: "Danh Hiệu: Quán Quân", cost: 120, category: "cosmetic" as const, desc: "Danh hiệu đặc biệt cho top 10", icon: "👑" },
] as const;
```

### Bước 4.2.2: Shop UI với categories

```tsx
// GemsDisplay.tsx — Shop modal
const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "power_up", label: "⚡ Hỗ trợ" },
  { id: "protection", label: "🛡️ Bảo vệ" },
  { id: "cosmetic", label: "✨ Trang trí" },
] as const;

// Render grid với category tabs
// Mỗi item: icon + name + desc + cost + buy button
```

### Bước 4.2.3: Purchase confirmation dialog

```tsx
// Trước khi mua
const confirmed = window.confirm(`Mua "${item.name}" với ${item.cost} 💎?\nSố dư hiện tại: ${userGems} 💎`);
```

**Skills áp dụng:**
- `maintainable-code`: ShopCategory type, SHOP_ITEMS typed readonly array
- `nielsen-ux-heuristics`: H5 (Error Prevention) — confirm before purchase
- `ui-color-harmony`: Power-ups dùng blue, Protection dùng green, Cosmetic dùng purple

**Verification:**
- [ ] Shop hiện 10 items phân loại
- [ ] Purchase confirm dialog
- [ ] Not enough gems → disable button + tooltip

---

## Task 4.3: Gems Balance Visibility

**Vấn đề:** Gems hiện ở navbar nhưng không prominent, user quên mình có gems.

**File thay đổi:**
- Navbar component
- ExerciseSummaryScreen

### Bước 4.3.1: Gems earn notification trong Summary

Thêm gems card vào summary 4-card grid:
```tsx
{/* Gems */}
{gemsEarned > 0 && (
  <div className="rounded-lg bg-purple-50 p-4 text-purple-700">
    <p className="text-sm font-semibold">💎 Gems</p>
    <p className="text-2xl font-black">+{gemsEarned}</p>
  </div>
)}
```

### Bước 4.3.2: Navbar gems display enhancement

```tsx
// Current: 💎 {gems}
// Enhanced: clickable, with tooltip
<Link href="#" onClick={openShopModal} className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700 hover:bg-purple-100">
  <span>💎</span>
  <span>{gems}</span>
</Link>
```

**Verification:**
- [ ] Summary hiện gems earned
- [ ] Navbar gems clickable → shop modal
- [ ] Responsive: gems hiện trên mobile

---

## Tổng Kết Priority 4

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 4.1 Mở rộng gem earning | LOW | HIGH | Không |
| 4.2 Mở rộng shop items | MEDIUM | HIGH | 4.1 |
| 4.3 Gems balance visibility | LOW | MEDIUM | 4.1 |

**Tổng thời gian ước tính:** 6-8 giờ

**Thứ tự đề xuất:** 4.1 → 4.3 → 4.2
