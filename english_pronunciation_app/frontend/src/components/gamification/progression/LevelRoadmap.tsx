import type { MilestoneInfo } from "@/lib/gamification/milestones";

interface LevelRoadmapProps {
  /** User's current level */
  currentLevel: number;
  /** User's current XP */
  currentXp: number;
  /** XP needed for next level */
  nextLevelXp: number;
  /** All milestone rewards */
  milestones: MilestoneInfo[];
  /** Set of claimed milestone IDs */
  claimedIds: Set<string>;
}

/**
 * LevelRoadmap — Visual roadmap showing level progression and milestones.
 *
 * Displays a horizontal progress bar with milestone markers.
 * Shows distance to next level and next milestone.
 */
export default function LevelRoadmap({
  currentLevel,
  currentXp,
  nextLevelXp,
  milestones,
  claimedIds,
}: LevelRoadmapProps) {
  const progressPercent = nextLevelXp > 0 ? Math.min(100, (currentXp / nextLevelXp) * 100) : 0;

  // Find next milestone for display
  const nextMilestone = milestones.find(
    (m) => m.level > currentLevel || (m.level <= currentLevel && !claimedIds.has(m.id)),
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
        Hành trình cấp độ
      </h3>

      {/* Current level info */}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-2xl font-black text-neutral-900">
          Cấp {currentLevel}
        </span>
        <span className="text-xs text-neutral-500">
          {currentXp} / {nextLevelXp} XP
        </span>
      </div>

      {/* Progress bar to next level */}
      <div className="relative mb-6 h-3 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Milestone markers */}
      <div className="relative mb-2 flex items-center justify-between">
        {milestones.map((m) => {
          const reached = m.level <= currentLevel;
          const claimed = claimedIds.has(m.id);
          return (
            <div
              key={m.id}
              className="flex flex-col items-center gap-1"
              title={reached ? `${m.title} (Cấp ${m.level})` : `Cấp ${m.level}: ${m.title}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  claimed
                    ? "bg-purple-600 text-white shadow-md"
                    : reached
                      ? "bg-amber-400 text-white shadow-sm"
                      : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {claimed ? "✓" : reached ? "🎁" : m.level}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  reached ? "text-neutral-700" : "text-neutral-400"
                }`}
              >
                Cấp {m.level}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next milestone hint */}
      {nextMilestone && (
        <div className="mt-3 rounded-xl bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-800">
            🎯 Cột mốc tiếp theo: <strong>{nextMilestone.title}</strong> (Cấp {nextMilestone.level})
            {" — "}Phần thưởng: {nextMilestone.gemsReward} 💎
          </p>
        </div>
      )}
    </div>
  );
}
