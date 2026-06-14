# 📘 PROJECT CONTEXT – English Pronunciation App (Web_HoTroPhatAmEN)

> **Dành cho AI Agent:** Đọc file này trước khi làm bất kỳ task nào trong dự án.
> Cập nhật file này mỗi khi có thay đổi kiến trúc, công nghệ, hoặc quyết định thiết kế quan trọng.

---

## 1. Tổng Quan Dự Án

| Mục | Nội dung |
|-----|----------|
| **Tên dự án** | Web Hỗ Trợ Phát Âm Tiếng Anh (PhatAmEN) |
| **Loại** | Đồ án tốt nghiệp / Web App giáo dục |
| **Mục tiêu** | Giúp người Việt học và luyện phát âm tiếng Anh chuẩn |
| **Người dùng chính** | Sinh viên Việt Nam, người đi làm học tiếng Anh |
| **Ngôn ngữ UI** | Tiếng Việt (chính) + Tiếng Anh |
| **Trạng thái** | 🚧 Đang phát triển |

### Vấn đề giải quyết
Người Việt học tiếng Anh gặp khó khăn đặc thù:
- Không phân biệt được `/θ/` vs `/t/`, `/ð/` vs `/d/`, `/v/` vs `/b/`, `/r/` vs `/l/`
- Thiếu công cụ luyện tập có phản hồi tức thì bằng tiếng Việt
- Không biết mình đang phát âm sai ở đâu cụ thể

---

## 2. Tech Stack

### Frontend — `english_pronunciation_app/frontend/`
| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | **Next.js** (App Router) | 14+ |
| Language | **TypeScript** | 5+ |
| Styling | **Tailwind CSS** | 3+ |
| ORM | **Prisma** | 5+ |
| State | **Zustand** hoặc React Context | TBD |
| Auth | **NextAuth.js** | v5 (beta) |
| Audio | **Web Audio API** + wavesurfer.js | native |
| Speech | **Web Speech API** (SpeechRecognition) | native |
| Font IPA | **Noto Sans** (Google Fonts) | - |
| UI Components | Tự xây dựng (không dùng shadcn mặc định) | - |

### Backend — `english_pronunciation_app/backend/`
| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | **FastAPI** | 0.110+ |
| Language | **Python** | 3.11+ |
| Database | **PostgreSQL** | 15+ |
| ORM | **SQLAlchemy** + Alembic | 2.0+ |
| Auth | **JWT** (python-jose) | - |
| Audio ML | **librosa**, **openai-whisper** hoặc Web Speech API | TBD |
| Validation | **Pydantic v2** | 2.0+ |
| Server | **Uvicorn** | - |

### Infrastructure
| Thành phần | Công nghệ |
|-----------|-----------|
| Database | PostgreSQL (local dev) / Supabase (prod) |
| Storage | Local / Cloudinary (audio files) |
| Containerization | Docker + docker-compose |
| Version Control | Git |

---

## 3. Kiến Trúc Hệ Thống

```
[User Browser]
      │
      ▼
[Next.js Frontend :3000]
   ├── App Router Pages
   ├── Server Components (data fetching)
   ├── Client Components (audio recording, UI)
   └── API Routes (Next.js) ← auth, lightweight ops
      │
      │ HTTP/REST (JSON)
      ▼
[FastAPI Backend :8000]
   ├── /api/auth/        ← JWT authentication
   ├── /api/phonemes/    ← Phoneme data, exercises
   ├── /api/practice/    ← Save sessions, scoring
   ├── /api/progress/    ← User progress tracking
   └── /api/users/       ← User management
      │
      ▼
[PostgreSQL Database]
```

---

## 4. Cấu Trúc Thư Mục Chi Tiết

```
english_pronunciation_app/
├── PROJECT_CONTEXT.md          ← 📍 File này
├── docker-compose.yml
├── README.md
│
├── frontend/
│   ├── prisma/
│   │   └── schema.prisma       ← DB schema (nếu dùng Prisma cho frontend auth)
│   ├── public/
│   │   └── audio/             ← File audio mẫu phát âm chuẩn
│   └── src/
│       ├── app/
│       │   ├── (auth)/        ← /login, /register, /forgot-password
│       │   ├── dashboard/     ← Trang chính sau đăng nhập
│       │   ├── learning_map/  ← Bản đồ học tập (roadmap âm vị)
│       │   ├── practice/      ← Màn hình luyện phát âm chính
│       │   ├── leaderboard/   ← Bảng xếp hạng
│       │   └── api/           ← Next.js API routes
│       ├── components/
│       │   ├── ui/            ← Button, Card, Modal, Input...
│       │   ├── ipa/           ← IPAChart, PhonemeCard, MouthDiagram
│       │   ├── audio/         ← RecordButton, WaveformPlayer, AudioComparison
│       │   └── gamification/  ← StreakCounter, Badge, XPBar, Leaderboard
│       ├── hooks/             ← useAudioRecorder, useProgress, useSpeechRecognition
│       ├── lib/               ← api.ts, auth.ts, utils.ts, constants.ts
│       └── types/             ← TypeScript interfaces & types
│
└── backend/
    └── app/
        ├── main.py            ← FastAPI app entry point
        ├── api/
        │   └── routes/        ← phonemes.py, practice.py, users.py, auth.py
        ├── core/
        │   ├── config.py      ← Settings, env vars
        │   └── database.py    ← DB connection, session
        └── services/          ← Business logic (scoring, audio analysis)
```

