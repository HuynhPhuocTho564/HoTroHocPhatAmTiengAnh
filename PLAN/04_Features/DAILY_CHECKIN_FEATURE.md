# 🔥 Tính Năng Daily Check-in & Streak System

## 📋 Tổng Quan

Tính năng **Daily Check-in** (Điểm danh hàng ngày) giúp tăng engagement và tạo thói quen học tập đều đặn cho người dùng thông qua:
- ✅ Điểm danh hàng ngày nhận phần thưởng
- 🔥 Hệ thống Streak (chuỗi ngày liên tiếp)
- 🎁 Phần thưởng tăng dần theo số ngày
- 🏆 Cột mốc thành tích (Milestones)

---

## 🎯 Mục Tiêu

### Gamification Goals:
1. **Retention**: Khuyến khích user quay lại mỗi ngày
2. **Habit Formation**: Tạo thói quen học 21-30 ngày
3. **Motivation**: Phần thưởng tăng dần tạo động lực
4. **FOMO**: Sợ mất streak → Quay lại app

### Business Metrics:
- **DAU (Daily Active Users)**: Tăng số người dùng hàng ngày
- **Retention Rate**: Tăng tỷ lệ giữ chân người dùng
- **Session Frequency**: Tăng số lần mở app/ngày

---

## 🏗️ Kiến Trúc

### 1. Components

#### `DailyCheckIn.tsx`
**Vị trí:** `frontend/src/components/gamification/DailyCheckIn.tsx`

**Props:**
```typescript
type DailyCheckInProps = {
  currentStreak?: number;      // Chuỗi ngày hiện tại
  longestStreak?: number;       // Kỷ lục cá nhân
  lastCheckIn?: string;         // ISO date string
  onCheckIn?: () => void;       // Callback khi check-in
};
```

**Features:**
- ✅ Hiển thị streak hiện tại và kỷ lục
- ✅ Lịch 7 ngày với trạng thái check-in
- ✅ Modal check-in với animation
- ✅ Modal phần thưởng khi check-in thành công
- ✅ Disable button nếu đã check-in hôm nay
- ✅ Keyboard accessible (WCAG 2.1 AA)

**States:**
- `showModal`: Hiển thị modal check-in
- `showRewardModal`: Hiển thị modal phần thưởng
- `todayReward`: Phần thưởng nhận được hôm nay

### 2. Pages

#### `/checkin` - Trang Điểm Danh
**Vị trí:** `frontend/src/app/checkin/page.tsx`

**Sections:**
1. **Header**: Tiêu đề và mô tả
2. **Daily Check-in Card**: Component chính
3. **Stats Grid**: 3 cards thống kê
   - Chuỗi hiện tại 🔥
   - Kỷ lục cá nhân 🏆
   - Tổng số ngày 📅
4. **Milestones**: Danh sách cột mốc thành tích
5. **Tips Card**: Mẹo duy trì streak

#### Dashboard Integration
**Vị trí:** `frontend/src/app/dashboard/page.tsx`

- Widget `DailyCheckIn` hiển thị ở sidebar
- Quick link "Điểm danh hàng ngày" trong menu

---

## 🎁 Hệ Thống Phần Thưởng

### Weekly Rewards (Lặp lại mỗi tuần)

| Ngày | Phần thưởng | Icon |
|------|-------------|------|
| 1 | 10 xu | 🪙 |
| 2 | 15 xu | 🪙 |
| 3 | 20 xu | 🪙 |
| 4 | 25 xu | 🪙 |
| 5 | 30 xu | 🪙 |
| 6 | 40 xu | 🪙 |
| 7 | Huy hiệu "Tuần Hoàn Hảo" | 🏆 |

### Milestones (Cột mốc đặc biệt)

| Cột mốc | Tên | Phần thưởng | Icon |
|---------|-----|-------------|------|
| 3 ngày | Khởi đầu tốt | Huy hiệu Người mới | 🌱 |
| 7 ngày | Tuần hoàn hảo | 50 xu + Huy hiệu | ⭐ |
| 14 ngày | Hai tuần kiên trì | 100 xu + Huy hiệu | 🎖️ |
| 30 ngày | Tháng vàng | 300 xu + Huy hiệu Vàng | 👑 |
| 60 ngày | Hai tháng bền bỉ | 500 xu + Huy hiệu Kim Cương | 💎 |
| 100 ngày | Trăm ngày huyền thoại | 1000 xu + Huy hiệu Huyền Thoại | 🏆 |

---

## 🔄 User Flow

### Flow 1: Check-in Thành Công
```
1. User vào Dashboard/Check-in page
2. Nhấn nút "🎁 Điểm danh"
3. Modal hiển thị lịch 7 ngày + streak info
4. Nhấn "🎁 Điểm danh ngay"
5. Modal phần thưởng hiển thị (animation 🎉)
6. Hiển thị phần thưởng nhận được
7. Cập nhật streak +1
8. Đóng modal → Button đổi thành "✅ Đã điểm danh"
```

### Flow 2: Đã Check-in Hôm Nay
```
1. User vào Dashboard/Check-in page
2. Button hiển thị "✅ Đã điểm danh" (disabled)
3. Không thể click
4. Message: "Quay lại vào ngày mai để tiếp tục chuỗi ngày! 🌟"
```

### Flow 3: Mất Streak
```
1. User không check-in 1 ngày
2. Streak reset về 0
3. Longest streak vẫn giữ nguyên
4. Bắt đầu lại từ ngày 1
```

