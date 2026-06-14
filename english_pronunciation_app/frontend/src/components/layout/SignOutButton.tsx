"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-primary-300 dark:focus-visible:ring-offset-neutral-950 ${className}`}
    >
      Đăng xuất
    </button>
  );
}
