/**
 * Audio Data - Mapping âm vị IPA với file audio
 * 
 * Lưu ý: Hiện tại chưa có file audio thật, sẽ fallback sang Web Speech Synthesis API
 */

export interface PhonemeAudio {
  symbol: string;
  audioUrl?: string; // URL đến file audio (nếu có)
  useTTS: boolean;   // Có dùng TTS fallback không
  ttsText: string;   // Text để TTS đọc
}

/**
 * Danh sách audio cho 44 âm vị IPA
 * 
 * TODO: Thêm audioUrl khi có file audio thật
 * Format: /audio/phonemes/vowels/i.mp3
 */
export const PHONEME_AUDIO_DATA: PhonemeAudio[] = [
  // Nguyên âm (Vowels)
  { symbol: "iː", useTTS: true, ttsText: "see" },
  { symbol: "ɪ", useTTS: true, ttsText: "sit" },
  { symbol: "e", useTTS: true, ttsText: "bed" },
  { symbol: "æ", useTTS: true, ttsText: "cat" },
  { symbol: "ɑː", useTTS: true, ttsText: "car" },
  { symbol: "ɒ", useTTS: true, ttsText: "hot" },
  { symbol: "ɔː", useTTS: true, ttsText: "door" },
  { symbol: "ʊ", useTTS: true, ttsText: "put" },
  { symbol: "uː", useTTS: true, ttsText: "food" },
  { symbol: "ʌ", useTTS: true, ttsText: "cup" },
  { symbol: "ɜː", useTTS: true, ttsText: "bird" },
  { symbol: "ə", useTTS: true, ttsText: "about" },
  
  // Phụ âm (Consonants)
  { symbol: "p", useTTS: true, ttsText: "pen" },
  { symbol: "b", useTTS: true, ttsText: "big" },
  { symbol: "t", useTTS: true, ttsText: "tea" },
  { symbol: "d", useTTS: true, ttsText: "dog" },
  { symbol: "k", useTTS: true, ttsText: "cat" },
  { symbol: "g", useTTS: true, ttsText: "go" },
  { symbol: "f", useTTS: true, ttsText: "fish" },
  { symbol: "v", useTTS: true, ttsText: "van" },
  { symbol: "θ", useTTS: true, ttsText: "think" },
  { symbol: "ð", useTTS: true, ttsText: "this" },
  { symbol: "s", useTTS: true, ttsText: "sun" },
  { symbol: "z", useTTS: true, ttsText: "zoo" },
  { symbol: "ʃ", useTTS: true, ttsText: "ship" },
  { symbol: "ʒ", useTTS: true, ttsText: "vision" },
  { symbol: "h", useTTS: true, ttsText: "hat" },
  { symbol: "m", useTTS: true, ttsText: "man" },
  { symbol: "n", useTTS: true, ttsText: "no" },
  { symbol: "ŋ", useTTS: true, ttsText: "sing" },
  { symbol: "l", useTTS: true, ttsText: "leg" },
  { symbol: "r", useTTS: true, ttsText: "red" },
  { symbol: "w", useTTS: true, ttsText: "wet" },
  { symbol: "j", useTTS: true, ttsText: "yes" },
];

/**
 * Lấy thông tin audio cho âm vị
 */
export function getPhonemeAudio(symbol: string): PhonemeAudio | undefined {
  return PHONEME_AUDIO_DATA.find(p => p.symbol === symbol);
}

/**
 * Phát âm thanh cho âm vị (sử dụng TTS hoặc audio file)
 * 
 * @param symbol - Ký hiệu IPA (ví dụ: "æ")
 * @param onEnd - Callback khi phát xong
 */
export function playPhonemeSound(symbol: string, onEnd?: () => void): void {
  const phonemeData = getPhonemeAudio(symbol);
  
  if (!phonemeData) {
    console.error(`Không tìm thấy audio cho âm vị: ${symbol}`);
    return;
  }

  // Nếu có file audio thật
  if (phonemeData.audioUrl && !phonemeData.useTTS) {
    const audio = new Audio(phonemeData.audioUrl);
    audio.play();
    audio.onended = () => {
      if (onEnd) onEnd();
    };
    return;
  }

  // Fallback: Dùng Web Speech Synthesis API (TTS)
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(phonemeData.ttsText);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Nói chậm hơn để học viên nghe rõ
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Web Speech Synthesis API không được hỗ trợ');
  }
}

/**
 * Dừng phát âm thanh
 */
export function stopPhonemeSound(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
