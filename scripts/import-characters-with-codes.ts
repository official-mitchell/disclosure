import fs from "fs";
import path from "path";
import { parseCharacterHtml } from "./parse-character-html";
import { prisma } from "../lib/db";

const CHARACTERS_DIR = path.join(process.cwd(), "characters");

// Generate a random 4-digit PIN
function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

interface CharacterImport {
  shortName: string;
  fullName: string;
  pin: string;
  characterData: ReturnType<typeof parseCharacterHtml>;
}

async function main() {
  if (!fs.existsSync(CHARACTERS_DIR)) {
    console.error(`Directory not found: ${CHARACTERS_DIR}`);
    console.log("Create /characters folder and add HTML exports from Notion");
    process.exit(1);
  }

  const files = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((f) => f.endsWith(".html") && !f.includes("EXAMPLE"));

  if (files.length === 0) {
    console.log("No HTML files found in /characters");
    process.exit(0);
  }

  console.log(`Found ${files.length} character files\n`);
  console.log("Importing characters and generating access codes...\n");

  const imports: CharacterImport[] = [];
  let created = 0,
    updated = 0,
    failed = 0;

  for (const file of files) {
    // Extract short name from filename: "... — Amanda.html" -> "Amanda"
    const shortName = file.split("—").pop()?.replace(".html", "").trim() || "";
    process.stdout.write(`[${shortName}] `);

    try {
      const filePath = path.join(CHARACTERS_DIR, file);
      const characterData = parseCharacterHtml(filePath);
      const fullName = characterData.displayName;

      // Generate a unique PIN
      const pin = generatePin();

      // Create or update player
      const player = await prisma.player.upsert({
        where: { name: shortName },
        create: {
          name: shortName,
          pin: pin,
          country: "US", // Default, can be updated manually later
          archetype: "SCIENTIST", // Default, can be updated manually later
        },
        update: {}, // Don't update PIN if player already exists
      });

      // Get the actual PIN (in case player already existed)
      const actualPlayer = await prisma.player.findUnique({
        where: { name: shortName },
      });

      if (!actualPlayer) {
        throw new Error("Failed to retrieve player after upsert");
      }

      // Create or update character
      const existingChar = await prisma.character.findUnique({
        where: { playerId: player.id },
      });

      await prisma.character.upsert({
        where: { playerId: player.id },
        create: { playerId: player.id, ...characterData },
        update: characterData,
      });

      imports.push({
        shortName,
        fullName,
        pin: actualPlayer.pin,
        characterData,
      });

      if (existingChar) {
        console.log(`✓ Updated "${fullName}"`);
        updated++;
      } else {
        console.log(`✓ Created "${fullName}" (PIN: ${actualPlayer.pin})`);
        created++;
      }
    } catch (error) {
      console.log(`✗ Failed: ${(error as Error).message}`);
      failed++;
    }
  }

  // Generate CHARACTER_CODES.md
  console.log(`\n${"─".repeat(60)}`);
  console.log("Generating CHARACTER_CODES.md...\n");

  const codesFilePath = path.join(process.cwd(), "CHARACTER_CODES.md");
  let markdown = `# Character Access Codes\n\n`;
  markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
  markdown += `Total Characters: ${imports.length}\n\n`;
  markdown += `## Access Codes\n\n`;
  markdown += `| Character Name | Short Name | PIN |\n`;
  markdown += `|----------------|------------|-----|\n`;

  // Sort by short name
  imports.sort((a, b) => a.shortName.localeCompare(b.shortName));

  for (const imp of imports) {
    markdown += `| ${imp.fullName} | ${imp.shortName} | \`${imp.pin}\` |\n`;
  }

  markdown += `\n## Usage\n\n`;
  markdown += `1. Players should navigate to the game URL\n`;
  markdown += `2. Select their character's short name from the list\n`;
  markdown += `3. Enter their 4-digit PIN to access their dossier\n\n`;
  markdown += `⚠️ **Keep this file secure** - These codes grant access to player dossiers!\n`;

  fs.writeFileSync(codesFilePath, markdown, "utf-8");

  console.log(`✓ Created CHARACTER_CODES.md with ${imports.length} entries`);
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed:  ${failed}`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Review CHARACTER_CODES.md`);
  console.log(`2. Distribute PINs to players`);
  console.log(`3. Update player countries/archetypes in database if needed`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
