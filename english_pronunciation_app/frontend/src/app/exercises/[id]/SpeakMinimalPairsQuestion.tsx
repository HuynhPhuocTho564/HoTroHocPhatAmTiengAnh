"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type ExerciseQuestion } from "./ExerciseEngineClient";
import { useWaveformRecorder, type RecorderLevel } from "@/hooks/useWaveformRecorder";

type SpeakMinimalPairsQuestionProps = {
  question: ExerciseQuestion;
  onNext: (correct: boolean, transcript: string) => void;
};

type WordPrompt = { word: string; ipa?: string; audioUrl?: string; hint?: string };

// parsePairPrompt (chuyển từ engine — chỉ component này dùng)
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
  const words = content.split(/[-,|]/).map((i) => i.trim()).filter(Boolean);
  return [{ word: words[0] ?? "Word 1" }, { word: words[1] ?? "Word 2" }];
}

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

function AudioButton({ audioUrl, label }: { audioUrl?: string; label: string }) {
  if (!audioUrl) return null;
  const play = () => {
    const a = new Audio(audioUrl);
    a.play().catch((e) => console.warn("audio failed:", e));
  };
  return (
    <button type="button" onClick={play} aria-label={label}
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-warning-200 bg-warning-50 px-4 py-2 text-sm font-bold text-warning-800 transition-colors hover:bg-warning-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-warning-500">
      {label}
    </button>
  );
}

function hintText(level: RecorderLevel): { text: string; color: string } {
  switch (level) {
    case "silence": return { text: "🗣️ Nói to hơn", color: "text-neutral-500" };
    case "normal": return { text: "✅ Âm lượng tốt", color: "text-success-600" };
    case "loud": return { text: "⚠️ Nói nhỏ lại", color: "text-warning-600" };
  }
}

