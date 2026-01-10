# Character Sheet HTML Import Feature PRD

## Problem Statement

GM has around 30 character sheets exported as HTML from Notion. We need an automated pipeline to parse these HTML files and sync to the database.

## Scope

- Small utility feature, not user-facing
- Run manually by GM/developer via CLI command
- Idempotent: can re-run to update existing characters

---

## File Structure

```
/characters              # HTML source directory
  /Oscar.html
  /Maria.html
  /Chen.html
  /...
```

### .gitignore Addition

```
# Character sheet HTMLs (contain game spoilers)
/characters/*.html
/characters/
```

---

## HTML Parsing Strategy

### Notion Export Structure

Notion exports HTML with predictable structure:

- Headers become `<h1>`, `<h2>`, `<h3>` tags
- Toggle headers (▼) become `<details><summary>` elements
- Bullet lists become `<ul><li>` elements
- Body text becomes `<p>` tags

### Expected Section Headers

```
<h1>Oscar</h1>

<h2>▼ 0. Header</h2>
  <ul><li>Name: ...</li>...</ul>

<h2>▼ 1. Roles, Permissions, Character Archetype</h2>
  ...

<h2>▼ 2. Backstory</h2>
  <p>...</p>

<h2>▼ 3. What do you care about?</h2>
  ...

<h2>▼ 4. Who do you answer to?</h2>
  ...

<h2>▼ 5. What happens to you if you are exposed?</h2>
  ...

<h2>▼ 6. What do you privately want that you cannot say out loud?</h2>
  ...

<h2>▼ 7. What is Disclosure? And do you believe in it?</h2>
  ...

<h2>▼ 8. What you know vs. What you conceal</h2>
  ...
```

### Parsing Approach

Use `cheerio` (jQuery-like HTML parser for Node) to:

1. Find section headers by text content matching
2. Extract content between sections
3. Parse bullet lists and paragraphs

**No LLM needed** — pure deterministic DOM parsing.

---

## Implementation

### CLI Command

```bash
npm run sync:characters
# or
pnpm exec tsx scripts/sync-characters.ts
```

### Script Location

```
/scripts
  /sync-characters.ts       # Main sync script
  /parse-character-html.ts  # HTML parsing logic
```

### Dependencies

```json
{
  "cheerio": "^1.0.0"
}
```

---

## Parsing Logic

### parse-character-html.ts

