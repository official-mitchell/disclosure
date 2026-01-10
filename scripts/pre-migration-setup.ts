import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Setting up database for migration...\n");

  try {
    // Step 1: Create Demeanor enum type
    console.log("Creating Demeanor enum...");
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Demeanor" AS ENUM ('ANTI_DISCLOSURE', 'AGNOSTIC', 'PRO_DISCLOSURE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("✓ Demeanor enum created\n");

    // Step 2: Add new archetype values to existing Archetype enum
    console.log("Adding new archetype values...");
    const newArchetypes = [
      "MILITARY_DEFENSE_CONTRACTOR",
      "HIGH_RANKING_POLITICIAN",
      "INTEL_OLIGARCH",
      "JOURNALIST_MEDIA",
      "HIGH_RANKING_SCIENTIST",
    ];

    for (const archetype of newArchetypes) {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TYPE "Archetype" ADD VALUE IF NOT EXISTS '${archetype}';
        `);
        console.log(`  Added: ${archetype}`);
      } catch (err) {
        // Value might already exist, that's ok
      }
    }
    console.log("✓ New archetype values added\n");

    // Step 3: Add demeanor column to Player table
    console.log("Adding demeanor column to Player table...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Player"
      ADD COLUMN IF NOT EXISTS "demeanor" "Demeanor" DEFAULT 'AGNOSTIC';
    `);
    console.log("✓ Demeanor column added\n");

    // Step 4: Add new targeting columns to Clue table
    console.log("Adding new targeting columns to Clue table...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Clue"
      ADD COLUMN IF NOT EXISTS "targetCountry" "Country",
      ADD COLUMN IF NOT EXISTS "targetArchetype" "Archetype",
      ADD COLUMN IF NOT EXISTS "targetDemeanor" "Demeanor",
      ADD COLUMN IF NOT EXISTS "targetPlayer" TEXT;
    `);
    console.log("✓ New targeting columns added\n");

    console.log("✅ Pre-migration setup complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Run: npx tsx scripts/migrate-players.ts");
    console.log("2. Run: npx tsx scripts/migrate-clues.ts");
    console.log("3. Run: npx tsx scripts/post-migration-cleanup.ts");
  } catch (error) {
    console.error("❌ Error during pre-migration setup:", error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
