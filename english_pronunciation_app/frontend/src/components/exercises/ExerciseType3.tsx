"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ExerciseType3Props {
  sentence: string;
  translation?: string;
  onComplete?: (isCorrect: boolean, transcript: string) => void;
}

/**
 * Dạng 3: Nhìn câu → Đọc cả câu
 * 
 * Luồng:
 * 1. Hiển thị câu tiếng Anh
 * 2. Học viên đọc toàn bộ câu
 * 3. Web Speech API nhận diện
 * 4. So khớp toàn câu sau normalize (đơn giản hóa)
 */
export default function ExerciseType3({ sentence, translation, onComplete }: ExerciseType3Props) {
  const {
    state,
    transcript,
    isCorrect,
    error,
    isSupported,
    startListening,
    reset
  } = useSpeechRecognition(sentence);

  const [showTranslation, setShowTranslation] = useState(false);

  /**
   * Tính độ tương đồng giữa 2 câu (đơn giản)
   * Trả về % từ đúng
   */
  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    words1.forEach(word => {
      if (words2.includes(word)) {
        matchCount++;
      }
    });
    
    return Math.round((matchCount / words1.length) * 100);
  };

  const similarity = transcript ? calculateSimilarity(sentence, transcript) : 0;

  if (!isSupported) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-4 bg-error-50 text-error-500 rounded-md border border-error-500 text-sm" role="alert">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Dạng 3: Đọc Câu Hoàn Chỉnh
        </h3>
        <p className="text-neutral-600">
          Đọc to và rõ ràng câu dưới đây
        </p>
      </div>

      {/* Hiển thị câu cần đọc */}
      <div className="bg-primary-50 p-8 rounded-xl border border-primary-200 mb-6">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4 leading-relaxed">
            "{sentence}"
          </p>
          
          {translation && (
            <div className="mt-4">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                {showTranslation ? "Ẩn" : "Xem"} nghĩa tiếng Việt
              </button>
              
              {showTranslation && (
                <p className="text-neutral-600 mt-2 italic">
                  {translation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nút ghi âm */}
      <div className="flex flex-col items-center gap-4">
        <Button
          variant={state === 'result' ? 'secondary' : 'primary'}
          size="lg"
          onClick={state === 'result' ? reset : startListening}
          disabled={state === 'processing' || state === 'listening'}
          leftIcon={
            state === 'listening' ? (
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )
          }
        >
          {state === 'listening' && 'Đang nghe...'}
          {state === 'processing' && 'Đang xử lý...'}
          {state === 'result' && 'Thử lại'}
          {state === 'idle' && 'Bắt đầu đọc'}
        </Button>

        {/* Hiển thị kết quả */}
        {state === 'result' && transcript && (
          <div className="w-full mt-4 p-6 rounded-xl bg-white border border-neutral-200 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-2">Bạn vừa đọc:</p>
              <p className="text-lg font-medium text-neutral-900 mb-4">
                "{transcript}"
              </p>
            </div>

            {/* Độ chính xác */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-neutral-700">Độ chính xác</span>
                <span className="text-sm font-bold text-neutral-900">{similarity}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    similarity >= 80 ? 'bg-success-600' :
                    similarity >= 60 ? 'bg-warning-500' :
                    'bg-error-500'
                  }`}
                  style={{ width: `${similarity}%` }}
                />
              </div>
            </div>

            {/* Feedback */}
            <div className={`p-4 rounded-lg ${
              similarity >= 80 ? 'bg-success-50 border border-success-200' :
              similarity >= 60 ? 'bg-warning-50 border border-warning-200' :
              'bg-error-50 border border-error-200'
            }`}>
              <p className={`font-semibold ${
                similarity >= 80 ? 'text-success-700' :
                similarity >= 60 ? 'text-warning-700' :
                'text-error-700'
              }`}>
                {similarity >= 80 && '🎉 Xuất sắc! Phát âm rất tốt!'}
                {similarity >= 60 && similarity < 80 && '👍 Tốt lắm! Hãy cố gắng thêm!'}
                {similarity < 60 && '💪 Cần luyện thêm! Hãy thử lại!'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-error-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Hướng dẫn */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-neutral-700">
          💡 <strong>Mẹo:</strong> Đọc chậm rãi, rõ ràng từng từ. Không cần đọc quá nhanh!
        </p>
      </div>
    </Card>
  );
}
