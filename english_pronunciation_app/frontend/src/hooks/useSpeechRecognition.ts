"use client";

import { useState, useEffect, useCallback } from 'react';

// Cần khai báo type cho Web Speech API vì TypeScript mặc định có thể thiếu
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type SpeechState = 'idle' | 'listening' | 'processing' | 'result';

export function useSpeechRecognition(expectedAnswer: string) {
  const [state, setState] = useState<SpeechState>('idle');
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Khởi tạo SpeechRecognition instance (Memoize để tránh tạo lại liên tục)
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra hỗ trợ trình duyệt (Chủ yếu Chrome/Edge hỗ trợ tốt)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge.");
      } else {
        const recog = new SpeechRecognition();
        recog.lang = 'en-US';
        recog.continuous = false; // Chỉ lấy 1 kết quả rồi dừng
        recog.interimResults = false;
        recog.maxAlternatives = 1;
        setRecognition(recog);
      }
    }
  }, []);

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z\s]/g, ""); // Bỏ dấu câu, chỉ giữ lại chữ cái a-z và khoảng trắng
  };

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setError(null);
    setTranscript('');
    setIsCorrect(null);
    setState('listening');

    recognition.start();

    recognition.onresult = (event: any) => {
      setState('processing');
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      
      // So khớp chuỗi
      const normalizedTranscript = normalize(currentTranscript);
      const normalizedExpected = normalize(expectedAnswer);
      
      const correct = normalizedTranscript === normalizedExpected || normalizedTranscript.includes(normalizedExpected);
      setIsCorrect(correct);
      setState('result');
    };

    recognition.onerror = (event: any) => {
      setState('idle');
      setError(`Lỗi nhận diện giọng nói: ${event.error}`);
    };

    recognition.onend = () => {
      if (state === 'listening') {
        setState('idle');
      }
    };
  }, [recognition, expectedAnswer, state]);

  const stopListening = useCallback(() => {
    if (recognition && state === 'listening') {
      recognition.stop();
      setState('idle');
    }
  }, [recognition, state]);

  const reset = useCallback(() => {
    setState('idle');
    setTranscript('');
    setIsCorrect(null);
    setError(null);
  }, []);

  return {
    state,
    transcript,
    isCorrect,
    error,
    isSupported,
    startListening,
    stopListening,
    reset
  };
}
