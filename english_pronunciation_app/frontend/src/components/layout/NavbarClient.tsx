"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Languages, Map, CalendarCheck, Trophy, Award, ShoppingBag } from "lucide-react";
import SignOutButton from "./SignOutButton";
import GemsDisplay from "@/components/gamification/GemsDisplay";

export type NavbarLink = {
  href: string;
  label: string;
};

// Map href → Lucide icon component (H6 — Recognition over recall, consistent style).
// Icons chosen for semantic match: Home, IPA (Languages), Learning Map, Check-in, Shop, Ranking, Badges.
const NAV_ICONS: Record<string, typeof Home> = {
  "/dashboard": Home,
  "/practice": Languages,
  "/learning_map": Map,
  "/checkin": CalendarCheck,
  "/shop": ShoppingBag,
  "/leaderboard": Trophy,
  "/badges": Award,
};

type NavbarUser = {
  username: string;
  avatarUrl: string;
  gems: number;
};

type NavbarClientProps = {
  links: NavbarLink[];
  user: NavbarUser | null;
  isAdmin: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(isActive: boolean) {
  return [
    "inline-flex min-h-11 items-center border-b-2 px-1 pt-1 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
    isActive
      ? "border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300"
      : "border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white",
  ].join(" ");
}

function mobileLinkClass(isActive: boolean) {
  return [
    "block rounded-lg px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500",
    isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white",
  ].join(" ");
}

export default function NavbarClient({ links, user, isAdmin }: NavbarClientProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-4 focus:ring-primary-500"
      >
        Bỏ qua điều hướng
      </a>

      <nav aria-label="Điều hướng chính">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              href="/"
              className="flex min-h-11 shrink-0 items-center rounded-lg text-xl font-extrabold tracking-tight text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-neutral-950"
            >
              PhatAmEN
            </Link>

            {!isAuthPage && (
              <div className="hidden flex-1 justify-center gap-6 md:flex">
                {links.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={navLinkClass(active)}
                    >
                      {NAV_ICONS[link.href] && (
                        (() => {
                          const Icon = NAV_ICONS[link.href];
                          return <Icon aria-hidden="true" className="mr-1.5 h-4 w-4" strokeWidth={2} />;
                        })()
                      )}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {!isAuthPage && <div className="hidden flex-1 md:flex" aria-hidden="true" />}

            <div className="hidden items-center gap-3 md:flex">
              {!isAuthPage && (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      aria-current={isActivePath(pathname, "/admin") ? "page" : undefined}
                      className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-primary-300 dark:focus-visible:ring-offset-neutral-950"
                    >
                      Admin
                    </Link>
                  )}

                  {user ? (
                    <>
                      <GemsDisplay initialGems={user.gems} />
                      <Link
                        href="/dashboard"
                        aria-label={`Mở dashboard của ${user.username}`}
                        className="flex min-h-11 items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950"
                      >
                        <img
                          className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700"
                          src={user.avatarUrl}
                          alt=""
                          aria-hidden="true"
                        />
                        <span className="hidden text-sm font-semibold text-neutral-700 lg:inline dark:text-neutral-200">{user.username}</span>
                      </Link>
                      <SignOutButton />
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/login"
                        className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-primary-300 dark:focus-visible:ring-offset-neutral-950"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="inline-flex min-h-11 items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {!isAuthPage && (
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  aria-label={isMobileOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-navigation"
                  onClick={() => setIsMobileOpen((current) => !current)}
                >
                  <span aria-hidden="true" className="flex flex-col gap-1">
                    <span className={`h-0.5 w-5 rounded bg-neutral-800 transition-transform dark:bg-neutral-100 ${isMobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
                    <span className={`h-0.5 w-5 rounded bg-neutral-800 transition-opacity dark:bg-neutral-100 ${isMobileOpen ? "opacity-0" : ""}`} />
                    <span className={`h-0.5 w-5 rounded bg-neutral-800 transition-transform dark:bg-neutral-100 ${isMobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {isMobileOpen && !isAuthPage && (
          <div id="mobile-navigation" className="border-t border-neutral-200 bg-white md:hidden dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              {links.map((link) => {
                const active = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={mobileLinkClass(active)}
                  >
                    {NAV_ICONS[link.href] && (
                      (() => {
                        const Icon = NAV_ICONS[link.href];
                        return <Icon aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={2} />;
                      })()
                    )}
                    {link.label}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  aria-current={isActivePath(pathname, "/admin") ? "page" : undefined}
                  className={mobileLinkClass(isActivePath(pathname, "/admin"))}
                >
                  Admin
                </Link>
              )}

              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 dark:hover:bg-neutral-800"
                    >
                      <img
                        className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-700"
                        src={user.avatarUrl}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-neutral-800 dark:text-neutral-100">{user.username}</span>
                    </Link>
                    <SignOutButton className="w-full justify-start px-4" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
