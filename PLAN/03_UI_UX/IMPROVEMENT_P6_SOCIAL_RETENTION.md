# Kế Hoạch Social Features & Long-term Retention (Ưu tiên 6)

**Mục tiêu:** Thêm social connection, loss aversion hooks, và content freshness signals để giữ chân người dùng lâu dài.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md) — Phần 5 (Relatedness), Phần 8.5 (Daily Engagement Loop)

**Skills bắt buộc áp dụng:**
- `maintainable-code` — API routes type-safe, hooks reusable
- `nielsen-ux-heuristics` — H1 (Visibility), H6 (Recognition), H10 (Help)
- `web-usability-scales` — WAMMI Helpfulness subscale

---

## Task 6.1: Wire AchievementShare Component

**Vấn đề:** AchievementShare component đã tồn tại nhưng không được wire vào UI → lãng phí code.

**File thay đổi:**
- `frontend/src/app/badges/page.tsx` — thêm share button
- `frontend/src/app/exercises/[id]/ExerciseSummaryScreen.tsx` — thêm share sau khi hoàn thành

### Bước 6.1.1: Share button trên Badges page

```tsx
// BadgeCard component — thêm share button khi earned
{earned && (
  <div className="flex items-center gap-2">
    <Badge variant="success" size="sm">Đã đạt</Badge>
    <AchievementShare
      title={`Tôi vừa đạt huy hiệu "${badge.name}" trên PhatAmEN!`}
      text={`🏅 ${badge.description}`}
    />
  </div>
)}
```

### Bước 6.1.2: Share button trên Summary screen

```tsx
// ExerciseSummaryScreen — sau badges section
{submitStatus === "success" && isHighScore && (
  <div className="flex justify-center gap-3">
    <AchievementShare
      title={`Tôi vừa đạt ${score}% bài "${exercise.name}" trên PhatAmEN!`}
      text={`⭐ +${submitResult.rewards.totalXpEarned} XP | 🏆 ${submitResult.rating}`}
    />
  </div>
)}
```

**Skills áp dụng:**
- `maintainable-code`: Reuse existing component, không tạo mới
- `nielsen-ux-heuristics`: H7 (Flexibility) — user có option share thành tích

**Verification:**
- [ ] Badge earned → share button hiện
- [ ] Exercise ≥80% → share button hiện
- [ ] Click share → Twitter/clipboard options

---

## Task 6.2: Loss Aversion — Streak Warning

**Vấn đề:** User không biết streak sẽ mất nếu không học hôm nay → không có urgency.

**File thay đổi:**
- `frontend/src/app/dashboard/page.tsx` — conditional warning card
- Hoặc `frontend/src/components/gamification/DailyCheckIn.tsx`

### Bước 6.2.1: Check if user hasn't practiced today

```tsx
// Trong DailyCheckIn hoặc Dashboard
const now = new Date();
const lastPractice = latestAttempt?.createdAt;
const practicedToday = lastPractice && isSameDay(lastPractice, now);

// Nếu chưa luyện hôm nay VÀ streak > 0
{!practicedToday && user.streakCount > 0 && (
  <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4 mb-4 animate-pulse">
    <p className="font-bold text-amber-800">
      ⚠️ Chuỗi {user.streakCount} ngày của bạn sẽ mất nếu không luyện tập trước nửa đêm!
    </p>
    <Link href="/learning_map" className="text-sm font-bold text-amber-700 mt-1 inline-block">
      Luyện ngay bây giờ →
    </Link>
  </div>
)}
```

### Bước 6.2.2: Timing

Hiện warning card khi:
- User có streak ≥ 3
- User chưa hoàn thành bài nào hôm nay
- Hiện sau 6PM (chiều tối — thời điểm hay học)

**Skills áp dụng:**
- `nielsen-ux-heuristics`: Loss aversion — sợ mất > muốn đạt được
- `ui-color-harmony`: Amber-50 border-amber-300 = warning nhưng không alarming

**Verification:**
- [ ] Warning hiện khi streak > 0 và chưa luyện hôm nay
- [ ] Warning ẩn sau khi hoàn thành bài
- [ ] Link "Luyện ngay" navigate đúng

---

## Task 6.3: "New Content" Badge trên Learning Map

**Vấn đề:** User không biết khi có bài tập mới → cảm giác app stale.

**File thay đổi:**
- `frontend/src/app/learning_map/LearningMapClient.tsx`

### Bước 6.3.1: Detect new exercises

```tsx
// Check if exercise was created within last 7 days
function isNewExercise(exercise: ExerciseUI): boolean {
  // Cần thêm createdAt field từ API
  // Hoặc compare với "last seen" timestamp trong localStorage
  const lastSeen = localStorage.getItem(`seen-exercise-${exercise.id}`);
  return !lastSeen;
}

// Mark as seen when user clicks exercise
function markSeen(exerciseId: string) {
  localStorage.setItem(`seen-exercise-${exerciseId}`, new Date().toISOString());
}
```

