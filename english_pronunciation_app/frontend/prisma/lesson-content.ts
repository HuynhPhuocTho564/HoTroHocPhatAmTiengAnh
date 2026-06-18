/**
 * LESSON CONTENT - Dữ liệu thực tế cho bài học
 * 
 * MVP: 20 bài (8 bài chủ đề 1 + 12 bài chủ đề 4)
 * - Chủ đề 1: Nhóm /iː/ & /ɪ/ (4 bài) + Nhóm /e/ & /æ/ (4 bài) + Nhóm /ɒ/ & /ɔː/ (4 bài)
 * - Chủ đề 4: Nhóm front vowels (4 bài) + Nhóm final consonants (4 bài)
 * 
 * Mỗi item có:
 * - status: ACTIVE (có audio/review), DRAFT (chưa đủ), NEEDS_REVIEW
 * - sourceType: MANUAL (tự biên soạn), FREE_API (Free Dictionary)
 * - reviewNote: ghi chú về nguồn/chất lượng
 */

export type WordItemData = {
  word: string;
  ipa: string;
  soundGroupId: string;
  targetPhonemes: string[];
  difficulty: number;
  audioUrl?: string;
  exampleSentence?: string;
  status: "ACTIVE" | "DRAFT" | "NEEDS_REVIEW";
  sourceType: "MANUAL" | "FREE_API" | "LICENSED";
  sourceUrl?: string;
  reviewNote?: string;
};

export type MinimalPairData = {
  word1: string;
  ipa1: string;
  word2: string;
  ipa2: string;
  soundGroupId: string;
  contrastPhonemes: string[];
  difficulty: number;
  audioUrl1?: string;
  audioUrl2?: string;
  explanation?: string;
  status: "ACTIVE" | "DRAFT" | "NEEDS_REVIEW";
  sourceType: "MANUAL" | "FREE_API" | "LICENSED";
  reviewNote?: string;
};

export type SentenceItemData = {
  sentence: string;
  soundGroupId: string;
  targetWords: string[];
  targetPhonemes: string[];
  difficulty: number;
  audioUrl?: string;
  translation?: string;
  status: "ACTIVE" | "DRAFT" | "NEEDS_REVIEW";
  sourceType: "MANUAL" | "FREE_API" | "LICENSED";
  reviewNote?: string;
};

// ============================================================================
// TOPIC 1 - NHÓM 1: /iː/ & /ɪ/ (ship/sheep)
// ============================================================================

export const WORDS_T1_G01_I_IH: WordItemData[] = [
  {
    word: "sheep",
    ipa: "/ʃiːp/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/iː/"],
    difficulty: 3,
    exampleSentence: "The sheep are in the field.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    sourceUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/sheep",
    reviewNote: "Audio từ Free Dictionary API, quality tốt",
  },
  {
    word: "ship",
    ipa: "/ʃɪp/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/ɪ/"],
    difficulty: 3,
    exampleSentence: "The ship sailed across the ocean.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    sourceUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/ship",
    reviewNote: "Audio từ Free Dictionary API",
  },
  {
    word: "feel",
    ipa: "/fiːl/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/iː/"],
    difficulty: 2,
    exampleSentence: "I feel happy today.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    reviewNote: "Từ cơ bản, dễ phát âm",
  },
  {
    word: "fill",
    ipa: "/fɪl/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/ɪ/"],
    difficulty: 2,
    exampleSentence: "Please fill the glass with water.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    reviewNote: "Cặp minimal pair với feel",
  },
  {
    word: "seat",
    ipa: "/siːt/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/iː/"],
    difficulty: 2,
    exampleSentence: "Please take a seat.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "sit",
    ipa: "/sɪt/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/ɪ/"],
    difficulty: 2,
    exampleSentence: "Please sit down.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "heat",
    ipa: "/hiːt/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/iː/"],
    difficulty: 3,
    exampleSentence: "The heat is unbearable today.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "hit",
    ipa: "/hɪt/",
    soundGroupId: "map-t1-g01-i-ih",
    targetPhonemes: ["/ɪ/"],
    difficulty: 3,
    exampleSentence: "Don't hit the ball too hard.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
];

