# 2.4. PHƯƠNG PHÁP NGHIÊN CỨU - DATA

> **Nguồn:** Đề cương chính thức + ACTION_PLAN_NEXT_STEPS.md + Source code implementation

---

## TỔNG QUAN (từ đề cương)

Đề tài sử dụng 2 phương pháp chính:
1. **Phương pháp nghiên cứu lý thuyết**
2. **Phương pháp thực nghiệm** (phát triển hệ thống)

---

## 2.4.1. PHƯƠNG PHÁP NGHIÊN CỨU LÝ THUYẾT

### A. Nguồn tài liệu đã nghiên cứu (thực tế)

#### 1. Về công nghệ web
| Tài liệu | URL | Nội dung nghiên cứu |
|----------|-----|---------------------|
| Next.js Documentation | https://nextjs.org/docs | App Router, Server Components, API Routes, TypeScript |
| React Documentation | https://react.dev/ | Hooks, State Management, Component Architecture |
| Tailwind CSS Docs | https://tailwindcss.com/docs | Utility-first CSS, Responsive Design, v4 @theme |
| PostgreSQL 18.3 Docs | https://www.postgresql.org/docs/current/ | Relational DB, Transactions, Indexes |

#### 2. Về Gamification
| Nguồn | Chi tiết |
|-------|----------|
| M. Sailer et al. (2017) | "How gamification motivates: An experimental study of the effects of specific game design elements on psychological need satisfaction", Computers in Human Behavior, vol. 69, pp. 371–380 |
| Self-Determination Theory | Autonomy, Competence, Relatedness - 3 nhu cầu tâm lý |
| Octalysis Framework (Yu-kai Chou) | 8 core drives của gamification |

**Ứng dụng vào hệ thống:**
- Autonomy → User tự chọn bài học, không bắt buộc theo thứ tự
- Competence → XP, Level, Badge giúp cảm nhận tiến bộ
- Relatedness → Leaderboard tạo cộng đồng cạnh tranh lành mạnh

#### 3. Về ngữ âm học IPA
| Nguồn | Mục đích |
|-------|----------|
| International Phonetic Alphabet (IPA) | 44 âm vị tiếng Anh chuẩn (British English) |
| Ship or Sheep? (Ann Baker) | Phương pháp minimal pairs, KHÔNG copy nội dung |
| English Pronunciation in Use (Mark Hancock) | Cấu trúc bài học phát âm, KHÔNG copy nội dung |

**Lưu ý:** Chỉ tham khảo PHƯƠNG PHÁP, nội dung tự biên soạn

#### 4. Về Speech Recognition
| Công nghệ | Nguồn |
|-----------|-------|
| Web Speech API | MDN Web Docs - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API |
| SpeechRecognition interface | Browser-native, không cần backend ASR |

### B. Phân tích ứng dụng hiện có (benchmarking)

**Ứng dụng đã khảo sát:**

1. **Duolingo**
   - Điểm mạnh: Gamification mạnh (XP, streak, leaderboard)
   - Điểm yếu: Phát âm chi tiết yếu, không có bảng IPA

2. **ELSA Speak**
   - Điểm mạnh: AI phát âm chi tiết, feedback cụ thể
   - Điểm yếu: Gamification yếu, giao diện phức tạp

3. **Sounds: Pronunciation App**
   - Điểm mạnh: Có bảng IPA đầy đủ
   - Điểm yếu: UI khó dùng, ít tính năng gamification

**Kết luận:** Hệ thống cần kết hợp điểm mạnh của cả 3

### C. Nghiên cứu lỗi phát âm người Việt

**Phương pháp:**
- Khảo sát tài liệu giáo học tiếng Anh tại Việt Nam
- Tham khảo nghiên cứu về interlanguage phonology
- Phân tích đặc điểm hệ thống âm tiếng Việt vs tiếng Anh

**Phát hiện chính:**
- Tiếng Việt không có âm /θ/, /ð/ → thường phát âm thành /s/, /z/
- Tiếng Việt không phân biệt /l/ và /r/ rõ ràng
- Nguyên âm tiếng Việt không có cặp dài-ngắn → khó phân biệt /iː/-/ɪ/, /uː/-/ʊ/
- Phụ âm cuối trong tiếng Việt yếu → thường nuốt /p/, /t/, /k/ cuối từ tiếng Anh

