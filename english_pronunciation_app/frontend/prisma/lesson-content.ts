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
// TOPIC 1 - NHÓM 3: /ɑː/ & /ʌ/ & /ə/ (father/fun/about) - NHÓM TRUNG TÂM
// ============================================================================

export const WORDS_T1_G03_CENTRAL: WordItemData[] = [
  { word: "father", ipa: "/ˈfɑːðə/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ɑː/"], difficulty: 5, exampleSentence: "My father is a teacher.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ɑː/ dài, miệng mở rộng" },
  { word: "fun", ipa: "/fʌn/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ʌ/"], difficulty: 4, exampleSentence: "We had fun at the party.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ʌ/ ngắn, lỏng" },
  { word: "car", ipa: "/kɑː/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ɑː/"], difficulty: 4, exampleSentence: "The car is red.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "cup", ipa: "/kʌp/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ʌ/"], difficulty: 3, exampleSentence: "I need a cup of tea.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "about", ipa: "/əˈbaʊt/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ə/"], difficulty: 5, exampleSentence: "Tell me about your day.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ə/ schwa yếu, không nhấn" },
  { word: "sofa", ipa: "/ˈsəʊfə/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ə/"], difficulty: 5, exampleSentence: "The sofa is comfortable.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "heart", ipa: "/hɑːt/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ɑː/"], difficulty: 5, exampleSentence: "My heart beats fast.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "but", ipa: "/bʌt/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ʌ/"], difficulty: 3, exampleSentence: "I want to go but I'm tired.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "ago", ipa: "/əˈɡəʊ/", soundGroupId: "map-t1-g03-central", targetPhonemes: ["/ə/"], difficulty: 5, exampleSentence: "It happened long ago.", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G03: MinimalPairData[] = [
  { word1: "father", ipa1: "/ˈfɑːðə/", word2: "fun", ipa2: "/fʌn/", soundGroupId: "map-t1-g03-central", contrastPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 5, explanation: "/ɑː/ dài mở rộng, /ʌ/ ngắn lỏng", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Cặp trung tâm cơ bản" },
  { word1: "car", ipa1: "/kɑː/", word2: "cup", ipa2: "/kʌp/", soundGroupId: "map-t1-g03-central", contrastPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 4, explanation: "Chú ý độ dài và hình dạng môi", status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "heart", ipa1: "/hɑːt/", word2: "hut", ipa2: "/hʌt/", soundGroupId: "map-t1-g03-central", contrastPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 5, explanation: "/ɑː/ kéo dài, /ʌ/ ngắn", status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "bath", ipa1: "/bɑːθ/", word2: "but", ipa2: "/bʌt/", soundGroupId: "map-t1-g03-central", contrastPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
];

export const SENTENCES_T1_G03: SentenceItemData[] = [
  { sentence: "My father had fun in the car.", soundGroupId: "map-t1-g03-central", targetWords: ["father", "fun", "car"], targetPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu chứa cả 2 âm trung tâm" },
  { sentence: "Tell me about the cup.", soundGroupId: "map-t1-g03-central", targetWords: ["about", "cup"], targetPhonemes: ["/ə/", "/ʌ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "My heart was cold but I had fun.", soundGroupId: "map-t1-g03-central", targetWords: ["heart", "but", "fun"], targetPhonemes: ["/ɑː/", "/ʌ/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 5: /ʊ/ & /uː/ (full/fool) - SAU NGẮN & SAU DÀI
// ============================================================================

export const WORDS_T1_G05_U_UH: WordItemData[] = [
  { word: "full", ipa: "/fʊl/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/ʊ/"], difficulty: 3, exampleSentence: "The glass is full.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ʊ/ ngắn lỏng" },
  { word: "fool", ipa: "/fuːl/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/uː/"], difficulty: 3, exampleSentence: "Don't be a fool.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/uː/ dài căng" },
  { word: "pull", ipa: "/pʊl/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/ʊ/"], difficulty: 3, exampleSentence: "Pull the door open.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "pool", ipa: "/puːl/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/uː/"], difficulty: 3, exampleSentence: "The pool is clean.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "look", ipa: "/lʊk/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/ʊ/"], difficulty: 3, exampleSentence: "Look at the sky.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "food", ipa: "/fuːd/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/uː/"], difficulty: 3, exampleSentence: "The food is delicious.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "book", ipa: "/bʊk/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/ʊ/"], difficulty: 3, exampleSentence: "I read a book.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "blue", ipa: "/bluː/", soundGroupId: "map-t1-g05-u-uh", targetPhonemes: ["/uː/"], difficulty: 4, exampleSentence: "The sky is blue.", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G05: MinimalPairData[] = [
  { word1: "full", ipa1: "/fʊl/", word2: "fool", ipa2: "/fuːl/", soundGroupId: "map-t1-g05-u-uh", contrastPhonemes: ["/ʊ/", "/uː/"], difficulty: 3, explanation: "/ʊ/ ngắn lỏng, /uː/ dài căng môi", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Cặp sau cổ điển" },
  { word1: "pull", ipa1: "/pʊl/", word2: "pool", ipa2: "/puːl/", soundGroupId: "map-t1-g05-u-uh", contrastPhonemes: ["/ʊ/", "/uː/"], difficulty: 3, explanation: "Chú ý độ dài", status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "look", ipa1: "/lʊk/", word2: "Luke", ipa2: "/luːk/", soundGroupId: "map-t1-g05-u-uh", contrastPhonemes: ["/ʊ/", "/uː/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "good", ipa1: "/ɡʊd/", word2: "food", ipa2: "/fuːd/", soundGroupId: "map-t1-g05-u-uh", contrastPhonemes: ["/ʊ/", "/uː/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
];

export const SENTENCES_T1_G05: SentenceItemData[] = [
  { sentence: "The fool pulled the full bucket.", soundGroupId: "map-t1-g05-u-uh", targetWords: ["fool", "pulled", "full"], targetPhonemes: ["/uː/", "/ʊ/", "/ʊ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu chứa cả 2 âm sau" },
  { sentence: "Look at the blue pool.", soundGroupId: "map-t1-g05-u-uh", targetWords: ["Look", "blue", "pool"], targetPhonemes: ["/ʊ/", "/uː/", "/uː/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "Good food in the book.", soundGroupId: "map-t1-g05-u-uh", targetWords: ["Good", "food", "book"], targetPhonemes: ["/ʊ/", "/uː/", "/ʊ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 6: /ɜː/ (bird/word) - ÂM GIỮA ĐẶC BIỆT (KHÔNG CẶP)
// ============================================================================

export const WORDS_T1_G06_ER: WordItemData[] = [
  { word: "bird", ipa: "/bɜːd/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 6, exampleSentence: "The bird is singing.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ɜː/ không có trong tiếng Việt" },
  { word: "word", ipa: "/wɜːd/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 5, exampleSentence: "Say each word clearly.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "nurse", ipa: "/nɜːs/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 6, exampleSentence: "The nurse is kind.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "girl", ipa: "/ɡɜːl/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 5, exampleSentence: "The girl is happy.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "work", ipa: "/wɜːk/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 5, exampleSentence: "I go to work early.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "learn", ipa: "/lɜːn/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 6, exampleSentence: "We learn English.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "turn", ipa: "/tɜːn/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 5, exampleSentence: "Turn left at the corner.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "her", ipa: "/hɜː/", soundGroupId: "map-t1-g06-er", targetPhonemes: ["/ɜː/"], difficulty: 4, exampleSentence: "Give her the book.", status: "ACTIVE", sourceType: "FREE_API" },
];

// g06 /ɜː/ không có cặp → MINIMAL_PAIRS_T1_G06 rỗng
export const MINIMAL_PAIRS_T1_G06: MinimalPairData[] = [];

export const SENTENCES_T1_G06: SentenceItemData[] = [
  { sentence: "The nurse learns to work with the bird.", soundGroupId: "map-t1-g06-er", targetWords: ["nurse", "learns", "work", "bird"], targetPhonemes: ["/ɜː/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Nhiều từ /ɜː/ trong 1 câu" },
  { sentence: "The girl turned to her word.", soundGroupId: "map-t1-g06-er", targetWords: ["girl", "turned", "her", "word"], targetPhonemes: ["/ɜː/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "Learn to work hard.", soundGroupId: "map-t1-g06-er", targetWords: ["Learn", "work"], targetPhonemes: ["/ɜː/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 7: /eɪ/ & /aɪ/ (day/die) - KẾT THÚC BẰNG /ɪ/
// ============================================================================

export const WORDS_T1_G07_EI_AI: WordItemData[] = [
  { word: "day", ipa: "/deɪ/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/eɪ/"], difficulty: 3, exampleSentence: "Have a nice day.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/eɪ/ trượt từ /e/ lên /ɪ/" },
  { word: "die", ipa: "/daɪ/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/aɪ/"], difficulty: 3, exampleSentence: "The plant will die.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/aɪ/ trượt từ /a/ lên /ɪ/" },
  { word: "make", ipa: "/meɪk/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/eɪ/"], difficulty: 3, exampleSentence: "Make a cake.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "my", ipa: "/maɪ/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/aɪ/"], difficulty: 2, exampleSentence: "My book is here.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "they", ipa: "/ðeɪ/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/eɪ/"], difficulty: 4, exampleSentence: "They are friends.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "thigh", ipa: "/θaɪ/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/aɪ/"], difficulty: 5, exampleSentence: "My thigh hurts.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "name", ipa: "/neɪm/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/eɪ/"], difficulty: 3, exampleSentence: "What is your name?", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "time", ipa: "/taɪm/", soundGroupId: "map-t1-g07-ei-ai", targetPhonemes: ["/aɪ/"], difficulty: 3, exampleSentence: "What time is it?", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G07: MinimalPairData[] = [
  { word1: "day", ipa1: "/deɪ/", word2: "die", ipa2: "/daɪ/", soundGroupId: "map-t1-g07-ei-ai", contrastPhonemes: ["/eɪ/", "/aɪ/"], difficulty: 3, explanation: "/eɪ/ từ /e/, /aɪ/ từ /a/ — cùng kết /ɪ/", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Cặp diphthong cơ bản" },
  { word1: "make", ipa1: "/meɪk/", word2: "Mike", ipa2: "/maɪk/", soundGroupId: "map-t1-g07-ei-ai", contrastPhonemes: ["/eɪ/", "/aɪ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "they", ipa1: "/ðeɪ/", word2: "thigh", ipa2: "/θaɪ/", soundGroupId: "map-t1-g07-ei-ai", contrastPhonemes: ["/eɪ/", "/aɪ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "name", ipa1: "/neɪm/", word2: "time", ipa2: "/taɪm/", soundGroupId: "map-t1-g07-ei-ai", contrastPhonemes: ["/eɪ/", "/aɪ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
];

export const SENTENCES_T1_G07: SentenceItemData[] = [
  { sentence: "Make my day with your name.", soundGroupId: "map-t1-g07-ei-ai", targetWords: ["Make", "my", "day", "name"], targetPhonemes: ["/eɪ/", "/aɪ/", "/eɪ/", "/eɪ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu chứa cả 2 diphthong" },
  { sentence: "They had a good time.", soundGroupId: "map-t1-g07-ei-ai", targetWords: ["They", "time"], targetPhonemes: ["/eɪ/", "/aɪ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "My thigh hurts today.", soundGroupId: "map-t1-g07-ei-ai", targetWords: ["My", "thigh"], targetPhonemes: ["/aɪ/", "/aɪ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 8: /ɔɪ/ & /aʊ/ (boy/now) - /ɔɪ/ LÊN, /aʊ/ XUỐNG-LÊN
// ============================================================================

export const WORDS_T1_G08_OI_AU: WordItemData[] = [
  { word: "boy", ipa: "/bɔɪ/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/ɔɪ/"], difficulty: 4, exampleSentence: "The boy is tall.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ɔɪ/ trượt từ /ɔ/ lên /ɪ/" },
  { word: "now", ipa: "/naʊ/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/aʊ/"], difficulty: 3, exampleSentence: "Do it now.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/aʊ/ trượt từ /a/ tới /ʊ/" },
  { word: "coin", ipa: "/kɔɪn/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/ɔɪ/"], difficulty: 4, exampleSentence: "I have a coin.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "house", ipa: "/haʊs/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/aʊ/"], difficulty: 3, exampleSentence: "My house is big.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "voice", ipa: "/vɔɪs/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/ɔɪ/"], difficulty: 5, exampleSentence: "Your voice is nice.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "mouse", ipa: "/maʊs/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/aʊ/"], difficulty: 3, exampleSentence: "The mouse is small.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "choice", ipa: "/tʃɔɪs/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/ɔɪ/"], difficulty: 5, exampleSentence: "Make your choice.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "out", ipa: "/aʊt/", soundGroupId: "map-t1-g08-oi-au", targetPhonemes: ["/aʊ/"], difficulty: 3, exampleSentence: "Go out and play.", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G08: MinimalPairData[] = [
  { word1: "boy", ipa1: "/bɔɪ/", word2: "bow", ipa2: "/baʊ/", soundGroupId: "map-t1-g08-oi-au", contrastPhonemes: ["/ɔɪ/", "/aʊ/"], difficulty: 5, explanation: "/ɔɪ/ kết /ɪ/, /aʊ/ kết /ʊ/ — hướng khác nhau", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Cặp diphthong khác hướng" },
  { word1: "coin", ipa1: "/kɔɪn/", word2: "count", ipa2: "/kaʊnt/", soundGroupId: "map-t1-g08-oi-au", contrastPhonemes: ["/ɔɪ/", "/aʊ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "voice", ipa1: "/vɔɪs/", word2: "vow", ipa2: "/vaʊ/", soundGroupId: "map-t1-g08-oi-au", contrastPhonemes: ["/ɔɪ/", "/aʊ/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "choice", ipa1: "/tʃɔɪs/", word2: "chouse", ipa2: "/tʃaʊs/", soundGroupId: "map-t1-g08-oi-au", contrastPhonemes: ["/ɔɪ/", "/aʊ/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "chouse là từ hiếm, dùng minh họa cặp" },
];

export const SENTENCES_T1_G08: SentenceItemData[] = [
  { sentence: "The boy found a coin in the house.", soundGroupId: "map-t1-g08-oi-au", targetWords: ["boy", "coin", "house"], targetPhonemes: ["/ɔɪ/", "/ɔɪ/", "/aʊ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu chứa cả 2 diphthong" },
  { sentence: "The mouse ran out of the house.", soundGroupId: "map-t1-g08-oi-au", targetWords: ["mouse", "out", "house"], targetPhonemes: ["/aʊ/", "/aʊ/", "/aʊ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "Make your choice with your voice.", soundGroupId: "map-t1-g08-oi-au", targetWords: ["choice", "voice"], targetPhonemes: ["/ɔɪ/", "/ɔɪ/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 9: /əʊ/ & /eə/ (go/air) - NHÓM TRUNG TÂM
// ============================================================================

export const WORDS_T1_G09_OU_EA: WordItemData[] = [
  { word: "go", ipa: "/ɡəʊ/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/əʊ/"], difficulty: 3, exampleSentence: "Let's go home.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/əʊ/ trượt từ schwa tới /ʊ/" },
  { word: "air", ipa: "/eə/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/eə/"], difficulty: 4, exampleSentence: "The air is fresh.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/eə/ trượt từ /e/ tới schwa" },
  { word: "home", ipa: "/həʊm/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/əʊ/"], difficulty: 3, exampleSentence: "I go home.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "care", ipa: "/keə/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/eə/"], difficulty: 4, exampleSentence: "Take care of yourself.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "know", ipa: "/nəʊ/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/əʊ/"], difficulty: 3, exampleSentence: "I know the answer.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "there", ipa: "/ðeə/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/eə/"], difficulty: 4, exampleSentence: "He is there.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "show", ipa: "/ʃəʊ/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/əʊ/"], difficulty: 4, exampleSentence: "Show me the way.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "where", ipa: "/weə/", soundGroupId: "map-t1-g09-ou-ea", targetPhonemes: ["/eə/"], difficulty: 4, exampleSentence: "Where are you?", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G09: MinimalPairData[] = [
  { word1: "go", ipa1: "/ɡəʊ/", word2: "gear", ipa2: "/ɡɪə/", soundGroupId: "map-t1-g09-ou-ea", contrastPhonemes: ["/əʊ/", "/ɪə/"], difficulty: 6, explanation: "Cặp diphthong trung tâm", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Phân biệt 2 diphthong kết schwa" },
  { word1: "home", ipa1: "/həʊm/", word2: "hair", ipa2: "/heə/", soundGroupId: "map-t1-g09-ou-ea", contrastPhonemes: ["/əʊ/", "/eə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "know", ipa1: "/nəʊ/", word2: "near", ipa2: "/nɪə/", soundGroupId: "map-t1-g09-ou-ea", contrastPhonemes: ["/əʊ/", "/ɪə/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "show", ipa1: "/ʃəʊ/", word2: "share", ipa2: "/ʃeə/", soundGroupId: "map-t1-g09-ou-ea", contrastPhonemes: ["/əʊ/", "/eə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
];

export const SENTENCES_T1_G09: SentenceItemData[] = [
  { sentence: "Go home and take care.", soundGroupId: "map-t1-g09-ou-ea", targetWords: ["Go", "home", "care"], targetPhonemes: ["/əʊ/", "/əʊ/", "/eə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu chứa cả 2 diphthong" },
  { sentence: "I know where he is there.", soundGroupId: "map-t1-g09-ou-ea", targetWords: ["know", "where", "there"], targetPhonemes: ["/əʊ/", "/eə/", "/eə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "Show me the way home.", soundGroupId: "map-t1-g09-ou-ea", targetWords: ["Show", "home"], targetPhonemes: ["/əʊ/", "/əʊ/"], difficulty: 4, status: "ACTIVE", sourceType: "MANUAL" },
];

// ============================================================================
// TOPIC 1 - NHÓM 10: /ɪə/ & /ʊə/ (ear/tour) - KẾT THÚC BẰNG SCHWA
// ============================================================================

export const WORDS_T1_G10_IA_UA: WordItemData[] = [
  { word: "ear", ipa: "/ɪə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ɪə/"], difficulty: 4, exampleSentence: "I have an ear ache.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ɪə/ trượt từ /ɪ/ tới schwa" },
  { word: "tour", ipa: "/tʊə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ʊə/"], difficulty: 6, exampleSentence: "The tour was great.", status: "ACTIVE", sourceType: "FREE_API", reviewNote: "/ʊə/ trượt từ /ʊ/ tới schwa" },
  { word: "here", ipa: "/hɪə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ɪə/"], difficulty: 4, exampleSentence: "Come here.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "poor", ipa: "/pʊə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ʊə/"], difficulty: 5, exampleSentence: "The poor man needs help.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "fear", ipa: "/fɪə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ɪə/"], difficulty: 4, exampleSentence: "Don't fear the dark.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "sure", ipa: "/ʃʊə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ʊə/"], difficulty: 5, exampleSentence: "I am sure.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "near", ipa: "/nɪə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ɪə/"], difficulty: 4, exampleSentence: "The shop is near.", status: "ACTIVE", sourceType: "FREE_API" },
  { word: "pure", ipa: "/pjʊə/", soundGroupId: "map-t1-g10-ia-ua", targetPhonemes: ["/ʊə/"], difficulty: 6, exampleSentence: "The water is pure.", status: "ACTIVE", sourceType: "FREE_API" },
];

export const MINIMAL_PAIRS_T1_G10: MinimalPairData[] = [
  { word1: "ear", ipa1: "/ɪə/", word2: "tour", ipa2: "/tʊə/", soundGroupId: "map-t1-g10-ia-ua", contrastPhonemes: ["/ɪə/", "/ʊə/"], difficulty: 5, explanation: "/ɪə/ từ /ɪ/, /ʊə/ từ /ʊ/ — cùng kết schwa", status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Cặp diphthong kết schwa" },
  { word1: "here", ipa1: "/hɪə/", word2: "poor", ipa2: "/pʊə/", soundGroupId: "map-t1-g10-ia-ua", contrastPhonemes: ["/ɪə/", "/ʊə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "fear", ipa1: "/fɪə/", word2: "sure", ipa2: "/ʃʊə/", soundGroupId: "map-t1-g10-ia-ua", contrastPhonemes: ["/ɪə/", "/ʊə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL" },
  { word1: "near", ipa1: "/nɪə/", word2: "pure", ipa2: "/pjʊə/", soundGroupId: "map-t1-g10-ia-ua", contrastPhonemes: ["/ɪə/", "/ʊə/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
];

export const SENTENCES_T1_G10: SentenceItemData[] = [
  { sentence: "Come here near my ear.", soundGroupId: "map-t1-g10-ia-ua", targetWords: ["here", "near", "ear"], targetPhonemes: ["/ɪə/", "/ɪə/", "/ɪə/"], difficulty: 5, status: "ACTIVE", sourceType: "MANUAL", reviewNote: "Câu nhiều /ɪə/" },
  { sentence: "The poor man is sure of the tour.", soundGroupId: "map-t1-g10-ia-ua", targetWords: ["poor", "sure", "tour"], targetPhonemes: ["/ʊə/", "/ʊə/", "/ʊə/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
  { sentence: "Don't fear the pure air.", soundGroupId: "map-t1-g10-ia-ua", targetWords: ["fear", "pure"], targetPhonemes: ["/ɪə/", "/ʊə/"], difficulty: 6, status: "ACTIVE", sourceType: "MANUAL" },
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
  "map-t1-g03-central": {
    words: WORDS_T1_G03_CENTRAL,
    minimalPairs: MINIMAL_PAIRS_T1_G03,
    sentences: SENTENCES_T1_G03,
  },
  "map-t1-g05-u-uh": {
    words: WORDS_T1_G05_U_UH,
    minimalPairs: MINIMAL_PAIRS_T1_G05,
    sentences: SENTENCES_T1_G05,
  },
  "map-t1-g06-er": {
    words: WORDS_T1_G06_ER,
    minimalPairs: MINIMAL_PAIRS_T1_G06,
    sentences: SENTENCES_T1_G06,
  },
  "map-t1-g07-ei-ai": {
    words: WORDS_T1_G07_EI_AI,
    minimalPairs: MINIMAL_PAIRS_T1_G07,
    sentences: SENTENCES_T1_G07,
  },
  "map-t1-g08-oi-au": {
    words: WORDS_T1_G08_OI_AU,
    minimalPairs: MINIMAL_PAIRS_T1_G08,
    sentences: SENTENCES_T1_G08,
  },
  "map-t1-g09-ou-ea": {
    words: WORDS_T1_G09_OU_EA,
    minimalPairs: MINIMAL_PAIRS_T1_G09,
    sentences: SENTENCES_T1_G09,
  },
  "map-t1-g10-ia-ua": {
    words: WORDS_T1_G10_IA_UA,
    minimalPairs: MINIMAL_PAIRS_T1_G10,
    sentences: SENTENCES_T1_G10,
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
