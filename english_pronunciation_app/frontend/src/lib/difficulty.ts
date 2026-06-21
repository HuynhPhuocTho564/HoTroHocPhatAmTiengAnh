/**
 * Exercise difficulty helper — suy luận độ khó từ tên bài (Task 5.4).
 *
 * Heuristic đơn giản: parse keyword trong tên (de/easy/basic → dễ, kho/hard/
 * advanced → khó, còn lại → trung bình). Pure function — dễ test.
 *
 * @module lib/difficulty
 */

export type DifficultyLevel = "easy" | "medium" | "hard";

export type DifficultyInfo = {
  level: DifficultyLevel;
  label: string;
  /** Tailwind classes cho badge (semantic colors — ui-color-harmony) */
  color: string;
  stars: number;
};

const DIFFICULTY_INFO: Record<DifficultyLevel, DifficultyInfo> = {
  easy: { level: "easy", label: "Dễ", color: "bg-success-100 text-success-700", stars: 1 },
  medium: { level: "medium", label: "Trung bình", color: "bg-warning-100 text-warning-700", stars: 2 },
  hard: { level: "hard", label: "Khó", color: "bg-error-100 text-error-700", stars: 3 },
};

/**
 * Suy luận độ khó từ tên bài. Pure function.
 * @example getDifficultyLevel("Bài dễ — nhận diện /ʃ/") → easy
 * @example getDifficultyLevel("Advanced linking practice") → hard
 */
export function getDifficultyLevel(name: string): DifficultyInfo {
  const normalized = name.toLowerCase();
  if (
    normalized.includes("de") ||
    normalized.includes("easy") ||
    normalized.includes("basic") ||
    normalized.includes("co ban") ||
    normalized.includes("nhận diện")
  ) {
    return DIFFICULTY_INFO.easy;
  }
  if (
    normalized.includes("kho") ||
    normalized.includes("hard") ||
    normalized.includes("advanced") ||
    normalized.includes("nang cao") ||
    normalized.includes("thuc chien") ||
    normalized.includes("thực chiến")
  ) {
    return DIFFICULTY_INFO.hard;
  }
  return DIFFICULTY_INFO.medium;
}
