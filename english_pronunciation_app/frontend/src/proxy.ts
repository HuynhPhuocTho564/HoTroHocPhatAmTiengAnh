import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  // Bảo vệ route /admin
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Chỉ Admin mới được vào /admin
    if (userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  // Bảo vệ route /dashboard (nếu chưa đăng nhập thì đẩy ra login)
  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

// Chạy middleware trên tất cả các route ngoại trừ api, _next/static, _next/image, favicon
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
