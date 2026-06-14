"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete: string;
  placeholder: string;
  helpText?: string;
  required?: boolean;
  minLength?: number;
  hasError?: boolean;
};

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.75 12s3.35-6.25 9.25-6.25S21.25 12 21.25 12s-3.35 6.25-9.25 6.25S2.75 12 2.75 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.75A2.75 2.75 0 1 0 12 9.25a2.75 2.75 0 0 0 0 5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {visible ? null : (
        <path
          d="M4.75 4.75 19.25 19.25"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  helpText,
  required = false,
  minLength,
  hasError = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-neutral-800 dark:text-neutral-100" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          aria-describedby={helpId}
          aria-invalid={hasError || undefined}
          className="block min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 pr-12 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-900/50 sm:text-sm"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
        >
          <EyeIcon visible={isVisible} />
        </button>
      </div>
      {helpText && (
        <p id={helpId} className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
