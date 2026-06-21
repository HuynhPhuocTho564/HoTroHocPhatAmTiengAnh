import Link from "next/link";
import { redirect } from "next/navigation";
import DailyCheckIn from "@/components/gamification/DailyCheckIn";
import DailyQuestsWidget from "@/components/gamification/DailyQuestsWidget";
import WeeklyChallengeCard from "@/components/gamification/WeeklyChallengeCard";
import SpinWheel from "@/components/gamification/SpinWheel";
import DashboardWidgetTabs from "@/components/gamification/DashboardWidgetTabs";
import SuggestedExercise from "@/components/dashboard/SuggestedExercise";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
import RankChangeNotification from "@/components/gamification/RankChangeNotification";
import SeasonEndOverlay from "@/components/gamification/SeasonEndOverlay";
import SkillRadar from "@/components/dashboard/SkillRadar";
import { calculateSkillScores } from "@/lib/skill-radar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { auth } from "@/lib/auth";
import { getNextLevelXp } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";
import { localizeBadgeType } from "@/lib/badges";
import { startOfLocalDay } from "@/lib/period";

function formatAttemptStatus(status: string) {
  if (status === "COMPLETED") return "Đã hoàn thành";
  if (status === "NEEDS_PRACTICE") return "Cần luyện thêm";
  return status;
}

function primaryLinkClass() {
  return "inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2";
}

