# Đánh Giá UX/UI Toàn Diện — PhatAmEN (2026-06-20)

Đánh giá dựa trên 4 frameworks:
- **Nielsen's 10 Usability Heuristics** + Cognitive Psychology + Laws of UX
- **UI Color Harmony** (Color Theory + 60-30-10 + Psychology + WCAG)
- **Web Usability Scales** (SUS + UEQ heuristic estimation)
- **Gamification Engagement Assessment** (Motivation & Fun Factor)

---

## PHẦN 1: Nielsen's 10 Heuristics — Đánh Giá Từng Nguyên Tắc

### ✅ H1: Visibility of System Status — ĐẠT (8/10)

**Điểm mạnh:**
- Progress bar trong ExerciseEngine header — luôn biết đang ở câu mấy/total
- ExerciseSummary hiện XP + streak + badges ngay sau khi hoàn thành
- DailyCheckIn có 7 ô visual chu kỳ tuần (xanh = đã check, trắng = chưa)
- Combo 🔥 hiển thị realtime khi trả lời đúng liên tiếp
- StreakBadge gradient thay đổi theo milestone (blue→yellow→orange→purple)
- LevelUpOverlay fullscreen celebration khi lên cấp
- RewardToast notifications góc phải trên cho gems/xp/streak events

**Cần cải thiện:**
- ⚠️ **Dashboard thiếu "hôm nay bạn nên làm gì"** — người dùng phải tự tìm bài tập tiếp theo
- ⚠️ **Không có timer/countdown trong bài tập nói** — 5 giây auto-stop nhưng user không thấy countdown
- ⚠️ **Badges page loading state** — chỉ text "Đang tải huy hiệu..." thay vì skeleton

---

### ✅ H2: Match Between System and Real World — ĐẠT (7/10)

**Điểm mạnh:**
- Thuật ngữ quen thuộc: "Chuỗi học", "Cấp độ", "Huy hiệu", "Vòng quay"
- Emoji icon trực quan: 🔥 streak, 💎 gems, 🏅 badges, 🎤 mic, 🎡 wheel
- IPA font riêng (`font-ipa` class) cho hiển thị ký hiệu ngữ âm chuẩn
- Locked topic overlay dùng 🔒 + text "Chủ đề bị khóa" — rõ ràng

**Cần cải thiện:**
- ⚠️ **"Learning map"** — thuật ngữ kỹ thuật, người dùng bình thường sẽ không hiểu → đổi thành "Lộ trình" hoặc "Bản đồ phát âm"
- ⚠️ **"Submit" / "submitStatus"** — không exposed cho user nhưng nếu API lỗi hiện text kỹ thuật
- ⚠️ **Home page "Đồ án tốt nghiệp 2026" badge** — không liên quan đến người dùng cuối → xóa hoặc ẩn

---

### ✅ H3: User Control and Freedom — ĐẠT (8/10)

**Điểm mạnh:**
- Back button "← Lộ trình" luôn hiện ở header trong bài tập
- Mute toggle SFX — user kiểm soát âm thanh
- "Làm lại bài này" + "Về lộ trình" ở summary screen
- Modal focus trap + Esc to close (LevelUpOverlay, Modal component)
- Backdrop click to close modals
- "Quay lại chủ đề" / "Quay lại nhóm âm" breadcrumb navigation

**Cần cải thiện:**
- ⚠️ **Không có nút "Thoát" giữa bài tập** — phải dùng back button browser (dữ liệu mất)
- ⚠️ **Không có confirm trước khi thoát bài đang làm dở** — click "← Lộ trình" thoát ngay
- ⚠️ **Word reveal toggle** — chỉ có "👁️ Hiện từ" / "🙈 Ẩn từ", không có giải thích tại sao cần ẩn

---

### ✅ H4: Consistency and Standards — ĐẠT (8/10)

**Điểm mạnh:**
- Hệ thống 5 tone color nhất quán: primary (blue), accent (orange), success (green), warning (amber), error (red)
- Badge component 5 variants, Button 5 variants — consistent API
- ProgressBar component tái dụng ở mọi nơi (dashboard, learning map, exercise, badges)
- 3-tier drill-down pattern (Topic → Sound Group → Exercise) consistent
- Navbar active state indicator nhất quán
- Focus ring `focus-visible:ring-4` pattern ở tất cả interactive elements

**Cần cải thiện:**
- ⚠️ **Inconsistent card styles** — Dashboard dùng `Card` component, Learning Map dùng inline classes
- ⚠️ **Badge type display** — hiện raw "COMMON", "RARE", "EPIC" thay vì localized ("Thường", "Hiếm", "Huyền thoại")
- ⚠️ **DailyRewardsPopup dùng "xu" (coins)** nhưng DailyCheckIn dùng XP — hai hệ thống tiền tệ khác nhau, gây confusion

---

### ✅ H5: Error Prevention — ĐẠT (7/10)

**Điểm mạnh:**
- Speech Recognition auto-stop 5 giây — ngăn ghi âm vô hạn
- "Bài tập chưa có câu hỏi" guard — empty exercise → redirect
- SpinWheel cần streak ≥ 3 mới mở khóa — prevent spam
- Input validation ở auth pages (real-time)
- `aria-disabled` trên inactive exercise cards

**Cần cải thiện:**
- ⚠️ **DailyRewardsPopup claim button `animate-bounce`** — user có thể click nhầm nhiều lần
- ⚠️ **"Làm lại bài này" không confirm** — reload page ngay, mất context
- ⚠️ **No offline support** — nếu mất mạng giữa bài, kết quả mất hoàn toàn

