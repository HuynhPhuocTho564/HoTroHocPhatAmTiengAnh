# Kế Hoạch Cải Thiện Dashboard & Navigation UX (Ưu tiên 2)

**Mục tiêu:** Giảm cognitive load ở dashboard, thêm onboarding cho user mới, cải thiện navigation.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md) — Phần 1 (H6, H7, H10)

**Skills bắt buộc áp dụng:**
- `maintainable-code` — Single Responsibility cho mỗi component mới
- `nielsen-ux-heuristics` — H6 (Recognition), H7 (Flexibility), H10 (Help & Docs)
- `ui-color-harmony` — Widget tabs phải dùng color system hiện tại
- `web-usability-scales` — Đánh giá UEQ Perspicuity trước/sau thay đổi

---

## Task 2.1: Dashboard Sidebar — Gom Widgets Thành Tabbed Widget

**Vấn đề:** Sidebar hiện tại stack 5 widgets (DailyCheckIn + DailyQuests + WeeklyChallenge + SpinWheel + Badges) → scroll dài, cognitive overload.

**File thay đổi:**
- `frontend/src/app/dashboard/page.tsx` (server component)
- TẠO MỚI: `frontend/src/components/gamification/DashboardWidgetTabs.tsx` (client component)

### Bước 2.1.1: Tạo DashboardWidgetTabs component

**Design:** 3 tabs với icon, mỗi tab chứa nhóm widgets liên quan.

```
Tab 1: "📅 Hôm nay"      → DailyCheckIn + DailyQuestsWidget
Tab 2: "🏆 Thử thách"    → WeeklyChallengeCard  
Tab 3: "🎁 Phần thưởng"  → SpinWheel + Recent Badges
```

**Code structure:**
```tsx
"use client";
import { useState } from "react";

const TABS = [
  { id: "today", label: "Hôm nay", icon: "📅" },
  { id: "challenge", label: "Thử thách", icon: "🏆" },
  { id: "rewards", label: "Phần thưởng", icon: "🎁" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Tab button: min-h-[44px], aria-selected, focus-visible ring
// Tab panel: aria-labelledby, smooth transition
// Active tab: bg-primary-600 text-white
// Inactive tab: bg-white text-neutral-700 border
```

### Bước 2.1.2: Refactor Dashboard sidebar

**File:** `frontend/src/app/dashboard/page.tsx`

**TRƯỚC (lines 260-304):**
```tsx
<DailyCheckIn ... />
<DailyQuestsWidget />
<WeeklyChallengeCard />
<SpinWheel />
<Card>Huy hiệu gần đây...</Card>
```

**SAU:**
```tsx
<DashboardWidgetTabs
  checkInProps={{ currentStreak, longestStreak, totalCheckIns, lastCheckIn }}
  recentBadges={user.userBadges}
/>
```

### Bước 2.1.3: Accessibility cho tabs

```tsx
// Tab list
<div role="tablist" aria-label="Widget dashboard">
  <button role="tab" aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`}>
  
// Tab panel
<div role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id}>
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: Hick's Law — giảm từ 5 visible widgets → 3 tabs với 1-2 widgets mỗi tab
- `maintainable-code`: Single Responsibility — DashboardWidgetTabs chỉ quản lý tab state
- `ui-color-harmony`: Tab active dùng `bg-primary-600`, inactive `bg-white` (đã có trong system)

**Verification:**
- [ ] Sidebar ngắn hơn, không cần scroll
- [ ] Keyboard navigation: Tab/Arrow keys chuyển tab
- [ ] Screen reader đọc đúng tab + panel

---

## Task 2.2: "Gợi Ý Hôm Nay" — Smart Recommendation Card

**Vấn đề:** User vào dashboard không biết nên học bài nào tiếp theo.

**File thay đổi:**
- `frontend/src/app/dashboard/page.tsx` (server component — thêm query)
- TẠO MỚI: `frontend/src/components/dashboard/SuggestedExercise.tsx`

### Bước 2.2.1: Query bài tập gợi ý (server-side)

Thêm vào Promise.all trong dashboard page:
```tsx
// Tìm bài user chưa hoàn thành, ưu tiên bài trong topic đang học
const suggestedExercise = await prisma.exercise.findFirst({
  where: {
    status: "ACTIVE",
    exerciseAttempts: {
      none: { userId: session.user.id, score: { gte: 70 } }
    }
  },
  include: { learningMap: { include: { topic: true } } },
  orderBy: { id: "asc" },
});
```

