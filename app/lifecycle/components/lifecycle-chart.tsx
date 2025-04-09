"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import * as Recharts from "recharts";

const data = [
  {
    name: "Visitor",
    count: 4820,
    previousCount: 4250,
  },
  {
    name: "Lead",
    count: 1562,
    previousCount: 1380,
  },
  {
    name: "Qualified Lead",
    count: 918,
    previousCount: 840,
  },
  {
    name: "Customer",
    count: 228,
    previousCount: 210,
  },
  {
    name: "Repeat Customer",
    count: 156,
    previousCount: 142,
  },
  {
    name: "Advocate",
    count: 20,
    previousCount: 18,
  },
];

const chartConfig = {
  count: {
    label: "Current Period",
    theme: {
      light: "var(--chart-1)",
      dark: "var(--chart-1)",
    },
  },
  previousCount: {
    label: "Previous Period",
    theme: {
      light: "var(--chart-2)",
      dark: "var(--chart-2)",
    },
  },
};

export function LifecycleChart() {
  return (
    <ChartContainer config={chartConfig}>
      <Recharts.BarChart data={data}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="name" />
        <Recharts.YAxis />
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              indicator="dot"
            />
          )}
        />
        <ChartLegendContent />
        <Recharts.Bar dataKey="count" radius={[4, 4, 0, 0]} />
        <Recharts.Bar dataKey="previousCount" radius={[4, 4, 0, 0]} />
      </Recharts.BarChart>
    </ChartContainer>
  );
}
