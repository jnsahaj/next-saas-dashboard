import { VisitorStatsChartServer } from "@/components/visitor-stats-chart-server";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

import data from "./data.json"; // Assuming data.json is now in ./app/

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <VisitorStatsChartServer searchParams={searchParams} />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
