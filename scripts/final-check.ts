import { prisma } from "../lib/db";

async function main() {
  const char = await prisma.character.findFirst({
    where: { player: { name: "Amanda" } },
  });

  if (char) {
    console.log("Formal Authority:", (char.formalAuthority as string[]).length, "items");
    console.log("Informal Fears:", (char.informalFears as string[]).length, "items");
    console.log("Safely Ignore:", (char.safelyIgnore as string[]).length, "items");

    if ((char.informalFears as string[]).length > 0) {
      console.log("\n✅ SUCCESS! Informal fears extracted:");
      (char.informalFears as string[]).forEach((item, i) =>
        console.log(`  ${i + 1}. ${item}`)
      );
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
