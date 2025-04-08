import { db } from "@/lib/db";
import { visitorStats } from "@/lib/schema";
import { sql } from "drizzle-orm";

// Helper function to calculate the start date based on the time range
function getStartDate(timeRange: "90d" | "30d" | "7d"): Date {
  const referenceDate = new Date(); // Use current date as reference
  let daysToSubtract = 90;
  if (timeRange === "30d") {
    daysToSubtract = 30;
  } else if (timeRange === "7d") {
    daysToSubtract = 7;
  }
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  startDate.setHours(0, 0, 0, 0); // Set to start of the day
  return startDate;
}

export interface DailyVisitorStats {
  date: string; // Format YYYY-MM-DD
  desktop: number;
  mobile: number;
}

/**
 * Fetches and aggregates visitor stats for the specified time range.
 * Groups stats by day and pivots device types into columns.
 */
export async function getVisitorStats(
  timeRange: "90d" | "30d" | "7d" = "90d"
): Promise<DailyVisitorStats[]> {
  const startDate = getStartDate(timeRange);

  // Drizzle doesn't directly support PIVOT or conditional aggregation in the ORM syntax easily.
  // We use a raw SQL query for aggregation. Ensure your column names match exactly.
  // Note: We cast counts to integer as SUM returns numeric/bigint.
  const query = sql`
    SELECT
      to_char(date, \'YYYY-MM-DD\') AS date,
      COALESCE(SUM(CASE WHEN "device_type" = \'Desktop\' THEN "visitor_count" ELSE 0 END)::integer, 0) AS desktop,
      COALESCE(SUM(CASE WHEN "device_type" = \'Mobile\' THEN "visitor_count" ELSE 0 END)::integer, 0) AS mobile
    FROM ${visitorStats}
    WHERE date >= ${startDate}
    GROUP BY to_char(date, \'YYYY-MM-DD\')
    ORDER BY date ASC;
  `;

  try {
    // Type the expected row structure for clarity
    interface QueryResultRow {
      date: string;
      desktop: number | string | null;
      mobile: number | string | null;
    }

    // Let drizzle infer the result type, assuming it has a `rows` property
    const result = await db.execute(query);

    // Perform a safe type assertion via unknown
    const resultWithRows = result as unknown as { rows: QueryResultRow[] };

    // Check if result has a rows property and it's an array
    if (!resultWithRows || !Array.isArray(resultWithRows.rows)) {
      console.error("Unexpected result format from db.execute:", result);
      return [];
    }

    // Type the rows explicitly here
    const rows = resultWithRows.rows;

    const formattedResult: DailyVisitorStats[] = rows.map(
      (row: QueryResultRow) => ({
        date: row.date,
        desktop: Number(row.desktop ?? 0),
        mobile: Number(row.mobile ?? 0),
      })
    );

    return formattedResult;
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return []; // Return empty array on error
  }
}