**Đầu ra:** Danh sách 30 nhóm âm cần ưu tiên luyện tập

---

## 2.4.2. PHƯƠNG PHÁP THỰC NGHIỆM

### A. Quy trình phát triển phần mềm

**Mô hình:** Agile/Iterative development với 8 Phases

```
Phase 1: Ổn định build & database contract
Phase 2: Hoàn thiện luồng nộp bài
Phase 3: Gamification dùng dữ liệu thật
Phase 4: Auth, session & phân quyền
Phase 5: FastAPI tối thiểu
Phase 6: UI/UX, HCI & accessibility
Phase 7: Admin CRUD
Phase 8: Testing & demo
```

**Trạng thái hiện tại (19/06/2026):**
- Phase 1-5: ✅ Hoàn thành
- Phase 6: 🟠 Đang thực hiện (~70%)
- Phase 7: 🟠 Đang thực hiện (~40%)
- Phase 8: 🟠 Đang thực hiện (~60%)

### B. Công nghệ sử dụng (thực tế)

#### 1. Frontend Development

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Next.js** | 16.2.7 | Framework chính, App Router, Server Components |
| **React** | 18.3.1 | UI library, component-based |
| **TypeScript** | 6.0.3 | Type safety, better DX |
| **Tailwind CSS** | v4 | Utility-first CSS, responsive design |
| **Prisma Client** | 6.19.3 | Type-safe database access |
| **NextAuth.js** | v5 beta | Authentication (Credentials + Google OAuth) |
| **wavesurfer.js** | 7.12.7 | Audio waveform visualization |
| **canvas-confetti** | 1.9.4 | Celebration animation |

**Lý do chọn:**
- Next.js 16: Full-stack framework, SEO-friendly, fast
- TypeScript: Giảm bugs, tăng maintainability
- Tailwind v4: Rapid UI development, consistent design
- Prisma: Type-safe ORM, easy migrations

#### 2. Backend Development

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Next.js API Routes** | 16.2.7 | API backend chính (~20 routes) |
| **Python FastAPI** | 0.136.3 | Backend phụ (chỉ /health endpoint) |
| **PostgreSQL** | Latest | Relational database (26 tables) |
| **Prisma** | 6.19.3 | ORM, schema management |

**Kiến trúc đặc biệt:**
- Scoring logic ở **frontend** (`src/lib/scoring.ts`)
- Gamification logic ở **frontend** (`src/lib/gamification.ts`)
- Backend Python minimal (dành cho mở rộng sau)

**Lý do:**
- Next.js API Routes đủ mạnh cho business logic
- Prisma chạy ở frontend → single source of truth
- Backend Python giữ minimal để đáp ứng đề cương (có backend Python + FastAPI)

#### 3. Speech Recognition

| Công nghệ | Loại | Chi tiết |
|-----------|------|----------|
| **Web Speech API** | Browser-native | `window.SpeechRecognition` / `window.webkitSpeechRecognition` |
| **Language** | en-US | American English accent |
| **Mode** | Non-continuous | `continuous: false` |

**Ưu điểm:**
- ✅ Miễn phí, không giới hạn
- ✅ Chạy trên browser, không cần backend
- ✅ Độ chính xác cao trên Chrome/Edge
- ✅ Real-time recognition

**Hạn chế:**
- ⚠️ Không hỗ trợ Safari iOS
- ⚠️ Cần internet để recognition (nhưng audio local không cần)

### C. Thiết kế cơ sở dữ liệu

**Công cụ:** PostgreSQL + Prisma ORM

**Quy trình:**
1. Thiết kế ERD (Entity-Relationship Diagram)
2. Chuyển sang Prisma schema (`schema.prisma`)
3. Generate migrations: `npx prisma migrate dev`
4. Generate client: `npx prisma generate`
5. Seed data: `npm run db:seed:lessons`

**Kết quả:**
- 26 bảng trong 6 nhóm (User, Content, Learning, Progress, Gamification, Bookmarks)
- Relations đầy đủ với foreign keys
- Indexes trên các trường thường query

