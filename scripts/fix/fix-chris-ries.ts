import { prisma } from '../lib/db';

async function main() {
  console.log('Checking Chris/Carson/ChrisR players...\n');

  // Find all relevant players
  const players = await prisma.player.findMany({
    where: {
      OR: [
        { name: 'ChrisR' },
        { name: 'Carson' },
        { name: 'Chris' }
      ]
    },
    include: {
      character: true
    }
  });

  console.log('Current state:');
  for (const player of players) {
    console.log(`  Player: ${player.name} (PIN: ${player.pin})`);
    if (player.character) {
      console.log(`    Character displayName: ${player.character.displayName}`);
    } else {
      console.log(`    No character linked`);
    }
  }

  // Find Carson player if exists
  const carsonPlayer = await prisma.player.findUnique({
    where: { name: 'Carson' }
  });

  if (carsonPlayer) {
    console.log('\n✓ Updating Carson -> ChrisR...');
    await prisma.player.update({
      where: { name: 'Carson' },
      data: { name: 'ChrisR' }
    });
    console.log('✓ Player renamed to ChrisR');
  }

  // Find ChrisR player and fix character displayName
  const chrisRPlayer = await prisma.player.findUnique({
    where: { name: 'ChrisR' },
    include: { character: true }
  });

  if (chrisRPlayer && chrisRPlayer.character) {
    if (chrisRPlayer.character.displayName !== 'Lt. Chris Ries') {
      console.log(`\n✓ Updating character displayName from "${chrisRPlayer.character.displayName}" to "Lt. Chris Ries"...`);
      await prisma.character.update({
        where: { id: chrisRPlayer.character.id },
        data: { displayName: 'Lt. Chris Ries' }
      });
      console.log('✓ Character displayName updated');
    } else {
      console.log('\n✓ Character displayName already correct: Lt. Chris Ries');
    }
  } else {
    console.log('\n⚠ ChrisR player or character not found');
  }

  console.log('\n✅ Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
