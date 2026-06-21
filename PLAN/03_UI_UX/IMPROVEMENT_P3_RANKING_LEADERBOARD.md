# Kế Hoạch Ranking Score Visibility & Leaderboard Upgrade (Ưu tiên 3)

**Mục tiêu:** Biến Ranking Score từ "vô hình" thành trung tâm của competitive experience. Đây là ưu tiên CAO NHẤT cho production.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md) — Phần 8

**Skills bắt buộc áp dụng:**
- `maintainable-code` — Type safety cho tier system, constants cho thresholds
- `nielsen-ux-heuristics` — H1 (Visibility), H6 (Recognition), Fitts's Law cho podium
- `ui-color-harmony` — Tier colors phải semantic (bronze=amber, silver=neutral, gold=yellow, diamond=purple)
- `web-usability-scales` — UEQ Stimulation scale sẽ tăng nếu ranking experience tốt

---

## Task 3.1: Hiện Ranking Score Trong Exercise Summary

**Vấn đề:** ExerciseSummaryScreen hiện XP + Streak + Badges nhưng KHÔNG hiện ranking delta → user không biết mình đang cạnh tranh.

**File thay đổi:**
- `frontend/src/app/exercises/[id]/ExerciseSummaryScreen.tsx`
- `frontend/src/app/exercises/[id]/types.ts` (thêm field nếu thiếu)

### Bước 3.1.1: Đảm bảo API trả về ranking data

Kiểm tra `SubmitResult` type trong `types.ts`:
```tsx
export type SubmitResult = {
  // ... existing fields
  rewards: {
    totalXpEarned: number;
    rankingDelta: number;      // ← THÊM nếu chưa có
    dailyBonusRanking: number; // ← THÊM nếu chưa có
  };
};
```

Kiểm tra API `/api/exercises/submit` có trả ranking data không. Nếu chưa, thêm vào response.

### Bước 3.1.2: Thêm "Điểm hạng" card vào Summary

**Vị trí:** Trong 3-card grid (XP / Streak / Badges), mở rộng thành 4-card grid.

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  {/* XP */}
  <div className="rounded-lg bg-primary-50 p-4 text-primary-700">
    <p className="text-sm font-semibold">⭐ XP</p>
    <p className="text-2xl font-black">+{submitResult.rewards.totalXpEarned}</p>
  </div>

  {/* ĐIỂM HẠNG — MỚI */}
  <div className="rounded-lg bg-amber-50 p-4 text-amber-700">
    <p className="text-sm font-semibold">🏆 Điểm hạng</p>
    <p className="text-2xl font-black">+{submitResult.rewards.rankingDelta}</p>
    {submitResult.rewards.dailyBonusRanking > 0 && (
      <p className="text-xs font-bold mt-1">+{submitResult.rewards.dailyBonusRanking} bonus</p>
    )}
  </div>

  {/* Streak */}
  ...

  {/* Badges */}
  ...
</div>
```

### Bước 3.1.3: Thêm context text

Phía dưới grid, thêm:
```tsx
<p className="text-sm text-amber-600 font-semibold">
  🏆 Bảng xếp hạng tuần — Điểm hạng reset mỗi thứ Hai
</p>
```

**Skills áp dụng:**
- `ui-color-harmony`: Amber (#F59E0B) cho ranking = energy/competition (psychology đúng)
- `maintainable-code`: Dùng `amber-50` / `amber-700` từ theme, không hardcode hex
- `nielsen-ux-heuristics`: H1 (Visibility of System Status) — ranking phải visible ngay sau action

**Verification:**
- [ ] Summary hiện card "🏆 Điểm hạng: +X"
- [ ] Daily bonus ranking hiện nếu có
- [ ] Grid responsive: 2 cột mobile → 4 cột desktop

---

## Task 3.2: Rank Tier System

**Vấn đề:** Chỉ có #1, #2, #3... → user không có identity. Cần tier như game (Bronze/Silver/Gold/Diamond).

**File thay đổi:**
- TẠO MỚI: `frontend/src/lib/gamification/rank-tiers.ts`
- `frontend/src/app/leaderboard/page.tsx`
- `frontend/src/components/gamification/RankTierBadge.tsx` (mới)

### Bước 3.2.1: Define Rank Tiers

```tsx
// lib/gamification/rank-tiers.ts

