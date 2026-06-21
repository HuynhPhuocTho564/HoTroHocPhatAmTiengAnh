# Kế Hoạch Exercise UX & Pedagogical Depth (Ưu tiên 5)

**Mục tiêu:** Exercise không chỉ "Đúng/Sai" mà giải thích TẠI SAO sai. Thêm countdown, difficulty levels, và IPA reference integration.

**Tham chiếu đánh giá:** [UI_UX_COMPREHENSIVE_EVALUATION.md](./../03_UI_UX/UI_UX_COMPREHENSIVE_EVALUATION.md) — Phần 5 (Intrinsic Motivation), Phần 2 (Cognitive Load)

**Skills bắt buộc áp dụng:**
- `maintainable-code` — Pure functions cho phonetic data, type-safe difficulty levels
- `nielsen-ux-heuristics` — H9 (Error Recovery), H10 (Help & Documentation)
- `ui-color-harmony` — Phonetic hints dùng semantic colors (green=correct position, red=wrong)

---

## Task 5.1: Phonetic Explanation Khi Sai

**Vấn đề:** User sai /ʃ/ vs /s/ nhưng chỉ thấy "Sai" → không học được gì.

**File thay đổi:**
- TẠO MỚI: `frontend/src/lib/phonetics/ipa-hints.ts`
- `frontend/src/app/exercises/[id]/ListenFeedbackSheet.tsx` — thêm hint

### Bước 5.1.1: Tạo IPA hints database

```tsx
// lib/phonetics/ipa-hints.ts

export type IpaHint = {
  symbol: string;
  vietnamese: string;        // Cách người Việt hay nhầm
  mouthPosition: string;     // Mô tả vị trí miệng
  commonMistake: string;     // Lỗi thường gặp
  tip: string;              // Mẹo sửa
};

export const IPA_HINTS: Record<string, IpaHint> = {
  "ʃ": {
    symbol: "/ʃ/",
    vietnamese: "Hay nhầm với /s/",
    mouthPosition: "Chu môi, lưỡi cong lên phía vòm miệng cứng",
    commonMistake: "Phát âm giống 'x' tiếng Việt thay vì 'sh' tiếng Anh",
    tip: "Chu môi như đang 'suỵt' ai đó, rồi đẩy hơi ra",
  },
  "θ": {
    symbol: "/θ/",
    vietnamese: "Hay nhầm với /t/ hoặc /s/",
    mouthPosition: "Đặt lưỡi giữa hai hàm răng, đẩy hơi qua",
    commonMistake: "Phát âm giống 'th' tiếng Việt",
    tip: "Đặt đầu lưỡi giữa răng trên và dưới, thổi hơi nhẹ",
  },
  "ð": {
    symbol: "/ð/",
    vietnamese: "Hay nhầm với /d/ hoặc /z/",
    mouthPosition: "Giống /θ/ nhưng rung dây thanh",
    commonMistake: "Phát âm giống 'đ' tiếng Việt",
    tip: "Đặt lưỡi giữa răng, phát âm 'd' nhưng lưỡi chạm răng",
  },
  "ʒ": {
    symbol: "/ʒ/",
    vietnamese: "Hay nhầm với /z/ hoặc /dʒ/",
    mouthPosition: "Giống /ʃ/ nhưng rung dây thanh",
    commonMistake: "Phát âm giống 'gi' tiếng Việt",
    tip: "Chu môi như /ʃ/ nhưng thêm tiếng 'ừ' từ cổ họng",
  },
  "ŋ": {
    symbol: "/ŋ/",
    vietnamese: "Hay nhầm với /n/ hoặc /g/",
    mouthPosition: "Cuối lưỡi nâng chạm vòm mềm, miệng mở",
    commonMistake: "Thêm /g/ ở cuối: 'sing' → 'sing-g'",
    tip: "Giống 'ng' tiếng Việt nhưng KHÔNG bật /g/ ở cuối",
  },
  // ... thêm 10-15 âm phổ biến khác
};

/**
 * Get hint for a specific phoneme target.
 * Returns null if no hint available.
 */
export function getIpaHint(phoneme: string): IpaHint | null {
  const cleaned = phoneme.replace(/\//g, "").trim();
  return IPA_HINTS[cleaned] ?? null;
}
```

