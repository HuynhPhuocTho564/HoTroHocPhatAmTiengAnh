import { getWeekPeriod, getMonthPeriod } from "./period";

/**
 * Season helpers — phát hiện khi season (tuần/tháng) sắp kết thúc.
 *
 * Dùng cho Task 3.5 Season Ceremony — overlay climax moment khi user mở app
 * trong "golden hour" cuối season (Chủ nhật 20-21h / cuối tháng 20-21h).
 *
 * @module lib/season
 */

export type SeasonInfo = {
  type: "tuan" | "thang";
  period: string;
};

/**
 * Kiểm tra hiện tại có phải "golden hour" cuối season không.
 * - Tuần: Chủ nhật (day=0) 20-21h
 * - Tháng: ngày cuối tháng 20-21h
 *
 * Trả null nếu không phải giờ kết thúc season.
 */
export function isSeasonEnding(now = new Date()): SeasonInfo | null {
  const day = now.getDay(); // 0=Sunday, 1=Monday, ...
  const hour = now.getHours();

  // Cửa sổ 20-21h (golden hour trước reset)
  if (hour < 20 || hour >= 21) return null;

  // Tuần: Chủ nhật
  if (day === 0) {
    return { type: "tuan", period: getWeekPeriod(now) };
  }

  // Tháng: ngày cuối tháng
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (now.getDate() === lastDayOfMonth) {
    return { type: "thang", period: getMonthPeriod(now) };
  }

  return null;
}
