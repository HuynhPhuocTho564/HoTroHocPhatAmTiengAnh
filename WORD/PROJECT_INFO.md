# THÔNG TIN TỔNG QUAN DỰ ÁN - DATA THỰC TẾ

> **Mục đích:** Tổng hợp thông tin thực tế từ source code để AI khác đọc và viết Word

---

## 1. THÔNG TIN CƠ BẢN

**Tên đề tài:** Xây dựng hệ thống hỗ trợ học ngữ âm tiếng Anh tích hợp Gamification

**Thời gian thực hiện:** 20/04/2026 - 28/06/2026 (10 tuần)

**Trạng thái hiện tại (19/06/2026):**
- Tuần 7 đang thực hiện
- Còn ~9 ngày đến deadline
- Tiến độ tổng thể: ~60% hoàn thành

---

## 2. TECH STACK THỰC TẾ (từ package.json và source code)

### Frontend
- **Framework:** Next.js 16.2.7 (App Router, Turbopack)
- **UI Library:** React 18.3.1
- **Language:** TypeScript 6.0.3
- **Styling:** Tailwind CSS v4 (sử dụng @theme trong globals.css, không có tailwind.config)
- **ORM:** Prisma 6.19.3 + @prisma/client 6.19.3
- **Auth:** next-auth v5.0.0-beta.31 (NextAuth.js)
- **Audio:** wavesurfer.js 7.12.7
- **Animation:** canvas-confetti 1.9.4
- **Speech:** Web Speech API (browser-native, không có backend ASR)
- **Test:** tsx --test (Node.js built-in test runner)

### Backend
- **API Framework:** Next.js API Routes (primary) + Python FastAPI (minimal)
- **FastAPI Version:** 0.136.3
- **Database:** PostgreSQL (database name: `english_app`)
- **Python Backend:** Chỉ có 2 endpoints: `/` và `/health`, không có model scoring/Whisper

### Database
- **DBMS:** PostgreSQL
- **ORM:** Prisma
- **Số bảng:** 26 bảng
- **Migrations:** Managed by Prisma

---

## 3. CẤU TRÚC DỰ ÁN

```
english_pronunciation_app/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Auth pages (login, register)
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── learning_map/   # 30 nhóm, 112 bài
│   │   │   ├── exercises/[id]/ # Exercise engine
│   │   │   ├── ipa/            # IPA chart
│   │   │   ├── profile/        # Profile & achievements
│   │   │   ├── badges/         # Badges page
│   │   │   ├── leaderboard/    # Leaderboard
│   │   │   ├── checkin/        # Daily check-in
│   │   │   ├── admin/          # Admin CRUD
│   │   │   └── api/            # API Routes (backend logic)
│   │   ├── components/         # React components
│   │   ├── lib/                # Utility libraries
│   │   └── hooks/              # Custom hooks
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed_lessons.ts     # Seed script
│   │   ├── lesson-catalog.ts   # 30 nhóm, 112 bài catalog
│   │   └── lesson-content.ts   # Content thực tế (12/30 nhóm)
│   ├── public/
│   │   └── audio/              # Audio files local (93 files)
│   ├── package.json
│   └── .env
├── backend/                     # Python FastAPI (minimal)
│   ├── app/
│   │   ├── main.py             # Chỉ có / và /health
│   │   ├── core/
│   │   └── api/
│   ├── requirements.txt
│   └── .env
└── .agents/                     # AI Skills
    └── skills/                  # 10+ skills
```

---

## 4. DATABASE SCHEMA (26 bảng)

### Nhóm User & Auth (3 bảng)
- `User` (id, email, username, password, role, xp, level, streakCount, ...)
- `Account` (OAuth accounts, liên kết với User)
- `Session` (NextAuth sessions)

