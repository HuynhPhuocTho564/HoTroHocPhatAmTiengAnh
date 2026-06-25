---
name: ui-color-harmony
description: Use when changing color classes, adding colored UI, making theme changes, designing Rank Tier colors, modifying gradients, or fixing contrast for Web_HoTroPhatAmEN. Applies 60-30-10 ratio, semantic color mapping, color theory (HSV), color blindness testing, WCAG 2.1 contrast, theme tokens over hardcoded hex, and Tailwind 50-900 scale usage. Required for color-related tasks in PLAN/03_UI_UX/IMPROVEMENT_P1..P6.
---

# UI Color Harmony

## Khi nào dùng

- Thay đổi class màu (`bg-*`, `text-*`, `border-*`)
- Thêm UI có màu (badge, tier, status indicator)
- Làm theme, sửa gradient, đổi palette
- Thiết kế Rank Tier color (Bronze/Silver/Gold/Diamond — P3-3.2)
- Fix contrast issue, kiểm WCAG

Dùng song song với `accessibility` (skill gốc cho WCAG/ARIA/keyboard chi tiết) và `hci_consultant` (palette định nghĩa) — skill này thêm *60-30-10 + color theory + color blindness testing + Tailwind scale + tier color* chưa có.

## Checklist thực thi

- [ ] 60-30-10 ratio maintained (dominant/secondary/accent)
- [ ] Semantic colors đúng (green=success, amber=warning, soft-red=error, blue=info)
- [ ] WCAG contrast ≥ 4.5:1 text thường / 3:1 text lớn & UI
- [ ] Dùng theme tokens (`bg-primary-500`), không hardcode hex (`#3B82F6`)
- [ ] Color blindness check (không phân biệt trạng thái chỉ bằng màu)
- [ ] Tailwind scale dùng đúng: cùng hue family cho 1 element (50-200 tint, 500 base, 700-900 shade)

## Lý thuyết cốt lõi

### A. Quy tắc 60-30-10

- **Dominant 60%** — background, base surface: `neutral-50`, `white`, `neutral-100`
- **Secondary 30%** — sidebar, card, nav, header: `primary-50`, `neutral-100`, `neutral-200`
- **Accent 10%** — CTA, highlight, badge, active state: `primary-500`, `accent-500`, `success-500`
- **Lý do:** cân bằng thị giác, mắt không mệt, focus tự nhiên vào accent. Quá nhiều accent → mất focus; toàn neutral → nhàm chán
- **Cách đo:** screenshot → mở Figma/Photoshop → sample pixel area → đếm tỷ lệ diện tích mỗi nhóm. Hoặc eyeball: accent chỉ nên là vài điểm trên màn hình
- **Vi phạm phổ biến:** 5 nút cùng primary-500 (không còn accent), toàn card cùng accent (mất hierarchy)

### B. Semantic color mapping — CỐT LÕI

