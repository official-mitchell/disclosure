import fs from "fs";
import path from "path";
import { prisma } from "../lib/db";
import {
  Country,
  Archetype,
  Demeanor,
  Legitimacy,
  Confidentiality,
  ConfidenceLevel,
} from "@prisma/client";

const EVIDENCE_DIR = path.join(process.cwd(), "evidence");

interface EvidenceData {
  recipients: string;
  title: string;
  origin: string;
  date: string;
  summary: string;
  confidence: string;
  source: string;
  supportingIntel: string;
  takeaways: string[];
}

function parseEvidenceFile(filePath: string): EvidenceData {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let currentSection = "";
  const data: Partial<EvidenceData> = {
    takeaways: [],
  };

  let collectingSection = false;
  let sectionContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section headers
    if (line === "Recipients:") {
      currentSection = "recipients";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "Title:") {
      if (currentSection === "recipients") {
        data.recipients = sectionContent.join("\n").trim();
      }
      currentSection = "title";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "Origin:") {
      if (currentSection === "title") {
        data.title = sectionContent.join("\n").trim();
      }
      currentSection = "origin";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "Date:") {
      if (currentSection === "origin") {
        data.origin = sectionContent.join("\n").trim();
      }
      currentSection = "date";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "Summary:") {
      if (currentSection === "date") {
        data.date = sectionContent.join("\n").trim();
      }
      currentSection = "summary";
      collectingSection = true;
      sectionContent = [];
    } else if (line.startsWith("Confidence:")) {
      if (currentSection === "summary") {
        data.summary = sectionContent.join("\n").trim();
      }
      data.confidence = line.replace("Confidence:", "").trim();
      currentSection = "confidence";
      collectingSection = false;
    } else if (line === "Source:") {
      currentSection = "source";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "SUPPORTING INTEL") {
      if (currentSection === "source") {
        data.source = sectionContent.join("\n").trim();
      }
      currentSection = "supportingIntel";
      collectingSection = true;
      sectionContent = [];
    } else if (line === "TAKEAWAYS") {
      if (currentSection === "supportingIntel") {
        data.supportingIntel = sectionContent.join("\n").trim();
      }
      currentSection = "takeaways";
      collectingSection = true;
      sectionContent = [];
    } else if (collectingSection && line !== "") {
      // Collect content for current section
      if (currentSection === "takeaways") {
        // Parse numbered takeaways
        const match = line.match(/^\d+\.\s*(.+)$/);
        if (match) {
          data.takeaways!.push(match[1]);
        }
      } else {
        sectionContent.push(line);
      }
    }
  }

  // Handle last section
  if (currentSection === "takeaways" && sectionContent.length > 0) {
    // Already handled in the loop
  } else if (currentSection === "supportingIntel") {
    data.supportingIntel = sectionContent.join("\n").trim();
  }

  return data as EvidenceData;
}

function mapConfidenceLevel(confidence: string): ConfidenceLevel {
  const normalized = confidence.toUpperCase();
  if (normalized.includes("CONFIRMED")) return ConfidenceLevel.confirmed;
  if (normalized.includes("HIGH")) return ConfidenceLevel.high;
  if (normalized.includes("MEDIUM")) return ConfidenceLevel.medium;
  if (normalized.includes("LOW")) return ConfidenceLevel.low;
  return ConfidenceLevel.unverified;
}

interface RecipientFilters {
  targetCountry: Country | null;
  targetArchetype: Archetype | null;
  targetDemeanor: Demeanor | null;
  targetPlayer: string | null;
  isEveryone: boolean;
}

