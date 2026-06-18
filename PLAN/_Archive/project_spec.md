# Tài liệu dự án: Hệ thống học ngữ âm tiếng Anh tích hợp Gamification

---

## PHẦN 1: TECH STACK

| Tầng | Công nghệ | Vai trò |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS | Giao diện người dùng |
| BFF | Next.js API Routes | Quản lý user, session, lưu kết quả bài tập |
| AI Gateway | Python FastAPI | Nhận kết quả từ Web Speech API, xử lý logic gamification |
| Database | PostgreSQL | Lưu trữ toàn bộ dữ liệu |
| Phát âm | Web Speech API (browser built-in) | Nhận diện giọng nói — chỉ hoạt động trên Chrome/Edge |

> **Lưu ý quan trọng:** Không dùng XP, không có Streak. Không tích hợp Whisper hay API ASR bên ngoài. Web Speech API chạy hoàn toàn phía Frontend — FastAPI không xử lý audio.

---

## PHẦN 2: CÁC USE CASE CHÍNH

### UC1 — Quản lý người dùng
Bảng liên quan: `USER`, `VAITRO`
- Đăng ký tài khoản
- Đăng nhập / Đăng xuất
- Xem và chỉnh sửa profile

### UC2 — Lộ trình học (Learning Map)
Bảng liên quan: `BANDOBAIHOC`, `CHUDE`, `CAPDO`, `BAITAP`
- Xem bản đồ bài học dạng node kết nối
- Chọn chủ đề và cấp độ
- Chọn bài tập để bắt đầu

### UC3 — Luyện phát âm (Core)
Bảng liên quan: `TEPAMTHANH`, `CAUHOI`, `PHUONG_AN_CAU_HOI`, `CHITIETLAMBAI`, `LOAI_CAU_HOI`
- Xem bảng IPA tương tác, click để nghe âm mẫu
- Ghi âm bằng Web Speech API → nhận text transcript
- So khớp transcript với đáp án → hiển thị "Bạn vừa nói: [text]" + Đúng/Sai
- Lưu kết quả vào `CHITIETLAMBAI`

### UC4 — Gamification
Bảng liên quan: `HUYHIEU`, `XEPHANG`
- Nhận huy hiệu vĩnh viễn (mốc thành tích)
- Nhận huy hiệu tạm thời (theo tuần/tháng — có thể mất)
- Xem bảng xếp hạng tuần và tháng

---

## PHẦN 3: LOGIC CỐT LÕI

### 3.1 Web Speech API — Luồng xử lý phát âm

```
Học viên bấm [Ghi âm]
  → recognition.lang = "en-US" → recognition.start()
  → Nhận transcript (text)
  → Hiển thị: "Bạn vừa nói: [transcript]"
  → normalize(transcript) so với normalize(answer)
  → Hiển thị: Đúng ✓ / Sai ✗ + đáp án đúng nếu sai
  → Gọi POST /api/exercise/submit → lưu CHITIETLAMBAI
```

**Hàm normalize:**
```typescript
function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z\s]/g, "")
}
const isCorrect = normalize(transcript) === normalize(answer)
```

**Kiểm tra trình duyệt:**
```typescript
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
if (!SpeechRecognition) {
  alert("Vui lòng dùng Chrome hoặc Edge để sử dụng tính năng ghi âm.")
}
```

### 3.2 Các dạng bài tập

| Dạng | Mô tả | So khớp |
|---|---|---|
| Nghe → đọc lại | Phát âm thanh mẫu IPA → học viên đọc lại | transcript === từ/âm tương ứng |
| Nhìn từ → phát âm | Hiển thị từ tiếng Anh → học viên đọc | transcript === từ đó |
| Đọc cả câu | Hiển thị câu → học viên đọc | normalize toàn câu |
| Chọn đáp án bằng giọng nói | Nói tên phương án → so với phương án đúng | transcript === phương án đúng |

### 3.3 Gamification — Bảng xếp hạng

**Công thức tính điểm:**
```
DiemXepHang = (SoCauDung × 2) + (SoBaiHoanThanh × 1)
```