export default function SpeakMinimalPairsQuestion({ question, onNext }: SpeakMinimalPairsQuestionProps) {
  const pairs = useMemo(() => parsePairPrompt(question.content), [question.content]);
  const [statuses, setStatuses] = useState<Array<"idle" | "recording" | "recorded">>(["idle", "idle"]);
  const [transcripts, setTranscripts] = useState(["", ""]);
  const [overallStatus, setOverallStatus] = useState<"idle" | "processing" | "correct" | "incorrect">("idle");
  const [showWords, setShowWords] = useState<[boolean, boolean]>([false, false]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorder = useWaveformRecorder();

  useEffect(() => {
    setStatuses(["idle", "idle"]); setTranscripts(["", ""]); setOverallStatus("idle");
    setShowWords([false, false]); setErrorMessage(null);
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const hint = hintText(recorder.level);
  const canCheck = statuses[0] === "recorded" && statuses[1] === "recorded";
  const combinedTranscript = transcripts.filter(Boolean).join(" ");

  const startRecording = (index: number) => {
    const Ctor = getSpeechCtor();
    if (!Ctor) { setErrorMessage("Trình duyệt không hỗ trợ Web Speech API. Hãy dùng Chrome/Edge."); return; }
    const recog = new Ctor();
    recog.continuous = false; recog.lang = "en-US"; recog.interimResults = false; recog.maxAlternatives = 1;
    recog.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setTranscripts((cur) => cur.map((item, i) => (i === index ? t : item)));
      setStatuses((cur) => cur.map((item, i) => (i === index ? "recorded" : item)));
      recorder.stop();
    };
    recog.onerror = () => {
      setStatuses((cur) => cur.map((item, i) => (i === index ? "idle" : item)));
      setErrorMessage("Không nghe thấy giọng nói. Thử lại.");
      recorder.reset();
    };
    recog.onend = () => setStatuses((cur) => cur.map((item, i) => (i === index && item === "recording" ? "idle" : item)));
    recognitionRef.current = recog;
    setErrorMessage(null);
    recorder.reset(); // reset waveform giữa 2 lần thu
    setStatuses((cur) => cur.map((item, i) => (i === index ? "recording" : item)));
    void recorder.start();
    try {
      recog.start();
      window.setTimeout(() => { try { recog.stop(); } catch { /* */ } }, 5000);
    } catch (e) {
      console.error("recognition failed:", e);
      setErrorMessage("Không bắt đầu ghi âm được.");
      setStatuses((cur) => cur.map((item, i) => (i === index ? "idle" : item)));
    }
  };

  const checkBothAnswers = () => {
    setOverallStatus("processing");
    window.setTimeout(() => {
      const ok0 = normalizeAnswer(transcripts[0]) === normalizeAnswer(pairs[0].word);
      const ok1 = normalizeAnswer(transcripts[1]) === normalizeAnswer(pairs[1].word);
      setOverallStatus(ok0 && ok1 ? "correct" : "incorrect");
    }, 400);
  };

  const masked = (w: string) => "•".repeat(Math.max(w.length, 3));

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-2xl border-2 border-warning-400 bg-gradient-to-br from-warning-50 via-white to-neutral-50 p-8 shadow-lg">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-warning-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-warning-800">⚔️ Thử thách kép</span>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-widest text-neutral-900">Minimal Pairs</h2>
          <p className="mt-2 text-lg text-neutral-600">{question.name || "Đọc lần lượt hai từ"}</p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border-2 border-warning-400 bg-warning-50 p-5 text-center font-bold text-warning-800" role="alert">⚠️ {errorMessage}</div>
        )}

        {/* 2 cột: IPA trên + từ ẩn + audio */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pairs.map((pair, index) => (
            <div key={`${pair.word}-${index}`} className="rounded-xl border-2 border-warning-200 bg-gradient-to-br from-white to-warning-50 p-6 transition-all hover:border-warning-400">
              {/* IPA trên (hiện luôn) */}
              {pair.ipa && <p className="mb-3 text-center font-ipa text-3xl font-bold text-warning-600">{pair.ipa}</p>}
              {/* Từ ẩn (toggle) */}
              <div className="mb-4 text-center">
                <p className="text-3xl font-black uppercase tracking-tight text-neutral-900">{showWords[index] ? pair.word : masked(pair.word)}</p>
                <button type="button" onClick={() => setShowWords((s) => s.map((v, i) => (i === index ? !v : v)) as [boolean, boolean])}
                  className="mt-1 text-xs font-bold text-warning-700 hover:text-warning-800">
                  {showWords[index] ? "🙈 Ẩn" : "👁️ Hiện"}
                </button>
              </div>
              {/* Audio */}
              <div className="mb-4 flex justify-center"><AudioButton audioUrl={pair.audioUrl} label="🔊 Nghe mẫu" /></div>
              {/* Nút thu từng từ */}
              <button type="button" onClick={() => startRecording(index)} disabled={statuses[index] === "recording"}
                className={`w-full rounded-xl border-2 px-6 py-4 font-bold uppercase tracking-wider transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-warning-500 disabled:cursor-wait disabled:opacity-70 ${
                  statuses[index] === "recorded" ? "border-success-500 bg-success-500 text-white hover:bg-success-600"
                  : statuses[index] === "recording" ? "animate-pulse border-error-500 bg-error-500 text-white"
                  : "border-warning-300 bg-warning-100 text-warning-800 hover:border-warning-500 hover:bg-warning-200"}`}>
                {statuses[index] === "recording" ? "🎤 Đang nghe..." : statuses[index] === "recorded" ? "✓ Ghi lại" : "🎤 Bấm để nói"}
              </button>
              {statuses[index] === "recorded" && (
                <div className="mt-3 rounded-lg border border-success-200 bg-success-50 p-3 text-center">
                  <p className="text-xs font-semibold text-neutral-600">Bạn đã đọc:</p>
                  <p className="text-lg font-bold text-success-700">"{transcripts[index]}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Waveform chung (hiện khi đang thu 1 trong 2) */}
        {(statuses[0] === "recording" || statuses[1] === "recording") && (
          <div className="mb-6 space-y-2 text-center">
            <div ref={recorder.containerRef} className="rounded-lg bg-neutral-50 p-2" />
            <p className={`text-sm font-bold ${hint.color}`}>{hint.text}</p>
          </div>
        )}

        {/* Check button / results */}
        {overallStatus === "idle" || overallStatus === "processing" ? (
          <button type="button" onClick={checkBothAnswers} disabled={!canCheck || overallStatus === "processing"}
            className="w-full rounded-xl border-2 border-warning-500 bg-warning-500 px-8 py-5 text-xl font-black uppercase tracking-widest text-white transition-all hover:bg-warning-600 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-warning-300 disabled:cursor-not-allowed disabled:opacity-50">
            {overallStatus === "processing" ? "⏳ Đang kiểm tra..." : canCheck ? "✓ Kiểm tra kết quả" : "⚠️ Hãy đọc cả 2 từ"}
          </button>
        ) : overallStatus === "correct" ? (
          <div className="space-y-6 text-center">
            <div className="text-7xl">🎉</div>
            <h3 className="text-3xl font-black text-success-600">Xuất sắc!</h3>
            <p className="text-neutral-600">Bạn đã phân biệt đúng 2 từ</p>
            <button type="button" onClick={() => onNext(true, combinedTranscript)}
              className="rounded-xl border-2 border-success-500 bg-success-500 px-10 py-4 text-lg font-bold text-white hover:bg-success-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-success-300">
              Tiếp theo →
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="text-6xl">😐</div>
            <h3 className="text-2xl font-black text-error-600">Chưa chính xác</h3>
            <div className="rounded-xl border-2 border-error-300 bg-error-50 p-5">
              <p className="text-sm font-semibold text-neutral-600">Đáp án đúng:</p>
              <p className="mt-2 text-xl font-bold text-neutral-900">{pairs[0].word} & {pairs[1].word}</p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button type="button" onClick={() => { setOverallStatus("idle"); setStatuses(["idle", "idle"]); setTranscripts(["", ""]); recorder.reset(); }}
                className="rounded-xl border-2 border-primary-400 bg-primary-500 px-8 py-4 font-bold text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300">
                🔄 Làm lại
              </button>
              <button type="button" onClick={() => onNext(false, combinedTranscript)}
                className="rounded-xl border-2 border-neutral-300 bg-white px-8 py-4 font-bold text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-300">
                Bỏ qua →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
