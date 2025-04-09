import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Metrics Cards Skeleton */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="px-4 lg:px-6">
            <Skeleton className="h-[300px] w-full" />
          </div>

          {/* Documents Table Skeleton */}
          <div className="space-y-4 px-4 lg:px-6">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
