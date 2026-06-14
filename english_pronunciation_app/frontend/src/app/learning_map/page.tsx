import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LearningMapClient, { type LearningMapUI, type TopicUI } from "./LearningMapClient";

export const dynamic = "force-dynamic";

export default async function LearningMapPage() {
  const session = await auth();

  const [topicsDB, bestAttempts] = await Promise.all([
    prisma.topic.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        exercises: {
          orderBy: {
            name: "asc",
          },
          include: {
            map: {
              select: {
                id: true,
                name: true,
                requirement: true,
                status: true,
              },
            },
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    }),
    session?.user?.id
      ? prisma.exerciseAttempt.groupBy({
          by: ["exerciseId"],
          where: {
            userId: session.user.id,
          },
          _max: {
            score: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const bestScoreByExerciseId = new Map(
    bestAttempts.map((attempt) => [attempt.exerciseId, attempt._max.score ?? null]),
  );

  const topics: TopicUI[] = topicsDB.map((topic) => {
    const mapsById = new Map<string, LearningMapUI>();

    for (const exercise of topic.exercises) {
      const existingMap = mapsById.get(exercise.map.id);

      if (!existingMap) {
        mapsById.set(exercise.map.id, {
          id: exercise.map.id,
          name: exercise.map.name,
          requirement: exercise.map.requirement,
          status: exercise.map.status,
          exercises: [],
        });
      }

      const bestScore = bestScoreByExerciseId.get(exercise.id) ?? null;

      mapsById.get(exercise.map.id)!.exercises.push({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        status: exercise.status,
        questionCount: exercise._count.questions,
        bestScore,
        isCompleted: bestScore !== null && bestScore >= 70,
      });
    }

    const maps = Array.from(mapsById.values()).sort((first, second) => first.name.localeCompare(second.name));

    for (const map of maps) {
      map.exercises.sort((first, second) => first.name.localeCompare(second.name));
    }

    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      maps,
    };
  });

  return <LearningMapClient topics={topics} />;
}
