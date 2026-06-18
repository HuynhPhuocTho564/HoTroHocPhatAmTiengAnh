import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LearningMapClient, { type LearningMapUI, type TopicUI } from "./LearningMapClient";

export const dynamic = "force-dynamic";

export default async function LearningMapPage() {
  const session = await auth();

  const [topicsDB, bestAttempts] = await Promise.all([
    prisma.topic.findMany({
      orderBy: {
        id: "asc", // Sort by ID to get topic-1, topic-2, topic-3, topic-4 order
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
                subcategory: true,
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
          subcategory: exercise.map.subcategory,
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

    const maps = Array.from(mapsById.values()).sort((first, second) => {
      // Sort by map ID which follows pattern: map-t1-g01-..., map-t1-g02-..., etc.
      // This ensures sound groups are sorted by their orderIndex
      return first.id.localeCompare(second.id);
    });

    for (const map of maps) {
      map.exercises.sort((first, second) => {
        // Sort by exercise mode order: listen_choose (1), speak_word (2), speak_minimal_pair (3), speak_sentence (4)
        const getModeOrder = (id: string) => {
          if (id.includes("listen_choose")) return 1;
          if (id.includes("speak_word")) return 2;
          if (id.includes("speak_minimal_pair")) return 3;
          if (id.includes("speak_sentence")) return 4;
          return 5;
        };
        return getModeOrder(first.id) - getModeOrder(second.id);
      });
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