**Hai bảng song song:**
- Bảng tuần: thứ Hai 00:00 → Chủ Nhật 23:59. Reset mỗi thứ Hai. `KyXepHang = "2026-W22"`
- Bảng tháng: ngày 1 → cuối tháng. Reset ngày 1. `KyXepHang = "2026-06"`

**Cập nhật:** Sau mỗi lần `POST /api/exercise/submit` — không cần realtime socket.

**Cấu trúc bảng XEPHANG (bổ sung so với ERD gốc):**
```sql
XEPHANG {
  MaXH              PK
  UserID            FK → USER
  DiemSo            INT
  SoCauDung         INT
  SoBaiLam          INT
  LoaiKy            ENUM('tuan', 'thang')
  KyXepHang         VARCHAR  -- "2026-W22" hoặc "2026-06"
  ThoiGianCapNhat   TIMESTAMP
}
```

### 3.4 Gamification — Huy hiệu

**Loại 1: Huy hiệu vĩnh viễn** (đạt một lần, giữ mãi)

| Tên | Điều kiện |
|---|---|
| Khởi đầu | Hoàn thành bài tập đầu tiên |
| Chăm chỉ | Hoàn thành 10 bài tập |
| Bền bỉ | Hoàn thành 50 bài tập |
| Chuyên gia | Hoàn thành 100 bài tập |
| Hoàn hảo | Đạt 20 câu đúng liên tiếp |
| Chinh phục chủ đề | Hoàn thành toàn bộ 1 chủ đề |
| Vượt cấp | Hoàn thành cấp độ Khó |
| Bậc thầy IPA | Hoàn thành tất cả chủ đề |

**Loại 2: Huy hiệu tạm thời** (có thể mất nếu kỳ sau không đạt lại)

| Tên | Điều kiện | Reset |
|---|---|---|
| Ngôi sao tuần | Top 3 bảng xếp hạng tuần | Mỗi thứ Hai |
| Ngôi sao tháng | Top 3 bảng xếp hạng tháng | Ngày 1 hàng tháng |
| Siêng năng tuần | Làm ≥ 5 bài trong tuần | Mỗi thứ Hai |
| Siêng năng tháng | Làm ≥ 20 bài trong tháng | Ngày 1 hàng tháng |

> Học viên **giữ lịch sử** huy hiệu tạm thời đã đạt, nhưng trạng thái "đang có" mất nếu kỳ sau không đạt lại. Cần lưu `ThoiGianDat` + `KyHieuLuc` trong bảng liên kết USER–HUYHIEU.

**Logic kiểm tra huy hiệu** — chạy sau mỗi lần submit bài:
```typescript
async function checkAndAwardBadges(userId: string) {
  // 1. Đếm tổng bài hoàn thành → xét huy hiệu mốc
  // 2. Đếm câu đúng liên tiếp → xét "Hoàn hảo"
  // 3. Kiểm tra hoàn thành chủ đề → xét "Chinh phục chủ đề"
  // 4. Cập nhật điểm bảng xếp hạng tuần + tháng
  // 5. Kiểm tra top 3 → xét huy hiệu tạm thời
  // 6. Trả về danh sách huy hiệu mới nhận (nếu có)
  //    → Frontend hiển thị popup chúc mừng
}
```

---

## PHẦN 4: KẾ HOẠCH VIBE CODING THEO TỪNG GIAI ĐOẠN

### Giai đoạn 1: Setup & Nền tảng (Tuần 1–4: 20/04–17/05)

**Tuần 2–3 (27/04–10/05): Database & Khởi tạo project**

Prompt tạo schema:
> "Tôi dùng PostgreSQL cho Next.js 14. Hãy viết file `schema.prisma` dựa trên ERD này. Các bảng chính: USER, BANDOBAIHOC, CHUDE, CAPDO, BAITAP, CAUHOI, PHUONG_AN_CAU_HOI, LOAI_CAU_HOI, TEPAMTHANH, CHITIETLAMBAI, HUYHIEU, XEPHANG, VAITRO. Xác định rõ quan hệ 1-n."

Prompt khởi tạo FastAPI:
> "Tạo boilerplate Python FastAPI cơ bản, cấu hình CORS nhận request từ localhost:3000, có endpoint GET /health."

