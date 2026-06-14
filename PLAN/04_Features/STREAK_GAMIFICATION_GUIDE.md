# 🔥 Hướng Dẫn Tích Hợp Streak Gamification

## 📋 Tổng Quan

Hệ thống **Streak Gamification** đã được thiết kế lại theo phong cách **tự động** và **đậm chất game** hơn:

### ✨ Điểm Khác Biệt So Với Phiên Bản Cũ

| Tính năng | Phiên bản cũ | Phiên bản mới (Gamification) |
|-----------|--------------|------------------------------|
| **Cách điểm danh** | Bấm nút "Điểm danh" | Tự động khi hoàn thành bài tập |
| **Popup quà** | Không có | Popup 7 rương quà khi mở app |
| **Streak logic** | Manual check-in | Tự động tăng khi làm bài |
| **Phần thưởng** | Cố định | Tăng dần theo ngày (10-50 xu) |
| **Milestone** | Hiển thị list | Tự động cấp huy hiệu |
| **UX** | Click nhiều | Passive, tự động |

---

## 🏗️ Kiến Trúc Mới

### 1. Database Schema (Prisma)

**File:** `frontend/prisma/schema.prisma`

**Các trường mới trong model User:**

```prisma
model User {
  // ... các trường cũ
  
  // Gamification: Streak & Daily Check-in
  lastLoginDate    DateTime? // Thời điểm cuối cùng user mở app
  streakCount      Int      @default(0) // Chuỗi ngày đăng nhập liên tiếp
  longestStreak    Int      @default(0) // Kỷ lục chuỗi ngày dài nhất
  totalCheckIns    Int      @default(0) // Tổng số ngày đã điểm danh
  lastCheckInDate  DateTime? // Ngày điểm danh cuối cùng
}
```

**Migration:**
```bash
cd frontend
npx prisma migrate dev --name add_streak_fields
npx prisma generate
```

### 2. API Endpoints

**File:** `frontend/src/app/api/checkin/route.ts`

#### POST `/api/checkin`
**Mục đích:** Xử lý điểm danh tự động khi user hoàn thành bài tập

**Request:**
```json
{
  "userId": "uuid-string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "currentStreak": 6,
  "longestStreak": 15,
  "totalCheckIns": 43,
  "reward": {
    "type": "coins",
    "amount": 40
  },
  "milestone": {
    "achieved": true,
    "badgeName": "Tuần Hoàn Hảo",
    "description": "Điểm danh 7 ngày liên tiếp",
    "days": 7
  },
  "canCheckIn": false
}
```

**Logic:**
1. Kiểm tra `lastCheckInDate`
2. Nếu là **ngày hôm qua** → Tăng `streakCount` +1
3. Nếu là **hôm nay** → Return "Already checked in"
4. Nếu cách **>48h** → Reset `streakCount` về 1
5. Cập nhật `lastCheckInDate` = now
6. Kiểm tra milestone và cấp huy hiệu

#### GET `/api/checkin?userId=xxx`
**Mục đích:** Lấy thông tin streak hiện tại

**Response:**
```json
{
  "currentStreak": 5,
  "longestStreak": 15,
  "totalCheckIns": 42,
  "lastCheckInDate": "2026-06-01T10:30:00Z",
  "canCheckIn": true
}
```

### 3. Components

#### `DailyCheckIn.tsx`
**Vị trí:** `frontend/src/components/gamification/DailyCheckIn.tsx`

**Chức năng:**
- Hiển thị streak hiện tại và kỷ lục
- Lịch 7 ngày mini
- Nút "Nhận quà" (chỉ hiện khi có thể claim)
- Tự động gọi API khi mount để check status

**Props:**
```typescript
type DailyCheckInProps = {
  userId?: string;
  currentStreak?: number;
  longestStreak?: number;
  lastCheckIn?: string;
  onCheckIn?: () => void;
};
```

