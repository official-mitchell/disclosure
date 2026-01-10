import { prisma } from "../lib/db";

async function main() {
  const clues = await prisma.clue.findMany({
    where: {
      OR: [
        { id: { startsWith: "evidence-1-p1" } },
        { id: { startsWith: "evidence-2-p2" } },
        { id: { startsWith: "evidence-2-ip" } },
        { id: { startsWith: "evidence-3-p3" } },
      ],
    },
    select: {
      id: true,
      title: true,
      phase: true,
      targetPlayer: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log("\nPhase 1 Evidence (should have phase=1):");
  const phase1 = clues.filter((c) => c.id.startsWith("evidence-1-p1"));
  phase1.forEach((c) => console.log(`  ✓ ${c.id}: phase=${c.phase}`));

  console.log("\nPhase 2 Evidence (should have phase=2):");
  const phase2 = clues.filter(
    (c) =>
      c.id.startsWith("evidence-2-p2") || c.id.startsWith("evidence-2-ip")
  );
  phase2.forEach((c) =>
    console.log(
      `  ✓ ${c.id}: phase=${c.phase}${c.targetPlayer ? " (Player: " + c.targetPlayer + ")" : ""}`
    )
  );

  console.log("\nPhase 3 Evidence (should have phase=3):");
  const phase3 = clues.filter((c) => c.id.startsWith("evidence-3-p3"));
  phase3.forEach((c) => console.log(`  ✓ ${c.id}: phase=${c.phase}`));

  console.log(`\n📊 Summary:`);
  console.log(`  Phase 1: ${phase1.length} evidence items`);
  console.log(`  Phase 2: ${phase2.length} evidence items`);
  console.log(`  Phase 3: ${phase3.length} evidence items`);
  console.log(`  Total: ${clues.length} new evidence items`);

  const wrongPhase = clues.filter((c) => {
    if (c.id.startsWith("evidence-1-p1")) return c.phase !== 1;
    if (
      c.id.startsWith("evidence-2-p2") ||
      c.id.startsWith("evidence-2-ip")
    )
      return c.phase !== 2;
    if (c.id.startsWith("evidence-3-p3")) return c.phase !== 3;
    return false;
  });

  if (wrongPhase.length === 0) {
    console.log(`\n✅ All evidence has been imported with the correct phase!`);
  } else {
    console.log(
      `\n❌ Warning: ${wrongPhase.length} evidence items have incorrect phases:`
    );
    wrongPhase.forEach((c) =>
      console.log(`  - ${c.id}: has phase=${c.phase}`)
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
