"use client";

import { useState, useCallback } from "react";

interface AchievementShareProps {
  /** Achievement title to share */
  title: string;
  /** Description or stats */
  description: string;
  /** Optional emoji icon */
  icon?: string;
}

/**
 * AchievementShare — Let users share achievements via clipboard or social links.
 *
 * Generates a shareable text with achievement info and app URL.
 * Supports: copy to clipboard, Twitter/X share URL.
 */
export default function AchievementShare({ title, description, icon = "🏆" }: AchievementShareProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${icon} ${title}\n${description}\n\nTôi đang học phát âm tiếng Anh trên PronunciationHelper! 🎓`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: create textarea
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      </div>
      <p className="mb-3 text-xs text-neutral-600">{description}</p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="min-h-9 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-300"
          aria-label={copied ? "Đã sao chép" : "Sao chép thành tích"}
        >
          {copied ? "✅ Đã sao chép!" : "📋 Sao chép"}
        </button>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-9 flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-300"
          aria-label="Chia sẻ lên X (Twitter)"
        >
          𝕏 Chia sẻ
        </a>
      </div>
    </div>
  );
}