### Bước 2.2.2: Tạo SuggestedExercise component

```tsx
type SuggestedExerciseProps = {
  exercise: {
    id: string;
    name: string;
    description: string | null;
    learningMap: { name: string; topic: { name: string } };
  } | null;
};

export default function SuggestedExercise({ exercise }: SuggestedExerciseProps) {
  if (!exercise) return null; // User đã hoàn thành tất cả
  
  return (
    <Card className="border-primary-300 bg-gradient-to-r from-primary-50 to-white">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
        📌 Gợi ý hôm nay
      </p>
      <h3 className="text-xl font-bold text-neutral-900 mb-1">{exercise.name}</h3>
      <p className="text-sm text-neutral-600 mb-4">
        {exercise.learningMap.topic.name} → {exercise.learningMap.name}
      </p>
      <Link href={`/exercises/${exercise.id}`} className={primaryLinkClass()}>
        Bắt đầu luyện tập →
      </Link>
    </Card>
  );
}
```

### Bước 2.2.3: Vị trí placement

Đặt card "Gợi ý hôm nay" **NGAY DƯỚI** card "Tiếp tục học" hiện tại.

```
[Hero heading + Stats]
[XP Progress]
[Tiếp tục học]        ← card hiện tại (bài gần nhất)
[Gợi ý hôm nay]       ← card MỚI (bài chưa hoàn thành)
[Bài làm gần đây]
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H7 (Flexibility & Efficiency) — user có shortcut đến bài tiếp theo
- `maintainable-code`: Component nhận props typed, null guard cho edge case

**Verification:**
- [ ] Card hiện bài tập chưa hoàn thành đầu tiên
- [ ] Nếu đã hoàn thành tất cả → card ẩn
- [ ] Click "Bắt đầu luyện tập" → navigate đúng

---

## Task 2.3: Onboarding Tour cho User Mới

**Vấn đề:** User mới đăng ký vào dashboard, không biết bắt đầu từ đâu. (H10 — Help & Documentation: FAIL)

**File thay đổi:**
- TẠO MỚI: `frontend/src/components/onboarding/OnboardingTour.tsx`
- TẠO MỚI: `frontend/src/lib/onboarding.ts` (constants + storage helpers)
- `frontend/src/app/dashboard/page.tsx` (conditional render)

### Bước 2.3.1: Onboarding storage helper

```tsx
// lib/onboarding.ts
const ONBOARDING_KEY = "phatamen_onboarding_complete";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function markOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export const TOUR_STEPS = [
  {
    id: "welcome",
    title: "Chào mừng bạn! 👋",
    description: "Hãy cùng khám phá các tính năng chính trong 30 giây.",
    target: null, // Center screen overlay
  },
  {
    id: "stats",
    title: "Theo dõi tiến độ",
    description: "Chuỗi ngày học, cấp độ và số bài đã đạt — tất cả ở đây.",
    target: "[data-tour='stats']",
  },
  {
    id: "continue-learning",
    title: "Tiếp tục học",
    description: "Nhấn vào đây để quay lại bài tập gần nhất của bạn.",
    target: "[data-tour='continue']",
  },
  {
    id: "learning-map-link",
    title: "Lộ trình học tập",
    description: "Chọn chủ đề → nhóm âm → dạng bài để luyện phát âm IPA.",
    target: "[data-tour='learning-map']",
  },
  {
    id: "sidebar-widgets",
    title: "Gamification",
    description: "Điểm danh, thử thách tuần, vòng quay may mắn — học vui hơn!",
    target: "[data-tour='widgets']",
  },
] as const;
```

### Bước 2.3.2: OnboardingTour component

**Design pattern:** Full-screen overlay với spotlight cutout trên target element.

```tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { TOUR_STEPS, markOnboardingComplete } from "@/lib/onboarding";

type OnboardingTourProps = {
  onComplete: () => void;
};

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  
  // Esc to skip
  // Focus trap
  // Auto-scroll to target element
  // Spotlight overlay (fixed bg-black/60 with cutout around target)
  
  const handleFinish = useCallback(() => {
    markOnboardingComplete();
    onComplete();
  }, [onComplete]);

  // Render:
  // - Backdrop with cutout around target
  // - Tooltip card near target (above/below)
  // - Step indicator: "2/5"
  // - Buttons: "Bỏ qua" (ghost) | "Tiếp theo" (primary) | "Bắt đầu học!" (last step)
}
```

### Bước 2.3.3: Thêm data-tour attributes

**File thay đổi:** `frontend/src/app/dashboard/page.tsx`

```tsx
// Stats section
<dl data-tour="stats" className="mb-10 grid ...">

