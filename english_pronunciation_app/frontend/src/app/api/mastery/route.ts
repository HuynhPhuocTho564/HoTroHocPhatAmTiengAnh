import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeMasteryPercentage, getMasteryTier, type TopicMastery } from "@/lib/gamification/mastery";

/**
 * GET /api/mastery
 *
 * Returns mastery percentage for each topic and sound group.
 * Used by MasteryTree component on dashboard.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const userId = session.user.id;

  // Get all topics with sound groups
  const topics = await prisma.topic.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      soundGroups: {
        where: { status: "ACTIVE" },
        orderBy: { orderIndex: "asc" },
        include: {
          _count: { select: { questionBankItems: true } },
        },
      },
    },
  });

  // Get user's exercise attempts per sound group (via exercises)
  const userAttempts = await prisma.exerciseAttempt.findMany({
    where: { userId },
    select: {
      exerciseId: true,
      score: true,
      exercise: {
        select: {
          map: {
            select: {
              subcategory: true,
              exercises: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  // Build mastery data per topic
  const result: TopicMastery[] = topics.map((topic) => {
    const soundGroups = topic.soundGroups.map((sg) => {
      // Find exercises linked to this sound group (via LearningMap.subcategory)
      const relatedExercises = sg._count.questionBankItems; // approximation
      const totalExercises = Math.max(1, relatedExercises);

      // Find user attempts for exercises in this group
      const groupAttempts = userAttempts.filter((a) => {
        return a.exercise.map?.subcategory === sg.subcategory;
      });
      const completedExercises = new Set(groupAttempts.map((a) => a.exerciseId)).size;
      const avgScore =
        groupAttempts.length > 0
          ? groupAttempts.reduce((sum, a) => sum + a.score, 0) / groupAttempts.length
          : 0;

      const percentage = computeMasteryPercentage(completedExercises, totalExercises, avgScore);
      const tier = getMasteryTier(percentage);

      return {
        soundGroupId: sg.id,
        name: sg.name,
        topicName: topic.name,
        percentage,
        tier,
        totalExercises,
        completedExercises,
      };
    });

    const overallPercentage =
      soundGroups.length > 0
        ? Math.round(soundGroups.reduce((sum, sg) => sum + sg.percentage, 0) / soundGroups.length)
        : 0;

    return {
      topicId: topic.id,
      topicName: topic.name,
      orderIndex: topic.orderIndex,
      overallPercentage,
      soundGroups,
    };
  });

  return NextResponse.json({ success: true, data: result });
}
