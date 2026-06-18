"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseWordPrompt, type ExerciseQuestion } from "./ExerciseEngineClient";
import { useWaveformRecorder, type RecorderLevel } from "@/hooks/useWaveformRecorder";
import SpeakFeedbackSheet from "./SpeakFeedbackSheet";

type SpeakWordQuestionProps = {
  question: ExerciseQuestion;
  onNext: (correct: boolean, transcript: string) => void;
};

// SpeechRecognition types (giống engine)
type SpeechRecognitionLike = {
  continuous: boolean; lang: string; interimResults: boolean; maxAlternatives: number;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
}

// Nút audio (inline, pattern MiniSpeaker/ReplayButton)
function AudioButton({ audioUrl, label }: { audioUrl?: string; label: string }) {
  if (!audioUrl) return null;
  const play = () => {
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.warn("audio failed:", e));
  };
  return (
    <button type="button" onClick={play} aria-label={label}
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500">
      {label}
    </button>
  );
}

// Hint text theo level (dynamic feedback)
function hintText(level: RecorderLevel): { text: string; color: string } {
  switch (level) {
    case "silence": return { text: "🗣️ Nói to hơn", color: "text-neutral-500" };
    case "normal": return { text: "✅ Âm lượng tốt", color: "text-success-600" };
    case "loud": return { text: "⚠️ Nói nhỏ lại", color: "text-warning-600" };
  }
}

export default function SpeakWordQuestion({ question, onNext }: SpeakWordQuestionProps) {
  const contentData = useMemo(() => parseWordPrompt(question.content), [question.content]);
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "correct" | "incorrect" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const [showWord, setShowWord] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [speechUnsupported, setSpeechUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorder = useWaveformRecorder();

  useEffect(() => {
    setSpeechUnsupported(getSpeechCtor() === null);
    setStatus("idle"); setTranscript(""); setRetryCount(0); setShowWord(false);
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : question.answer;
  const maskedWord = "•".repeat(Math.max(contentData.word?.length ?? question.answer.length, 3));
  const hint = hintText(recorder.level);

  const checkAnswer = (recordedText: string) => {
    setStatus("processing");
    recorder.stop();
    window.setTimeout(() => {
      if (normalizeAnswer(recordedText) === normalizeAnswer(question.answer)) setStatus("correct");
      else { setStatus("incorrect"); setRetryCount((c) => c + 1); }
    }, 400);
  };

  const startRecording = () => {
    const Ctor = getSpeechCtor();
    if (!Ctor) { setSpeechUnsupported(true); setStatus("error"); return; }
    const recog = new Ctor();
    recog.continuous = false; recog.lang = "en-US"; recog.interimResults = false; recog.maxAlternatives = 1;
    recog.onresult = (e) => { setTranscript(e.results[0][0].transcript); checkAnswer(e.results[0][0].transcript); };
    recog.onerror = () => setStatus("error");
    recog.onend = () => setStatus((cur) => (cur === "recording" ? "error" : cur));
    recognitionRef.current = recog;
    setStatus("recording"); setTranscript("");
    void recorder.start();
    try {
      recog.start();
      window.setTimeout(() => { try { recog.stop(); } catch { /* already stopped */ } }, 5000);
    } catch (e) { console.error("recognition start failed:", e); setStatus("error"); }
  };

  const stopRecording = () => { try { recognitionRef.current?.stop(); } catch { /* */ } recorder.stop(); };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border-2 border-success-300 bg-gradient-to-br from-white to-neutral-50 p-8 shadow-lg">
        {/* Badge */}
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-success-100 px-4 py-1.5 text-sm font-bold text-success-700">🗣️ Luyện miệng</span>
        </div>

        {/* Tầng 1: IPA trên (hiện luôn) */}
        {contentData.ipa && (
          <p className="mb-4 text-center font-ipa text-5xl font-bold text-primary-600">{contentData.ipa}</p>
        )}

        {/* Tầng 2: Từ ẩn dưới IPA */}
        <div className="mb-6 text-center">
          <p className="text-3xl font-black tracking-tight text-neutral-900">
            {showWord ? displayWord : maskedWord}
          </p>
          <button type="button" onClick={() => setShowWord((s) => !s)}
            className="mt-2 text-sm font-bold text-primary-600 hover:text-primary-700">
            {showWord ? "🙈 Ẩn từ" : "👁️ Hiện từ"}
          </button>
        </div>

        {/* Tầng 3: Audio phát */}
        <div className="mb-6 flex justify-center">
          <AudioButton audioUrl={contentData.audioUrl} label="🔊 Nghe mẫu" />
        </div>

        {/* Tầng 4: Mic + waveform + hint */}
        {/* Waveform container luôn render (để hook useEffect khởi tạo wavesurfer lúc mount).
            Ẩn CSS khi không recording/processing để không chiếm chỗ. */}
        <div
          ref={recorder.containerRef}
          className={`rounded-lg bg-neutral-50 p-2 transition-all ${
            status === "recording" || status === "processing" ? "opacity-100" : "h-0 overflow-hidden opacity-0 py-0"
          }`}
        />

        {status === "idle" && (
          <div className="mt-6 space-y-4 text-center">
            {speechUnsupported && (
              <div className="rounded-xl border-2 border-warning-300 bg-warning-50 p-4 text-sm font-semibold text-warning-800" role="alert">
                ⚠️ Trình duyệt chưa hỗ trợ Web Speech API. Hãy dùng Chrome hoặc Edge.
              </div>
            )}
            <button type="button" onClick={startRecording}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-error-500 to-error-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-error-300">
              <span className="text-5xl" role="img" aria-label="microphone">🎤</span>
            </button>
            <p className="text-sm font-bold text-neutral-500">Nhấn để bắt đầu ghi âm</p>
          </div>
        )}

        {status === "recording" && (
          <div className="mt-4 space-y-3 text-center">
            <p className={`text-sm font-bold ${hint.color}`}>{hint.text}</p>
            <button type="button" onClick={stopRecording}
              className="rounded-xl bg-neutral-200 px-8 py-3 font-bold text-neutral-700 transition-colors hover:bg-neutral-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400">
              Dừng ghi âm
            </button>
          </div>
        )}

        {status === "processing" && (
          <div className="mt-4 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-semibold text-neutral-600">Đang phân tích giọng nói...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 text-center">
            <div className="text-5xl">😕</div>
            <div className="rounded-xl border-2 border-warning-300 bg-warning-50 p-4 text-warning-800">
              <p className="font-bold">{speechUnsupported ? "Trình duyệt không hỗ trợ" : "Không nghe thấy giọng nói"}</p>
              <p className="mt-1 text-sm">{speechUnsupported ? "Hãy dùng Chrome/Edge" : "Kiểm tra microphone và thử lại"}</p>
            </div>
            <button type="button" onClick={startRecording}
              className="rounded-xl bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300">
              Thử lại
            </button>
          </div>
        )}

        {(status === "correct" || status === "incorrect") && (
          <SpeakFeedbackSheet
            isCorrect={status === "correct"}
            transcript={transcript}
            answerText={question.answer}
            audioReplay={<AudioButton audioUrl={contentData.audioUrl} label="🔊 Nghe lại mẫu" />}
            onRetry={startRecording}
            onNext={() => onNext(status === "correct", transcript)}
          />
        )}
      </div>
    </div>
  );
}
