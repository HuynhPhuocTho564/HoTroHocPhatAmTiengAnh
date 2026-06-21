/**
 * Badge helpers — localization + display utilities.
 *
 * Dùng chung cho badges page, leaderboard, và các component hiển thị huy hiệu
 * (maintainable-code: DRY — tránh inline switch lặp nhiều chỗ).
 */

/** Nhãn tiếng Việt cho badge type. Thêm entry mới ở đây, áp dụng mọi nơi. */
export const BADGE_TYPE_LABELS: Record<string, string> = {
  COMMON: "Thường",
  RARE: "Hiếm",
  EPIC: "Huyền thoại",
  PERIODIC: "Theo kỳ",
};

/**
 * Trả nhãn tiếng Việt cho badge type. Nếu type chưa có trong map,
 * trả về nguyên giá trị (không ẩn thông tin lạ).
 *
 * @example localizeBadgeType("RARE") // "Hiếm"
 */
export function localizeBadgeType(type: string): string {
  return BADGE_TYPE_LABELS[type] ?? type;
}