export type RankTier = "bronze" | "silver" | "gold" | "diamond" | "legend";

export const RANK_TIERS = {
  bronze: {
    name: "Đồng",
    icon: "🥉",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    condition: "Top 50%",
    minPercentile: 50,
  },
  silver: {
    name: "Bạc",
    icon: "🥈",
    color: "text-neutral-600",
    bgColor: "bg-neutral-100",
    borderColor: "border-neutral-300",
    condition: "Top 25%",
    minPercentile: 25,
  },
  gold: {
    name: "Vàng",
    icon: "🥇",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    condition: "Top 10%",
    minPercentile: 10,
  },
  diamond: {
    name: "Kim Cương",
    icon: "💎",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
    condition: "Top 3%",
    minPercentile: 3,
  },
  legend: {
    name: "Huyền Thoại",
    icon: "🏆",
    color: "text-amber-500",
    bgColor: "bg-gradient-to-r from-yellow-100 to-amber-100",
    borderColor: "border-amber-400",
    condition: "#1 tuần",
    minPercentile: 0,
  },
} as const;

/**
 * Determine tier from rank and total players.
 * @param rank — 1-based rank position
 * @param totalPlayers — total players in the period
 */
export function getRankTier(rank: number, totalPlayers: number): RankTier {
  if (totalPlayers <= 0) return "bronze";
  const percentile = (rank / totalPlayers) * 100;
  if (rank === 1) return "legend";
  if (percentile <= 3) return "diamond";
  if (percentile <= 10) return "gold";
  if (percentile <= 25) return "silver";
  return "bronze";
}
```

### Bước 3.2.2: Tạo RankTierBadge component

```tsx
// components/gamification/RankTierBadge.tsx
import { getRankTier, RANK_TIERS } from "@/lib/gamification/rank-tiers";

type RankTierBadgeProps = {
  rank: number;
  totalPlayers: number;
  size?: "sm" | "md" | "lg";
};