---

### ✅ H6: Recognition Rather than Recall — ĐẠT (7/10)

**Điểm mạnh:**
- 3 stat cards ở dashboard (Chuỗi học / Cấp độ / Bài đã đạt) — không cần nhớ
- Learning map hiện progress bar mỗi topic — thấy ngay bao nhiêu %
- Exercise cards hiện best score + trạng thái — biết bài nào cần luyện lại
- Badge progress bars — thấy tiến độ cụ thể

**Cần cải thiện:**
- ⚠️ **Dashboard sidebar quá dày** — DailyCheckIn + DailyQuests + WeeklyChallenge + SpinWheel + Badges stacked → user phải scroll để thấy tất cả
- ⚠️ **Không có "recent activity" feed** — user phải tự nhớ hôm qua làm đến đâu
- ⚠️ **Navbar thiếu icon cho navigation items** — chỉ text, khó scan nhanh

---

### ✅ H7: Flexibility and Efficiency of Use — ĐẠT (6/10)

**Điểm mạnh:**
- Multiple exercise types (listen, speak, challenge, real-world) — 4 dạng bài
- Keyboard focus navigation supported
- Quick links ở dashboard (checkin, leaderboard, badges)

**Cần cải thiện:**
- ⚠️ **Không có keyboard shortcuts** trong bài tập (Enter = submit, Space = play audio)
- ⚠️ **Không có "continue last exercise" quick button** — phải vào learning map → tìm topic → tìm bài
- ⚠️ **Learning map không có search/filter** — nếu 20+ topics thì phải scroll
- ⚠️ **No "practice random" button** — user phải tự chọn bài

---

### ✅ H8: Aesthetic and Minimalist Design — ĐẠT (7/10)

**Điểm mạnh:**
- Clean card-based layout, good white space
- Home page gradient hero + blur circles — modern, professional
- Exercise engine minimal — chỉ question + progress + score
- Summary screen 3-tier progressive disclosure (praise → stats → review)
- Exercise summary score ring (conic-gradient CSS) — elegant, no library

**Cần cải thiện:**
- ⚠️ **Dashboard sidebar cluttered** — 5 gamification widgets stacked vertically quá nhiều information
- ⚠️ **DailyRewardsPopup visual overload** — 7 chests + streak info + warning + claim button = too much
- ⚠️ **Home page feature cards generic** — 3 cards giống hệt nhau, thiếu visual differentiation
- ⚠️ **"best score" badge trên exercise cards** dùng raw number thay vì visual indicator (star rating)

---

### ✅ H9: Help Users Recognize, Diagnose, and Recover from Errors — ĐẠT (8/10)

**Điểm mạnh:**
- SpeakWordQuestion phân biệt rõ 3 error types: browser unsupported / mic denied / no speech
- Mic denied → hướng dẫn chi tiết: "click icon 🔒 → Site settings → Microphone → Allow"
- ListenFeedbackSheet hiện đáp án đúng vs sai + highlight target phoneme IPA
- ExerciseSummary "Cần chú ý" section review lại tất cả câu sai + nghe lại audio
- Progress bias feedback: "Tốt hơn X% so với lần trước" / "Thấp hơn X% — cố gắng nhé!"

**Cần cải thiện:**
- ⚠️ **Error states không có retry cho API failures** — chỉ text, không có button "Thử lại"
- ⚠️ **Badges page error** — chỉ hiện text lỗi, không có action

---

### ✅ H10: Help and Documentation — CẦN CẢI THIỆN (5/10)

**Điểm mạnh:**
- Inline hints: "Nhấn để bắt đầu ghi âm", "Nói to hơn", "Âm lượng tốt"
- SpinWheel hint: "Cần chuỗi 🔥 3 ngày liên tiếp để mở khóa"

**Cần cải thiện:**
- ⚠️ **KHÔNG CÓ ONBOARDING** — user mới đăng ký vào dashboard không biết bắt đầu từ đâu
- ⚠️ **Không có tooltip/guide cho gamification** — gems dùng để làm gì? streak hoạt động thế nào?
- ⚠️ **Không có FAQ hay Help section**
- ⚠️ **IPA chart (bảng 44 âm vị) không được link từ exercise** — user không biết âm /ʃ/ phát âm thế nào

---

## PHẦN 2: Cognitive Psychology & Laws of UX

### Cognitive Load Assessment

**Extraneous Load (thiết kế xấu → cần loại bỏ):**

| Vấn đề | Vị trí | Impact | Giải pháp |
|--------|--------|--------|-----------|
| Sidebar quá nhiều widgets | Dashboard | User overwhelm khi vào dashboard | Gom thành tab/collapsible |
| DailyRewardsPopup 7 rương + warning + streak | Modal | Information overload | Split thành 2 bước: see → claim |
| Inconsistent currency (XP vs xu) | Toàn app | Mental model confusion | Thống nhất 1 currency |
| "Đồ án tốt nghiệp 2026" badge | Home page | Không liên quan user goal | Xóa |

**Germane Load (hỗ trợ xây dựng mental model — tốt):**
- 4-tone color system cho exercise types (listen=blue, speak=green, challenge=amber, real=orange) → user nhanh chóng phân biệt dạng bài
- 3-level drill-down → progressive disclosure tốt
- Combo 🔥 visual feedback → positive reinforcement

