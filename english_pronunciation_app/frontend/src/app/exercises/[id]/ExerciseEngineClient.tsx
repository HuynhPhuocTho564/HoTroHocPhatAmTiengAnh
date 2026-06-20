"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { playSfx, useSfxMuted } from "@/lib/sfx";
import { useComboStreak } from "@/hooks/useComboStreak";
import { useRewardEvents } from "@/components/gamification/effects/RewardEventContext";
import ListenFeedbackSheet from "./ListenFeedbackSheet";
import ExerciseSummaryScreen from "./ExerciseSummaryScreen";
import SpeakWordQuestion from "./SpeakWordQuestion";
import SpeakSentenceQuestion from "./SpeakSentenceQuestion";
import SpeakMinimalPairsQuestion from "./SpeakMinimalPairsQuestion";
import TapStressQuestion from "./TapStressQuestion";
import ChooseWeakQuestion from "./ChooseWeakQuestion";
import ChooseLinkingQuestion from "./ChooseLinkingQuestion";
import ChooseAssimilationQuestion from "./ChooseAssimilationQuestion";

type ExerciseQuestionOption = {
  id: string;
  content: string;
};

export type ExerciseQuestion = {
  id: string;
  name: string | null;
  content: string;
  type: string;
  answer: string;
  score: number;
  acceptedAnswers?: string[] | null; // v2 Mode B: multi-answer (g02 weak-forms contraction)
  options: ExerciseQuestionOption[];
};

export type ExerciseData = {
  id: string;
  name: string;
  description: string | null;
  questions: ExerciseQuestion[];
};

type EngineUnlocks = {
  unlockedSlowAudio: boolean;
  unlockedIpaReveal: boolean;
  userLevel?: number;
};

type WordPrompt = {
  word: string;
  ipa?: string;
  audioUrl?: string;
  hint?: string;
  options?: Array<{
    id?: string;
    text?: string;
    content?: string;
    audioUrl?: string;
  }>;
  // v2 listen_choose 3-stage (phoneme identification):
  answerType?: "phoneme";
  stage?: 1 | 2 | 3;
  targetPhoneme?: string;
  contrastPhonemes?: string[];
  skeleton?: string | null;
};

type SubmitAnswer = {
  questionId: string;
  selectedOptionId?: string | null;
  selectedText?: string | null;
  transcript?: string | null;
  audioUrl?: string | null;
  timeSpent?: number | null;
};

export type SubmitResult = {
  exerciseAttemptId: string;
  exerciseScore: number;
  isCompleted: boolean;
  rating: string;
  rewards: {
    totalXpEarned: number;
    totalRankingDelta: number;
    dailyBonusXp: number;
    dailyBonusRanking: number;
    retakeXp: number;
    retakeRanking: number;
    gemsEarned: number;
    questXpEarned: number;
    questGemsEarned: number;
  };
  progress: {
    currentXp: number;
    level: number;
    nextLevelXp: number;
  };
  badgesAwarded: Array<{ id: string; name: string; type: string }>;
  previousBestScore: number | null;
  streak: {
    count: number;
    longest: number;
    totalCheckIns?: number;
    autoCheckedIn?: boolean;
  };
};

export type IncorrectQuestion = {
  question: ExerciseQuestion;
  selected: string;
  correct: string;
};

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseWordPrompt(content: string): WordPrompt {
  try {
    const parsed = JSON.parse(content) as Partial<WordPrompt>;
    return {
      word: String(parsed.word ?? content),
      ipa: parsed.ipa ? String(parsed.ipa) : undefined,
      audioUrl: parsed.audioUrl ? String(parsed.audioUrl) : undefined,
      hint: parsed.hint ? String(parsed.hint) : undefined,
      options: Array.isArray(parsed.options) ? parsed.options : undefined,
      // v2 listen_choose 3-stage (phoneme identification) — phải gán để engine render đúng stage
      answerType: parsed.answerType,
      stage: parsed.stage,
      targetPhoneme: parsed.targetPhoneme ? String(parsed.targetPhoneme) : undefined,
      contrastPhonemes: Array.isArray(parsed.contrastPhonemes) ? parsed.contrastPhonemes.map(String) : undefined,
      skeleton: parsed.skeleton === null ? null : parsed.skeleton ? String(parsed.skeleton) : undefined,
    };
  } catch {
    return {
      word: content,
      audioUrl: content.startsWith("/") || content.startsWith("http") ? content : undefined,
    };
  }
}

