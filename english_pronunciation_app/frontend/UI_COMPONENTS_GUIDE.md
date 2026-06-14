# 🎨 Hướng Dẫn Sử Dụng UI Components

> Tài liệu này mô tả các component UI đã được thiết kế theo chuẩn HCI và WCAG 2.1 AA

---

## 📦 Danh Sách Components Đã Xây Dựng

### 1. **Button** (`/components/ui/Button.tsx`)

Component nút bấm với nhiều variants và sizes.

**Props:**
- `variant`: "primary" | "secondary" | "success" | "error" | "ghost"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- `loading`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode

**Ví dụ:**
```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  Đăng nhập
</Button>

<Button 
  variant="success" 
  leftIcon={<CheckIcon />}
  onClick={handleSubmit}
>
  Hoàn thành
</Button>
```

**Accessibility:**
- Minimum touch target: 44x44px (WCAG 2.5.5)
- Color contrast ratio: 4.5:1 (WCAG 1.4.3)
- Focus visible với ring (WCAG 2.4.7)
- Disabled state rõ ràng

---

### 2. **Input** (`/components/ui/Input.tsx`)

Component input form với label, error handling và icons.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: React.ReactNode
- Tất cả props của `<input>` HTML

**Ví dụ:**
```tsx
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
  helperText="Nhập email hợp lệ"
  leftIcon={<EmailIcon />}
  required
/>
```

**Accessibility:**
- Label association với `htmlFor` và `id`
- Error announcement với `aria-invalid` và `aria-describedby`
- Helper text với unique ID
- Required indicator (*)

---

### 3. **Card** (`/components/ui/Card.tsx`)

Container component với shadow và border.

**Props:**
- `padding`: "none" | "sm" | "md" | "lg"
- `hover`: boolean (hiệu ứng hover)

**Ví dụ:**
```tsx
<Card padding="lg" hover>
  <h3>Tiêu đề</h3>
  <p>Nội dung card</p>
</Card>
```

---

### 4. **Modal** (`/components/ui/Modal.tsx`)

Component modal/dialog với focus trap và ESC to close.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: "sm" | "md" | "lg" | "xl"
- `showCloseButton`: boolean

**Ví dụ:**
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Xác nhận"
  size="md"
>
  <p>Bạn có chắc chắn muốn xóa?</p>
  <Button onClick={handleDelete}>Xóa</Button>
</Modal>
```

**Accessibility:**
- Focus trap (không tab ra ngoài modal)
- ESC to close
- Restore focus khi đóng
- `role="dialog"` và `aria-modal="true"`
- Prevent body scroll

---

### 5. **ProgressBar** (`/components/ui/ProgressBar.tsx`)

Thanh tiến độ với label và percentage.

**Props:**
- `value`: number (0-100)
- `max`: number (default: 100)
- `label`: string
- `showPercentage`: boolean
- `color`: "primary" | "success" | "warning" | "error"
- `size`: "sm" | "md" | "lg"

**Ví dụ:**
```tsx
<ProgressBar 
  value={75} 
  max={100}
  label="Tiến độ học tập"
  color="success"
  size="lg"
/>
```

**Accessibility:**
- `role="progressbar"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label` cho screen readers

---

### 6. **Badge** (`/components/ui/Badge.tsx`)

Component hiển thị trạng thái, nhãn.

**Props:**
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `size`: "sm" | "md" | "lg"

**Ví dụ:**
```tsx
<Badge variant="success" size="sm">Đã hoàn thành</Badge>
<Badge variant="warning">Đang chờ</Badge>
```

**Accessibility:**
- Không chỉ dựa vào màu sắc (có text kèm theo)

---

## 🎮 Gamification Components

### 7. **XPBar** (`/components/gamification/XPBar.tsx`)

Hiển thị thanh kinh nghiệm và level.

**Props:**
- `currentXP`: number
- `nextLevelXP`: number
- `level`: number

**Ví dụ:**
```tsx
<XPBar 
  currentXP={1250} 
  nextLevelXP={2000} 
  level={12} 
