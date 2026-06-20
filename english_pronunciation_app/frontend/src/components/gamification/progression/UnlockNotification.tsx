"use client";

import { useState, useEffect } from "react";

interface UnlockNotificationProps {
  /** Name of the unlocked content */
  contentName: string;
  /** Link to the unlocked content */
  href?: string;
  /** Auto-dismiss after ms (default 5000) */
  dismissMs?: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

/**
 * UnlockNotification — Toast shown when user unlocks new content.
 *
 * Green-themed toast with 🔓 icon and optional link.
 * Auto-dismisses after dismissMs.
 */
export default function UnlockNotification({
  contentName,
  href,
  dismissMs = 5000,
  onDismiss,
}: UnlockNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, dismissMs);
    return () => clearTimeout(timer);
  }, [dismissMs, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed right-4 bottom-20 z-[9980] animate-[slide-in-right_0.3s_ease-out] motion-reduce:animate-none"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-white shadow-lg">
        <span className="text-xl" aria-hidden="true">🔓</span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold opacity-90">Đã mở khóa!</span>
          {href ? (
            <a
              href={href}
              className="text-sm font-bold underline underline-offset-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {contentName}
            </a>
          ) : (
            <span className="text-sm font-bold">{contentName}</span>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="ml-2 rounded-lg p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
