"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleMark from "@/components/auth/GoogleMark";
import PasswordInput from "@/components/auth/PasswordInput";
import { buildAuthHref, getSafeCallbackPath } from "@/lib/auth-redirect";

type RegisterFormProps = {
  googleEnabled: boolean;
};

export default function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackPath(searchParams.get("callbackUrl"));

  const [username, setUsername] = useState("");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const payload = await response.json();

      if (response.ok) {
        const params = new URLSearchParams({ registered: "true" });
        if (callbackUrl !== "/dashboard") {
          params.set("callbackUrl", callbackUrl);
        }
        router.push(`/login?${params.toString()}`);
        return;
      }

      setError(payload.error?.message ?? payload.message ?? "Đăng ký thất bại.");
    } catch (registerError) {
      setError("Đã xảy ra lỗi hệ thống, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    await signIn("google", { redirectTo: callbackUrl });
  };

  return (
    <div className="space-y-5">
      {googleEnabled && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-800 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
        >
          <GoogleMark />
          {isGoogleLoading ? "Đang chuyển sang Google..." : "Đăng ký với Google"}
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
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-sm font-medium text-error-800 dark:border-error-900 dark:bg-error-950/40 dark:text-error-200" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-800 dark:text-neutral-100" htmlFor="username">
              Tên hiển thị
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              aria-describedby="username-help"
              className="block min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-900/50 sm:text-sm"
              placeholder="Ví dụ: Minh Anh"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <p id="username-help" className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              Tối thiểu 3 ký tự, dùng để hiển thị trên tiến độ và bảng xếp hạng.
            </p>
          </div>

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
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            helpText="Mật khẩu chỉ dùng cho đăng nhập bằng email. Google sẽ tạo tài khoản riêng từ email Google."
          />
        </div>

        <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Bằng việc bấm đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của PhatAmEN.
        </p>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-neutral-900"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        Đã có tài khoản?{" "}
        <Link
          href={buildAuthHref("/login", callbackUrl)}
          className="font-bold text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200 dark:focus-visible:ring-offset-neutral-900"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
