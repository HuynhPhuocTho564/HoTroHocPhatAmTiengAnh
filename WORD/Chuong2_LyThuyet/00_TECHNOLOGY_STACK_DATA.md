# DATA - Công Nghệ Sử Dụng Trong Dự Án (Chương 2)

Ngày cập nhật: 20/06/2026
Mục đích: Cung cấp DATA thực tế về công nghệ để viết Chương 2 - Nghiên cứu lý thuyết

> ⚠️ **LƯU Ý**: File này chỉ chứa DATA THỰC TẾ từ dự án. AI khác sẽ đọc và viết thành nội dung học thuật.

---

## TÓM TẮT CÔNG NGHỆ THỰC TẾ ĐANG SỬ DỤNG

### **CÂU TRẢ LỜI NGẮN GỌN**:

**KHÔNG** - Dự án KHÔNG dùng JavaScript thuần.
**CÓ** - Dự án dùng **TypeScript** (superset của JavaScript).

**164 files**: 83 files `.tsx` + 81 files `.ts` = **100% TypeScript**

---

## 1. NGÔN NGỮ LẬP TRÌNH

### **Frontend**:
- **TypeScript 6.0.3** - Ngôn ngữ chính (100% code)
- **JSX/TSX syntax** - Viết React components
- **KHÔNG có JavaScript (.js/.jsx)** - Chỉ dùng TypeScript

### **Backend**:
- **Python 3.x** - Cho FastAPI backend
- **TypeScript** - Cho Next.js API Routes (backend chính)

### **Lý do chọn TypeScript thay vì JavaScript**:
1. ✅ Type-safe (bắt lỗi lúc compile, không phải runtime)
2. ✅ Auto-complete tốt hơn (VS Code gợi ý đầy đủ)
3. ✅ Refactor an toàn (TypeScript báo tất cả chỗ bị ảnh hưởng)
4. ✅ Phù hợp dự án lớn (26 bảng database, 164 files)
5. ✅ Tích hợp tốt với Next.js, Prisma, React


---

## 2. FRONTEND FRAMEWORK & LIBRARIES

### **Core Framework**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **Next.js** | 16.2.7 | Full-stack React framework (SSR, API Routes) |
| **React** | 18.3.1 | UI library |
| **React DOM** | 18.3.1 | React renderer cho browser |

### **Lý do chọn Next.js 16**:
- ✅ App Router (routing hiện đại)
- ✅ Server-side rendering (SEO tốt)
- ✅ API Routes (backend trong 1 repo)
- ✅ Turbopack (build nhanh hơn Webpack)
- ✅ Image optimization tự động
- ✅ TypeScript built-in

---

## 3. STYLING & UI

### **CSS Framework**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **Tailwind CSS** | 4.3.0 | Utility-first CSS framework |
| **PostCSS** | 8.5.15 | CSS processor |
| **Autoprefixer** | 10.5.0 | Tự động thêm vendor prefixes |

### **Cú pháp Tailwind v4**:
```css
/* globals.css - Sử dụng @theme thay vì tailwind.config.js */
@theme {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
}
```

### **Lý do chọn Tailwind CSS v4**:
- ✅ Không cần config file (dùng `@theme` trong CSS)
- ✅ Utility classes (rapid development)
- ✅ Tree-shaking tự động (chỉ ship CSS dùng thật)
- ✅ Responsive design dễ (`sm:`, `md:`, `lg:`)
- ✅ Dark mode support


---

## 4. DATABASE & ORM

### **Database**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **PostgreSQL** | (production) | Relational database chính |
| **Prisma ORM** | 6.19.3 | ORM tool (TypeScript ↔ PostgreSQL) |
| **@prisma/client** | 6.19.3 | Generated client cho query |

### **Database thực tế**:
- **Tên database**: `english_app`
- **Số bảng**: 26 tables
- **Connection**: `DATABASE_URL` trong `.env`