function AudioButton({
  audioUrl,
  label = "Nghe mẫu",
  dark = false,
}: {
  audioUrl?: string;
  label?: string;
  dark?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Audio playback failed:", error);
        setIsPlaying(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={playAudio}
      disabled={!audioUrl}
      aria-label={label}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${
        dark
          ? "border-neutral-600 text-neutral-300 hover:border-white hover:text-white"
          : "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100"
      } ${isPlaying ? "animate-pulse" : ""}`}
    >
      {isPlaying ? "Đang phát" : label}
    </button>
  );
}

function ListenChooseQuestion({
  question,
  onAnswer,
  isAnswered,
  selectedAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (isCorrect: boolean, selectedOpt: string, selectedOptionId?: string | null) => void;
  isAnswered: boolean;
  selectedAnswer: string | null;
}) {
  const contentData = useMemo(() => parseWordPrompt(question.content), [question.content]);
  // v2 listen_choose 3-stage: stage 1 (hiện word), 2 (skeleton), 3 (chỉ audio). Fallback 1 cho câu cũ (word-mode).
  const stage = contentData.stage ?? 1;
  const isPhonemeMode = contentData.answerType === "phoneme";

  // Phoneme mode: option = contrastPhonemes (N nút IPA). Word mode (cũ): option = contentData.options.
  const options = isPhonemeMode
    ? (contentData.contrastPhonemes ?? []).map((ph, i) => ({
        id: `${question.id}-ph-${i}`,
        content: ph,
      }))
    : (question.options.length > 0
        ? question.options
        : contentData.options
            ?.map((option, index) => ({
              id: String(option.id ?? `${question.id}-json-option-${index}`),
              content: String(option.text ?? option.content ?? ""),
            }))
            .filter((option) => option.content.length > 0) ?? []);

  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : "...";

  useEffect(() => {
    if (!contentData.audioUrl) return;

    const timer = window.setTimeout(() => {
      const audio = new Audio(contentData.audioUrl);
      audio.play().catch((error) => console.warn("Autoplay prevented:", error));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [contentData.audioUrl, question.id]);

  // Exact-match cho phoneme (IPA không normalize được), normalize cho word.
  const checkCorrect = (optContent: string) =>
    isPhonemeMode ? optContent === question.answer : normalizeAnswer(optContent) === normalizeAnswer(question.answer);

  // Stage 2 skeleton: split theo "_" và highlight ô trống màu warning.
  const skeletonParts = contentData.skeleton ? contentData.skeleton.split("_") : [];

  return (
    <div className="space-y-10 text-center">
      <div className="flex flex-col items-center gap-4">
        {/* Stage 1: hiện word. Stage 2: ẩn word, hiện skeleton (fallback word nếu skeleton null). Stage 3: ẩn cả. */}
        {stage === 1 && (
          <h2 className="text-5xl font-bold text-neutral-900 sm:text-6xl">{displayWord}</h2>
        )}
        {stage === 2 &&
          (contentData.skeleton ? (
            <h2 className="font-ipa text-5xl font-bold text-neutral-900 sm:text-6xl" aria-label={`IPA khuyết: ${contentData.skeleton}`}>
              {skeletonParts.map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="mx-1 inline-block min-w-[1ch] rounded-md bg-warning-100 px-2 text-warning-600 underline">
                      _
                    </span>
                  )}
                </span>
              ))}
            </h2>
          ) : (
            // fallback: target không trong ipa → render stage 1 (show word)
            <h2 className="text-5xl font-bold text-neutral-900 sm:text-6xl">{displayWord}</h2>
          ))}
        {/* Stage 3: không hiện word/skeleton */}
        <AudioButton audioUrl={contentData.audioUrl} label="Phát lại audio" />
      </div>

      <div>
        <p className="mb-6 text-lg font-medium text-neutral-600">
          {stage === 1 && (question.name || "Phân biệt âm mục tiêu")}
          {stage === 2 && (question.name || "Nghe & điền âm còn thiếu")}
          {stage === 3 && (question.name || "Âm bạn vừa nghe là")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {options.map((option) => {
            let buttonClass = "border-neutral-200 bg-white text-neutral-800 hover:border-primary-300";
            if (isAnswered) {
              if (checkCorrect(option.content)) {
                buttonClass = "border-success-500 bg-success-50 text-success-700 ring-4 ring-success-100";
              } else if (option.content === selectedAnswer) {
                buttonClass = "border-error-500 bg-error-50 text-error-700 animate-shake";
              } else {
                buttonClass = "border-neutral-200 bg-neutral-50 text-neutral-400";
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onAnswer(
                    checkCorrect(option.content),
                    option.content,
                    question.options.length > 0 ? option.id : null,
                  )
                }
                disabled={isAnswered}
                aria-pressed={selectedAnswer === option.content}
                className={`h-20 min-w-32 rounded-xl border-4 px-6 font-ipa text-3xl font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 ${buttonClass}`}
              >
                {option.content}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Popup lời khen ngẫu nhiên hiện ngắn (0.6s) khi combo đạt milestone mới (SP1 feedback).
function PraisePopup({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 600);
    return () => window.clearTimeout(timer);
  }, [text, onDismiss]);
  return (
    <div
      className="pointer-events-none fixed left-1/2 top-24 z-20 -translate-x-1/2 animate-bounce rounded-full bg-primary-600 px-6 py-3 text-lg font-bold text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
}

export default function ExerciseEngineClient({ exercise, unlocks = { unlockedSlowAudio: false, unlockedIpaReveal: false } }: { exercise: ExerciseData; unlocks?: EngineUnlocks }) {
  const router = useRouter();
  const { emit } = useRewardEvents();
  const previousLevelRef = useRef(unlocks.userLevel ?? 0);
  const [startedAt] = useState(() => new Date().toISOString());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>([]);
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);
  const answersRef = useRef<SubmitAnswer[]>([]);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // SP1 feedback: SFX (ting/buzz) + combo streak (🔥 + lời khen)
  const combo = useComboStreak();
  const maxComboRef = useRef(0);
  const [muted, setMuted] = useSfxMuted();

  const questions = exercise.questions;
  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  const currentHint = useMemo(() => {
    if (!currentQuestion) return "";
    return parseWordPrompt(currentQuestion.content).hint ?? "";
  }, [currentQuestion]);

  const recordAnswer = (answer: SubmitAnswer) => {
    const existingIndex = answersRef.current.findIndex((item) => item.questionId === answer.questionId);
    const nextAnswers = [...answersRef.current];

    if (existingIndex >= 0) {
      nextAnswers[existingIndex] = answer;
    } else {
      nextAnswers.push(answer);
    }

    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    return nextAnswers;
  };

  const submitExercise = async (finalAnswers: SubmitAnswer[]) => {
    setSubmitStatus("submitting");
    setSubmitError(null);

    try {
      const response = await fetch("/api/exercises/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          startedAt,
          completedAt: new Date().toISOString(),
          answers: finalAnswers,
          maxCombo: maxComboRef.current,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setSubmitStatus("error");
        setSubmitError(payload.error?.message || "Không lưu được kết quả bài làm.");
        return;
      }

      setSubmitResult(payload.data);
      setSubmitStatus("success");

      // === Emit reward celebration events ===
      const rewards = payload.data?.rewards;
      const progress = payload.data?.progress;
      const badges = payload.data?.badgesAwarded;

      if (rewards) {
        if (rewards.totalXpEarned > 0) {
          emit({ type: "xp", amount: rewards.totalXpEarned, label: `+${rewards.totalXpEarned} XP`, icon: "⭐" });
        }
        if (rewards.gemsEarned > 0) {
          emit({ type: "gems", amount: rewards.gemsEarned, label: `+${rewards.gemsEarned} 💎`, icon: "💎" });
        }
        if (rewards.questXpEarned > 0) {
          emit({
            type: "quest_complete",
            amount: rewards.questXpEarned,
            questGems: rewards.questGemsEarned,
            label: "Nhiệm vụ hoàn thành!",
            questDesc: "Nhiệm vụ hàng ngày",
          });
        }
      }
      if (progress && progress.level > previousLevelRef.current) {
        emit({ type: "level_up", level: progress.level, label: `Lên cấp ${progress.level}!`, icon: "🎯" });
        previousLevelRef.current = progress.level;
      }
      if (badges && Array.isArray(badges)) {
        for (const badge of badges) {
          emit({ type: "badge_earned", badgeName: badge.name, label: `Huy hiệu: ${badge.name}`, icon: "🏆" });
        }
      }
    } catch {
      setSubmitStatus("error");
      setSubmitError("Không kết nối được API lưu bài làm.");
    }
  };

  const finishExercise = (finalAnswers = answersRef.current) => {
    setIsFinished(true);
    combo.reset();
    void submitExercise(finalAnswers);
  };

  const addIncorrectQuestion = (selected: string) => {
    setIncorrectQuestions((current) => [
      ...current,
      {
        question: currentQuestion,
        selected,
        correct: currentQuestion.answer,
      },
    ]);
  };

  const handleAnswerListen = (
    correct: boolean,
    answerOpt: string,
    selectedOptionId?: string | null,
    selectedTextOverride?: string,
  ) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    setSelectedAnswer(answerOpt);
    recordAnswer({
      questionId: currentQuestion.id,
      selectedOptionId: selectedOptionId ?? null,
      selectedText: selectedTextOverride ?? answerOpt, // multi-select truyền join
      transcript: null,
      timeSpent: null,
    });

    if (correct) {
      setScore((current) => current + currentQuestion.score);
      playSfx("correct");
      combo.onCorrect();
      maxComboRef.current = Math.max(maxComboRef.current, combo.combo + 1);
    } else {
      addIncorrectQuestion(answerOpt);
      playSfx("wrong");
      combo.onWrong();
    }
  };

  const handleNextVoice = (correct: boolean, transcript: string) => {
    const finalAnswers = recordAnswer({
      questionId: currentQuestion.id,
      selectedText: null,
      transcript,
      timeSpent: null,
    });

    if (correct) {
      setScore((current) => current + currentQuestion.score);
      playSfx("correct");
      combo.onCorrect();
      maxComboRef.current = Math.max(maxComboRef.current, combo.combo + 1);
    } else {
      addIncorrectQuestion(transcript);
      playSfx("wrong");
      combo.onWrong();
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
    } else {
      finishExercise(finalAnswers);
    }
  };

  const handleNextListen = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      finishExercise();
    }
  };

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
            onClick={() => router.push("/learning_map")}
            aria-label="Quay về lộ trình"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-neutral-500 transition-colors hover:text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
          >
            <span aria-hidden="true">←</span> Lộ trình
          </button>
          {/* Nút mute SFX */}
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

      {/* Praise popup (hiện 0.6s khi đạt milestone combo) */}
      {combo.praise && <PraisePopup text={combo.praise} onDismiss={combo.clearPraise} />}

      <main className="mx-auto mt-10 flex w-full max-w-4xl flex-1 flex-col p-4 sm:p-6">
        <div className="mb-10 text-center text-sm font-bold uppercase tracking-wider text-neutral-400">
          Câu {currentIndex + 1} / {questions.length}
        </div>

        {currentQuestion.type === "qtype-1-mc" && (
          <ListenChooseQuestion question={currentQuestion} onAnswer={handleAnswerListen} isAnswered={isAnswered} selectedAnswer={selectedAnswer} />
        )}

        {currentQuestion.type === "qtype-2-voice" &&
          (parseWordPrompt(currentQuestion.content).word ? (
            <SpeakWordQuestion key={currentQuestion.id} question={currentQuestion} onNext={handleNextVoice} />
          ) : (
            <SpeakSentenceQuestion key={currentQuestion.id} question={currentQuestion} onNext={handleNextVoice} unlockedSlowAudio={unlocks.unlockedSlowAudio} unlockedIpaReveal={unlocks.unlockedIpaReveal} />
          ))}

        {currentQuestion.type === "qtype-3-minimal-pairs" && (
          <SpeakMinimalPairsQuestion key={currentQuestion.id} question={currentQuestion} onNext={handleNextVoice} />
        )}

        {currentQuestion.type === "qtype-4-tap-stress" && (
          <TapStressQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswerListen}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
          />
        )}

        {currentQuestion.type === "qtype-5-choose-weak" && (
          <ChooseWeakQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswerListen}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
          />
        )}

        {currentQuestion.type === "qtype-6-choose-linking" && (
          <ChooseLinkingQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswerListen}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
          />
        )}

        {currentQuestion.type === "qtype-7-choose-assimilation" && (
          <ChooseAssimilationQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswerListen}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
          />
        )}
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
