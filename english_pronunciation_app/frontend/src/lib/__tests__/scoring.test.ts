import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateExerciseScore,
  getExerciseRating,
  isExerciseCompleted,
  normalizeAnswerText,
  scoreQuestion,
  type ScoringQuestion,
} from "../scoring";

function makeQuestion(overrides: Partial<ScoringQuestion> = {}): ScoringQuestion {
  return {
    id: "question-1",
    answer: "ship",
    score: 10,
    type: {
      id: "qtype-1-mc",
      name: "Multiple choice",
    },
    options: [
      { id: "option-correct", content: "ship" },
      { id: "option-wrong", content: "sheep" },
    ],
    ...overrides,
  };
}

test("normalizeAnswerText removes punctuation, case, and extra spaces", () => {
  assert.equal(normalizeAnswerText("  Ship, please!  "), "ship please");
});

test("scoreQuestion gives full score for a correct multiple-choice option", () => {
  const result = scoreQuestion(makeQuestion(), {
    questionId: "question-1",
    selectedOptionId: "option-correct",
    timeSpent: 12,
  });

  assert.equal(result.isCorrect, true);
  assert.equal(result.score, 10);
  assert.equal(result.maxScore, 10);
  assert.equal(result.accuracyScore, null);
  assert.equal(result.selectedOptionId, "option-correct");
  assert.equal(result.timeSpent, 12);
});

test("scoreQuestion gives zero score for an incorrect multiple-choice option", () => {
  const result = scoreQuestion(makeQuestion(), {
    questionId: "question-1",
    selectedOptionId: "option-wrong",
  });

  assert.equal(result.isCorrect, false);
  assert.equal(result.score, 0);
});

test("scoreQuestion scores voice answers by word-overlap accuracy", () => {
  const question = makeQuestion({
    answer: "ship sheep",
    score: 20,
    type: {
      id: "qtype-voice",
      name: "Voice pronunciation",
    },
  });

  const partial = scoreQuestion(question, {
    questionId: "question-1",
    transcript: "ship",
  });
  const full = scoreQuestion(question, {
    questionId: "question-1",
    transcript: "ship sheep",
  });

  assert.equal(partial.accuracyScore, 50);
  assert.equal(partial.score, 10);
  assert.equal(partial.isCorrect, false);
  assert.equal(full.accuracyScore, 100);
  assert.equal(full.score, 20);
  assert.equal(full.isCorrect, true);
});

test("calculateExerciseScore summarizes raw score, percentage, and correct answers", () => {
  const question = makeQuestion();
  const correct = scoreQuestion(question, {
    questionId: "question-1",
    selectedOptionId: "option-correct",
  });
  const wrong = scoreQuestion(
    makeQuestion({
      id: "question-2",
      score: 30,
    }),
    {
      questionId: "question-2",
      selectedOptionId: "option-wrong",
    },
  );

  const summary = calculateExerciseScore([correct, wrong]);

  assert.deepEqual(summary, {
    rawScore: 10,
    maxScore: 40,
    exerciseScore: 25,
    correctAnswers: 1,
  });
});

test("exercise rating and completion thresholds stay stable", () => {
  assert.equal(getExerciseRating(69), "NEEDS_PRACTICE");
  assert.equal(getExerciseRating(70), "PASS");
  assert.equal(getExerciseRating(80), "GOOD");
  assert.equal(getExerciseRating(90), "EXCELLENT");
  assert.equal(isExerciseCompleted(69), false);
  assert.equal(isExerciseCompleted(70), true);
});
