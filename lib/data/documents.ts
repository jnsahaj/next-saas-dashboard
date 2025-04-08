import { db } from "@/lib/db";
import { documentSections, users } from "@/lib/schema"; // Assuming 'documentsSections' and 'users' tables exist
import { asc, eq } from "drizzle-orm";

export interface Document {
  id: string;
  header: string;
  type: string | null;
  status: string | null;
  target: string;
  limit: string;
  reviewer: string | null;
  order: number;
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const result = await db
      .select({
        id: documentSections.id,
        header: documentSections.header,
        type: documentSections.sectionType,
        status: documentSections.status,
        target: documentSections.target,
        limit: documentSections.limit,
        reviewerName: users.name,
        order: documentSections.order,
      })
      .from(documentSections)
      .leftJoin(users, eq(documentSections.reviewerId, users.id))
      .orderBy(asc(documentSections.order));

    return result.map((doc) => ({
      id: doc.id,
      header: doc.header,
      type: doc.type ?? "Unknown",
      status: doc.status ?? "Not Started",
      target: String(doc.target ?? 0),
      limit: String(doc.limit ?? 0),
      reviewer: doc.reviewerName,
      order: doc.order,
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}
