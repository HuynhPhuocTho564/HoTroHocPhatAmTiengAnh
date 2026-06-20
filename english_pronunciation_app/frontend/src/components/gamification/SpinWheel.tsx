"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { SPIN_WHEEL_PRIZES } from "@/lib/gamification/spin-wheel";
import { useRewardEvents } from "./effects/RewardEventContext";

type SpinResult = {
  prize: {
    id: string;
    label: string;
    value: { gems?: number; xp?: number; streakFreezes?: number };
  };
  rotationDegrees: number;
};

/**
 * SpinWheel — Interactive prize wheel with CSS animation.
 *
 * User needs streak >= 3 to earn a spin, and can spin once per day.
 * Fetches spin result from API, animates the wheel, shows prize.
 */
export default function SpinWheel() {
  const { emit } = useRewardEvents();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canSpinToday, setCanSpinToday] = useState(true);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Check if already spun today on mount
  useEffect(() => {
    const lastSpin = sessionStorage.getItem("lastSpinDate");
    if (lastSpin) {
      const today = new Date().toDateString();
      if (lastSpin === today) {
        setCanSpinToday(false);
      }
    }
  }, []);

  const handleSpin = useCallback(async () => {
    if (spinning) return;
    setSpinning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/spin-wheel", { method: "POST" });
      const payload = await res.json();

      if (!payload.success) {
        setError(payload.error?.message ?? "Không thể quay");
        setSpinning(false);
        return;
      }

      const { prize, rotationDegrees } = payload.data as SpinResult;
      setResult({ prize, rotationDegrees });
      setRotation((prev) => prev + rotationDegrees);
      setCanSpinToday(false);
      sessionStorage.setItem("lastSpinDate", new Date().toDateString());

      // After animation completes, emit reward event
      setTimeout(() => {
        if (prize.value.gems) {
          emit({ type: "gems", amount: prize.value.gems, label: `Vòng quay: +${prize.value.gems} 💎`, icon: "💎" });
        } else if (prize.value.xp) {
          emit({ type: "xp", amount: prize.value.xp, label: `Vòng quay: +${prize.value.xp} XP`, icon: "⭐" });
        } else if (prize.value.streakFreezes) {
          emit({ type: "streak_milestone", label: "Nhận Bùa Đóng Băng!", icon: "❄️" });
        }
        setSpinning(false);
      }, 3500);
    } catch {
      setError("Lỗi kết nối, thử lại sau");
      setSpinning(false);
    }
  }, [spinning, emit]);

  const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;

  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
          🎡 Vòng Quay May Mắn
        </span>
        {!canSpinToday && !spinning && (
          <span className="text-xs font-semibold text-neutral-500">Đã quay hôm nay</span>
        )}
      </div>

      {/* Wheel */}
      <div className="relative mx-auto mb-4 flex items-center justify-center">
        {/* Pointer */}
        <div
          className="absolute -top-2 z-10 text-2xl"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          aria-hidden="true"
        >
          ▼
        </div>

        {/* Wheel container */}
        <div
          ref={wheelRef}
          className="relative h-52 w-52 rounded-full border-4 border-purple-300 shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {SPIN_WHEEL_PRIZES.map((prize, i) => {
            const colors = [
              "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-teal-500",
              "bg-emerald-500", "bg-amber-500", "bg-orange-500", "bg-pink-500",
            ];
            return (
              <div
                key={prize.id}
                className="absolute h-full w-full"
                style={{
                  transform: `rotate(${i * segmentAngle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 0%)`,
                }}
              >
                <div className={`h-full w-full ${colors[i % colors.length]} opacity-80`} />
                <span
                  className="absolute text-xs font-bold text-white"
                  style={{
                    top: "15%",
                    left: "50%",
                    transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`,
                    transformOrigin: "bottom center",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    fontSize: "9px",
                  }}
                >
                  {prize.label}
                </span>
              </div>
            );
          })}
          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-purple-600 shadow-md" aria-hidden="true" />
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={spinning || !canSpinToday}
        className="min-h-11 w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={spinning ? "Đang quay..." : canSpinToday ? "Quay vòng quay" : "Đã quay hôm nay"}
      >
        {spinning ? "🎡 Đang quay..." : canSpinToday ? "🎡 Quay ngay" : "Quay lại ngày mai"}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Result */}
      {result && !spinning && (
        <div className="mt-3 rounded-lg bg-white p-3 text-center shadow-sm animate-[scale-in_0.3s_ease-out] motion-reduce:animate-none">
          <p className="text-sm font-semibold text-neutral-600">Bạn nhận được</p>
          <p className="text-lg font-bold text-purple-700">{result.prize.label}</p>
        </div>
      )}

      {/* Hint */}
      <p className="mt-3 text-center text-xs text-neutral-500">
        Cần chuỗi 🔥 3 ngày liên tiếp để mở khóa vòng quay
      </p>
    </div>
  );
}
