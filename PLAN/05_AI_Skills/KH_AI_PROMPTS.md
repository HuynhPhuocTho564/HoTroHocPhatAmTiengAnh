# 🚀 KẾ HOẠCH VIBE CODING (KH.md)

**Dự án:** Web_HoTroPhatAmEN
**Ngày cập nhật:** 08/06/2026 (Tuần 8)
**Tình trạng:** Đã hoàn thành 90% Frontend Core, Đang bắt đầu Backend API & Gamification.

Tài liệu này chứa các **Prompt (Lệnh)** chuẩn bị sẵn để copy-paste cho AI (Vibe Coding) nhằm hoàn thiện các phần còn thiếu dựa trên `PROGRESS_SUMMARY.md` và `project_spec.md`.

---

## 📌 NGUYÊN TẮC CHUNG CHO MỌI LỆNH
Khi giao việc cho AI, luôn kèm theo câu sau nếu cần nhấn mạnh/nhắc nhở:
> *"Hãy tuân thủ tuyệt đối 5 quy tắc trong file `.cursorrules`. Sử dụng Next.js 14 App Router, Tailwind CSS mobile-first, và Prisma. Đảm bảo file không quá 200 dòng, có comment tiếng Việt cho logic phức tạp."*

---

## 🛑 GIAI ĐOẠN 1: SỬA LỖI ACCESSIBILITY (CRITICAL - LÀM TRƯỚC)
*Hiện trạng: Frontend báo thiếu skip link, mobile menu, aria-labels.*

**Prompt 1.1: Sửa Navbar & Thêm Skip Links**
> "Hãy đọc file `frontend/src/components/layout/Navbar.tsx`. Thêm tính năng 'Skip to main content' (skip link) ẩn, chỉ hiện khi focus bằng phím Tab để đáp ứng chuẩn WCAG. Thêm Mobile Menu (Hamburger icon) có thể toggle mở/đóng menu điều hướng trên màn hình nhỏ. Đảm bảo dùng đầy đủ thuộc tính `aria-expanded` và `aria-controls`."

**Prompt 1.2: Thêm Aria-labels & Table Captions**
> "Hãy quét các file UI components trong `frontend/src/components/ui/` và các trang quản lý trong `frontend/src/app/admin/`. Bổ sung thuộc tính `aria-label` cho tất cả các nút bấm không có text (chỉ có icon). Thêm thẻ `<caption>` mô tả nội dung cho tất cả các bảng dữ liệu (tables) để tuân thủ WCAG 2.1 AA."

---

## 🎙️ GIAI ĐOẠN 2: HOÀN THIỆN TRANG LUYỆN TẬP (PRACTICE PAGE)
*Hiện trạng: Mới có các component nhỏ, chưa ráp thành trang `/practice` hoàn chỉnh.*

**Prompt 2.1: Tạo trang Practice cơ bản (Bảng IPA)**
> "Hãy tạo trang `/practice` (`frontend/src/app/practice/page.tsx`). Trang này hiển thị Bảng IPA tiếng Anh (44 âm vị) sử dụng Grid layout của Tailwind. Mỗi âm vị là một card nhỏ có thể click. Hãy thiết kế theo chuẩn Mobile-first. Tạm thời sử dụng mảng dữ liệu mock data cho 44 âm vị gồm âm (vd: /θ/) và ví dụ (vd: think)."

**Prompt 2.2: Tích hợp Ghi âm vào trang Practice**
> "Mở rộng trang `/practice`. Import và sử dụng component `RecordButton` hiện có. Khi người dùng click vào một card âm vị, hãy mở một Modal hiển thị chi tiết âm vị đó, có nút phát âm thanh mẫu và gọi `RecordButton` để thu âm. Nhận kết quả transcript từ ghi âm, so khớp với âm vị hiện tại và hiển thị thông báo Đúng/Sai."

---

## ⚙️ GIAI ĐOẠN 3: XÂY DỰNG NEXT.JS API & BACKEND (TUẦN 8)
*Lưu ý: Kiến trúc dự án dùng Next.js API Routes để thao tác Database PostgreSQL thông qua Prisma. FastAPI chỉ đóng vai trò AI Gateway.*