### Bước 6.3.2: "MỚI" badge visual

```tsx
{isNewExercise(exercise) && (
  <Badge variant="info" size="sm" className="animate-pulse">
    ✨ MỚI
  </Badge>
)}
```

### Bước 6.3.3: "X bài mới tuần này" banner

```tsx
// Trên LearningMapClient, nếu có exercise mới
const newCount = allExercises.filter(isNewExercise).length;
{newCount > 0 && (
  <div className="mb-6 rounded-lg bg-primary-50 border border-primary-200 p-4">
    <p className="font-bold text-primary-700">
      ✨ Có {newCount} bài tập mới tuần này!
    </p>
  </div>
)}
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H1 (Visibility) — signal khi có content mới
- `maintainable-code`: localStorage helper functions

**Verification:**
- [ ] Badge "MỚI" hiện trên exercise chưa seen
- [ ] Badge ẩn sau khi click
- [ ] Banner "X bài mới" hiện đúng count

---

## Task 6.4: Skill Weakness Radar Chart

**Vấn đề:** User không biết mình yếu ở nhóm âm nào → không thể target practice.

**File thay đổi:**
- TẠO MỚI: `frontend/src/components/dashboard/SkillRadar.tsx`
- `frontend/src/app/dashboard/page.tsx` — conditional render

### Bước 6.4.1: Calculate skill scores

```tsx
// API hoặc client-side calculation
type SkillScores = {
  vowels: number;      // Nguyên âm (CĐ1)
  consonants: number;  // Phụ âm (CĐ2)
  difficult: number;   // Âm khó (CĐ3)
  linking: number;     // Nối âm (CĐ4)
};

function calculateSkillScores(attempts: ExerciseAttempt[]): SkillScores {
  // Group attempts by topic/sound group
  // Calculate average score per group
  // Return normalized 0-100
}
```

### Bước 6.4.2: Radar chart visual (CSS-only)

```tsx
// SVG radar chart — 4 axes
// No external chart library needed
<svg viewBox="0 0 200 200" className="w-48 h-48">
  {/* Grid lines */}
  {[25, 50, 75, 100].map(level => (
    <polygon key={level} points={radarPoints(level)} fill="none" stroke="#e5e7eb" />
  ))}
  {/* Data polygon */}
  <polygon points={dataPoints(scores)} fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2" />
  {/* Axis labels */}
  <text x="100" y="10">Nguyên âm</text>
  <text x="190" y="105">Phụ âm</text>
  <text x="100" y="195">Âm khó</text>
  <text x="10" y="105">Nối âm</text>
</svg>
```

### Bước 6.4.3: Dashboard placement

Đặt trong sidebar, dưới "Gợi ý hôm nay":
```tsx
<SkillRadar scores={skillScores} />
<p className="text-sm text-neutral-600 mt-2">
  💡 Nhóm âm yếu nhất: <strong>{weakestSkill}</strong> — hãy luyện thêm!
</p>
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H6 (Recognition) — visual pattern thay vì text numbers
- `ui-color-harmony`: Data polygon fill blue-200 stroke blue-500 (primary color)
- `maintainable-code`: calculateSkillScores là pure function, testable

**Verification:**
- [ ] Radar chart hiện 4 axes đúng
- [ ] Data polygon reflect actual scores
- [ ] Weakest skill highlighted
- [ ] Responsive: chart resize trên mobile

---

## Task 6.5: "Come Back" Hook — Daily Quest Reminder

**Vấn đề:** User rời app không có lý do quay lại trong ngày.

**File thay đổi:**
- `frontend/src/components/gamification/DailyQuestsWidget.tsx`

### Bước 6.5.1: Unfinished quests indicator

```tsx
// Navbar hoặc dashboard — show incomplete quest count
const incompleteCount = quests.filter(q => !q.completed).length;

{incompleteCount > 0 && (
  <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-bold text-accent-700">
    📋 {incompleteCount} nhiệm vụ
  </span>
)}
```

### Bước 6.5.2: Progress summary text

```tsx
// Trong DailyQuestsWidget — thêm context
<p className="text-xs text-neutral-500 mt-2">
  Hoàn thành tất cả nhiệm vụ để nhận bonus 💎 và XP!
</p>
```

**Verification:**
- [ ] Incomplete count badge hiện
- [ ] Badge ẩn khi tất cả quests completed

---

## Tổng Kết Priority 6

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 6.1 Wire AchievementShare | LOW | MEDIUM | Không |
| 6.2 Streak warning | LOW | HIGH | Không |
| 6.3 New content badge | LOW | MEDIUM | Không |
| 6.4 Skill radar chart | HIGH | HIGH | API data |
| 6.5 Quest reminder | LOW | MEDIUM | Không |

**Tổng thời gian ước tính:** 8-10 giờ

**Thứ tự đề xuất:** 6.1 → 6.2 → 6.3 → 6.5 → 6.4
