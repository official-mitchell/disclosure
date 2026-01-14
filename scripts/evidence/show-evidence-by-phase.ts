import { prisma } from "../lib/db";

async function main() {
  console.log("📋 Evidence Database Overview\n");
  console.log("=".repeat(80));

  const phases = [0, 1, 2, 3];

  for (const phaseNum of phases) {
    const clues = await prisma.clue.findMany({
      where: { phase: phaseNum },
      select: {
        id: true,
        title: true,
        targetPlayer: true,
        targetCountry: true,
        released: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    console.log(`\n📌 PHASE ${phaseNum} (${clues.length} items)`);
    console.log("-".repeat(80));

    if (clues.length === 0) {
      console.log("  (No evidence in this phase)");
    } else {
      clues.forEach((clue, index) => {
        const target = clue.targetPlayer
          ? ` [Player: ${clue.targetPlayer}]`
          : clue.targetCountry
            ? ` [Country: ${clue.targetCountry}]`
            : "";
        const status = clue.released ? " ✓ Released" : "";
        console.log(
          `  ${(index + 1).toString().padStart(2)}. ${clue.title}${target}${status}`
        );
      });
    }
  }

  console.log("\n" + "=".repeat(80));

  // Summary
  const summary = await prisma.clue.groupBy({
    by: ["phase"],
    _count: true,
  });

  console.log("\n📊 Summary:");
  summary.sort((a, b) => a.phase - b.phase).forEach((s) => {
    console.log(`  Phase ${s.phase}: ${s._count} evidence items`);
  });

  const total = summary.reduce((acc, s) => acc + s._count, 0);
  console.log(`  Total: ${total} evidence items`);

  // Released count
  const releasedCount = await prisma.clue.count({
    where: { released: true },
  });
  console.log(`  Released: ${releasedCount} items`);
  console.log(`  Unreleased: ${total - releasedCount} items`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
