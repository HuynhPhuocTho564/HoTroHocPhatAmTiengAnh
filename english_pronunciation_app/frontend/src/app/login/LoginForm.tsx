"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleMark from "@/components/auth/GoogleMark";
import PasswordInput from "@/components/auth/PasswordInput";
import { buildAuthHref, getSafeCallbackPath } from "@/lib/auth-redirect";

type LoginFormProps = {
  googleEnabled: boolean;
};

export default function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackPath(searchParams.get("callbackUrl"));
  const registered = searchParams.get("registered") === "true";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        redirectTo: callbackUrl,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không chính xác.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (loginError) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    await signIn("google", { redirectTo: callbackUrl });
  };

  const visibleError =
    error ||
    (authError
      ? "Đăng nhập Google chưa thành công. Hãy thử lại hoặc đăng nhập bằng email."
      : "");

  return (
    <div className="space-y-5">
      {registered && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-4 text-sm font-medium text-success-800" role="status">
          Đăng ký thành công. Hãy đăng nhập để bắt đầu học.
        </div>
      )}

      {googleEnabled && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-800 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
        >
          <GoogleMark />
          {isGoogleLoading ? "Đang chuyển sang Google..." : "Tiếp tục với Google"}
        </button>
      )}

      {googleEnabled && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">hoặc</span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div aria-live="polite" aria-atomic="true">
          {visibleError && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-sm font-medium text-error-800 dark:border-error-900 dark:bg-error-950/40 dark:text-error-200" role="alert">
              {visibleError}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-800 dark:text-neutral-100" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(visibleError) || undefined}
              className="block min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-900/50 sm:text-sm"
              placeholder="ban@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <PasswordInput
            id="password"
            name="password"
            label="Mật khẩu"
            autoComplete="current-password"
            required
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hasError={Boolean(visibleError)}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="inline-flex min-h-9 items-center rounded-md text-sm font-bold text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200 dark:focus-visible:ring-offset-neutral-900"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-neutral-900"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        Chưa có tài khoản?{" "}
        <Link
          href={buildAuthHref("/register", callbackUrl)}
          className="font-bold text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200 dark:focus-visible:ring-offset-neutral-900"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
