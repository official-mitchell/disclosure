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
  console.log("📋 Migrating example players with old archetype values...\n");

  const oldArchetypes = Object.keys(ARCHETYPE_MAPPING);

  // Get all players with old archetype values using raw query
  const players = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      archetype: string;
      country: string;
      demeanor: string;
    }>
  >`
    SELECT id, name, archetype, country, demeanor
    FROM "Player"
  `;

  const toMigrate = players.filter(p => oldArchetypes.includes(p.archetype));

  console.log(`Found ${toMigrate.length} players to migrate\n`);

  let updated = 0;
  let errors = 0;

  for (const player of toMigrate) {
    try {
      const newArchetype = ARCHETYPE_MAPPING[player.archetype];

      if (!newArchetype) {
        console.log(`⚠️  No mapping found for archetype: ${player.archetype}`);
        continue;
      }

      await prisma.$executeRawUnsafe(`
        UPDATE "Player"
        SET "archetype" = '${newArchetype}'::"Archetype"
        WHERE "id" = '${player.id}'
      `);

      console.log(`✓ Updated ${player.name}: ${player.archetype} → ${newArchetype}`);
      updated++;
    } catch (error) {
      console.log(`✗ Error updating ${player.name}: ${(error as Error).message}`);
      errors++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`\n✅ Example player migration complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
