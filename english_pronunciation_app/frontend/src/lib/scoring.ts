export type SubmitAnswerInput = {
  questionId: string;
  selectedOptionId?: string | null;
  selectedText?: string | null;
  transcript?: string | null;
  audioUrl?: string | null;
  timeSpent?: number | null;
};

export type ScoringQuestion = {
  id: string;
  answer: string;
  score: number;
  type: {
    id: string;
    name: string;
  };
  acceptedAnswers?: string[] | null; // v2 Mode B: multi-answer (g02 weak-forms contraction)
  options: Array<{
    id: string;
    content: string;
  }>;
};

export type QuestionScoreResult = {
  questionId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  accuracyScore: number | null;
  feedback: string;
  selectedOptionId: string | null;
  transcript: string | null;
  audioUrl: string | null;
  timeSpent: number | null;
};

export type ExerciseRating = "NEEDS_PRACTICE" | "PASS" | "GOOD" | "EXCELLENT";

export function normalizeAnswerText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeAnswerText(value).split(" ").filter(Boolean);
}

export function calculateWordOverlapAccuracy(expected: string, actual: string) {
  const expectedTokens = tokenize(expected);
  const actualTokens = tokenize(actual);

  if (expectedTokens.length === 0 || actualTokens.length === 0) {
    return 0;
  }

  const remainingActual = [...actualTokens];
  let matches = 0;

  for (const expectedToken of expectedTokens) {
    const matchIndex = remainingActual.indexOf(expectedToken);
    if (matchIndex >= 0) {
      matches += 1;
      remainingActual.splice(matchIndex, 1);
    }
  }

  return Math.round((matches / expectedTokens.length) * 100);
}

function scoreMultipleChoice(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  const selectedOption = answer.selectedOptionId
    ? question.options.find((option) => option.id === answer.selectedOptionId)
    : null;
  const selectedText = selectedOption?.content ?? answer.selectedText ?? "";

  // So sánh đáp án. Hai nhánh:
  // 1. Exact string match — cho IPA phoneme answer (vd /iː/ vs /ɪ/ khác nhau nguyên văn).
  // 2. Normalized match — cho word answer (ship/Sheep/Ship! → "ship" bằng nhau).
  //
  // BUG được sửa: normalizeAnswerText strip ký tự non-ASCII → nhiều IPA thành "" (vd /ɑː/&/ʌ/&/ə/
  // cả 3 → ""). Nếu chỉ dùng normalized match → bấm nút nào cũng đúng (cả 3 = "").
  // Giải pháp: nếu CẢ HAI normalize thành rỗng → bắt buộc exact-match (normalized vô nghĩa).
  // Nếu ít nhất 1 còn nội dung ASCII → normalized match hợp lệ (word mode).
  const normalizedSelected = normalizeAnswerText(selectedText);
  const normalizedAnswer = normalizeAnswerText(question.answer);
  const isCorrect =
    selectedText === question.answer ||
    (normalizedSelected.length > 0 && normalizedAnswer.length > 0 && normalizedSelected === normalizedAnswer);

  return {
    questionId: question.id,
    isCorrect,
    score: isCorrect ? question.score : 0,
    maxScore: question.score,
    accuracyScore: null,
    feedback: isCorrect ? "Đúng" : "Chưa đúng",
    selectedOptionId: answer.selectedOptionId ?? null,
    transcript: answer.transcript ?? null,
    audioUrl: answer.audioUrl ?? null,
    timeSpent: answer.timeSpent ?? null,
  };
}

function scoreVoice(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  const transcript = answer.transcript ?? "";
  // v2 Mode B multi-answer: max overlap across [answer, ...acceptedAnswers]
  const candidates =
    question.acceptedAnswers && question.acceptedAnswers.length > 0
      ? [question.answer, ...question.acceptedAnswers]
      : [question.answer];
  const accuracyScore = Math.max(...candidates.map((c) => calculateWordOverlapAccuracy(c, transcript)));
  const isCorrect = accuracyScore >= 80;
  const score = Math.round((question.score * accuracyScore) / 100);

  return {
    questionId: question.id,
    isCorrect,
    score,
    maxScore: question.score,
    accuracyScore,
    feedback: isCorrect ? "Phát âm gần đúng mục tiêu" : "Cần luyện lại từ/câu mục tiêu",
    selectedOptionId: answer.selectedOptionId ?? null,
    transcript: answer.transcript ?? null,
    audioUrl: answer.audioUrl ?? null,
    timeSpent: answer.timeSpent ?? null,
  };
}