### Nhóm Content (7 bảng)
- `Topic` (4 chủ đề: Nguyên âm, Phụ âm, Minimal Pairs, Trọng âm & Nối âm)
- `SoundGroup` (30 nhóm âm)
- `Phoneme` (44 âm vị IPA)
- `QuestionBankItem` (kho câu hỏi)
- `WordItem` (từ vựng IPA)
- `MinimalPair` (cặp từ minimal)
- `SentenceItem` (câu mẫu)

### Nhóm Learning (4 bảng)
- `LearningMap` (25 maps)
- `Exercise` (112 bài)
- `Question` (câu hỏi trong bài)
- `QuestionOption` (các đáp án)

### Nhóm Progress (4 bảng)
- `UserExerciseAttempt` (lần làm bài)
- `UserQuestionResponse` (câu trả lời chi tiết)
- `UserSoundGroupProgress` (tiến trình nhóm âm)
- `DailyActivity` (hoạt động hàng ngày)

### Nhóm Gamification (4 bảng)
- `Leaderboard` (bảng xếp hạng tuần/tháng)
- `Badge` (định nghĩa huy hiệu - 11 loại)
- `UserBadge` (huy hiệu đã đạt)
- `Level` (định nghĩa level)

### Nhóm Bookmarks (1 bảng)
- `UserExerciseBookmark` (đánh dấu bài yêu thích)

---

## 5. TRẠNG THÁI CONTENT HIỆN TẠI (19/06/2026)

**Catalog v2 đã seed:** 4 topics + 30 sound groups + 44 phonemes + 112 exercises + 25 learning maps

**Content thực tế:**

| Chủ đề | Tổng nhóm | Có content | % |
|--------|-----------|------------|---|
| CĐ1: Nguyên âm | 10 | 10 | 100% ✅ |
| CĐ2: Phụ âm | 12 | 0 | 0% 🔴 |
| CĐ3: Minimal Pairs Khó | 4 | 2 | 50% 🟠 |
| CĐ4: Trọng âm & Nối âm | 4 | 0 | 0% 🔴 |
| **TỔNG** | **30** | **12** | **40%** |

**Nguồn dữ liệu:**
- Audio từ: Free Dictionary API (mp3, lưu local trong `public/audio/`)
- IPA phonemes: CMU Pronouncing Dictionary
- Minimal pairs & sentences: Tự biên soạn (tham khảo Ship or Sheep - Baker, không copy)
- License: CC-BY-SA 3.0 (audio từ Wiktimedia)

---

## 6. CẤU TRÚC BÀI HỌC IPA (30 nhóm, 112 bài)

### Chủ đề 1: Nguyên âm (10 nhóm × 4 modes = 40 bài)
- **Nguyên âm đơn:** 6 nhóm (24 bài)
  - /iː/ & /ɪ/, /e/ & /æ/, /ɑː/ & /ʌ/ & /ə/, /ɒ/ & /ɔː/, /ʊ/ & /uː/, /ɜː/
- **Nguyên âm đôi:** 4 nhóm (16 bài)
  - /eɪ/ & /aɪ/, /ɔɪ/ & /aʊ/, /əʊ/ & /eə/, /ɪə/ & /ʊə/

### Chủ đề 2: Phụ âm (12 nhóm × 4 modes = 48 bài)
- **Plosives:** /p//b/, /t//d/, /k//g/
- **Fricatives:** /f//v/, /θ//ð/, /s//z/, /ʃ//ʒ/, /h/
- **Affricates:** /tʃ//dʒ/
- **Nasals:** /m//n//ŋ/
- **Approximants:** /l//r/, /w//j/

### Chủ đề 3: Minimal Pairs Khó (4 nhóm × 4 modes = 16 bài)
- Front vowel mix, /l/ vs /r/ vs /n/, Final plosives, /θ/ vs /s/ vs /t/

### Chủ đề 4: Trọng âm & Nối âm (4 nhóm × 2 modes = 8 bài)
- Word Stress, Weak Forms, Linking, Assimilation & Elision

---

## 7. 4 CHẾ ĐỘ BÀI TẬP (Exercise Modes)

