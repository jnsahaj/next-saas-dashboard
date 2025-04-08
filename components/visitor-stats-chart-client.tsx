"use client";

import * as React from "react";
import { useTransition } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useQueryState, parseAsStringEnum } from "nuqs";

import { useIsMobile } from "@/hooks/use-mobile";
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
import type { DailyVisitorStats } from "@/lib/data/visitors";

// Chart configuration remains the same
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

// Define allowed time ranges again for the client
const timeRangeEnum = parseAsStringEnum(["90d", "30d", "7d"]);

interface VisitorStatsChartClientProps {
  initialData: DailyVisitorStats[];
}

export function VisitorStatsChartClient({
  initialData,
}: VisitorStatsChartClientProps) {
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();

  // Use nuqs on the client to manage the timeRange state
  const [timeRange, setTimeRange] = useQueryState(
    "range",
    timeRangeEnum.withDefault("90d").withOptions({ shallow: false }) // Use shallow routing to trigger server refetch
  );

  // Effect to set default range on mobile, if needed (could also be server-driven)
  React.useEffect(() => {
    if (isMobile && timeRange !== "7d") {
      // Check current state before setting to avoid unnecessary updates
      startTransition(() => {
        setTimeRange("7d");
      });
    }
  }, [isMobile, timeRange, setTimeRange]);

  // Data is now passed as a prop, no filtering needed here
  const chartData = initialData;

  const timeRangeLabelMap = {
    "90d": "Last 3 months",
    "30d": "Last 30 days",
    "7d": "Last 7 days",
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {timeRangeLabelMap[timeRange] ?? "Selected Period"}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRangeLabelMap[timeRange]}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange ?? "90d"} // Provide default if null
            onValueChange={(value) => {
              if (value) {
                startTransition(() => {
                  setTimeRange(value as "90d" | "30d" | "7d");
                });
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange ?? "90d"} // Provide default if null
            onValueChange={(value) => {
              startTransition(() => {
                setTimeRange(value as "90d" | "30d" | "7d");
              });
            }}
          >
            <SelectTrigger
              className="flex w-40 data-[slot=select-value]:block data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              {/* Use value directly if not null, otherwise placeholder */}
              <SelectValue placeholder={timeRangeLabelMap["90d"]}>
                {timeRange
                  ? timeRangeLabelMap[timeRange]
                  : timeRangeLabelMap["90d"]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent
        className={`px-2 pt-4 sm:px-6 sm:pt-6 transition-opacity duration-300 ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            {" "}
            {/* Use fetched data */}
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
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
                const date = new Date(value + "T00:00:00"); // Ensure proper date parsing
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={-1} // Let recharts handle default or remove if not needed
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    try {
                      const date = new Date(value + "T00:00:00"); // Ensure proper date parsing
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    } catch (e) {
                      console.error(e);
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
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