#### `DailyRewardsPopup.tsx`
**Vị trí:** `frontend/src/components/gamification/DailyRewardsPopup.tsx`

**Chức năng:**
- Popup 7 rương quà (1 tuần)
- Hiển thị tự động khi user mở app lần đầu trong ngày
- Animation khi claim reward
- Modal phần thưởng sau khi claim

**Props:**
```typescript
type DailyRewardsPopupProps = {
  currentStreak: number;
  onClaim: (day: number) => void;
  onClose: () => void;
};
```

---

## 🎮 Luồng Hoạt Động (User Flow)

### Flow 1: User Mở App Lần Đầu Trong Ngày

```
1. User mở app/website
2. Component DailyCheckIn mount
3. Gọi GET /api/checkin?userId=xxx
4. Nếu canCheckIn = true:
   → Hiển thị nút "🎁 Nhận quà" (animate pulse)
   → Tự động mở DailyRewardsPopup
5. User thấy popup 7 rương quà
6. Click "Nhận quà ngày X"
7. Gọi POST /api/checkin
8. Hiển thị modal phần thưởng (animation 🎉)
9. Cập nhật streak +1
10. Đóng popup
```

### Flow 2: User Hoàn Thành Bài Tập

```
1. User làm xong bài tập
2. Frontend gọi API lưu kết quả bài tập
3. Sau khi lưu thành công, gọi POST /api/checkin
4. Backend kiểm tra:
   - Nếu chưa check-in hôm nay → Tăng streak
   - Nếu đã check-in → Không làm gì
5. Return reward và milestone (nếu có)
6. Frontend hiển thị toast notification:
   "🔥 Streak +1! Bạn đã duy trì 6 ngày liên tiếp"
```

### Flow 3: User Bỏ Lỡ 1 Ngày

```
1. User không mở app/làm bài trong 48h
2. Lần mở app tiếp theo:
3. Gọi POST /api/checkin
4. Backend phát hiện lastCheckInDate cách >48h
5. Reset streakCount về 1
6. Return message: "Streak đã reset. Bắt đầu lại từ ngày 1!"
7. Frontend hiển thị popup động viên:
   "Đừng lo! Hãy bắt đầu lại và phá kỷ lục cũ 🚀"
```

---

## 🎁 Hệ Thống Phần Thưởng

### Weekly Rewards (Chu kỳ 7 ngày)

| Ngày | Phần thưởng | Icon | Mô tả |
|------|-------------|------|-------|
| 1 | 10 xu | 🪙 | Khởi đầu tốt |
| 2 | 15 xu | 🪙 | Tiếp tục phát huy |
| 3 | 20 xu | 🪙 | Đang duy trì tốt |
| 4 | 25 xu | 🪙 | Gần đến mốc tuần |
| 5 | 30 xu | 🪙 | Chỉ còn 2 ngày |
| 6 | 40 xu | 🪙 | Sắp hoàn thành tuần |
| 7 | 50 xu + 🏆 | 🎁 | Huy hiệu "Tuần Hoàn Hảo" |

**Lưu ý:** Sau ngày 7, chu kỳ lặp lại từ ngày 1 (nhưng streak vẫn tiếp tục tăng)

### Milestones (Huy hiệu vĩnh viễn)

| Streak | Tên Huy Hiệu | Phần Thưởng | Icon |
|--------|--------------|-------------|------|
| 3 ngày | Khởi Đầu Tốt | Huy hiệu | 🌱 |
| 7 ngày | Tuần Hoàn Hảo | 50 xu + Huy hiệu | ⭐ |
| 14 ngày | Hai Tuần Kiên Trì | 100 xu + Huy hiệu | 🎖️ |
| 30 ngày | Tháng Vàng | 300 xu + Huy hiệu Vàng | 👑 |
| 60 ngày | Hai Tháng Bền Bỉ | 500 xu + Huy hiệu Kim Cương | 💎 |
| 100 ngày | Trăm Ngày Huyền Thoại | 1000 xu + Huy hiệu Huyền Thoại | 🏆 |

