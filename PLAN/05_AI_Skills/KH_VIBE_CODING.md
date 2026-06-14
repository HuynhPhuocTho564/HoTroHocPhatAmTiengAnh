# 🚀 KẾ HOẠCH VIBE CODING (KH_VIBE_CODING.md)

> **Dựa trên:** `project/CURRENT_SYSTEM_STATUS.md` (Cập nhật 08/06/2026), `project/KE_HOACH_THUC_HIEN.md` và `project/PROJECT_CONTEXT.md`.
> **Mục tiêu chính:** Hoàn thiện Authentication, Tích hợp Web Speech API (Đánh giá giọng nói), và logic Gamification (XP, Level, Leaderboard, Badges) trong Sprint Tuần 8 & 9.

---

## 📌 LƯU Ý KHI DÙNG PROMPT VIBE CODING
Khi bạn gửi lệnh cho AI Agent (Cursor/Claude/...), **luôn chèn thêm câu sau** để giữ AI đi đúng hướng thiết kế hiện tại:
> *"Hãy tuân thủ file `.cursorrules`, `project/PROJECT_CONTEXT.md` và HÃY ĐỌC CÁC KỸ NĂNG TRONG THƯ MỤC `.agents/skills/` trước khi code. Hệ thống đang dùng Next.js 14 App Router, Tailwind CSS, Prisma (PostgreSQL). Đừng dùng raw SQL, hãy dùng Prisma Transaction cho các thao tác phức tạp."*

---

## 🛑 BƯỚC 0: CẬP NHẬT DATABASE SCHEMA (LÀM TRƯỚC TIÊN)
*DB hiện tại chưa có trường `xp`, `level` và thiếu bảng lưu chi tiết từng câu hỏi.*

**Prompt 0.1: Cập nhật Schema**
> "Hãy mở file `frontend/prisma/schema.prisma`. 
> 1. Thêm trường `xp` (Int, default 0) và `level` (Int, default 1) vào model `User`.
> 2. Đảm bảo bảng `Leaderboard` đã có đủ trường: `userId`, `score`, `correctAnswers`, `type` (tuan/thang), `period`.
> 3. Đảm bảo có bảng `QuestionAttempt` để lưu `transcript` và `isCorrect` cho từng câu hỏi (liên kết với ExerciseAttempt).
> 4. Sau đó chạy `npx prisma db push` và `npx prisma generate`."

---

## 🔐 GIAI ĐOẠN 1: AUTHENTICATION & SEED DATA (TUẦN 8)
*Tiến độ: UI Admin đã có nhưng chưa có auth thực, DB chưa có dữ liệu mẫu để test.*

**Prompt 1.1: Cài đặt NextAuth.js**
> "Hãy cấu hình NextAuth.js cho dự án. Tạo file `frontend/src/lib/auth.ts` cấu hình CredentialsProvider kết nối với Prisma. Viết logic check/mã hóa mật khẩu bằng bcrypt. Tạo API route `/api/auth/[...nextauth]/route.ts`. Tạo trang `/login` và `/register` với UI Tailwind CSS cơ bản."

**Prompt 1.2: Seed Dữ liệu Mẫu (DB Seed)**
> "Viết một script `seed.ts` trong thư mục `prisma/` để tạo sẵn dữ liệu mẫu. Cần tạo: 5 Topics (Nguyên âm đơn, Nguyên âm đôi...), khoảng 20 bài học (Lessons/Exercises) và một vài câu hỏi mẫu (Question) kèm phương án (AnswerOption). Đừng quên update `package.json` để có lệnh `prisma db seed`."

---

## 🎙️ GIAI ĐOẠN 2: TÍCH HỢP GHI ÂM & CHẤM ĐIỂM (TUẦN 8)
*Tiến độ: Web Speech API chạy hoàn toàn ở Browser (Next.js Client Components), FastAPI chưa cần thiết cho phần này.*

**Prompt 2.1: Logic So Khớp Text (Normalize)**
> "Viết một hàm tiện ích `normalize(text: string): string` trong `frontend/src/lib/utils.ts`. Hàm này nhận vào một chuỗi, chuyển đổi thành chữ thường (lowercase), xóa hết khoảng trắng thừa ở hai đầu và xóa mọi dấu câu (chỉ giữ lại chữ cái a-z và khoảng trắng giữa các chữ)."

**Prompt 2.2: Hook Web Speech API**
> "Viết một custom hook `useSpeechRecognition` bằng TypeScript. Hook này kiểm tra `window.SpeechRecognition || window.webkitSpeechRecognition`. Nếu trình duyệt hỗ trợ, khởi tạo với `lang="en-US"`, cung cấp các hàm `start()`, `stop()` và trả về state `transcript` (đoạn text user đọc) và `isListening`."

**Prompt 2.3: Tích hợp vào Component Bài Tập & Submit**
> "Mở trang bài tập (hoặc components ExerciseType1, Type3, Type4). Sử dụng `RecordButton` kết hợp với hook `useSpeechRecognition`. Khi có `transcript`, gọi hàm `normalize` so sánh với đáp án đúng. Sau đó gọi API `POST /api/exercises/submit` (gửi userId, MaCauHoi, transcript, isCorrect) để lưu vào DB."

---

## 🎮 GIAI ĐOẠN 3: GAMIFICATION & XP LOGIC (TUẦN 9)
*Tiến độ: UI cho Bảng xếp hạng, Badge, XP Bar đã có, nhưng chưa có API Backend và logic cấp phát.*

**Prompt 3.1: API Submit Bài Tập & Tính XP**
> "Viết API Route `POST /api/exercises/submit`. Payload gồm userId, kết quả từng câu. Sử dụng **Prisma Transaction** để: (1) Lưu `ExerciseAttempt` và `QuestionAttempt`, (2) Tính toán XP nhận được (VD: mỗi câu đúng +10 XP), (3) Cộng XP cho User, (4) Kiểm tra Level up (Công thức: `level = sqrt(totalXP / 100)`)."

**Prompt 3.2: Logic Cấp Huy Hiệu (Badges)**
> "Tạo hàm `checkAndAwardBadges(userId)` trong thư mục lib. Hàm này sẽ đếm tổng bài học hoàn thành, tính chuỗi ngày học... Nếu thỏa điều kiện (VD: Hoàn thành 10 bài, 50 bài), insert huy hiệu tương ứng vào bảng `UserBadge`. Hàm này được gọi trong Transaction của API submit ở trên."

**Prompt 3.3: API Bảng Xếp Hạng (Leaderboard)**
> "Viết API `GET /api/leaderboard?type=tuan|thang` để truy vấn top 10 Users có XP/điểm cao nhất trong kỳ từ bảng `Leaderboard` hoặc bảng `User` (tùy cấu trúc DB). Update trang `/leaderboard` để fetch API này và render dữ liệu thực thay vì mock data."

---

## 💡 CÁCH SỬ DỤNG KẾ HOẠCH NÀY
1. Bạn hãy copy từng Lệnh (Prompt) trong các hộp trích dẫn (`> "..."`) và gửi cho AI.
2. Kiểm tra UI trên `localhost:3000` hoặc test bằng Postman sau mỗi lệnh.
3. Liên tục đối chiếu với file `project/CURRENT_SYSTEM_STATUS.md` để theo dõi tiến độ chung của tổng dự án.
