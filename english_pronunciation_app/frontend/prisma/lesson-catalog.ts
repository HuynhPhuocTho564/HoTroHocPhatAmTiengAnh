/**
 * LESSON CATALOG - Nguồn cấu hình duy nhất cho 4 chủ đề, 25 nhóm âm, 100 bài
 * 
 * Cấu trúc:
 * - 4 Topics (Chủ đề)
 * - 25 Sound Groups (Nhóm âm)
 * - 4 Exercise Modes mỗi nhóm = 100 bài
 * 
 * Nguyên tắc:
 * - Không code 100 bài thủ công
 * - Seed từ catalog này -> generate Exercise/Question
 * - Status: ACTIVE (có dữ liệu sạch), DRAFT (chưa đủ câu hỏi), LOCKED (chưa sẵn sàng)
 */

export type TopicDefinition = {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  totalSoundGroups: number;
  color: string; // For UI theming
};

export type PhonemeDefinition = {
  ipa: string;
  type: "MONOPHTHONG" | "DIPHTHONG" | "CONSONANT";
  description: string;
  exampleWords: string[];
};

export type SoundGroupDefinition = {
  id: string;
  topicId: string;
  name: string;
  description: string;
  orderIndex: number;
  targetPhonemes: string[]; // IPA symbols
  difficulty: number; // 1-10
  notes: string;
};

export type ExerciseModeDefinition = {
  id: string;
  name: string;
  description: string;
  questionTypeId: string;
  orderIndex: number;
  icon: string;
};

// ============================================================================
// TOPICS (4 chủ đề)
// ============================================================================

export const TOPICS: TopicDefinition[] = [
  {
    id: "topic-1-monophthongs",
    name: "Nguyên âm đơn",
    description: "Nền tảng phát âm - 6 nhóm nguyên âm đơn cơ bản",
    orderIndex: 1,
    totalSoundGroups: 6,
    color: "blue",
  },
  {
    id: "topic-2-diphthongs",
    name: "Nguyên âm đôi",
    description: "Âm trượt - 4 nhóm nguyên âm đôi",
    orderIndex: 2,
    totalSoundGroups: 4,
    color: "purple",
  },
  {
    id: "topic-3-consonants",
    name: "Phụ âm",
    description: "Khối lượng lớn - 11 nhóm phụ âm",
    orderIndex: 3,
    totalSoundGroups: 11,
    color: "orange",
  },
  {
    id: "topic-4-hard-pairs",
    name: "Minimal Pairs khó",
    description: "Tổng hợp thực chiến - 4 nhóm cặp âm dễ nhầm nhất",
    orderIndex: 4,
    totalSoundGroups: 4,
    color: "red",
  },
];

// ============================================================================
// EXERCISE MODES (4 chế độ cho mỗi nhóm)
// ============================================================================

export const EXERCISE_MODES: ExerciseModeDefinition[] = [
  {
    id: "listen_choose",
    name: "Luyện tai",
    description: "Nghe và chọn IPA/từ đúng",
    questionTypeId: "qtype-1-mc",
    orderIndex: 1,
    icon: "👂",
  },
  {
    id: "speak_word",
    name: "Luyện miệng",
    description: "Đọc từ đơn theo IPA",
    questionTypeId: "qtype-2-voice",
    orderIndex: 2,
    icon: "🗣️",
  },
  {
    id: "speak_minimal_pair",
    name: "Thử thách kép",
    description: "Đọc cặp từ dễ nhầm lẫn",
    questionTypeId: "qtype-3-minimal-pairs",
    orderIndex: 3,
    icon: "⚔️",
  },
  {
    id: "speak_sentence",
    name: "Thực chiến",
    description: "Đọc câu có chứa âm mục tiêu",
    questionTypeId: "qtype-2-voice", // Same as speak_word but different mode in contentJson
    orderIndex: 4,
    icon: "🎯",
  },
];

// ============================================================================
// SOUND GROUPS (25 nhóm âm)
// ============================================================================