### Gestalt Principles

| Principle | Assessment | Evidence |
|-----------|------------|----------|
| **Proximity** | ✅ Tốt | Related stats grouped trong cards |
| **Similarity** | ✅ Tốt | Consistent card styles, badge styles |
| **Continuity** | ⚠️ Cần cải thiện | Learning map không có visual flow/connection giữa topics |
| **Closure** | ✅ Tốt | Emoji icons đơn giản, dễ nhận |
| **Figure/Ground** | ✅ Tốt | Good contrast, clear foreground |
| **Common Region** | ✅ Tốt | Cards, containers group content well |

### Fitts's Law

| Target | Size | Assessment |
|--------|------|------------|
| Mic button (SpeakWordQuestion) | 132×132px | ✅ Xuất sắc — rất lớn, dễ click |
| Primary CTA buttons | min-h-11 (44px) | ✅ Đạt WCAG minimum |
| Back button (exercise) | ~100×40px | ✅ Đủ lớn |
| SpinWheel button | full-width × 44px | ✅ Tốt |
| Badge filter tabs | min-h-[44px] | ✅ Đạt |

### Hick's Law

| Decision Point | Options | Assessment |
|----------------|---------|------------|
| Dashboard actions | 5+ widgets + continue learning | ⚠️ Quá nhiều choices |
| Learning map topics | 4-6 topics | ✅ Hợp lý |
| Exercise types | 4 types | ✅ Tốt (Listen/Speak/Challenge/Real) |
| Summary actions | 2 buttons (retry/exit) | ✅ Tối ưu |

---

## PHẦN 3: UI Color Harmony Assessment

### Color System Audit

**Hệ thống 6 màu semantic (globals.css @theme):**

| Token | Hex | Vai trò | Assessment |
|-------|-----|---------|------------|
| Primary | #2563EB | Learning, CTAs, links | ✅ Blue = Trust (chuẩn educational) |
| Accent | #f97316 | Gamification, energy | ✅ Orange = Energy (tốt cho gamification) |
| Success | #16a34a | Correct, achievement | ✅ Green = Go/Correct (chuẩn) |
| Warning | #f59e0b | Attention, streaks | ✅ Amber = Caution (chuẩn) |
| Error | #ef4444 | Incorrect | ✅ Red = Stop (chuẩn) |
| Purple | #a855f7 | Level-ups, milestones | ✅ Purple = Premium/Rare (tốt cho rewards) |

### 60-30-10 Ratio Assessment

**Dashboard:**
- 60% Dominant: `bg-white`, `bg-neutral-50` ✅
- 30% Secondary: `bg-primary-50`, `bg-warning-50`, `bg-success-50` (stat cards) ✅
- 10% Accent: `bg-neutral-900` (CTA), progress bars, badges ✅

**Home page:**
- 60% Dominant: `bg-gradient-to-br from-primary-50 via-white to-accent-50` ✅
- 30% Secondary: `bg-white` (feature section) ✅
- 10% Accent: gradient CTA `from-primary-600 to-accent-600` ✅

**Exercise engine:**
- 60% Dominant: `bg-neutral-50` ✅
- 30% Secondary: `bg-white` (header, cards) ✅
- 10% Accent: `bg-success-*` / `bg-error-*` (feedback), 🔥 combo ✅

**Assessment: 60-30-10 TUÂN THỦ TỐT** — saturated colors chỉ chiếm ~10%.

### Color Harmony Type

**Primary: Blue #2563EB + Accent: Orange #f97316**
→ Đây là **Split-Complementary** (blue + orange nằm gần đối diện trên bánh xe màu)
→ ✅ **Phù hợp cho educational + gamification**: Blue = trust/calm (học), Orange = energy/fun (chơi)

### Semantic Color Violations

| Check | Status | Notes |
|-------|--------|-------|
| Green delete button? | ✅ Không có | — |
| Red confirm button? | ✅ Không có | — |
| Gray primary action? | ⚠️ Dashboard CTA dùng `bg-neutral-900` | Neutral-900 đủ đậm, chấp nhận được |
| Color-only information? | ⚠️ StreakBadge gradient | Có text "X ngày" + message → OK |

### WCAG Contrast Assessment

