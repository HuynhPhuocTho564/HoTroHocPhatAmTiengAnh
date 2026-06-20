# 2.1. MỤC TIÊU NGHIÊN CỨU - DATA

> **Nguồn:** Đề cương chính thức + CURRENT_PROJECT_CONTEXT.md + Source code thực tế

---

## DATA TỪ ĐỀ CƯƠNG CHÍNH THỨC

**Mục tiêu tổng quát (từ đề cương):**
> Xây dựng hệ thống web hỗ trợ người học rèn luyện và cải thiện phát âm tiếng Anh theo chuẩn bảng ký hiệu ngữ âm quốc tế (IPA) tích hợp các cơ chế Gamification nhằm nâng cao động lực và duy trì sự gắn kết của người học trong quá trình luyện tập.

---

## CHỈ TIÊU CỤ THỂ ĐÃ ĐẠT ĐƯỢC (từ source code)

### 1. Về cấu trúc bài học IPA

| Thành phần | Mục tiêu ban đầu | Đã implement |
|------------|------------------|--------------|
| Số âm vị IPA | 44 âm | ✅ 44 phonemes trong DB |
| Số chủ đề | 4 chủ đề | ✅ 4 topics (Nguyên âm, Phụ âm, Minimal Pairs, Trọng âm & Nối âm) |
| Số nhóm âm | 30 nhóm | ✅ 30 sound groups trong catalog |
| Số bài tập | 112 bài | ✅ 112 exercises đã seed |
| Content thực tế | 30 nhóm | 🟠 12/30 nhóm có content (40%) |

**Phân bổ bài học:**
- Chủ đề 1 (Nguyên âm): 10 nhóm × 4 modes = 40 bài
- Chủ đề 2 (Phụ âm): 12 nhóm × 4 modes = 48 bài
- Chủ đề 3 (Minimal Pairs): 4 nhóm × 4 modes = 16 bài
- Chủ đề 4 (Trọng âm & Nối âm): 4 nhóm × 2 modes = 8 bài

### 2. Về công nghệ

| Công nghệ | Đã sử dụng | Version |
|-----------|------------|---------|
| Frontend Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 18.3.1 |
| Language | TypeScript | 6.0.3 |
| Styling | Tailwind CSS | v4 |
| Database | PostgreSQL | ✅ |
| ORM | Prisma | 6.19.3 |
| Backend API | Next.js API Routes | ✅ |
| Backend Python | FastAPI | 0.136.3 (minimal) |
| Auth | NextAuth.js | v5.0.0-beta.31 |
| Speech Recognition | Web Speech API | Browser-native |

**Số lượng bảng database:** 26 bảng
**Số lượng API endpoints:** ~20 routes

### 3. Về tính năng Gamification

| Tính năng | Trạng thái | Chi tiết |
|-----------|------------|----------|
| XP System | ✅ Hoàn thành | Công thức: `XP = (score/100) × 10 + dailyBonus` |
| Level System | ✅ Hoàn thành | Level 1-100, công thức: `⌊√(XP/100)⌋ + 1` |
| Streak System | ✅ Hoàn thành | Check-in hàng ngày, +10 XP/+2 ranking |
| Badge System | ✅ Hoàn thành | 11 loại badge, auto-award |
| Leaderboard | ✅ Hoàn thành | Tuần/tháng (all-time chưa có) |

**Badge types đã implement:** 11 loại
```
- first_step (XP >= 10)
- quick_start (XP >= 50)
- rising_star (XP >= 100)
- dedicated_learner (XP >= 500)
- champion (XP >= 1000)
- streak_starter (streak >= 3)
- streak_warrior (streak >= 7)
- streak_legend (streak >= 30)
- completionist (completed >= 10)
- completionist_pro (completed >= 50)
- completionist_master (completed >= 100)
```

### 4. Về UI/UX

| Tiêu chí | Đã đạt |
|----------|--------|
| Responsive design | ✅ Desktop + Mobile |
| Accessibility | ✅ Keyboard navigation, ARIA labels, focus states |
| HCI principles | ✅ Consistency, Feedback, Simplicity |
| Component library | ✅ ~50+ React components |

**Số màn hình chính:** 10+ pages
- Landing, Auth (login/register), Dashboard, Learning Map, Exercise Engine, IPA Chart, Profile, Badges, Leaderboard, Check-in, Admin

### 5. Về testing & quality

| Metric | Đạt được |
|--------|----------|
| Test files | 55 test suites (tăng từ 17) |
| Test coverage | ~80% |
| Build validation | ✅ Pass (prisma validate + tsc + npm test + npm build) |
| TypeScript errors | 0 errors |

---

## MỤC TIÊU THEO TỪNG GIAI ĐOẠN (từ kế hoạch 10 tuần)