export const MINIMAL_PAIRS_T1_G01: MinimalPairData[] = [
  {
    word1: "sheep",
    ipa1: "/ʃiːp/",
    word2: "ship",
    ipa2: "/ʃɪp/",
    soundGroupId: "map-t1-g01-i-ih",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 3,
    explanation: "/iː/ dài và căng, /ɪ/ ngắn và lỏng",
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Cặp cổ điển nhất cho /iː/ vs /ɪ/",
  },
  {
    word1: "feel",
    ipa1: "/fiːl/",
    word2: "fill",
    ipa2: "/fɪl/",
    soundGroupId: "map-t1-g01-i-ih",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 2,
    explanation: "Chú ý độ dài của nguyên âm",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "seat",
    ipa1: "/siːt/",
    word2: "sit",
    ipa2: "/sɪt/",
    soundGroupId: "map-t1-g01-i-ih",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 2,
    explanation: "Âm dài vs âm ngắn rõ nhất",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "heat",
    ipa1: "/hiːt/",
    word2: "hit",
    ipa2: "/hɪt/",
    soundGroupId: "map-t1-g01-i-ih",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 3,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

export const SENTENCES_T1_G01: SentenceItemData[] = [
  {
    sentence: "The sheep are on the ship.",
    soundGroupId: "map-t1-g01-i-ih",
    targetWords: ["sheep", "ship"],
    targetPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 4,
    translation: "Những con cừu ở trên con tàu.",
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Câu chứa cả 2 âm mục tiêu",
  },
  {
    sentence: "I feel sick when I sit here.",
    soundGroupId: "map-t1-g01-i-ih",
    targetWords: ["feel", "sick", "sit"],
    targetPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 5,
    translation: "Tôi cảm thấy ốm khi ngồi ở đây.",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "Please take your seat and sit down.",
    soundGroupId: "map-t1-g01-i-ih",
    targetWords: ["seat", "sit"],
    targetPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 4,
    translation: "Xin hãy lấy chỗ ngồi và ngồi xuống.",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "The heat will hit us soon.",
    soundGroupId: "map-t1-g01-i-ih",
    targetWords: ["heat", "hit"],
    targetPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 4,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

// ============================================================================
// TOPIC 1 - NHÓM 2: /e/ & /æ/ (bed/bad)
// ============================================================================

export const WORDS_T1_G02_E_AE: WordItemData[] = [
  {
    word: "bed",
    ipa: "/bed/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/e/"],
    difficulty: 2,
    exampleSentence: "I go to bed at 10 PM.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "bad",
    ipa: "/bæd/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/æ/"],
    difficulty: 3,
    exampleSentence: "That's a bad idea.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "pen",
    ipa: "/pen/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/e/"],
    difficulty: 2,
    exampleSentence: "I need a pen to write.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "pan",
    ipa: "/pæn/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/æ/"],
    difficulty: 3,
    exampleSentence: "Heat the pan before cooking.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "set",
    ipa: "/set/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/e/"],
    difficulty: 2,
    exampleSentence: "Set the table for dinner.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "sat",
    ipa: "/sæt/",
    soundGroupId: "map-t1-g02-e-ae",
    targetPhonemes: ["/æ/"],
    difficulty: 3,
    exampleSentence: "She sat on the chair.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
];

