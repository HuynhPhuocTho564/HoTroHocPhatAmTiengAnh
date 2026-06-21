"use client";

import { useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { playSfx } from "@/lib/sfx";
import { celebrate } from "@/lib/confetti";
import {
  parseWordPrompt,
  type ExerciseData,
  type ExerciseQuestion,
  type IncorrectQuestion,
  type SubmitResult,
} from "./ExerciseEngineClient";

type ExerciseSummaryScreenProps = {
  exercise: ExerciseData;
  submitResult: SubmitResult;
  incorrectQuestions: IncorrectQuestion[];
  submitStatus: "idle" | "submitting" | "success" | "error";
  submitError: string | null;
  onRetry: () => void; // "Làm lại bài này" (router.reload)
  onExit: () => void; // "Về lộ trình" (router.push /learning_map)
};

// Lời khen theo rating (tầng 1).
function praiseByRating(rating: string): string {
  switch (rating) {
    case "EXCELLENT":
      return "Tuyệt đỉnh!";
    case "GOOD":
      return "Hoàn thành xuất sắc!";
    case "PASS":
      return "Bạn đang tiến bộ!";
    case "NEEDS_PRACTICE":
    default:
      return "Cần luyện thêm!";
  }
}

// Màu vòng tròn % theo rating (conic-gradient).
function ringColorByRating(rating: string): string {
  switch (rating) {
    case "EXCELLENT":
    case "GOOD":
      return "#10b981"; // success
    case "PASS":
      return "#3b82f6"; // primary
    case "NEEDS_PRACTICE":
    default:
      return "#f59e0b"; // warning
  }
}

// Hiện word từ content JSON (word đơn hoặc array pair) — tương đương formatQuestionWord engine.
function formatQuestionWord(question: ExerciseQuestion): string {
  try {
    const parsed = JSON.parse(question.content);
    if (Array.isArray(parsed)) {
      return parsed.map((item: { word?: string }) => item.word).filter(Boolean).join(" & ");
    }
    if (parsed?.word) return String(parsed.word);
  } catch {
    // Plain text fallback below.
  }
  return question.content;
}

// Nút 🔊 nghe lại audio (tái dụng MiniSpeaker pattern từ ListenFeedbackSheet).
function ReplayButton({ audioUrl }: { audioUrl?: string }) {
  if (!audioUrl) return null;
  const play = () => {
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.warn("replay audio failed:", e));
  };
  return (
    <button
      type="button"
      onClick={play}
      aria-label="Nghe lại âm này"
      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-700"
    >
      <span aria-hidden="true">🔊</span> Nghe lại
    </button>
  );
}

