import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Removing example players...\n");

  // Get all players with [EXAMPLE] in their name
  const examplePlayers = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
    }>
  >`
    SELECT id, name
    FROM "Player"
    WHERE name LIKE '[EXAMPLE]%'
  `;

  console.log(`Found ${examplePlayers.length} example players to remove:\n`);

  let deleted = 0;
  let errors = 0;

  for (const player of examplePlayers) {
    try {
      await prisma.$executeRawUnsafe(`
        DELETE FROM "Player"
        WHERE "id" = '${player.id}'
      `);

      console.log(`✓ Deleted: ${player.name}`);
      deleted++;
    } catch (error) {
      console.log(`✗ Error deleting ${player.name}: ${(error as Error).message}`);
      errors++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Deleted: ${deleted}`);
  console.log(`Errors: ${errors}`);
  console.log(`\n✅ Example player removal complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
