"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ExerciseType4Props {
  question: string;
  options: Option[];
  onComplete?: (isCorrect: boolean, selectedOption: string) => void;
}

/**
 * Dạng 4: Chọn đáp án có ghi âm
 * 
 * Luồng:
 * 1. Hiển thị câu hỏi và các phương án (A, B, C, D)
 * 2. Học viên NÓI phương án mình chọn (ví dụ: "A" hoặc "Apple")
 * 3. Web Speech API nhận diện
 * 4. So khớp với phương án đúng
 */
export default function ExerciseType4({ question, options, onComplete }: ExerciseType4Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<{ isCorrect: boolean; message: string } | null>(null);

  /**
   * Chuẩn hóa text để so sánh
   */
  const normalize = (text: string) => {
    return text.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  };

  /**
   * Bắt đầu nghe học viên nói đáp án
   */
  const startVoiceSelection = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ. Vui lòng dùng Chrome hoặc Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setTranscript("");
    setResult(null);

    recognition.start();

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setIsListening(false);

      // Kiểm tra xem học viên nói gì
      const normalizedSpoken = normalize(spokenText);
      
      // Tìm phương án khớp
      const matchedOption = options.find((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        const normalizedOptionText = normalize(option.text);
        const normalizedOptionLetter = normalize(optionLetter);
        
        // Khớp nếu nói chữ cái (A, B, C, D) hoặc nội dung đáp án
        return normalizedSpoken.includes(normalizedOptionLetter) ||
          normalizedSpoken.includes(normalizedOptionText);
      });

      // Kiểm tra kết quả
      if (matchedOption) {
        setSelectedOption(matchedOption.id);
        const isCorrect = matchedOption.isCorrect;
        setResult({
          isCorrect,
          message: isCorrect 
            ? `Chính xác! Đáp án "${matchedOption.text}" là đúng! 🎉`
            : `Rất tiếc! Đáp án "${matchedOption.text}" chưa đúng. Hãy thử lại! 💪`
        });
        
        if (onComplete) {
          onComplete(isCorrect, matchedOption.id);
        }
      } else {
        setResult({
          isCorrect: false,
          message: `Không nhận diện được đáp án. Bạn vừa nói: "${spokenText}". Hãy thử lại!`
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Lỗi nhận diện giọng nói. Vui lòng thử lại!");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  /**
   * Chọn đáp án bằng cách click (fallback)
   */
  const handleClickOption = (option: Option) => {
    setSelectedOption(option.id);
    const isCorrect = option.isCorrect;
    
    setResult({
      isCorrect,
      message: isCorrect 
        ? `Chính xác! Đáp án "${option.text}" là đúng! 🎉`
        : `Rất tiếc! Đáp án "${option.text}" chưa đúng. Hãy thử lại! 💪`
    });
    
    if (onComplete) {
      onComplete(isCorrect, option.id);
    }
  };

  const reset = () => {
    setSelectedOption(null);
    setTranscript("");
    setResult(null);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Dạng 4: Chọn Đáp Án Bằng Giọng Nói
        </h3>
        <p className="text-neutral-600">
          Nói đáp án bạn chọn (A, B, C, hoặc D)
        </p>
      </div>

      {/* Câu hỏi */}
      <div className="bg-primary-50 p-6 rounded-xl border border-primary-200 mb-6">
        <p className="text-lg font-semibold text-neutral-900 text-center">
          {question}
        </p>
      </div>

      {/* Các phương án */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedOption === option.id;
          const showResult = result && isSelected;
          
          return (
            <button
              key={option.id}
              onClick={() => handleClickOption(option)}
              disabled={!!result}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all
                flex items-center gap-4
                ${isSelected && !result ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white'}
                ${showResult && result.isCorrect ? 'border-success-500 bg-success-50' : ''}
                ${showResult && !result.isCorrect ? 'border-error-500 bg-error-50' : ''}
                ${!result ? 'hover:border-primary-300 hover:bg-primary-50/50' : ''}
                disabled:cursor-not-allowed
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${isSelected && !result ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'}
                ${showResult && result.isCorrect ? 'bg-success-600 text-white' : ''}
                ${showResult && !result.isCorrect ? 'bg-error-600 text-white' : ''}
              `}>
                {letter}
              </div>
              <span className="flex-1 font-medium text-neutral-900">
                {option.text}
              </span>
              {showResult && result.isCorrect && (
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {showResult && !result.isCorrect && (
                <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Nút ghi âm */}
      <div className="flex flex-col items-center gap-4">
        {!result && (
          <Button
            variant="primary"
            size="lg"
            onClick={startVoiceSelection}
            disabled={isListening}
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            }
          >
            {isListening ? 'Đang nghe...' : 'Nói đáp án của bạn'}
          </Button>
        )}

        {transcript && (
          <p className="text-sm text-neutral-600">
            Bạn vừa nói: <span className="font-semibold">"{transcript}"</span>
          </p>
        )}

        {/* Kết quả */}
        {result && (
          <div className={`w-full p-6 rounded-xl ${
            result.isCorrect 
              ? 'bg-success-50 border border-success-200' 
              : 'bg-error-50 border border-error-200'
          }`}>
            <p className={`font-semibold text-center ${
              result.isCorrect ? 'text-success-700' : 'text-error-700'
            }`}>
              {result.message}
            </p>
            
            <div className="flex justify-center mt-4">
              <Button variant="secondary" onClick={reset}>
                Làm lại
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Hướng dẫn */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-neutral-700 mb-2">
          💡 <strong>Cách làm:</strong>
        </p>
        <ul className="text-sm text-neutral-600 space-y-1 ml-4 list-disc">
          <li>Nhấn nút "Nói đáp án" và nói chữ cái (A, B, C, D)</li>
          <li>Hoặc nói nội dung đáp án (ví dụ: "Apple")</li>
          <li>Hoặc click trực tiếp vào đáp án</li>
        </ul>
      </div>
    </Card>
  );
}
