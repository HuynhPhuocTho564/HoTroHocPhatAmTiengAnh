"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseWordPrompt, type ExerciseQuestion } from "./ExerciseEngineClient";
import { useWaveformRecorder, type RecorderLevel } from "@/hooks/useWaveformRecorder";
import { calculateWordOverlapAccuracy } from "@/lib/scoring";

type SpeakSentenceQuestionProps = {
  question: ExerciseQuestion;
  onNext: (correct: boolean, transcript: string) => void;
};

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

function playSentence(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find((v) => v.lang === "en-US") || voices.find((v) => v.lang.startsWith("en"));
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function hintText(level: RecorderLevel): { text: string; color: string } {
  switch (level) {
    case "silence": return { text: "🗣️ Nói to hơn", color: "text-neutral-500" };
    case "normal": return { text: "✅ Âm lượng tốt", color: "text-success-600" };
    case "loud": return { text: "⚠️ Nói nhỏ lại", color: "text-warning-600" };
  }
}

export default function SpeakSentenceQuestion({ question, onNext }: SpeakSentenceQuestionProps) {
  const contentData = useMemo(() => parseWordPrompt(question.content), [question.content]);
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "correct" | "incorrect" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const [showSentence, setShowSentence] = useState(false);
  const [speechUnsupported, setSpeechUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorder = useWaveformRecorder();

  useEffect(() => {
    setSpeechUnsupported(getSpeechCtor() === null);
    setStatus("idle"); setTranscript(""); setShowSentence(false);
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const words = question.answer.trim().split(/\s+/);
  const maskedSentence = words.map(() => "•".repeat(5)).join(" ");
  const hint = hintText(recorder.level);

  // DRY: dùng calculateWordOverlapAccuracy từ scoring.ts (giống engine VoiceQuestion cũ)
  const checkAnswer = (recordedText: string) => {
    setStatus("processing");
    recorder.stop();
    window.setTimeout(() => {
      const acc = calculateWordOverlapAccuracy(question.answer, recordedText);
      setStatus(acc >= 80 ? "correct" : "incorrect");
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
      window.setTimeout(() => { try { recog.stop(); } catch { /* */ } }, 8000); // sentence: 8s
    } catch (e) { console.error("recognition start failed:", e); setStatus("error"); }
  };

  const stopRecording = () => { try { recognitionRef.current?.stop(); } catch { /**/ } recorder.stop(); };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border-2 border-accent-300 bg-gradient-to-br from-accent-50 to-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-accent-100 px-4 py-1.5 text-sm font-bold text-accent-700">🎯 Thực chiến</span>
        </div>

        {/* Câu ẩn (toggle) */}
        <div className="mb-6 text-center">
          <p className="text-xl font-bold leading-relaxed text-neutral-900">
            {showSentence ? question.answer : maskedSentence}
          </p>
          <button type="button" onClick={() => setShowSentence((s) => !s)}
            className="mt-3 text-sm font-bold text-accent-600 hover:text-accent-700">
            {showSentence ? "🙈 Ẩn câu" : "👁️ Hiện câu"}
          </button>
        </div>

        {/* Audio speechSynthesis */}
        <div className="mb-6 flex justify-center">
          <button type="button" onClick={() => playSentence(question.answer)} aria-label="Nghe mẫu câu"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-accent-200 bg-accent-50 px-4 py-2 text-sm font-bold text-accent-700 transition-colors hover:bg-accent-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-500">
            🎧 Nghe mẫu câu
          </button>
        </div>

        {status === "idle" && (
          <div className="space-y-4 text-center">
            {speechUnsupported && (
              <div className="rounded-xl border-2 border-warning-300 bg-warning-50 p-4 text-sm font-semibold text-warning-800" role="alert">
                ⚠️ Trình duyệt chưa hỗ trợ Web Speech API. Hãy dùng Chrome/Edge.
              </div>
            )}
            <button type="button" onClick={startRecording}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
              <span className="text-5xl" role="img" aria-label="microphone">🎤</span>
            </button>
            <p className="text-sm font-bold text-neutral-500">Đọc câu hoàn chỉnh</p>
          </div>
        )}

        {status === "recording" && (
          <div className="space-y-4 text-center">
            <div ref={recorder.containerRef} className="rounded-lg bg-neutral-50 p-2" />
            <p className={`text-sm font-bold ${hint.color}`}>{hint.text}</p>
            <button type="button" onClick={stopRecording}
              className="rounded-xl bg-neutral-200 px-8 py-3 font-bold text-neutral-700 hover:bg-neutral-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400">
              Dừng ghi âm
            </button>
          </div>
        )}

        {status === "processing" && (
          <div className="space-y-4 text-center">
            <div ref={recorder.containerRef} className="rounded-lg bg-neutral-50 p-2 opacity-60" />
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accent-200 border-t-accent-600" />
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
              className="rounded-xl bg-accent-600 px-6 py-3 font-bold text-white hover:bg-accent-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
              Thử lại
            </button>
          </div>
        )}

        {status === "correct" && (
          <div className="space-y-4">
            <div className="text-center text-6xl">🎉</div>
            <div className="rounded-xl border-2 border-success-300 bg-success-50 p-6 text-center">
              <h3 className="text-2xl font-black text-success-700">Xuất sắc!</h3>
              <p className="mt-2 text-sm text-neutral-600">Bạn nói:</p>
              <p className="text-lg font-bold text-success-700">"{transcript}"</p>
            </div>
            <button type="button" onClick={() => onNext(true, transcript)}
              className="w-full rounded-xl bg-success-600 px-8 py-4 text-lg font-bold text-white hover:bg-success-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-success-300">
              Tiếp theo →
            </button>
          </div>
        )}

        {status === "incorrect" && (
          <div className="space-y-4">
            <div className="text-center text-5xl">😐</div>
            <div className="rounded-xl border-2 border-error-300 bg-error-50 p-6 text-center">
              <h3 className="text-xl font-bold text-error-700">Chưa chính xác</h3>
              <p className="mt-2 text-sm text-neutral-600">Bạn nói:</p>
              <p className="text-lg font-bold text-error-700">"{transcript || "Không rõ"}"</p>
              <p className="mt-1 text-sm text-neutral-600">Đáp án đúng:</p>
              <p className="text-lg font-semibold text-neutral-800">"{question.answer}"</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={startRecording}
                className="rounded-xl border-2 border-accent-300 bg-accent-50 px-6 py-4 font-bold text-accent-700 hover:bg-accent-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
                🔄 Thử lại
              </button>
              <button type="button" onClick={() => onNext(false, transcript)}
                className="rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 font-bold text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-300">
                Bỏ qua →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