```typescript
import * as cheerio from "cheerio";
import fs from "fs";

interface CharacterData {
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  publicReputation: string;
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
  backstory: string;
  motivations: { label: string; description: string }[];
  formalAuthority: string;
  informalFears: string;
  safelyIgnore: string;
  exposureConsequences: string;
  privateWant: string;
  disclosureBelief: string;
  canDiscuss: string[];
  mustConceal: string[];
}

export function parseCharacterHtml(filePath: string): CharacterData {
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  // Helper: find section by header text pattern
  const getSection = (pattern: RegExp) => {
    const header = $("h2, h3")
      .filter((_, el) => pattern.test($(el).text()))
      .first();
    return header.nextUntil("h2, h3");
  };

  // Helper: extract bullet points from a selection
  const getBullets = ($el: cheerio.Cheerio) => {
    return $el
      .find("li")
      .map((_, li) => $(li).text().trim())
      .get();
  };

  // Helper: extract field from "Label: Value" bullet
  const extractField = (bullets: string[], prefix: string) => {
    const line = bullets.find((b) =>
      b.toLowerCase().startsWith(prefix.toLowerCase())
    );
    return line?.split(":").slice(1).join(":").trim() || "";
  };

  // === SECTION 0: Header ===
  const $header = getSection(/0\.\s*Header/i);
  const headerBullets = getBullets($header);

  const displayName = extractField(headerBullets, "Name");
  const nationalityBloc = extractField(headerBullets, "Nationality");
  const occupation = extractField(headerBullets, "Occupation");
  const publicReputation = extractField(headerBullets, "Public Reputation");

  // === SECTION 1: Roles & Permissions ===
  const $roles = getSection(/1\.\s*Roles/i);
  const rolesText = $roles.text();

  // First text element is archetype title
  const archetypeTitle = $roles.find("p").first().text().trim() || "";

  // Split on "However" to separate permissions from restrictions
  const allRolesBullets = getBullets($roles);
  const howeverIdx = rolesText.toLowerCase().indexOf("however");

  let permissions: string[] = [];
  let restrictions: string[] = [];
  1;

  if (howeverIdx > -1) {
    let passedHowever = false;
    $roles.children().each((_, el) => {
      const text = $(el).text();
      if (text.toLowerCase().includes("however")) {
        passedHowever = true;
        return;
      }
      if ($(el).is("ul")) {
        const bullets = getBullets($(el));
        if (passedHowever) {
          restrictions.push(...bullets);
        } else {
          permissions.push(...bullets);
        }
      }
    });
  } else {
    permissions = allRolesBullets;
  }

  // === SECTION 2: Backstory ===
  const $backstory = getSection(/2\.\s*Backstory/i);
  const backstory = $backstory
    .find("p")
    .map((_, p) => $(p).text().trim())
    .get()
    .join("\n\n");

  // === SECTION 3: Motivations ===
  const $motivations = getSection(/3\.\s*What do you care about/i);
  const motivations: { label: string; description: string }[] = [];

  $motivations.find("li, p").each((_, el) => {
    const text = $(el).text().trim();
    const colonIdx = text.indexOf(":");
    if (colonIdx > 0 && colonIdx < 30) {
      motivations.push({
        label: text.slice(0, colonIdx).trim(),
        description: text.slice(colonIdx + 1).trim(),
      });
    }
  });

  // === SECTION 4: Authority ===
  const $authority = getSection(/4\.\s*Who do you answer to/i);
  const authorityText = $authority.text();

  const formalMatch = authorityText.match(
    /formal authority[^?]*\?\s*([^Who]*)/i
  );
  const informalMatch = authorityText.match(
    /informally fear[^?]*\?\s*([^Who]*)/i
  );
  const ignoreMatch = authorityText.match(
    /safely ignore[^?]*\?\s*([^]*?)(?=$|Who|\n\n)/i
  );

  const formalAuthority = formalMatch?.[1]?.trim() || "";
  const informalFears = informalMatch?.[1]?.trim() || "";
  const safelyIgnore = ignoreMatch?.[1]?.trim() || "";

  // === SECTION 5: Exposure ===
  const $exposure = getSection(/5\.\s*What happens.*exposed/i);
  const exposureConsequences = $exposure
    .find("p")
    .map((_, p) => $(p).text().trim())
    .get()
    .join("\n\n");

  // === SECTION 6: Private Want ===
  const $private = getSection(/6\.\s*What do you privately want/i);
  const privateWant = $private
    .find("p")
    .map((_, p) => $(p).text().trim())
    .get()
    .join("\n\n");

  // === SECTION 7: Disclosure ===
  const $disclosure = getSection(/7\.\s*What is Disclosure/i);
  const disclosureBelief = $disclosure
    .find("p")
    .map((_, p) => $(p).text().trim())
    .get()
    .join("\n\n");

  // === SECTION 8: Boundaries ===
  const $boundaries = getSection(/8\.\s*What you know/i);

  let canDiscuss: string[] = [];
  let mustConceal: string[] = [];
  let foundConceal = false;

  $boundaries.children().each((_, el) => {
    const text = $(el).text().toLowerCase();
    if (text.includes("conceal")) foundConceal = true;

    if ($(el).is("ul")) {
      const bullets = getBullets($(el));
      if (foundConceal) {
        mustConceal.push(...bullets);
      } else {
        canDiscuss.push(...bullets);
      }
    }
  });

  return {
    displayName,
    nationalityBloc,
    occupation,
    publicReputation,
    archetypeTitle,
    permissions,
    restrictions,
    backstory,
    motivations,
    formalAuthority,
    informalFears,
    safelyIgnore,
    exposureConsequences,
    privateWant,
    disclosureBelief,
    canDiscuss,
    mustConceal,
  };
}
```

---

## Main Sync Script

### scripts/sync-characters.ts

```typescript
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
    const playerName = path.basename(file, ".html");
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
      console.log(`✗ Failed: ${error.message}`);
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
```

---

## package.json Script

```json
{
  "scripts": {
    "sync:characters": "tsx scripts/sync-characters.ts"
  }
}
```

---

## Usage

```bash
# 1. Export from Notion: Page → Export → HTML
# 2. Save to /characters/Oscar.html (filename = player login name)
# 3. Run sync

npm run sync:characters

# Output:
# Found 25 HTML files
#
# [Oscar.html] ✓ Created "Dr. Oscar Morozov"
# [Maria.html] ✓ Created "Maria Santos"
# [Unknown.html] ⚠ No player "Unknown" — skipped
#
# ────────────────────────────────────
# Created: 24
# Updated: 0
# Skipped: 1
# Failed:  0
```

---

## Pre-requisites

1. **Players must exist in database first**
2. **HTML filename = player login name** (`Oscar.html` → player `name: "Oscar"`)
3. **Export as HTML from Notion** (not Markdown or PDF)