| Mode | Tên | Mô tả | UI Component |
|------|-----|-------|--------------|
| `listen_choose` | Luyện tai | Nghe audio → Chọn phiên âm IPA đúng | ListenChooseQuestion |
| `speak_word` | Luyện miệng | Đọc từ → Web Speech API nhận dạng | VoiceQuestion (badge xanh, mic đỏ) |
| `speak_minimal_pair` | Thử thách kép | Đọc 2 từ minimal pair → Nhận dạng | MinimalPairsQuestion (light theme vàng) |
| `speak_sentence` | Thực chiến | Đọc câu hoàn chỉnh → Nhận dạng | VoiceQuestion (badge accent, mic accent) |

**Đặc điểm:**
- Listen_choose có 3 stages (Stage 1: 4 options, Stage 2: 6 options, Stage 3: all phonemes)
- Speak modes tự động detect: ≤2 words = "Luyện miệng", >2 words = "Thực chiến"
- Phản hồi real-time: màu xanh (đúng) / màu đỏ (sai), emoji, confetti animation

---

## 8. HỆ THỐNG GAMIFICATION (5 modules)

### 8.1. Experience Points (XP)
- **Công thức:** `XP = (score/100) × 10 + dailyBonus`
- **Daily Bonus Table:**
  - 2 bài/ngày: +2 XP
  - 3 bài/ngày: +5 XP
  - 5 bài/ngày: +10 XP
  - 8+ bài/ngày: +20 XP

### 8.2. Level System
- **Công thức:** `Level = ⌊√(XP / 100)⌋ + 1`
- **Range:** Level 1-100
- **Bug đã biết:** Có 2 hệ level lệch nhau (gamification.ts vs levelSystem.ts) - chưa fix

### 8.3. Streak (Chuỗi ngày học)
- **Quy tắc:**
  - Check-in mỗi ngày: +1 streak
  - Bỏ lỡ >1 ngày: reset về 1
- **Reward:** Check-in = +10 XP + +2 Ranking Score
- **Fields:** `streakCount`, `longestStreak`, `lastCheckInDate`

### 8.4. Badge System (11 loại)
```
first_step: XP >= 10
quick_start: XP >= 50
rising_star: XP >= 100
dedicated_learner: XP >= 500
champion: XP >= 1000
streak_starter: streak >= 3
streak_warrior: streak >= 7
streak_legend: streak >= 30
completionist: completed >= 10
completionist_pro: completed >= 50
completionist_master: completed >= 100
```
- **Auto-award:** Tự động kiểm tra và trao khi submit bài hoặc check-in

### 8.5. Leaderboard
- **Metric:** Ranking Score (KHÔNG dùng XP tổng)
- **Period:** Tuần (`tuan`) / Tháng (`thang`)
- **Thiếu:** All-time leaderboard (chưa implement)

---

## 9. API ENDPOINTS CHÍNH

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/signin` - Đăng nhập
- `GET /api/auth/signout` - Đăng xuất

### Exercises
- `GET /api/exercises` - Danh sách bài tập
- `GET /api/exercises/[id]` - Chi tiết 1 bài
- `POST /api/exercises/submit` - Nộp bài + tính XP/badge

### Gamification
- `POST /api/checkin` - Check-in (+10 XP, +2 ranking)
- `GET /api/leaderboard` - Top 10 tuần/tháng
- `GET /api/badges` - Danh sách badge đã đạt
- `POST /api/badges/check` - Kiểm tra badge mới
- `GET /api/profile` - Thông tin user (XP, level, streak)

### Admin (role=Admin only)
- `GET/POST /api/admin/exercises` - CRUD bài tập
- `GET/POST /api/admin/exercises/[id]/questions` - CRUD câu hỏi
- `GET/POST /api/admin/topics` - CRUD chủ đề
- `GET/POST /api/admin/badges` - CRUD badge config

---

## 10. KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────┐
│    Presentation Layer (Browser)         │
│  Next.js Frontend - React Components    │
│  - TypeScript, Tailwind CSS v4          │
│  - Web Speech API (client-side)         │
└─────────────────┬───────────────────────┘
                  │ HTTP/HTTPS (REST API)
┌─────────────────▼───────────────────────┐
│       Application Layer (Server)        │
│  Next.js API Routes (primary)           │
│  + Python FastAPI (minimal /health)     │
│  - Authentication (NextAuth.js)         │
│  - Business Logic (Gamification)        │
│  - Scoring Engine (frontend/src/lib)    │
└─────────────────┬───────────────────────┘
                  │ Prisma ORM
┌─────────────────▼───────────────────────┐
│          Data Layer                     │
│      PostgreSQL Database                │
│  - 26 tables                            │
│  - User, Content, Progress, Gamification│
└─────────────────────────────────────────┘
```