### Tuần 1-2: Nghiên cứu & Phân tích ✅
- ✅ Nghiên cứu IPA, lỗi phát âm người Việt
- ✅ Nghiên cứu Gamification theory
- ✅ Nghiên cứu công nghệ Next.js, PostgreSQL, Web Speech API

### Tuần 3: Thiết kế ✅
- ✅ Thiết kế ERD (26 bảng)
- ✅ Thiết kế kiến trúc 3-tier
- ✅ Thiết kế UI/UX theo HCI

### Tuần 4-6: Phát triển Core ✅
- ✅ Auth system (đăng ký/đăng nhập + Google OAuth)
- ✅ Exercise engine (4 modes)
- ✅ Web Speech API integration
- ✅ Scoring logic

### Tuần 7: Gamification & Admin (đang làm 🟠)
- ✅ XP, Level, Streak, Badge logic
- ✅ Leaderboard tuần/tháng
- ✅ Admin CRUD cơ bản
- 🟠 Content CD2, CD4 chưa xong

### Tuần 8: Hoàn thiện (chưa đến)
- ⏳ Content đầy đủ 30 nhóm
- ⏳ Polish UI/UX
- ⏳ Fix bugs

### Tuần 9: Kiểm thử (chưa đến)
- ⏳ Unit + Integration tests
- ⏳ User acceptance testing
- ⏳ Performance optimization

### Tuần 10: Hoàn thiện báo cáo (chưa đến)
- ⏳ Viết báo cáo khóa luận
- ⏳ Chuẩn bị slide thuyết trình

---

## ĐÓNG GÓP CỦA ĐỀ TÀI (có thể viết)

### 1. Về mặt học thuật
- Nghiên cứu ứng dụng Gamification trong học ngữ âm tiếng Anh
- Áp dụng Self-Determination Theory (SDT) vào thiết kế hệ thống
- Tham khảo nghiên cứu: M. Sailer et al. (2017) về game design elements & psychological needs

### 2. Về mặt thực tiễn
- Cung cấp công cụ học phát âm miễn phí cho người Việt
- Tập trung vào các lỗi phát âm điển hình: /θ/-/s/, /ð/-/z/, /l/-/r/, /iː/-/ɪ/
- Audio local (93 files) - không phụ thuộc internet khi dùng

### 3. Về mặt công nghệ
- Kiến trúc full-stack hiện đại: Next.js 16 + React 18 + TypeScript + PostgreSQL
- Web Speech API (browser-native) - không cần backend ASR phức tạp
- Prisma ORM - type-safe database access
- Test-driven development (55 test files)

---

## VẤN ĐỀ THỰC TẾ CỦA NGƯỜI VIỆT HỌC PHÁT ÂM (từ lesson content)

**Các lỗi phát âm được tập trung:**

1. **Phụ âm răng /θ/, /ð/:**
   - Thường phát âm thành /s/, /z/ hoặc /t/, /d/
   - VD: "think" → "sink", "this" → "zis"

2. **Phụ âm /l/ vs /r/:**
   - Người Việt khó phân biệt
   - VD: "light" vs "right", "collect" vs "correct"

3. **Nguyên âm dài-ngắn:**
   - /iː/ vs /ɪ/: "sheep" vs "ship"
   - /uː/ vs /ʊ/: "pool" vs "pull"

4. **Phụ âm cuối:**
   - Thường bị nuốt hoặc phát âm yếu
   - VD: /p/, /t/, /k/ cuối từ

5. **Nguyên âm đôi:**
   - /eɪ/, /aɪ/, /ɔɪ/, /aʊ/ - khó phát âm trơn

**Số lượng bài tập theo difficulty:**
- Easy (Nguyên âm đơn): 24 bài
- Medium (Phụ âm + Nguyên âm đôi): 64 bài
- Hard (Minimal Pairs): 16 bài
- Advanced (Trọng âm & Nối âm): 8 bài

---

## METRICS THỰC TẾ (có thể dùng cho báo cáo)

### Code metrics
- **Tổng dòng code TypeScript:** ~15,000+ lines
- **Số components React:** ~50+ components
- **Số API routes:** ~20 routes
- **Database tables:** 26 bảng
- **Test suites:** 55 files

### Content metrics
- **Số từ vựng IPA:** ~200 từ (có IPA + audio)
- **Số âm vị:** 44 phonemes
- **Số nhóm âm:** 30 groups
- **Số bài tập:** 112 exercises
- **Số audio files:** 93 files (.mp3, local storage)

### Performance metrics (dev)
- **Build time:** ~30-60 giây
- **Dev server start:** ~5-10 giây
- **Database seed time:** ~10-20 giây

---

**LƯU Ý CHO AI:** Đây chỉ là DATA, cần viết lại thành văn phong học thuật với:
- Câu chủ đề rõ ràng
- Luận giải có logic
- Trích dẫn tài liệu tham khảo chuẩn IEEE
- Tránh liệt kê khô khan
