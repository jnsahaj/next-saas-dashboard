"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const campaigns = [
  {
    id: "CAM001",
    name: "Welcome Email Series",
    stage: "Acquisition",
    status: "Active",
    audience: "New Visitors",
    performance: "High",
    conversion: "24.8%",
    lastUpdated: "2023-04-12",
  },
  {
    id: "CAM002",
    name: "Product Onboarding Flow",
    stage: "Activation",
    status: "Active",
    audience: "New Customers",
    performance: "Medium",
    conversion: "68.3%",
    lastUpdated: "2023-04-10",
  },
  {
    id: "CAM003",
    name: "Feature Adoption Campaign",
    stage: "Activation",
    status: "Active",
    audience: "Existing Users",
    performance: "Medium",
    conversion: "42.1%",
    lastUpdated: "2023-04-08",
  },
  {
    id: "CAM004",
    name: "Renewal Reminder Sequence",
    stage: "Retention",
    status: "Active",
    audience: "Expiring Subscriptions",
    performance: "High",
    conversion: "76.2%",
    lastUpdated: "2023-04-05",
  },
  {
    id: "CAM005",
    name: "Win-back Campaign",
    stage: "Retention",
    status: "Paused",
    audience: "Churned Customers",
    performance: "Low",
    conversion: "5.7%",
    lastUpdated: "2023-04-01",
  },
  {
    id: "CAM006",
    name: "Referral Program",
    stage: "Referral",
    status: "Active",
    audience: "Satisfied Customers",
    performance: "Medium",
    conversion: "12.9%",
    lastUpdated: "2023-03-28",
  },
];

export function LifecycleTable() {
  const [data] = useState(campaigns);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Lifecycle Stage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target Audience</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Conversion Rate</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    campaign.stage === "Acquisition"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : campaign.stage === "Activation"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : campaign.stage === "Retention"
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : "border-orange-200 bg-orange-50 text-orange-700"
                  }
                >
                  {campaign.stage}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    campaign.status === "Active" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>{campaign.audience}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    campaign.performance === "High"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : campaign.performance === "Medium"
                      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                >
                  {campaign.performance}
                </Badge>
              </TableCell>
              <TableCell>{campaign.conversion}</TableCell>
              <TableCell>
                {new Date(campaign.lastUpdated).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View campaign details</DropdownMenuItem>
                    <DropdownMenuItem>Edit campaign</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Pause campaign</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