---

## 🔌 Tích Hợp Vào Dự Án

### Bước 1: Cập Nhật Database

```bash
cd frontend
npx prisma migrate dev --name add_streak_fields
npx prisma generate
```

### Bước 2: Thêm DailyCheckIn vào Dashboard

**File:** `frontend/src/app/dashboard/page.tsx`

```tsx
import DailyCheckIn from '@/components/gamification/DailyCheckIn';

export default function DashboardPage() {
  // Mock user ID - thay bằng session thật
  const userId = "current-user-id";
  
  return (
    <div>
      {/* ... existing code ... */}
      
      {/* Sidebar */}
      <aside>
        <DailyCheckIn userId={userId} />
      </aside>
    </div>
  );
}
```

### Bước 3: Gọi API Sau Khi Hoàn Thành Bài Tập

**File:** `frontend/src/app/exercises/[id]/page.tsx` (hoặc nơi submit bài tập)

```tsx
const handleSubmitExercise = async (answers: any) => {
  try {
    // 1. Lưu kết quả bài tập
    const result = await fetch('/api/exercises/submit', {
      method: 'POST',
      body: JSON.stringify({ userId, exerciseId, answers }),
    });

    // 2. Tự động check-in (tăng streak)
    const checkinResult = await fetch('/api/checkin', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    const checkinData = await checkinResult.json();

    // 3. Hiển thị notification nếu có reward
    if (checkinData.success && checkinData.reward) {
      showToast(`🔥 Streak +1! Nhận ${checkinData.reward.amount} xu`);
    }

    // 4. Hiển thị milestone nếu đạt được
    if (checkinData.milestone) {
      showMilestoneModal(checkinData.milestone);
    }

  } catch (error) {
    console.error('Submit error:', error);
  }
};
```

### Bước 4: Hiển Thị Popup Khi Mở App

**File:** `frontend/src/app/layout.tsx` hoặc `dashboard/page.tsx`

```tsx
"use client";

import { useEffect, useState } from 'react';
import DailyRewardsPopup from '@/components/gamification/DailyRewardsPopup';

export default function RootLayout({ children }) {
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    const userId = getCurrentUserId(); // Lấy từ session
    const response = await fetch(`/api/checkin?userId=${userId}`);
    const data = await response.json();

    if (data.canCheckIn) {
      setStreak(data.currentStreak);
      setShowDailyPopup(true);
    }
  };

  const handleClaimReward = async (day: number) => {
    const userId = getCurrentUserId();
    await fetch('/api/checkin', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    setShowDailyPopup(false);
  };

  return (
    <html>
      <body>
        {children}
        
        {showDailyPopup && (
          <DailyRewardsPopup
            currentStreak={streak}
            onClaim={handleClaimReward}
            onClose={() => setShowDailyPopup(false)}
          />
        )}
      </body>
    </html>
  );
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
// tests/api/checkin.test.ts

describe('POST /api/checkin', () => {
  it('should increase streak when checking in next day', async () => {
    // Setup: User checked in yesterday
    const user = await createTestUser({ 
      lastCheckInDate: yesterday,
      streakCount: 5 
    });

    // Act
    const response = await POST({ userId: user.id });

    // Assert
    expect(response.currentStreak).toBe(6);
  });

  it('should reset streak when missing >1 day', async () => {
    // Setup: User checked in 3 days ago
    const user = await createTestUser({ 
      lastCheckInDate: threeDaysAgo,
      streakCount: 10 
    });

    // Act
    const response = await POST({ userId: user.id });

    // Assert
    expect(response.currentStreak).toBe(1);
  });

  it('should not allow double check-in same day', async () => {
    // Setup: User already checked in today
    const user = await createTestUser({ 
      lastCheckInDate: today,
      streakCount: 5 
    });

    // Act
    const response = await POST({ userId: user.id });

    // Assert
    expect(response.success).toBe(false);
    expect(response.message).toBe('Already checked in today');
  });
});
```