// === SP4 Mode A: CĐ4 scoring helpers ===

// DRY: build QuestionScoreResult 7 field (verify type scoring.ts:24-35)
function buildResult(
  question: ScoringQuestion,
  answer: SubmitAnswerInput,
  isCorrect: boolean,
  feedback: string,
): QuestionScoreResult {
  return {
    questionId: question.id,
    isCorrect,
    score: isCorrect ? question.score : 0,
    maxScore: question.score,
    accuracyScore: isCorrect ? 100 : 0,
    feedback,
    selectedOptionId: answer.selectedOptionId ?? null,
    transcript: answer.transcript ?? null,
    audioUrl: answer.audioUrl ?? null,
    timeSpent: answer.timeSpent ?? null,
  };
}

// qtype-4-tap-stress: answer = String(stressIndex); chọn option theo index
function scoreTapStress(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  const idx = question.options.findIndex((o) => o.id === answer.selectedOptionId);
  const isCorrect = idx >= 0 && idx === Number(question.answer);
  const correctSyllable = question.options[Number(question.answer)]?.content ?? "?";
  return buildResult(
    question,
    answer,
    isCorrect,
    isCorrect ? "Chọn đúng âm tiết nhấn" : `Đáp án: ${correctSyllable} (âm tiết ${Number(question.answer) + 1})`,
  );
}

// qtype-5/6 (choose-weak/choose-linking): answer = "to,the" comma-join; selectedText = join
function scoreMultiSelect(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  const expected = new Set(question.answer.split(",").map(normalizeAnswerText).filter(Boolean));
  const selected = new Set((answer.selectedText ?? "").split(",").map(normalizeAnswerText).filter(Boolean));
  const isCorrect =
    expected.size === selected.size && [...expected].every((x) => selected.has(x));
  return buildResult(question, answer, isCorrect, isCorrect ? "Chọn đúng" : `Đáp án: ${question.answer}`);
}

// qtype-7 (choose-assimilation): answer = "didʒu" IPA; chọn 1 option — exact (không normalize, giữ ʒ)
function scoreSingleSelect(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  const selectedText =
    question.options.find((o) => o.id === answer.selectedOptionId)?.content ?? answer.selectedText ?? "";
  const isCorrect = selectedText === question.answer;
  return buildResult(
    question,
    answer,
    isCorrect,
    isCorrect ? "Chọn đúng phát âm biến âm" : `Đáp án: ${question.answer}`,
  );
}

export function scoreQuestion(question: ScoringQuestion, answer: SubmitAnswerInput): QuestionScoreResult {
  if (question.type.id === "qtype-1-mc") {
    return scoreMultipleChoice(question, answer);
  }
  if (question.type.id === "qtype-4-tap-stress") return scoreTapStress(question, answer);
  if (question.type.id === "qtype-5-choose-weak") return scoreMultiSelect(question, answer);
  if (question.type.id === "qtype-6-choose-linking") return scoreMultiSelect(question, answer);
  if (question.type.id === "qtype-7-choose-assimilation") return scoreSingleSelect(question, answer);

  return scoreVoice(question, answer);
}

export function calculateExerciseScore(questionResults: QuestionScoreResult[]) {
  const maxScore = questionResults.reduce((total, result) => total + result.maxScore, 0);
  const rawScore = questionResults.reduce((total, result) => total + result.score, 0);
  const exerciseScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
  const correctAnswers = questionResults.filter((result) => result.isCorrect).length;

  return {
    rawScore,
    maxScore,
    exerciseScore,
    correctAnswers,
  };
}

export function getExerciseRating(exerciseScore: number): ExerciseRating {
  if (exerciseScore >= 90) return "EXCELLENT";
  if (exerciseScore >= 80) return "GOOD";
  if (exerciseScore >= 70) return "PASS";
  return "NEEDS_PRACTICE";
}

export function isExerciseCompleted(exerciseScore: number) {
  return exerciseScore >= 70;
}