**Đặc điểm:**
- **Scoring logic nằm ở frontend:** `frontend/src/lib/scoring.ts`
- **Gamification logic nằm ở frontend:** `frontend/src/lib/gamification.ts`
- **Backend Python:** Chỉ có 2 endpoints minimal (dành cho mở rộng sau)
- **1 database duy nhất:** Prisma (frontend) là chủ, backend không có SQLAlchemy models

---

## 11. TESTING & QU ALITY ASSURANCE

### Test Framework
- **Runner:** `tsx --test` (Node.js built-in)
- **Assertion:** `node:assert/strict`
- **Pattern:** `src/**/*.test.ts`

### Test Coverage
- **Current:** 55 test files (tăng từ 17)
- **Tests passing:** ~80% coverage
- **Key test files:**
  - `scoring.test.ts` - Thuật toán chấm điểm
  - `gamification.test.ts` - XP, level, badge logic
  - `lesson-content.test.ts` - Validate content ≥10 nhóm
  - `listen-choose-builder.test.ts` - Generate câu hỏi

### Quality Gate
```bash
npx prisma validate         # Schema OK
npx tsc --noEmit           # Type check pass
npm test                    # All tests pass
npm run build               # Next.js build OK
```

---

## 12. ROADMAP & TIẾN ĐỘ (6 Sub-Projects)

| SP | Tên | Trạng thái | % |
|----|-----|------------|---|
| SP1 | Cleanup & Planning | ✅ Done | 100% |
| SP2 | Data Layer v2 (schema + catalog) | ✅ Done | 100% |
| SP3 | Content (30 nhóm, content thực) | 🟠 In Progress | 40% |
| SP4 | Exercise Engine v2 | 🟠 In Progress | 70% |
| SP5 | Admin CRUD | ⏸ Paused | 40% |
| SP6 | Gamification完全 | ⏸ Paused | 76% |

**Cổ phần còn lại (~40%, 9 ngày):**
- 🔴 SP3: Content CD2 (12 nhóm phụ âm) + CD4 (4 nhóm) - NECK LỚN NHẤT
- 🔴 SP4: 4 UI CĐ4 + Mode B multi-answer
- 🟠 SP6: Unlock CĐ3 gating + fix level 2 hệ + all-time leaderboard
- 🟡 SP5: Admin 6 model kho + users + badges-config

---

## 13. TÀI LIỆU THAM KHẢO THỰC TẾ

### Docs đã đọc/sử dụng:
1. Next.js Documentation (App Router): https://nextjs.org/docs
2. React Documentation: https://react.dev/
3. Tailwind CSS Documentation: https://tailwindcss.com/docs
4. PostgreSQL 18.3 Documentation: https://www.postgresql.org/docs/current/
5. M. Sailer et al., "How gamification motivates..." (Computers in Human Behavior, 2017)

### Phương pháp IPA (tham khảo, không copy):
- Ship or Sheep? (Ann Baker) - Minimal pairs method
- English Pronunciation in Use (Mark Hancock)

### API & Libraries:
- Web Speech API: MDN Web Docs
- Prisma ORM: https://www.prisma.io/docs
- NextAuth.js v5: https://authjs.dev/

