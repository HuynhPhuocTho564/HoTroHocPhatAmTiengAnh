"use client";

import { useState, useCallback, useEffect } from "react";

export const SFX_KEY = "sfx_muted";
export type SfxName = "correct" | "wrong" | "tada";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

export function isSfxMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SFX_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSfxMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SFX_KEY, muted ? "1" : "0");
  } catch {
    // ignore (private mode...)
  }
}

// Tone đơn với oscillator + envelope (fade in/out tránh click).
function playTone(freq: number, duration: number, type: OscillatorType, startOffset = 0): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const start = ctx.currentTime + startOffset;
  const end = start + duration;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.3, start + 0.01); // fade in nhanh
  gain.gain.exponentialRampToValueAtTime(0.001, end); // fade out
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(end);
}

export function playSfx(name: SfxName): void {
  if (isSfxMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  // resume nếu suspended (autoplay policy — click đáp án là user gesture)
  if (ctx.state === "suspended") void ctx.resume();

  switch (name) {
    case "correct":
      // ting: sine 880Hz, 0.15s
      playTone(880, 0.15, "sine");
      break;
    case "wrong":
      // buzz: sawtooth 180Hz, 0.2s (trầm, không chói)
      playTone(180, 0.2, "sawtooth");
      break;
    case "tada":
      // arpeggio C5-E5-G5 (523, 659, 784), SP2 tái dùng lúc tổng kết ≥80%
      playTone(523.25, 0.12, "sine", 0);
      playTone(659.25, 0.12, "sine", 0.12);
      playTone(783.99, 0.18, "sine", 0.24);
      break;
  }
}

// Hook cho nút mute ở header (re-render khi toggle).
export function useSfxMuted(): [boolean, (m: boolean) => void] {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isSfxMuted());
  }, []);

  const toggle = useCallback((m: boolean) => {
    setSfxMuted(m);
    setMutedState(m);
  }, []);

  return [muted, toggle];
}