**Tuần 4 (11/05–17/05): Auth & Admin cơ bản (UC1)**

Prompt Auth:
> "Tạo trang Đăng nhập và Đăng ký bằng Next.js 14 App Router, Tailwind CSS. Giao diện tối giản, nút lớn, có thông báo lỗi/thành công rõ ràng. Setup NextAuth.js Credentials Provider kết nối bảng USER trong PostgreSQL bằng Prisma."

Prompt Admin:
> "Tạo trang Admin quản lý: Người dùng, Chủ đề, Cấp độ, Loại câu hỏi. Dùng Next.js Server Components để fetch dữ liệu, Tailwind CSS layout dạng bảng có phân trang."

---

### Giai đoạn 2: Chức năng cốt lõi (Tuần 5–6: 18/05–31/05)

**Tuần 5 (18/05–24/05): Bảng IPA + Ghi âm (UC3 — phần 1)**

Prompt bảng IPA:
> "Tạo React Component hiển thị Bảng IPA tiếng Anh (Vowels & Consonants) bằng Tailwind grid. Mỗi âm vị là một card có thể click. Khi click: phát audio từ URL truyền vào và hiện nút Ghi âm."

Prompt Web Speech API:
> "Viết custom hook React `useWebSpeechRecognition`. Chức năng: start, stop, trả về `transcript` (string) và `isListening` (boolean). Dùng `window.SpeechRecognition || window.webkitSpeechRecognition`, lang='en-US'. Nếu trình duyệt không hỗ trợ, hiện thông báo yêu cầu dùng Chrome hoặc Edge."

**Tuần 6 (25/05–31/05): Bài tập & Chấm điểm (UC3 — phần 2)**

Prompt màn hình làm bài:
> "Tạo trang làm bài tập Next.js. Hiển thị câu hỏi từ API, tích hợp hook `useWebSpeechRecognition`. Sau khi ghi âm: hiện text 'Bạn vừa nói: [transcript]' và badge Đúng/Sai. Nếu sai thì hiện đáp án đúng. Sau đó gọi POST /api/exercise/submit lưu kết quả."

Prompt API submit:
> "Viết Next.js API Route POST /api/exercise/submit nhận: userId, MaBT, MaCauHoi, transcript, isCorrect, ThoiGianLam. Lưu vào bảng CHITIETLAMBAI bằng Prisma. Sau khi lưu, gọi hàm checkAndAwardBadges(userId) và cập nhật bảng XEPHANG."

---

### Giai đoạn 3: Gamification & Tiến trình (Tuần 7–8: 01/06–14/06)

**Tuần 7 (01/06–07/06): Huy hiệu & Bảng xếp hạng (UC4)**

Prompt logic huy hiệu:
> "Viết function TypeScript `checkAndAwardBadges(userId)` chạy ở Next.js API Route. Kiểm tra: tổng bài hoàn thành (10, 50, 100), câu đúng liên tiếp (20), hoàn thành chủ đề, top 3 bảng tuần/tháng. Nếu đủ điều kiện: insert vào bảng liên kết USER–HUYHIEU với ThoiGianDat và KyHieuLuc. Trả về danh sách huy hiệu mới nhận."

Prompt bảng xếp hạng:
> "Viết API GET /api/leaderboard?type=tuan hoặc ?type=thang. Tính DiemXepHang = (SoCauDung × 2) + (SoBaiLam × 1) cho kỳ hiện tại, trả top 10 + thứ hạng user hiện tại. Tạo UI component Leaderboard Next.js + Tailwind: có 2 tab Tuần/Tháng, icon vương miện cho top 1-2-3."

Prompt cron job reset:
> "Viết API POST /api/leaderboard/reset (chỉ gọi nội bộ). Logic: tạo record mới cho kỳ tiếp theo trong XEPHANG, giữ nguyên dữ liệu kỳ cũ. Hướng dẫn setup Vercel Cron Jobs gọi endpoint này mỗi thứ Hai 00:00 và ngày 1 hàng tháng 00:00."

**Tuần 8 (08/06–14/06): Tiến trình & Thống kê**

