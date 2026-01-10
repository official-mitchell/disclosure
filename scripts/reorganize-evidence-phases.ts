import { prisma } from "../lib/db";

async function main() {
  console.log("🔍 Analyzing current evidence distribution...\n");

  // Get all clues
  const allClues = await prisma.clue.findMany({
    select: {
      id: true,
      title: true,
      phase: true,
    },
    orderBy: {
      phase: "asc",
    },
  });

  console.log(`Total evidence items: ${allClues.length}`);

  // Categorize by current phase
  const byPhase = allClues.reduce(
    (acc, clue) => {
      acc[clue.phase] = (acc[clue.phase] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  console.log("\nCurrent distribution:");
  Object.keys(byPhase)
    .sort()
    .forEach((phase) => {
      console.log(`  Phase ${phase}: ${byPhase[parseInt(phase)]} items`);
    });

  // Identify new evidence (should stay in their assigned phases)
  const newEvidencePatterns = [
    "evidence-1-p1-",
    "evidence-2-p2-",
    "evidence-2-ip-",
    "evidence-3-p3-",
  ];

  const newEvidence = allClues.filter((clue) =>
    newEvidencePatterns.some((pattern) => clue.id.startsWith(pattern))
  );

  const oldEvidence = allClues.filter(
    (clue) => !newEvidencePatterns.some((pattern) => clue.id.startsWith(pattern))
  );

  console.log(`\n📊 Evidence categorization:`);
  console.log(`  New evidence (to keep in phases 1-3): ${newEvidence.length}`);
  console.log(`  Old evidence (to move to phase 0): ${oldEvidence.length}`);

  // Show breakdown of new evidence by intended phase
  const newPhase1 = newEvidence.filter((c) => c.id.startsWith("evidence-1-p1-"));
  const newPhase2 = newEvidence.filter(
    (c) => c.id.startsWith("evidence-2-p2-") || c.id.startsWith("evidence-2-ip-")
  );
  const newPhase3 = newEvidence.filter((c) => c.id.startsWith("evidence-3-p3-"));

  console.log(`\n  New evidence breakdown:`);
  console.log(`    Phase 1: ${newPhase1.length} items`);
  console.log(`    Phase 2: ${newPhase2.length} items`);
  console.log(`    Phase 3: ${newPhase3.length} items`);

  // Move old evidence to Phase 0
  console.log(`\n🔄 Moving ${oldEvidence.length} old evidence items to Phase 0...`);

  const updateResult = await prisma.clue.updateMany({
    where: {
      id: {
        in: oldEvidence.map((e) => e.id),
      },
    },
    data: {
      phase: 0,
    },
  });

  console.log(`✓ Updated ${updateResult.count} evidence items to Phase 0`);

  // Verify final distribution
  console.log("\n✅ Verifying final distribution...\n");

  const finalClues = await prisma.clue.findMany({
    select: {
      phase: true,
    },
  });

  const finalByPhase = finalClues.reduce(
    (acc, clue) => {
      acc[clue.phase] = (acc[clue.phase] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  console.log("Final distribution:");
  Object.keys(finalByPhase)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((phase) => {
      console.log(`  Phase ${phase}: ${finalByPhase[parseInt(phase)]} items`);
    });

  console.log("\n🎉 Evidence database reorganization complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