### **26 Tables**:
1. **User & Auth**: User, Role, Session, VerificationToken, Authenticator (5)
2. **Content**: Topic, Level, LearningMap, Exercise, Question, QuestionType, AnswerOption (7)
3. **Question Bank**: Phoneme, SoundGroup, SoundGroupPhoneme, WordItem, MinimalPair, SentenceItem, QuestionBankItem (7)
4. **Progress**: Progress, ExerciseAttempt, QuestionAttempt (3)
5. **Gamification**: Badge, UserBadge, Leaderboard, DailyActivity, DailyQuest (5)

### **Lý do chọn PostgreSQL**:
- ✅ Relational database mạnh (ACID transactions)
- ✅ JSON support (lưu IPA data phức tạp)
- ✅ Full-text search (tìm kiếm exercises)
- ✅ Mature, stable (production-ready)
- ✅ Free & open-source

### **Lý do chọn Prisma ORM**:
- ✅ Type-safe 100% (TypeScript biết structure tất cả bảng)
- ✅ Auto-generate types từ schema
- ✅ Migration tự động (`prisma migrate dev`)
- ✅ Prisma Studio GUI (quản lý data dễ)
- ✅ Relations dễ dàng (không cần viết JOIN)


---

## 5. BACKEND API

### **Kiến trúc Backend (Hybrid)**:

```
┌─────────────────────────────────────────┐
│  Next.js API Routes (TypeScript)        │ ← BACKEND CHÍNH
│  - /api/exercises/submit                │   (95% logic)
│  - /api/checkin                         │
│  - /api/badges                          │
│  - /api/leaderboard                     │
│  - /api/admin/*                         │
└─────────────────────────────────────────┘
              ↓ kết nối
┌─────────────────────────────────────────┐
│  PostgreSQL Database                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Python FastAPI (minimal)               │ ← BACKEND PHỤ
│  - GET /                                │   (5% - health check)
│  - GET /health                          │
└─────────────────────────────────────────┘
```

### **Next.js API Routes** (Backend chính):
| File | Chức năng |
|------|-----------|
| `/api/exercises/submit/route.ts` | Submit bài tập, tính điểm, cập nhật XP/badges |
| `/api/checkin/route.ts` | Daily check-in, update streak |
| `/api/badges/route.ts` | Lấy danh sách badges |
| `/api/leaderboard/route.ts` | Bảng xếp hạng tuần/tháng |
| `/api/admin/exercises/route.ts` | CRUD exercises (admin) |
| `/api/admin/questions/[id]/route.ts` | CRUD questions (admin) |

**Tổng số**: ~20 API routes

### **Python FastAPI** (Backend phụ):
```python
# backend/app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "English Pronunciation API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}
```

### **Lý do kiến trúc Hybrid**:
1. ✅ **Next.js API Routes làm chính**:
   - Type-safe với Prisma
   - Cùng repo với frontend (dễ maintain)
   - Session/Auth tích hợp tốt
   
2. ✅ **FastAPI giữ minimal**:
   - Đáp ứng yêu cầu đề cương (phải có backend Python)
   - Dễ mở rộng sau (AI scoring, analytics)
   - Health check endpoint

### **FastAPI Dependencies**:
```
fastapi==0.136.3
uvicorn==0.48.0          # ASGI server
pydantic==2.13.4         # Validation
psycopg2-binary==2.9.12  # PostgreSQL driver
SQLAlchemy==2.0.50       # ORM (chưa dùng, dự phòng)
passlib==1.7.4           # Password hashing (chưa dùng)
python-jose==3.5.0       # JWT (chưa dùng)
```


---

## 6. AUTHENTICATION & AUTHORIZATION

### **Auth Library**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **NextAuth.js** | 5.0.0-beta.31 | Authentication library |
| **bcryptjs** | 3.0.3 | Password hashing |

### **Auth Flow**:
```
User → Login Form (email/password hoặc Google OAuth)
  ↓
NextAuth.js validate credentials
  ↓
Prisma query User table
  ↓
bcrypt.compare(password, passwordHash)
  ↓
Tạo Session JWT token
  ↓
Lưu session cookie (httpOnly, secure)
```