### Bước 5.1.2: Tích hợp vào ListenFeedbackSheet

```tsx
// ListenFeedbackSheet.tsx — khi isCorrect === false
import { getIpaHint } from "@/lib/phonetics/ipa-hints";

// Extract target phoneme from question content
const targetPhoneme = question.targetPhoneme; // cần thêm field hoặc parse
const hint = targetPhoneme ? getIpaHint(targetPhoneme) : null;

// Render hint khi sai
{!isCorrect && hint && (
  <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
    <p className="text-sm font-bold text-blue-800 mb-1">
      💡 Mẹo phát âm {hint.symbol}
    </p>
    <p className="text-sm text-blue-700">{hint.tip}</p>
    <p className="text-xs text-blue-600 mt-1 italic">{hint.mouthPosition}</p>
  </div>
)}
```

### Bước 5.1.3: Question data cần target phoneme

Kiểm tra xem question content có chứa target phoneme không. Nếu không có field riêng, parse từ IPA content:
```tsx
// Parse /ʃ/ từ IPA string "/ʃɪp/"
function extractTargetPhoneme(ipa: string): string | null {
  const match = ipa.match(/\/([^\/]+)\//);
  return match ? match[1].charAt(0) : null;
}
```

**Skills áp dụng:**
- `maintainable-code`: IPA_HINTS là constants data, getIpaHint là pure function
- `nielsen-ux-heuristics`: H9 (Help users recognize errors) — error phải có solution
- `ui-color-harmony`: Hint box dùng blue-50 (info/learning), không dùng red (discouraging)

**Verification:**
- [ ] Sai /ʃ/ → hiện hint "Chu môi như đang suỵt..."
- [ ] Sai /θ/ → hiện hint "Đặt lưỡi giữa hai hàm răng..."
- [ ] Không có hint → không hiện box (graceful)

---

## Task 5.2: Countdown Timer Cho Bài Nói

**Vấn đề:** SpeakWordQuestion auto-stop 5s nhưng user không thấy countdown → bị giật mình.

**File thay đổi:**
- `frontend/src/app/exercises/[id]/SpeakWordQuestion.tsx`

### Bước 5.2.1: Tạo useCountdown hook

```tsx
// hooks/useCountdown.ts
export function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds);
  
  useEffect(() => {
    if (!active) { setRemaining(seconds); return; }
    const interval = setInterval(() => {
      setRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [active, seconds]);
  
  return remaining;
}
```

### Bước 5.2.2: Visual countdown circle

```tsx
// Trong SpeakWordQuestion, khi status === "recording"
const remaining = useCountdown(5, status === "recording");

<div className="relative mx-auto h-32 w-32">
  {/* Background circle */}
  <svg className="h-full w-full" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
    <circle
      cx="64" cy="64" r="56" fill="none" stroke="#ef4444" strokeWidth="8"
      strokeDasharray={`${(remaining / 5) * 352} 352`}
      strokeLinecap="round"
      transform="rotate(-90 64 64)"
      className="transition-all duration-1000"
    />
  </svg>
  {/* Number overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-3xl font-black text-white">{remaining}</span>
  </div>
  {/* Mic icon */}
</div>
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H1 (Visibility of System Status) — user phải biết còn bao nhiêu giây
- `maintainable-code`: useCountdown hook reusable, countdown value từ constant

**Verification:**
- [ ] Countdown 5→4→3→2→1 khi recording
- [ ] Circle animation smooth
- [ ] Reduced-motion: chỉ hiện number, không animation

---

## Task 5.3: Mini IPA Reference Popup

**Vấn đề:** User thấy IPA symbol trong exercise nhưng không biết phát âm thế nào.

**File thay đổi:**
- TẠO MỚI: `frontend/src/components/ui/IpaPopup.tsx`
- `frontend/src/app/exercises/[id]/components/` — integrate vào question renderers

### Bước 5.3.1: IpaPopup component

```tsx
"use client";
import { useState } from "react";
import { IPA_HINTS, type IpaHint } from "@/lib/phonetics/ipa-hints";

