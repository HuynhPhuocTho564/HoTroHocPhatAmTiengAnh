"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

type ExerciseQuestionOption = {
  id: string;
  content: string;
};

type ExerciseQuestion = {
  id: string;
  name: string | null;
  content: string;
  type: string;
  answer: string;
  score: number;
  options: ExerciseQuestionOption[];
};

type ExerciseData = {
  id: string;
  name: string;
  description: string | null;
  questions: ExerciseQuestion[];
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
  }>;
};

type SubmitAnswer = {
  questionId: string;
  selectedOptionId?: string | null;
  selectedText?: string | null;
  transcript?: string | null;
  audioUrl?: string | null;
  timeSpent?: number | null;
};

type SubmitResult = {
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
  };
  progress: {
    currentXp: number;
    level: number;
    nextLevelXp: number;
  };
};

type IncorrectQuestion = {
  question: ExerciseQuestion;
  selected: string;
  correct: string;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionResultEventLike = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const speechWindow = window as Window &
    typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseWordPrompt(content: string): WordPrompt {
  try {
    const parsed = JSON.parse(content) as Partial<WordPrompt>;
    return {
      word: String(parsed.word ?? content),
      ipa: parsed.ipa ? String(parsed.ipa) : undefined,
      audioUrl: parsed.audioUrl ? String(parsed.audioUrl) : undefined,
      hint: parsed.hint ? String(parsed.hint) : undefined,
      options: Array.isArray(parsed.options) ? parsed.options : undefined,
    };
  } catch {
    return {
      word: content,
      audioUrl: content.startsWith("/") || content.startsWith("http") ? content : undefined,
    };
  }
}

function parsePairPrompt(content: string): [WordPrompt, WordPrompt] {
  try {
    const parsed = JSON.parse(content) as Array<Partial<WordPrompt>>;
    if (Array.isArray(parsed) && parsed.length >= 2) {
      return [
        {
          word: String(parsed[0].word ?? "Word 1"),
          ipa: parsed[0].ipa ? String(parsed[0].ipa) : undefined,
          audioUrl: parsed[0].audioUrl ? String(parsed[0].audioUrl) : undefined,
          hint: parsed[0].hint ? String(parsed[0].hint) : undefined,
        },
        {
          word: String(parsed[1].word ?? "Word 2"),
          ipa: parsed[1].ipa ? String(parsed[1].ipa) : undefined,
          audioUrl: parsed[1].audioUrl ? String(parsed[1].audioUrl) : undefined,
          hint: parsed[1].hint ? String(parsed[1].hint) : undefined,
        },
      ];
    }
  } catch {
    // Plain text fallback below.
  }

  const words = content
    .split(/[-,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    { word: words[0] ?? "Word 1" },
    { word: words[1] ?? "Word 2" },
  ];
}

function formatQuestionWord(question: ExerciseQuestion) {
  try {
    const parsed = JSON.parse(question.content);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => item.word).filter(Boolean).join(" & ");
    }
    if (parsed?.word) return String(parsed.word);
  } catch {
    // Plain text fallback below.
  }

  return question.content;
}