---

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: Gradient primary-50 to accent-50
- **Success**: Green cho đã check-in
- **Neutral**: Gray cho chưa check-in
- **Warning**: Yellow cho phần thưởng

### Animations
- ✅ Pulse animation cho ngày hiện tại
- ✅ Bounce animation cho icon 🎉
- ✅ Smooth transition cho progress bar
- ✅ Fade in/out cho modals

### Accessibility (WCAG 2.1 AA)
- ✅ Touch target 44x44px
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ ARIA labels cho buttons
- ✅ Focus management trong modals
- ✅ Color contrast 4.5:1
- ✅ Screen reader friendly

---

## 🔌 Backend Integration (TODO)

### API Endpoints

#### 1. GET `/api/checkin/status`
**Response:**
```json
{
  "currentStreak": 5,
  "longestStreak": 15,
  "lastCheckIn": "2026-05-31T10:30:00Z",
  "totalCheckIns": 42,
  "canCheckInToday": false
}
```

#### 2. POST `/api/checkin`
**Request:**
```json
{
  "timestamp": "2026-06-01T09:15:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "newStreak": 6,
  "reward": {
    "type": "coins",
    "amount": 40
  },
  "milestone": null
}
```

#### 3. GET `/api/checkin/milestones`
**Response:**
```json
{
  "milestones": [
    {
      "days": 7,
      "title": "Tuần hoàn hảo",
      "achieved": true,
      "achievedDate": "2026-05-25"
    },
    {
      "days": 14,
      "title": "Hai tuần kiên trì",
      "achieved": false,
      "progress": 6,
      "remaining": 8
    }
  ]
}
```

### Database Schema (Prisma)

```prisma
model CheckIn {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime @default(now())
  reward    Json     // { type: "coins", amount: 10 }
  createdAt DateTime @default(now())

  @@unique([userId, date])
  @@index([userId])
}

model UserStreak {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastCheckIn   DateTime?
  totalCheckIns Int      @default(0)
  updatedAt     DateTime @updatedAt
}
```

---

## 📊 Analytics & Tracking

### Events to Track
1. **checkin_opened**: User mở modal check-in
2. **checkin_completed**: User hoàn thành check-in
3. **checkin_streak_milestone**: Đạt cột mốc streak
4. **checkin_streak_lost**: Mất streak
5. **checkin_page_viewed**: Xem trang /checkin

### Metrics to Monitor
- **Daily Check-in Rate**: % users check-in mỗi ngày
- **Average Streak Length**: Trung bình chuỗi ngày
- **Streak Retention**: % users duy trì streak >7 ngày
- **Milestone Completion**: % users đạt từng cột mốc

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] `hasCheckedInToday()` logic
- [ ] Reward calculation theo ngày
- [ ] Streak increment/reset logic
- [ ] Modal open/close states

### Integration Tests
- [ ] API call khi check-in
- [ ] Update UI sau khi check-in
- [ ] Error handling khi API fail
- [ ] Offline behavior

### E2E Tests
- [ ] Complete check-in flow
- [ ] Check-in khi đã check-in hôm nay
- [ ] Milestone achievement flow
- [ ] Keyboard navigation

### Accessibility Tests
- [ ] Screen reader compatibility
- [ ] Keyboard-only navigation
- [ ] Focus trap trong modal
- [ ] Color contrast check

---

## 🚀 Deployment Checklist

### Frontend
- [x] Component `DailyCheckIn.tsx` hoàn thành
- [x] Page `/checkin` hoàn thành
- [x] Dashboard integration hoàn thành
- [x] Navbar link thêm "🔥 Điểm danh"
- [ ] Connect với Backend API
- [ ] Error handling & loading states
- [ ] Analytics tracking

### Backend
- [ ] API endpoints `/api/checkin/*`
- [ ] Database schema migration
- [ ] Cron job reset streak (nếu cần)
- [ ] Rate limiting (1 check-in/day)
- [ ] Timezone handling

### DevOps
- [ ] Environment variables
- [ ] Database backup
- [ ] Monitoring & alerts
- [ ] Performance testing

---

## 💡 Future Enhancements

### Phase 2
- [ ] **Streak Freeze**: Mua "đóng băng" để không mất streak
- [ ] **Social Sharing**: Chia sẻ streak lên mạng xã hội
- [ ] **Leaderboard**: Top users có streak dài nhất
- [ ] **Push Notifications**: Nhắc nhở check-in

### Phase 3
- [ ] **Streak Challenges**: Thử thách giữa bạn bè
- [ ] **Custom Rewards**: User chọn phần thưởng
- [ ] **Streak Recovery**: Khôi phục streak bằng xu
- [ ] **Seasonal Events**: Phần thưởng đặc biệt theo mùa

---

## 📚 Tài Liệu Tham Khảo

### Gamification Best Practices
- Duolingo Streak System
- Habitica Daily Check-in
- Streaks App (iOS)

### Design Inspiration
- Material Design - Rewards
- Apple Health - Streaks
- GitHub Contribution Graph

### Technical References
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Modal Accessibility](https://reactjs.org/docs/accessibility.html)
- [Prisma Schema Best Practices](https://www.prisma.io/docs/concepts/components/prisma-schema)

---

## 👥 Team & Ownership

**Feature Owner:** Product Team  
**Frontend:** React/Next.js Team  
**Backend:** FastAPI Team  
**Design:** UI/UX Team  
**QA:** Testing Team

---

**Ngày tạo:** 01/06/2026  
**Phiên bản:** 1.0  
**Trạng thái:** ✅ Frontend hoàn thành, ⏳ Backend chưa triển khai