### D. Phát triển tính năng (feature development)

#### 1. Exercise Engine (4 modes)

**Code file chính:**
- `src/app/exercises/[id]/ExerciseEngineClient.tsx` (~1100 lines)
- `src/app/exercises/[id]/ListenFeedbackSheet.tsx` (feedback sheet)
- `src/app/exercises/[id]/ExerciseSummaryScreen.tsx` (summary screen)

**Thuật toán chấm điểm:**
```typescript
// File: src/lib/scoring.ts

function calculatePronunciationScore(
  transcript: string,
  correctAnswer: string
): number {
  // 1. Normalize text
  const norm1 = normalizeText(transcript);
  const norm2 = normalizeText(correctAnswer);
  
  // 2. Exact match = 100
  if (norm1 === norm2) return 100;
  
  // 3. Levenshtein distance
  const distance = levenshtein(norm1, norm2);
  const maxLen = Math.max(norm1.length, norm2.length);
  const similarity = 1 - (distance / maxLen);
  
  return Math.round(similarity * 100);
}
```

**Test coverage:** `__tests__/scoring.test.ts` (14 test cases)

#### 2. Gamification System

**Code file:** `src/lib/gamification.ts`

**Các thuật toán chính:**

**A. Tính XP:**
```typescript
function calculateXP(score: number, dailyCount: number): number {
  const baseXP = Math.round((score / 100) * 10);
  const dailyBonus = getDailyBonus(dailyCount);
  return baseXP + dailyBonus.xp;
}

// Daily bonus table
const DAILY_BONUS_TABLE = [
  { count: 2, xp: 2, ranking: 0.5 },
  { count: 3, xp: 5, ranking: 1 },
  { count: 5, xp: 10, ranking: 2 },
  { count: 8, xp: 20, ranking: 5 },
];
```

**B. Tính Level:**
```typescript
function calculateLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}
```

**C. Auto-award Badge:**
```typescript
async function checkAndAwardBadges(
  userId: string,
  reason: "exercise_submit" | "daily_checkin"
): Promise<Badge[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { badges: true },
  });
  
  const newBadges: Badge[] = [];
  
  for (const def of BADGE_DEFINITIONS) {
    // Check if already awarded
    if (user.badges.some(b => b.badgeId === def.id)) continue;
    
    // Check criteria
    if (checkBadgeCriteria(user, def)) {
      const badge = await awardBadge(userId, def.id);
      newBadges.push(badge);
    }
  }
  
  return newBadges;
}
```

**Test coverage:** `__tests__/gamification.test.ts` (12 test cases)

#### 3. API Submit Exercise

**Code file:** `src/app/api/exercises/submit/route.ts`

**Luồng xử lý:**
```typescript
export async function POST(request: Request) {
  // 1. Parse request
  const { exerciseId, startedAt, completedAt, answers } = await request.json();
  
  // 2. Get session
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  
  // 3. Prisma transaction
  const result = await prisma.$transaction(async (tx) => {
    // 3.1. Create ExerciseAttempt
    const attempt = await tx.userExerciseAttempt.create({...});
    
    // 3.2. Create QuestionResponses
    for (const answer of answers) {
      await tx.userQuestionResponse.create({...});
    }
    
    // 3.3. Calculate score & XP
    const score = calculateExerciseScore(attempt);
    const xp = calculateXP(score, dailyCount);
    
    // 3.4. Update User (xp, level)
    await tx.user.update({ 
      data: { xp: { increment: xp } }
    });
    
    // 3.5. Update DailyActivity
    await tx.dailyActivity.upsert({...});
    
    // 3.6. Update Leaderboard
    await tx.leaderboard.upsert({...});
    
    // 3.7. Award Badges
    const badges = await checkAndAwardBadges(userId, "exercise_submit");
    
    return { attempt, xp, badges };
  });
  
  return json({ success: true, data: result });
}
```

**Đảm bảo tính nhất quán:** Sử dụng Prisma transaction

### E. Content generation & seeding

#### 1. Seed pipeline

