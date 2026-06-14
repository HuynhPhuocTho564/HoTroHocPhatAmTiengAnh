import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const protectedRoutes = [
  "/dashboard",
  "/practice",
  "/learning_map",
  "/checkin",
  "/badges",
  "/leaderboard",
  "/exercises",
];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function redirectToLogin(pathname: string, baseUrl: URL) {
  const loginUrl = new URL("/login", baseUrl);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = Boolean(req.auth);
  const userRole = req.auth?.user?.role;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return redirectToLogin(nextUrl.pathname, nextUrl);
    }

    if (userRole !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (isProtectedPath(nextUrl.pathname) && !isAuthenticated) {
    return redirectToLogin(nextUrl.pathname, nextUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
