import { PrismaClient } from '@prisma/client';

// This script exports players from one database and imports to another
// Usage:
//   Step 1: node export-import-players.ts export
//   Step 2: DATABASE_URL=<production-url> node export-import-players.ts import

const prisma = new PrismaClient();

async function exportPlayers() {
  const players = await prisma.player.findMany({
    include: {
      character: true,
    },
  });

  const data = JSON.stringify(players, null, 2);
  const fs = require('fs');
  fs.writeFileSync('players-export.json', data);

  console.log(`✓ Exported ${players.length} players to players-export.json`);
  console.log('\nNext step:');
  console.log('DATABASE_URL=<your-production-url> tsx scripts/export-import-players.ts import');
}

async function importPlayers() {
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('players-export.json', 'utf-8'));

  console.log(`Importing ${data.length} players...`);

  for (const playerData of data) {
    const { character, clueAssignments, ...player } = playerData;

    // Import player
    await prisma.player.upsert({
      where: { name: player.name },
      update: {
        pin: player.pin,
        country: player.country,
        archetype: player.archetype,
      },
      create: player,
    });

    // Import character if exists
    if (character) {
      const { id, playerId, ...charData } = character;
      const importedPlayer = await prisma.player.findUnique({
        where: { name: player.name },
      });

      if (importedPlayer) {
        await prisma.character.upsert({
          where: { playerId: importedPlayer.id },
          update: charData,
          create: {
            playerId: importedPlayer.id,
            ...charData,
          },
        });
      }
    }

    console.log(`✓ Imported ${player.name}`);
  }

  console.log(`\n✅ Import complete!`);
}

async function main() {
  const action = process.argv[2];

  if (action === 'export') {
    await exportPlayers();
  } else if (action === 'import') {
    await importPlayers();
  } else {
    console.log('Usage:');
    console.log('  tsx scripts/export-import-players.ts export');
    console.log('  DATABASE_URL=<prod-url> tsx scripts/export-import-players.ts import');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