- `success` = green (`success-500` #22C55E) — phát âm đúng, bài hoàn thành
- `warning` = amber (`warning-500` #F59E0B) — gần đúng, sắp hết streak
- `error` = soft-red (`error-500` #EF4444) — sai, không đỏ chói gây alarm
- `info` = blue (`primary-500`) — thông báo trung tính
- **TẠI SAO nhất quán:** user học nghĩa màu qua lặp. Đổi = phá học = cognitive load (H4 Nielsen)
- **Ngoại lệ: gamification currency có palette riêng** — coins (yellow/orange), gems (purple/indigo), diamond (cyan). Vì currency không phải trạng thái hệ thống, là "vật" riêng
- **Quy tắc phân biệt:** trạng thái hệ thống → semantic; vật/nhãn → palette riêng

### C. Color theory cơ bản (HSV)

- **Hue** (sắc màu) — vị trí trên bánh màu (0-360°): red 0, yellow 60, green 120, cyan 180, blue 240, magenta 300
- **Saturation** (độ bão hòa) — intensity màu (0% = xám, 100% = màu đầy)
- **Value** (độ sáng) — sáng tối (0% = đen, 100% = trắng)
- **Warm** (red/orange/yellow) = năng lượng, CTA, cảnh báo nhẹ
- **Cool** (blue/green/purple) = tin cậy, học tập, calm
- **Ngữ cảnh Việt:** đỏ = may mắn (Tết, lì xì) nhưng trong UI đỏ = lỗi → phân biệt ngữ cảnh. Badge Tier Bronze (cam) không liên quan lỗi
- **Color in context** (Josef Albers): cùng 1 màu nhìn khác trên nền khác → KIỂM TRÊN NỀN THẬT, không chọn màu trên nền trắng rồi áp vào nền xám
- **Harmony scheme:**
  - Analogous (kề nhau trên bánh) — dễ chịu, yếu (primary + indigo + purple cho gems)
  - Complementary (đối nhau) — tương phản mạnh, khó cân (dùng cho CTA nổi bật)
  - Triadic (3 đều nhau) — cân bằng, vui (gamification)

### D. Color blindness — CỐT LæI (không chỉ bullet)

- **Tỷ lệ:** ~8% nam deuteranopia/protanopia (không phân biệt đỏ-xanh), ~0.5% nữ; ~0.005% achromatopsia
- **Quy tắc vàng:** KHÔNG BAO GIỜ phân biệt trạng thái/thông tin CHỈ bằng màu
- **Luôn kèm:** icon + text + shape. Error = đỏ + icon ⚠ + chữ "Lỗi". Success = xanh + ✓ + chữ "Đúng"
- **Tool kiểm:**
  - **Coblis** (color-blindness.com/coblis-color-blindness-simulator) — upload screenshot
  - **Stark** plugin (Figma/Adobe XD) — simulate live
  - **Chrome DevTools** → Rendering → Emulate vision deficiencies
- **Test thủ công:** deuteranopia mode → mọi trạng thái vẫn phân biệt được không?
- **Ví dụ nguy hiểm:** chỉ có `bg-red-500` cho "sai" và `bg-green-500` cho "đúng" → user mù màu thấy 2 màu gần giống → không biết đúng sai. Fix: thêm ✓/✗ icon + text "Đúng/Sai"

### E. WCAG 2.1 contrast

- **Text thường** (<18px / <14px bold): ≥ **4.5:1** (AA), 7:1 (AAA)
- **Text lớn** (≥18px / ≥14px bold): ≥ **3:1** (AA), 4.5:1 (AAA)
- **UI component & graphics** (icon, border, focus ring): ≥ **3:1**
- **Công thức ratio:** (L1 + 0.05) / (L2 + 0.05), L = relative luminance = 0.2126·R + 0.7152·G + 0.0722·B (linéarized)
- **Tool kiểm:**
  - WebAIM Contrast Checker (webaim.org/resources/contrastchecker)
  - Chrome DevTools → inspect element → contrast ratio hiển thị
  - Tailwind docs có contrast cho mỗi shade
- **Cách chọn cặp đạt chuẩn:** bắt với màu nền → tăng đậm text đến khi đạt ratio. neutral-900 trên white = 21:1 (đạt AAA). primary-400 trên white có thể <4.5 → dùng primary-500+
- **Ngoại lệ:** logo, decorative (không truyền thông tin) — không yêu cầu contrast

### F. Theme tokens vs hardcode hex

- **Dùng** `--primary-500` / `bg-primary-500` / `text-success-600`, **KHÔNG** `#3B82F6`
- **Lý do:**
  1. **Maintainability** — đổi 1 chỗ trong config, áp dụng mọi nơi
  2. **Theming** — dark mode khi cần chỉ đổi token value, không sửa từng file
  3. **Consistency** — không lệch 1-2 shade giữa các page
- **Ngoại lệ:** gradient đôi khi cần hex (đặc biệt gradient cross-hue), nhưng ưu tiên token khi có thể
- **Setup dự án:** Tailwind config định nghĩa `primary`, `success`, `warning`, `error`, `neutral`, `accent` — dùng các tên này

### G. Tailwind color scale 50-900 — CỐT LæI (codebase dùng Tailwind)

- **Cấu trúc:** 50 (lightest tint) → 100 → 200 → 300 → 400 → 500 (base) → 600 → 700 → 800 → 900 (darkest shade)
- **Cách dùng hài hòa — cùng hue family cho 1 element:**
  ```tsx
  // ĐÚNG — cùng primary family, 3 shade khác vai trò
  <div className="bg-primary-50 border border-primary-500 text-primary-700">
    {/* bg tint nhẹ, border base, text shade đậm */}
  </div>

  // SAI — trộn hue family, mất harmony
  <div className="bg-primary-50 border border-success-500 text-error-700">
  ```
- **Nguyên tắc vai trò:**
  - Tint (50-200) → background nhẹ, hover state
  - Base (500) → border, icon, CTA fill
  - Shade (600-900) → text đậm, active state, hover dark
- **Sai phổ biến:** `bg-primary-50` + `text-primary-300` (text quá nhạt, contrast <4.5:1)
- **Tier color + Tailwind:** nếu không có sẵn Bronze/Silver, custom thêm trong `tailwind.config.js` thay vì hardcode hex inline

### H. Gamification tier color — bổ sung cho P3-3.2

- **Bronze** #CD7F32 / **Silver** #C0C0C0 / **Gold** #FFD700 / **Diamond** #B9F2FF
- **Text trên tier background:**
  - Bronze/Gold (vàng/cam đậm) → text sáng (`neutral-50`/`white`) hoặc tối (`neutral-900`) tùy contrast — kiểm từng cặp
  - Silver/Diamond (sáng) → text tối (`neutral-800`/`neutral-900`)
- **Kiểm contrast:** ≥ 4.5:1 cho text tier. Bronze #CD7F32 + white = ~3.8:1 (không đạt AA text thường) → dùng neutral-900 hoặc Bronze đậm hơn #8B4513
- **Tier border/icon:** dùng shade đậm hơn tier bg cho hierarchy (Bronze bg #CD7F32 + border #8B4513)
- **Khuyến nghị:** định nghĩa tier color trong Tailwind config thay vì inline hex, dễ bảo trì

## Ví dụ before/after (từ PLAN IMPROVEMENT)

### Ví dụ 1: Currency gradient đổi hue family (P1-1.1.2)

```tsx
// TRƯỚC — coins yellow/orange
<div className="bg-gradient-to-br from-yellow-50 to-orange-50">
  <span className="text-orange-600">🪙 {coins} xu</span>
</div>

// SAU — gems purple (semantic palette cho currency, không phải trạng thái)
<div className="bg-gradient-to-br from-purple-50 to-indigo-50">
  <span className="text-purple-600">💎 {gems} gems</span>
</div>
// Lý do: gems = purple family theo design system, khác yellow coins.
// Tailwind scale: purple-50 bg tint + purple-600 text shade → harmony + contrast
```

### Ví dụ 2: Skeleton dùng Tailwind tint (P1-1.4)

```tsx
// ĐÚNG — neutral tint scale, không hardcode hex
<div className="h-14 w-14 rounded-xl bg-neutral-200 animate-pulse" />
<div className="h-6 w-3/4 rounded bg-neutral-100 mt-2" />
// bg-neutral-200 (tint) cho khối lớn, bg-neutral-100 (lighter tint) cho khối nhỏ → hierarchy
```

### Ví dụ 3: Rank Tier color (P3-3.2)

```tsx
// ĐỊNH NGHĨA trong tailwind.config.js (không hardcode inline)
extend: {
  colors: {
    tier: {
      bronze: { DEFAULT: '#CD7F32', dark: '#8B4513' },
      silver: { DEFAULT: '#C0C0C0', dark: '#808080' },
      gold:   { DEFAULT: '#FFD700', dark: '#B8860B' },
      diamond:{ DEFAULT: '#B9F2FF', dark: '#5B9BD5' },
    }
  }
}

// SỬ DỤNG — text contrast kiểm trước
<div className="bg-tier-bronze border border-tier-bronze-dark rounded-lg p-4">
  <span className="text-neutral-900 font-bold">Bronze Tier</span>
  {/* neutral-900 trên Bronze #CD7F32 = ~7:1, đạt AAA */}
</div>
```

### Ví dụ 4: Color blindness — error state không chỉ màu (P5 phonetic feedback)

```tsx
// TRƯỚC — chỉ màu, mù màu đỏ-xanh không phân biệt
<div className="bg-red-100 text-red-700">/ʃ/ sai</div>
<div className="bg-green-100 text-green-700">/ʃ/ đúng</div>

// SAU — màu + icon + text (3 channel)
<div className="bg-error-50 text-error-700 flex items-center gap-2">
  <span aria-hidden>✗</span>
  <span>/ʃ/ sai — lưỡi chưa cong</span>
</div>
<div className="bg-success-50 text-success-700 flex items-center gap-2">
  <span aria-hidden>✓</span>
  <span>/ʃ/ đúng</span>
</div>
// 3 channel: màu (error/success) + icon (✗/✓) + text (sai/đúng) → mù màu vẫn rõ
```

## Quan hệ với skill khác

- **Complement `accessibility`** (skill gốc): accessibility cho *a11y rộng* (WCAG, ARIA, keyboard, focus, screen reader). Skill này cho *màu cụ thể*. Khi chạm ARIA/keyboard, đọc accessibility; khi quyết màu, đọc skill này.
- **Complement `hci_consultant`** (skill gốc): hci_consultant định nghĩa *palette* (primary/success/warning/error/accent). Skill này cho *cách dùng palette* (60-30-10, Tailwind scale, tier color) mà hci_consultant không chi tiết.
- **Cặp với `nielsen-ux-heuristics`** (cùng nhóm): H8 (minimalist) liên quan 60-30-10 (quá nhiều accent = clutter). Khi quyết layout + màu, đọc cả 2.
- **Cặp với `web-usability-scales`** (cùng nhóm): SUS câu 6 (consistency) + UEQ Attractiveness bị ảnh hưởng bởi color harmony. Đo trước/sau khi đổi màu.