### **Auth Providers**:
1. **Credentials** (email/password) - Mặc định
2. **Google OAuth** - Nếu có `AUTH_GOOGLE_ID` trong `.env`

### **Authorization**:
- **Role-based**: User có `roleId` → Role (`Admin` hoặc `User`)
- **Protected routes**: Middleware check session
- **Admin routes**: Check `session.user.role === "Admin"`

### **Lý do chọn NextAuth.js v5**:
- ✅ Tích hợp tốt với Next.js 16 App Router
- ✅ Multiple providers (credentials, OAuth)
- ✅ Session management tự động
- ✅ CSRF protection built-in
- ✅ Type-safe với TypeScript


---

## 7. SPEECH & AUDIO

### **Speech Recognition**:
| Công nghệ | Vai trò |
|-----------|---------|
| **Web Speech API** | Browser-native speech recognition |
| **SpeechRecognition** | Ghi âm + chuyển speech → text |
| **speechSynthesis** | Text-to-speech (đọc câu mẫu) |

### **Audio Libraries**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **wavesurfer.js** | 7.12.7 | Hiển thị waveform âm thanh |

### **Audio Flow**:

#### **Mode 1 & 3 (Listen & Choose / Minimal Pairs)**:
```
1. User click "Nghe" button
   ↓
2. Load audio file từ `/public/audio/{word}.mp3`
   ↓
3. Play audio + hiển thị waveform (wavesurfer.js)
   ↓
4. User chọn đáp án → Submit
```

#### **Mode 2 (Speak Word)**:
```
1. User click "Ghi âm" button
   ↓
2. Browser yêu cầu microphone permission
   ↓
3. Web Speech API (SpeechRecognition) lắng nghe
   ↓
4. Convert speech → text transcript
   ↓
5. So sánh transcript với expected word
   ↓
6. Tính accuracy score (word overlap)
```

#### **Mode 4 (Speak Sentence)**:
```
1. Click "Nghe mẫu câu" → speechSynthesis.speak(text)
   ↓
2. Click "Ghi âm" → SpeechRecognition
   ↓
3. So sánh transcript với acceptedAnswers[]
```

### **Audio Source**:
- **Word audio**: 196 files `.mp3` tại `/public/audio/`
- **Nguồn**: Free Dictionary API → download local
- **License**: CC-BY-SA 3.0 (Wiktionary/Wikimedia Commons)
- **Sentence audio**: Runtime `speechSynthesis` (browser voice)

### **Lý do chọn Web Speech API thay vì ASR backend**:
1. ✅ **Miễn phí** (không tốn tiền API như Google Speech-to-Text)
2. ✅ **Browser-native** (không cần backend AI phức tạp)
3. ✅ **Real-time** (không lag upload audio lên server)
4. ✅ **Privacy** (audio không rời khỏi máy user)
5. ✅ **Phù hợp scope** (khóa luận 10 tuần, không cần Whisper/ASR training)

### **Hạn chế Web Speech API**:
- ⚠️ Chỉ hoạt động trên Chrome/Edge (Firefox/Safari limited)
- ⚠️ Cần internet (API gọi Google Cloud backend ngầm)
- ⚠️ Accuracy ~85-90% (không bằng Whisper ~95%)


---

## 8. GAMIFICATION & UI EFFECTS

### **Gamification Libraries**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **canvas-confetti** | 1.9.4 | Hiệu ứng pháo giấy khi đạt badge/level |

### **Gamification Logic** (Custom implementation):

#### **File**: `lib/gamification.ts`
```typescript
// XP & Level
export function calculateLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Badge Definitions (11 badges)
export const BADGE_DEFINITIONS = {
  first_exercise: { xpReward: 10, category: 'milestone' },
  streak_7: { xpReward: 50, category: 'streak' },
  perfect_score: { xpReward: 100, category: 'achievement' },
  // ... 8 badges khác
};

// Leaderboard
export function getCurrentWeek(): string {
  return `2026-W${weekNumber}`;
}
```

