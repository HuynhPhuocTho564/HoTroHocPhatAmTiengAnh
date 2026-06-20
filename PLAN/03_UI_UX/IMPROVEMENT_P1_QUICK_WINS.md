# Kế Hoạch Cải Thiện Nhanh — Quick Wins (Ưu tiên 1)

**Mục tiêu:** Fix các vấn đề LOW effort nhưng HIGH impact, tạo nền tảng cho các cải thiện lớn hơn.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md)

**Skills bắt buộc áp dụng:**
- `maintainable-code` — Mọi thay đổi code phải tuân thủ KISS, DRY, Type Safety, Constants
- `ui-color-harmony` — Khi thay đổi class màu, kiểm tra 60-30-10 và WCAG contrast
- `nielsen-ux-heuristics` — H4 (Consistency) và H8 (Minimalist Design)

---

## Task 1.1: Thống Nhất Currency — Bỏ "xu", Dùng Gems

**Vấn đề:** DailyRewardsPopup dùng "xu" (coins) nhưng hệ thống chính dùng XP + Gems → user confused.

**File thay đổi:**
- `frontend/src/components/gamification/DailyRewardsPopup.tsx`

**Các bước thực hiện:**

### Bước 1.1.1: Đổi "xu" → gems trong DailyRewardsPopup

```
Trước: { day: 1, coins: 10, ... }
Sau:   { day: 1, gems: 5, ... }
```

Chi tiết thay đổi trong `rewards` array:
| Ngày | Trước (xu) | Sau (gems) |
|------|-----------|-----------|
| 1 | 10 xu | 5 gems |
| 2 | 15 xu | 8 gems |
| 3 | 20 xu | 10 gems |
| 4 | 25 xu | 12 gems |
| 5 | 30 xu | 15 gems |
| 6 | 40 xu | 20 gems |
| 7 | 50 xu + huy hiệu | 25 gems + 🏆 |

### Bước 1.1.2: Update UI text
- Đổi `{reward.coins} xu` → `{reward.gems} 💎`
- Đổi `+{claimedReward.coins} xu` → `+{claimedReward.gems} 💎`
- Đổi icon `🪙` → `💎`
- Đổi gradient `from-yellow-50 to-orange-50` → `from-purple-50 to-indigo-50` (gems color)

### Bước 1.1.3: Xóa animate-bounce trên claim button
```tsx
// TRƯỚC (distracting)
<Button className="animate-bounce">

// SAU (subtle hover feedback)
<Button className="hover:scale-[1.02] transition-transform">
```

**Lý do:** `animate-bounce` vi phạm H8 (Aesthetic & Minimalist). Bounce liên tục gây distraction.

### Bước 1.1.4: Di chuyển warning block
- Xóa warning block "⚠️ Lưu ý" khỏi DailyRewardsPopup
- Thêm nội dung tương tự vào DailyCheckIn description (đã có chỗ)

**Skills áp dụng:**
- `maintainable-code`: Dùng constant `DAILY_REWARD_GEMS` thay vì hardcode values
- `ui-color-harmony`: Gems dùng purple tone (từ color system), không dùng yellow (coins)

**Verification:**
- [ ] Build không lỗi
- [ ] Popup hiện 💎 thay vì 🪙
- [ ] Số gems hợp lý (5-25, không quá nhiều)

---

## Task 1.2: Xóa Dead Code

### Task 1.2.1: Xóa Dark Mode CSS trong globals.css

**File:** `frontend/src/app/globals.css`

**Xóa từ dòng 118 đến dòng 239** (122 dòng dark mode CSS):
```css
/* XÓA TOÀN BỘ BLOCK NÀY */
html.dark { ... }
html.dark body { ... }
html.dark .bg-white { ... }
/* ... tất cả html.dark overrides ... */
```

**Giữ lại:**
- `@custom-variant dark` (dòng 2) — giữ để không lỗi nếu sau này cần
- Light mode styles — giữ nguyên

**Lý do:** Dark mode bị force-disable trong layout.tsx, 122 dòng CSS này là dead code.

### Task 1.2.2: Archive hoặc xóa legacy styles.css

**File:** `english_pronunciation_app/css/styles.css` (988 dòng)

**Hành động:** 
- Tạo folder `english_pronunciation_app/css/_archive/`
- Move `styles.css` vào `_archive/`
- Thêm file `_archive/README.md` giải thích: "Legacy static site CSS. Not used by Next.js app."

**Lý do:** File này thuộc về static landing page cũ, không dùng bởi Next.js frontend.

**Skills áp dụng:**
- `maintainable-code`: Clean file structure — dead code phải được loại bỏ

**Verification:**
- [ ] `tsc --noEmit` pass
- [ ] App chạy bình thường sau khi xóa
- [ ] Không có import nào reference dark mode classes đã xóa

---

## Task 1.3: Fix Text & Labels

### Task 1.3.1: Fix "Tất thời gian" → "Mọi thời đại"

**File:** `frontend/src/app/leaderboard/page.tsx`

```tsx
// TRƯỚC (dòng 51)
{ id: "all", name: "Tất thời gian" }

// SAU
{ id: "all", name: "Mọi thời đại" }
```