---

## 14. CHI TIẾT CÁC CHỨC NĂNG THỰC TẾ

### A. Các màn hình chính (Pages)

#### 1. Landing Page (`/`)
**Mục đích:** Giới thiệu hệ thống, thu hút người dùng đăng ký

**Nội dung:**
- Hero section: "Chinh phục phát âm tiếng Anh chuẩn"
- Số liệu nổi bật: 44 âm IPA, AI chấm điểm, 100% miễn phí
- 3 tính năng chính:
  - Ghi âm & phân tích (Web Speech API)
  - Theo dõi tiến độ (XP, level, streak)
  - Gamification (badge, leaderboard)
- CTA buttons: "Bắt đầu miễn phí", "Xem bảng IPA"
- Gradient background với animation

**File:** `src/app/page.tsx`

#### 2. Dashboard (`/dashboard`)
**Mục đích:** Trang chủ sau khi đăng nhập, tổng quan tiến trình cá nhân

**Layout:** 2 columns (Main + Sidebar)

**Main content:**
- **Welcome message:** "Xin chào, [username]"
- **Stats cards:** 
  - Chuỗi học (streak days)
  - Cấp độ (level)
  - Bài đã đạt (completed/total)
- **XP Progress bar:**
  - Hiển thị XP hiện tại
  - Progress % đến level tiếp theo
  - Số XP còn thiếu
- **Continue learning card:**
  - Bài làm gần nhất (nếu có)
  - Điểm best score
  - Button "Vào bài tập" hoặc "Chọn bài học"
- **Recent attempts:**
  - 4 bài làm gần nhất
  - Hiển thị: tên bài, ngày làm, điểm, status

**Sidebar:**
- Avatar + username + level
- Quick links: Check-in, Leaderboard, Badges
- Daily check-in widget (inline)
- 4 huy hiệu mới nhất

**File:** `src/app/dashboard/page.tsx`

#### 3. Learning Map (`/learning_map`)
**Mục đích:** Hiển thị 30 nhóm âm, 112 bài tập theo cấu trúc

**Cấu trúc:**
- **4 Topics** (Accordion expandable):
  1. Chủ đề 1: Nguyên âm (10 nhóm)
  2. Chủ đề 2: Phụ âm (12 nhóm)
  3. Chủ đề 3: Minimal Pairs Khó (4 nhóm)
  4. Chủ đề 4: Trọng âm & Nối âm (4 nhóm)

- **Mỗi Sound Group card hiển thị:**
  - Icon/emoji theo category
  - Tên nhóm + số bài (x/4 modes)
  - Progress bar theo best score (≥70 = đạt)
  - Status badge: ACTIVE (xanh), DRAFT (vàng), LOCKED (xám)
  - Badge "ĐÃ ĐẠT" nếu completed

- **Click vào card:** Expand để xem 4 bài con (4 modes)
- **Click vào bài:** Navigate đến `/exercises/[id]`

**Tính năng:**
- Sort by topic > sound group orderIndex
- Filter by status (ACTIVE only)
- Responsive grid layout

**Files:** 
- `src/app/learning_map/page.tsx` (Server Component)
- `src/app/learning_map/LearningMapClient.tsx` (Client Component)

#### 4. Exercise Engine (`/exercises/[id]`)
**Mục đích:** Làm bài tập với 4 modes khác nhau

**Layout:**
- **Header (sticky):**
  - Back button (X)
  - Progress bar (câu x/total)
  - Score hiện tại
- **Main:** Exercise content (khác nhau theo mode)
- **Footer (conditional):** Feedback bar khi đã trả lời

**4 Modes:**

**Mode 1: Listen & Choose** (`listen_choose`)
- Nghe audio từ
- Hiển thị từ (không hiển thị IPA - đã ẩn theo yêu cầu user)
- Chọn 1 trong 4-6 phiên âm IPA đúng
- Button "Phát lại audio"
- **3 Stages:** 
  - Stage 1: 4 options
  - Stage 2: 6 options
  - Stage 3: All phonemes
