"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import RecordButton from "@/components/audio/RecordButton";

interface ExerciseType1Props {
  phoneme: {
    symbol: string;
    name: string;
    example: string;
    audioUrl?: string;
  };
  onComplete?: (isCorrect: boolean) => void;
}

/**
 * Dạng 1: Nghe âm IPA → Đọc lại
 * 
 * Luồng:
 * 1. Hệ thống phát âm mẫu (audio file hoặc TTS)
 * 2. Học viên đọc lại
 * 3. Web Speech API nhận diện
 * 4. So khớp với từ mẫu (ví dụ: âm /æ/ → từ "cat")
 */
export default function ExerciseType1({ phoneme, onComplete }: ExerciseType1Props) {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Phát âm thanh mẫu cho âm vị IPA
   * Sử dụng playPhonemeSound từ audioData.ts
   */
  const playPhonemeAudio = () => {
    setIsPlaying(true);
    
    // Import động để tránh lỗi SSR
    import('@/lib/audioData').then(({ playPhonemeSound }) => {
      playPhonemeSound(phoneme.symbol, () => {
        setIsPlaying(false);
        setHasPlayedAudio(true);
      });
    }).catch(() => {
      // Fallback nếu import lỗi
      const utterance = new SpeechSynthesisUtterance(phoneme.example);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedAudio(true);
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Dạng 1: Nghe và Đọc Lại
        </h3>
        <p className="text-neutral-600">
          Nghe âm vị <span className="font-ipa text-primary-600 text-xl">/{phoneme.symbol}/</span> và đọc lại
        </p>
      </div>

      {/* Bước 1: Nghe âm mẫu */}
      <div className="bg-primary-50 p-8 rounded-xl border border-primary-200 mb-6">
        <div className="text-center">
          <div className="text-6xl font-ipa text-primary-600 mb-4">
            /{phoneme.symbol}/
          </div>
          <p className="text-neutral-700 mb-2">{phoneme.name}</p>
          <p className="text-sm text-neutral-600 mb-6">
            Ví dụ: <span className="font-semibold">{phoneme.example}</span>
          </p>
          
          <Button
            variant="primary"
            size="lg"
            onClick={playPhonemeAudio}
            disabled={isPlaying}
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.899a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            }
          >
            {isPlaying ? "Đang phát..." : "Nghe âm mẫu"}
          </Button>
        </div>
      </div>

      {/* Bước 2: Đọc lại */}
      {hasPlayedAudio && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="text-center mb-4">
            <p className="text-neutral-700 font-semibold mb-2">
              Bây giờ đến lượt bạn!
            </p>
            <p className="text-sm text-neutral-600">
              Hãy đọc từ: <span className="font-bold text-lg">{phoneme.example}</span>
            </p>
          </div>
          
          <RecordButton 
            expectedAnswer={phoneme.example}
          />
        </div>
      )}

      {/* Hướng dẫn */}
      {!hasPlayedAudio && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-warning-800">
            💡 <strong>Hướng dẫn:</strong> Nhấn nút "Nghe âm mẫu" để nghe cách phát âm chuẩn, sau đó đọc lại từ mẫu.
          </p>
        </div>
      )}
    </Card>
  );
}