type IpaPopupProps = {
  symbol: string;
  ipa: string; // Full IPA string e.g. "/ʃɪp/"
};

export default function IpaPopup({ symbol, ipa }: IpaPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hint = IPA_HINTS[symbol];
  
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-ipa text-primary-600 underline decoration-dotted cursor-help"
        aria-label={`Xem cách phát âm ${ipa}`}
      >
        {ipa}
      </button>
      
      {isOpen && hint && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 rounded-xl border border-primary-200 bg-white p-4 shadow-xl">
          <div className="flex justify-between items-start">
            <h4 className="font-ipa text-2xl font-bold text-primary-700">{hint.symbol}</h4>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
          </div>
          <p className="text-sm text-neutral-600 mt-2">📍 {hint.mouthPosition}</p>
          <p className="text-sm text-neutral-600 mt-1">⚠️ {hint.commonMistake}</p>
          <p className="text-sm font-semibold text-success-700 mt-2">💡 {hint.tip}</p>
        </div>
      )}
    </span>
  );
}
```

### Bước 5.3.2: Integrate vào SpeakWordQuestion

```tsx
// Thay vì render IPA text thường:
// <p className="font-ipa text-5xl">{contentData.ipa}</p>

// Render clickable IPA:
<IpaPopup symbol={targetPhoneme} ipa={contentData.ipa} />
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H10 (Help & Documentation) — contextual help tại moment of need
- `maintainable-code`: IpaPopup nhận props, reusable across question types

**Verification:**
- [ ] Click IPA symbol → popup hiện
- [ ] Popup có mouth position + tip
- [ ] Click ngoài → popup đóng
- [ ] Esc → popup đóng

---

## Task 5.4: Exercise Difficulty Indicator

**Vấn đề:** User không biết bài nào dễ/khó trước khi chọn.

**File thay đổi:**
- `frontend/src/app/learning_map/LearningMapClient.tsx` — thêm visual indicator

### Bước 5.4.1: Difficulty badges trên exercise cards

```tsx
// Parse difficulty từ exercise name or requirement
function getDifficultyLevel(name: string): { label: string; color: string; stars: number } {
  const normalized = name.toLowerCase();
  if (normalized.includes("de") || normalized.includes("easy") || normalized.includes("basic")) {
    return { label: "Dễ", color: "bg-success-100 text-success-700", stars: 1 };
  }
  if (normalized.includes("kho") || normalized.includes("hard") || normalized.includes("advanced")) {
    return { label: "Khó", color: "bg-error-100 text-error-700", stars: 3 };
  }
  return { label: "Trung bình", color: "bg-warning-100 text-warning-700", stars: 2 };
}

// Render trên exercise card
<div className="flex items-center gap-2">
  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${difficulty.color}`}>
    {"⭐".repeat(difficulty.stars)} {difficulty.label}
  </span>
</div>
```

**Skills áp dụng:**
- `nielsen-ux-heuristics`: H6 (Recognition) — difficulty visible trước khi click
- `ui-color-harmony`: Green=Dễ, Amber=Trung bình, Red=Khó (semantic colors)

**Verification:**
- [ ] Exercise cards hiện difficulty badge
- [ ] Color semantic đúng (green=easy, red=hard)

---

## Tổng Kết Priority 5

| Task | Effort | Impact | Dependencies |
|------|--------|--------|--------------|
| 5.1 Phonetic explanation | MEDIUM | HIGH | IPA hints data |
| 5.2 Countdown timer | LOW | MEDIUM | Không |
| 5.3 IPA reference popup | MEDIUM | HIGH | 5.1 (dùng chung hints) |
| 5.4 Difficulty indicator | LOW | MEDIUM | Không |

**Tổng thời gian ước tính:** 8-10 giờ

**Thứ tự đề xuất:** 5.2 → 5.4 → 5.1 → 5.3
