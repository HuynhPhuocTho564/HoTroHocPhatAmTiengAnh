# 📅 Kế Hoạch Thực Hiện & Tổng Quan Kỹ Thuật (Cập nhật 01/06/2026)

> **Lưu ý cho AI Agent:** Đây là kế hoạch chi tiết về kỹ thuật và tiến độ thực tế (Vibe Coding) dựa trên mốc thời gian hiện tại. Đọc kỹ phần logic Gamification và Web Speech API.

---

## 1. Tổng Quan Kỹ Thuật: Web Speech API (Phân tích Giọng Nói)

- **API sử dụng:** `Web Speech API — window.SpeechRecognition` (hỗ trợ chủ yếu trên Chrome/Edge).
- **Ngôn ngữ:** `lang: "en-US"`.
- **Nơi xử lý:** Hoàn toàn phía **Frontend (Next.js)** — không cần gọi qua FastAPI cho phần chuyển đổi giọng nói thành văn bản này.
- **Logic So Khớp (Normalize):**
  Chuyển text thành chữ thường, xóa khoảng trắng thừa và dấu câu trước khi so sánh.
  ```javascript
  function normalize(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z\s]/g, ""); // bỏ dấu câu
  }
  const isCorrect = normalize(transcript) === normalize(answer);
  // Ví dụ: đáp án "cat" → học viên nói "Cat." → "cat" === "cat" ✓
  ```
- **Hiển thị:** Chữ học viên vừa nói + badge Đúng / Sai.
- **Hạn chế:** Chỉ hoạt động tốt trên Chrome & Edge — cần có thông báo fallback nếu dùng trình duyệt khác.
  *(Nhắc AI: kiểm tra `window.SpeechRecognition || window.webkitSpeechRecognition` — nếu không có thì hiện thông báo "Vui lòng dùng Chrome hoặc Edge để sử dụng tính năng này.")*

### Các Dạng Bài Tập Áp Dụng Web Speech API

1. **Dạng 1: Nghe âm IPA → Đọc lại**
   Hệ thống phát âm mẫu (TEPAMTHANH) → Học viên đọc lại → Web Speech API nhận diện → So khớp với ký tự Latin tương ứng. (VD: âm `/æ/`, học viên có thể đọc "æ" hoặc từ "cat").
2. **Dạng 2: Nhìn từ → Phát âm**
   Hiển thị từ tiếng Anh (VD: "apple") → Học viên đọc → API trả về text → So khớp `normalize(transcript) === normalize("apple")`.
3. **Dạng 3: Nhìn câu → Đọc cả câu**
   Hiển thị cả câu → Học viên đọc → So khớp toàn câu sau khi normalize cho đơn giản, tránh phức tạp hóa.
4. **Dạng 4: Chọn đáp án có ghi âm**
   Hiển thị nhiều phương án (từ PHUONG_AN_CAU_HOI) → Học viên nói phương án mình chọn → So khớp với phương án đúng.

### Luồng Xử Lý Frontend (Mỗi Lần Ghi Âm)
1. Học viên bấm nút **Ghi âm** → Hiện icon đang nghe.
2. Web Speech API khởi động: `recognition.lang = "en-US"`, `recognition.start()`.
3. Học viên nói → API trả về `transcript` (text).
4. Hiển thị: *"Bạn vừa nói: [transcript]"*.
5. So khớp `normalize(transcript)` với `normalize(answer)`.
6. Hiện badge **Đúng ✓** hoặc **Sai ✗** + hiển thị đáp án đúng nếu sai.
7. Gọi API backend lưu kết quả vào bảng `CHITIETLAMBAI`.

### API Backend Cần Thiết Cho Phần Này
- `POST /api/exercise/submit`: Lưu kết quả (`MaBT`, `MaCauHoi`, `transcript`, `isCorrect`, `ThoiGianLam`).
- `GET /api/exercise/[id]`: Lấy nội dung bài tập + câu hỏi + phương án.
- `GET /api/exercise/result/[id]`: Lấy kết quả bài đã làm để hiển thị.

---

## 2. Gamification: Phân Loại Huy Hiệu

### Huy Hiệu Vĩnh Viễn (Không Mất)
- **Khởi đầu:** Hoàn thành bài tập đầu tiên.
- **Chăm chỉ:** Hoàn thành 10 bài tập.
- **Bền bỉ:** Hoàn thành 50 bài tập.
- **Chuyên gia:** Hoàn thành 100 bài tập.
- **Hoàn hảo:** Đạt 20 câu đúng liên tiếp.
- **Chinh phục chủ đề:** Hoàn thành toàn bộ 1 chủ đề.
- **Vượt cấp:** Hoàn thành cấp độ Khó.
- **Bậc thầy IPA:** Hoàn thành tất cả chủ đề.

### Huy Hiệu Tạm Thời (Theo Kỳ - Có Thể Mất Trạng Thái Active)
- **Ngôi sao tuần:** Top 3 bảng xếp hạng tuần (Reset mỗi thứ Hai).
- **Ngôi sao tháng:** Top 3 bảng xếp hạng tháng (Reset ngày 1 hàng tháng).
- **Siêng năng tuần:** Làm ít nhất 5 bài trong tuần (Reset mỗi thứ Hai).
- **Siêng năng tháng:** Làm ít nhất 20 bài trong tháng (Reset ngày 1 hàng tháng).

