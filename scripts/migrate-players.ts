import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PlayerMapping {
  name: string;
  country: "US" | "RUSSIA" | "CHINA";
  demeanor: "ANTI_DISCLOSURE" | "AGNOSTIC" | "PRO_DISCLOSURE";
  archetype:
    | "MILITARY_DEFENSE_CONTRACTOR"
    | "HIGH_RANKING_POLITICIAN"
    | "INTEL_OLIGARCH"
    | "JOURNALIST_MEDIA"
    | "HIGH_RANKING_SCIENTIST";
}

function parsePlayerDemeanorFile(filePath: string): PlayerMapping[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  const mappings: PlayerMapping[] = [];

  for (const line of lines) {
    // Format: Name 🇺🇸/🇨🇳/🇷🇺 Country Demeanor Archetype
    // Example: Kassidy Neville 🇺🇸 American Anti-Disclosure Military / Defense Contractor

    // Determine country and split line
    let country: PlayerMapping["country"];
    let name: string;
    let rest: string;

    if (line.includes(" American ")) {
      country = "US";
      const parts = line.split(" American ");
      name = parts[0].replace(/🇺🇸/g, "").trim();
      rest = parts[1];
    } else if (line.includes(" China ")) {
      country = "CHINA";
      const parts = line.split(" China ");
      name = parts[0].replace(/🇨🇳/g, "").trim();
      rest = parts[1];
    } else if (line.includes(" Russia ")) {
      country = "RUSSIA";
      const parts = line.split(" Russia ");
      name = parts[0].replace(/🇷🇺/g, "").trim();
      rest = parts[1];
    } else {
      console.warn(`Unknown country in line: ${line}`);
      continue;
    }

    // Now rest is: "Demeanor Archetype"
    // Examples:
    // "Anti-Disclosure Military / Defense Contractor"
    // "Pro-Disclosure High Ranking Scientist"

    // Parse demeanor
    let demeanor: PlayerMapping["demeanor"];
    let demeanorMatch: RegExpMatchArray | null = null;

    if (rest.startsWith("Anti-Disclosure")) {
      demeanor = "ANTI_DISCLOSURE";
      demeanorMatch = rest.match(/^Anti-Disclosure/);
    } else if (rest.startsWith("Pro-Disclosure")) {
      demeanor = "PRO_DISCLOSURE";
      demeanorMatch = rest.match(/^Pro-Disclosure/);
    } else if (rest.startsWith("Agnostic")) {
      demeanor = "AGNOSTIC";
      demeanorMatch = rest.match(/^Agnostic/);
    } else {
      console.warn(`Unknown demeanor for ${name} in: ${rest}`);
      continue;
    }

    // Extract archetype (everything after demeanor)
    if (!demeanorMatch) {
      console.warn(`Could not match demeanor for ${name}`);
      continue;
    }

    const afterDemeanor = rest.substring(demeanorMatch[0].length).trim();

    let archetype: PlayerMapping["archetype"];
    if (
      afterDemeanor === "Military / Defense Contractor" ||
      afterDemeanor === "Military / Whistleblower"
    ) {
      archetype = "MILITARY_DEFENSE_CONTRACTOR";
    } else if (afterDemeanor === "High Ranking Politician") {
      archetype = "HIGH_RANKING_POLITICIAN";
    } else if (afterDemeanor === "Intel / Oligarch") {
      archetype = "INTEL_OLIGARCH";
    } else if (afterDemeanor === "Journalist / Media") {
      archetype = "JOURNALIST_MEDIA";
    } else if (afterDemeanor === "High Ranking Scientist") {
      archetype = "HIGH_RANKING_SCIENTIST";
    } else {
      console.warn(`Unknown archetype for ${name}: "${afterDemeanor}"`);
      continue;
    }

    mappings.push({ name, country, demeanor, archetype });
  }

  return mappings;
}

async function main() {
  const filePath = path.join(process.cwd(), "scripts", "player-demeanor.md");

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log("📖 Reading player demeanor mappings...\n");
  const mappings = parsePlayerDemeanorFile(filePath);

  console.log(`Found ${mappings.length} player mappings\n`);

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const mapping of mappings) {
    try {
      // Extract first name from full name
      // Examples: "Kassidy Neville" -> "Kassidy", "Rep. Sarah Fierce" -> "Sarah", "Dr. Maya Badman" -> "Maya"
      const nameParts = mapping.name.split(" ").filter((p) => p.trim().length > 0);

      // Skip titles like "Rep.", "Dr.", "Lt.", "Senator", etc.
      const firstNameCandidates = nameParts.filter(
        (part) =>
          !part.endsWith(".") &&
          part !== "Senator" &&
          part !== "Cmdr." &&
          part !== "General" &&
          part !== "Admiral" &&
          part !== "Cpt."
      );

      const firstName = firstNameCandidates[0];

      // Find player by first name
      const player = await prisma.player.findFirst({
        where: {
          name: firstName,
        },
      });

      if (!player) {
        console.log(`⚠️  Player not found: ${mapping.name} (tried: ${firstName})`);
        notFound++;
        continue;
      }

      // Update using raw SQL since we're migrating between enum values
      await prisma.$executeRawUnsafe(`
        UPDATE "Player"
        SET
          "country" = '${mapping.country}'::"Country",
          "demeanor" = '${mapping.demeanor}'::"Demeanor",
          "archetype" = '${mapping.archetype}'::"Archetype"
        WHERE "id" = '${player.id}'
      `);

      console.log(
        `✓ Updated ${player.name}: ${mapping.country} ${mapping.demeanor} ${mapping.archetype}`
      );
      updated++;
    } catch (error) {
      console.log(`✗ Error updating ${mapping.name}: ${(error as Error).message}`);
      errors++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not Found: ${notFound}`);
  console.log(`Errors: ${errors}`);
  console.log(`\n✅ Player migration complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