export const MINIMAL_PAIRS_T1_G02: MinimalPairData[] = [
  {
    word1: "bed",
    ipa1: "/bed/",
    word2: "bad",
    ipa2: "/bæd/",
    soundGroupId: "map-t1-g02-e-ae",
    contrastPhonemes: ["/e/", "/æ/"],
    difficulty: 3,
    explanation: "/e/ hẹp hơn, /æ/ mở miệng rộng hơn",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "pen",
    ipa1: "/pen/",
    word2: "pan",
    ipa2: "/pæn/",
    soundGroupId: "map-t1-g02-e-ae",
    contrastPhonemes: ["/e/", "/æ/"],
    difficulty: 3,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "set",
    ipa1: "/set/",
    word2: "sat",
    ipa2: "/sæt/",
    soundGroupId: "map-t1-g02-e-ae",
    contrastPhonemes: ["/e/", "/æ/"],
    difficulty: 3,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

export const SENTENCES_T1_G02: SentenceItemData[] = [
  {
    sentence: "The bad man is in bed.",
    soundGroupId: "map-t1-g02-e-ae",
    targetWords: ["bad", "bed"],
    targetPhonemes: ["/æ/", "/e/"],
    difficulty: 4,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "I left my pen in the pan.",
    soundGroupId: "map-t1-g02-e-ae",
    targetWords: ["pen", "pan"],
    targetPhonemes: ["/e/", "/æ/"],
    difficulty: 4,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "She set the bag down and sat.",
    soundGroupId: "map-t1-g02-e-ae",
    targetWords: ["set", "bag", "sat"],
    targetPhonemes: ["/e/", "/æ/"],
    difficulty: 5,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

// ============================================================================
// TOPIC 1 - NHÓM 4: /ɒ/ & /ɔː/ (hot/bought) - MINIMAL PAIRS KHÓ
// ============================================================================

export const WORDS_T1_G04_O_OH: WordItemData[] = [
  {
    word: "hot",
    ipa: "/hɒt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɒ/"],
    difficulty: 6,
    exampleSentence: "The coffee is too hot.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    reviewNote: "Âm /ɒ/ ngắn, miệng mở tròn",
  },
  {
    word: "caught",
    ipa: "/kɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɔː/"],
    difficulty: 7,
    exampleSentence: "I caught the ball.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    reviewNote: "Âm /ɔː/ dài hơn, môi tròn hơn",
  },
  {
    word: "not",
    ipa: "/nɒt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɒ/"],
    difficulty: 5,
    exampleSentence: "I'm not ready yet.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "nought",
    ipa: "/nɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɔː/"],
    difficulty: 7,
    exampleSentence: "Two plus nought equals two.",
    status: "ACTIVE",
    sourceType: "FREE_API",
    reviewNote: "Từ British English cho số 0",
  },
  {
    word: "spot",
    ipa: "/spɒt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɒ/"],
    difficulty: 6,
    exampleSentence: "I found a good parking spot.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "sport",
    ipa: "/spɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɔː/"],
    difficulty: 6,
    exampleSentence: "Football is my favorite sport.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "shot",
    ipa: "/ʃɒt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɒ/"],
    difficulty: 6,
    exampleSentence: "The doctor gave me a shot.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "short",
    ipa: "/ʃɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    targetPhonemes: ["/ɔː/"],
    difficulty: 6,
    exampleSentence: "She has short hair.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
];

export const MINIMAL_PAIRS_T1_G04: MinimalPairData[] = [
  {
    word1: "hot",
    ipa1: "/hɒt/",
    word2: "taught",
    ipa2: "/tɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    contrastPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 7,
    explanation: "/ɒ/ ngắn và mở, /ɔː/ dài và tròn môi",
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Cặp khó vì người Việt hay nhầm 2 âm này",
  },
  {
    word1: "not",
    ipa1: "/nɒt/",
    word2: "nought",
    ipa2: "/nɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    contrastPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 8,
    explanation: "Chú ý độ dài và hình dạng môi",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "spot",
    ipa1: "/spɒt/",
    word2: "sport",
    ipa2: "/spɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    contrastPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 7,
    explanation: "Âm /ɔː/ cần thêm /r/ trong phát âm Mỹ",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "shot",
    ipa1: "/ʃɒt/",
    word2: "short",
    ipa2: "/ʃɔːt/",
    soundGroupId: "map-t1-g04-o-oh",
    contrastPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 7,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

export const SENTENCES_T1_G04: SentenceItemData[] = [
  {
    sentence: "The hot spot in the sport center.",
    soundGroupId: "map-t1-g04-o-oh",
    targetWords: ["hot", "spot", "sport"],
    targetPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 8,
    translation: "Điểm nóng ở trung tâm thể thao.",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "I'm not good at sport.",
    soundGroupId: "map-t1-g04-o-oh",
    targetWords: ["not", "sport"],
    targetPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 7,
    translation: "Tôi không giỏi thể thao.",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    sentence: "She shot the ball but it was too short.",
    soundGroupId: "map-t1-g04-o-oh",
    targetWords: ["shot", "short"],
    targetPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 8,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

// ============================================================================
// TOPIC 4 - NHÓM 1: Front vowels mix (sheep/ship/shape/sharp)
// ============================================================================

export const WORDS_T4_G01_FRONT_MIX: WordItemData[] = [
  {
    word: "sheep",
    ipa: "/ʃiːp/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/iː/"],
    difficulty: 6,
    exampleSentence: "Look at those sheep on the hill.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "ship",
    ipa: "/ʃɪp/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/ɪ/"],
    difficulty: 6,
    exampleSentence: "The ship is leaving the port.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "shape",
    ipa: "/ʃeɪp/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/eɪ/"],
    difficulty: 7,
    exampleSentence: "What shape is this object?",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "sharp",
    ipa: "/ʃɑːp/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/ɑː/"],
    difficulty: 7,
    exampleSentence: "Be careful, the knife is sharp.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "beat",
    ipa: "/biːt/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/iː/"],
    difficulty: 6,
    exampleSentence: "Don't beat the drum too loud.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "bit",
    ipa: "/bɪt/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/ɪ/"],
    difficulty: 6,
    exampleSentence: "I ate a bit of cake.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "bet",
    ipa: "/bet/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/e/"],
    difficulty: 6,
    exampleSentence: "I bet you can't do it.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "bat",
    ipa: "/bæt/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetPhonemes: ["/æ/"],
    difficulty: 6,
    exampleSentence: "He hit the ball with a bat.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
];

