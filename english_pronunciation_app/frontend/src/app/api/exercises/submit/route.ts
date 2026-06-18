import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateExerciseRewards,
  calculateLevelFromXp,
  checkAndAwardBadges,
  getLeaderboardTargets,
  getNextLevelXp,
} from "@/lib/gamification";
import { formatLocalDate, startOfLocalDay } from "@/lib/period";
import {
  calculateExerciseScore,
  getExerciseRating,
  isExerciseCompleted,
  scoreQuestion,
  type SubmitAnswerInput,
} from "@/lib/scoring";

type SubmitPayload = {
  exerciseId?: string;
  startedAt?: string;
  completedAt?: string;
  answers?: SubmitAnswerInput[];
};

function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function failure(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status },
  );
}

function isValidAnswer(answer: unknown): answer is SubmitAnswerInput {
  if (!answer || typeof answer !== "object") return false;
  const candidate = answer as SubmitAnswerInput;
  return typeof candidate.questionId === "string" && candidate.questionId.length > 0;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as SubmitPayload;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return failure("UNAUTHENTICATED", "Cần đăng nhập để nộp bài", 401);
    }

    if (!payload.exerciseId || typeof payload.exerciseId !== "string") {
      return failure("VALIDATION_ERROR", "exerciseId không hợp lệ", 400);
    }

    if (!Array.isArray(payload.answers) || payload.answers.length === 0) {
      return failure("EMPTY_ANSWERS", "Chưa có câu trả lời để nộp", 400);
    }

    if (!payload.answers.every(isValidAnswer)) {
      return failure("VALIDATION_ERROR", "answers không hợp lệ", 400);
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: payload.exerciseId,
        status: "ACTIVE",
      },
      include: {
        questions: {
          where: {
            status: "ACTIVE",
          },
          include: {
            type: true,
            options: true,
          },
        },
      },
    });

    if (!exercise) {
      return failure("EXERCISE_NOT_FOUND", "Không tìm thấy bài tập", 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        xp: true,
        level: true,
        streakCount: true,
        longestStreak: true,
      },
    });

    if (!user) {
      return failure("UNAUTHENTICATED", "Không tìm thấy user", 401);
    }

    const questionById = new Map(exercise.questions.map((question) => [question.id, question]));
    const answers = payload.answers;

    for (const answer of answers) {
      if (!questionById.has(answer.questionId)) {
        return failure("QUESTION_NOT_IN_EXERCISE", "Một câu hỏi không thuộc bài tập này", 400);
      }
    }

    const uniqueQuestionIds = new Set(answers.map((answer) => answer.questionId));
    if (uniqueQuestionIds.size !== answers.length) {
      return failure("VALIDATION_ERROR", "Một câu hỏi bị nộp lặp lại", 400);
    }

    const questionResults = answers.map((answer) => {
      const question = questionById.get(answer.questionId);
      if (!question) {
        throw new Error(`Question missing after validation: ${answer.questionId}`);
      }

      return scoreQuestion(question, answer);
    });

    const scoreSummary = calculateExerciseScore(questionResults);
    const exerciseCompleted = isExerciseCompleted(scoreSummary.exerciseScore);
    const rating = getExerciseRating(scoreSummary.exerciseScore);
    const today = startOfLocalDay(new Date());

    const [previousBestAttempt, dailyActivityBefore] = await Promise.all([
      prisma.exerciseAttempt.findFirst({
        where: {
          userId,
          exerciseId: exercise.id,
        },
        orderBy: {
          score: "desc",
        },
        select: {
          score: true,
        },
      }),
      prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        select: {
          completedExercises: true,
        },
      }),
    ]);

    const rewards = calculateExerciseRewards({
      exerciseScore: scoreSummary.exerciseScore,
      previousBestScore: previousBestAttempt?.score ?? null,
      completedExercisesTodayBefore: dailyActivityBefore?.completedExercises ?? 0,
      exerciseCompleted,
    });

    const completedAt = payload.completedAt ? new Date(payload.completedAt) : new Date();
    const totalTimeSpent = answers.reduce((total, answer) => total + Math.max(0, answer.timeSpent ?? 0), 0);

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.exerciseAttempt.create({
        data: {
          name: `${exercise.name} - ${completedAt.toISOString()}`,
          status: exerciseCompleted ? "COMPLETED" : "NEEDS_PRACTICE",
          attemptCount: previousBestAttempt ? 2 : 1,
          score: scoreSummary.exerciseScore,
          userId,
          exerciseId: exercise.id,
          questionAttempts: {
            create: questionResults.map((questionResult) => ({
              questionId: questionResult.questionId,
              transcript: questionResult.transcript,
              selectedOptionId: questionResult.selectedOptionId,
              isCorrect: questionResult.isCorrect,
              score: questionResult.score,
              accuracyScore: questionResult.accuracyScore,
              feedback: questionResult.feedback,
              audioUrl: questionResult.audioUrl,
              timeSpent: questionResult.timeSpent,
            })),
          },
        },
      });

      const updatedUserXp = user.xp + rewards.xpEarned;
      const updatedUserLevel = Math.max(user.level, calculateLevelFromXp(updatedUserXp));

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          xp: { increment: rewards.xpEarned },
          level: updatedUserLevel,
        },
        select: {
          xp: true,
          level: true,
        },
      });

      const dailyActivity = await tx.dailyActivity.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        create: {
          userId,
          date: today,
          xpEarned: rewards.xpEarned,
          completedExercises: exerciseCompleted ? 1 : 0,
        },
        update: {
          xpEarned: { increment: rewards.xpEarned },
          completedExercises: exerciseCompleted ? { increment: 1 } : undefined,
        },
      });

      for (const target of getLeaderboardTargets(completedAt)) {
        await tx.leaderboard.upsert({
          where: {
            userId_type_period: {
              userId,
              type: target.type,
              period: target.period,
            },
          },
          create: {
            userId,
            type: target.type,
            period: target.period,
            score: rewards.totalRankingDelta,
            correctAnswers: scoreSummary.correctAnswers,
            completedExercises: exerciseCompleted ? 1 : 0,
          },
          update: {
            score: { increment: rewards.totalRankingDelta },
            correctAnswers: { increment: scoreSummary.correctAnswers },
            completedExercises: exerciseCompleted ? { increment: 1 } : undefined,
          },
        });
      }

      const badgesAwarded = await checkAndAwardBadges(tx, userId, "exercise_submit", completedAt);

      return {
        attempt,
        updatedUser,
        dailyActivity,
        badgesAwarded,
      };
    });

    return success(
      {
        exerciseAttemptId: result.attempt.id,
        exerciseScore: scoreSummary.exerciseScore,
        maxScore: 100,
        isCompleted: exerciseCompleted,
        rating,
        summary: {
          totalQuestions: exercise.questions.length,
          answeredQuestions: answers.length,
          correctAnswers: scoreSummary.correctAnswers,
          rawScore: scoreSummary.rawScore,
          maxRawScore: scoreSummary.maxScore,
          timeSpent: totalTimeSpent,
        },
        rewards: {
          xpEarned: rewards.baseXp,
          dailyBonusXp: rewards.dailyBonusXp,
          retakeXp: rewards.retakeXp,
          totalXpEarned: rewards.xpEarned,
          rankingDelta: rewards.rankingDelta,
          dailyBonusRanking: rewards.dailyBonusRanking,
          retakeRanking: rewards.retakeRanking,
          totalRankingDelta: rewards.totalRankingDelta,
        },
        progress: {
          currentXp: result.updatedUser.xp,
          level: result.updatedUser.level,
          nextLevelXp: getNextLevelXp(result.updatedUser.level),
        },
        dailyActivity: {
          date: formatLocalDate(today),
          completedExercises: result.dailyActivity.completedExercises,
          xpEarned: result.dailyActivity.xpEarned,
        },
        badgesAwarded: result.badgesAwarded,
        previousBestScore: previousBestAttempt?.score ?? null,
        streak: {
          count: user.streakCount,
          longest: user.longestStreak,
        },
        questionResults: questionResults.map((questionResult) => ({
          questionId: questionResult.questionId,
          isCorrect: questionResult.isCorrect,
          score: questionResult.score,
          accuracyScore: questionResult.accuracyScore,
          feedback: questionResult.feedback,
        })),
      },
      201,
    );
  } catch (error) {
    console.error("Submit exercise error:", error);
    return failure("INTERNAL_ERROR", "Lỗi server khi nộp bài", 500);
  }
}
