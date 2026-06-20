/**
 * Gamification Reward Event Types
 *
 * Shared types for the reward event system that powers celebration effects
 * (toasts, overlays, confetti, banners) across the app.
 *
 * @module gamification/types
 */

/** All possible reward event types that can be emitted */
export type RewardEventType =
  | "xp"
  | "gems"
  | "level_up"
  | "quest_complete"
  | "badge_earned"
  | "streak_milestone";

/**
 * A reward event emitted after a user action (exercise submit, check-in, etc.)
 * Listeners (toasts, overlays) react to these events to show celebrations.
 */
export type RewardEvent = {
  type: RewardEventType;
  /** Numeric amount (XP, gems, etc.) */
  amount?: number;
  /** Human-readable label shown in toasts */
  label: string;
  /** Emoji icon for visual feedback */
  icon?: string;
  /** Level number (for level_up events) */
  level?: number;
  /** Quest description (for quest_complete events) */
  questDesc?: string;
  /** Badge name (for badge_earned events) */
  badgeName?: string;
  /** Reward gems earned with quest */
  questGems?: number;
};

/**
 * A toast entry created from a RewardEvent, displayed in the toast queue.
 */
export type ToastEntry = {
  id: string;
  type: RewardEventType;
  label: string;
  icon: string;
  /** Tailwind color class for background */
  bgColor: string;
};

/**
 * Context value exposed by RewardEventProvider.
 */
export type RewardEventContextValue = {
  /** Emit a reward event — all subscribed listeners react */
  emit: (event: RewardEvent) => void;
  /** Subscribe to reward events. Returns unsubscribe function. */
  subscribe: (handler: (event: RewardEvent) => void) => () => void;
};
