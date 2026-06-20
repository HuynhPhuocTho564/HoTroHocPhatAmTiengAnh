/**
 * Mastery Percentage Logic
 *
 * Computes mastery % for each sound group based on completion rate
 * and average score. Used by MasteryTree component.
 *
 * @module gamification/mastery
 */

/**
 * Compute mastery percentage for a sound group.
 *
 * Formula: completionWeight * 60% + scoreWeight * 40%
 * - completionWeight = completedExercises / totalExercises
 * - scoreWeight = avgScore / 100
 *
 * @returns number 0-100
 */
export function computeMasteryPercentage(
  completedExercises: number,
  totalExercises: number,
  avgScore: number,
): number {
  if (totalExercises === 0) return 0;

  const completionWeight = Math.min(1, completedExercises / totalExercises);
  const scoreWeight = Math.min(1, avgScore / 100);

  return Math.round((completionWeight * 0.6 + scoreWeight * 0.4) * 100);
}

/**
 * Get color tier based on mastery percentage.
 */
export function getMasteryTier(percentage: number): "none" | "bronze" | "silver" | "gold" {
  if (percentage >= 100) return "gold";
  if (percentage >= 50) return "silver";
  if (percentage >= 1) return "bronze";
  return "none";
}

export type MasteryNode = {
  soundGroupId: string;
  name: string;
  topicName: string;
  percentage: number;
  tier: "none" | "bronze" | "silver" | "gold";
  totalExercises: number;
  completedExercises: number;
};

export type TopicMastery = {
  topicId: string;
  topicName: string;
  orderIndex: number;
  overallPercentage: number;
  soundGroups: MasteryNode[];
};