| Combination | Ratio | Status |
|-------------|-------|--------|
| `text-neutral-900` (#111827) on `bg-white` (#fff) | 19.3:1 | ✅ AAA |
| `text-neutral-600` (#4b5563) on `bg-white` (#fff) | 6.4:1 | ✅ AA |
| `text-primary-700` (#1d4ed8) on `bg-primary-50` (#eff6ff) | ~6.2:1 | ✅ AA |
| `text-warning-700` (#b45309) on `bg-warning-50` (#fffbeb) | ~5.1:1 | ✅ AA |
| `text-success-700` (#15803d) on `bg-success-50` (#f0fdf4) | ~5.8:1 | ✅ AA |
| `text-error-700` (#b91c1c) on `bg-error-50` (#fef2f2) | ~5.5:1 | ✅ AA |
| `text-white` (#fff) on `bg-primary-600` (#2563EB) | 4.6:1 | ✅ AA |
| `text-white` (#fff) on `bg-neutral-900` (#111827) | 19.3:1 | ✅ AAA |

**Kết luận: TẤT CẢ CẶP MÀU ĐỀU ĐẠT WCAG AA (≥4.5:1)** ✅

---

## PHẦN 4: Web Usability Scales — Heuristic Estimation

### SUS (System Usability Scale) — Ước tính Heuristic

*Không có user testing thực tế → ước tính dựa trên code review:*

| SUS Question | Estimated Score | Rationale |
|--------------|----------------|-----------|
| Q1: Thích dùng thường xuyên | 4/5 | Gamification tốt, nhưng dashboard overwhelming |
| Q2: Phức tạp không cần thiết | 2/5 (good) | Exercise flow đơn giản, nhưng navigation hơi sâu |
| Q3: Dễ sử dụng | 4/5 | Exercise UX tốt, learning map trực quan |
| Q4: Cần hỗ trợ kỹ thuật | 2/5 (good) | Speech API error handling tốt |
| Q5: Chức năng tích hợp tốt | 4/5 | Exercise → Summary → Reward flow liền mạch |
| Q6: Quá nhiều inconsistency | 2/5 (good) | Consistent design system |
| Q7: Học sử dụng nhanh | 4/5 | Intuitive, nhưng thiếu onboarding |
| Q8: Cumbersome | 2/5 (good) | Lightweight, fast |
| Q9: Tự tin sử dụng | 4/5 | Clear feedback, good error handling |
| Q10: Cần học nhiều | 2/5 (good) | Gamification mechanics dễ hiểu |

**Estimated SUS Score: ~75/100 (Grade B — Good)**
> Trên mức trung bình toàn cầu (68), nhưng chưa đạt Excellent (80+).

### UEQ (User Experience Questionnaire) — Ước tính Heuristic

| UEQ Scale | Estimated | Assessment |
|-----------|-----------|------------|
| **Attractiveness** | +1.2 (Positive) | Clean, modern design. Good color system. |
| **Perspicuity** | +1.0 (Positive) | Clear exercise flow. Dashboard hơi phức tạp. |
| **Efficiency** | +0.8 (Positive) | Quick task completion. Navigation hơi sâu (3 levels). |
| **Dependability** | +1.1 (Positive) | Good error handling, predictable behavior. |
| **Stimulation** | +1.5 (Positive) | **ĐIỂM MẠNH NHẤT** — Gamification tạo motivation tốt. |
| **Novelty** | +0.6 (Neutral) | Design patterns quen thuộc, chưa có gì đột phá. |

**UEQ Assessment: Stimulation (+1.5) là điểm sáng nhất** → Gamification working well!

---

## PHẦN 5: Gamification Engagement — Người Học Có Thích Thú Không?

### Đánh giá theo Motivation Framework (Self-Determination Theory)

#### 🟢 Autonomy (Tự chủ) — ĐẠT (7/10)
- ✅ User tự chọn topic → sound group → exercise type
- ✅ Toggle mute SFX, show/hide word
- ✅ "Làm lại" hoặc "Về lộ trình" tự do
- ⚠️ Thiếu personalization (không thể reorder topics, không có "favorite exercises")

#### 🟢 Competence (Năng lực) — ĐẠT TỐT (8/10)
- ✅ Immediate feedback sau mỗi câu (ListenFeedbackSheet/SpeakFeedbackSheet)
- ✅ Score visible real-time + combo 🔥
- ✅ 3-tier summary (praise → XP/streak/badges → review errors)
- ✅ Progress bias ("Tốt hơn X% so với lần trước")
- ✅ Level progression visible trên dashboard
- ⚠️ Thiếu "skill breakdown" — không biết mình yếu âm nào

#### 🟢 Relatedness (Kết nối) — CẦN CẢI THIỆN (5/10)
- ✅ Leaderboard exists (WeeklyChallengeCard)
- ⚠️ **KHÔNG có social features** — không thể mời bạn, không có team/group
- ⚠️ **AchievementShare component tồn tại nhưng không được dùng** ở đâu trong app
- ⚠️ Leaderboard chỉ weekly reset — không có all-time hay friends-only

#### 🟡 Extrinsic Rewards — ĐẠT TỐT (8/10)
- ✅ XP per exercise + level up celebration
- ✅ Streak system (daily check-in + fire indicator)
- ✅ Badges (5 categories: progress, skill, streak, improvement, ranking)
- ✅ SpinWheel (daily prize, need streak ≥ 3)
- ✅ Daily Quests (3 quests per day)
- ✅ Weekly Challenge (competitive)
- ⚠️ **Gems currency không có gì để mua** — GemsDisplay có shop modal nhưng items unclear
- ⚠️ **DailyRewardsPopup dùng "xu" ≠ XP** — hai currency overlap

#### 🟡 Intrinsic Motivation — CẦN CẢI THIỆN (6/10)
- ✅ Multiple exercise types → variety
- ✅ Combo system → flow state
- ✅ Waveform visualizer → engaging for speaking exercises
- ⚠️ **Không có "aha moments"** — IPA knowledge không được integrate vào exercise
- ⚠️ **No storytelling/narrative** — exercises rời rạc, không có "journey"
- ⚠️ **Feedback chỉ "Đúng/Sai"** — không giải thích TẠI SAO sai (phonetics knowledge)

### Engagement Score Summary

| Yếu tố | Điểm | Assessment |
|--------|------|------------|
| Visual Appeal | 8/10 | Modern, clean, colorful |
| Reward Variety | 8/10 | XP + streak + badges + gems + spin + quests + weekly |
| Feedback Quality | 7/10 | Good visual feedback, thiếu phonetic explanation |
| Challenge Balance | 7/10 | Easy to start, thiếu adaptive difficulty |
| Social Connection | 3/10 | Leaderboard only, no social features |
| Learning Integration | 5/10 | Exercises không link đến IPA knowledge |
| Novelty/Surprise | 6/10 | Predictable patterns, thiếu random/surprise |
| **OVERALL ENGAGEMENT** | **6.3/10** | **Tốt cho MVP, cần bổ sung social + knowledge integration** |

---

## PHẦN 6: Tổng Hợp Khuyến Nghị

### 🟢 NÊN GIỮ (Already Good)

| # | Yếu tố | Lý do |
|---|--------|-------|
| 1 | 5-tone semantic color system | Chuẩn WCAG, consistent, well-documented |
| 2 | Exercise engine flow (question → feedback → summary) | Excellent 3-tier UX |
| 3 | Combo 🔥 system | Tạo flow state khi luyện tập |
| 4 | StreakBadge gradient progression | Visual reward cho consistency |
| 5 | LevelUpOverlay fullscreen celebration | Memorable achievement moment |
| 6 | ListenFeedbackSheet IPA highlight | Pedagogically sound (contrast audio) |
| 7 | SpeakWordQuestion waveform + mic UX | Engaging, professional feel |
| 8 | Progress bars everywhere | Always know where you stand |
| 9 | Accessibility (ARIA, focus traps, reduced-motion) | Production-quality |
| 10 | ExerciseSummary 3-tier structure | Celebrate → Inform → Review |

### 🟡 NÊN CHỈNH (Improve)

| # | Vấn đề | Giải pháp | Priority |
|---|--------|-----------|----------|
| 1 | **Dashboard sidebar overwhelming** | Gom DailyCheckIn + DailyQuests + WeeklyChallenge + SpinWheel thành **tabbed widget** (3 tabs: "Hôm nay" / "Thử thách" / "Phần thưởng") | HIGH |
| 2 | **Thiếu Onboarding** | Thêm **5-step guided tour** lần đầu vào dashboard: highlight Dashboard → Learning Map → Exercise → Badges → Profile | HIGH |
| 3 | **Inconsistent currency (XP vs xu)** | **Thống nhất thành 1 currency**: XP. Bỏ "xu" trong DailyRewardsPopup, đổi sang XP. Gems giữ riêng cho shop. | MEDIUM |
| 4 | **Badge type raw English** | Localize: COMMON→"Thường", RARE→"Hiếm", EPIC→"Huyền thoại", PERIODIC→"Theo kỳ" | LOW |
| 5 | **Dashboard thiếu "Hôm nay nên học gì"** | Thêm **"Gợi ý hôm nay"** card — chọn random 1 bài chưa completed, show ở vị trí prominent | HIGH |
| 6 | **Exercise thiếu confirm khi thoát** | Thêm confirmation dialog "Bạn có chắc muốn thoát? Kết quả hiện tại sẽ không được lưu" | MEDIUM |
| 7 | **SpeakWordQuestion thiếu countdown** | Thêm **visual countdown 5s** (circle timer) khi recording | MEDIUM |
| 8 | **Learning map không có visual flow** | Thêm **connecting lines/arrows** giữa topics (như Duolingo path) | MEDIUM |
| 9 | **Badges page loading state** | Replace text với **skeleton cards** (animate-pulse) | LOW |
| 10 | **Navbar thiếu icon** | Thêm **icon trước mỗi nav item**: 📊 Dashboard, 🗺️ Lộ trình, 🏅 Huy hiệu | LOW |

### 🔴 NÊN XÓA (Remove)

| # | Yếu tố | Lý do |
|---|--------|-------|
| 1 | **"Đồ án tốt nghiệp 2026" badge** ở Home page | Không liên quan đến user goal → tăng extraneous cognitive load |
| 2 | **`animate-bounce` trên DailyRewardsPopup claim button** | Bounce liên tục gây distracting, vi phạm H8 (Aesthetic Minimalist). Dùng `hover:scale-105` thay thế |
| 3 | **Dark mode CSS** trong globals.css (lines 118-239) | Force-disabled dark mode nhưng vẫn có 120 dòng CSS → dead code, maintenance burden |
| 4 | **Legacy `css/styles.css`** (988 lines) | Không được dùng bởi Next.js app, chỉ static site → confusing, nên xóa hoặc archive |
| 5 | **DailyRewardsPopup "⚠️ Lưu ý" warning block** | Negative framing ("bỏ lỡ → reset") tạo anxiety. Move info này vào DailyCheckIn description thay thế |

### 🆕 NÊN THÊM (New Features for Engagement)

| # | Feature | Impact | Effort |
|---|---------|--------|--------|
| 1 | **"Skill Weakness" radar chart** — hiện user yếu ở nhóm âm nào | Competence + Learning Integration | HIGH effort |
| 2 | **Phonetic explanation khi sai** — "Bạn phát âm /ʃ/ chưa đúng, thử cong lưỡi lên..." | Intrinsic Motivation + Pedagogy | MEDIUM |
| 3 | **Adaptive difficulty** — đề xuất bài dễ hơn nếu score < 50 | Challenge Balance | MEDIUM |
| 4 | **Gems shop thực sự** — mua theme, avatar frame, streak freeze | Extrinsic Reward payoff | MEDIUM |
| 5 | **AchievementShare integration** — share badges lên social (component đã có, chỉ cần wire) | Relatedness | LOW |
| 6 | **"Continue Learning" big button** ở dashboard — 1-click vào bài tập tiếp theo | Efficiency | LOW |
| 7 | **Mini IPA reference popup** khi click vào IPA symbol trong exercise | Learning Integration | MEDIUM |

---

## PHẦN 7: Kết Luận

### Tổng điểm

| Framework | Điểm | Đánh giá |
|-----------|------|----------|
| Nielsen's Heuristics (avg) | 7.2/10 | Good — Strong exercise UX, weak onboarding & help |
| Cognitive Load | Low extraneous | Good — chỉ sidebar + daily rewards hơi overload |
| 60-30-10 Color Ratio | Pass | Excellent — well-balanced |
| WCAG Contrast | All AA pass | Excellent |
| Estimated SUS | ~75/100 (B) | Good — Above global average (68) |
| UEQ Stimulation | +1.5 | Positive — Gamification is engaging |
| Gamification Engagement | 6.3/10 | Good for MVP, needs social + knowledge depth |

### Trả lời câu hỏi: "Giao diện hiện tại có khiến người học thích thú không?"

**CÓ, nhưng chưa đủ sâu:**

1. **Lần đầu vào (First impression): 8/10** — Giao diện đẹp, màu sắc tươi sáng, gamification elements hấp dẫn (vòng quay, huy hiệu, streak fire)
2. **Sau 1 tuần dùng (Retention): 6/10** — Thiếu chiều sâu: không có social, không giải thích phonetics, exercises lặp lại
3. **Sau 1 tháng (Long-term): 4/10** — Thiếu nội dung mới, thiếu personalization, gems không có gì để tiêu

**Bottom line:** UI hiện tại TỐT về mặt visual + functional. Gamification tạo được initial engagement. Nhưng để giữ chân người học lâu dài, cần thêm **pedagogical depth** (giải thích tại sao sai) + **social features** + **meaningful rewards** (gems shop).

---

## PHẦN 8: Đánh Giá Bổ Sung — Ranking Score & Production-Ready

*Đánh giá thêm cho dự án thật (production), không chỉ MVP.*

### 8.1. Ranking Score System — Backend Assessment

**Backend logic SOLID (8/10):**

| Rule | Implementation | Assessment |
|------|---------------|------------|
| First attempt = full score | `rankingDelta = exerciseScore` | ✅ Fair — reward first effort |
| Improved retake = delta only | `rankingDelta = score - previousBest` | ✅ Anti-farm — can't double-dip |
| Low retake = small cap | `retakeRanking = min(5, score × 0.05)` | ✅ Prevents spam farming |
| Daily retake limit | `MAX_RETAKE_PER_DAY = 5` | ✅ Anti-abuse |
| Daily bonus (2/3/5/8 bài) | Table-based with cap | ✅ Encourages volume |
| Check-in = +2 ranking | `CHECKIN_REWARD.rankingScore = 2` | ✅ Daily engagement hook |
| XP ≠ Ranking Score | Separate calculations | ✅ Core design principle đúng |

**Tại sao tách XP và Ranking Score là đúng cho production:**
- XP tích lũy mãi → user cũ luôn dẫn đầu → user mới nản
- Ranking Score reset theo kỳ (tuần/tháng) → sân chơi công bằng mỗi kỳ
- User mới vẫn có thể cạnh tranh top 10 tuần

### 8.2. Ranking Score — UI/UX Gaps (Production View)

#### 🔴 Vấn đề nghiêm trọng cho production

| # | Vấn đề | Vị trí | Impact | Giải pháp |
|---|--------|--------|--------|----------|
| 1 | **Leaderboard page thiếu visual hierarchy** | `/leaderboard` | Top 3 trông giống hệt #4-20. Không có podium, crown, hay spotlight | Thêm **top 3 podium** với avatar lớn + crown/huy chương vàng/bạc/đồng |
| 2 | **"Tất thời gian" label sai** | Leaderboard tab | Text "Tất thời gian" không grammatical → "Mọi thời đại" hoặc "Toàn thời gian" | Fix text |
| 3 | **Không thấy Ranking Score khi làm bài xong** | ExerciseSummary | Summary hiện XP + streak + badges nhưng **KHÔNG hiện +X điểm hạng** | Thêm card "🏆 Điểm hạng: +X" trong summary |
| 4 | **Không có notification khi vào/ra top 10** | Backend + UI | User không biết mình đang cạnh tranh → mất motivation | QuestCompleteBanner khi rank thay đổi |
| 5 | **WeeklyChallenge leaderboard ≠ Main leaderboard** | 2 trang riêng | WeeklyChallengeCard có mini leaderboard, nhưng `/leaderboard` là bảng khác → confusion | Hợp nhất: link "Xem đầy đủ" từ widget → leaderboard page |
| 6 | **Không có rank badge trên user profile** | Navbar/Dashboard | User không biết mình rank gì (Đồng/Bạc/Vàng) | Thêm rank tier visual vào avatar |
| 7 | **Leaderboard chỉ top 20** | API `limit=20` | User rank 25 không thấy mình → cảm thấy invisible | Thêm "Vị trí của bạn: #X" card cố định ở dưới |

#### 🟡 Vấn đề medium priority

| # | Vấn đề | Giải pháp |
|---|--------|----------|
| 8 | **Không có "ranking history" graph** | Thêm sparkline chart hiện rank 7 ngày gần nhất (như GitHub contribution) |
| 9 | **Leaderboard không có relative comparison** | "Bạn kém top 1: 45 điểm" hoặc "Bạn hơn người kế tiếp: 12 điểm" → tạo urgency |
| 10 | **Không có "last updated" timestamp** | User không biết data real-time hay stale |
| 11 | **Badge "Top 10 tuần" khó đạt** | Chỉ 1 ranking badge, target top 10 → hầu hết user không bao giờ đạt → nản |

### 8.3. Ranking Tier System — Thiếu cho Production

**Hiện tại:** Chỉ có 1 thứ hạng duy nhất (#1, #2, #3...) — không có **tier/rank name**.

**Production cần Rank Tiers (như game ELO):**

| Tier | Icon | Condition | Color | Effect |
|------|------|-----------|-------|--------|
| Đồng (Bronze) | 🥉 | Top 50% | `bg-amber-700` | — |
| Bạc (Silver) | 🥈 | Top 25% | `bg-neutral-400` | — |
| Vàng (Gold) | 🥇 | Top 10% | `bg-yellow-500` | Badge tự động |
| Kim Cương (Diamond) | 💎 | Top 3% | `bg-purple-500` | Avatar frame + badge |
| Huyền Thoại | 🏆 | #1 tuần | `bg-gradient` | Crown + special effects |

**Tại sao cần cho production:**
- **Tier tạo identity** — "Tôi là Gold player" > "Tôi rank #17"
- **Tier mất ít hơn rank** — Drop từ #9 → #11 cảm thấy tệ hơn Silver → Bronze
- **Tier visible trên avatar** — social proof, flex với bạn bè
- **Tier rewards** — mỗi tier unlock perks (avatar frame, badge, shop discount)

### 8.4. Social/Competitive Features — Thiếu cho Production

**Hiện tại có:**
- ✅ Global leaderboard (tuần/tháng)
- ✅ Weekly Challenge mini-leaderboard
- ✅ AchievementShare component (tồn tại nhưng không wired)

**Production cần thêm:**

| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| **Friend leaderboard** — chỉ xem ranking bạn bè | HIGH | Relatedness + healthy competition | MEDIUM |
| **Rank tier visual trên avatar** | HIGH | Identity + social proof | LOW |
| **Season end rewards** — top tier nhận badge/perks cuối kỳ | HIGH | Long-term motivation | MEDIUM |
| **"You moved up!" notification** | HIGH | Awareness of competition | LOW |
| **AchievementShare wiring** — share badges/rank lên social | MEDIUM | Relatedness + viral growth | LOW (component đã có) |
| **1v1 challenge** — thách đấu bạn bè bài cụ thể | MEDIUM | Direct competition | HIGH |
| **Ghost race** — so sánh score vs top player (anonymous) | LOW | Motivation without pressure | MEDIUM |
| **Team/group leaderboard** | LOW | Community building | HIGH |

### 8.5. Daily Engagement Loop — Production Assessment

**Vòng lặp engagement hiện tại:**

```
Login → Dashboard → Check-in → Learning Map → Exercise → Summary → Rewards
   ↑                                                              |
   └──────────────────── Next day (streak motivation) ─────────────┘
```

**Production gaps trong loop:**

| Gap | Vị trí | Vấn đề | Giải pháp |
|-----|--------|--------|----------|
| **No "come back" hook** | Dashboard → Exit | User rời app không có lý do quay lại trong ngày | Push notification: "Bạn còn 2 daily quests chưa hoàn thành" |
| **No "social pull"** | Anywhere | Không có notification khi bạn bè vượt rank | "🔥 Minh vừa vượt bạn trên bảng xếp hạng tuần!" |
| **No "loss aversion"** | Streak | Streak chỉ reset khi bỏ check-in, nhưng user không được cảnh báo trước | "⚠️ Chuỗi 7 ngày của bạn sẽ mất vào nửa đêm nếu không luyện hôm nay" |
| **No "weekly climax"** | Weekend | Tuần kết thúc lặng lẽ, không có ceremony | Sunday 8PM: "🏆 Kết thúc tuần! Rank của bạn: #X → nhận badge Vàng" |
| **No "new content" signal** | Learning Map | User không biết khi có bài mới | Badge "MỚI" trên exercise mới + "5 bài mới tuần này" |

### 8.6. Gems Economy — Production Assessment

**Hiện tại:**
- ✅ Gems earn: +5 per EXCELLENT exercise
- ✅ Shop items exist: IPA Reveal (50), Slow Audio (20), Streak Freeze (10)
- ⚠️ **Gem earning rate quá chậm** — 5 gems/excellent, cần 10 lần perfect mới mua được Slow Audio
- ⚠️ **Chỉ 3 shop items** — không đủ variety để giữ interest
- ⚠️ **DailyRewardsPopup dùng "xu" ≠ gems** — confusion: xu là gì? gems là gì?

**Production cần:**

| Fix | Chi tiết |
|-----|----------|
| **Thống nhất "xu" → gems** | DailyRewardsPopup rewards nên dùng gems, không dùng "xu" riêng |
| **Thêm earning sources** | Check-in: +2 gems, Quest complete: +10 gems, Streak 7 ngày: +20 gems |
| **Mở rộng shop** | 10+ items: avatar frames, themes, streak freezes, XP boosts, exclusive badges |
| **Gem balance display** | Navbar hiện 💎 125, click → shop modal (đã có GemsDisplay nhưng chưa prominent) |
| **Purchase confirmation** | Shop modal cần confirm dialog + undo option |

### 8.7. Content Depth — Production Assessment

**Hiện tại:**
- 4 dạng bài: Listen (MC), Speak (word), Minimal Pairs, Choose Assimilation
- Exercises tổ chức theo Topic → Sound Group → Type
- IPA 44 âm vị

**Production gaps:**

| Gap | Vấn đề | Giải pháp |
|-----|--------|----------|
| **No phonetic explanation on error** | User sai /ʃ/ vs /s/ nhưng không hiểu tại sao | "Bạn phát âm **/ʃ/** thành /s/. Hãy chu môi và cong lưỡi lên..." |
| **No IPA reference integrated** | Exercise có IPA nhưng không giải nghĩa | Click IPA symbol → popup: mouth diagram + audio + description |
| **No spaced repetition** | User làm bài 1 lần rồi quên | "Hôm nay ôn lại: /θ/, /ð/, /ʒ/" (based on error history) |
| **No difficulty levels** | Tất cả bài cùng difficulty trong 1 map | Exercise nên có Easy/Medium/Hard variant |
| **No "skill breakdown" dashboard** | User không biết mình yếu âm nào | Radar chart: Vowels 80%, Fricatives 45%, Plosives 70%... |
| **Limited exercise variety** | 4 types → repetitive sau 2 tuần | Thêm: Tongue twister, Sentence stress, Intonation patterns |

### 8.8. Revised Engagement Score (Production View)

| Yếu tố | MVP Score | Production Score | Gap |
|--------|-----------|-----------------|-----|
| Visual Appeal | 8/10 | 7/10 | Leaderboard thiếu visual hierarchy |
| Reward Variety | 8/10 | 6/10 | Gems economy shallow, shop limited |
| Feedback Quality | 7/10 | 5/10 | No phonetic explanation, no skill breakdown |
| Challenge Balance | 7/10 | 5/10 | No adaptive difficulty |
| **Ranking & Competition** | **6/10** | **4/10** | **No tiers, no social, no season rewards** |
| Social Connection | 3/10 | 2/10 | AchievementShare unwired, no friends |
| Learning Integration | 5/10 | 3/10 | No IPA reference, no spaced repetition |
| Long-term Retention | 4/10 | 3/10 | No content updates signal, no loss aversion |
| **OVERALL (Production)** | **6.3/10** | **4.4/10** | **Cần đầu tư ranking, social, pedagogy** |

### 8.9. Top 10 Priorities cho Production (Xếp theo Impact)

| # | Priority | Feature | Impact | Effort |
|---|----------|---------|--------|--------|
| 1 | 🔴 CRITICAL | **Show Ranking Score trong Exercise Summary** | User biết mình cạnh tranh → engagement++ | LOW |
| 2 | 🔴 CRITICAL | **Rank Tier system (Bronze→Diamond) + visual on avatar** | Identity + social proof + aspiration | MEDIUM |
| 3 | 🔴 CRITICAL | **Thống nhất currency: XP + Gems (bỏ "xu")** | Clarity → trust → engagement | LOW |
| 4 | 🟠 HIGH | **Leaderboard visual upgrade: top 3 podium + user position card** | Make competition visible & exciting | MEDIUM |
| 5 | 🟠 HIGH | **"Bạn vừa bị vượt" + "Season kết thúc" notifications** | Loss aversion + climax moments | MEDIUM |
| 6 | 🟠 HIGH | **Onboarding tour cho user mới** | Retention D1→D7 | MEDIUM |
| 7 | 🟡 MEDIUM | **Phonetic explanation khi sai** | Competence + intrinsic motivation | HIGH |
| 8 | 🟡 MEDIUM | **Expanded Gems shop (10+ items)** | Meaningful reward sink | MEDIUM |
| 9 | 🟡 MEDIUM | **Friend leaderboard** | Relatedness + healthy competition | HIGH |
| 10 | 🟢 LOW | **Skill breakdown radar chart** | Self-awareness + targeted practice | HIGH |

---

## PHẦN 9: Kết Luận Bổ Sung (Production View)

### Trả lời câu hỏi: "Dự án thật cần gì ngoài MVP?"

**Khoảng cách MVP → Production:**

```
MVP (hiện tại)              Production (cần)
─────────────────           ─────────────────
Ranking Score ẩn            → Ranking hiển thị + tier visual
Leaderboard flat list       → Podium + animation + notifications
Gems economy shallow        → 10+ shop items + multiple earning sources
No social features          → Friend leaderboard + achievement sharing
No pedagogical depth        → Phonetic explanations + IPA reference
Exercises repetitive        → Difficulty levels + spaced repetition
No onboarding               → Guided tour + progressive disclosure
No season ceremony          → Weekly/monthly climax + rewards
```

### Bottom Line cho Production

**Điểm mạnh giữ lại:**
1. Ranking Score tách XP (backend logic đúng)
2. Anti-farm rules (retake cap, delta-only, daily limit)
3. 11 badges với 5 categories
4. Streak system với freeze mechanic
5. Daily quests + weekly challenges
6. Exercise feedback 3 tầng
7. Accessibility compliance

**Điểm yếu phải fix cho production:**
1. Ranking Score **vô hình** trong exercise flow → phải hiện
2. Leaderboard **phẳng** → cần tier + podium + drama
3. Economy **nông** → cần nhiều shop items + earning sources
4. **Không có social** → cần friend list + sharing
5. **Không giải thích lỗi** → cần phonetic knowledge integration
