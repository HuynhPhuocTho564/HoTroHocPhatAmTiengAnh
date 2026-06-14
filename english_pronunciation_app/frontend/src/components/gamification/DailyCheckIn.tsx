"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type CheckInStatus = {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
  todayReward: {
    xp: number;
    rankingScore: number;
  };
};

type DailyCheckInProps = {
  currentStreak?: number;
  longestStreak?: number;
  totalCheckIns?: number;
  lastCheckIn?: string | null;
  canCheckIn?: boolean;
  onCheckIn?: (status: CheckInStatus) => void;
  onStatusLoaded?: (status: CheckInStatus) => void;
};

type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error?: {
        code: string;
        message: string;
      };
      data?: Partial<CheckInStatus>;
    };

const DEFAULT_REWARD = {
  xp: 10,
  rankingScore: 2,
};

export default function DailyCheckIn({
  currentStreak = 0,
  longestStreak = 0,
  totalCheckIns = 0,
  lastCheckIn = null,
  canCheckIn,
  onCheckIn,
  onStatusLoaded,
}: DailyCheckInProps) {
  const [status, setStatus] = useState<CheckInStatus>({
    currentStreak,
    longestStreak,
    totalCheckIns,
    lastCheckInDate: lastCheckIn,
    canCheckIn: canCheckIn ?? false,
    todayReward: DEFAULT_REWARD,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      setIsLoading(true);
      setMessage(null);

      try {
        const response = await fetch("/api/checkin");
        const body = (await response.json()) as ApiResponse<CheckInStatus>;

        if (!cancelled && body.success) {
          setStatus(body.data);
          onStatusLoaded?.(body.data);
        }

        if (!cancelled && !body.success) {
          setMessage(body.error?.message ?? "Không lấy được trạng thái điểm danh.");
        }
      } catch (error) {
        if (!cancelled) {
          setMessage("Không thể kết nối API điểm danh.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, [onStatusLoaded]);

  async function handleCheckIn() {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = (await response.json()) as ApiResponse<
        CheckInStatus & {
          reward: {
            xp: number;
            rankingScore: number;
          };
          badgesAwarded: Array<{
            id: string;
            name: string;
            type: string;
          }>;
        }
      >;

      if (body.success) {
        const nextStatus: CheckInStatus = {
          currentStreak: body.data.currentStreak,
          longestStreak: body.data.longestStreak,
          totalCheckIns: body.data.totalCheckIns,
          lastCheckInDate: body.data.lastCheckInDate,
          canCheckIn: false,
          todayReward: body.data.reward,
        };

        setStatus(nextStatus);
        setMessage(
          body.data.badgesAwarded.length > 0
            ? `Đã điểm danh và nhận ${body.data.badgesAwarded.length} huy hiệu mới.`
            : "Đã điểm danh thành công.",
        );
        onCheckIn?.(nextStatus);
      } else {
        setMessage(body.error?.message ?? "Điểm danh không thành công.");
        if (body.error?.code === "ALREADY_CHECKED_IN") {
          setStatus((current) => ({
            ...current,
            canCheckIn: false,
          }));
        }
      }
    } catch (error) {
      setMessage("Không thể kết nối API điểm danh.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const cycleDay = status.currentStreak === 0 ? 1 : ((status.currentStreak - 1) % 7) + 1;
  const weekDays = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    checked: cycleDay >= index + 1 && status.currentStreak > 0,
  }));

  return (
    <Card className="border-primary-200 bg-primary-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-900">Chuỗi ngày học</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Điểm danh mỗi ngày để nhận +{status.todayReward.xp} XP và +{status.todayReward.rankingScore} điểm hạng.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleCheckIn}
          loading={isSubmitting}
          disabled={isLoading || !status.canCheckIn}
          aria-label="Điểm danh hằng ngày"
        >
          {status.canCheckIn ? "Điểm danh" : "Đã điểm danh"}
        </Button>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-primary-200 bg-white p-4">
          <dt className="text-sm text-neutral-600">Chuỗi hiện tại</dt>
          <dd className="mt-1 text-3xl font-bold text-primary-600">{status.currentStreak}</dd>
          <div className="mt-1 text-xs text-neutral-500">ngày liên tiếp</div>
        </div>
        <div className="rounded-lg border border-accent-200 bg-white p-4">
          <dt className="text-sm text-neutral-600">Kỷ lục cá nhân</dt>
          <dd className="mt-1 text-3xl font-bold text-accent-600">{status.longestStreak}</dd>
          <div className="mt-1 text-xs text-neutral-500">ngày liên tiếp</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <dt className="text-sm text-neutral-600">Tổng điểm danh</dt>
          <dd className="mt-1 text-3xl font-bold text-neutral-900">{status.totalCheckIns}</dd>
          <div className="mt-1 text-xs text-neutral-500">ngày đã ghi nhận</div>
        </div>
      </dl>

      <ul className="mt-5 flex justify-center gap-2" aria-label="Tiến độ chu kỳ 7 ngày">
        {weekDays.map((day) => (
          <li
            key={day.day}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
              day.checked ? "bg-success-600 text-white shadow-sm" : "border border-neutral-200 bg-white text-neutral-500"
            }`}
            aria-label={`Ngày ${day.day}: ${day.checked ? "Đã hoàn thành" : "Chưa hoàn thành"}`}
          >
            {day.checked ? "OK" : day.day}
          </li>
        ))}
      </ul>

      {message && (
        <div
          className="mt-4 rounded-lg border border-primary-200 bg-white p-3 text-sm text-neutral-700"
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </Card>
  );
}
