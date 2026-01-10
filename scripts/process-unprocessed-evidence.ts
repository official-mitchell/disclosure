// process-unprocessed-evidence.ts
// Changes:
// - Created: Script to parse unprocessed evidence file, normalize format, and split by phase
import fs from "fs";
import path from "path";

const EVIDENCE_DIR = path.join(process.cwd(), "evidence");
const UNPROCESSED_FILE = path.join(EVIDENCE_DIR, "unprocessed-evidence-01.md");

interface EvidenceItem {
  phase: string;
  code: string;
  title: string;
  target: string;
  legitimacy: string;
  confidentiality: string;
  originCountry: string;
  eventDate: string;
  source: string;
  backstory: string;
  supportingIntel: string;
  takeaways: string[];
}

// Map legitimacy values to confidence levels
function mapLegitimacyToConfidence(legitimacy: string): string {
  const normalized = legitimacy.toLowerCase().trim();
  if (normalized === "verified") return "CONFIRMED";
  if (normalized === "suspected") return "MEDIUM";
  if (normalized === "fabricated") return "LOW";
  if (normalized === "unknown") return "UNVERIFIED";
  return "MEDIUM"; // Default
}

// Parse target field and convert to Recipients format
function parseTarget(target: string): string {
  const trimmed = target.trim();
  
  // Handle "All Players"
  if (trimmed.toLowerCase().includes("all players")) {
    return "Everyone";
  }
  
  // Handle "Player → [Name] (Individual)"
  const individualMatch = trimmed.match(/Player → ([^(]+)\s*\(Individual\)/i);
  if (individualMatch) {
    const playerName = individualMatch[1].trim();
    // Return short name directly (already in short form in most cases)
    return playerName;
  }
  
  // Handle "Country → Archetypes (Names)"
  // Examples: "Russia → Scientists (Oscar, Chris)" or "US → Spies (Brea, Deniz)"
  // Match Unicode arrow (→) or ASCII arrow (->)
  const countryMatch = trimmed.match(/^([^→\-]+)(?:→|->)\s*(.+)$/);
  if (countryMatch) {
    const countryPart = countryMatch[1].trim();
    const archetypePart = countryMatch[2].trim();
    
    // Extract country - check in order of specificity
    let country = "";
    const upperCountry = countryPart.toUpperCase();
    if (upperCountry.includes("UNITED STATES") || upperCountry === "US" || upperCountry === "USA") {
      country = "US";
    } else if (upperCountry.includes("RUSSIA") || upperCountry.includes("RUSSIAN")) {
      country = "Russia";
    } else if (upperCountry.includes("CHINA") || upperCountry.includes("CHINESE")) {
      country = "China";
    }
    
    // Extract archetype (remove parenthetical names)
    const archetypeText = archetypePart.replace(/\([^)]+\)/g, "").trim();
    let archetype = "";
    if (archetypeText.match(/Scientists|Scientist/i)) {
      archetype = "High Ranking Scientist";
    } else if (archetypeText.match(/Spies|Spy|Intel/i)) {
      archetype = "Intel / Oligarch";
    } else if (archetypeText.match(/Politicians|Politician/i)) {
      archetype = "High Ranking Politician";
    } else if (archetypeText.match(/Military/i)) {
      archetype = "Military / Defense Contractor";
    } else if (archetypeText.match(/Executives|Executive/i)) {
      archetype = "Military / Defense Contractor"; // Executives are defense contractors
    } else if (archetypeText.match(/Journalists|Journalist|Media/i)) {
      archetype = "Journalist / Media";
    }
    
    // Build recipients string
    if (country && archetype) {
      return `${country} + ${archetype}`;
    } else if (country) {
      return country;
    } else if (archetype) {
      return archetype;
    }
  }
  
  // Handle "All → Archetypes (Names)"
  const allMatch = trimmed.match(/^All\s+(?:→|->)\s*(.+)$/i);
  if (allMatch) {
    const archetypePart = allMatch[1].trim();
    
    // Remove parenthetical names
    const archetypeText = archetypePart.replace(/\([^)]+\)/g, "").trim();
    let archetype = "";
    if (archetypeText.match(/Scientists|Scientist/i)) {
      archetype = "High Ranking Scientist";
    } else if (archetypeText.match(/Politicians|Politician/i)) {
      archetype = "High Ranking Politician";
    } else if (archetypeText.match(/Executives|Executive/i)) {
      archetype = "Military / Defense Contractor";
    } else if (archetypeText.match(/Military/i)) {
      archetype = "Military / Defense Contractor";
    }
    
    if (archetype) {
      return archetype;
    }
  }
  
  // Fallback: return as-is
  return trimmed;
}

