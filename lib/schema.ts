import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  uuid,
  pgEnum,
  primaryKey,
  index,
  uniqueIndex,
  numeric, // For currency like Total Revenue
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Enums ---

// Enum for document section status, based on the 'Status' column
export const documentSectionStatusEnum = pgEnum("document_section_status", [
  "In Process",
  "Done",
  "Pending Review", // Added hypothetical status
  "Blocked", // Added hypothetical status
]);

// Enum for document section type, based on the 'Section Type' column
export const documentSectionTypeEnum = pgEnum("document_section_type", [
  "Cover page",
  "Table of contents",
  "Narrative",
  "Technical content",
  "Executive summary", // Explicitly add types visible
  "Design",
  "Capabilities",
  "Integration with existing systems",
  "Innovation and Advantages",
  "Overview of EMR's Innovative Solutions", // Can be long, consider varchar limit if needed
  "Advanced Algorithms and Machine Learning",
  "Other", // Fallback type
]);

// Enum for visitor device type, based on the chart tooltip
export const visitorDeviceTypeEnum = pgEnum("visitor_device_type", [
  "Mobile",
  "Desktop",
  "Other", // Fallback type
]);

// --- Tables ---

// Users table - For reviewers, team members, logged-in user
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    avatarUrl: text("avatar_url"), // URL to the user's profile picture
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    // Add other user-related fields like password hash, roles, etc. if needed
    // lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

// Documents table - Represents the overall document container
export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null", // Or 'cascade' depending on desired behavior
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // Potentially add fields like version, overall status, etc.
});

// Document Sections table - Represents the rows in the main table view
export const documentSections = pgTable(
  "document_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }), // Sections belong to a document
    header: text("header").notNull(), // e.g., "Cover page", "Executive summary"
    sectionType: documentSectionTypeEnum("section_type"), // Uses the enum defined above
    status: documentSectionStatusEnum("status").default("In Process"), // Uses the enum
    target: integer("target"), // Word count target? Page target? Clarify meaning.
    limit: integer("limit"), // Word count limit? Page limit? Clarify meaning.
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null", // Allow unassigning reviewers
    }),
    order: integer("order").notNull().default(0), // For maintaining display order
    content: text("content"), // Optional: Store actual section content here if not elsewhere
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("doc_id_order_idx").on(table.documentId, table.order), // Index for ordering sections within a doc
    index("reviewer_idx").on(table.reviewerId),
    index("status_idx").on(table.status), // Index for filtering by status
  ]
);

// Visitor Stats table - To power the "Total Visitors" chart
export const visitorStats = pgTable(
  "visitor_stats",
  {
    id: serial("id").primaryKey(), // Simple auto-incrementing ID
    date: timestamp("date", { mode: "date" }).notNull(), // Store the date (day) of the stats
    deviceType: visitorDeviceTypeEnum("device_type").notNull(), // Mobile, Desktop, etc.
    visitorCount: integer("visitor_count").notNull().default(0),
    // Optional: Add unique constraint on date + deviceType if granularity is daily per device
    // unique (date, deviceType)
  },
  (table) => [
    uniqueIndex("date_device_idx").on(table.date, table.deviceType),
    index("date_idx").on(table.date), // Index for querying by date range
  ]
);

// Aggregate Metrics table - To store the summary KPIs (optional, could be calculated)
// This simplifies fetching the top-level dashboard numbers.
// Could be updated periodically by a background job.
export const dashboardMetrics = pgTable("dashboard_metrics", {
  id: serial("id").primaryKey(), // Or just use a single row with id=1
  recordedAt: timestamp("recorded_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  totalRevenue: numeric("total_revenue", { precision: 12, scale: 2 }), // e.g., 1234567890.12
  newCustomers: integer("new_customers"),
  activeAccounts: integer("active_accounts"),
  growthRate: numeric("growth_rate", { precision: 5, scale: 2 }), // e.g., 4.50 (%)
  // Add period identifiers if tracking changes (e.g., 'last_30_days', 'last_quarter')
  // period: varchar('period', { length: 50 }).notNull(),
});

// Teams table (based on nav)
export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Team Members junction table (Many-to-Many between Users and Teams)
export const teamMembers = pgTable(
  "team_members",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("Member"), // e.g., Member, Admin, Lead
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.teamId] }), // Composite primary key
    index("team_idx").on(table.teamId),
    index("user_idx").on(table.userId),
  ]
);

// Projects table (based on nav)
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // Could link to a team or owner
  // teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
  // ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  // One user can be the reviewer for many document sections
  reviewedSections: many(documentSections, { relationName: "Reviewer" }),
  // One user can own many documents
  ownedDocuments: many(documents, { relationName: "DocumentOwner" }),
  // Many-to-many relationship with teams via teamMembers
  teamMemberships: many(teamMembers),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  // Each document belongs to one owner (user)
  owner: one(users, {
    fields: [documents.ownerId],
    references: [users.id],
    relationName: "DocumentOwner",
  }),
  // Each document has many sections
  sections: many(documentSections),
}));

export const documentSectionsRelations = relations(
  documentSections,
  ({ one }) => ({
    // Each section belongs to one document
    document: one(documents, {
      fields: [documentSections.documentId],
      references: [documents.id],
    }),
    // Each section can have one reviewer (user)
    reviewer: one(users, {
      fields: [documentSections.reviewerId],
      references: [users.id],
      relationName: "Reviewer",
    }),
  })
);

export const teamsRelations = relations(teams, ({ many }) => ({
  // Many-to-many relationship with users via teamMembers
  memberships: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  // Each membership record belongs to one team
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  // Each membership record belongs to one user
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Add relations for Projects if they link to Teams/Users
// export const projectsRelations = relations(projects, ({ one }) => ({
//   team: one(teams, { ... }),
//   owner: one(users, { ... }),
// }));

// Note: Relations for visitorStats and dashboardMetrics are usually not needed
// as they are typically queried directly by date/period rather than joining.