**Prompt 3.0: Cập nhật lại Database Schema (Làm trước khi viết API)**
> "Hãy mở file `frontend/prisma/schema.prisma` và kiểm tra. Tôi đã cập nhật các model `Leaderboard` (lưu điểm theo user và kỳ), `QuestionAttempt` (lưu kết quả từng câu), và `UserBadge` (thêm validPeriod). Hãy chạy lệnh `npx prisma db push` và `npx prisma generate` để cập nhật Database và Prisma Client trước khi tiến hành viết code API."

**Prompt 3.1: API Routes Submit Bài Tập**
> "Hãy tạo Next.js API Route `POST /api/exercise/submit`. Endpoint này nhận chuỗi JSON gồm: `userId`, `MaBT`, `transcript`, `isCorrect`. Sử dụng Prisma để lưu kết quả vào bảng theo schema hiện tại (vd: CHITIETLAMBAI). **Yêu cầu Bắt buộc:** Hãy dùng Prisma `$transaction` để đảm bảo tính toàn vẹn dữ liệu."

**Prompt 3.2: Logic tính điểm & Huy hiệu (Gamification)**
> "Viết một utility function `checkAndAwardBadges(userId: string)` bằng TypeScript trong `frontend/src/lib/gamification.ts`. Hàm này dùng Prisma lấy tổng số bài user đã làm thành công, kiểm tra các điều kiện đạt mốc (10, 50, 100 bài) để cấp huy hiệu tương ứng. Hàm này sẽ được gọi bên trong API `/api/exercise/submit`."

**Prompt 3.3: Khởi tạo FastAPI (AI Gateway)**
> "Hãy vào thư mục `backend/`. Viết file `main.py` khởi tạo ứng dụng FastAPI cơ bản. Cấu hình CORS middleware để cho phép nhận request từ `http://localhost:3000`. Viết 1 endpoint `GET /health` trả về `{"status": "ok"}`. Đồng thời tạo hoặc cập nhật `requirements.txt` có chứa `fastapi` và `uvicorn`."

---

## 🏆 GIAI ĐOẠN 4: BẢNG XẾP HẠNG (LEADERBOARD)

**Prompt 4.1: API Lấy Bảng Xếp Hạng**
> "Tạo Next.js API Route `GET /api/leaderboard`. Hàm nhận query parameter `type='tuan'` hoặc `'thang'`. Truy vấn DB bằng Prisma để lấy ra Top 10 user có điểm xếp hạng cao nhất trong kỳ tương ứng. Sắp xếp thứ tự giảm dần và trả về mảng JSON."

**Prompt 4.2: Giao diện Leaderboard**
> "Tạo trang `/leaderboard` (`frontend/src/app/leaderboard/page.tsx`). Xây dựng giao diện bảng xếp hạng có 2 tab 'Tuần' và 'Tháng'. Sử dụng Tailwind CSS, thiết kế theo style hiện đại. Top 1, 2, 3 hãy làm nổi bật bằng background gradient hoặc icon vương miện (Vàng, Bạc, Đồng). Gọi fetch API từ `/api/leaderboard` để render dữ liệu."

---

## 📝 HƯỚNG DẪN SỬ DỤNG FILE NÀY
1. Cóp nhặt từng **Prompt** dán vào khung chat với AI (ví dụ: Cursor, Cline, Claude...).
2. Đợi AI viết code, sau đó test thực tế trên `http://localhost:3000`.
3. Nếu gặp lỗi hoặc AI làm lệch hướng, hãy gõ thêm: `"Vui lòng xem lại quy tắc trong .cursorrules và sửa lỗi sau: [Mô tả lỗi]"`.
4. Làm lần lượt từ Giai đoạn 1 đến Giai đoạn 4 để đảm bảo tiến độ. Cập nhật `PROGRESS_SUMMARY.md` sau khi xong mỗi phần lớn.
