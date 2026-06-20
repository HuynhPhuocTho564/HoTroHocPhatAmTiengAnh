"use client";

import { useEffect, useMemo, useState } from "react";
import { type ExerciseQuestion } from "./ExerciseEngineClient";

type TapStressQuestionProps = {
  question: ExerciseQuestion;
  onAnswer: (isCorrect: boolean, selectedOpt: string, selectedOptionId?: string | null) => void;
  isAnswered: boolean;
  selectedAnswer: string | null;
};

type TapStressContent = {
  word: string;
  ipa: string;
  syllables: string[];
  stressIndex: number;
  audioUrl: string;
};

function parseTapStress(content: string): TapStressContent {
  try {
    const p = JSON.parse(content) as Partial<TapStressContent>;
    return {
      word: String(p.word ?? ""),
      ipa: String(p.ipa ?? ""),
      syllables: Array.isArray(p.syllables) ? p.syllables.map(String) : [],
      stressIndex: typeof p.stressIndex === "number" ? p.stressIndex : 0,
      audioUrl: String(p.audioUrl ?? ""),
    };
  } catch {
    return { word: "", ipa: "", syllables: [], stressIndex: 0, audioUrl: "" };
  }
}

export default function TapStressQuestion({
  question,
  onAnswer,
  isAnswered,
  selectedAnswer,
}: TapStressQuestionProps) {
  const data = useMemo(() => parseTapStress(question.content), [question.content]);
  const correctIdx = data.stressIndex;
  const [autoPlayed, setAutoPlayed] = useState(false);

  // Autoplay audio 500ms sau mount (pattern ListenChooseQuestion:204-213)
  useEffect(() => {
    if (!data.audioUrl || autoPlayed) return;
    const t = window.setTimeout(() => {
      const a = new Audio(data.audioUrl);
      a.play().catch((e) => console.warn("Autoplay prevented:", e));
      setAutoPlayed(true);
    }, 500);
    return () => window.clearTimeout(t);
  }, [data.audioUrl, autoPlayed]);

  const replay = () => {
    if (!data.audioUrl) return;
    new Audio(data.audioUrl).play().catch((e) => console.warn("audio failed:", e));
  };

  // options = syllables (AnswerOption rows từ seed); fallback parse từ content nếu rỗng
  const options =
    question.options.length > 0
      ? question.options
      : data.syllables.map((s, i) => ({ id: `${question.id}-syl-${i}`, content: s }));

  return (
    <div className="space-y-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold text-neutral-900 sm:text-5xl">{data.word}</h2>
        {data.ipa && <p className="font-ipa text-2xl text-neutral-600">{data.ipa}</p>}
        <button
          type="button"
          onClick={replay}
          disabled={!data.audioUrl}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-warning-200 bg-warning-50 px-4 py-2 text-sm font-bold text-warning-800 transition-colors hover:bg-warning-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-warning-500 disabled:opacity-50"
        >
          🔊 Phát lại
        </button>
      </div>

      <div>
        <p className="mb-6 text-lg font-medium text-neutral-600">Bấm âm tiết được nhấn</p>
        <div className="flex flex-wrap justify-center gap-4">
          {options.map((option, idx) => {
            const isCorrectOpt = idx === correctIdx;
            const isSelected = option.content === selectedAnswer;
            let cls = "border-neutral-200 bg-white text-neutral-800 hover:border-primary-300";
            if (isAnswered) {
              if (isCorrectOpt) {
                cls = "border-success-500 bg-success-50 text-success-700 ring-4 ring-success-100";
              } else if (isSelected) {
                cls = "border-error-500 bg-error-50 text-error-700 animate-shake";
              } else {
                cls = "border-neutral-200 bg-neutral-50 text-neutral-400";
              }
            }
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onAnswer(
                    isCorrectOpt,
                    option.content,
                    question.options.length > 0 ? option.id : null,
                  )
                }
                disabled={isAnswered}
                aria-pressed={isSelected}
                className={`h-20 min-w-32 rounded-xl border-4 px-6 text-3xl font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 ${cls}`}
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
