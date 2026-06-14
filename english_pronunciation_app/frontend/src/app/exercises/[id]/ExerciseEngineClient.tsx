"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';

// Component con để render câu hỏi loại Nghe & Chọn (Luyện Tai)
function ListenChooseQuestion({ 
  question, 
  onAnswer,
  isAnswered,
  selectedAnswer
}: { 
  question: any, 
  onAnswer: (isCorrect: boolean, selectedOpt: string) => void,
  isAnswered: boolean,
  selectedAnswer: string | null
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse nội dung câu hỏi (chứa word, audioUrl, hint)
  let contentData = { word: '', audioUrl: '', hint: '' };
  try {
    contentData = JSON.parse(question.content);
  } catch (e) {
    // Fallback nếu parse lỗi
    contentData.audioUrl = question.content;
  }

  const handlePlayAudio = () => {
    if (!contentData.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(contentData.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Autoplay prevented by browser:", error);
        setIsPlaying(false);
      });
    }
  };

  // Tự động phát khi câu hỏi mới xuất hiện
  useEffect(() => {
    // Reset audio when question changes
    audioRef.current = null;
    
    // Auto play
    const timer = setTimeout(() => {
      handlePlayAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleSelect = (optContent: string) => {
    if (isAnswered) return; // Không cho chọn lại
    const isCorrect = optContent === question.answer;
    onAnswer(isCorrect, optContent);
  };

  // Capitalize first letter logic
  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : '...';

  return (
    <div className="text-center space-y-10">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-6xl font-bold text-neutral-800">
          {displayWord}
        </h2>
        <button
          onClick={handlePlayAudio}
          className={`flex items-center gap-2 px-6 py-3 rounded-full bg-primary-50 text-primary-600 font-semibold hover:bg-primary-100 transition-colors
            ${isPlaying ? 'animate-pulse' : ''}`}
        >
          <span className="text-2xl">🔊</span>
          {isPlaying ? 'Đang phát...' : 'Phát lại audio'}
        </button>
      </div>

      <div>
        <p className="text-xl font-medium text-neutral-500 mb-6">{question.name}</p>
        <div className="flex justify-center gap-6">
          {question.options.map((opt: any) => {
            // Xác định màu sắc của nút
            let btnClass = "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300";
            if (isAnswered) {
              if (opt.content === question.answer) {
                // Đáp án đúng luôn sáng xanh
                btnClass = "border-success-500 bg-success-50 text-success-700 ring-4 ring-success-100";
              } else if (opt.content === selectedAnswer) {
                // Đáp án chọn sai bị đỏ
                btnClass = "border-error-500 bg-error-50 text-error-700 opacity-50";
              } else {
                // Option còn lại bị mờ đi
                btnClass = "border-neutral-200 bg-neutral-50 text-neutral-400 opacity-50";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.content)}
                disabled={isAnswered}
                className={`w-32 h-20 text-3xl font-ipa rounded-2xl border-4 transition-all
                  ${btnClass} ${!isAnswered ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}
              >
                {opt.content}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Component con để render câu hỏi dạng Thu Âm (Bài 2, 3, 4)
function VoiceQuestion({ 
  question, 
  onNext
}: { 
  question: any, 
  onNext: (isCorrect: boolean, selectedOpt: string) => void
}) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'correct' | 'incorrect' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Parse content
  let contentData = { word: '', ipa: '', audioUrl: '', hint: '' };
  try {
    contentData = JSON.parse(question.content);
  } catch (e) {
    contentData.word = question.content;
  }

  // Capitalize first letter logic
  const displayWord = contentData.word ? contentData.word.charAt(0).toUpperCase() + contentData.word.slice(1) : '...';

  // --- AUDIO LOGIC ---
  const handlePlayAudio = () => {
    if (!contentData.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(contentData.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    }
  };

  // --- SPEECH RECOGNITION LOGIC ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        checkAnswer(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech API Error:", event.error);
        if (event.error === 'no-speech' || event.error === 'network') {
          setStatus('error');
        }
      };

      recognitionRef.current.onend = () => {
        setStatus((prev) => prev === 'recording' ? 'error' : prev);
      };
    } else {
      console.error("Web Speech API not supported on this browser.");
    }
  }, [question.id]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ Web Speech API. Vui lòng dùng Chrome trên PC.");
      return;
    }
    setStatus('recording');
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch(e) {
      console.error("Could not start recognition:", e);
    }

    setTimeout(() => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    }, 5000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
  };

  const checkAnswer = (recordedText: string) => {
    setStatus('processing');
    
    const cleanRecorded = recordedText.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
    const cleanAnswer = question.answer.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();

    setTimeout(() => {
      if (cleanRecorded === cleanAnswer) {
        setStatus('correct');
      } else {
        setStatus('incorrect');
        setRetryCount(prev => prev + 1);
      }
    }, 500); 
  };

  const handleSkipOrNext = (isCorrectRes: boolean) => {
    onNext(isCorrectRes, transcript);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white text-neutral-900 p-8 rounded-2xl shadow-xl border-2 border-neutral-100 min-h-[400px] flex flex-col justify-between">
        
        {/* HEADER AREA */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-neutral-800">{displayWord}</h2>
            {contentData.ipa && <p className="text-2xl font-ipa text-neutral-500 mt-2">{contentData.ipa}</p>}
          </div>

          {(status === 'idle' || status === 'error' || status === 'incorrect') && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors font-semibold border border-primary-200
                  ${isPlaying ? 'animate-pulse bg-primary-100' : ''}`}
              >
                <span className="text-xl">🔊</span>
                {isPlaying ? 'Đang phát...' : 'Nghe phát âm mẫu'}
              </button>
            </div>
          )}
        </div>

        {/* CONTENT / STATUS AREA */}
        <div className="flex-1 mt-8 flex items-center justify-center">
          
          {status === 'idle' && (
            <div className="text-center w-full animate-fade-in">
              <p className="text-lg text-neutral-500 mb-6 font-medium">{question.name}</p>
              <button
                onClick={startRecording}
                className="w-full py-4 rounded-xl border-2 border-neutral-200 hover:border-primary-400 hover:bg-primary-50 text-neutral-700 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🎤</span>
                <span className="text-lg font-bold">Bắt đầu ghi âm</span>
              </button>
            </div>
          )}

          {status === 'recording' && (
            <div className="text-center w-full animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6 text-error-500">
                <span className="w-3 h-3 rounded-full bg-error-500 animate-pulse"></span>
                <span className="font-bold">Đang nghe...</span>
              </div>
              <div className="flex items-end justify-center gap-1 h-8 mb-8 opacity-70">
                <div className="w-2 bg-neutral-400 animate-wave h-3"></div>
                <div className="w-2 bg-neutral-400 animate-wave h-6" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 bg-neutral-400 animate-wave h-8" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 bg-neutral-400 animate-wave h-4" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 bg-neutral-400 animate-wave h-7" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <button
                onClick={stopRecording}
                className="w-full py-4 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold transition-all flex items-center justify-center gap-3"
              >
                <span className="w-4 h-4 bg-primary-500 rounded-sm"></span>
                <span className="text-lg font-bold">Dừng ghi âm</span>
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center animate-pulse text-neutral-500 font-medium">
              Đang phân tích giọng nói...
            </div>
          )}

          {status === 'error' && (
            <div className="text-center w-full animate-fade-in">
              <div className="bg-warning-50 text-warning-700 p-4 rounded-lg border border-warning-200 flex items-center gap-3 mb-6 font-medium">
                <span>⚠️</span>
                <span>Không nghe thấy gì, hoặc có lỗi kết nối.</span>
              </div>
              <button
                onClick={startRecording}
                className="w-full py-4 rounded-xl border-2 border-neutral-200 hover:border-primary-400 hover:bg-primary-50 text-neutral-700 font-bold transition-all flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🎤</span>
                <span className="text-lg">Thử lại</span>
              </button>
            </div>
          )}

          {status === 'correct' && (
            <div className="w-full animate-slide-up text-left space-y-6">
              <div className="flex items-center gap-2 text-success-600 font-bold text-xl">
                <span>✅</span> Phát âm đúng!
              </div>
              
              <div className="font-mono text-neutral-600 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <p>Bạn nói: <span className="text-neutral-900 font-bold">"{transcript}"</span></p>
                <p>Đáp án: <span className="text-success-600 font-bold">"{question.answer}"</span> ✔️</p>
              </div>

              <button
                onClick={() => handleSkipOrNext(true)}
                className="w-full py-4 rounded-xl bg-success-500 hover:bg-success-600 text-white font-bold transition-all shadow-md hover:-translate-y-1"
              >
                Tiếp theo →
              </button>
            </div>
          )}

          {status === 'incorrect' && (
            <div className="w-full animate-slide-up text-left space-y-6">
              <div className="flex items-center gap-2 text-error-600 font-bold text-xl">
                <span>❌</span> Chưa khớp
              </div>

              {retryCount > 0 && <p className="text-neutral-500 text-sm font-medium">Lần thử sai: {retryCount}</p>}

              <div className="font-mono text-neutral-600 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <p>Bạn nói: <span className="text-error-600 font-bold">"{transcript}"</span></p>
                <p>Đáp án: <span className="text-neutral-900 font-bold">"{question.answer}"</span></p>
              </div>

              {contentData.hint && (
                <div className="bg-warning-50 border border-warning-200 text-warning-800 p-4 rounded-lg flex items-start gap-3">
                  <span className="mt-1 text-xl">💡</span>
                  <p className="font-medium">{contentData.hint}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={startRecording}
                  className="flex-1 py-4 rounded-xl border-2 border-primary-200 bg-primary-50 text-primary-700 font-bold hover:bg-primary-100 transition-all flex items-center justify-center gap-2"
                >
                  <span>🎤</span> Thử lại
                </button>
                <button
                  onClick={() => handleSkipOrNext(false)}
                  className="flex-1 py-4 rounded-xl text-neutral-500 font-bold hover:bg-neutral-100 hover:text-neutral-900 transition-all flex items-center justify-center"
                >
                  Bỏ qua →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Component con: Thử Thách Kép (Minimal Pairs) với giao diện ASCII
function MinimalPairsQuestion({
  question,
  onNext
}: {
  question: any,
  onNext: (isCorrect: boolean, selectedOpt: string) => void
}) {
  const [t1Status, setT1Status] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [t2Status, setT2Status] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [transcript1, setTranscript1] = useState('');
  const [transcript2, setTranscript2] = useState('');
  const [overallStatus, setOverallStatus] = useState<'idle' | 'processing' | 'correct' | 'incorrect'>('idle');
  const [retryCount, setRetryCount] = useState(0);

  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null]);
  const recognitionRef = useRef<any>(null);

  // Parse content [ {word, ipa, audioUrl, hint}, {word, ipa, audioUrl, hint} ]
  let pairs = [
    { word: 'Word1', ipa: '/w1/', audioUrl: '', hint: '' },
    { word: 'Word2', ipa: '/w2/', audioUrl: '', hint: '' }
  ];
  try {
    pairs = JSON.parse(question.content);
  } catch (e) {}

  const handlePlayAudio = (index: number) => {
    if (playingId !== null) return;
    const url = pairs[index].audioUrl;
    if (!url) return;

    if (!audioRefs.current[index]) {
      audioRefs.current[index] = new Audio(url);
      audioRefs.current[index]!.onended = () => setPlayingId(null);
    }
    setPlayingId(index);
    const playPromise = audioRefs.current[index]!.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn("Autoplay prevented:", e);
        setPlayingId(null);
      });
    }
  };

  const startRecording = (index: number) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ Web Speech API.");
      return;
    }

    if (index === 0) {
      setT1Status('recording');
      setTranscript1('');
    } else {
      setT2Status('recording');
      setTranscript2('');
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      if (index === 0) {
        setTranscript1(currentTranscript);
        setT1Status('recorded');
      } else {
        setTranscript2(currentTranscript);
        setT2Status('recorded');
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      if (index === 0) setT1Status('idle'); else setT2Status('idle');
    };

    recognitionRef.current.onend = () => {
      // Bắt trường hợp dừng ghi âm mà chưa có kết quả
      if (index === 0 && t1Status === 'recording') setT1Status('idle');
      if (index === 1 && t2Status === 'recording') setT2Status('idle');
    };

    try {
      recognitionRef.current.start();
    } catch(e) {}

    setTimeout(() => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    }, 5000);
  };

  const checkBothAnswers = () => {
    setOverallStatus('processing');
    
    const clean1 = transcript1.toLowerCase().replace(/[^\w\s]/g, "").trim();
    const ans1 = pairs[0].word.toLowerCase().replace(/[^\w\s]/g, "").trim();
    
    const clean2 = transcript2.toLowerCase().replace(/[^\w\s]/g, "").trim();
    const ans2 = pairs[1].word.toLowerCase().replace(/[^\w\s]/g, "").trim();

    setTimeout(() => {
      if (clean1 === ans1 && clean2 === ans2) {
        setOverallStatus('correct');
      } else {
        setOverallStatus('incorrect');
        setRetryCount(prev => prev + 1);
      }
    }, 500);
  };

  const handleSkipOrNext = (isCorrectRes: boolean) => {
    onNext(isCorrectRes, `1:${transcript1}|2:${transcript2}`);
  };

  // Ký tự ASCII Border Helper
  const AsciiBox = ({ children, title }: { children: React.ReactNode, title?: string }) => (
    <div className="relative border border-dashed border-neutral-500 p-6 flex flex-col items-center">
      <span className="absolute -top-[10px] -left-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
      <span className="absolute -top-[10px] -right-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
      <span className="absolute -bottom-[10px] -left-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
      <span className="absolute -bottom-[10px] -right-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
      {title && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 font-mono text-neutral-400 tracking-widest">
          {title}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto font-mono text-neutral-300 bg-[#0a0a0a] p-8 rounded-xl shadow-2xl overflow-hidden selection:bg-neutral-700">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-white">THỬ THÁCH MINIMAL PAIRS</h2>
        <p className="text-neutral-400">{question.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        {/* WORD 1 */}
        <AsciiBox title="TỪ SỐ 1">
          <div className="mt-4 text-center space-y-2">
            <h3 className="text-3xl font-bold text-white uppercase flex items-center justify-center gap-2">
              {t1Status === 'recorded' && <span className="text-success-400 text-lg">✅</span>}
              {pairs[0].word}
            </h3>
            <p className="text-xl text-neutral-500">{pairs[0].ipa}</p>
          </div>
          
          <button
            onClick={() => handlePlayAudio(0)}
            className={`mt-6 mb-8 px-4 py-1 border border-neutral-600 hover:border-white hover:text-white transition-colors
              ${playingId === 0 ? 'text-white border-white animate-pulse' : 'text-neutral-400'}`}
          >
            [ 🔊 Nghe mẫu ]
          </button>

          <AsciiBox>
            <button
              onClick={() => startRecording(0)}
              className="w-full py-2 font-bold tracking-wider hover:text-white transition-colors"
            >
              {t1Status === 'idle' && <span className="text-neutral-300">🎤 BẤM ĐỂ NÓI</span>}
              {t1Status === 'recording' && <span className="text-error-500 animate-pulse">🔴 ĐANG NGHE...</span>}
              {t1Status === 'recorded' && <span className="text-primary-400">🔄 GHI ÂM LẠI</span>}
            </button>
          </AsciiBox>
          {t1Status === 'recorded' && (
            <p className="mt-4 text-sm text-neutral-500">Bạn đọc: <span className="text-white">"{transcript1}"</span></p>
          )}
        </AsciiBox>

        {/* WORD 2 */}
        <AsciiBox title="TỪ SỐ 2">
          <div className="mt-4 text-center space-y-2">
            <h3 className="text-3xl font-bold text-white uppercase flex items-center justify-center gap-2">
              {t2Status === 'recorded' && <span className="text-success-400 text-lg">✅</span>}
              {pairs[1].word}
            </h3>
            <p className="text-xl text-neutral-500">{pairs[1].ipa}</p>
          </div>
          
          <button
            onClick={() => handlePlayAudio(1)}
            className={`mt-6 mb-8 px-4 py-1 border border-neutral-600 hover:border-white hover:text-white transition-colors
              ${playingId === 1 ? 'text-white border-white animate-pulse' : 'text-neutral-400'}`}
          >
            [ 🔊 Nghe mẫu ]
          </button>

          <AsciiBox>
            <button
              onClick={() => startRecording(1)}
              className="w-full py-2 font-bold tracking-wider hover:text-white transition-colors"
            >
              {t2Status === 'idle' && <span className="text-neutral-300">🎤 BẤM ĐỂ NÓI</span>}
              {t2Status === 'recording' && <span className="text-error-500 animate-pulse">🔴 ĐANG NGHE...</span>}
              {t2Status === 'recorded' && <span className="text-primary-400">🔄 GHI ÂM LẠI</span>}
            </button>
          </AsciiBox>
          {t2Status === 'recorded' && (
            <p className="mt-4 text-sm text-neutral-500">Bạn đọc: <span className="text-white">"{transcript2}"</span></p>
          )}
        </AsciiBox>
      </div>

      <div className="border-t border-dashed border-neutral-600 pt-8 pb-4">
        {overallStatus === 'idle' || overallStatus === 'processing' ? (
          <button
            onClick={checkBothAnswers}
            disabled={t1Status !== 'recorded' || t2Status !== 'recorded' || overallStatus === 'processing'}
            className={`w-full relative border border-dashed p-4 flex justify-center font-bold tracking-[0.2em] transition-all
              ${t1Status === 'recorded' && t2Status === 'recorded' && overallStatus === 'idle' 
                ? 'border-white text-white hover:bg-neutral-900 cursor-pointer' 
                : 'border-neutral-700 text-neutral-700 cursor-not-allowed'}`}
          >
            <span className="absolute -top-[10px] -left-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
            <span className="absolute -top-[10px] -right-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
            <span className="absolute -bottom-[10px] -left-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
            <span className="absolute -bottom-[10px] -right-[6px] text-neutral-500 bg-[#0a0a0a] px-1">+</span>
            {overallStatus === 'processing' ? 'ĐANG XỬ LÝ...' : 'KIỂM TRA'}
          </button>
        ) : overallStatus === 'correct' ? (
          <div className="text-center animate-fade-in space-y-6">
            <h3 className="text-success-400 text-2xl font-bold tracking-widest">✅ XUẤT SẮC!</h3>
            <button
              onClick={() => handleSkipOrNext(true)}
              className="px-10 py-3 border border-success-400 text-success-400 hover:bg-success-400 hover:text-[#0a0a0a] transition-all font-bold tracking-wider"
            >
              [ CHUYỂN TIẾP ]
            </button>
          </div>
        ) : (
          <div className="text-center animate-fade-in space-y-6">
            <h3 className="text-error-400 text-2xl font-bold tracking-widest">❌ CHƯA CHÍNH XÁC</h3>
            {retryCount > 0 && <p className="text-neutral-500">Lần sai: {retryCount}</p>}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOverallStatus('idle')}
                className="px-6 py-3 border border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-[#0a0a0a] transition-all font-bold tracking-wider"
              >
                [ LÀM LẠI ]
              </button>
              <button
                onClick={() => handleSkipOrNext(false)}
                className="px-6 py-3 border border-neutral-600 text-neutral-400 hover:bg-neutral-600 hover:text-white transition-all font-bold tracking-wider"
              >
                [ BỎ QUA ]
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function ExerciseEngineClient({ exercise }: { exercise: any }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const questions = exercise.questions;
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  // Lấy Hint từ JSON nếu có
  let currentHint = '';
  try {
    const data = JSON.parse(currentQuestion?.content || '{}');
    currentHint = data.hint || '';
  } catch(e) {}

  const handleAnswerListen = (correct: boolean, answerOpt: string) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    setSelectedAnswer(answerOpt);
    
    if (correct) {
      setScore(prev => prev + currentQuestion.score);
    } else {
      setIncorrectQuestions(prev => [...prev, {
        question: currentQuestion,
        selected: answerOpt,
        correct: currentQuestion.answer
      }]);
    }
  };

  const handleNextVoice = (correct: boolean, answerOpt: string) => {
    if (correct) {
      setScore(prev => prev + currentQuestion.score);
    } else {
      setIncorrectQuestions(prev => [...prev, {
        question: currentQuestion,
        selected: answerOpt,
        correct: currentQuestion.answer
      }]);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleNextListen = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const correctCount = questions.length - incorrectQuestions.length;
    const isPassed = (correctCount / questions.length) >= 0.8;

    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center p-8">
        <Card className="max-w-2xl w-full space-y-8 animate-fade-in text-center p-12">
          {isPassed ? (
            <div className="text-8xl mb-4">🎉</div>
          ) : (
            <div className="text-8xl mb-4">💪</div>
          )}
          
          <h2 className="text-3xl font-bold text-neutral-900">
            {isPassed ? "Hoàn thành Bài tập!" : "Cố gắng lên nhé!"}
          </h2>
          
          <div className="bg-neutral-100 rounded-xl p-6 border border-neutral-200 inline-block w-full max-w-sm">
            <p className="text-lg text-neutral-700 font-medium mb-2">Đúng {correctCount}/{questions.length} câu — {Math.round((correctCount/questions.length)*100)}%</p>
            <ProgressBar value={(correctCount/questions.length)*100} max={100} color={isPassed ? "success" : "warning"} size="lg" />
            <p className="text-sm font-bold mt-2 text-success-600">{isPassed ? "Xuất sắc!" : "Cần luyện tập thêm"}</p>
          </div>

          {incorrectQuestions.length > 0 && (
            <div className="text-left bg-error-50 p-6 rounded-xl border border-error-200 mt-8">
              <h3 className="text-lg font-bold text-error-800 mb-4">Các câu cần lưu ý:</h3>
              <ul className="space-y-4">
                {incorrectQuestions.map((iq, idx) => {
                  let word = '';
                  try { 
                    const parsed = JSON.parse(iq.question.content);
                    word = Array.isArray(parsed) ? `${parsed[0].word} & ${parsed[1].word}` : parsed.word;
                  } catch(e) { word = iq.question.content }
                  
                  return (
                    <li key={idx} className="bg-white p-4 rounded-lg border border-error-100 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xl mr-2">"{word}"</span>
                        <span className="text-neutral-500">
                          bạn {iq.question.type === 'qtype-2-voice' || iq.question.type === 'qtype-3-minimal-pairs' ? 'nói' : 'chọn'} <span className="text-error-600 font-bold">{iq.selected || 'Không rõ'}</span>, đúng là <span className="text-success-600 font-bold">{iq.correct}</span>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <Button 
            className="w-full h-14 text-lg mt-8" 
            onClick={() => router.push('/learning_map')}
          >
            Quay về Lộ trình
          </Button>
        </Card>
      </div>
    );
  }

  const isVoiceTask = currentQuestion?.type === 'qtype-2-voice' || currentQuestion?.type === 'qtype-3-minimal-pairs';

  return (
    <div className={`min-h-screen flex flex-col ${isVoiceTask ? 'bg-[#0a0a0a]' : 'bg-neutral-50'}`}>
      {/* Header Bar */}
      <header className={`${isVoiceTask ? 'bg-transparent border-neutral-800' : 'bg-white border-neutral-200'} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors`}>
        <button onClick={() => router.back()} className={`${isVoiceTask ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'} text-2xl font-bold p-2 transition-colors`}>
          ×
        </button>
        <div className="flex-1 mx-8 max-w-2xl">
          <ProgressBar value={progressPercent} max={100} size="lg" color={isVoiceTask ? "primary" : "primary"} />
        </div>
        <div className={`font-bold flex items-center gap-2 ${isVoiceTask ? 'text-neutral-400' : 'text-neutral-700'}`}>
          <span className="text-blue-500 text-xl">💎</span> {score}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-12 flex flex-col">
        {!currentQuestion ? (
          <div className="text-center text-white">Dữ liệu đang được tải...</div>
        ) : (
          <div className="animate-slide-up flex-1 flex flex-col">
            <div className={`text-sm font-bold ${isVoiceTask ? 'text-neutral-500' : 'text-neutral-400'} mb-10 uppercase tracking-wider text-center`}>
              Câu {currentIndex + 1} / {questions.length}
            </div>

            {currentQuestion.type === 'qtype-1-mc' && (
              <ListenChooseQuestion 
                question={currentQuestion} 
                onAnswer={handleAnswerListen} 
                isAnswered={isAnswered}
                selectedAnswer={selectedAnswer}
              />
            )}
            
            {currentQuestion.type === 'qtype-2-voice' && (
              <VoiceQuestion 
                key={currentQuestion.id}
                question={currentQuestion} 
                onNext={handleNextVoice} 
              />
            )}

            {currentQuestion.type === 'qtype-3-minimal-pairs' && (
              <MinimalPairsQuestion 
                key={currentQuestion.id}
                question={currentQuestion} 
                onNext={handleNextVoice} 
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Feedback Bar (Chỉ hiển thị cho Bài Luyện Tai) */}
      {!isVoiceTask && (
        <div className={`fixed bottom-0 left-0 right-0 p-6 transition-all duration-300 transform border-t-2
          ${isAnswered ? 'translate-y-0' : 'translate-y-full'}
          ${isCorrect ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'}`}
        >
          <div className="max-w-4xl mx-auto flex items-start justify-between">
            <div className="flex items-start gap-6 flex-1">
              <div className={`w-16 h-16 rounded-full flex flex-shrink-0 items-center justify-center text-4xl shadow-sm
                ${isCorrect ? 'bg-white text-success-500' : 'bg-white text-error-500'}`}
              >
                {isCorrect ? '✓' : '×'}
              </div>
              <div className="space-y-3">
                <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success-700' : 'text-error-700'}`}>
                  {isCorrect ? `Chính xác! ${currentQuestion.answer}` : `Bạn chọn ${selectedAnswer} — Chưa đúng`}
                </h3>
                
                {!isCorrect && (
                  <p className="text-error-700 font-medium">
                    ✔️ Đáp án đúng là <span className="font-bold text-xl">{currentQuestion.answer}</span>
                  </p>
                )}

                {/* Hint */}
                {currentHint && (
                  <div className={`mt-2 text-sm p-4 rounded-lg flex items-start gap-3 
                    ${isCorrect ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'}`}>
                    <span className="text-xl">💡</span>
                    <p>{currentHint}</p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              variant={isCorrect ? "success" : "error"} 
              size="lg" 
              className="w-48 text-lg py-6 shadow-xl hover:-translate-y-1 ml-6 mt-4"
              onClick={handleNextListen}
            >
              Tiếp theo →
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
