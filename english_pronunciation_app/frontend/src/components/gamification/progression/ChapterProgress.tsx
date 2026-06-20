import type { TopicMastery } from "@/lib/gamification/mastery";

interface ChapterProgressProps {
  /** Topic mastery data */
  topics: TopicMastery[];
  /** Threshold % to unlock next chapter */
  unlockThreshold?: number;
}

/**
 * ChapterProgress — Visual chapter journey with 4 dots connected by arrows.
 *
 * Each chapter shows completion %. Locked chapters show 🔒 until
 * previous chapter reaches unlockThreshold.
 */
export default function ChapterProgress({
  topics,
  unlockThreshold = 80,
}: ChapterProgressProps) {
  if (topics.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
        Hành trình chương
      </h3>

      {/* Journey path */}
      <div className="flex items-center justify-between gap-1">
        {topics.map((topic, idx) => {
          const pct = topic.overallPercentage;
          const isCompleted = pct >= unlockThreshold;
          const isUnlocked = idx === 0 || topics[idx - 1].overallPercentage >= unlockThreshold;
          const isActive = isUnlocked && !isCompleted;

          return (
            <div key={topic.topicId} className="flex flex-1 flex-col items-center gap-2">
              {/* Connector arrow (not on first) */}
              {idx > 0 && (
                <div
                  className={`absolute -left-3 top-4 h-0.5 w-6 ${
                    isUnlocked ? "bg-blue-400" : "bg-neutral-300"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Chapter node */}
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all ${
                  isCompleted
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200 animate-[pulse-glow_2s_ease-in-out_infinite] motion-reduce:animate-none"
                      : "bg-neutral-200 text-neutral-400"
                }`}
                title={`${topic.topicName}: ${pct}%`}
              >
                {isCompleted ? "✓" : !isUnlocked ? "🔒" : `${idx + 1}`}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`text-[10px] font-medium leading-tight ${
                    isUnlocked ? "text-neutral-700" : "text-neutral-400"
                  }`}
                >
                  CĐ{topic.orderIndex}
                </p>
                <p
                  className={`text-[10px] ${
                    isUnlocked ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  {pct}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