Prompt bản đồ học:
> "Tạo component BANDOBAIHOC hiển thị dạng node kết nối (skill tree). Mỗi node là một bài tập: màu xanh nếu đã hoàn thành, màu xám nếu chưa. Fetch từ Next.js Server Component."

Prompt dashboard học viên:
> "Thiết kế trang Dashboard học viên Next.js + Tailwind. Gồm: avatar + tên, danh sách huy hiệu dạng grid (phân biệt vĩnh viễn/tạm thời), heatmap số lần làm bài theo ngày (dựa vào CHITIETLAMBAI), thứ hạng hiện tại bảng tuần và tháng."

Prompt trang Admin thống kê:
> "Tạo trang thống kê Admin: tổng học viên, tổng bài đã làm, tỉ lệ đúng/sai theo chủ đề. Dùng recharts hoặc chart.js hiển thị biểu đồ."

---

### Giai đoạn 4: Kiểm thử & Báo cáo (Tuần 9–10: 15/06–28/06)

**Tuần 9 (15/06–21/06): Test & Tối ưu**

Prompt kiểm thử:
> "Cho tôi checklist kiểm thử chức năng cho ứng dụng Next.js + PostgreSQL gồm: auth, ghi âm Web Speech API, lưu kết quả bài tập, gamification. Bao gồm các case edge: trình duyệt không hỗ trợ ghi âm, transcript rỗng, mất kết nối."

Prompt tối ưu:
> "Refactor component [dán code vào] cho clean hơn: tách logic ra custom hook, tách UI ra component nhỏ, đảm bảo dùng Server Component ở những chỗ không cần tương tác."

**Tuần 10 (22/06–28/06): Hoàn thiện báo cáo**
- Hoàn thiện 5 chương báo cáo
- Nộp giảng viên hướng dẫn

---

## PHẦN 5: CẤU TRÚC API TỔNG HỢP

### Next.js API Routes (BFF)
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập (NextAuth) |
| GET | /api/exercise/[id] | Lấy nội dung bài tập |
| POST | /api/exercise/submit | Lưu kết quả + kiểm tra huy hiệu |
| GET | /api/exercise/result/[id] | Xem kết quả bài đã làm |
| GET | /api/leaderboard?type= | Bảng xếp hạng tuần/tháng |
| POST | /api/leaderboard/reset | Reset kỳ (cron job nội bộ) |
| GET | /api/badges/[userId] | Toàn bộ huy hiệu lịch sử |
| GET | /api/badges/active/[userId] | Huy hiệu đang có hiệu lực |
| GET | /api/admin/stats | Thống kê cho Admin |

### Python FastAPI (AI Gateway)
| Method | Endpoint | Chức năng |
|---|---|---|
| GET | /health | Kiểm tra server |

> **Lưu ý:** FastAPI trong dự án này **không xử lý audio** (Web Speech API chạy ở browser). FastAPI được giữ lại trong kiến trúc để mở rộng sau nếu cần tích hợp ASR ngoài. Hiện tại chỉ cần endpoint /health.

---

## PHẦN 6: MẸO VIBE CODING HIỆU QUẢ

1. **Chia nhỏ component** — Đừng bắt AI viết cả trang. Viết `<AudioRecorderButton />`, `<PhoneticCard />`, `<LeaderboardTable />` rồi tự ghép lại.

2. **Server vs Client Component** — Yêu cầu AI dùng Server Components để fetch data từ database. Chỉ dùng `'use client'` ở những component cần tương tác: ghi âm, hiệu ứng gamification, tab switching.

3. **Proxy qua Next.js** — Frontend gọi `/api/exercise/submit`, route này xử lý logic rồi gọi FastAPI nếu cần. Tránh lỗi CORS và lộ thông tin kết nối database.

4. **Luôn nhắc AI về giới hạn Web Speech API** — Mỗi prompt liên quan đến ghi âm cần nhắc: "Kiểm tra `window.SpeechRecognition || window.webkitSpeechRecognition` trước khi khởi động."

5. **Kiểm tra ngay sau mỗi prompt** — Chạy thử từng component riêng lẻ trước khi ghép vào trang chính.
