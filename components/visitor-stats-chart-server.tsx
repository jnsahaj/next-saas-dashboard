import * as React from "react";
import { getVisitorStats, type DailyVisitorStats } from "@/lib/data/visitors";
import { VisitorStatsChartClient } from "@/components/visitor-stats-chart-client";

export const description =
  "An interactive area chart powered by database data.";

type TimeRange = "90d" | "30d" | "7d";
const ALLOWED_TIME_RANGES: TimeRange[] = ["90d", "30d", "7d"];
const DEFAULT_TIME_RANGE: TimeRange = "90d";

export async function VisitorStatsChartServer({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rangeParam = searchParams?.range;
  let timeRange: TimeRange = DEFAULT_TIME_RANGE;

  if (
    typeof rangeParam === "string" &&
    (ALLOWED_TIME_RANGES as string[]).includes(rangeParam)
  ) {
    timeRange = rangeParam as TimeRange;
  }

  const chartData: DailyVisitorStats[] = await getVisitorStats(timeRange);

  return <VisitorStatsChartClient initialData={chartData} />;
}
