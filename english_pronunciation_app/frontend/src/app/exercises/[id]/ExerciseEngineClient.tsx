"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import ListenFeedbackSheet from "./ListenFeedbackSheet";
import ExerciseSummaryScreen from "./ExerciseSummaryScreen";
import PraisePopup from "./components/PraisePopup";
import QuestionRenderer from "./components/QuestionRenderer";
import { useExerciseEngine } from "./useExerciseEngine";

// Re-exported for backward compatibility (10 consumer files import from here)
export type {
  ExerciseQuestion,
  ExerciseData,
  SubmitResult,
  IncorrectQuestion,
  WordPrompt,
} from "./types";
export { parseWordPrompt, normalizeAnswer } from "./parse-word-prompt";
import type { ExerciseData, EngineUnlocks } from "./types";

/**
 * Exercise engine orchestrator component.
 *
 * All state and handlers are managed by useExerciseEngine hook.
 * This component is purely responsible for layout and rendering.
 *
 * @see useExerciseEngine — core logic hook (~190 lines)
 * @see components/ — extracted sub-components (AudioButton, ListenChooseQuestion, PraisePopup)
 * @see types.ts — shared type definitions
 * @see parse-word-prompt.ts — question content parsing utilities
 */
export default function ExerciseEngineClient({
  exercise,
  unlocks = { unlockedSlowAudio: false, unlockedIpaReveal: false },
}: {
  exercise: ExerciseData;
  unlocks?: EngineUnlocks;
}) {
  const router = useRouter();

  const {
    currentIndex,
    score,
    incorrectQuestions,
    submitStatus,
    submitResult,
    submitError,
    isAnswered,
    isCorrect,
    selectedAnswer,
    isFinished,
    muted,
    setMuted,
    currentQuestion,
    progressPercent,
    currentHint,
    questions,
    handleAnswerListen,
    handleNextVoice,
    handleNextListen,
    combo,
  } = useExerciseEngine(exercise, unlocks);

  // Task 2.5: Confirm trước khi thoát bài đang làm (Nielsen H5 — Error Prevention).
  // Chỉ cảnh báo khi đã trả lời ≥1 câu và chưa kết thúc → tránh cảnh báo phiền
  // khi user mới vào chưa làm gì hoặc đã xong.
  const hasProgress = currentIndex > 0 && !isFinished;

  const handleBack = useCallback(() => {
    if (hasProgress) {
      const confirmed = window.confirm(
        "Bạn có chắc muốn thoát? Kết quả hiện tại sẽ không được lưu.",
      );
      if (!confirmed) return;
    }
    router.push("/learning_map");
  }, [hasProgress, router]);

  // Cảnh báo khi user đóng tab / reload / browser back khi đang làm bài.
  useEffect(() => {
    if (!hasProgress) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome/Firefox hiện thông báo native khi preventDefault được gọi.
      // returnValue cần set cho một số trình duyệt cũ.
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasProgress]);

  // === Empty exercise guard ===
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8">
        <Card>
          <h1 className="text-2xl font-bold text-neutral-900">Bài tập chưa có câu hỏi</h1>
          <p className="mt-2 text-neutral-600">Hãy thêm câu hỏi vào database trước khi demo bài này.</p>
          <Button className="mt-6" onClick={() => router.push("/learning_map")}>
            Quay về lộ trình
          </Button>
        </Card>
      </div>
    );
  }

  // === Finished: loading or summary ===
  if (isFinished) {
    if (!submitResult) {
      return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-50 p-6 sm:p-8">
          <Card className="w-full max-w-2xl space-y-8 p-8 text-center sm:p-12">
            <p className="text-lg font-bold text-neutral-700">
              {submitStatus === "error"
                ? submitError || "Không lưu được kết quả."
                : "Đang lưu kết quả..."}
            </p>
          </Card>
        </div>
      );
    }

    return (
      <ExerciseSummaryScreen
        exercise={exercise}
        submitResult={submitResult}
        incorrectQuestions={incorrectQuestions}
        submitStatus={submitStatus}
        submitError={submitError}
        onRetry={() => window.location.reload()}
        onExit={() => router.push("/learning_map")}
      />
    );
  }

  const isVoiceTask = currentQuestion?.type === "qtype-2-voice" || currentQuestion?.type === "qtype-3-minimal-pairs";

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 transition-colors sm:px-6">

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Quay về lộ trình"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-neutral-500 transition-colors hover:text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
          >
            <span aria-hidden="true">←</span> Lộ trình
          </button>
          {/* SFX mute toggle */}
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Bật âm thanh phản hồi" : "Tắt âm thanh phản hồi"}
            aria-pressed={muted}
            className="rounded-lg p-2 text-lg transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className="mx-4 max-w-2xl flex-1">
          <ProgressBar value={progressPercent} max={100} size="lg" showPercentage={false} label={`Câu ${currentIndex + 1}/${questions.length}`} />
        </div>

        <div className="flex items-center gap-3">
          {/* Combo 🔥 (milestone ≥3) */}
          {combo.milestone > 0 && (
            <span
              className="text-lg font-bold"
              title={`Combo ${combo.combo} câu đúng liên tiếp`}
              aria-label={`Combo ${combo.combo} câu đúng liên tiếp`}
            >
              {"🔥".repeat(combo.milestone)}
            </span>
          )}
          <div className="min-w-16 text-right font-bold text-neutral-700" aria-label={`Điểm hiện tại ${score}`}>
            {score} điểm
          </div>
        </div>
      </header>

      {/* Praise popup (0.6s on combo milestone) */}
      {combo.praise && <PraisePopup text={combo.praise} onDismiss={combo.clearPraise} />}

      <main className="mx-auto mt-10 flex w-full max-w-4xl flex-1 flex-col p-4 sm:p-6">
        <div className="mb-10 text-center text-sm font-bold uppercase tracking-wider text-neutral-400">
          Câu {currentIndex + 1} / {questions.length}
        </div>

        <QuestionRenderer
          question={currentQuestion}
          unlocks={unlocks}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          onAnswerListen={handleAnswerListen}
          onNextVoice={handleNextVoice}
        />
      </main>

      {!isVoiceTask && isAnswered && (
        <ListenFeedbackSheet
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          question={currentQuestion}
          hint={currentHint}
          onAdvance={handleNextListen}
        />
      )}
    </div>
  );
}