export default function ExerciseSummaryScreen({
  exercise,
  submitResult,
  incorrectQuestions,
  submitStatus,
  submitError,
  onRetry,
  onExit,
}: ExerciseSummaryScreenProps) {
  const score = submitResult.exerciseScore;
  const isHighScore = score >= 80;
  const ringColor = ringColorByRating(submitResult.rating);
  const praise = praiseByRating(submitResult.rating);

  // Confetti + tada khi >= 80% (chỉ khi lưu thành công, không khi đang submit/error).
  useEffect(() => {
    if (submitStatus !== "success") return;
    if (!isHighScore) return;
    celebrate();
    playSfx("tada");
  }, [submitStatus, isHighScore]);

  // Progress bias client-side (tầng 2): exerciseScore - previousBestScore.
  const progressBias = useMemo(() => {
    if (submitResult.previousBestScore === null) return null;
    return score - submitResult.previousBestScore;
  }, [score, submitResult.previousBestScore]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 p-6 sm:p-8">
      <Card className="w-full max-w-2xl space-y-8 p-8 text-center sm:p-12">
        {/* ===== TẦNG 1 (top): khen + vòng tròn % ===== */}
        <h1 className="text-3xl font-black text-neutral-900">{praise}</h1>

        {/* Vòng tròn % CSS conic-gradient (không lib). */}
        <div
          className="mx-auto flex h-40 w-40 items-center justify-center rounded-full text-4xl font-black text-neutral-900"
          style={{
            background: `conic-gradient(${ringColor} ${score}%, #e5e7eb 0)`,
          }}
          role="img"
          aria-label={`Điểm ${score} trên 100`}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-4xl font-black" style={{ color: ringColor }}>
              {score}%
            </span>
          </div>
        </div>

        {/* ===== TẦNG 2 (middle): XP + streak + badges + progress bias ===== */}
        {submitStatus === "submitting" && (
          <p className="text-sm font-medium text-neutral-600" role="status">
            Đang lưu kết quả và tính XP...
          </p>
        )}

        {submitStatus === "success" && (
          <div className="space-y-4">
            {/* 4 card grid: XP / Điểm hạng / Streak / Badges (Task 3.1) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* XP */}
              <div className="rounded-lg bg-primary-50 p-4 text-primary-700">
                <p className="text-sm font-semibold">⭐ XP</p>
                <p className="text-2xl font-black">+{submitResult.rewards.totalXpEarned}</p>
              </div>

              {/* Điểm hạng 🏆 — Task 3.1 (Nielsen H1 Visibility, amber = competition energy) */}
              <div className="rounded-lg bg-amber-50 p-4 text-amber-700">
                <p className="text-sm font-semibold">🏆 Điểm hạng</p>
                <p className="text-2xl font-black">+{submitResult.rewards.totalRankingDelta}</p>
                {submitResult.rewards.dailyBonusRanking > 0 && (
                  <p className="mt-1 text-xs font-bold">
                    +{submitResult.rewards.dailyBonusRanking} bonus
                  </p>
                )}
              </div>

              {/* Streak 🔥 — ẩn card nếu count === 0 */}
              {submitResult.streak.count > 0 ? (
                <div className="rounded-lg bg-warning-50 p-4 text-warning-700">
                  <p className="text-sm font-semibold">🔥 Streak</p>
                  <p className="text-2xl font-black">{submitResult.streak.count} ngày</p>
                </div>
              ) : (
                <div className="rounded-lg bg-neutral-100 p-4 text-neutral-500">
                  <p className="text-sm font-semibold">🔥 Streak</p>
                  <p className="text-sm font-bold">Chưa có streak</p>
                </div>
              )}

              {/* Badges 🏅 */}
              <div className="rounded-lg bg-success-50 p-4 text-success-700">
                <p className="text-sm font-semibold">🏅 Huy hiệu</p>
                {submitResult.badgesAwarded.length > 0 ? (
                  <ul className="mt-1 space-y-1 text-sm font-bold">
                    {submitResult.badgesAwarded.map((badge) => (
                      <li key={badge.id}>🏅 {badge.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-bold">Chưa có badge mới</p>
                )}
              </div>
            </div>

            {/* Context: giải thích ranking reset (Task 3.1) */}
            <p className="text-sm font-semibold text-amber-600">
              🏆 Điểm hạng xếp theo tuần/tháng — cạnh tranh trên bảng xếp hạng!
            </p>

            {/* Progress bias — chỉ hiện nếu previousBestScore !== null */}
            {progressBias !== null && (
              <div className="text-sm font-bold">
                {progressBias > 0 && (
                  <p className="text-success-700">Tốt hơn {progressBias}% so với lần trước!</p>
                )}
                {progressBias === 0 && <p className="text-neutral-600">Cùng điểm lần trước.</p>}
                {progressBias < 0 && (
                  <p className="text-warning-700">
                    Thấp hơn {-progressBias}% so với lần trước — cố gắng nhé!
                  </p>
                )}
              </div>
            )}

            {/* Level + XP hiện tại */}
            <p className="text-sm text-neutral-600">
              Level hiện tại:{" "}
              <span className="font-bold text-neutral-900">{submitResult.progress.level}</span> — XP:{" "}
              <span className="font-bold text-neutral-900">{submitResult.progress.currentXp}</span>
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="rounded-lg bg-warning-50 p-4 text-sm text-warning-800" role="alert">
            {submitError || "Kết quả local đã có, nhưng chưa lưu được vào database."}
          </div>
        )}

        {/* ===== TẦNG 3 (bottom): lỗi + nghe lại + 2 nút ===== */}
        {incorrectQuestions.length > 0 && (
          <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-left">
            <h2 className="mb-4 text-lg font-bold text-error-800">Cần chú ý</h2>
            <ul className="space-y-4">
              {incorrectQuestions.map((item, index) => {
                const audioUrl = parseWordPrompt(item.question.content).audioUrl;
                return (
                  <li
                    key={`${item.question.id}-${index}`}
                    className="rounded-lg border border-error-100 bg-white p-4"
                  >
                    <p className="font-bold text-neutral-900">"{formatQuestionWord(item.question)}"</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Bạn trả lời{" "}
                      <span className="font-bold text-error-700">{item.selected || "Không rõ"}</span>,
                      đáp án đúng là{" "}
                      <span className="font-bold text-success-700">{item.correct}</span>.
                    </p>
                    <div className="mt-2">
                      <ReplayButton audioUrl={audioUrl} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 2 nút */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button variant="primary" size="lg" className="min-h-14 text-lg" onClick={onRetry}>
            Làm lại bài này
          </Button>
          <Button variant="ghost" size="lg" className="min-h-14 text-lg" onClick={onExit}>
            Về lộ trình
          </Button>
        </div>
      </Card>
    </div>
  );
}