**Files:**
- `prisma/lesson-catalog.ts` - Định nghĩa 30 nhóm, 112 bài (catalog)
- `prisma/lesson-content.ts` - Content thực tế (12/30 nhóm)
- `prisma/seed_lessons.ts` - Script seed idempotent
- `prisma/seed_audio_local.ts` - Download audio từ API về local

**Quy trình seed:**
```bash
# 1. Reset DB (nếu cần)
npx prisma migrate reset

# 2. Seed lessons (idempotent)
npm run db:seed:lessons

# 3. Download audio (chạy 1 lần)
npx tsx prisma/seed_audio_local.ts
```

**Kết quả:** 112 exercises + 120 questions + 93 audio files

#### 2. Nguồn dữ liệu

| Loại | Nguồn | License | Cách sử dụng |
|------|-------|---------|--------------|
| **Audio (từ)** | Free Dictionary API | CC-BY-SA 3.0 | Tải về `public/audio/`, lưu local |
| **IPA phonemes** | CMU Pronouncing Dictionary | Open Data | Tra cứu IPA symbols |
| **Minimal pairs** | Tự biên soạn | - | Tham khảo phương pháp Ship or Sheep |
| **Sentences** | Tự biên soạn | - | Tham khảo phương pháp English Pronunciation in Use |

**Lưu ý:** KHÔNG copy nội dung từ sách/ứng dụng khác, chỉ tham khảo PHƯƠNG PHÁP

### F. Testing methodology

#### 1. Test framework

| Tool | Purpose |
|------|---------|
| `tsx --test` | Node.js built-in test runner |
| `node:assert/strict` | Assertion library |
| Pattern: `src/**/*.test.ts` | Test file pattern |

#### 2. Test categories

**A. Unit tests:**
- `scoring.test.ts` - Thuật toán chấm điểm
- `gamification.test.ts` - XP, level, badge logic
- `lesson-content.test.ts` - Validate content structure
- `listen-choose-builder.test.ts` - Generate câu hỏi

**B. Integration tests:**
- API routes (mock Prisma + session)
- Database transactions

**C. Build validation:**
```bash
npx prisma validate      # Schema OK
npx tsc --noEmit        # Type check
npm test                # All tests pass
npm run build           # Next.js build OK
```

#### 3. Test coverage

**Current:** 55 test files, ~80% coverage

**Key metrics:**
- Scoring logic: 100% coverage
- Gamification logic: 100% coverage
- API routes: ~60% coverage (đang tăng)

### G. Quality assurance

**Quality gate (chạy trước mỗi commit lớn):**
```bash
npx prisma validate && \
npx tsc --noEmit --pretty false && \
npm test && \
npm run build
```

**Coding standards:**
- TypeScript strict mode
- ESLint rules
- Prettier formatting
- No `any` type (trừ edge cases có comment)

---

## TỔNG KẾT PHƯƠNG PHÁP

### Phương pháp lý thuyết:
- ✅ Nghiên cứu tài liệu học thuật về Gamification (SDT, Sailer et al. 2017)
- ✅ Nghiên cứu IPA, ngữ âm học, lỗi phát âm người Việt
- ✅ Nghiên cứu công nghệ: Next.js, React, TypeScript, PostgreSQL, Web Speech API
- ✅ Benchmarking 3 ứng dụng: Duolingo, ELSA, Sounds

### Phương pháp thực nghiệm:
- ✅ Phát triển theo 8 Phases (Agile/Iterative)
- ✅ Full-stack: Next.js 16 + React 18 + TypeScript + PostgreSQL
- ✅ Prisma ORM cho type-safe database
- ✅ Web Speech API cho speech recognition
- ✅ Test-Driven Development (55 test files)
- ✅ Quality gate (validate + typecheck + test + build)

### Đặc điểm nổi bật:
1. **Scoring logic ở frontend** (không cần backend phức tạp)
2. **Content pipeline idempotent** (seed nhiều lần không duplicate)
3. **Audio local** (93 files, không phụ thuộc API runtime)
4. **Type-safe toàn bộ** (TypeScript + Prisma)
5. **Test coverage cao** (~80%)

---

**LƯU Ý CHO AI:** Viết lại thành văn phong học thuật, giải thích LÝ DO chọn từng phương pháp/công nghệ, không chỉ liệt kê.
