import fs from "fs";
import path from "path";
import { prisma } from "../lib/db";
import {
  TargetType,
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

interface RecipientTarget {
  targetType: TargetType;
  targetValue: string | null;
}

function parseRecipients(recipients: string): RecipientTarget {
  const normalized = recipients.trim().toUpperCase();

  // Check for "Everyone" or "All"
  if (normalized === "EVERYONE" || normalized === "ALL") {
    return { targetType: TargetType.all, targetValue: null };
  }

  // Check for country
  if (normalized === "US" || normalized === "USA" || normalized === "UNITED STATES") {
    return { targetType: TargetType.country, targetValue: "US" };
  }
  if (normalized === "RUSSIA" || normalized === "RUSSIAN") {
    return { targetType: TargetType.country, targetValue: "RUSSIA" };
  }
  if (normalized === "CHINA" || normalized === "CHINESE") {
    return { targetType: TargetType.country, targetValue: "CHINA" };
  }

  // Check for archetype
  const archetypes = ["SCIENTIST", "SPY", "DIPLOMAT", "GENERAL", "EXECUTIVE", "JOURNALIST", "OPERATIVE"];
  if (archetypes.includes(normalized)) {
    return { targetType: TargetType.archetype, targetValue: normalized };
  }

  // Otherwise assume it's a player name
  return { targetType: TargetType.player, targetValue: recipients.trim() };
}

async function main() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    console.error(`Directory not found: ${EVIDENCE_DIR}`);
    console.log("Create /evidence folder and add markdown files");
    process.exit(1);
  }

  const files = fs
    .readdirSync(EVIDENCE_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".markdown"));

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

      // Parse recipients to determine target
      const recipientTarget = parseRecipients(evidence.recipients || "Everyone");

      // Determine if this should be auto-released
      const isWelcome = filename.toLowerCase().includes("welcome");
      const autoRelease = isWelcome || recipientTarget.targetType === TargetType.all;

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
          // Don't update metadata fields on update to preserve GM settings
        },
        create: {
          id: clueId,
          title: evidence.title,
          phase: 1, // Default to phase 1
          targetType: recipientTarget.targetType,
          targetValue: recipientTarget.targetValue,
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

      const existed = await prisma.clue.findUnique({
        where: { id: clueId },
        select: { createdAt: true, updatedAt: true },
      });

      if (existed && existed.createdAt.getTime() !== existed.updatedAt.getTime()) {
        console.log(`✓ Updated "${evidence.title}"`);
        updated++;
      } else {
        console.log(`✓ Created "${evidence.title}" (ID: ${clueId})`);
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
