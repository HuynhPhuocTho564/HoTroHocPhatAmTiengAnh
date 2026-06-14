import AdminDashboardClient, { type AdminDashboardData } from "@/components/admin/AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    activeUsers,
    totalExercises,
    totalAudioFiles,
    completedAttempts,
    users,
    exercises,
    audioFiles,
    recentAttempts,
    newUsersLast7Days,
    topics,
    levels,
    maps,
    questionTypes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.exercise.count(),
    prisma.audioFile.count(),
    prisma.exerciseAttempt.count({ where: { status: "COMPLETED" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.exercise.findMany({
      orderBy: [{ map: { name: "asc" } }, { name: "asc" }],
      include: {
        topic: { select: { id: true, name: true } },
        level: { select: { id: true, name: true } },
        map: { select: { id: true, name: true } },
        _count: {
          select: {
            questions: {
              where: {
                status: "ACTIVE",
              },
            },
            attempts: true,
          },
        },
      },
    }),
    prisma.audioFile.findMany({
      orderBy: { path: "asc" },
      include: {
        _count: {
          select: {
            exercises: true,
          },
        },
      },
    }),
    prisma.exerciseAttempt.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        score: true,
        createdAt: true,
        exercise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.topic.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            exercises: true,
            soundGroups: true,
          },
        },
      },
    }),
    prisma.level.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            exercises: true,
            soundGroups: true,
          },
        },
      },
    }),
    prisma.learningMap.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            exercises: true,
            progresses: true,
          },
        },
      },
    }),
    prisma.questionType.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const completedAttemptsLast7Days = recentAttempts.length;
  const averageScore =
    recentAttempts.length > 0
      ? Math.round(recentAttempts.reduce((total, attempt) => total + attempt.score, 0) / recentAttempts.length)
      : 0;

  const exerciseAttemptSummary = new Map<string, { id: string; name: string; completions: number; totalScore: number }>();
  for (const attempt of recentAttempts) {
    const current = exerciseAttemptSummary.get(attempt.exercise.id) ?? {
      id: attempt.exercise.id,
      name: attempt.exercise.name,
      completions: 0,
      totalScore: 0,
    };
    current.completions += 1;
    current.totalScore += attempt.score;
    exerciseAttemptSummary.set(attempt.exercise.id, current);
  }

  const topExercises = Array.from(exerciseAttemptSummary.values())
    .map((item) => ({
      id: item.id,
      name: item.name,
      completions: item.completions,
      avgScore: Math.round(item.totalScore / item.completions),
    }))
    .sort((first, second) => second.completions - first.completions)
    .slice(0, 5);

  const data: AdminDashboardData = {
    stats: {
      totalUsers,
      activeUsers,
      totalExercises,
      totalAudioFiles,
      completedAttempts,
      newUsersLast7Days,
      completedAttemptsLast7Days,
      averageScore,
    },
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    })),
    exercises: exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      topicId: exercise.topic.id,
      topic: exercise.topic.name,
      levelId: exercise.level.id,
      level: exercise.level.name,
      mapId: exercise.map.id,
      map: exercise.map.name,
      timeLimit: exercise.timeLimit,
      questionCount: exercise._count.questions,
      attemptCount: exercise._count.attempts,
      status: exercise.status,
    })),
    topics: topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      exerciseCount: topic._count.exercises,
      soundGroupCount: topic._count.soundGroups,
    })),
    levels: levels.map((level) => ({
      id: level.id,
      name: level.name,
      description: level.description,
      exerciseCount: level._count.exercises,
      soundGroupCount: level._count.soundGroups,
    })),
    maps: maps.map((map) => ({
      id: map.id,
      name: map.name,
      requirement: map.requirement,
      status: map.status,
      exerciseCount: map._count.exercises,
      progressCount: map._count.progresses,
    })),
    exerciseOptions: {
      topics: topics.map((topic) => ({ id: topic.id, name: topic.name })),
      levels: levels.map((level) => ({ id: level.id, name: level.name })),
      maps: maps.map((map) => ({ id: map.id, name: map.name })),
      questionTypes,
    },
    audioFiles: audioFiles.map((audio) => ({
      id: audio.id,
      path: audio.path,
      duration: audio.duration,
      playLimit: audio.playLimit,
      usedIn: audio._count.exercises,
    })),
    reports: {
      newUsersLast7Days,
      completedAttemptsLast7Days,
      averageScore,
      topExercises,
    },
  };

  return <AdminDashboardClient data={data} />;
}
