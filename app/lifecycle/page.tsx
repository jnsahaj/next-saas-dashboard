import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  LifeBuoy,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LifecycleChart } from "./components/lifecycle-chart";
import { LifecycleTable } from "./components/lifecycle-table";

export default function LifecyclePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customer Lifecycle</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Last 30 days
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 3 months</DropdownMenuItem>
              <DropdownMenuItem>Last 12 months</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button> */}
          <Button size="sm">
            Export Report
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Acquisition Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">↑ 2.1%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Activation Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">↑ 4.7%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Retention Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 font-medium">↓ 1.3%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.7%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 font-medium">↑ 0.8%</span> from
              last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lifecycle Stages</CardTitle>
                <CardDescription>
                  Customer distribution across lifecycle stages
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LifecycleChart />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Conversion Rates</CardTitle>
              <CardDescription>
                Stage-to-stage conversion performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span>Visitor to Lead</span>
                    </div>
                    <span className="font-medium">32.4%</span>
                  </div>
                  <Progress value={32.4} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span>Lead to Qualified Lead</span>
                    </div>
                    <span className="font-medium">58.7%</span>
                  </div>
                  <Progress value={58.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span>Qualified Lead to Customer</span>
                    </div>
                    <span className="font-medium">24.8%</span>
                  </div>
                  <Progress value={24.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span>Customer to Repeat Customer</span>
                    </div>
                    <span className="font-medium">68.3%</span>
                  </div>
                  <Progress value={68.3} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span>Repeat Customer to Advocate</span>
                    </div>
                    <span className="font-medium">12.9%</span>
                  </div>
                  <Progress value={12.9} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Health</CardTitle>
              <CardDescription>Key metrics by segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">New Users</div>
                      <div className="text-xs text-muted-foreground">
                        Last 30 days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">1,248</div>
                      <div className="text-xs text-emerald-500">+12.3%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Engagement Score</div>
                      <div className="text-xs text-muted-foreground">
                        Avg. per user
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">72/100</div>
                      <div className="text-xs text-emerald-500">+4.8%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Support Tickets</div>
                      <div className="text-xs text-muted-foreground">
                        Per 100 users
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">3.2</div>
                      <div className="text-xs text-emerald-500">-8.1%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Avg. Time to Activate</div>
                      <div className="text-xs text-muted-foreground">
                        In days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">4.7</div>
                      <div className="text-xs text-emerald-500">-1.2 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lifecycle Campaigns</CardTitle>
                <CardDescription>
                  Active campaigns by lifecycle stage
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All Campaigns
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LifecycleTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