### **Gamification Features**:
1. **XP (Experience Points)**: Tích lũy từ làm bài, check-in
2. **Level**: Tính từ XP (level 1 = 0-100 XP, level 2 = 100-400 XP, ...)
3. **Streak**: Chuỗi ngày liên tiếp (daily check-in)
4. **Badges**: 11 huy hiệu (milestone, streak, achievement)
5. **Leaderboard**: Bảng xếp hạng tuần/tháng (Ranking Score, không dùng XP)
6. **Daily Check-in**: +10 XP, +2 Ranking Score mỗi ngày
7. **Daily Bonus**: Làm 2/3/5/8 bài trong ngày → bonus XP
8. **Gem (💎)**: Tiền tệ ảo (SP7)
9. **Shop**: Mua items bằng Gem (SP7)
10. **Streak Freeze**: Bảo vệ streak (SP7)
11. **Daily Quest**: Nhiệm vụ hàng ngày (SP7 - đang implement)

### **Lý do tự implement gamification**:
- ✅ Linh hoạt thiết kế (không bị giới hạn bởi library)
- ✅ Type-safe với TypeScript
- ✅ Tích hợp sâu vào database (Prisma)
- ✅ Custom rules theo nhu cầu người học Việt Nam


---

## 9. TESTING & QUALITY ASSURANCE

### **Testing Framework**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **tsx** | 4.22.4 | TypeScript executor (chạy tests) |
| **Node.js Test Runner** | Built-in | `node:test` module (test runner) |
| **Node.js Assert** | Built-in | `node:assert/strict` (assertions) |

### **Test Command**:
```bash
npm test
# → tsx --test "src/**/*.test.ts"
```

### **Test Files** (74 tests):
1. `lib/__tests__/scoring.test.ts` (14 tests)
   - Normalize scores
   - Multiple choice scoring
   - Voice word overlap
   - Rating thresholds (EXCELLENT/GOOD/PASS)

2. `lib/__tests__/gamification.test.ts` (20 tests)
   - XP calculation
   - Level calculation
   - Badge progress
   - Leaderboard period
   - Check-in rewards
   - Daily bonus

3. `lib/__tests__/sfx.test.ts` (8 tests)
   - Sound effects loading
   - Audio playback

4. `lib/__tests__/confetti.test.ts` (5 tests)
   - Confetti effects

5. Other tests (catalog, content, IPA, listen-choose-builder, ...)

### **Test Coverage**:
- ✅ **Logic cốt lõi**: 100% (scoring, gamification)
- ⚠️ **API routes**: 20% (chưa mock Prisma)
- ⚠️ **UI components**: 10% (chưa test React)

### **Lý do chọn Node.js Test Runner**:
1. ✅ **Built-in** (không cần Jest/Vitest)
2. ✅ **Fast** (không cần config)
3. ✅ **TypeScript support** (qua tsx)
4. ✅ **Minimal dependencies** (chỉ cần tsx)


---

## 10. DEPLOYMENT & DEVOPS

### **Development Tools**:
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **Node.js** | 24.x | JavaScript runtime |
| **npm** | Latest | Package manager |
| **Git** | Latest | Version control |

### **Environment Variables** (`.env`):
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/english_app"

# Auth
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..." (optional)
AUTH_GOOGLE_SECRET="..." (optional)

# URL
NEXTAUTH_URL="http://localhost:3000"
```

### **Scripts**:
```json
{
  "dev": "next dev",                    // Development server
  "build": "next build",                // Production build
  "start": "next start",                // Production server
  "test": "tsx --test \"src/**/*.test.ts\"",
  "lint": "next lint",
  "db:seed:lessons": "tsx prisma/seed_lessons.ts"
}
```

### **Database Migration**:
```bash
# Development
npx prisma migrate dev --name add_feature

