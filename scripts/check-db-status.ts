import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const playerCount = await prisma.player.count();
    const clueCount = await prisma.clue.count();

    console.log(`\n📊 Database Status:`);
    console.log(`   Players: ${playerCount}`);
    console.log(`   Clues: ${clueCount}\n`);

    // Check if players have been migrated (check for new fields)
    const samplePlayers = await prisma.player.findMany({
      take: 3,
      select: {
        name: true,
        country: true,
        demeanor: true,
        archetype: true,
      }
    });

    console.log(`Sample Players:`);
    samplePlayers.forEach(p => {
      console.log(`   ${p.name}: ${p.country} ${p.demeanor} ${p.archetype}`);
    });

    // Check if clues have been migrated
    const sampleClues = await prisma.clue.findMany({
      take: 3,
      select: {
        title: true,
        targetCountry: true,
        targetArchetype: true,
        targetDemeanor: true,
        targetPlayer: true,
      }
    });

    console.log(`\nSample Clues:`);
    sampleClues.forEach(c => {
      const targets = [
        c.targetCountry,
        c.targetArchetype,
        c.targetDemeanor,
        c.targetPlayer
      ].filter(Boolean);
      const targetStr = targets.length ? targets.join(' + ') : 'Everyone';
      console.log(`   "${c.title}": ${targetStr}`);
    });

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
