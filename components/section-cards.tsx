import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { db } from "@/lib/db";
import { dashboardMetrics } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { formatCurrency, formatPercentage } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function SectionCards() {
  const latestMetrics = await db
    .select()
    .from(dashboardMetrics)
    .orderBy(desc(dashboardMetrics.recordedAt))
    .limit(1)
    .then((res) => res[0]);

  const metrics = latestMetrics || {
    totalRevenue: "0",
    newCustomers: 0,
    activeAccounts: 0,
    growthRate: "0",
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(Number(metrics.totalRevenue))}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total revenue calculation <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on latest data</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.newCustomers?.toLocaleString() || "0"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New customer count <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on latest data</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeAccounts?.toLocaleString() || "0"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active user accounts <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on latest data</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(Number(metrics.growthRate) / 100)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Calculated growth rate <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on latest data</div>
        </CardFooter>
      </Card>
    </div>
  );
}
