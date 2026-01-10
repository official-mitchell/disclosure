import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map old archetype enum values to new ones
const ARCHETYPE_MAPPING: Record<string, string> = {
  SCIENTIST: "HIGH_RANKING_SCIENTIST",
  SPY: "INTEL_OLIGARCH",
  DIPLOMAT: "HIGH_RANKING_POLITICIAN",
  GENERAL: "MILITARY_DEFENSE_CONTRACTOR",
  EXECUTIVE: "INTEL_OLIGARCH",
  JOURNALIST: "JOURNALIST_MEDIA",
  OPERATIVE: "INTEL_OLIGARCH",
};

async function main() {
  console.log("📋 Migrating clue targeting system...\n");

  // Get all clues with old targeting system
  const clues = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      targetType: string;
      targetValue: string | null;
    }>
  >`
    SELECT id, title, "targetType", "targetValue"
    FROM "Clue"
  `;

  console.log(`Found ${clues.length} clues to migrate\n`);

  let updated = 0;
  let errors = 0;

  for (const clue of clues) {
    try {
      let targetCountry: string | null = null;
      let targetArchetype: string | null = null;
      let targetDemeanor: string | null = null;
      let targetPlayer: string | null = null;

      if (clue.targetType === "all") {
        // All null - targets everyone
      } else if (clue.targetType === "country") {
        targetCountry = clue.targetValue;
      } else if (clue.targetType === "archetype") {
        // Map old archetype to new
        const oldArchetype = clue.targetValue?.toUpperCase() || "";
        targetArchetype = ARCHETYPE_MAPPING[oldArchetype] || oldArchetype;
      } else if (clue.targetType === "player") {
        targetPlayer = clue.targetValue;
      }

      // Build SQL with proper casting
      const countrySQL = targetCountry ? `'${targetCountry}'::"Country"` : "NULL";
      const archetypeSQL = targetArchetype
        ? `'${targetArchetype}'::"Archetype"`
        : "NULL";
      const demeanorSQL = targetDemeanor ? `'${targetDemeanor}'::"Demeanor"` : "NULL";
      const playerSQL = targetPlayer ? `'${targetPlayer.replace(/'/g, "''")}'` : "NULL";

      await prisma.$executeRawUnsafe(`
        UPDATE "Clue"
        SET
          "targetCountry" = ${countrySQL},
          "targetArchetype" = ${archetypeSQL},
          "targetDemeanor" = ${demeanorSQL},
          "targetPlayer" = ${playerSQL}
        WHERE "id" = '${clue.id}'
      `);

      const targetDesc =
        clue.targetType === "all"
          ? "Everyone"
          : `${clue.targetType}=${clue.targetValue || "null"}`;
      const newTargetDesc = [targetCountry, targetArchetype, targetDemeanor, targetPlayer]
        .filter(Boolean)
        .join(" + ") || "Everyone";

      console.log(`✓ Migrated "${clue.title}": ${targetDesc} → ${newTargetDesc}`);
      updated++;
    } catch (error) {
      console.log(`✗ Error migrating "${clue.title}": ${(error as Error).message}`);
      errors++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`\n✅ Clue migration complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
