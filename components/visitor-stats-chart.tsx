"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useQueryState, parseAsStringEnum } from "nuqs";
import useSWR from "swr";

import { useIsMobile } from "@/hooks/use-mobile";
import { fetchVisitorStatsAction } from "@/lib/actions/visitors";
import {
  ALLOWED_TIME_RANGES,
  TimeRange,
  timeRangeLabelMap,
} from "@/lib/types/visitors";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const timeRangeEnum = parseAsStringEnum<TimeRange>([...ALLOWED_TIME_RANGES]);

export function VisitorStatsChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useQueryState<TimeRange>(
    "range",
    timeRangeEnum.withDefault("90d").withOptions({ shallow: false })
  );

  const { data: chartData, isLoading } = useSWR(
    timeRange ? ["visitorStats", timeRange] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, range]) => fetchVisitorStatsAction(range as TimeRange),
    {
      keepPreviousData: true,
      fallbackData: [],
    }
  );

  useEffect(() => {
    if (isMobile && timeRange !== "7d") {
      setTimeRange("7d");
    }
  }, [isMobile, timeRange, setTimeRange]);

  const currentLabel = timeRange
    ? timeRangeLabelMap[timeRange]
    : timeRangeLabelMap["90d"];

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{currentLabel}</span>
          <span className="@[540px]/card:hidden">{currentLabel}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange ?? "90d"}
            onValueChange={(value: string | null) => {
              if (value) {
                setTimeRange(value as TimeRange);
              }
            }}
            variant="outline"
            disabled={isLoading}
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            {(Object.keys(timeRangeLabelMap) as TimeRange[]).map((range) => (
              <ToggleGroupItem key={range} value={range}>
                {timeRangeLabelMap[range]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select
            value={timeRange ?? "90d"}
            onValueChange={(value: TimeRange) => {
              setTimeRange(value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              className="flex w-40 data-[slot=select-value]:block data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder={timeRangeLabelMap["90d"]}>
                {currentLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {(Object.keys(timeRangeLabelMap) as TimeRange[]).map((range) => (
                <SelectItem key={range} value={range} className="rounded-lg">
                  {timeRangeLabelMap[range]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading && !chartData?.length ? (
          <div className="flex h-[250px] w-full flex-col justify-end gap-2 rounded-md bg-muted/30 p-4">
            <div className="flex items-baseline gap-1">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-6 w-1/6" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-px w-full" />
            <div className="flex items-baseline gap-1 pt-2">
              <Skeleton className="h-8 w-1/5" />
              <Skeleton className="h-6 w-1/6" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData ?? []}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value + "T00:00:00Z");
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch {
                    return value;
                  }
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      try {
                        const date = new Date(value + "T00:00:00Z");
                        return date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        });
                      } catch (e) {
                        console.error("Error formatting tooltip label:", e);
                        return value;
                      }
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                strokeWidth={2}
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                strokeWidth={2}
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
