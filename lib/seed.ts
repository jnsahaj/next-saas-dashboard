import { db } from "./db";
import { faker } from "@faker-js/faker";
import * as schema from "./schema";
// --- Clear existing data (optional, but common for seeding) ---
async function clearDatabase() {
  console.log("🗑️ Clearing existing data...");
  // Delete in reverse order of dependencies
  await db.delete(schema.teamMembers);
  await db.delete(schema.documentSections);
  await db.delete(schema.visitorStats);
  await db.delete(schema.dashboardMetrics);
  await db.delete(schema.documents);
  await db.delete(schema.users);
  await db.delete(schema.teams);
  await db.delete(schema.projects);
  console.log("✅ Database cleared");
}

// --- Main Seeding Function ---
async function main() {
  await clearDatabase(); // Optional: Reset DB before seeding

  // --- Seed Users ---
  console.log("👤 Seeding users...");
  const insertedUsers = await db
    .insert(schema.users)
    .values(
      Array.from({ length: 10 }, () => ({
        // Create 10 users
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        avatarUrl: faker.image.avatar(),
      }))
    )
    .returning({ id: schema.users.id, email: schema.users.email }); // Get IDs back
  console.log(`✅ ${insertedUsers.length} users seeded.`);

  // --- Seed Teams ---
  console.log("👥 Seeding teams...");
  const teamNames = [
    "Alpha Team",
    "Bravo Team",
    "Design Crew",
    "Backend Guild",
  ];
  const insertedTeams = await db
    .insert(schema.teams)
    .values(teamNames.map((name) => ({ name })))
    .returning({ id: schema.teams.id });
  console.log(`✅ ${insertedTeams.length} teams seeded.`);

  // --- Seed Team Members (Junction Table) ---
  console.log("🔗 Seeding team members...");
  const teamMemberships = [];
  for (const user of insertedUsers) {
    // Assign each user to 1 or 2 random teams
    const numTeams = faker.number.int({ min: 1, max: 2 });
    const teamsToJoin = faker.helpers.arrayElements(insertedTeams, numTeams);
    for (const team of teamsToJoin) {
      teamMemberships.push({
        userId: user.id,
        teamId: team.id,
        role: faker.helpers.arrayElement(["Member", "Lead", "Admin"]),
      });
    }
  }
  // Remove potential duplicate user/team pairs if a user was randomly assigned the same team twice
  const uniqueTeamMemberships = Array.from(
    new Map(
      teamMemberships.map((item) => [`${item.userId}-${item.teamId}`, item])
    ).values()
  );
  if (uniqueTeamMemberships.length > 0) {
    await db.insert(schema.teamMembers).values(uniqueTeamMemberships);
    console.log(`✅ ${uniqueTeamMemberships.length} team memberships seeded.`);
  }

  // --- Seed Documents ---
  console.log("📄 Seeding documents...");
  const insertedDocs = await db
    .insert(schema.documents)
    .values(
      Array.from({ length: 5 }, () => ({
        // Create 5 documents
        title: faker.lorem.sentence(4),
        ownerId: faker.helpers.arrayElement(insertedUsers).id, // Assign random owner
      }))
    )
    .returning({ id: schema.documents.id });
  console.log(`✅ ${insertedDocs.length} documents seeded.`);

  // --- Seed Document Sections ---
  console.log("📑 Seeding document sections...");
  const sectionsData = [];
  const sectionTypes = schema.documentSectionTypeEnum.enumValues;
  const sectionStatuses = schema.documentSectionStatusEnum.enumValues;

  for (const doc of insertedDocs) {
    const numSections = faker.number.int({ min: 3, max: 10 });
    for (let i = 0; i < numSections; i++) {
      sectionsData.push({
        documentId: doc.id,
        header: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
        sectionType: faker.helpers.arrayElement(sectionTypes),
        status: faker.helpers.arrayElement(sectionStatuses),
        target: faker.number.int({ min: 500, max: 2000 }), // Example word count
        limit: faker.number.int({ min: 2000, max: 5000 }), // Example word count limit
        reviewerId: faker.helpers.maybe(
          () => faker.helpers.arrayElement(insertedUsers).id,
          { probability: 0.7 }
        ), // 70% chance of having a reviewer
        order: i,
        content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 })), // Optional content
      });
    }
  }
  if (sectionsData.length > 0) {
    await db.insert(schema.documentSections).values(sectionsData);
    console.log(`✅ ${sectionsData.length} document sections seeded.`);
  }

  // --- Seed Visitor Stats ---
  console.log("📊 Seeding visitor stats...");
  const visitorStatsData = [];
  const deviceTypes = schema.visitorDeviceTypeEnum.enumValues;
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    // Seed data for last 90 days
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    for (const deviceType of deviceTypes) {
      // Avoid future dates if clearing isn't perfect
      if (date <= today) {
        visitorStatsData.push({
          // Drizzle expects Date object for date mode timestamps
          date: date,
          deviceType: deviceType,
          visitorCount: faker.number.int({ min: 50, max: 1000 }),
        });
      }
    }
  }
  if (visitorStatsData.length > 0) {
    // Use onConflictDoNothing() in case you run the seed multiple times without clearing
    await db
      .insert(schema.visitorStats)
      .values(visitorStatsData)
      .onConflictDoNothing(); // Good for stats where unique constraint exists
    console.log(`✅ ${visitorStatsData.length} visitor stat records seeded.`);
  }

  // --- Seed Dashboard Metrics (Example: one record for current metrics) ---
  console.log("📈 Seeding dashboard metrics...");
  await db
    .insert(schema.dashboardMetrics)
    .values({
      totalRevenue: faker.finance.amount({ min: 50000, max: 1000000, dec: 2 }),
      newCustomers: faker.number.int({ min: 50, max: 500 }),
      activeAccounts: faker.number.int({ min: 1000, max: 10000 }),
      growthRate: faker.finance.amount({ min: -5, max: 15, dec: 2 }), // Percentage
    })
    .onConflictDoNothing(); // Or update if you have a single row (id=1) strategy
  console.log("✅ Dashboard metrics seeded.");

  // --- Seed Projects ---
  console.log("🚀 Seeding projects...");
  const insertedProjects = await db
    .insert(schema.projects)
    .values(
      Array.from({ length: 8 }, () => ({
        name: faker.commerce.productName() + " Project",
        description: faker.lorem.paragraph(),
        // Add teamId or ownerId if you uncommented them in the schema
        // teamId: faker.helpers.arrayElement(insertedTeams).id
      }))
    )
    .returning({ id: schema.projects.id });
  console.log(`✅ ${insertedProjects.length} projects seeded.`);
}

// --- Run Seeding ---
const startTime = Date.now();
main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => {
    const endTime = Date.now();
    console.log(
      `✅ Seeding finished in ${((endTime - startTime) / 1000).toFixed(2)}s`
    );
    // You might not need to explicitly end the connection with serverless drivers
    // process.exit(0); // Exit cleanly
  });