# Production
npx prisma migrate deploy
```

### **Deployment Strategy** (Khuyến nghị):
- **Frontend + Backend**: Vercel (Next.js native)
- **Database**: Railway / Supabase / Render (PostgreSQL managed)
- **FastAPI**: Railway / Render (Python hosting)

### **CI/CD** (Chưa implement):
- ⚠️ GitHub Actions (automated testing)
- ⚠️ Auto deploy to staging


---

## 11. DESIGN PRINCIPLES & STANDARDS

### **Human-Computer Interaction (HCI)**:
- ✅ **Skip links** cho accessibility
- ✅ **Keyboard navigation** (Tab, Enter, Space)
- ✅ **Focus states** rõ ràng (outline, ring)
- ✅ **ARIA labels** (`aria-label`, `aria-current`, `aria-expanded`)
- ✅ **Semantic HTML** (`<nav>`, `<main>`, `<section>`, `<button>`)
- ✅ **Color contrast** (WCAG AA minimum)
- ✅ **Responsive design** (mobile-first)

### **IPA (International Phonetic Alphabet)**:
- ✅ **44 phonemes** (20 vowels + 24 consonants)
- ✅ **Bảng IPA tương tác** (`/practice` page)
- ✅ **IPA notation** trong questions (`/ɪ/`, `/æ/`, `/θ/`)
- ✅ **Khẩu hình** (mouth position diagrams)

### **Code Quality Standards**:
- ✅ **TypeScript strict mode** (`strict: true`)
- ✅ **ESLint** (Next.js recommended)
- ✅ **Prettier** (code formatting - chưa config)
- ✅ **Type-safe** (100% typed, no `any`)

---

## 12. BẢNG TỔNG HỢP CÔNG NGHỆ (ĐỂ GHI VÀO BÁO CÁO)

### **Chương 2: Nghiên cứu lý thuyết - Cần nghiên cứu các công nghệ sau**:

| Layer | Công nghệ | Version | Mục đích |
|-------|-----------|---------|----------|
| **Language** | TypeScript | 6.0.3 | Ngôn ngữ lập trình chính |
| **Frontend Framework** | Next.js | 16.2.7 | Full-stack React framework |
| **UI Library** | React | 18.3.1 | Component-based UI |
| **Styling** | Tailwind CSS | 4.3.0 | Utility-first CSS |
| **Database** | PostgreSQL | Production | Relational database |
| **ORM** | Prisma | 6.19.3 | TypeScript ORM |
| **Backend API** | Next.js API Routes | - | REST API endpoints |
| **Backend Python** | FastAPI | 0.136.3 | Python API (minimal) |
| **Authentication** | NextAuth.js | 5.0.0-beta.31 | Auth library |
| **Password** | bcryptjs | 3.0.3 | Password hashing |
| **Speech** | Web Speech API | Browser | Speech recognition |
| **Audio Waveform** | wavesurfer.js | 7.12.7 | Audio visualization |
| **Effects** | canvas-confetti | 1.9.4 | Gamification effects |
| **Testing** | Node.js Test Runner | Built-in | Unit testing |
| **Runtime** | Node.js | 24.x | JavaScript runtime |


---

## 13. CÔNG NGHỆ KHÔNG SỬ DỤNG (ĐỂ TRÁNH NHẦM LẪN)

### **KHÔNG dùng**:
- ❌ **JavaScript thuần** (.js/.jsx files) - Chỉ dùng TypeScript
- ❌ **Vue.js / Angular** - Dùng React
- ❌ **Express.js** - Dùng Next.js API Routes
- ❌ **MongoDB** - Dùng PostgreSQL
- ❌ **Sequelize / TypeORM** - Dùng Prisma
- ❌ **Redux / MobX** - Dùng React Context + Server Components
- ❌ **GraphQL** - Dùng REST API
- ❌ **Webpack** - Dùng Turbopack (Next.js 16)
- ❌ **Create React App** - Dùng Next.js
- ❌ **Jest / Vitest** - Dùng Node.js Test Runner
- ❌ **Whisper AI / Google Speech-to-Text** - Dùng Web Speech API
- ❌ **Socket.io / WebSocket** - Chưa cần real-time
- ❌ **Docker** - Chưa containerize
- ❌ **Kubernetes** - Chưa orchestrate

---

## 14. KIẾN TRÚC TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  - React 18.3.1 components (TypeScript)                     │
│  - Tailwind CSS styling                                     │
│  - Web Speech API (microphone)                              │
│  - wavesurfer.js (audio visualization)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       ↓
┌─────────────────────────────────────────────────────────────┐
│               NEXT.JS SERVER (Node.js 24.x)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Server Components (SSR)                            │   │
│  │  - app/dashboard/page.tsx                           │   │
│  │  - app/learning_map/page.tsx                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes (REST endpoints)                        │   │
│  │  - api/exercises/submit/route.ts                    │   │
│  │  - api/checkin/route.ts                             │   │
│  │  - api/badges/route.ts                              │   │
│  │  - api/leaderboard/route.ts                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Business Logic (lib/)                              │   │
│  │  - lib/gamification.ts (XP, badges, streak)         │   │
│  │  - lib/scoring.ts (tính điểm)                       │   │
│  │  - lib/auth.ts (NextAuth config)                    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ Prisma Client
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE                             │
│  - 26 tables (User, Exercise, Badge, Leaderboard, ...)     │
│  - ACID transactions                                        │
│  - JSON data types (IPA, audio metadata)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         PYTHON FASTAPI (Optional/Minimal)                    │
│  - GET / (root)                                             │
│  - GET /health (health check)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. SO SÁNH VỚI ĐỀ CƯƠNG

| Công nghệ | Đề cương yêu cầu | Thực tế implement | Ghi chú |
|-----------|-----------------|-------------------|---------|
| Frontend Framework | Next.js 14 | **Next.js 16.2.7** | ✅ Upgrade lên bản mới hơn |
| Language | TypeScript | **TypeScript 6.0.3** | ✅ Đúng |
| Styling | Tailwind CSS | **Tailwind CSS 4.3.0** | ✅ Upgrade lên v4 |
| Database | PostgreSQL | **PostgreSQL** | ✅ Đúng |
| Backend | FastAPI | **FastAPI 0.136.3 (minimal)** | ⚠️ Minimal, logic chính ở Next.js |
| Speech AI | ASR (yêu cầu) | **Web Speech API** | ⚠️ Khác đề cương, lý do: miễn phí, phù hợp scope |
| ORM | Không đề cập | **Prisma 6.19.3** | ✅ Thêm để type-safe |

---

## 16. TÀI LIỆU THAM KHẢO CHO CHƯƠNG 2

### **Sách & Papers**:
1. Matt Stauffer, "Laravel: Up & Running" (2019) - Principles áp dụng Next.js
2. Robin Wieruch, "The Road to React" (2021)
3. Addy Osmani, "Learning JavaScript Design Patterns" (2017)
4. Martin Fowler, "Patterns of Enterprise Application Architecture" (2002)

### **Official Documentation**:
1. [Next.js Documentation](https://nextjs.org/docs) - Version 16
2. [React Documentation](https://react.dev/)
3. [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
4. [Prisma Documentation](https://www.prisma.io/docs)
5. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
6. [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
7. [Tailwind CSS v4](https://tailwindcss.com/docs)
8. [NextAuth.js Documentation](https://next-auth.js.org/)
9. [FastAPI Documentation](https://fastapi.tiangolo.com/)

### **Research Papers** (Gamification):
1. Sailer et al., "How gamification motivates: An experimental study" (2017)
2. Deterding et al., "From game design elements to gamefulness" (2011)

---

**File này cung cấp**: DATA đầy đủ về công nghệ để AI khác viết Chương 2 - Nghiên cứu lý thuyết.