export const MINIMAL_PAIRS_T4_G01: MinimalPairData[] = [
  {
    word1: "sheep",
    ipa1: "/ʃiːp/",
    word2: "ship",
    ipa2: "/ʃɪp/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 7,
    explanation: "Tổng hợp: 4 nguyên âm phía trước khác nhau",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "beat",
    ipa1: "/biːt/",
    word2: "bit",
    ipa2: "/bɪt/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    contrastPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 7,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "bit",
    ipa1: "/bɪt/",
    word2: "bet",
    ipa2: "/bet/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    contrastPhonemes: ["/ɪ/", "/e/"],
    difficulty: 7,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "bet",
    ipa1: "/bet/",
    word2: "bat",
    ipa2: "/bæt/",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    contrastPhonemes: ["/e/", "/æ/"],
    difficulty: 7,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

export const SENTENCES_T4_G01: SentenceItemData[] = [
  {
    sentence: "The sheep on the ship have an odd shape.",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetWords: ["sheep", "ship", "shape"],
    targetPhonemes: ["/iː/", "/ɪ/", "/eɪ/"],
    difficulty: 8,
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Câu thử thách cao với 3 âm khác nhau",
  },
  {
    sentence: "I beat the bit with a bat after I bet.",
    soundGroupId: "map-t3-g01-front-vowel-mix",
    targetWords: ["beat", "bit", "bat", "bet"],
    targetPhonemes: ["/iː/", "/ɪ/", "/æ/", "/e/"],
    difficulty: 9,
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Tổng hợp 4 nguyên âm trong 1 câu",
  },
];

// ============================================================================
// TOPIC 4 - NHÓM 3: Final consonants (cap/cab)
// ============================================================================

export const WORDS_T4_G03_FINAL: WordItemData[] = [
  {
    word: "cap",
    ipa: "/kæp/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/p/"],
    difficulty: 7,
    exampleSentence: "He wears a red cap.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "cab",
    ipa: "/kæb/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/b/"],
    difficulty: 7,
    exampleSentence: "Call a cab for me.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "cat",
    ipa: "/kæt/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/t/"],
    difficulty: 7,
    exampleSentence: "The cat is sleeping.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "cad",
    ipa: "/kæd/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/d/"],
    difficulty: 7,
    exampleSentence: "He's a real cad.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "back",
    ipa: "/bæk/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/k/"],
    difficulty: 7,
    exampleSentence: "Come back here!",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
  {
    word: "bag",
    ipa: "/bæg/",
    soundGroupId: "map-t3-g03-final-drop",
    targetPhonemes: ["/g/"],
    difficulty: 7,
    exampleSentence: "Put it in the bag.",
    status: "ACTIVE",
    sourceType: "FREE_API",
  },
];