---

## 5. Database Schema (Tóm Tắt)

### Bảng chính
| Bảng | Mục đích |
|------|----------|
| `users` | Tài khoản người dùng |
| `phonemes` | 44 âm vị tiếng Anh (IPA, mô tả, audio_url) |
| `lessons` | Bài học theo chủ đề/cấp độ |
| `exercises` | Bài tập trong từng lesson |
| `practice_sessions` | Lần luyện tập của user (score, audio_ref) |
| `user_progress` | Tiến độ user theo từng phoneme (mastery_score) |
| `achievements` | Huy hiệu / badges |
| `user_achievements` | User đã đạt badge nào |

### Quan hệ chính
```
users ──< practice_sessions >── exercises
users ──< user_progress >── phonemes
users ──< user_achievements >── achievements
lessons ──< exercises >── phonemes
```

---

## 6. Tính Năng Chính (Features)

### ✅ MVP (Must Have)
- [ ] Đăng ký / Đăng nhập (email + password)
- [ ] Bảng âm vị IPA với audio mẫu
- [ ] Màn hình luyện tập: nghe → ghi âm → xem điểm
- [ ] Scoring đơn giản (so sánh transcript)
- [ ] Lịch sử luyện tập

### 🎯 Core Features
- [ ] Learning Map — lộ trình học từ dễ → khó
- [ ] Tiến độ theo từng âm vị (progress tracking)
- [ ] Streak hàng ngày + XP points
- [ ] Hướng dẫn vị trí miệng/lưỡi bằng hình ảnh

### 🚀 Advanced (Nice to Have)
- [ ] Leaderboard
- [ ] Badges / Achievements
- [ ] So sánh sóng âm (waveform comparison)
- [ ] AI feedback chi tiết từng phoneme

---

## 7. Luồng Người Dùng Chính (User Flow)

```
Landing Page → Đăng ký/Đăng nhập
    → Dashboard (tổng quan tiến độ)
    → Learning Map (chọn phoneme/lesson)
    → Practice Screen:
        1. Nghe audio mẫu
        2. Xem IPA + hình miệng
        3. Nhấn ghi âm (max 5 giây)
        4. Xem điểm + feedback
        5. Thử lại hoặc tiếp theo
    → Xem progress cập nhật
```

---

## 8. Quy Tắc Coding

### Frontend
- Dùng **TypeScript strict mode**
- Components: **PascalCase** (`PhonemeCard.tsx`)
- Hooks: **camelCase** với prefix `use` (`useAudioRecorder.ts`)
- Mỗi component trong file riêng
- Server Components mặc định, `'use client'` khi cần
- Không inline style — dùng Tailwind classes

### Backend
- Mỗi domain một file route riêng (`phonemes.py`, `users.py`)
- Dùng **Pydantic schemas** cho request/response validation
- Tên hàm: `snake_case`
- Tên class: `PascalCase`
- Luôn có **docstring** cho functions public

### Chung
- Commit message: tiếng Anh, format `feat:`, `fix:`, `docs:`, `refactor:`
- Không commit file `.env` (chỉ commit `.env.example`)
- Tất cả API endpoint có **error handling** và trả về JSON chuẩn

---

## 9. API Response Format (Chuẩn)

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "OK"
}

// Error
{
  "success": false,
  "error": {
    "code": "PHONEME_NOT_FOUND",
    "message": "Không tìm thấy âm vị này"
  }
}
```

---

## 10. Ghi Chú & Quyết Định Thiết Kế

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 2026-06-01 | Dùng Next.js App Router | Hỗ trợ Server Components, SEO tốt hơn |
| 2026-06-01 | FastAPI thay vì Express | Python có thư viện xử lý audio/ML tốt hơn |
| 2026-06-01 | Không dùng shadcn/ui | Muốn tự xây component để học sâu hơn |
| 2026-06-01 | Tạm dùng Web Speech API | Đơn giản, miễn phí, đủ cho MVP |

---

## 11. Cách AI Agent Nên Hành Xử

- **Luôn đọc file này** trước khi bắt đầu task mới
- **Cập nhật bảng "Quyết định thiết kế"** khi có thay đổi quan trọng
- Ưu tiên **tiếng Việt** trong comment code và message feedback cho user
- Code phải đạt **WCAG 2.1 AA** (dùng skill `accessibility`)
- Thiết kế DB phải tham khảo skill `postgresql_expert`
- Nghiên cứu công nghệ mới phải dùng skill `google_search`
- Thiết kế UI/UX phải tham khảo skill `hci_consultant`