*Lưu ý:* Huy hiệu tạm thời: Học viên GIỮ hình ảnh huy hiệu đã đạt trong lịch sử (từng đạt được), nhưng trạng thái "đang có (active)" sẽ mất nếu kỳ tiếp theo không đạt lại. Cần lưu `ThoiGianDat` + `KyHieuLuc` trong bảng liên kết `USER_HUYHIEU`.

---

## 3. Logic Backend: Kiểm Tra Huy Hiệu

Sau mỗi lần gọi `POST /api/exercise/submit`, backend chạy hàm kiểm tra:
```javascript
async function checkAndAwardBadges(userId) {
  // 1. Đếm tổng bài hoàn thành → xét huy hiệu mốc
  // 2. Đếm câu đúng liên tiếp → xét "Hoàn hảo"
  // 3. Kiểm tra hoàn thành chủ đề → xét "Chinh phục chủ đề"
  // 4. Cập nhật điểm bảng xếp hạng tuần + tháng
  // 5. Kiểm tra top 3 → xét huy hiệu tạm thời
  // 6. Trả về danh sách huy hiệu mới nhận (nếu có)
}
```
*Trả về huy hiệu mới trong response của submit → Frontend hiển thị popup chúc mừng ngay lúc đó.*

### API Cần Xây Dựng Thêm Cho Gamification
- `GET /api/leaderboard?type=tuan` hoặc `?type=thang`: Lấy top 10 + thứ hạng người dùng hiện tại.
- `GET /api/badges/[userId]`: Lấy toàn bộ huy hiệu đã đạt (vĩnh viễn + tạm thời theo lịch sử).
- `GET /api/badges/active/[userId]`: Chỉ lấy huy hiệu đang có hiệu lực (để hiển thị profile).
- `POST /api/leaderboard/reset`: Chạy bằng cron job, reset bảng xếp hạng theo kỳ (gọi từ server, không public).

---

## 4. Tóm Tắt Lại Tech Stack

1. **Frontend (Giao diện người dùng):**
   - Framework: Next.js 14 (App Router)
   - Ngôn ngữ: TypeScript
   - Styling: Tailwind CSS
2. **Backend (Máy chủ xử lý):**
   - BFF (Backend for Frontend): Next.js API Routes (quản lý user, session, routing).
   - Core Engine / AI Gateway: Python FastAPI (chuyên xử lý phân tích giọng nói nâng cao, làm trạm kết nối API ASR nếu cần).
3. **Cơ sở dữ liệu:** PostgreSQL.
4. **Công nghệ cốt lõi:**
   - AI/ML: ASR (Automatic Speech Recognition) bằng Web Speech API (trước mắt) hoặc mô hình Python phía backend.
   - Gamification Logic: Tính XP, Streak, Badges, Leaderboard.

---

## 5. Kế Hoạch Vibe Coding (Tiến độ: Tuần 7 tính từ 01/06/2026)

### GIAI ĐOẠN 1: KHỞI TẠO & NỀN TẢNG (Tuần 1 -> Tuần 4)
*Lẽ ra đã xong, cần Vibe Coding để tăng tốc tối đa nếu trễ.*
- **Tuần 2 & 3:** Thiết kế ERD, lập CSDL PostgreSQL, tạo boilerplate Next.js và FastAPI. Thiết lập Prisma schema.
- **Tuần 4:** Đăng ký/đăng nhập (Auth UI & Logic với NextAuth.js), thiết kế theo nguyên tắc HCI.

### GIAI ĐOẠN 2: CHỨC NĂNG CỐT LÕI (Tuần 5 -> Tuần 6)
- **Tuần 5:** Component Bảng IPA tương tác (Tailwind grid, click phát âm thanh). Custom hook `useAudioRecorder` (lấy Blob audio, tạo URL nghe lại).
- **Tuần 6:** Tích hợp ASR (VD: dùng Web Speech API ở Frontend như mô tả ở trên). Nếu dùng FastAPI thì viết endpoint upload audio và phân tích. Viết hàm so sánh chuỗi (normalize).

### GIAI ĐOẠN 3: GAMIFICATION & HOÀN THIỆN (Tuần 7 -> Tuần 8)
**(Tiến độ hiện tại: 01/06/2026 - Bắt đầu Tuần 7)**
- **Tuần 7 (Trọng tâm hiện tại):**
  - **Nối FE & BE:** Gửi kết quả làm bài lên Next.js API Route hoặc FastAPI (hiển thị loading spinner).
  - **Gamification Logic:** Viết thuật toán cộng kinh nghiệm (XP) nếu điểm >80. Viết hàm kiểm tra cấp huy hiệu `checkAndAwardBadges` và chèn vào CSDL.
- **Tuần 8:** Dashboard User (Hiển thị avatar, progress bar XP, lưới huy hiệu, heatmap GitHub-style cho lịch sử học). Trang Bảng Xếp Hạng (Tuần/Mọi thời đại).

### GIAI ĐOẠN 4: KIỂM THỬ & BÁO CÁO (Tuần 9 -> Tuần 10)
- **Tuần 9:** Kiểm thử hiệu năng giao diện (Lighthouse), Refactor clean code (tách logic ra file riêng).
- **Tuần 10:** Tổng hợp kết quả viết Báo cáo Khóa luận (Đánh giá kết quả đạt được: Auth, chấm điểm giọng nói, xếp hạng...).
