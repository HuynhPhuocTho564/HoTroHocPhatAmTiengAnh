# 🔐 HƯỚNG DẪN TRUY CẬP ADMIN DASHBOARD

## 📍 URL Truy cập

```
http://localhost:3000/admin
```

---

## 🚀 Cách truy cập (Development)

### Bước 1: Chạy Frontend
```bash
cd frontend
npm run dev
```

### Bước 2: Mở trình duyệt
Truy cập: `http://localhost:3000/admin`

### Bước 3: Bypass Authentication (Tạm thời)

**Hiện tại middleware đang check authentication**, để bypass trong môi trường dev:

#### Option 1: Comment middleware (Nhanh nhất)
Mở file `frontend/src/middleware.ts` và comment toàn bộ:

```typescript
// export function middleware(request: NextRequest) {
//   ... comment hết
// }
```

#### Option 2: Set cookie giả (Dùng DevTools)
1. Mở DevTools (F12)
2. Vào tab **Application** > **Cookies**
3. Thêm 2 cookies:
   - `auth-token` = `mock-token-123`
   - `user-role` = `Admin`
4. Refresh trang

#### Option 3: Tạo trang login giả
Tạo file `frontend/src/app/dev-login/page.tsx`:

```tsx
"use client";

export default function DevLogin() {
  const loginAsAdmin = () => {
    document.cookie = "auth-token=mock-token-123; path=/";
    document.cookie = "user-role=Admin; path=/";
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button 
        onClick={loginAsAdmin}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg"
      >
        Login as Admin (Dev Only)
      </button>
    </div>
  );
}
```

Sau đó truy cập: `http://localhost:3000/dev-login`

---

## 🔒 Bảo mật Production

### Khi deploy production, BẮT BUỘC phải:

1. **Tích hợp NextAuth.js**
```bash
npm install next-auth
```

2. **Cập nhật middleware.ts**
```typescript
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token.role !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}
```

3. **Tạo API route kiểm tra role**
```typescript
// app/api/auth/check-admin/route.ts
export async function GET() {
  const session = await getServerSession();
  
  if (session?.user?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  return NextResponse.json({ ok: true });
}
```

---

## 📋 Các trang Admin có sẵn

| URL | Chức năng |
|-----|-----------|
| `/admin` | Tổng quan (Overview) |
| `/admin?tab=users` | Quản lý người dùng |
| `/admin?tab=exercises` | Quản lý bài tập |
| `/admin?tab=topics` | Quản lý chủ đề |
| `/admin?tab=audio` | Quản lý âm thanh |
| `/admin?tab=badges` | Cấu hình Gamification |
| `/admin?tab=reports` | Thống kê & Báo cáo |

---

## 🎨 Giao diện Admin

### Tính năng đã có:
- ✅ 7 tabs điều hướng
- ✅ Stats cards (tổng quan)
- ✅ User Management (CRUD)
- ✅ Exercise Management (filter, grid view)
- ✅ Audio Management (upload, play)
- ✅ Reports & Analytics (charts, export)
- ✅ Responsive mobile-first
- ✅ Keyboard navigation
- ✅ WCAG 2.1 AA compliant

### Tính năng chưa có (TODO):
- ⏳ Topic Management (đang phát triển)
- ⏳ Badge Management (đang phát triển)
- ⏳ Real API integration
- ⏳ NextAuth authentication
- ⏳ Role-based access control

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot GET /admin"
**Nguyên nhân:** Frontend chưa chạy  
**Giải pháp:** Chạy `npm run dev` trong thư mục `frontend/`

### Lỗi: Redirect về /login
**Nguyên nhân:** Middleware đang check authentication  
**Giải pháp:** Dùng một trong 3 options ở trên để bypass

### Lỗi: "Forbidden" hoặc redirect về /dashboard
**Nguyên nhân:** Cookie `user-role` không phải "Admin"  
**Giải pháp:** Set cookie `user-role=Admin` trong DevTools

### Lỗi: Tailwind classes không hoạt động
**Nguyên nhân:** Tailwind chưa compile  
**Giải pháp:** 
```bash
# Xóa cache và rebuild
rm -rf .next
npm run dev
```

---

## 📞 Liên hệ

Nếu gặp vấn đề, kiểm tra:
1. Console log (F12 > Console)
2. Network tab (F12 > Network)
3. File `frontend/HCI_ACCESSIBILITY_AUDIT.md` để xem các issues đã biết

---

**Cập nhật:** 01/06/2026  
**Phiên bản:** 1.0