function quietLinkClass() {
  return "block rounded-lg px-3 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [user, completedExerciseGroups, totalActiveExercises, suggestedExercise, skillAttempts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        xp: true,
        level: true,
        streakCount: true,
        longestStreak: true,
        totalCheckIns: true,
        lastCheckInDate: true,
        exerciseAttempts: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            score: true,
            status: true,
            createdAt: true,
            exercise: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        userBadges: {
          orderBy: {
            earnedAt: "desc",
          },
          take: 4,
          include: {
            badge: true,
          },
        },
      },
    }),
    prisma.exerciseAttempt.groupBy({
      by: ["exerciseId"],
      where: {
        userId: session.user.id,
        score: {
          gte: 70,
        },
      },
    }),
    prisma.exercise.count({
      where: {
        status: "ACTIVE",
      },
    }),
    // Task 2.2: bài gợi ý = bài ACTIVE chưa đạt ≥70 điểm, ưu tiên bài đầu tiên
    prisma.exercise.findFirst({
      where: {
        status: "ACTIVE",
        // Chưa có attempt nào đạt ≥70 (chưa "hoàn thành" theo threshold)
        attempts: {
          none: {
            userId: session.user.id,
            score: { gte: 70 },
          },
        },
      },
      include: {
        topic: { select: { name: true } },
        map: { select: { name: true } },
      },
      orderBy: { id: "asc" },
    }),
    // Task 6.4: skill radar data — attempts với exercise.topicId để tính avg per topic
    prisma.exerciseAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 200, // Giới hạn để performance OK
      select: {
        score: true,
        exerciseId: true,
        exercise: { select: { topicId: true } },
      },
    }),
  ]);

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Task 6.4: skill radar — tính điểm trung bình theo 4 chủ đề IPA
  const skillScores = calculateSkillScores(skillAttempts);

  const completedExerciseCount = completedExerciseGroups.length;
  const nextLevelXp = getNextLevelXp(user.level);
  const previousLevelXp = user.level <= 1 ? 0 : getNextLevelXp(user.level - 1);
  const levelProgress =
    nextLevelXp === previousLevelXp
      ? 0
      : Math.min(100, Math.round(((user.xp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100));
  const latestAttempt = user.exerciseAttempts[0];
  const remainingXp = Math.max(0, nextLevelXp - user.xp);

  // Task 6.2: Streak warning — user có streak > 0 nhưng chưa luyện hôm nay (loss aversion).
  // lastCheckInDate cập nhật khi điểm danh (không cần luyện bài), nên dùng exerciseAttempt
  // để xác định "đã luyện hôm nay". Nếu chưa luyện + streak > 0 → hiện warning.
  const today = startOfLocalDay(new Date());
  const lastPracticeDay = latestAttempt ? startOfLocalDay(latestAttempt.createdAt) : null;
  const practicedToday = lastPracticeDay?.getTime() === today.getTime();
  const showStreakWarning = !practicedToday && user.streakCount > 0;

  return (
    <OnboardingGate>
      <RankChangeNotification />
      <SeasonEndOverlay />
      <div className="min-h-screen bg-white">
        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col lg:flex-row">
        <div className="flex-1 border-neutral-200 px-4 py-10 sm:px-6 lg:border-r lg:px-12">
          <section aria-labelledby="dashboard-heading">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-700">Dashboard</p>
            <h1 id="dashboard-heading" className="mb-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
              Xin chào, {user.username}. Hôm nay bạn có thể tiếp tục luyện phát âm.
            </h1>

            <dl data-tour="stats" className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
                <dt className="text-sm font-semibold text-warning-700">Chuỗi học</dt>
                <dd className="mt-1 text-2xl font-bold text-warning-800">{user.streakCount} ngày</dd>
              </div>
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                <dt className="text-sm font-semibold text-primary-700">Cấp độ</dt>
                <dd className="mt-1 text-2xl font-bold text-primary-800">{user.level}</dd>
              </div>
              <div className="rounded-lg border border-success-200 bg-success-50 p-4">
                <dt className="text-sm font-semibold text-success-700">Bài đã đạt</dt>
                <dd className="mt-1 text-2xl font-bold text-success-800">
                  {completedExerciseCount}/{totalActiveExercises}
                </dd>
              </div>
            </dl>
          </section>

          <Card className="mb-8" padding="lg">
            <section aria-labelledby="xp-progress-heading">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Tiến độ XP</p>
                  <h2 id="xp-progress-heading" className="text-3xl font-bold text-neutral-900">
                    {user.xp.toLocaleString("vi-VN")} XP
                  </h2>
                  <p className="mt-2 text-neutral-600">
                    Cần {remainingXp.toLocaleString("vi-VN")} XP để chạm mốc cấp tiếp theo.
                  </p>
                </div>
                <div className="w-full lg:w-80">
                  <div className="mb-2 flex justify-between text-sm font-bold text-neutral-600">
                    <span>Cấp {user.level}</span>
                    <span>{levelProgress}%</span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full bg-neutral-100"
                    role="progressbar"
                    aria-label="Tiến độ lên cấp"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={levelProgress}
                  >
                    <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${levelProgress}%` }} />
                  </div>
                </div>
              </div>
            </section>
          </Card>

          <Card padding="lg" data-tour="continue-wrapper">
            <section aria-labelledby="continue-learning-heading">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Tiếp tục học</p>
              {latestAttempt ? (
                <>
                  <h2 id="continue-learning-heading" className="mb-2 text-3xl font-bold text-neutral-900">
                    {latestAttempt.exercise.name}
                  </h2>
                  <p className="mb-6 text-neutral-600">
                    Lần gần nhất đạt {latestAttempt.score}/100 điểm. Hãy làm lại để cải thiện best score.
                  </p>
                  <Link
                    href={`/exercises/${latestAttempt.exercise.id}`}
                    className={primaryLinkClass()}
                    aria-label={`Vào bài tập ${latestAttempt.exercise.name}`}
                  >
                    Vào bài tập
                  </Link>
                </>
              ) : (
                <>
                  <h2 id="continue-learning-heading" className="mb-2 text-3xl font-bold text-neutral-900">
                    Bắt đầu bài luyện đầu tiên
                  </h2>
                  <p className="mb-6 text-neutral-600">
                    Hoàn thành bài đầu tiên để bắt đầu tính XP, điểm hạng và huy hiệu.
                  </p>
                  <Link href="/learning_map" className={primaryLinkClass()}>
                    Chọn bài học
                  </Link>
                </>
              )}
            </section>
          </Card>

          {/* Task 2.2: "Gợi ý hôm nay" — bài chưa hoàn thành tiếp theo.
              Đặt ngay dưới "Tiếp tục học". Ẩn nếu user đã hoàn thành tất cả. */}
          <div className="mt-6">
            <SuggestedExercise
              exercise={
                suggestedExercise
                  ? {
                      id: suggestedExercise.id,
                      name: suggestedExercise.name,
                      description: suggestedExercise.description,
                      topicName: suggestedExercise.topic.name,
                      mapName: suggestedExercise.map.name,
                    }
                  : null
              }
            />
          </div>

          {/* Task 6.2: Streak warning — loss aversion (Nielsen H1 — Visibility).
              Chỉ hiện khi user có streak > 0 nhưng chưa luyện hôm nay. */}
          {showStreakWarning && (
            <div
              className="mt-6 rounded-lg border-2 border-amber-300 bg-amber-50 p-4"
              role="alert"
            >
              <p className="font-bold text-amber-800">
                ⚠️ Chuỗi {user.streakCount} ngày của bạn sẽ mất nếu không luyện tập trước nửa đêm!
              </p>
              <Link
                href="/learning_map"
                className="mt-1 inline-block text-sm font-bold text-amber-700 hover:underline"
              >
                Luyện ngay bây giờ →
              </Link>
            </div>
          )}

          <section className="mt-8" aria-labelledby="recent-attempts-heading">
            <h2 id="recent-attempts-heading" className="mb-4 text-xl font-bold text-neutral-900">
              Bài làm gần đây
            </h2>
            {user.exerciseAttempts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {user.exerciseAttempts.slice(0, 4).map((attempt) => (
                  <Card key={attempt.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-neutral-900">{attempt.exercise.name}</h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {attempt.createdAt.toLocaleDateString("vi-VN")} - {formatAttemptStatus(attempt.status)}
                        </p>
                      </div>
                      <Badge variant={attempt.score >= 70 ? "success" : "warning"} size="sm">
                        {attempt.score}/100
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-neutral-600">Chưa có bài làm nào. Hãy chọn một bài trong lộ trình để bắt đầu.</p>
              </Card>
            )}
          </section>
        </div>

        <aside className="w-full border-neutral-200 bg-neutral-50 p-6 sm:p-10 lg:w-[380px] lg:border-l" aria-label="Thông tin học viên">
          <section className="mb-8 flex items-center gap-4" aria-label="Hồ sơ ngắn">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-800 p-2 shadow-sm">
              <img
                src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt=""
                aria-hidden="true"
                className="h-full w-full rounded-md bg-white object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-neutral-900">{user.username}</h2>
              <p className="text-sm font-medium text-neutral-500">Học viên cấp độ {user.level}</p>
            </div>
          </section>

          {/* Task 6.4: Skill Radar — hiển thị điểm mạnh/yếu ở 4 chủ đề IPA */}
          <div className="mb-8">
            <SkillRadar scores={skillScores} />
          </div>

          <nav className="mb-8 space-y-2" aria-label="Liên kết nhanh dashboard">
            <Link href="/checkin" className={quietLinkClass()}>
              Điểm danh hằng ngày
            </Link>
            <Link href="/leaderboard" className={quietLinkClass()}>
              Bảng xếp hạng
            </Link>
            <Link href="/badges" className={quietLinkClass()}>
              Huy hiệu
            </Link>
          </nav>

          <DashboardWidgetTabs
            todayContent={
              <>
                <DailyCheckIn
                  currentStreak={user.streakCount}
                  longestStreak={user.longestStreak}
                  totalCheckIns={user.totalCheckIns}
                  lastCheckIn={user.lastCheckInDate?.toISOString() ?? null}
                />
                <DailyQuestsWidget />
              </>
            }
            challengeContent={<WeeklyChallengeCard />}
            rewardsContent={
              <>
                <SpinWheel />
                <Card>
                  <section aria-labelledby="recent-badges-heading">
                    <h2 id="recent-badges-heading" className="mb-4 text-lg font-bold text-neutral-900">
                      Huy hiệu gần đây
                    </h2>
                    {user.userBadges.length > 0 ? (
                      <ul className="space-y-3">
                        {user.userBadges.map((userBadge) => (
                          <li key={userBadge.id} className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-neutral-900">{userBadge.badge.name}</p>
                              <p className="text-xs text-neutral-500">{userBadge.earnedAt.toLocaleDateString("vi-VN")}</p>
                            </div>
                            <Badge variant="info" size="sm">
                              {localizeBadgeType(userBadge.badge.type)}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-600">
                        Chưa có huy hiệu. Hãy hoàn thành bài tập hoặc điểm danh để mở khóa.
                      </p>
                    )}
                  </section>
                </Card>
              </>
            }
          />
        </aside>
      </main>
    </div>
    </OnboardingGate>
  );
}
