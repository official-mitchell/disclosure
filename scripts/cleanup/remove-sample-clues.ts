import { prisma } from "../lib/db";

async function main() {
  console.log("🗑️  Removing sample clues...\n");

  // Delete all clues that have [EXAMPLE] in the title or have specific example IDs
  const result = await prisma.clue.deleteMany({
    where: {
      OR: [
        { title: { contains: "[EXAMPLE]" } },
        { id: { startsWith: "example-clue-" } },
      ],
    },
  });

  console.log(`✓ Deleted ${result.count} sample clues`);
  console.log("\n✅ Cleanup complete!");
}

main()
  .catch((e) => {
    console.error("Error removing sample clues:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