function createRecognition(
  onResult: (transcript: string) => void,
  onError: () => void,
): SpeechRecognitionLike | null {
  const SpeechRecognition = getSpeechRecognitionConstructor();
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    onResult(event.results[0][0].transcript);
  };
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    onError();
  };

  return recognition;
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
  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : "...";
  const parsedOptions =
    contentData.options
      ?.map((option, index) => ({
        id: String(option.id ?? `${question.id}-json-option-${index}`),
        content: String(option.text ?? option.content ?? ""),
      }))
      .filter((option) => option.content.length > 0) ?? [];
  const options = question.options.length > 0 ? question.options : parsedOptions;

  useEffect(() => {
    if (!contentData.audioUrl) return;

    const timer = window.setTimeout(() => {
      const audio = new Audio(contentData.audioUrl);
      audio.play().catch((error) => console.warn("Autoplay prevented:", error));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [contentData.audioUrl, question.id]);

  return (
    <div className="space-y-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-5xl font-bold text-neutral-900 sm:text-6xl">{displayWord}</h2>
        {contentData.ipa && <p className="font-ipa text-2xl text-neutral-500">{contentData.ipa}</p>}
        <AudioButton audioUrl={contentData.audioUrl} label="Phát lại audio" />
      </div>

      <div>
        <p className="mb-6 text-lg font-medium text-neutral-600">{question.name || "Chọn đáp án đúng"}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {options.map((option) => {
            let buttonClass = "border-neutral-200 bg-white text-neutral-800 hover:border-primary-300";
            if (isAnswered) {
              if (normalizeAnswer(option.content) === normalizeAnswer(question.answer)) {
                buttonClass = "border-success-500 bg-success-50 text-success-700 ring-4 ring-success-100";
              } else if (option.content === selectedAnswer) {
                buttonClass = "border-error-500 bg-error-50 text-error-700";
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
                    normalizeAnswer(option.content) === normalizeAnswer(question.answer),
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

function VoiceQuestion({
  question,
  onNext,
}: {
  question: ExerciseQuestion;
  onNext: (isCorrect: boolean, transcript: string) => void;
}) {
  const contentData = useMemo(() => parseWordPrompt(question.content), [question.content]);
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "correct" | "incorrect" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [speechUnsupported, setSpeechUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSpeechUnsupported(getSpeechRecognitionConstructor() === null);
    setStatus("idle");
    setTranscript("");
    setRetryCount(0);
  }, [question.id]);

  const checkAnswer = (recordedText: string) => {
    setStatus("processing");

    window.setTimeout(() => {
      if (normalizeAnswer(recordedText) === normalizeAnswer(question.answer)) {
        setStatus("correct");
      } else {
        setStatus("incorrect");
        setRetryCount((current) => current + 1);
      }
    }, 400);
  };

  const startRecording = () => {
    const recognition = createRecognition(
      (currentTranscript) => {
        setTranscript(currentTranscript);
        checkAnswer(currentTranscript);
      },
      () => setStatus("error"),
    );

    if (!recognition) {
      setSpeechUnsupported(true);
      setStatus("error");
      return;
    }

    recognition.onend = () => {
      setStatus((current) => (current === "recording" ? "error" : current));
    };

    recognitionRef.current = recognition;
    setStatus("recording");
    setTranscript("");

    try {
      recognition.start();
      window.setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          // Browser may have already stopped recognition.
        }
      }, 5000);
    } catch (error) {
      console.error("Could not start recognition:", error);
      setStatus("error");
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Browser may have already stopped recognition.
    }
  };

  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : question.answer;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex min-h-[400px] flex-col justify-between rounded-xl border border-neutral-200 bg-white p-8 text-neutral-900 shadow-sm">
        <div className="space-y-4 text-center">
          <h2 className="text-5xl font-bold text-neutral-900">{displayWord}</h2>
          {contentData.ipa && <p className="font-ipa text-2xl text-neutral-500">{contentData.ipa}</p>}
          {(status === "idle" || status === "error" || status === "incorrect") && (
            <AudioButton audioUrl={contentData.audioUrl} label="Nghe phát âm mẫu" />
          )}
        </div>

        <div className="mt-8 flex flex-1 items-center justify-center">
          {status === "idle" && (
            <div className="w-full text-center">
              <p className="mb-6 text-lg font-medium text-neutral-500">{question.name || "Đọc thành tiếng"}</p>
              {speechUnsupported && (
                <div className="mb-4 rounded-lg border border-warning-200 bg-warning-50 p-4 text-sm font-medium text-warning-800" role="alert">
                  Trình duyệt hiện tại không hỗ trợ Web Speech API. Hãy dùng Chrome/Edge trên desktop để demo chức năng ghi âm.
                </div>
              )}
              <button
                type="button"
                onClick={startRecording}
                className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-neutral-200 px-4 py-4 text-lg font-bold text-neutral-800 transition-all hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
              >
                Bắt đầu ghi âm
              </button>
            </div>
          )}

          {status === "recording" && (
            <div className="w-full text-center">
              <div className="mb-6 flex items-center justify-center gap-3 text-error-600" role="status">
                <span className="h-3 w-3 rounded-full bg-error-500" aria-hidden="true" />
                <span className="font-bold">Đang nghe...</span>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="flex min-h-14 w-full items-center justify-center rounded-xl bg-neutral-100 px-4 py-4 text-lg font-bold text-neutral-800 transition-all hover:bg-neutral-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
              >
                Dừng ghi âm
              </button>
            </div>
          )}

          {status === "processing" && (
            <div className="text-center font-medium text-neutral-500" role="status">
              Đang phân tích giọng nói...
            </div>
          )}

          {status === "error" && (
            <div className="w-full text-center">
              <div className="mb-6 rounded-lg border border-warning-200 bg-warning-50 p-4 text-warning-800" role="alert">
                {speechUnsupported
                  ? "Trình duyệt không hỗ trợ Web Speech API. Hãy dùng Chrome/Edge trên desktop."
                  : "Không nghe thấy giọng nói hoặc có lỗi kết nối. Hãy thử lại."}
              </div>
              <button
                type="button"
                onClick={startRecording}
                className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-neutral-200 px-4 py-4 text-lg font-bold text-neutral-800 transition-all hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
              >
                Thử lại
              </button>
            </div>
          )}

          {status === "correct" && (
            <div className="w-full space-y-6 text-left">
              <h3 className="text-xl font-bold text-success-700">Phát âm đúng</h3>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
                <p>
                  Bạn nói: <span className="font-bold text-neutral-900">"{transcript}"</span>
                </p>
                <p>
                  Đáp án: <span className="font-bold text-success-700">"{question.answer}"</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNext(true, transcript)}
                className="min-h-14 w-full rounded-xl bg-success-600 px-4 py-4 font-bold text-white transition-all hover:bg-success-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-success-500"
              >
                Tiếp theo
              </button>
            </div>
          )}

          {status === "incorrect" && (
            <div className="w-full space-y-6 text-left">
              <h3 className="text-xl font-bold text-error-700">Chưa khớp</h3>
              {retryCount > 0 && <p className="text-sm font-medium text-neutral-500">Số lần thử sai: {retryCount}</p>}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
                <p>
                  Bạn nói: <span className="font-bold text-error-700">"{transcript || "Không rõ"}"</span>
                </p>
                <p>
                  Đáp án: <span className="font-bold text-neutral-900">"{question.answer}"</span>
                </p>
              </div>
              {contentData.hint && (
                <div className="rounded-lg border border-warning-200 bg-warning-50 p-4 text-warning-800">
                  {contentData.hint}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={startRecording}
                  className="min-h-14 flex-1 rounded-xl border-2 border-primary-200 bg-primary-50 px-4 py-4 font-bold text-primary-700 transition-all hover:bg-primary-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                >
                  Thử lại
                </button>
                <button
                  type="button"
                  onClick={() => onNext(false, transcript)}
                  className="min-h-14 flex-1 rounded-xl px-4 py-4 font-bold text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MinimalPairsQuestion({
  question,
  onNext,
}: {
  question: ExerciseQuestion;
  onNext: (isCorrect: boolean, transcript: string) => void;
}) {
  const pairs = useMemo(() => parsePairPrompt(question.content), [question.content]);
  const [statuses, setStatuses] = useState<Array<"idle" | "recording" | "recorded">>(["idle", "idle"]);
  const [transcripts, setTranscripts] = useState(["", ""]);
  const [overallStatus, setOverallStatus] = useState<"idle" | "processing" | "correct" | "incorrect">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setStatuses(["idle", "idle"]);
    setTranscripts(["", ""]);
    setOverallStatus("idle");
    setErrorMessage(null);
  }, [question.id]);

  const startRecording = (index: number) => {
    const recognition = createRecognition(
      (currentTranscript) => {
        setTranscripts((current) => current.map((item, itemIndex) => (itemIndex === index ? currentTranscript : item)));
        setStatuses((current) => current.map((item, itemIndex) => (itemIndex === index ? "recorded" : item)));
      },
      () => {
        setStatuses((current) => current.map((item, itemIndex) => (itemIndex === index ? "idle" : item)));
        setErrorMessage("Không nghe thấy giọng nói hoặc có lỗi kết nối. Hãy thử lại.");
      },
    );

    if (!recognition) {
      setErrorMessage("Trình duyệt không hỗ trợ Web Speech API. Hãy dùng Chrome/Edge trên desktop.");
      return;
    }

    recognition.onend = () => {
      setStatuses((current) => current.map((item, itemIndex) => (itemIndex === index && item === "recording" ? "idle" : item)));
    };

    recognitionRef.current = recognition;
    setErrorMessage(null);
    setStatuses((current) => current.map((item, itemIndex) => (itemIndex === index ? "recording" : item)));

    try {
      recognition.start();
      window.setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          // Browser may have already stopped recognition.
        }
      }, 5000);
    } catch (error) {
      console.error("Could not start recognition:", error);
      setErrorMessage("Không thể bắt đầu ghi âm. Hãy thử lại.");
      setStatuses((current) => current.map((item, itemIndex) => (itemIndex === index ? "idle" : item)));
    }
  };

  const checkBothAnswers = () => {
    setOverallStatus("processing");

    window.setTimeout(() => {
      const firstCorrect = normalizeAnswer(transcripts[0]) === normalizeAnswer(pairs[0].word);
      const secondCorrect = normalizeAnswer(transcripts[1]) === normalizeAnswer(pairs[1].word);
      setOverallStatus(firstCorrect && secondCorrect ? "correct" : "incorrect");
    }, 400);
  };

  const combinedTranscript = transcripts.filter(Boolean).join(" ");
  const canCheck = statuses[0] === "recorded" && statuses[1] === "recorded";

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl bg-neutral-950 p-6 text-neutral-200 shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Minimal pairs</h2>
        <p className="mt-2 text-neutral-400">{question.name || "Đọc lần lượt hai từ"}</p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-warning-300 bg-warning-50 p-4 text-sm font-bold text-warning-800" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {pairs.map((pair, index) => (
          <div key={`${pair.word}-${index}`} className="rounded-lg border border-neutral-700 p-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Từ số {index + 1}</p>
            <h3 className="text-3xl font-bold uppercase text-white">{pair.word}</h3>
            {pair.ipa && <p className="mt-2 font-ipa text-xl text-neutral-400">{pair.ipa}</p>}
            <div className="mt-5">
              <AudioButton audioUrl={pair.audioUrl} label="Nghe mẫu" dark />
            </div>
            <button
              type="button"
              onClick={() => startRecording(index)}
              disabled={statuses[index] === "recording"}
              className="mt-5 min-h-12 w-full rounded-lg border border-neutral-600 px-4 py-3 font-bold text-neutral-200 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:cursor-wait disabled:opacity-70"
            >
              {statuses[index] === "recording" ? "Đang nghe..." : statuses[index] === "recorded" ? "Ghi âm lại" : "Bấm để nói"}
            </button>
            {statuses[index] === "recorded" && (
              <p className="mt-4 text-sm text-neutral-400">
                Bạn đọc: <span className="text-white">"{transcripts[index]}"</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {overallStatus === "idle" || overallStatus === "processing" ? (
        <button
          type="button"
          onClick={checkBothAnswers}
          disabled={!canCheck || overallStatus === "processing"}
          className="min-h-14 w-full rounded-lg border border-neutral-600 px-4 py-4 font-bold uppercase tracking-widest text-neutral-200 transition-colors hover:border-white hover:bg-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {overallStatus === "processing" ? "Đang kiểm tra" : "Kiểm tra"}
        </button>
      ) : overallStatus === "correct" ? (
        <div className="space-y-5 text-center">
          <h3 className="text-2xl font-bold text-success-400">Xuất sắc</h3>
          <button
            type="button"
            onClick={() => onNext(true, combinedTranscript)}
            className="min-h-12 rounded-lg border border-success-400 px-8 py-3 font-bold text-success-400 transition-colors hover:bg-success-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-success-500"
          >
            Chuyển tiếp
          </button>
        </div>
      ) : (
        <div className="space-y-5 text-center">
          <h3 className="text-2xl font-bold text-error-400">Chưa chính xác</h3>
          <p className="text-sm text-neutral-400">
            Đáp án cần đạt: {pairs[0].word} {pairs[1].word}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setOverallStatus("idle")}
              className="min-h-12 rounded-lg border border-primary-400 px-6 py-3 font-bold text-primary-300 transition-colors hover:bg-primary-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
            >
              Làm lại
            </button>
            <button
              type="button"
              onClick={() => onNext(false, combinedTranscript)}
              className="min-h-12 rounded-lg border border-neutral-600 px-6 py-3 font-bold text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExerciseEngineClient({ exercise }: { exercise: ExerciseData }) {
  const router = useRouter();
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
    } catch {
      setSubmitStatus("error");
      setSubmitError("Không kết nối được API lưu bài làm.");
    }
  };

  const finishExercise = (finalAnswers = answersRef.current) => {
    setIsFinished(true);
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

  const handleAnswerListen = (correct: boolean, answerOpt: string, selectedOptionId?: string | null) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    setSelectedAnswer(answerOpt);
    recordAnswer({
      questionId: currentQuestion.id,
      selectedOptionId: selectedOptionId ?? null,
      selectedText: answerOpt,
      transcript: null,
      timeSpent: null,
    });

    if (correct) {
      setScore((current) => current + currentQuestion.score);
    } else {
      addIncorrectQuestion(answerOpt);
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
    } else {
      addIncorrectQuestion(transcript);
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
    const correctCount = questions.length - incorrectQuestions.length;
    const percent = Math.round((correctCount / questions.length) * 100);
    const isPassed = percent >= 80;

    return (
      <div className="flex min-h-screen flex-col items-center bg-neutral-50 p-6 sm:p-8">
        <Card className="w-full max-w-2xl space-y-8 p-8 text-center sm:p-12">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl font-black ${
              isPassed ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700"
            }`}
            aria-hidden="true"
          >
            {isPassed ? "OK" : "!"}
          </div>

          <h1 className="text-3xl font-bold text-neutral-900">{isPassed ? "Hoàn thành bài tập" : "Cần luyện thêm"}</h1>

          <div className="mx-auto inline-block w-full max-w-sm rounded-xl border border-neutral-200 bg-neutral-100 p-6">
            <p className="mb-2 text-lg font-medium text-neutral-700">
              Đúng {correctCount}/{questions.length} câu - {percent}%
            </p>
            <ProgressBar value={percent} max={100} color={isPassed ? "success" : "warning"} size="lg" />
            <p className={`mt-2 text-sm font-bold ${isPassed ? "text-success-700" : "text-warning-700"}`}>
              {isPassed ? "Kết quả tốt" : "Hãy thử lại để cải thiện"}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-left">
            {submitStatus === "submitting" && (
              <p className="text-sm font-medium text-neutral-600" role="status">
                Đang lưu kết quả và tính XP...
              </p>
            )}

            {submitStatus === "success" && submitResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">Kết quả đã lưu</span>
                  <span className="rounded-full bg-success-50 px-3 py-1 text-sm font-bold text-success-700">
                    {submitResult.exerciseScore}/100
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-primary-50 p-3 text-primary-700">
                    <dt className="font-semibold">XP</dt>
                    <dd className="text-xl font-bold">+{submitResult.rewards.totalXpEarned}</dd>
                  </div>
                  <div className="rounded-lg bg-warning-50 p-3 text-warning-700">
                    <dt className="font-semibold">Điểm hạng</dt>
                    <dd className="text-xl font-bold">+{submitResult.rewards.totalRankingDelta}</dd>
                  </div>
                </dl>
                <p className="text-sm text-neutral-600">
                  Level hiện tại: <span className="font-bold text-neutral-900">{submitResult.progress.level}</span> - XP:{" "}
                  <span className="font-bold text-neutral-900">{submitResult.progress.currentXp}</span>
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="rounded-lg bg-warning-50 p-4 text-sm text-warning-800" role="alert">
                {submitError || "Kết quả local đã có, nhưng chưa lưu được vào database."}
              </div>
            )}
          </div>

          {incorrectQuestions.length > 0 && (
            <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-left">
              <h2 className="mb-4 text-lg font-bold text-error-800">Câu cần luyện lại</h2>
              <ul className="space-y-4">
                {incorrectQuestions.map((item, index) => (
                  <li key={`${item.question.id}-${index}`} className="rounded-lg border border-error-100 bg-white p-4">
                    <p className="font-bold text-neutral-900">"{formatQuestionWord(item.question)}"</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Bạn trả lời <span className="font-bold text-error-700">{item.selected || "Không rõ"}</span>, đáp án đúng là{" "}
                      <span className="font-bold text-success-700">{item.correct}</span>.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button className="mt-8 h-14 w-full text-lg" onClick={() => router.push("/learning_map")}>
            Quay về lộ trình
          </Button>
        </Card>
      </div>
    );
  }

  const isVoiceTask = currentQuestion?.type === "qtype-2-voice" || currentQuestion?.type === "qtype-3-minimal-pairs";

  return (
    <div className={`flex min-h-screen flex-col ${isVoiceTask ? "bg-neutral-950" : "bg-neutral-50"}`}>
      <header
        className={`sticky top-0 z-10 flex items-center justify-between border-b px-4 py-4 transition-colors sm:px-6 ${
          isVoiceTask ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Quay lại trang trước"
          className={`rounded-lg p-2 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 ${
            isVoiceTask ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          X
        </button>
        <div className="mx-4 max-w-2xl flex-1">
          <ProgressBar value={progressPercent} max={100} size="lg" showPercentage={false} label={`Câu ${currentIndex + 1}/${questions.length}`} />
        </div>
        <div className={`min-w-16 text-right font-bold ${isVoiceTask ? "text-neutral-300" : "text-neutral-700"}`} aria-label={`Điểm hiện tại ${score}`}>
          {score} điểm
        </div>
      </header>

      <main className="mx-auto mt-10 flex w-full max-w-4xl flex-1 flex-col p-4 sm:p-6">
        <div className={`mb-10 text-center text-sm font-bold uppercase tracking-wider ${isVoiceTask ? "text-neutral-500" : "text-neutral-400"}`}>
          Câu {currentIndex + 1} / {questions.length}
        </div>

        {currentQuestion.type === "qtype-1-mc" && (
          <ListenChooseQuestion question={currentQuestion} onAnswer={handleAnswerListen} isAnswered={isAnswered} selectedAnswer={selectedAnswer} />
        )}

        {currentQuestion.type === "qtype-2-voice" && <VoiceQuestion key={currentQuestion.id} question={currentQuestion} onNext={handleNextVoice} />}

        {currentQuestion.type === "qtype-3-minimal-pairs" && (
          <MinimalPairsQuestion key={currentQuestion.id} question={currentQuestion} onNext={handleNextVoice} />
        )}
      </main>

      {!isVoiceTask && (
        <div
          className={`fixed bottom-0 left-0 right-0 border-t-2 p-4 transition-transform duration-300 sm:p-6 ${
            isAnswered ? "translate-y-0" : "translate-y-full"
          } ${isCorrect ? "border-success-200 bg-success-50" : "border-error-200 bg-error-50"}`}
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-black ${
                  isCorrect ? "bg-white text-success-600" : "bg-white text-error-600"
                }`}
                aria-hidden="true"
              >
                {isCorrect ? "OK" : "!"}
              </div>
              <div className="space-y-3">
                <h2 className={`text-2xl font-bold ${isCorrect ? "text-success-700" : "text-error-700"}`}>
                  {isCorrect ? `Chính xác: ${currentQuestion.answer}` : `Bạn chọn ${selectedAnswer} - chưa đúng`}
                </h2>
                {!isCorrect && (
                  <p className="font-medium text-error-700">
                    Đáp án đúng là <span className="text-xl font-bold">{currentQuestion.answer}</span>
                  </p>
                )}
                {currentHint && (
                  <div className={`mt-2 rounded-lg p-4 text-sm ${isCorrect ? "bg-success-100 text-success-800" : "bg-error-100 text-error-800"}`}>
                    {currentHint}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant={isCorrect ? "success" : "error"}
              size="lg"
              className="min-h-14 w-full text-lg sm:mt-2 sm:w-48"
              onClick={handleNextListen}
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
