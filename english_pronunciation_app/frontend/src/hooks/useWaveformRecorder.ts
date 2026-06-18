"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

type RecorderState = "idle" | "recording" | "stopped";
export type RecorderLevel = "silence" | "normal" | "loud";

// Ngưỡng Dynamic Feedback (RMS 0-1) — điểm xuất phát, tinh chỉnh sau test mic thực
const SILENCE_THRESHOLD = 0.05;
const LOUD_THRESHOLD = 0.25;
const COLOR_SILENCE = "#94A3B8"; // xám nhạt (im/nhỏ)
const COLOR_NORMAL = "#60A5FA"; // xanh dương (chuẩn)
const COLOR_LOUD = "#FBBF24"; // vàng (quá to/vỡ)

export function colorForRms(rms: number): string {
  if (rms < SILENCE_THRESHOLD) return COLOR_SILENCE;
  if (rms >= LOUD_THRESHOLD) return COLOR_LOUD;
  return COLOR_NORMAL;
}

function levelForRms(rms: number): RecorderLevel {
  if (rms < SILENCE_THRESHOLD) return "silence";
  if (rms >= LOUD_THRESHOLD) return "loud";
  return "normal";
}

export function useWaveformRecorder() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const [state, setState] = useState<RecorderState>("idle");
  const [level, setLevel] = useState<RecorderLevel>("silence");

  useEffect(() => {
    if (!containerRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: COLOR_NORMAL,
      height: 80,
      barWidth: 3,
      barGap: 2,
    });
    const record = ws.registerPlugin(
      RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: false }),
    );
    wavesurferRef.current = ws;
    recordRef.current = record;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      void audioCtxRef.current?.close().catch(() => {});
      ws.destroy();
      wavesurferRef.current = null;
      recordRef.current = null;
    };
  }, []);

  const startLevelMonitor = useCallback((stream: MediaStream) => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    audioCtxRef.current = ctx;

    const buffer = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(buffer);
      let sumSq = 0;
      for (let i = 0; i < buffer.length; i++) {
        const norm = (buffer[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / buffer.length);
      wavesurferRef.current?.setOptions({ waveColor: colorForRms(rms) });
      setLevel(levelForRms(rms));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const record = recordRef.current;
    if (!record) return;
    try {
      // startMic tự getUserMedia nội bộ + render scrolling waveform, trả MediaStream
      const stream = await record.startMic();
      startLevelMonitor(stream);
      setState("recording");
    } catch (error) {
      console.warn("mic access failed:", error);
    }
  }, [startLevelMonitor]);

  const stop = useCallback(() => {
    const record = recordRef.current;
    if (!record) return;
    record.stopMic();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    void audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setState("stopped");
    setLevel("silence");
  }, []);

  const reset = useCallback(() => {
    const record = recordRef.current;
    if (record) record.stopMic();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    void audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    wavesurferRef.current?.setOptions({ waveColor: COLOR_NORMAL });
    setState("idle");
    setLevel("silence");
  }, []);

  return { containerRef, state, level, start, stop, reset };
}
