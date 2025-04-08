import { Suspense } from "react";
import { VisitorStatsChart } from "@/components/dashboard/visitor-stats-chart";
import { DocumentsTable } from "@/components/dashboard/documents-table";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { getDocuments } from "@/lib/data/documents"; // Import the new data fetching function

export default async function Page() {
  // Make the component async
  const documentsPromise = getDocuments(); // Fetch data

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <MetricsCards />
            <div className="px-4 lg:px-6">
              <Suspense fallback={<div>Loading chart...</div>}>
                <VisitorStatsChart />
              </Suspense>
            </div>
            <DocumentsTable documentsPromise={documentsPromise} />
          </div>
        </div>
      </div>
    </>
  );
}