export const SOUND_GROUPS: SoundGroupDefinition[] = [
  // ============================================================================
  // TOPIC 1: NGUYÊN ÂM ĐƠN (6 nhóm, 24 bài)
  // ============================================================================
  {
    id: "map-t1-g01-i-ih",
    topicId: "topic-1-monophthongs",
    name: "/iː/ & /ɪ/",
    description: "Dài & ngắn phía trước (ship/sheep)",
    orderIndex: 1,
    targetPhonemes: ["/iː/", "/ɪ/"],
    difficulty: 3,
    notes: "Cặp cơ bản nhất, người Việt hay gộp thành một âm",
  },
  {
    id: "map-t1-g02-e-ae",
    topicId: "topic-1-monophthongs",
    name: "/e/ & /æ/",
    description: "Hẹp & mở phía trước (bed/bad)",
    orderIndex: 2,
    targetPhonemes: ["/e/", "/æ/"],
    difficulty: 4,
    notes: "Người Việt hay phát âm /æ/ giống /e/",
  },
  {
    id: "map-t1-g03-central",
    topicId: "topic-1-monophthongs",
    name: "/ɑː/ & /ʌ/ & /ə/",
    description: "Nhóm trung tâm (father/fun/about)",
    orderIndex: 3,
    targetPhonemes: ["/ɑː/", "/ʌ/", "/ə/"],
    difficulty: 5,
    notes: "Ba âm ở vị trí trung tâm, khác nhau về độ mở và trọng âm",
  },
  {
    id: "map-t1-g04-o-oh",
    topicId: "topic-1-monophthongs",
    name: "/ɒ/ & /ɔː/",
    description: "Tròn ngắn & tròn dài (hot/horse)",
    orderIndex: 4,
    targetPhonemes: ["/ɒ/", "/ɔː/"],
    difficulty: 4,
    notes: "Âm tròn môi, khác nhau về độ dài",
  },
  {
    id: "map-t1-g05-u-uh",
    topicId: "topic-1-monophthongs",
    name: "/ʊ/ & /uː/",
    description: "Sau ngắn & sau dài (full/fool)",
    orderIndex: 5,
    targetPhonemes: ["/ʊ/", "/uː/"],
    difficulty: 3,
    notes: "Cặp âm sau, người Việt thường phát âm tốt",
  },
  {
    id: "map-t1-g06-er",
    topicId: "topic-1-monophthongs",
    name: "/ɜː/",
    description: "Âm giữa đặc biệt (bird/word)",
    orderIndex: 6,
    targetPhonemes: ["/ɜː/"],
    difficulty: 6,
    notes: "Âm đặc biệt không có trong tiếng Việt, cần uốn lưỡi",
  },

  // ============================================================================
  // TOPIC 2: NGUYÊN ÂM ĐÔI (4 nhóm, 16 bài)
  // ============================================================================
  {
    id: "map-t2-g01-ei-ai",
    topicId: "topic-2-diphthongs",
    name: "/eɪ/ & /aɪ/",
    description: "Kết thúc bằng /ɪ/ (day/die)",
    orderIndex: 1,
    targetPhonemes: ["/eɪ/", "/aɪ/"],
    difficulty: 4,
    notes: "Hai âm trượt phổ biến, cần di chuyển miệng rõ ràng",
  },
  {
    id: "map-t2-g02-oi-au",
    topicId: "topic-2-diphthongs",
    name: "/ɔɪ/ & /aʊ/",
    description: "/ɔɪ/ lên, /aʊ/ xuống-lên (boy/now)",
    orderIndex: 2,
    targetPhonemes: ["/ɔɪ/", "/aʊ/"],
    difficulty: 5,
    notes: "Cần chú ý hướng di chuyển của âm",
  },
  {
    id: "map-t2-g03-ou-ea",
    topicId: "topic-2-diphthongs",
    name: "/əʊ/ & /eə/",
    description: "Nhóm trung tâm (go/air)",
    orderIndex: 3,
    targetPhonemes: ["/əʊ/", "/eə/"],
    difficulty: 6,
    notes: "Âm trượt từ schwa hoặc tới schwa",
  },
  {
    id: "map-t2-g04-ia-ua",
    topicId: "topic-2-diphthongs",
    name: "/ɪə/ & /ʊə/",
    description: "Kết thúc bằng schwa (ear/tour)",
    orderIndex: 4,
    targetPhonemes: ["/ɪə/", "/ʊə/"],
    difficulty: 7,
    notes: "Âm khó, ít gặp trong tiếng Anh hiện đại",
  },

  // ============================================================================
  // TOPIC 3: PHỤ ÂM (11 nhóm, 44 bài)
  // ============================================================================
  {
    id: "map-t3-g01-p-b",
    topicId: "topic-3-consonants",
    name: "/p/ & /b/",
    description: "Bilabial - hai môi (pen/ben)",
    orderIndex: 1,
    targetPhonemes: ["/p/", "/b/"],
    difficulty: 2,
    notes: "Cặp vô thanh/hữu thanh cơ bản",
  },
  {
    id: "map-t3-g02-t-d",
    topicId: "topic-3-consonants",
    name: "/t/ & /d/",
    description: "Alveolar tắc (tea/day)",
    orderIndex: 2,
    targetPhonemes: ["/t/", "/d/"],
    difficulty: 3,
    notes: "Người Việt hay nuốt /t/ /d/ cuối từ",
  },
  {
    id: "map-t3-g03-k-g",
    topicId: "topic-3-consonants",
    name: "/k/ & /g/",
    description: "Velar (cat/got)",
    orderIndex: 3,
    targetPhonemes: ["/k/", "/g/"],
    difficulty: 3,
    notes: "Âm từ vòm mềm, cần chú ý khi ở cuối từ",
  },
  {
    id: "map-t3-g04-f-v",
    topicId: "topic-3-consonants",
    name: "/f/ & /v/",
    description: "Labiodental (fan/van)",
    orderIndex: 4,
    targetPhonemes: ["/f/", "/v/"],
    difficulty: 4,
    notes: "Người Việt thường nhầm /v/ thành /w/",
  },
  {
    id: "map-t3-g05-s-z",
    topicId: "topic-3-consonants",
    name: "/s/ & /z/",
    description: "Alveolar xát (see/zoo)",
    orderIndex: 5,
    targetPhonemes: ["/s/", "/z/"],
    difficulty: 3,
    notes: "Cặp vô thanh/hữu thanh, /z/ ít gặp trong tiếng Việt",
  },
  {
    id: "map-t3-g06-sh-zh",
    topicId: "topic-3-consonants",
    name: "/ʃ/ & /ʒ/",
    description: "Palato-alveolar (ship/measure)",
    orderIndex: 6,
    targetPhonemes: ["/ʃ/", "/ʒ/"],
    difficulty: 5,
    notes: "/ʒ/ rất hiếm, chỉ có trong một số từ",
  },
  {
    id: "map-t3-g07-ch-j",
    topicId: "topic-3-consonants",
    name: "/tʃ/ & /dʒ/",
    description: "Affricate (chair/job)",
    orderIndex: 7,
    targetPhonemes: ["/tʃ/", "/dʒ/"],
    difficulty: 4,
    notes: "Âm kép, cần phát âm đầy đủ cả hai phần",
  },
  {
    id: "map-t3-g08-th-dh",
    topicId: "topic-3-consonants",
    name: "/θ/ & /ð/",
    description: "Dental - đặt lưỡi giữa răng (think/this)",
    orderIndex: 8,
    targetPhonemes: ["/θ/", "/ð/"],
    difficulty: 8,
    notes: "Âm khó nhất cho người Việt, không có trong tiếng Việt",
  },
  {
    id: "map-t3-g09-nasals",
    topicId: "topic-3-consonants",
    name: "/m/ & /n/ & /ŋ/",
    description: "Âm mũi (man/now/sing)",
    orderIndex: 9,
    targetPhonemes: ["/m/", "/n/", "/ŋ/"],
    difficulty: 3,
    notes: "/ŋ/ ở cuối từ, không được thêm /g/",
  },
  {
    id: "map-t3-g10-l-r",
    topicId: "topic-3-consonants",
    name: "/l/ & /r/",
    description: "Tiếp cận (light/right)",
    orderIndex: 10,
    targetPhonemes: ["/l/", "/r/"],
    difficulty: 7,
    notes: "Cặp khó nhất, /r/ cần uốn lưỡi, /l/ cần đặt lưỡi lên răng",
  },
  {
    id: "map-t3-g11-semi",
    topicId: "topic-3-consonants",
    name: "/w/ & /j/ & /h/",
    description: "Bán nguyên âm & âm hầu (we/yes/he)",
    orderIndex: 11,
    targetPhonemes: ["/w/", "/j/", "/h/"],
    difficulty: 4,
    notes: "Người Việt hay nhầm /w/ với /v/, /j/ với /dʒ/",
  },

  // ============================================================================
  // TOPIC 4: MINIMAL PAIRS KHÓ (4 nhóm, 16 bài) - TỔNG HỢP
  // ============================================================================
  {
    id: "map-t4-g01-front-vowel-mix",
    topicId: "topic-4-hard-pairs",
    name: "Nguyên âm phía trước dễ nhầm",
    description: "/iː/ vs /ɪ/ vs /e/ vs /æ/ (sheep/ship/shape/sharp)",
    orderIndex: 1,
    targetPhonemes: ["/iː/", "/ɪ/", "/e/", "/æ/"],
    difficulty: 9,
    notes: "Tổng hợp 4 nguyên âm phía trước, người Việt hay gộp thành 1-2 âm",
  },
  {
    id: "map-t4-g02-initial-confuse",
    topicId: "topic-4-hard-pairs",
    name: "Phụ âm đầu từ dễ nhầm",
    description: "/l/ vs /r/ vs /n/ (light/right/night)",
    orderIndex: 2,
    targetPhonemes: ["/l/", "/r/", "/n/"],
    difficulty: 9,
    notes: "Lỗi l/n và không uốn lưỡi /r/, rất phổ biến",
  },
  {
    id: "map-t4-g03-final-drop",
    topicId: "topic-4-hard-pairs",
    name: "Phụ âm cuối từ dễ bỏ",
    description: "final /p/ vs /b/, /t/ vs /d/, /k/ vs /g/ (cap/cab, cat/cad)",
    orderIndex: 3,
    targetPhonemes: ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/"],
    difficulty: 8,
    notes: "Người Việt hay nuốt phụ âm cuối, mất âm hữu thanh/vô thanh",
  },
  {
    id: "map-t4-g04-dental-sibilant",
    topicId: "topic-4-hard-pairs",
    name: "Âm răng & âm xát",
    description: "/θ/ vs /s/ vs /t/, /ð/ vs /z/ vs /d/ (think/sink, this/diss)",
    orderIndex: 4,
    targetPhonemes: ["/θ/", "/s/", "/t/", "/ð/", "/z/", "/d/"],
    difficulty: 10,
    notes: "Khó nhất - không có âm răng trong tiếng Việt",
  },
];