export default function RankTierBadge({ rank, totalPlayers, size = "md" }: RankTierBadgeProps) {
  const tier = getRankTier(rank, totalPlayers);
  const config = RANK_TIERS[tier];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
      title={`${config.name} — ${config.condition}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.name}
    </span>
  );
}
```

### Bước 3.2.3: API thêm totalPlayers

**File:** `frontend/src/app/api/leaderboard/route.ts`

Response cần thêm `totalPlayers` để client tính tier:
```tsx
{
  success: true,
  data: {
    type: "tuan",
    period: "2026-W25",
    items: [...],
    currentUser: { rank: 5, score: 120 },
    totalPlayers: 150,  // ← THÊM
  }
}
```

**Skills áp dụng:**
- `maintainable-code`: RANK_TIERS là constants object, getRankTier là pure function → dễ test
- `ui-color-harmony`: Mỗi tier dùng semantic color từ Tailwind theme (amber, neutral, yellow, purple)
- `nielsen-ux-heuristics`: H6 (Recognition) — icon + text dual encoding

**Verification:**
- [ ] `getRankTier(1, 100)` → "legend"
- [ ] `getRankTier(3, 100)` → "diamond"
- [ ] `getRankTier(10, 100)` → "gold"
- [ ] `getRankTier(25, 100)` → "silver"
- [ ] `getRankTier(50, 100)` → "bronze"
- [ ] Unit tests pass

---

## Task 3.3: Leaderboard Podium — Top 3 Visual Upgrade

**Vấn đề:** Top 3 trông giống #4-20 → thiếu drama, thiếu excitement.

**File thay đổi:**
- `frontend/src/app/leaderboard/page.tsx`

### Bước 3.3.1: Tách top 3 ra khỏi list

```tsx
// Tách items thành top 3 và rest
const topThree = data.items.slice(0, 3);
const rest = data.items.slice(3);
```

### Bước 3.3.2: Podium layout cho top 3

**Design:** 3 columns, #2 bên trái (nhỏ hơn), #1 giữa (lớn nhất + crown), #3 bên phải.

```tsx
{/* PODIUM — chỉ hiện khi >= 3 items */}
{topThree.length >= 3 && (
  <div className="mb-8 flex items-end justify-center gap-4">
    {/* #2 — Silver (left, shorter) */}
    <PodiumCard user={topThree[1]} rank={2} height="h-36" />
    
    {/* #1 — Gold (center, tallest + crown) */}
    <PodiumCard user={topThree[0]} rank={1} height="h-48" isChampion />
    
    {/* #3 — Bronze (right, shortest) */}
    <PodiumCard user={topThree[2]} rank={3} height="h-28" />
  </div>
)}
```

### Bước 3.3.3: PodiumCard component

```tsx
function PodiumCard({ user, rank, height, isChampion = false }) {
  const podiumColors = {
    1: "from-yellow-400 to-amber-500",
    2: "from-neutral-300 to-neutral-400",
    3: "from-amber-600 to-amber-700",
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className={`relative ${isChampion ? "mb-3" : "mb-2"}`}>
        <img
          src={user.avatarUrl ?? dicebear(user.username)}
          alt={user.username}
          className={`rounded-full border-4 ${isChampion ? "h-20 w-20" : "h-16 w-16"} border-white shadow-lg`}
        />
        {isChampion && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl" aria-label="Quán quân">
            👑
          </span>
        )}
      </div>
      
      {/* Name */}
      <p className="text-sm font-bold text-neutral-900 truncate max-w-[100px]">
        {user.username}
      </p>
      
      {/* Score */}
      <p className="text-xs font-semibold text-neutral-600">
        {user.score.toLocaleString("vi-VN")}
      </p>
      
      {/* Podium base */}
      <div
        className={`mt-2 w-24 rounded-t-lg bg-gradient-to-t ${podiumColors[rank as 1|2|3]} flex items-center justify-center ${height}`}
      >
        <span className="text-3xl font-black text-white/80">#{rank}</span>
      </div>
    </div>
  );
}
```

### Bước 3.3.4: User position card cố định ở dưới

Nếu user không trong top 20:
```tsx
{data.currentUser && data.currentUser.rank > 20 && (
  <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-primary-300 bg-primary-50 p-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl">📍</span>
      <div>
        <p className="font-bold text-neutral-900">Vị trí của bạn</p>
        <p className="text-sm text-neutral-600">
          {data.currentUser.rank > data.items.length 
            ? `Bạn đang ở hạng #${data.currentUser.rank}` 
            : "Tiếp tục phấn đấu!"}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-2xl font-bold text-primary-600">#{data.currentUser.rank}</p>
      <p className="text-xs text-neutral-500">{data.currentUser.score} điểm</p>
    </div>
  </div>
)}
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: Fitts's Law — champion card lớn nhất, ở giữa → focal point
- `ui-color-harmony`: Gold (#FFD700) cho #1, Silver (#C0C0C0) cho #2, Bronze (#CD7F32) cho #3 — chuẩn medal colors
- `maintainable-code`: PodiumCard nhận props typed, podiumColors là constant map

**Verification:**
- [ ] Podium hiện đúng thứ tự: #2 trái, #1 giữa (cao nhất + crown), #3 phải
- [ ] User position card hiện khi rank > 20
- [ ] Responsive: podium ẩn trên mobile < 480px (thay bằng list)

---

## Task 3.4: "Bạn Đã Bị Vượt" Notification

**Vấn đề:** User không biết khi bị vượt rank → không có loss aversion motivation.

**File thay đổi:**
- `frontend/src/components/gamification/effects/QuestCompleteBanner.tsx` (mở rộng)
- Hoặc TẠO MỚI: `frontend/src/components/gamification/effects/RankChangeNotification.tsx`

### Bước 3.4.1: Check rank change trên dashboard load

```tsx
// Hook: useRankChange
export function useRankChange() {
  const [rankChange, setRankChange] = useState<{ old: number; new: number } | null>(null);
  
  useEffect(() => {
    const lastRank = sessionStorage.getItem("lastWeeklyRank");
    fetch("/api/leaderboard?type=tuan&limit=100")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.currentUser) {
          const currentRank = data.currentUser.rank;
          if (lastRank && currentRank > parseInt(lastRank)) {
            setRankChange({ old: parseInt(lastRank), new: currentRank });
          }
          sessionStorage.setItem("lastWeeklyRank", String(currentRank));
        }
      });
  }, []);
  
  return rankChange;
}
```

### Bước 3.4.2: Notification UI

```tsx
{rankChange && (
  <div className="fixed top-16 right-4 z-50 animate-[slide-in-right_0.3s_ease-out]">
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 shadow-lg max-w-sm">
      <p className="font-bold text-amber-800">🏆 Bảng xếp hạng tuần</p>
      <p className="text-sm text-amber-700 mt-1">
        Bạn đã tụt từ #{rankChange.old} xuống #{rankChange.new}. 
        Luyện tập để lấy lại vị trí!
      </p>
      <Link href="/leaderboard" className="text-sm font-bold text-amber-800 mt-2 inline-block">
        Xem bảng xếp hạng →
      </Link>
    </div>
  </div>
)}
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H1 (Visibility) — thông báo rank change ngay khi user login
- `maintainable-code`: Hook tách riêng logic, component chỉ render

**Verification:**
- [ ] Notification hiện khi rank giảm
- [ ] Không hiện khi rank tăng hoặc giữ nguyên
- [ ] Auto-dismiss sau 5 giây
- [ ] Click link → navigate leaderboard

---

## Task 3.5: Season End Ceremony

**Vấn đề:** Tuần/tháng kết thúc lặng lẽ → không có climax moment.

**File thay đổi:**
- TẠO MỚI: `frontend/src/components/gamification/effects/SeasonEndOverlay.tsx`

### Bước 3.5.1: Check season end

```tsx
// Check if it's Sunday 8PM or last day of month
function isSeasonEnding(): { type: "week" | "month"; period: string } | null {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday
  const hour = now.getHours();
  
  // Sunday 8-9PM = week ending
  if (day === 0 && hour >= 20 && hour < 21) {
    return { type: "week", period: getCurrentWeekPeriod() };
  }
  // Last day of month, 8-9PM = month ending  
  // ... similar logic
  return null;
}
```

### Bước 3.5.2: Ceremony overlay

```tsx
// Fullscreen overlay showing:
// - "Kết thúc tuần!" header
// - Your final rank + tier badge
// - Rewards earned this week
// - Confetti if top 10
// - "Tuần mới bắt đầu!" CTA
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: Tạo "milestone moment" — gamification cần ceremony
- `ui-color-harmony`: Overlay dùng tier color của user

**Verification:**
- [ ] Overlay hiện đúng thời điểm
- [ ] Hiện đúng tier + rank
- [ ] Confetti nếu top 10

---

## Tổng Kết Priority 3

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 3.1 Ranking Score trong Summary | LOW | CRITICAL | API data |
| 3.2 Rank Tier system | MEDIUM | CRITICAL | 3.1 |
| 3.3 Leaderboard podium | MEDIUM | HIGH | 3.2 |
| 3.4 "Bị vượt" notification | LOW | HIGH | 3.1 |
| 3.5 Season end ceremony | HIGH | MEDIUM | 3.2, 3.3 |

**Tổng thời gian ước tính:** 10-14 giờ

**Thứ tự đề xuất:** 3.1 → 3.2 → 3.4 → 3.3 → 3.5
