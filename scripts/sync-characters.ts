import fs from "fs";
import path from "path";
import { parseCharacterHtml } from "./parse-character-html";
import { prisma } from "../lib/db";

const CHARACTERS_DIR = path.join(process.cwd(), "characters");

async function main() {
  if (!fs.existsSync(CHARACTERS_DIR)) {
    console.error(`Directory not found: ${CHARACTERS_DIR}`);
    console.log("Create /characters folder and add HTML exports from Notion");
    process.exit(1);
  }

  const files = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((f) => f.endsWith(".html"));

  if (files.length === 0) {
    console.log("No HTML files found in /characters");
    process.exit(0);
  }

  console.log(`Found ${files.length} HTML files\n`);

  let created = 0,
    updated = 0,
    skipped = 0,
    failed = 0;

  for (const file of files) {
    let playerName = path.basename(file, ".html");
    // Strip common prefixes from Notion exports
    playerName = playerName
      .replace(/^Catastrophic Disclosure Character Sheet — /, "")
      .replace(/^Character Sheet — /, "")
      .trim();
    process.stdout.write(`[${file}] `);

    try {
      const player = await prisma.player.findUnique({
        where: { name: playerName },
      });

      if (!player) {
        console.log(`⚠ No player "${playerName}" — skipped`);
        skipped++;
        continue;
      }

      const filePath = path.join(CHARACTERS_DIR, file);
      const characterData = parseCharacterHtml(filePath);

      const existing = await prisma.character.findUnique({
        where: { playerId: player.id },
      });

      await prisma.character.upsert({
        where: { playerId: player.id },
        create: { playerId: player.id, ...characterData },
        update: characterData,
      });

      if (existing) {
        console.log(`✓ Updated "${characterData.displayName}"`);
        updated++;
      } else {
        console.log(`✓ Created "${characterData.displayName}"`);
        created++;
      }
    } catch (error) {
      console.log(`✗ Failed: ${(error as Error).message}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(40)}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
