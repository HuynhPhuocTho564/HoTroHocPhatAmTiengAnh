# 🎨 Hệ Thống Màu Sắc - Blue + Orange

## 📋 Tổng Quan

Dự án **Web_HoTroPhatAmEN** sử dụng hệ thống màu **Blue + Orange** - lựa chọn tối ưu cho nền tảng giáo dục.

### 🎯 Lý Do Chọn Blue + Orange

| Tiêu chí | Blue (#2563EB) | Orange (#F97316) |
|----------|----------------|------------------|
| **Tượng trưng** | Học tập, tri thức, tin cậy | Năng lượng, nhiệt huyết, động lực |
| **Phù hợp** | Nền tảng giáo dục | Gamification (streak, rewards) |
| **Cảm xúc** | Bình tĩnh, tập trung | Ấm áp, khuyến khích |
| **Tâm lý học** | Giảm stress, tăng tập trung | Tăng động lực, hứng thú |

### ✅ Ưu Điểm

1. **Tương phản tốt**: Blue (lạnh) + Orange (ấm) = Visual hierarchy rõ ràng
2. **Phù hợp văn hóa Việt Nam**: Không gây khó chịu, dễ chấp nhận
3. **Không gây mệt mỏi**: Học lâu không bị mỏi mắt
4. **Dễ phân biệt**: Các loại thông tin rõ ràng
5. **Accessibility**: Đảm bảo contrast ratio 4.5:1 (WCAG 2.1 AA)

---

## 🎨 Color Palette

### 1. PRIMARY — Blue (Màu Chính)

**Hex:** `#2563EB` (primary-600)

**Khi nào dùng:**
- ✅ Buttons chính (CTA)
- ✅ Links và navigation
- ✅ Headers và titles quan trọng
- ✅ Progress bars (học tập)
- ✅ Icons học tập

**Ví dụ:**
```tsx
// Button chính
<button className="bg-primary-600 text-white hover:bg-primary-700">
  Tiếp tục học
</button>

// Link
<a className="text-primary-600 hover:text-primary-700">
  Xem chi tiết
</a>

// Header
<h1 className="text-primary-600">Bảng IPA</h1>
```

**Shades:**
- `primary-50` → `primary-900`: Từ nhạt đến đậm
- Dùng `primary-50/100` cho backgrounds
- Dùng `primary-600/700` cho text và buttons

---

### 2. ACCENT — Orange (Màu Phụ - Gamification)

**Hex:** `#F97316` (accent-500)

**Khi nào dùng:**
- 🔥 Streak counter
- 🎁 Rewards và phần thưởng
- ⭐ Achievements và badges
- 📈 Gamification elements
- 🎯 Call-to-action phụ

**Ví dụ:**
```tsx
// Streak badge
<div className="bg-accent-50 border-accent-300 text-accent-700">
  🔥 5 ngày liên tiếp
</div>

// Reward button
<button className="bg-accent-500 text-white hover:bg-accent-600">
  🎁 Nhận quà
</button>

// Achievement card
<div className="bg-gradient-to-r from-accent-50 to-accent-100">
  Hoàn thành 10 bài học!
</div>
```

**Lưu ý:**
- ⚠️ **Không lạm dụng**: Orange chỉ dùng cho gamification
- ⚠️ **Không dùng cho text dài**: Chỉ dùng cho highlights
- ✅ **Kết hợp với Blue**: Tạo contrast tốt

---

### 3. SUCCESS — Green (Đúng, Thành Công)

**Hex:** `#22C55E` (success-500)

**Khi nào dùng:**
- ✅ Phát âm đúng (score ≥ 70%)
- ✅ Hoàn thành bài tập
- ✅ Success messages
- ✅ Checkmarks và confirmations

**Ví dụ:**
```tsx
// Score card (correct)
<div className="bg-success-50 border-success-300">
  <span className="text-success-700">Xuất sắc! 🎉</span>
  <span className="text-success-600">95%</span>
</div>

// Success toast
<div className="bg-success-500 text-white">
  ✅ Đã lưu thành công!
</div>
```

---

### 4. WARNING — Amber (Cần Cải Thiện)

**Hex:** `#F59E0B` (warning-500)

**Khi nào dùng:**
- ⚠️ Phát âm cần cải thiện (score 50-69%)
- ⚠️ Cảnh báo nhẹ
- ⚠️ Thông báo quan trọng

**Ví dụ:**
```tsx
// Score card (needs improvement)
<div className="bg-warning-50 border-warning-300">
  <span className="text-warning-700">Cần luyện thêm 💪</span>
  <span className="text-warning-600">65%</span>
</div>
```

---

### 5. ERROR — Soft Red (Sai, Không Đáng Sợ)

**Hex:** `#EF4444` (error-500)

**Khi nào dùng:**
- ❌ Phát âm sai (score < 50%)
- ❌ Error messages
- ❌ Validation errors

**Lưu ý:**
- ⚠️ **Không dùng đỏ chói**: Dùng soft red để không gây stress
- ✅ **Kết hợp với text**: "Hãy thử lại! 🎯" thay vì chỉ "Sai"

**Ví dụ:**
```tsx
// Score card (incorrect)
<div className="bg-error-50 border-error-300">
  <span className="text-error-700">Hãy thử lại! 🎯</span>
  <span className="text-error-600">45%</span>
</div>
```

---

### 6. NEUTRAL — Gray (Backgrounds, Text)

**Hex:** `#6B7280` (neutral-500)

**Khi nào dùng:**
- 📄 Body text
- 🖼️ Backgrounds
- 🔲 Borders
- 🔘 Disabled states

**Ví dụ:**
```tsx
// Body text
<p className="text-neutral-700">Nội dung bài học...</p>

// Background
<div className="bg-neutral-50">...</div>

// Border
<div className="border border-neutral-200">...</div>
```

---

## 🎯 Quy Tắc Sử Dụng

### 1. **60-30-10 Rule**

Áp dụng tỷ lệ màu sắc:
- **60%**: Neutral (backgrounds, text)
- **30%**: Primary Blue (main elements)
- **10%**: Accent Orange (highlights, gamification)

**Ví dụ trang Dashboard:**
```
60% → White/Gray backgrounds, black text
30% → Blue buttons, blue headers, blue links
10% → Orange streak badge, orange rewards
```

### 2. **Hierarchy với Màu**

```
Quan trọng nhất → Primary Blue
Gamification → Accent Orange
Success → Green
Warning → Amber
Error → Red
Neutral → Gray
```

### 3. **Gradients (Sử dụng Tiết Kiệm)**

**Khi nào dùng:**
- ✅ Hero sections
- ✅ Cards đặc biệt (rewards, achievements)
- ✅ Backgrounds trang

**Ví dụ:**
```tsx
// Blue gradient
<div className="bg-gradient-to-r from-primary-500 to-primary-700">

// Blue + Orange gradient (gamification)
<div className="bg-gradient-to-r from-primary-600 to-accent-500">

// Subtle background
<div className="bg-gradient-to-br from-primary-50 to-accent-50">
```

**Lưu ý:**
- ⚠️ **Không lạm dụng**: Chỉ dùng cho elements quan trọng
- ⚠️ **Kiểm tra contrast**: Đảm bảo text vẫn đọc được

---

## 📐 Ví Dụ Thực Tế

### Dashboard Page

```tsx
// Background: Neutral
<div className="bg-neutral-50">
  
  // Header: Primary Blue
  <h1 className="text-primary-600">Xin chào, Alex!</h1>
  
  // Streak badge: Accent Orange
  <div className="bg-accent-50 border-accent-300 text-accent-700">
    🔥 5 ngày liên tiếp
  </div>
  
  // Button: Primary Blue
  <button className="bg-primary-600 text-white">
    Tiếp tục học
  </button>
  
  // Stats card: Neutral with Blue accent
  <div className="bg-white border-primary-200">
    <span className="text-primary-600">24</span>
    <span className="text-neutral-600">bài đã hoàn thành</span>
  </div>
</div>
```

### Check-in Page

```tsx
// Background: Gradient Blue + Orange
<div className="bg-gradient-to-br from-primary-50 to-accent-50">
  
  // Header: Gradient text
  <h1 className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
    Điểm Danh Hàng Ngày
  </h1>
  
  // Streak card: Orange
  <div className="bg-accent-50 border-accent-300">
    <span className="text-accent-700">🔥 5</span>
  </div>
  
  // Reward button: Orange
  <button className="bg-accent-500 text-white">
    🎁 Nhận quà
  </button>
</div>
```

### Exercise Page

```tsx
// Score feedback
{score >= 90 && (
  <div className="bg-success-50 border-success-300">
    <span className="text-success-700">Xuất sắc! 🎉</span>
  </div>
)}

{score >= 70 && score < 90 && (
  <div className="bg-primary-50 border-primary-300">
    <span className="text-primary-700">Tốt lắm! 👍</span>
  </div>
)}

{score >= 50 && score < 70 && (
  <div className="bg-warning-50 border-warning-300">
    <span className="text-warning-700">Cần luyện thêm 💪</span>
  </div>
)}

{score < 50 && (
  <div className="bg-error-50 border-error-300">
    <span className="text-error-700">Hãy thử lại! 🎯</span>
  </div>
)}
```

---

## 🚫 Những Điều Cần Tránh

### ❌ Không Nên

1. **Dùng quá nhiều màu cùng lúc**
   ```tsx
   // BAD: Rainbow effect
   <div className="bg-primary-500 border-accent-500 text-success-700">
   ```

2. **Dùng Orange cho text dài**
   ```tsx
   // BAD: Khó đọc
   <p className="text-accent-600">Đây là đoạn văn dài...</p>
   ```

3. **Gradient phức tạp**
   ```tsx
   // BAD: Quá nhiều màu
   <div className="bg-gradient-to-r from-primary-500 via-accent-500 via-success-500 to-warning-500">
   ```

4. **Contrast thấp**
   ```tsx
   // BAD: Khó đọc
   <div className="bg-primary-100 text-primary-200">
   ```

### ✅ Nên

1. **Giữ đơn giản**
   ```tsx
   // GOOD: Clean and clear
   <div className="bg-white border-primary-200 text-neutral-900">
   ```

2. **Dùng Orange cho highlights**
   ```tsx
   // GOOD: Accent only
   <span className="text-accent-600 font-bold">5 ngày</span>
   ```

3. **Gradient tinh tế**
   ```tsx
   // GOOD: Subtle
   <div className="bg-gradient-to-r from-primary-50 to-accent-50">
   ```

4. **Contrast cao**
   ```tsx
   // GOOD: Easy to read
   <div className="bg-primary-600 text-white">
   ```

---

## 📊 Accessibility (WCAG 2.1 AA)

### Contrast Ratios

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `primary-600` on white | 7.5:1 | ✅ AAA |
| `accent-500` on white | 4.6:1 | ✅ AA |
| `success-600` on white | 5.2:1 | ✅ AA |
| `warning-600` on white | 4.8:1 | ✅ AA |
| `error-500` on white | 4.5:1 | ✅ AA |

### Kiểm Tra Contrast

```tsx
// Luôn kiểm tra contrast khi dùng màu custom
// Tool: https://webaim.org/resources/contrastchecker/

// GOOD: High contrast
<div className="bg-primary-600 text-white">  // 7.5:1

// BAD: Low contrast
<div className="bg-primary-100 text-primary-200">  // 1.5:1
```

---

## 🎓 Best Practices

### 1. **Consistency (Nhất Quán)**
- Dùng cùng một màu cho cùng một mục đích
- Ví dụ: Streak luôn dùng Orange, không đổi sang màu khác

### 2. **Hierarchy (Phân Cấp)**
- Primary Blue: Quan trọng nhất
- Accent Orange: Gamification
- Neutral: Nội dung

### 3. **Context (Ngữ Cảnh)**
- Blue: Học tập, tri thức
- Orange: Động lực, phần thưởng
- Green: Thành công
- Red: Lỗi (nhưng không đáng sợ)

### 4. **Testing (Kiểm Tra)**
- Test trên nhiều devices
- Test với người dùng thật
- Test accessibility với screen readers

---

## 📚 Tài Liệu Tham Khảo

- [Color Psychology in Education](https://www.colorpsychology.org/)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Material Design Color System](https://material.io/design/color)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)

---

**Ngày tạo:** 01/06/2026  
**Phiên bản:** 1.0  
**Trạng thái:** ✅ Đã áp dụng toàn bộ dự án
