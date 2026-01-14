import { prisma } from "../lib/db";

async function main() {
  console.log("🔧 Fixing remaining character name references...\n");

  // Fix the specific case where we have "Dr. Chris (Sharapova)" -> "Dr. Chris (Smirnov)"
  const characters = await prisma.character.findMany({
    select: {
      id: true,
      displayName: true,
      backstory: true,
      exposureConsequences: true,
      privateWant: true,
      disclosureBelief: true,
      permissions: true,
      restrictions: true,
      formalAuthority: true,
      informalFears: true,
      safelyIgnore: true,
      canDiscuss: true,
      mustConceal: true,
    },
  });

  const patterns = [
    {
      old: /Dr\. Chris \(Sharapova\)/gi,
      new: "Dr. Chris (Smirnov)",
      name: "Dr. Chris (Sharapova) → Dr. Chris (Smirnov)",
    },
    {
      old: /\*\*Dr\. Chris \(Sharapova\)\*\*/gi,
      new: "**Dr. Chris (Smirnov)**",
      name: "**Dr. Chris (Sharapova)** → **Dr. Chris (Smirnov)**",
    },
    {
      old: /Lt\. Chris Ries/gi,
      new: "Lt. Chris Ries",
      name: "Lt. Chris Ries (already correct)",
    },
  ];

  let updatedCount = 0;

  for (const char of characters) {
    const updateData: any = {};
    let hasChanges = false;

    // Text fields
    const textFields = [
      "backstory",
      "exposureConsequences",
      "privateWant",
      "disclosureBelief",
    ];
    for (const field of textFields) {
      let value = char[field as keyof typeof char] as string;
      let changed = false;

      for (const pattern of patterns) {
        if (pattern.old.test(value)) {
          value = value.replace(pattern.old, pattern.new);
          changed = true;
        }
      }

      if (changed) {
        updateData[field] = value;
        hasChanges = true;
      }
    }

    // Array fields
    const arrayFields = [
      "permissions",
      "restrictions",
      "formalAuthority",
      "informalFears",
      "safelyIgnore",
      "canDiscuss",
      "mustConceal",
    ];

    for (const field of arrayFields) {
      const values = char[field as keyof typeof char] as string[];
      const updatedValues = values.map((v) => {
        let updated = v;
        for (const pattern of patterns) {
          updated = updated.replace(pattern.old, pattern.new);
        }
        return updated;
      });

      const changed = values.some((v, i) => v !== updatedValues[i]);

      if (changed) {
        updateData[field] = updatedValues;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await prisma.character.update({
        where: { id: char.id },
        data: updateData,
      });
      console.log(`✓ Updated ${char.displayName}`);
      updatedCount++;
    }
  }

  if (updatedCount === 0) {
    console.log("✅ No remaining references to fix!");
  } else {
    console.log(`\n✅ Updated ${updatedCount} characters!`);
  }

  // Final verification
  console.log("\n🔍 Final verification...\n");

  const oscar = await prisma.character.findFirst({
    where: { displayName: { contains: "Oscar" } },
    select: { displayName: true, safelyIgnore: true },
  });

  console.log("Dr. Oscar (Morozov) - safelyIgnore:");
  console.log("  " + oscar?.safelyIgnore.join("\n  "));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