// Continue learning card
<Card data-tour="continue" className="mb-8">

// Learning map link in nav
<Link data-tour="learning-map" href="/learning_map" ...>

// Sidebar widgets container
<div data-tour="widgets" ...>
```

### Bước 2.3.4: Conditional render trong dashboard

```tsx
// Dashboard page (server component renders flag)
// Client component checks localStorage and shows tour
<OnboardingGate>
  {/* children = dashboard content */}
</OnboardingGate>
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H10 (Help & Documentation) — onboarding phải contextual, không separate page
- `maintainable-code`: TOUR_STEPS là constants, không hardcode trong component
- `ui-color-harmony`: Tooltip dùng `bg-white` với `border-primary-300`, spotlight `bg-black/60`

**Verification:**
- [ ] Tour hiện lần đầu vào dashboard
- [ ] Refresh lại không hiện nữa (localStorage)
- [ ] "Bỏ qua" skip toàn bộ tour
- [ ] Spotlight highlight đúng target element
- [ ] Keyboard: Esc để skip, Enter để next

---

## Task 2.4: Navbar Icons

**Vấn đề:** Navbar chỉ có text, thiếu visual scanability.

**File thay đổi:**
- `frontend/src/components/layout/Navbar.tsx` (hoặc tương đương)

### Bước 2.4.1: Thêm emoji icons trước nav items

```tsx
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/learning_map", label: "Lộ trình", icon: "🗺️" },
  { href: "/badges", label: "Huy hiệu", icon: "🏅" },
  { href: "/leaderboard", label: "Xếp hạng", icon: "🏆" },
] as const;

// Render: <span aria-hidden="true">{item.icon}</span> {item.label}
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H6 (Recognition rather than Recall) — icon giúp scan nhanh hơn text-only

**Verification:**
- [ ] Mỗi nav item có icon + text
- [ ] `aria-hidden="true"` trên icon (screen reader đọc text)
- [ ] Mobile hamburger cũng có icons

---

## Task 2.5: Confirm Dialog Khi Thoát Bài Đang Làm

**Vấn đề:** Click "← Lộ trình" trong bài tập thoát ngay, mất kết quả đang làm.

**File thay đổi:**
- `frontend/src/app/exercises/[id]/ExerciseEngineClient.tsx`

### Bước 2.5.1: Thêm beforeunload handler

```tsx
// Trong useExerciseEngine hook hoặc ExerciseEngineClient
useEffect(() => {
  if (currentIndex > 0 && !isFinished) {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }
}, [currentIndex, isFinished]);
```

### Bước 2.5.2: Thêm confirm dialog cho back button

```tsx
const handleBack = useCallback(() => {
  if (currentIndex > 0 && !isFinished) {
    const confirmed = window.confirm("Bạn có chắc muốn thoát? Kết quả hiện tại sẽ không được lưu.");
    if (!confirmed) return;
  }
  router.push("/learning_map");
}, [currentIndex, isFinished, router]);
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H3 (User Control & Freedom) + H5 (Error Prevention) — confirm trước destructive action

**Verification:**
- [ ] Click "← Lộ trình" khi đang làm bài → confirm dialog
- [ ] Click "Cancel" → ở lại bài
- [ ] Click "OK" → về lộ trình
- [ ] Browser back button khi đang làm → beforeunload warning
- [ ] Khi chưa làm câu nào → không confirm

---

## Tổng Kết Priority 2

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 2.1 Dashboard tabbed widgets | MEDIUM | HIGH | Không |
| 2.2 "Gợi ý hôm nay" card | LOW | HIGH | Không |
| 2.3 Onboarding tour | HIGH | HIGH | 2.1 (cần tab xong để tour target đúng) |
| 2.4 Navbar icons | LOW | MEDIUM | Không |
| 2.5 Confirm exit exercise | LOW | HIGH | Không |

**Tổng thời gian ước tính:** 6-8 giờ

**Thứ tự đề xuất:** 2.4 → 2.5 → 2.2 → 2.1 → 2.3
