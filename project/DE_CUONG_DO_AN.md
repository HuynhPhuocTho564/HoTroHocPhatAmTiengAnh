# 📄 Đề Cương Đồ Án – Xây Dựng Hệ Thống Hỗ Trợ Học Ngữ Âm Tiếng Anh Tích Hợp Gamification

> **Lưu ý cho AI Agent:** Đây là tài liệu gốc từ nhà trường. Đọc file này để hiểu đúng phạm vi,
> yêu cầu và timeline của đồ án trước khi thực hiện bất kỳ task nào.

---

## Tên Đề Tài

**Xây dựng hệ thống hỗ trợ học ngữ âm tiếng Anh tích hợp Gamification**

---

## 1. Mục Tiêu Đề Tài

Xây dựng hệ thống web hỗ trợ người học rèn luyện và cải thiện phát âm tiếng Anh theo chuẩn
bảng ký hiệu ngữ âm quốc tế **(IPA)**, tích hợp các cơ chế **Gamification** nhằm nâng cao động lực
và duy trì sự gắn kết của người học trong quá trình luyện tập.

---

## 2. Nội Dung Thực Hiện

### 2.1 Phân Tích Hệ Thống
- Tìm hiểu nhu cầu thực tế học phát âm tiếng Anh của học sinh, sinh viên để xác định các **lỗi ngữ âm phổ biến** và những âm vị IPA quan trọng; xây dựng cấu trúc bài học hợp lý
- Nghiên cứu và phân tích các ứng dụng luyện phát âm hiện có để xác định yêu cầu chức năng
- Nghiên cứu các **mô hình Gamification** phù hợp để lựa chọn cơ chế thúc đẩy động lực học tập hiệu quả nhất

### 2.2 Thiết Kế Hệ Thống
- Thiết kế cấu trúc **cơ sở dữ liệu quan hệ** bằng **PostgreSQL**
- Thiết kế kiến trúc tổng thể theo mô hình **client-server**
- Phác thảo giao diện người dùng trực quan theo nguyên tắc **HCI**
- Xây dựng hệ thống máy chủ bằng **Next.js API Routes** kết hợp **Python FastAPI**:
  - Lưu trữ thông tin người dùng
  - Quản lý tiến trình học tập
  - Kết nối với API phân tích giọng nói

### 2.3 Phát Triển Logic Gamification (Backend)
- Tính **điểm kinh nghiệm (XP)** cho mỗi lần luyện tập
- Duy trì **streak ngày** (chuỗi ngày luyện tập liên tiếp)
- Xét duyệt và trao **huy hiệu (badge)** dựa trên thành tích
- Cập nhật **bảng xếp hạng (leaderboard)** theo thời gian thực

### 2.4 Phát Triển Giao Diện Web (Frontend)
- Phát triển UI bằng **Next.js 14**, **TypeScript** và **Tailwind CSS**, tối ưu đa thiết bị
- Xây dựng component **bảng IPA tương tác**: chạm vào từng âm để nghe mẫu, xem mô phỏng khẩu hình và ghi âm thử
- Triển khai tính năng cốt lõi — Phân tích giọng nói:
  - Chấm điểm phát âm ở **cấp độ âm vị**
  - Phản hồi về **độ chính xác** và **độ trôi chảy** của từng âm

### 2.5 Kiểm Thử & Đánh Giá
- Kiểm thử chức năng ở cấp độ **đơn vị (unit test)** và **tích hợp (integration test)**
- Đánh giá độ chính xác phát hiện lỗi phát âm đặc trưng của **người Việt** qua bộ mẫu giọng nói thực tế

---

## 3. Phương Pháp Thực Hiện

### Nghiên Cứu Lý Thuyết
Tìm hiểu tài liệu học thuật và trực tuyến về:
- Next.js, TypeScript, PostgreSQL
- Các dịch vụ AI trong lĩnh vực **nhận dạng và đánh giá giọng nói (ASR)**
- Ngữ âm học (Phonetics) và bảng IPA
- Gamification trong giáo dục

### Thực Nghiệm
- Backend: **Next.js API Routes** + **Python FastAPI** (logic nghiệp vụ + phân tích phát âm)
- Frontend: **Next.js** + **TypeScript** + **Tailwind CSS**
- Database: **PostgreSQL**
- Tích hợp **AI** đánh giá phát âm
- Triển khai cơ chế **Gamification**

---

## 4. Kế Hoạch Thực Hiện

| Tuần | Thời gian | Công việc thực hiện |
|------|-----------|---------------------|
| **1** | 20/04 – 26/04/2026 | Nghiên cứu ngữ âm học, bảng IPA, lỗi phát âm người Việt; Nghiên cứu Gamification trong giáo dục; Nghiên cứu công nghệ; Viết đề cương chi tiết |
| **2** | 27/04 – 03/05/2026 | Phân tích nghiệp vụ chính; Xác định yêu cầu hệ thống |
| **3** | 04/05 – 10/05/2026 | Thiết kế ERD + mô hình dữ liệu logic; Thiết lập PostgreSQL; Khởi tạo Backend (Next.js API Routes + FastAPI); Thiết kế UI theo HCI |
| **4** | 11/05 – 17/05/2026 | Xây dựng chức năng **đăng ký / đăng nhập**; Phát triển API; Khởi tạo Frontend (Next.js + TS + Tailwind); Viết dự thảo Chương 1 |
| **5** | 18/05 – 24/05/2026 | Xây dựng **bảng IPA tương tác**; Phát triển module **ghi âm giọng nói**; Viết dự thảo Chương 2 |
| **6** | 25/05 – 31/05/2026 | Tích hợp **ASR** (nhận diện & đánh giá giọng nói); Xây dựng **logic phản hồi phát âm**; Viết dự thảo Chương 3 |
| **7** | 01/06 – 07/06/2026 | Phát triển module **Gamification**; Kết nối Frontend với API chấm điểm; Viết dự thảo Chương 4 |
| **8** | 08/06 – 14/06/2026 | Hoàn thiện giao diện **theo dõi tiến trình** cá nhân; Thiết kế giao diện **thành tích**; Viết dự thảo Chương 5 |
| **9** | 15/06 – 21/06/2026 | **Kiểm thử** chức năng; Tối ưu giao diện; Nộp báo cáo cho GVHD lần 1 |
| **10** | 22/06 – 28/06/2026 | **Hoàn thiện báo cáo** khóa luận |

---

## 5. Tóm Tắt Công Nghệ Sử Dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend API | Next.js API Routes + Python FastAPI |
| Database | PostgreSQL |
| Speech AI | ASR (Automatic Speech Recognition) |
| Gamification | XP, Streak, Badge, Leaderboard |
| Design Principle | HCI (Human-Computer Interaction) |
| IPA Standard | International Phonetic Alphabet |

---

## 6. Trạng Thái Hiện Tại (Cập nhật: 01/06/2026)

| Tuần | Trạng thái |
|------|-----------|
| Tuần 1 | ✅ Hoàn thành |
| Tuần 2 | ✅ Hoàn thành |
| Tuần 3 | ✅ Hoàn thành |
| Tuần 4 | ✅ Hoàn thành |
| Tuần 5 | ✅ Hoàn thành |
| Tuần 6 | ✅ Hoàn thành |
| **Tuần 7** | 🚧 **Đang thực hiện** (01/06 – 07/06/2026) |
| Tuần 8–10 | ⏳ Chưa bắt đầu |
