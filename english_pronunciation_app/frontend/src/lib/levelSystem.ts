/**
 * Level System - Hệ thống cấp độ dựa trên số bài học hoàn thành
 * 
 * Logic: Cấp độ = Math.floor(completedLessons / 5)
 * Mỗi 5 bài học → Lên 1 cấp
 */

export type LevelInfo = {
  level: number;
  title: string;
  currentLessons: number;
  lessonsForNextLevel: number;
  progress: number; // 0-100%
  icon: string;
};

/**
 * Tính cấp độ từ số bài học hoàn thành
 */
export function calculateLevel(completedLessons: number): number {
  return Math.floor(completedLessons / 5);
}

/**
 * Lấy danh hiệu theo cấp độ
 */
export function getLevelTitle(level: number): string {
  if (level === 0) return "Người mới";
  if (level === 1) return "Học viên";
  if (level === 2) return "Tập sự";
  if (level === 3) return "Trung cấp";
  if (level === 4) return "Khá";
  if (level === 5) return "Giỏi";
  if (level === 6) return "Xuất sắc";
  if (level === 7) return "Chuyên gia";
  if (level === 8) return "Bậc thầy";
  if (level >= 9) return "Huyền thoại";
  return "Học viên";
}

/**
 * Lấy icon theo cấp độ
 */
export function getLevelIcon(level: number): string {
  if (level === 0) return "🌱";
  if (level === 1) return "📚";
  if (level === 2) return "📖";
  if (level === 3) return "🎓";
  if (level === 4) return "⭐";
  if (level === 5) return "🌟";
  if (level === 6) return "💫";
  if (level === 7) return "🏆";
  if (level === 8) return "👑";
  if (level >= 9) return "💎";
  return "📚";
}

/**
 * Lấy màu theo cấp độ
 */
export function getLevelColor(level: number): {
  bg: string;
  border: string;
  text: string;
} {
  if (level === 0) return { bg: "bg-neutral-50", border: "border-neutral-300", text: "text-neutral-700" };
  if (level <= 2) return { bg: "bg-sky-50", border: "border-sky-300", text: "text-sky-700" };
  if (level <= 4) return { bg: "bg-primary-50", border: "border-primary-300", text: "text-primary-700" };
  if (level <= 6) return { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" };
  if (level <= 8) return { bg: "bg-accent-50", border: "border-accent-300", text: "text-accent-700" };
  return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700" };
}

/**
 * Lấy thông tin đầy đủ về level
 */
export function getLevelInfo(completedLessons: number): LevelInfo {
  const level = calculateLevel(completedLessons);
  const title = getLevelTitle(level);
  const icon = getLevelIcon(level);
  
  // Tính số bài cần để lên cấp tiếp theo
  const lessonsForCurrentLevel = level * 5;
  const lessonsForNextLevel = (level + 1) * 5;
  const currentLessons = completedLessons - lessonsForCurrentLevel;
  const lessonsNeeded = lessonsForNextLevel - completedLessons;
  
  // Tính % tiến độ trong cấp hiện tại
  const progress = (currentLessons / 5) * 100;
  
  return {
    level,
    title,
    currentLessons,
    lessonsForNextLevel: lessonsNeeded,
    progress,
    icon,
  };
}

/**
 * Kiểm tra có lên cấp không
 */
export function checkLevelUp(
  oldCompletedLessons: number,
  newCompletedLessons: number
): boolean {
  const oldLevel = calculateLevel(oldCompletedLessons);
  const newLevel = calculateLevel(newCompletedLessons);
  return newLevel > oldLevel;
}

/**
 * Lấy tất cả cấp độ (cho admin)
 */
export function getAllLevels(): Array<{
  level: number;
  title: string;
  icon: string;
  lessonsRequired: number;
}> {
  const levels = [];
  for (let i = 0; i <= 10; i++) {
    levels.push({
      level: i,
      title: getLevelTitle(i),
      icon: getLevelIcon(i),
      lessonsRequired: i * 5,
    });
  }
  return levels;
}
