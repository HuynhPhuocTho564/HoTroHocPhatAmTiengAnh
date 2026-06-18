# _Archive — Tài liệu lịch sử (KHÔNG dùng làm quyết định)

Ngày tạo: 18/06/2026 (SP1)

Thư mục này chứa các tài liệu PLAN đã lỗi thời hoặc mâu thuẫn với code thực tế, được di chuyển từ các thư mục PLAN khác để tránh dẫn sai khi code.

## Không dùng làm nguồn quyết định

Các file ở đây hoặc:
- mâu thuẫn với code đang chạy (vd cấm XP/streak trong khi code đã có đầy đủ), hoặc
- mô tả kiến trúc/công nghệ cũ (Next.js 14, Whisper, FastAPI xử lý scoring — đều không đúng hiện tại), hoặc
- chứa hướng dẫn đã bỏ (mock-token admin), hoặc
- rỗng/placeholder.

## Nguồn chân thực hiện tại

Khi code, đọc `PLAN/00_Project_Context/CURRENT_PROJECT_CONTEXT.md` thay vì các file ở đây.

## Lý do giữ (không xóa)

Giữ làm lịch sử đối chiếu cho khóa luận. Git vẫn có full history. Các tài liệu gốc này có giá trị ghi nhận quá trình, nhưng không phản ánh trạng thái hiện tại.

## Danh sách file đã archive (theo SP1)

- `project_spec.md` (từ `00_Project_Context/`) — cấm XP/streak, mâu thuẫn code.
- `CURRENT_SYSTEM_STATUS.md` (từ `00_Project_Context/`) — snapshot 08/06 lỗi thời, sai version.
- `PROJECT_CONTEXT.md` (từ `00_Project_Context/`) — kiến trúc cũ (Whisper, /api/phonemes).
- `COLOR_SYSTEM.md` (từ `03_UI_UX/`) — file rỗng.
- `ADMIN_ACCESS.md` (từ `04_Features/`) — hướng dẫn mock-token đã bỏ.
- `KH_AI_PROMPTS.md` (từ `05_AI_Skills/`) — prompt cũ, Next.js 14.
- `KH_VIBE_CODING.md` (từ `05_AI_Skills/`) — prompt cũ, ghi "DB chưa có xp/level" sai.
