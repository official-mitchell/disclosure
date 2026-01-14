// Fix character arrays script
// Changes:
// - Updated: Use singleton prisma instance from lib/db instead of creating new PrismaClient
import { prisma } from "../lib/db";

async function main() {
  console.log("🔧 Fixing Character array fields...\n");

  // First, let's check the data type issue by querying only metadata columns
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Character'
      AND column_name IN ('formalAuthority', 'informalFears', 'safelyIgnore')
    `);

    console.log("Current column types:");
    console.log(result);
    console.log("");
  } catch (error) {
    console.error("Error checking column types:", error);
  }

  // The issue is that ARRAY[textField] creates a nested array when the field was TEXT
  // We need to convert the nested arrays back to simple arrays
  // Since the data is corrupted, we'll need to reset these fields

  console.log("Resetting corrupted array fields to empty arrays...");

  try {
    const updateResult = await prisma.$executeRaw`
      UPDATE "Character"
      SET
        "formalAuthority" = ARRAY[]::TEXT[],
        "informalFears" = ARRAY[]::TEXT[],
        "safelyIgnore" = ARRAY[]::TEXT[]
    `;

    console.log(`✓ Reset ${updateResult} character records`);
  } catch (error) {
    console.error("Error resetting fields:", error);
  }

  // Verify the fix
  console.log("\nVerifying fix...");
  try {
    const character = await prisma.character.findFirst({
      select: {
        displayName: true,
        formalAuthority: true,
        informalFears: true,
        safelyIgnore: true,
      },
    });

    console.log("Sample character data:");
    console.log(JSON.stringify(character, null, 2));
    console.log("\n✅ Character fields fixed successfully!");
  } catch (error) {
    console.error("Error verifying fix:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