/>
```

---

### 8. **StreakBadge** (`/components/gamification/StreakBadge.tsx`)

Hiển thị chuỗi ngày liên tiếp với gradient động.

**Props:**
- `days`: number

**Ví dụ:**
```tsx
<StreakBadge days={7} />
```

**Features:**
- Màu gradient thay đổi theo milestone (7, 14, 30 ngày)
- Message động khuyến khích

---

## 📄 Pages Đã Thiết Kế

### 1. **Landing Page** (`/app/page.tsx`)
- Hero section với CTA buttons
- Features section (3 tính năng chính)
- Stats section (44 âm vị, AI, 100% miễn phí)
- CTA section cuối trang
- Decorative animated blobs

### 2. **Login Page** (`/app/(auth)/login/page.tsx`)
- Form đăng nhập với email/password
- Remember me checkbox
- Forgot password link
- Link đến trang register

### 3. **Register Page** (`/app/(auth)/register/page.tsx`)
- Form đăng ký với username, email, password, confirm password
- Validation errors
- Link đến trang login

### 4. **Dashboard** (`/app/dashboard/page.tsx`)
- User profile snippet
- Continue learning card
- Inline badges (streak, XP)
- Quick links sidebar
- Stats cards

### 5. **Practice Page** (`/app/practice/page.tsx`)
- Bảng IPA tương tác (IPAChart component)
- Click vào âm vị để luyện tập
- RecordButton tích hợp

### 6. **Learning Map** (`/app/learning_map/page.tsx`)
- Overall progress bar
- 5 topics (Nguyên âm đơn, đôi, Phụ âm...)
- Lock/unlock mechanism
- Progress per topic
- Phonemes preview

### 7. **Leaderboard** (`/app/leaderboard/page.tsx`)
- Tabs: Tuần / Tháng / Mọi thời đại
- Top 3 podium (gold, silver, bronze)
- Leaderboard list (rank 4+)
- Current user position highlight

### 8. **Badges Page** (`/app/badges/page.tsx`)
- Huy hiệu vĩnh viễn (8 loại)
- Huy hiệu tạm thời (theo kỳ)
- Earned/Not earned states
- Active/Inactive states

---

## 🎨 Design System

### Color Palette

```css
/* Primary - Blue */
--primary-600: #2563eb;

/* Success - Green */
--success-600: #16a34a;

/* Warning - Amber */
--warning-500: #f59e0b;

/* Error - Red */
--error-500: #ef4444;

/* Accent - Purple */
--accent-500: #a855f7;

/* Neutral - Gray */
--neutral-900: #111827;
```

### Typography

- **Headings**: Inter (font-heading)
- **Body**: Inter (font-body)
- **IPA Symbols**: Noto Sans (font-ipa)

### Spacing (8px grid)

- `space-1`: 4px
- `space-2`: 8px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px

### Border Radius

- `rounded-md`: 6px
- `rounded-lg`: 8px
- `rounded-xl`: 12px
- `rounded-2xl`: 16px

---

## ♿ Accessibility Checklist

Tất cả components đã tuân thủ:

- ✅ **WCAG 2.1 AA** color contrast (4.5:1)
- ✅ **Keyboard navigation** (Tab, Enter, Space, ESC)
- ✅ **Focus visible** (ring 2-4px)
- ✅ **Touch target** minimum 44x44px
- ✅ **ARIA attributes** (role, aria-label, aria-describedby)
- ✅ **Screen reader support** (sr-only, aria-live)
- ✅ **Error handling** (aria-invalid, role="alert")
- ✅ **Reduced motion** support (@media prefers-reduced-motion)

---

## 🚀 Cách Sử Dụng

### Import components:

```tsx
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import XPBar from "@/components/gamification/XPBar";
import StreakBadge from "@/components/gamification/StreakBadge";
```

### Sử dụng trong page:

```tsx
export default function MyPage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Tiêu đề</h1>
        <Input label="Email" type="email" />
        <Button variant="primary" fullWidth>
          Gửi
        </Button>
      </Card>
    </div>
  );
}
```

---

## 📝 Next Steps

**Cần làm tiếp:**

1. ✅ Xây dựng API backend (FastAPI)
2. ✅ Kết nối Frontend với API
3. ✅ Implement authentication (NextAuth.js)
4. ✅ Tích hợp Web Speech API thật
5. ✅ Viết unit tests
6. ✅ Lighthouse audit & optimization

---

**Tác giả:** AI Agent  
**Ngày cập nhật:** 01/06/2026  
**Tuân thủ:** HCI Principles, WCAG 2.1 AA, Project Context