function parseEvidenceFile(filePath: string): EvidenceItem[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  
  const items: EvidenceItem[] = [];
  let currentItem: Partial<EvidenceItem> | null = null;
  let currentSection = "";
  let sectionContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detect phase headers
    if (trimmed.match(/^# PHASE \d+ EVIDENCE$/i)) {
      const phaseMatch = trimmed.match(/PHASE (\d+)/i);
      if (phaseMatch) {
        // Save previous item if exists
        if (currentItem && currentItem.title) {
          items.push(currentItem as EvidenceItem);
        }
        currentItem = { phase: `P${phaseMatch[1]}`, takeaways: [] };
        currentSection = "";
        sectionContent = [];
      }
      continue;
    }
    
    // Detect "INDIVIDUAL PLAYER EVIDENCE" section
    if (trimmed.match(/^# INDIVIDUAL PLAYER EVIDENCE/i)) {
      if (currentItem && currentItem.title) {
        items.push(currentItem as EvidenceItem);
      }
      currentItem = { phase: "IP", takeaways: [] };
      currentSection = "";
      sectionContent = [];
      continue;
    }
    
    // Detect evidence item headers: ## P1-001: Title
    const headerMatch = trimmed.match(/^##\s*(P\d+|IP)-(\d+):\s*(.+)$/);
    if (headerMatch) {
      // Save previous item
      if (currentItem && currentItem.title) {
        items.push(currentItem as EvidenceItem);
      }
      
      currentItem = {
        phase: headerMatch[1],
        code: `${headerMatch[1]}-${headerMatch[2]}`,
        title: headerMatch[3],
        takeaways: [],
      };
      currentSection = "";
      sectionContent = [];
      continue;
    }
    
    // Detect field markers: **Field:** value (on same line)
    const fieldMatch = trimmed.match(/^\*\*(\w+(?:\s+\w+)*):\*\*\s*(.*)$/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1].toLowerCase();
      const fieldValue = fieldMatch[2].trim();
      
      // Handle section headers that start content blocks
      if (fieldName === "backstory") {
        // Save previous section content
        if (currentItem && currentSection && sectionContent.length > 0) {
          const content = sectionContent.join("\n").trim();
          if (currentSection === "supportingIntel") {
            currentItem.supportingIntel = content;
          }
          sectionContent = [];
        }
        currentSection = "backstory";
        sectionContent = [];
        continue;
      } else if (fieldName === "supporting intel") {
        // Save previous section content
        if (currentItem && currentSection && sectionContent.length > 0) {
          const content = sectionContent.join("\n").trim();
          if (currentSection === "backstory") {
            currentItem.backstory = content;
          }
          sectionContent = [];
        }
        currentSection = "supportingIntel";
        sectionContent = [];
        continue;
      } else if (fieldName === "takeaways") {
        // Save previous section content
        if (currentItem && currentSection && sectionContent.length > 0) {
          const content = sectionContent.join("\n").trim();
          if (currentSection === "backstory") {
            currentItem.backstory = content;
          } else if (currentSection === "supportingIntel") {
            currentItem.supportingIntel = content;
          }
          sectionContent = [];
        }
        currentSection = "takeaways";
        sectionContent = [];
        continue;
      }
      
      // Handle inline fields (value on same line)
      if (fieldName === "target") {
        currentItem!.target = fieldValue;
      } else if (fieldName === "phase") {
        currentItem!.phase = fieldValue;
      } else if (fieldName === "legitimacy") {
        currentItem!.legitimacy = fieldValue;
      } else if (fieldName === "confidentiality") {
        currentItem!.confidentiality = fieldValue;
      } else if (fieldName === "origin country") {
        currentItem!.originCountry = fieldValue;
      } else if (fieldName === "event date") {
        currentItem!.eventDate = fieldValue;
      } else if (fieldName === "source") {
        currentItem!.source = fieldValue;
      }
      continue;
    }
    
    // Collect content for current section
    if (currentItem && currentSection) {
      if (currentSection === "takeaways") {
        // Parse bullet points (skip empty lines and separators)
        if (trimmed === "---" || trimmed === "") {
          continue;
        }
        const takeawayMatch = trimmed.match(/^-\s*(.+)$/);
        if (takeawayMatch) {
          currentItem.takeaways!.push(takeawayMatch[1]);
        }
      } else {
        // Preserve original line for backstory and supporting intel
        // Skip separator lines
        if (trimmed !== "---") {
          sectionContent.push(line);
        }
      }
    }
  }
  
  // Save last item
  if (currentItem && currentItem.title) {
    // Save any remaining section content
    if (currentSection && sectionContent.length > 0) {
      const content = sectionContent.join("\n").trim();
      if (currentSection === "backstory") {
        currentItem.backstory = content;
      } else if (currentSection === "supportingIntel") {
        currentItem.supportingIntel = content;
      }
    }
    items.push(currentItem as EvidenceItem);
  }
  
  return items;
}

function formatEvidenceItem(item: EvidenceItem): string {
  const recipients = parseTarget(item.target || "Everyone");
  const confidence = mapLegitimacyToConfidence(item.legitimacy || "unknown");
  
  const lines = [
    "Recipients:",
    recipients,
    "",
    "Title:",
    item.title,
    "",
    "Origin:",
    item.originCountry || "Unknown",
    "",
    "Date:",
    item.eventDate || "[CLASSIFIED]",
    "",
    "Summary:",
    item.backstory || "",
    "",
    `Confidence: ${confidence}`,
    "",
    "Source:",
    item.source || "Unknown",
    "",
  ];
  
  if (item.supportingIntel) {
    lines.push("SUPPORTING INTEL");
    lines.push("");
    lines.push(item.supportingIntel);
    lines.push("");
  }
  
  if (item.takeaways && item.takeaways.length > 0) {
    lines.push("TAKEAWAYS");
    lines.push("");
    item.takeaways.forEach((takeaway, index) => {
      lines.push(`${index + 1}. ${takeaway}`);
    });
  }
  
  return lines.join("\n");
}

async function main() {
  if (!fs.existsSync(UNPROCESSED_FILE)) {
    console.error(`File not found: ${UNPROCESSED_FILE}`);
    process.exit(1);
  }
  
  console.log("📖 Parsing unprocessed evidence file...\n");
  const items = parseEvidenceFile(UNPROCESSED_FILE);
  
  console.log(`Found ${items.length} evidence items\n`);
  
  // Group by phase
  const byPhase: Record<string, EvidenceItem[]> = {};
  for (const item of items) {
    const phase = item.phase || "UNKNOWN";
    if (!byPhase[phase]) {
      byPhase[phase] = [];
    }
    byPhase[phase].push(item);
  }
  
  // Create separate files for each phase
  let totalCreated = 0;
  for (const [phase, phaseItems] of Object.entries(byPhase)) {
    console.log(`\n📁 Processing Phase ${phase} (${phaseItems.length} items)...`);
    
    for (const item of phaseItems) {
      const filename = `${phase.toLowerCase()}-${item.code.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}.md`;
      const filePath = path.join(EVIDENCE_DIR, filename);
      const content = formatEvidenceItem(item);
      
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`  ✓ Created ${filename}`);
      totalCreated++;
    }
  }
  
  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ Processed ${totalCreated} evidence files`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Review the generated files in ${EVIDENCE_DIR}`);
  console.log(`2. Adjust recipients/targeting if needed`);
  console.log(`3. Run: npx tsx scripts/import-evidence.ts`);
  console.log(`4. Consider renaming or deleting ${path.basename(UNPROCESSED_FILE)}`);
}

main().catch(console.error);
