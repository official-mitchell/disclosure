import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up old schema structures...\n");

  try {
    // Step 1: Drop old columns from Clue table
    console.log("Removing old targeting columns from Clue table...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Clue"
      DROP COLUMN IF EXISTS "targetType",
      DROP COLUMN IF EXISTS "targetValue";
    `);
    console.log("✓ Old targeting columns removed\n");

    // Step 2: We cannot remove enum values in PostgreSQL, but we can verify new values exist
    console.log("Verifying enum types...");
    const archetypeValues = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = '"Archetype"'::regtype
      ORDER BY enumsortorder;
    `;

    console.log("\nCurrent Archetype values:");
    archetypeValues.forEach((v) => console.log(`  - ${v.enumlabel}`));

    const demeanorValues = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = '"Demeanor"'::regtype
      ORDER BY enumsortorder;
    `;

    console.log("\nCurrent Demeanor values:");
    demeanorValues.forEach((v) => console.log(`  - ${v.enumlabel}`));

    console.log("\n✅ Post-migration cleanup complete!");
    console.log("\n📝 Final step:");
    console.log("Run: npx prisma generate");
    console.log("This will update the Prisma Client with the new schema.");
  } catch (error) {
    console.error("❌ Error during post-migration cleanup:", error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