### E2E Tests

```typescript
// tests/e2e/streak.spec.ts

test('Daily rewards popup appears on first login', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Popup should appear automatically
  await expect(page.locator('text=Phần Thưởng Hàng Ngày')).toBeVisible();
  
  // Click claim button
  await page.click('button:has-text("Nhận quà ngày")');
  
  // Reward modal should appear
  await expect(page.locator('text=Chúc mừng!')).toBeVisible();
  await expect(page.locator('text=+10 xu')).toBeVisible();
});

test('Streak increases after completing exercise', async ({ page }) => {
  await page.goto('/exercises/1');
  
  // Complete exercise
  await page.fill('input[name="answer"]', 'correct answer');
  await page.click('button:has-text("Nộp bài")');
  
  // Check streak notification
  await expect(page.locator('text=Streak +1')).toBeVisible();
});
```

---

## 📊 Analytics & Tracking

### Events to Track

```typescript
// Track khi user claim reward
analytics.track('daily_reward_claimed', {
  userId,
  day: 3,
  reward: { type: 'coins', amount: 20 },
  currentStreak: 3,
});

// Track khi đạt milestone
analytics.track('streak_milestone_achieved', {
  userId,
  milestone: 'Tuần Hoàn Hảo',
  streakDays: 7,
});

// Track khi streak bị reset
analytics.track('streak_reset', {
  userId,
  previousStreak: 10,
  daysMissed: 2,
});
```

### Metrics to Monitor

- **Daily Check-in Rate**: % users check-in mỗi ngày
- **Average Streak Length**: Trung bình chuỗi ngày
- **Streak Retention (7d)**: % users duy trì streak >7 ngày
- **Streak Retention (30d)**: % users duy trì streak >30 ngày
- **Milestone Completion Rate**: % users đạt từng milestone

---

## 🚀 Deployment Checklist

### Frontend
- [x] Components hoàn thành
- [x] API routes hoàn thành
- [x] Prisma schema updated
- [ ] Environment variables setup
- [ ] Error handling & loading states
- [ ] Analytics tracking
- [ ] Toast notifications

### Backend
- [ ] Database migration
- [ ] Seed data (badges)
- [ ] API rate limiting
- [ ] Timezone handling
- [ ] Cron job (optional: reset expired streaks)

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing

---

## 💡 Best Practices

### 1. Timezone Handling
```typescript
// Luôn dùng UTC để so sánh ngày
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const lastCheckIn = new Date(user.lastCheckInDate);
lastCheckIn.setUTCHours(0, 0, 0, 0);

const diffDays = Math.floor(
  (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
);
```

### 2. Error Handling
```typescript
try {
  const response = await fetch('/api/checkin', { ... });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Check-in failed');
  }
  
  // Success handling
} catch (error) {
  console.error('Check-in error:', error);
  showToast('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
}
```

### 3. Optimistic UI Updates
```typescript
// Cập nhật UI ngay lập tức, rollback nếu API fail
const handleClaim = async () => {
  const optimisticStreak = streak + 1;
  setStreak(optimisticStreak); // Update UI immediately
  
  try {
    const response = await fetch('/api/checkin', { ... });
    const data = await response.json();
    setStreak(data.currentStreak); // Update with real data
  } catch (error) {
    setStreak(streak); // Rollback on error
    showError('Claim failed');
  }
};
```

---

## 🎓 Tài Liệu Tham Khảo

- [Duolingo Streak System](https://blog.duolingo.com/streaks/)
- [Habitica Gamification](https://habitica.fandom.com/wiki/Streaks)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Ngày tạo:** 01/06/2026  
**Phiên bản:** 2.0 (Gamification Edition)  
**Trạng thái:** ✅ Hoàn thành, sẵn sàng tích hợp
