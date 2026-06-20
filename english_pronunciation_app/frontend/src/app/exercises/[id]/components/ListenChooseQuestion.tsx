"use client";

import { useEffect, useMemo } from "react";
import AudioButton from "./AudioButton";
import { parseWordPrompt, normalizeAnswer } from "../parse-word-prompt";
import type { ExerciseQuestion } from "../types";

/**
 * Listen-choose question renderer (qtype-1-mc).
 *
 * Supports 3 stages for v2 phoneme identification:
 *   Stage 1: Show word + audio + options
 *   Stage 2: Show skeleton (IPA with blanks) + audio + options
 *   Stage 3: Audio only + options
 *
 * Phoneme mode: exact-match IPA buttons. Word mode: normalized comparison.
 *
 * Extracted from ExerciseEngineClient (was inline, ~120 lines).
 */
export default function ListenChooseQuestion({
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