function parseRecipients(recipients: string): RecipientFilters {
  const filters: RecipientFilters = {
    targetCountry: null,
    targetArchetype: null,
    targetDemeanor: null,
    targetPlayer: null,
    isEveryone: false,
  };

  // Check for "Everyone" or "All"
  const normalized = recipients.trim().toUpperCase();
  if (normalized === "EVERYONE" || normalized === "ALL") {
    filters.isEveryone = true;
    return filters;
  }

  // Split by + or comma to handle combinations like "US + Pro-Disclosure"
  const parts = recipients
    .split(/[+,]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  for (const part of parts) {
    const upperPart = part.toUpperCase();

    // Check for country
    if (
      upperPart === "US" ||
      upperPart === "USA" ||
      upperPart === "UNITED STATES"
    ) {
      filters.targetCountry = Country.US;
      continue;
    }
    if (upperPart === "RUSSIA" || upperPart === "RUSSIAN") {
      filters.targetCountry = Country.RUSSIA;
      continue;
    }
    if (upperPart === "CHINA" || upperPart === "CHINESE") {
      filters.targetCountry = Country.CHINA;
      continue;
    }

    // Check for archetype
    if (
      upperPart === "MILITARY" ||
      upperPart === "DEFENSE CONTRACTOR" ||
      upperPart === "MILITARY / DEFENSE CONTRACTOR" ||
      upperPart === "MILITARY/DEFENSE CONTRACTOR"
    ) {
      filters.targetArchetype = Archetype.MILITARY_DEFENSE_CONTRACTOR;
      continue;
    }
    if (
      upperPart === "POLITICIAN" ||
      upperPart === "HIGH RANKING POLITICIAN" ||
      upperPart === "HIGH-RANKING POLITICIAN"
    ) {
      filters.targetArchetype = Archetype.HIGH_RANKING_POLITICIAN;
      continue;
    }
    if (
      upperPart === "INTEL" ||
      upperPart === "OLIGARCH" ||
      upperPart === "INTEL / OLIGARCH" ||
      upperPart === "INTEL/OLIGARCH"
    ) {
      filters.targetArchetype = Archetype.INTEL_OLIGARCH;
      continue;
    }
    if (
      upperPart === "JOURNALIST" ||
      upperPart === "MEDIA" ||
      upperPart === "JOURNALIST / MEDIA" ||
      upperPart === "JOURNALIST/MEDIA"
    ) {
      filters.targetArchetype = Archetype.JOURNALIST_MEDIA;
      continue;
    }
    if (
      upperPart === "SCIENTIST" ||
      upperPart === "HIGH RANKING SCIENTIST" ||
      upperPart === "HIGH-RANKING SCIENTIST"
    ) {
      filters.targetArchetype = Archetype.HIGH_RANKING_SCIENTIST;
      continue;
    }

    // Check for demeanor
    if (
      upperPart === "ANTI-DISCLOSURE" ||
      upperPart === "ANTI DISCLOSURE" ||
      upperPart === "ANTIDISCLOSURE"
    ) {
      filters.targetDemeanor = Demeanor.ANTI_DISCLOSURE;
      continue;
    }
    if (upperPart === "AGNOSTIC") {
      filters.targetDemeanor = Demeanor.AGNOSTIC;
      continue;
    }
    if (
      upperPart === "PRO-DISCLOSURE" ||
      upperPart === "PRO DISCLOSURE" ||
      upperPart === "PRODISCLOSURE"
    ) {
      filters.targetDemeanor = Demeanor.PRO_DISCLOSURE;
      continue;
    }

    // If nothing matched, assume it's a specific player name
    if (filters.targetPlayer === null) {
      filters.targetPlayer = part.trim();
    }
  }

  return filters;
}

async function main() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    console.error(`Directory not found: ${EVIDENCE_DIR}`);
    console.log("Create /evidence folder and add markdown files");
    process.exit(1);
  }

  const files = fs
    .readdirSync(EVIDENCE_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".markdown"))
    .filter((f) => !f.includes("EVIDENCE_FORMAT")); // Skip documentation

  if (files.length === 0) {
    console.log("No markdown files found in /evidence");
    process.exit(0);
  }

  console.log(`📁 Found ${files.length} evidence file(s)\n`);
  console.log("Importing evidence...\n");

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const file of files) {
    const filename = path.basename(file, path.extname(file));
    process.stdout.write(`[${filename}] `);

    try {
      const filePath = path.join(EVIDENCE_DIR, file);
      const evidence = parseEvidenceFile(filePath);

      // Use filename as unique identifier for upsert
      const clueId = `evidence-${filename.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      // Parse recipients to determine filters
      const recipientFilters = parseRecipients(
        evidence.recipients || "Everyone"
      );

      // Determine if this should be auto-released (everyone with no filters)
      const isWelcome = filename.toLowerCase().includes("welcome");
      const autoRelease = isWelcome || recipientFilters.isEveryone;

      // Check if clue already exists to determine created vs updated
      const existingClue = await prisma.clue.findUnique({
        where: { id: clueId },
      });

      const clue = await prisma.clue.upsert({
        where: { id: clueId },
        update: {
          title: evidence.title,
          eventDate: evidence.date,
          backstory: evidence.summary,
          confidenceLevel: mapConfidenceLevel(evidence.confidence),
          supportingIntel: evidence.supportingIntel,
          source: evidence.source,
          takeaways: evidence.takeaways,
          // Don't update targeting/metadata fields on update to preserve GM settings
        },
        create: {
          id: clueId,
          title: evidence.title,
          phase: 1, // Default to phase 1
          targetCountry: recipientFilters.targetCountry,
          targetArchetype: recipientFilters.targetArchetype,
          targetDemeanor: recipientFilters.targetDemeanor,
          targetPlayer: recipientFilters.targetPlayer,
          legitimacy: Legitimacy.verified,
          confidentiality: Confidentiality.public,
          originCountry: evidence.origin || "Unknown",
          eventDate: evidence.date,
          backstory: evidence.summary,
          confidenceLevel: mapConfidenceLevel(evidence.confidence),
          supportingIntel: evidence.supportingIntel,
          source: evidence.source,
          takeaways: evidence.takeaways,
          released: autoRelease,
          releasedAt: autoRelease ? new Date() : null,
        },
      });

      if (existingClue) {
        console.log(`✓ Updated "${evidence.title}"`);
        updated++;
      } else {
        const targetDesc = recipientFilters.isEveryone
          ? "Everyone"
          : [
              recipientFilters.targetCountry,
              recipientFilters.targetArchetype,
              recipientFilters.targetDemeanor,
              recipientFilters.targetPlayer,
            ]
              .filter(Boolean)
              .join(" + ");
        console.log(`✓ Created "${evidence.title}" (Target: ${targetDesc})`);
        created++;
      }
    } catch (error) {
      console.log(`✗ Failed: ${(error as Error).message}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed:  ${failed}`);
  console.log(`\n✅ Evidence import complete!`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Review imported evidence in GM dashboard`);
  console.log(`2. Adjust phase, target, and release settings as needed`);
  console.log(`3. Release evidence to players when ready`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
