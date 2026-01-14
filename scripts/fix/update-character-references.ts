import { prisma } from "../lib/db";

const nameReplacements = {
  "Amanda O'Brien": "Mitz Albarron",
  "Amanda": "Mitz",
  "Lt. Carson Conklin": "Lt. Chris Ries",
  "Carson Conklin": "Chris Ries",
  "Carson": "Chris",
  "Dr. Kristen Sharapova": "Dr. Chris Smirnov",
  "Kristen Sharapova": "Chris Smirnov",
  "Kristen": "Chris",
};

function replaceInText(text: string): { updated: string; changed: boolean } {
  let updated = text;
  let changed = false;

  for (const [oldName, newName] of Object.entries(nameReplacements)) {
    // Create regex that matches the name with word boundaries or markdown formatting
    const patterns = [
      // Match **Name** (bold markdown)
      new RegExp(`\\*\\*${escapeRegex(oldName)}\\*\\*`, "gi"),
      // Match Name with word boundaries
      new RegExp(`\\b${escapeRegex(oldName)}\\b`, "gi"),
    ];

    for (const pattern of patterns) {
      if (pattern.test(updated)) {
        changed = true;
        updated = updated.replace(pattern, (match) => {
          // Preserve markdown formatting
          if (match.startsWith("**")) {
            return `**${newName}**`;
          }
          return newName;
        });
      }
    }
  }

  return { updated, changed };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  console.log("🔍 Searching for old character name references...\n");

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

  console.log(`Checking ${characters.length} characters...\n`);

  const updates: Array<{
    id: string;
    displayName: string;
    fields: string[];
  }> = [];

  // First, scan for all occurrences
  for (const char of characters) {
    const fieldsToCheck = {
      backstory: char.backstory,
      exposureConsequences: char.exposureConsequences,
      privateWant: char.privateWant,
      disclosureBelief: char.disclosureBelief,
      permissions: char.permissions.join(" | "),
      restrictions: char.restrictions.join(" | "),
      formalAuthority: char.formalAuthority.join(" | "),
      informalFears: char.informalFears.join(" | "),
      safelyIgnore: char.safelyIgnore.join(" | "),
      canDiscuss: char.canDiscuss.join(" | "),
      mustConceal: char.mustConceal.join(" | "),
    };

    const changedFields: string[] = [];

    for (const [field, value] of Object.entries(fieldsToCheck)) {
      const { changed } = replaceInText(value);
      if (changed) {
        changedFields.push(field);
      }
    }

    if (changedFields.length > 0) {
      updates.push({
        id: char.id,
        displayName: char.displayName,
        fields: changedFields,
      });
    }
  }

  if (updates.length === 0) {
    console.log("✅ No old character references found!");
    return;
  }

  console.log(`Found references in ${updates.length} characters:\n`);
  updates.forEach((u) => {
    console.log(`  ${u.displayName}:`);
    u.fields.forEach((f) => console.log(`    - ${f}`));
  });

  console.log("\n🔄 Updating character references...\n");

  let updatedCount = 0;

  for (const char of characters) {
    const updateData: any = {};
    let hasChanges = false;

    // Text fields
    const textFields = ["backstory", "exposureConsequences", "privateWant", "disclosureBelief"];
    for (const field of textFields) {
      const value = char[field as keyof typeof char] as string;
      const { updated, changed } = replaceInText(value);
      if (changed) {
        updateData[field] = updated;
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
      const updatedValues = values.map((v) => replaceInText(v).updated);
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

  console.log(`\n✅ Updated ${updatedCount} characters!`);

  // Show examples of what was changed
  console.log("\n📝 Example replacements made:");
  Object.entries(nameReplacements).forEach(([old, newName]) => {
    console.log(`  "${old}" → "${newName}"`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
