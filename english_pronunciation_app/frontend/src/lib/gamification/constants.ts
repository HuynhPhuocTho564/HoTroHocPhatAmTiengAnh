/**
 * Gamification Constants
 *
 * Centralized configuration for animation durations, thresholds,
 * and visual parameters used by celebration effects.
 *
 * @module gamification/constants
 */

// === Animation Durations (milliseconds) ===
export const TOAST_DISPLAY_MS = 2500;
export const TOAST_FADE_MS = 300;
export const LEVELUP_AUTO_DISMISS_MS = 5000;
export const QUEST_BANNER_DISPLAY_MS = 4000;
export const CONFETTI_DURATION_MS = 3000;

// === Toast Configuration ===
export const MAX_TOASTS_VISIBLE = 3;

// === Confetti Configuration ===
export const CONFETTI_COUNT_DESKTOP = 80;
export const CONFETTI_COUNT_MOBILE = 30;
export const CONFETTI_COLORS = [
  "#FF6B6B", // red
  "#4ECDC4", // teal
  "#45B7D1", // sky blue
  "#96CEB4", // sage
  "#FFEAA7", // gold
  "#DDA0DD", // plum
  "#FF9FF3", // pink
  "#54A0FF", // blue
];

// === Streak Fire Thresholds ===
export const STREAK_FIRE_SMALL = 3;
export const STREAK_FIRE_MEDIUM = 7;
export const STREAK_FIRE_LARGE = 14;
export const STREAK_FIRE_DRAGON = 30;

// === Level Up Colors ===
export const LEVEL_UP_GOLD = "#F59E0B";
export const LEVEL_UP_GLOW = "rgba(245, 158, 11, 0.4)";