- Feedback: màu xanh (đúng) / đỏ (sai), hiển thị đáp án đúng

**Mode 2: Speak Word** (`speak_word`)
- Hiển thị từ + IPA
- Button nghe mẫu (audio)
- Button mic đỏ tròn to "Nhấn để ghi âm"
- Ghi âm 5 giây → Web Speech API nhận dạng
- So sánh transcript với answer
- Feedback:
  - Đúng: emoji 🎉, confetti animation, "Xuất sắc!"
  - Sai: emoji 😐, hiển thị "Bạn nói: [transcript]", "Đáp án: [answer]"
  - Buttons: "Thử lại" / "Bỏ qua"
- **Light theme:** Badge xanh "Luyện miệng", mic đỏ

**Mode 3: Minimal Pairs** (`speak_minimal_pair`)
- 2 từ minimal pair (VD: "ship" vs "sheep")
- Mỗi từ có: tên, IPA, button nghe mẫu, button ghi âm
- Phải đọc CẢ 2 từ
- Button "Kiểm tra kết quả" khi đã ghi 2 âm
- Feedback: đúng cả 2 = success, sai 1 trong 2 = incorrect
- **Light theme:** Badge vàng "Thử thách kép", gradient warning

**Mode 4: Speak Sentence** (`speak_sentence`)
- Hiển thị câu hoàn chỉnh (>2 từ)
- Button "Nghe mẫu câu" (speechSynthesis)
- Button mic màu accent "Nhấn để ghi âm"
- Ghi âm 8 giây (dài hơn word mode)
- Logic tương tự speak_word
- **Light theme:** Badge accent "Thực chiến"

**Summary Screen (sau khi làm xong):**
- 3-tier design: OK / ! / ✓
- Điểm: correct/total câu - %
- Progress bar màu theo % (success/warning)
- Submit status: đang lưu / thành công / lỗi
- Rewards nếu thành công:
  - XP earned (+số)
  - Ranking delta (+số)
  - Level hiện tại
  - Daily bonus (nếu có)
- Danh sách câu sai (nếu có):
  - Từ/câu
  - "Bạn trả lời: [...]"
  - "Đáp án đúng: [...]"
- Button "Quay về lộ trình"

**Files:**
- `src/app/exercises/[id]/page.tsx` (Server Component - fetch data)
- `src/app/exercises/[id]/ExerciseEngineClient.tsx` (~1100 lines - main engine)
- `src/app/exercises/[id]/ListenFeedbackSheet.tsx` (feedback sheet)
- `src/app/exercises/[id]/ExerciseSummaryScreen.tsx` (summary screen)

#### 5. IPA Chart (`/practice`)
**Mục đích:** Bảng IPA tương tác 44 âm

**Nội dung:**
- Header: "Luyện Tập Phát Âm" + subtitle
- IPAChart component:
  - Grid layout (responsive)
  - 44 âm vị IPA
  - Click vào âm → nghe mẫu (audio)
  - Phân nhóm: Nguyên âm đơn, Nguyên âm đôi, Phụ âm
  - Màu sắc khác nhau theo nhóm

**File:** `src/app/practice/page.tsx`

#### 6. Check-in (`/checkin`)
**Mục đích:** Điểm danh hàng ngày, xem streak

**Nội dung:**
- Current streak count (số ngày liên tiếp)
- Longest streak (kỷ lục)
- Total check-ins (tổng số lần)
- Weekly calendar (7 ô):
  - Đã check: màu xanh
  - Hôm nay: viền đậm
  - Chưa đến: màu xám
- Button "Điểm danh hôm nay"
- Reward: +10 XP, +2 Ranking Score
- Live region message: "Điểm danh thành công!" hoặc "Đã điểm danh rồi"

**File:** `src/app/checkin/page.tsx`

#### 7. Badges (`/badges`)
**Mục đích:** Xem tất cả huy hiệu (đã đạt + chưa đạt)

