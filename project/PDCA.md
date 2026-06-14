# 🔄 Quy Trình PDCA (Plan - Do - Check - Act)

Tài liệu này dùng để theo dõi các vòng lặp phát triển giao diện và tính năng dựa trên tiêu chuẩn HCI và WCAG 2.1 (Accessibility).

---

## 🎯 Vòng lặp 2: Tính năng Nhận diện Giọng nói (Web Speech API) & Component Ghi âm

### 1. PLAN (Lập Kế Hoạch)
- **Mục tiêu:** 
  - Xây dựng Hook `useSpeechRecognition` để nhận diện giọng nói qua microphone (chạy phía Client).
  - Xây dựng component `RecordButton` hiển thị các trạng thái ghi âm rõ ràng.
  - Xây dựng logic So khớp chữ viết (Normalization) như đã ghi trong `KE_HOACH_THUC_HIEN.md`.
- **Nguyên lý HCI áp dụng:**
  - *Feedback*: Component nút bấm phải hiển thị rõ các trạng thái: Chờ (Idle), Đang nghe (Listening), Đang xử lý (Processing), Kết quả (Result: Đúng/Sai).
  - *Error Prevention*: Nút bấm phải đủ lớn (>44px), màu sắc tương phản rõ rệt. Có thông báo lỗi nếu trình duyệt không hỗ trợ (chỉ Chrome/Edge mới có Web Speech API).
- **Tiêu chuẩn Accessibility (WCAG 2.1):**
  - Có `aria-live` để screen reader đọc trạng thái (đang ghi âm, kết quả đúng sai).
  - Thao tác ghi âm có thể kích hoạt bằng bàn phím (Enter/Space).

### 2. DO (Thực Hiện)
- [ ] Xây dựng `src/hooks/useSpeechRecognition.ts`.
- [ ] Xây dựng `src/components/audio/RecordButton.tsx`.
- [ ] Cập nhật `IPAChart.tsx` (hoặc tạo modal chi tiết) để tích hợp `RecordButton`, cho phép người dùng click vào 1 âm vị -> mở khung ghi âm -> đọc -> hiển thị điểm.

### 3. CHECK (Kiểm Tra)
- Chức năng nhận diện có bắt được giọng nói không?
- Màn hình hiển thị kết quả (Đúng/Sai) có khớp với mong đợi không?
- Screen reader có đọc được thông báo thay đổi trạng thái không?

### 4. ACT (Hành Động/Cải Tiến)
- *Đánh giá sau khi thực hiện vòng lặp 2.*