export const MINIMAL_PAIRS_T4_G03: MinimalPairData[] = [
  {
    word1: "cap",
    ipa1: "/kæp/",
    word2: "cab",
    ipa2: "/kæb/",
    soundGroupId: "map-t3-g03-final-drop",
    contrastPhonemes: ["/p/", "/b/"],
    difficulty: 8,
    explanation: "Phụ âm cuối vô thanh vs hữu thanh - người Việt hay bỏ",
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "cat",
    ipa1: "/kæt/",
    word2: "cad",
    ipa2: "/kæd/",
    soundGroupId: "map-t3-g03-final-drop",
    contrastPhonemes: ["/t/", "/d/"],
    difficulty: 8,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
  {
    word1: "back",
    ipa1: "/bæk/",
    word2: "bag",
    ipa2: "/bæg/",
    soundGroupId: "map-t3-g03-final-drop",
    contrastPhonemes: ["/k/", "/g/"],
    difficulty: 8,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

export const SENTENCES_T4_G03: SentenceItemData[] = [
  {
    sentence: "Put the cap in the cab before you go back.",
    soundGroupId: "map-t3-g03-final-drop",
    targetWords: ["cap", "cab", "back"],
    targetPhonemes: ["/p/", "/b/", "/k/"],
    difficulty: 9,
    status: "ACTIVE",
    sourceType: "MANUAL",
    reviewNote: "Thử thách phụ âm cuối - không nuốt",
  },
  {
    sentence: "The cat sat in the bag with my cap.",
    soundGroupId: "map-t3-g03-final-drop",
    targetWords: ["cat", "sat", "bag", "cap"],
    targetPhonemes: ["/t/", "/t/", "/g/", "/p/"],
    difficulty: 9,
    status: "ACTIVE",
    sourceType: "MANUAL",
  },
];

// ============================================================================
// EXPORTS - Tổng hợp theo sound group
// ============================================================================

export const LESSON_CONTENT_BY_SOUND_GROUP = {
  "map-t1-g01-i-ih": {
    words: WORDS_T1_G01_I_IH,
    minimalPairs: MINIMAL_PAIRS_T1_G01,
    sentences: SENTENCES_T1_G01,
  },
  "map-t1-g02-e-ae": {
    words: WORDS_T1_G02_E_AE,
    minimalPairs: MINIMAL_PAIRS_T1_G02,
    sentences: SENTENCES_T1_G02,
  },
  "map-t1-g04-o-oh": {
    words: WORDS_T1_G04_O_OH,
    minimalPairs: MINIMAL_PAIRS_T1_G04,
    sentences: SENTENCES_T1_G04,
  },
  "map-t3-g01-front-vowel-mix": {
    words: WORDS_T4_G01_FRONT_MIX,
    minimalPairs: MINIMAL_PAIRS_T4_G01,
    sentences: SENTENCES_T4_G01,
  },
  "map-t3-g03-final-drop": {
    words: WORDS_T4_G03_FINAL,
    minimalPairs: MINIMAL_PAIRS_T4_G03,
    sentences: SENTENCES_T4_G03,
  },
};

// Helper để lấy content theo sound group
export function getContentBySoundGroup(soundGroupId: string) {
  return LESSON_CONTENT_BY_SOUND_GROUP[soundGroupId as keyof typeof LESSON_CONTENT_BY_SOUND_GROUP];
}

// Stats
const totalWords = Object.values(LESSON_CONTENT_BY_SOUND_GROUP).reduce((sum, group) => sum + group.words.length, 0);
const totalPairs = Object.values(LESSON_CONTENT_BY_SOUND_GROUP).reduce((sum, group) => sum + group.minimalPairs.length, 0);
const totalSentences = Object.values(LESSON_CONTENT_BY_SOUND_GROUP).reduce((sum, group) => sum + group.sentences.length, 0);

console.log(`📝 Lesson Content loaded:`);
console.log(`   - ${Object.keys(LESSON_CONTENT_BY_SOUND_GROUP).length} Sound Groups with data`);
console.log(`   - ${totalWords} Words`);
console.log(`   - ${totalPairs} Minimal Pairs`);
console.log(`   - ${totalSentences} Sentences`);
console.log(`   - MVP ready: 20 lessons (5 groups × 4 modes)`);
