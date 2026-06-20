import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExerciseEngineClient from "./ExerciseEngineClient";

export const dynamic = "force-dynamic";

type JsonOption = {
  id?: unknown;
  text?: unknown;
  content?: unknown;
};

function isJsonOption(value: unknown): value is JsonOption {
  return Boolean(value) && typeof value === "object";
}

function getQuestionOptions(question: {
  id: string;
  content: string;
  options: Array<{ id: string; content: string }>;
}) {
  if (question.options.length > 0) {
    return question.options.map((option) => ({
      id: option.id,
      content: option.content,
    }));
  }

  try {
    const parsed = JSON.parse(question.content) as { options?: unknown };
    if (Array.isArray(parsed.options)) {
      return parsed.options
        .filter(isJsonOption)
        .map((option, index) => ({
          id: String(option.id ?? `${question.id}-opt-${index}`),
          content: String(option.text ?? option.content ?? ""),
        }))
        .filter((option) => option.content.length > 0);
    }
  } catch {
    // Plain text question content has no embedded options.
  }

  return [];
}

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [exercise, userUnlocks] = await Promise.all([
    prisma.exercise.findUnique({
      where: {
        id,
        status: "ACTIVE",
      },
      include: {
        questions: {
          where: {
            status: "ACTIVE",
          },
          include: {
            options: true,
            type: true,
          },
        },
      },
    }),
    // Fetch unlock flags + level for logged-in users (shop items + reward events)
    auth().then(async (session) => {
      if (!session?.user?.id) return { unlockedSlowAudio: false, unlockedIpaReveal: false, userLevel: 0 };
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { unlockedSlowAudio: true, unlockedIpaReveal: true, level: true },
      });
      return {
        unlockedSlowAudio: user?.unlockedSlowAudio ?? false,
        unlockedIpaReveal: user?.unlockedIpaReveal ?? false,
        userLevel: user?.level ?? 0,
      };
    }),
  ]);

  if (!exercise) {
    notFound();
  }

  const exerciseData = {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    questions: exercise.questions.map((question) => ({
      id: question.id,
      name: question.name,
      content: question.content,
      type: question.type.id,
      answer: question.answer,
      acceptedAnswers: Array.isArray(question.acceptedAnswers)
        ? (question.acceptedAnswers as string[])
        : null,
      score: question.score,
      options: getQuestionOptions(question),
    })),
  };

  return <ExerciseEngineClient exercise={exerciseData} unlocks={userUnlocks} />;
}
