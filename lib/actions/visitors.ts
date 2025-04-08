"use server";

import { getVisitorStats, type DailyVisitorStats } from "@/lib/data/visitors";
import type { TimeRange } from "@/lib/types/visitors";

export async function fetchVisitorStatsAction(
  timeRange: TimeRange
): Promise<DailyVisitorStats[]> {
  return getVisitorStats(timeRange);
}