Cũng fix ở dòng 108 và 138:
```tsx
// TRƯỚC
<p>Điểm hạng reset theo tuần/tháng. Tất thời gian xếp theo tổng XP.</p>
// SAU
<p>Điểm hạng reset theo tuần/tháng. Mọi thời đại xếp theo tổng XP.</p>

// TRƯỚC (dòng 138)
{data.type === "all" ? "Tất thời gian" : `Kỳ ${data.period}`}
// SAU
{data.type === "all" ? "Mọi thời đại" : `Kỳ ${data.period}`}
```

### Task 1.3.2: Ẩn "Đồ án tốt nghiệp 2026" badge

**File:** `frontend/src/app/page.tsx`

**Hành động:** Comment out hoặc xóa badge "Đồ án tốt nghiệp 2026" (dòng 10-15):
```tsx
{/* XÓA hoặc COMMENT: không liên quan user goal */}
{/* <div className="mb-8 inline-flex ...">Đồ án tốt nghiệp 2026</div> */}
```

**Lý do (H8 — Aesthetic & Minimalist):** Element này không phục vụ user goal học phát âm, chỉ tăng extraneous cognitive load.

### Task 1.3.3: Localize Badge Type Display

**File:** `frontend/src/app/badges/page.tsx`

```tsx
// THÊM function
function localizeBadgeType(type: string): string {
  switch (type) {
    case "COMMON": return "Thường";
    case "RARE": return "Hiếm";
    case "EPIC": return "Huyền thoại";
    case "PERIODIC": return "Theo kỳ";
    default: return type;
  }
}

// THAY THẾ ở BadgeCard component (dòng ~94)
// TRƯỚC: {badge.type}
// SAU: {localizeBadgeType(badge.type)}
```

**Skills áp dụng:**
- `maintainable-code`: DRY — dùng function thay vì inline switch nhiều chỗ
- `nielsen-ux-heuristics`: H2 (Match between system and real world) — dùng ngôn ngữ user

**Verification:**
- [ ] Leaderboard hiện "Mọi thời đại" thay vì "Tất thời gian"
- [ ] Home page không còn badge "Đồ án tốt nghiệp"
- [ ] Badges page hiện "Thường/Hiếm/Huyền thoại" thay vì COMMON/RARE/EPIC

---

## Task 1.4: Skeleton Loading States

### Task 1.4.1: Badges page skeleton

**File:** `frontend/src/app/badges/page.tsx`

```tsx
// TRƯỚC (dòng 239)
{isLoading && <Card>Đang tải huy hiệu...</Card>}

// SAU — skeleton cards với animate-pulse
{isLoading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="h-14 w-14 rounded-xl bg-neutral-200" />
          <div className="h-5 w-14 rounded bg-neutral-200" />
        </div>
        <div className="h-6 w-3/4 rounded bg-neutral-200 mb-2" />
        <div className="h-4 w-full rounded bg-neutral-100 mb-4" />
        <div className="h-4 w-1/2 rounded bg-neutral-100" />
      </Card>
    ))}
  </div>
)}
```

### Task 1.4.2: Leaderboard page skeleton

**File:** `frontend/src/app/leaderboard/page.tsx`

```tsx
// TRƯỚC (dòng 149)
{isLoading && <Card>Đang tải bảng xếp hạng...</Card>}

// SAU — skeleton list
{isLoading && (
  <Card padding="none" aria-busy="true">
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-neutral-200" />
          <div className="h-12 w-12 rounded-full bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-3 w-48 rounded bg-neutral-100" />
          </div>
          <div className="h-6 w-16 rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  </Card>
)}
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H1 (Visibility of System Status) — loading state phải visual, không text-only
- `maintainable-code`: Skeleton pattern nhất quán giữa các page

**Verification:**
- [ ] Badges page hiện skeleton cards khi loading
- [ ] Leaderboard page hiện skeleton list khi loading
- [ ] `aria-busy="true"` hiện trên container

---

## Task 1.5: Xóa DailyRewardsPopup Warning Block

**File:** `frontend/src/components/gamification/DailyRewardsPopup.tsx`

**Xóa block warning (dòng ~161-172):**
```tsx
{/* XÓA TOÀN BỘ BLOCK NÀY */}
<div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="text-2xl">⚠️</div>
    <div className="text-sm text-neutral-700">
      <p className="font-bold mb-1">Lưu ý:</p>
      <p>Nếu bỏ lỡ 1 ngày không nhận quà, chuỗi streak sẽ reset về Ngày 1...</p>
    </div>
  </div>
</div>
```

**Lý do (H8 — Minimalist):** Negative framing gây anxiety. Thông tin này đã có trong DailyCheckIn description.

**Verification:**
- [ ] Popup gọn hơn, không có warning block
- [ ] DailyCheckIn vẫn truyền đạt thông tin streak reset

---

## Tổng Kết Priority 1

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 1.1 Thống nhất currency | LOW | HIGH | Không |
| 1.2 Xóa dead code | LOW | MEDIUM | Không |
| 1.3 Fix text/labels | LOW | MEDIUM | Không |
| 1.4 Skeleton loading | LOW | MEDIUM | Không |
| 1.5 Xóa warning block | LOW | LOW | 1.1 |

**Tổng thời gian ước tính:** 2-3 giờ

**Tất cả tasks đều độc lập — có thể làm song song hoặc bất kỳ thứ tự.**