// ============================================================================
// PHONEMES (Danh sách IPA cần seed)
// ============================================================================

export const PHONEMES: PhonemeDefinition[] = [
  // Monophthongs
  { ipa: "/iː/", type: "MONOPHTHONG", description: "Nguyên âm dài trước cao", exampleWords: ["sheep", "see", "beat"] },
  { ipa: "/ɪ/", type: "MONOPHTHONG", description: "Nguyên âm ngắn trước cao", exampleWords: ["ship", "sit", "bit"] },
  { ipa: "/e/", type: "MONOPHTHONG", description: "Nguyên âm trước trung", exampleWords: ["bed", "pen", "red"] },
  { ipa: "/æ/", type: "MONOPHTHONG", description: "Nguyên âm trước thấp", exampleWords: ["bad", "pan", "rat"] },
  { ipa: "/ɑː/", type: "MONOPHTHONG", description: "Nguyên âm sau thấp dài", exampleWords: ["father", "car", "bar"] },
  { ipa: "/ʌ/", type: "MONOPHTHONG", description: "Nguyên âm trung ngắn", exampleWords: ["fun", "cup", "but"] },
  { ipa: "/ə/", type: "MONOPHTHONG", description: "Schwa - âm yếu", exampleWords: ["about", "sofa", "the"] },
  { ipa: "/ɒ/", type: "MONOPHTHONG", description: "Nguyên âm sau tròn ngắn", exampleWords: ["hot", "dog", "got"] },
  { ipa: "/ɔː/", type: "MONOPHTHONG", description: "Nguyên âm sau tròn dài", exampleWords: ["horse", "door", "law"] },
  { ipa: "/ʊ/", type: "MONOPHTHONG", description: "Nguyên âm sau cao ngắn", exampleWords: ["full", "put", "book"] },
  { ipa: "/uː/", type: "MONOPHTHONG", description: "Nguyên âm sau cao dài", exampleWords: ["fool", "food", "blue"] },
  { ipa: "/ɜː/", type: "MONOPHTHONG", description: "Nguyên âm trung cao dài", exampleWords: ["bird", "word", "nurse"] },

  // Diphthongs
  { ipa: "/eɪ/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["day", "make", "they"] },
  { ipa: "/aɪ/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["die", "my", "nice"] },
  { ipa: "/ɔɪ/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["boy", "coin", "voice"] },
  { ipa: "/aʊ/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["now", "house", "found"] },
  { ipa: "/əʊ/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["go", "home", "know"] },
  { ipa: "/eə/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["air", "care", "there"] },
  { ipa: "/ɪə/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["ear", "here", "fear"] },
  { ipa: "/ʊə/", type: "DIPHTHONG", description: "Nguyên âm đôi", exampleWords: ["tour", "poor", "sure"] },

  // Consonants
  { ipa: "/p/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["pen", "cup", "happy"] },
  { ipa: "/b/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["ben", "cab", "rabbit"] },
  { ipa: "/t/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["tea", "cat", "butter"] },
  { ipa: "/d/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["day", "cad", "ladder"] },
  { ipa: "/k/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["cat", "back", "school"] },
  { ipa: "/g/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["got", "bag", "foggy"] },
  { ipa: "/f/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["fan", "leaf", "photo"] },
  { ipa: "/v/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["van", "live", "very"] },
  { ipa: "/s/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["see", "ice", "miss"] },
  { ipa: "/z/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["zoo", "easy", "buzz"] },
  { ipa: "/ʃ/", type: "CONSONANT", description: "Phụ âm vô thanh", exampleWords: ["ship", "fish", "nation"] },
  { ipa: "/ʒ/", type: "CONSONANT", description: "Phụ âm hữu thanh", exampleWords: ["measure", "vision", "beige"] },
  { ipa: "/tʃ/", type: "CONSONANT", description: "Phụ âm kép vô thanh", exampleWords: ["chair", "match", "nature"] },
  { ipa: "/dʒ/", type: "CONSONANT", description: "Phụ âm kép hữu thanh", exampleWords: ["job", "age", "soldier"] },
  { ipa: "/θ/", type: "CONSONANT", description: "Phụ âm vô thanh răng", exampleWords: ["think", "path", "bath"] },
  { ipa: "/ð/", type: "CONSONANT", description: "Phụ âm hữu thanh răng", exampleWords: ["this", "bathe", "father"] },
  { ipa: "/m/", type: "CONSONANT", description: "Phụ âm mũi", exampleWords: ["man", "ham", "summer"] },
  { ipa: "/n/", type: "CONSONANT", description: "Phụ âm mũi", exampleWords: ["now", "sun", "funny"] },
  { ipa: "/ŋ/", type: "CONSONANT", description: "Phụ âm mũi", exampleWords: ["sing", "bank", "finger"] },
  { ipa: "/l/", type: "CONSONANT", description: "Phụ âm bên", exampleWords: ["light", "fall", "hello"] },
  { ipa: "/r/", type: "CONSONANT", description: "Phụ âm tiếp cận", exampleWords: ["right", "car", "carry"] },
  { ipa: "/w/", type: "CONSONANT", description: "Bán nguyên âm", exampleWords: ["we", "away", "queen"] },
  { ipa: "/j/", type: "CONSONANT", description: "Bán nguyên âm", exampleWords: ["yes", "use", "billion"] },
  { ipa: "/h/", type: "CONSONANT", description: "Âm hầu", exampleWords: ["he", "hot", "ahead"] },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTopicById(id: string): TopicDefinition | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function getSoundGroupsByTopic(topicId: string): SoundGroupDefinition[] {
  return SOUND_GROUPS.filter((sg) => sg.topicId === topicId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getAllSoundGroups(): SoundGroupDefinition[] {
  return SOUND_GROUPS.sort((a, b) => {
    const topicA = TOPICS.find((t) => t.id === a.topicId);
    const topicB = TOPICS.find((t) => t.id === b.topicId);
    if (topicA && topicB && topicA.orderIndex !== topicB.orderIndex) {
      return topicA.orderIndex - topicB.orderIndex;
    }
    return a.orderIndex - b.orderIndex;
  });
}

export function getPhonemeByIpa(ipa: string): PhonemeDefinition | undefined {
  return PHONEMES.find((p) => p.ipa === ipa);
}

// Tổng số bài = 25 nhóm × 4 mode = 100 bài
export const TOTAL_LESSONS = SOUND_GROUPS.length * EXERCISE_MODES.length;

console.log(`📚 Lesson Catalog loaded:`);
console.log(`   - ${TOPICS.length} Topics`);
console.log(`   - ${SOUND_GROUPS.length} Sound Groups`);
console.log(`   - ${EXERCISE_MODES.length} Exercise Modes per group`);
console.log(`   - ${TOTAL_LESSONS} Total Lessons`);
console.log(`   - ${PHONEMES.length} Phonemes`);
