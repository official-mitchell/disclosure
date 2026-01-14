// Check unmigrated players script
// Changes:
// - Updated: Use singleton prisma instance from lib/db instead of creating new PrismaClient
import { prisma } from "../lib/db";

async function main() {
  // Get all players with raw query to see actual enum values
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
    ORDER BY name
  `;

  console.log(`\n📊 Total Players: ${players.length}\n`);

  const oldArchetypes = ['SCIENTIST', 'SPY', 'DIPLOMAT', 'GENERAL', 'EXECUTIVE', 'JOURNALIST', 'OPERATIVE'];
  const unmigrated = players.filter(p => oldArchetypes.includes(p.archetype));

  if (unmigrated.length > 0) {
    console.log(`⚠️  Found ${unmigrated.length} players with old archetype values:\n`);
    unmigrated.forEach(p => {
      console.log(`   ${p.name}: ${p.country} ${p.demeanor} ${p.archetype}`);
    });
  } else {
    console.log(`✅ All players have been migrated to new archetype values!`);
  }

  console.log(`\n✓ Migrated: ${players.length - unmigrated.length}`);
  console.log(`✗ Unmigrated: ${unmigrated.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