**Layout:**
- Header: "Huy Hiệu Của Bạn"
- Stats: X/11 huy hiệu đã mở khóa
- Grid layout (2-3 columns):
  - **Earned badges:** Màu sắc đầy đủ, ngày đạt được
  - **Locked badges:** Grayscale, hiển thị tiêu chí mở khóa
- Badge info:
  - Icon/emoji
  - Tên huy hiệu
  - Mô tả (criteria)
  - Progress bar (nếu chưa đạt)

**11 loại badge:**
1. first_step (XP ≥ 10)
2. quick_start (XP ≥ 50)
3. rising_star (XP ≥ 100)
4. dedicated_learner (XP ≥ 500)
5. champion (XP ≥ 1000)
6. streak_starter (streak ≥ 3)
7. streak_warrior (streak ≥ 7)
8. streak_legend (streak ≥ 30)
9. completionist (completed ≥ 10)
10. completionist_pro (completed ≥ 50)
11. completionist_master (completed ≥ 100)

**File:** `src/app/badges/page.tsx`

#### 8. Leaderboard (`/leaderboard`)
**Mục đích:** Bảng xếp hạng tuần/tháng theo Ranking Score

**Layout:**
- Tab selector: "Tuần này" / "Tháng này"
- Current user highlight (viền màu)
- Top 10 table:
  - Rank (#1, #2, ...)
  - Avatar
  - Username
  - Ranking Score
  - Level
- Scroll to user position (nếu không trong top 10)

**Lưu ý:**
- KHÔNG dùng XP total làm ranking
- Dùng Ranking Score (tăng khi submit bài, check-in)
- Update real-time (upsert mỗi lần submit)

**File:** `src/app/leaderboard/page.tsx`

#### 9. Admin Panel (`/admin`)
**Mục đích:** Quản lý hệ thống (role=Admin only)

**Tabs:**
1. **Tổng quan:**
   - Stats cards: Users, Active Users, Exercises, Audio Files, Completed Attempts, Avg Score 7d
   
2. **Quản lý người dùng:**
   - Table: Username, Email, Role, Level, XP, Streak, Created Date
   - Actions: View, Edit Role, Ban/Unban
   
3. **Quản lý bài tập:**
   - List exercises với filter (status, topic, mode)
   - CRUD: Create, Edit metadata, Delete (soft delete = ARCHIVED)
   - Manage questions trong từng exercise:
     - Add question + options
     - Edit question content/answer
     - Delete question (soft delete)
   
4. **Quản lý chủ đề:**
   - CRUD Topics, Levels, Learning Maps
   - Reorder items
   
5. **Quản lý âm thanh:**
   - List audio files (local + API)
   - Upload/Delete
   - View usage count
   
6. **Báo cáo & Phân tích:**
   - Charts: User growth, Exercise completion rate, Avg score by topic
   - Export CSV

**File:** `src/app/admin/page.tsx`

#### 10. Auth Pages
- **Login** (`/login`): Username/password + Google OAuth
- **Register** (`/register`): Username, email, password, confirm password
- **Forgot Password** (`/forgot-password`): Email input (placeholder)
- **Reset Password** (`/reset-password`): New password input (placeholder)

**Files:** `src/app/login/`, `src/app/register/`, etc.

---

### B. Component Architecture

**UI Components** (`src/components/ui/`):
- Button (6 variants: primary, secondary, success, error, warning, info)
- Card (với padding options)
- Badge (6 variants, 3 sizes)
- ProgressBar (màu sắc theo value)
- Input, Select, Textarea (form controls)

**Layout Components** (`src/components/layout/`):
- Navbar (server + client split)
  - Logo
  - Nav links (Dashboard, Learning Map, Practice)
  - User menu (Avatar → Profile/Logout) hoặc Login/Register
  - Admin link (nếu role=Admin)
- Footer (Copyright + links)
- SignOutButton (client component)

**Feature Components** (`src/components/*/`):
- `gamification/DailyCheckIn` - Widget check-in
- `ipa/IPAChart` - Bảng 44 âm IPA
- `admin/*` - Admin UI components
- `auth/*` - Auth forms

---

### C. API Routes (`src/app/api/`)

**Auth:**
- `POST /api/auth/register` - Đăng ký tài khoản
- NextAuth routes: `/api/auth/*` (signin, signout, session, providers)

**Exercises:**
- `GET /api/exercises` - List bài tập (filter by status=ACTIVE)
- `GET /api/exercises/[id]` - Chi tiết 1 bài
- `POST /api/exercises/submit` - Nộp bài + tính XP/badge

**Gamification:**
- `POST /api/checkin` - Check-in (+10 XP, +2 ranking, update streak)
- `GET /api/checkin` - Lấy thông tin check-in hiện tại
- `GET /api/leaderboard` - Top 10 theo period (tuần/tháng)
- `GET /api/badges` - Danh sách badge user đã đạt
- `POST /api/badges/check` - Kiểm tra badge mới (manual trigger)

**Admin:**
- `GET/POST /api/admin/exercises` - CRUD exercises
- `GET/PATCH/DELETE /api/admin/exercises/[id]` - CRUD single exercise
- `GET/POST /api/admin/exercises/[id]/questions` - CRUD questions
- `GET/PATCH/DELETE /api/admin/questions/[questionId]` - CRUD single question
- `GET/POST /api/admin/topics` - CRUD topics
- `GET/POST /api/admin/levels` - CRUD levels
- `GET/POST /api/admin/maps` - CRUD learning maps

**Tổng số:** ~20 API routes

---

### D. Custom Hooks (`src/hooks/`)

- `useSpeechRecognition` - Wrapper cho Web Speech API
- `useAudio` - Play audio files
- `useSession` - Get current user session (NextAuth)

---

### E. Utility Libraries (`src/lib/`)

**Core logic:**
- `scoring.ts` - Thuật toán chấm điểm (normalize, levenshtein, calculateScore)
- `gamification.ts` - Logic XP, level, badge, reward (calculateXP, calculateLevelFromXp, checkAndAwardBadges)
- `period.ts` - Helper tính period tuần/tháng cho leaderboard

**Infrastructure:**
- `auth.ts` - NextAuth configuration (Credentials + Google)
- `auth-config.ts` - Auth.js config
- `auth-providers.ts` - Provider configuration
- `prisma.ts` - Prisma client singleton
- `admin-api.ts` - Admin API helpers (requireAdminSession, jsonResponse)

**Tests:**
- `__tests__/scoring.test.ts` (14 tests)
- `__tests__/gamification.test.ts` (12 tests)
- `__tests__/lesson-content.test.ts` (validate content ≥10 groups)
- `__tests__/listen-choose-builder.test.ts` (generate questions)

---

## 15. SỐ LIỆU THỐNG KÊ THỰC TẾ

- **Dòng code TypeScript:** ~15,000+ (frontend)
- **Số components:** ~50+ React components
- **Số API routes:** ~20+ routes
- **Số từ vựng IPA:** ~200 từ (có audio + IPA)
- **Số audio files:** 93 files (tải về local)
- **Test files:** 55 test suites
- **Build time:** ~30-60 giây
- **Dev server start:** ~5-10 giây

---

## 15. DEPLOYMENT & ENVIRONMENT

### Development
```bash
# Frontend
cd frontend
npm install
npm run dev          # Port 3000

# Backend (optional)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # Port 8000
```

### Environment Variables (frontend/.env)
```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

### Database Setup
```bash
npx prisma db push          # Sync schema
npx prisma generate         # Generate client
npm run db:seed:lessons     # Seed 112 bài
```

---

**LƯU Ý:** Đây là DATA THỰC TẾ từ source code, KHÔNG PHẢI nội dung viết sẵn. AI khác cần đọc file này và viết lại bằng văn phong học thuật.
