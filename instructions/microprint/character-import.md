# Character Sheet PDF Import Feature PRD

## Problem Statement

GM has 25 character sheets as PDFs following a standard 8-section format. Manually entering this data would be tedious and error-prone. We need an automated pipeline to parse PDFs and sync to the database.

## Scope

- Small utility feature, not user-facing
- Run manually by GM/developer via CLI command
- Idempotent: can re-run to update existing characters

---

## File Structure

```
/characters              # PDF source directory
  /Oscar.pdf
  /Maria.pdf
  /Chen.pdf
  /...
```

### .gitignore Addition

```
# Character sheet PDFs (contain game spoilers)
/characters/*.pdf
/characters/
```

---

## PDF Parsing Strategy

### Expected PDF Structure

Each PDF follows this section pattern (based on Oscar's sheet):

```
[Character Name]

▼ 0. Header
- Name: [display_name]
- Nationality / Bloc: [nationality_bloc]
- Occupation: [occupation]
- Public Reputation: [public_reputation]

▼ 1. Roles, Permissions, Character Archetype
[archetype_title]
[bullet list of permissions]
However...
[bullet list of restrictions]

▼ 2. Backstory
[paragraphs of backstory text]

▼ 3. What do you care about?
[Label]: [description]
[Label]: [description]
...

▼ 4. Who do you answer to?
Who has formal authority over you?
[formal_authority]
Who you informally fear or rely on?
[informal_fears]
Who you can safely ignore?
[safely_ignore]

▼ 5. What happens to you if you are exposed?
[exposure_consequences]

▼ 6. What do you privately want that you cannot say out loud?
[private_want]

▼ 7. What is Disclosure? And do you believe in it?
[disclosure_belief - often in quotes]

▼ 8. What you know vs. What you conceal
[can_discuss bullets]
[must_conceal bullets]
```

### Parsing Approach

**Option A: LLM-assisted parsing (Recommended)**

- Use Claude API to extract structured JSON from PDF text
- More robust to formatting variations
- Handles edge cases gracefully

**Option B: Regex-based parsing**

- Faster, no API cost
- Brittle if PDF format varies
- Requires consistent section headers

**Recommendation:** Use Option A with Claude API. The PDFs may have slight formatting differences, and LLM parsing handles ambiguity well.

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
  /sync-characters.ts    # Main sync script
  /parse-character-pdf.ts # PDF parsing logic
```

### Script Flow

```
1. Read /characters directory
2. For each *.pdf file:
   a. Extract text from PDF (pdf-parse library)
   b. Send text to Claude API with extraction prompt
   c. Receive structured JSON
   d. Upsert to database (match on player name)
3. Log results: created/updated/failed
```

### Dependencies

```json
{
  "pdf-parse": "^1.1.1",
  "@anthropic-ai/sdk": "^0.24.0"
}
```

### Environment Variables

```
ANTHROPIC_API_KEY=       # For PDF parsing
```

---

## Claude API Prompt for Extraction

```typescript
const EXTRACTION_PROMPT = `
You are parsing a character sheet PDF for a mystery game. Extract the following fields as JSON.

The PDF has 8 numbered sections (0-8). Extract each field precisely.

Return ONLY valid JSON with this structure:
{
  "displayName": "Full character name from Header",
  "nationalityBloc": "Russia | US | China",
  "occupation": "Job title and organization",
  "publicReputation": "What they're known for",
  
  "archetypeTitle": "Role title from Section 1",
  "permissions": ["array", "of", "can-do items"],
  "restrictions": ["array", "of", "however clauses"],
  
  "backstory": "Full backstory text from Section 2",
  
  "motivations": [
    {"label": "Label", "description": "Description"}
  ],
  
  "formalAuthority": "From Section 4",
  "informalFears": "From Section 4", 
  "safelyIgnore": "From Section 4",
  
  "exposureConsequences": "Full text from Section 5",
  
  "privateWant": "Full text from Section 6",
  
  "disclosureBelief": "Full text from Section 7 (may be in quotes)",
  
  "canDiscuss": ["array of things they can discuss"],
  "mustConceal": ["array of things they must hide"]
}

PDF TEXT:
---
{pdf_text}
---

Return ONLY the JSON object, no markdown formatting.
`;
```

---

## Database Sync Logic

### Matching Strategy

- Match character to player by **name field**
- PDF filename (e.g., `Oscar.pdf`) should match player's login name
- If no matching player exists, log warning and skip

### Upsert Behavior

```typescript
// Pseudocode
for (const pdf of pdfFiles) {
  const playerName = getNameFromFilename(pdf); // "Oscar.pdf" → "Oscar"
  const player = await db.player.findUnique({ where: { name: playerName } });

  if (!player) {
    console.warn(`No player found for ${playerName}, skipping`);
    continue;
  }

  const parsed = await parseCharacterPdf(pdf);

  await db.character.upsert({
    where: { playerId: player.id },
    create: { playerId: player.id, ...parsed },
    update: { ...parsed },
  });

  console.log(`✓ Synced ${playerName}`);
}
```

---

## Output Logging

```
$ npm run sync:characters

Scanning /characters...
Found 25 PDF files

[1/25] Oscar.pdf
  → Extracted: Dr. Oscar Morozov (Russia, Scientist)
  → Database: UPDATED existing character

[2/25] Maria.pdf
  → Extracted: Maria Santos (US, Diplomat)
  → Database: CREATED new character

[3/25] Unknown.pdf
  → WARNING: No player "Unknown" found, skipping

...

Summary:
  Created: 12
  Updated: 12
  Skipped: 1
  Failed: 0
```

---

## Error Handling

| Error                 | Handling                            |
| --------------------- | ----------------------------------- |
| PDF read failure      | Log error, continue to next file    |
| Claude API failure    | Retry once, then log and skip       |
| Invalid JSON response | Log raw response, skip              |
| No matching player    | Warn and skip (don't create orphan) |
| Database error        | Log full error, abort sync          |

---

## File: scripts/sync-characters.ts

```typescript
// Implementation skeleton

import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../lib/db";

const CHARACTERS_DIR = path.join(process.cwd(), "characters");

async function main() {
  const files = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((f) => f.endsWith(".pdf"));

  console.log(`Found ${files.length} PDF files\n`);

  let created = 0,
    updated = 0,
    skipped = 0,
    failed = 0;

  for (const file of files) {
    const playerName = path.basename(file, ".pdf");
    console.log(`Processing ${file}...`);

    try {
      // 1. Find matching player
      const player = await prisma.player.findUnique({
        where: { name: playerName },
      });

      if (!player) {
        console.warn(`  ⚠ No player "${playerName}" found, skipping`);
        skipped++;
        continue;
      }

      // 2. Extract PDF text
      const pdfBuffer = fs.readFileSync(path.join(CHARACTERS_DIR, file));
      const pdfData = await pdf(pdfBuffer);

      // 3. Parse with Claude
      const characterData = await parseWithClaude(pdfData.text);

      // 4. Upsert to database
      const existing = await prisma.character.findUnique({
        where: { playerId: player.id },
      });

      await prisma.character.upsert({
        where: { playerId: player.id },
        create: { playerId: player.id, ...characterData },
        update: characterData,
      });

      if (existing) {
        console.log(`  ✓ Updated ${characterData.displayName}`);
        updated++;
      } else {
        console.log(`  ✓ Created ${characterData.displayName}`);
        created++;
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      failed++;
    }
  }

  console.log(
    `\nSummary: ${created} created, ${updated} updated, ${skipped} skipped, ${failed} failed`
  );
}

async function parseWithClaude(pdfText: string): Promise<CharacterData> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: EXTRACTION_PROMPT.replace("{pdf_text}", pdfText),
      },
    ],
  });

  const json = response.content[0].text;
  return JSON.parse(json);
}

main().catch(console.error);
```

---

## Pre-requisites Before Running

1. **Players must exist in database first**

   - Run player seed script before character sync
   - PDF filename must match player name exactly

2. **PDF naming convention**

   - `Oscar.pdf` matches player with `name: "Oscar"`
   - Case-sensitive

3. **Anthropic API key set**
   - Required for LLM parsing
