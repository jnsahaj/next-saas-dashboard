export const ALLOWED_TIME_RANGES = ["90d", "30d", "7d"] as const;
export type TimeRange = (typeof ALLOWED_TIME_RANGES)[number];

export const timeRangeLabelMap: Record<TimeRange, string> = {
  "90d": "Last 3 months",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};
