# Evidence File Format

Evidence files should be written in Markdown format (.md) and placed in the `evidence/` directory.

## Required Structure

```markdown
Recipients:
[Recipient specification - see below]

Title:
[Evidence title]

Origin:
[Country or organization of origin]

Date:
[Event date]

Summary:
[Main description/backstory of the evidence]

Confidence: [CONFIRMED | HIGH | MEDIUM | LOW | UNVERIFIED]

Source:
[Source of the evidence]

SUPPORTING INTEL

[Additional supporting information, can use markdown formatting]

TAKEAWAYS

1. [First key takeaway]
2. [Second key takeaway]
3. [Third key takeaway]
```

## Recipients Field

The Recipients field determines who can see this evidence. Supported values:

### Everyone
```
Recipients:
Everyone
```
Or:
```
Recipients:
All
```
- **Target Type**: all
- **Effect**: All players can see this evidence

### Specific Country/Bloc
```
Recipients:
US
```
Or: `USA`, `United States`, `RUSSIA`, `Russian`, `CHINA`, `Chinese`

- **Target Type**: country
- **Effect**: Only players from the specified country can see this evidence

### Specific Archetype
```
Recipients:
SCIENTIST
```
Supported archetypes: `SCIENTIST`, `SPY`, `DIPLOMAT`, `GENERAL`, `EXECUTIVE`, `JOURNALIST`, `OPERATIVE`

- **Target Type**: archetype
- **Effect**: Only players with the specified archetype can see this evidence

### Specific Player
```
Recipients:
Alice Johnson
```
- **Target Type**: player
- **Effect**: Only the specified player can see this evidence
- Use the player's short name (from CHARACTER_CODES.md)

## Example Files

### Example 1: Public Welcome Message
```markdown
Recipients:
Everyone

Title:
Welcome to Catastrophic Disclosure

Origin:
The Fucking World

Date:
January 10th, 2025

Summary:
This is a live political and social simulation...

Confidence: HIGH

Source:
Mitchell, your friendly game master

SUPPORTING INTEL

Additional context here...

TAKEAWAYS

1. First important point
2. Second important point
3. Third important point
```

### Example 2: Country-Specific Intelligence
```markdown
Recipients:
US

Title:
Project PHOENIX Status Report

Origin:
United States

Date:
March 14, 2025

Summary:
Classified briefing on Project PHOENIX operations...

Confidence: CONFIRMED

Source:
NSA SIGINT Division

SUPPORTING INTEL

Technical details and analysis...

TAKEAWAYS

1. Operation is proceeding as planned
2. New anomalies detected
```

### Example 3: Archetype-Specific Evidence
```markdown
Recipients:
SCIENTIST

Title:
Biological Sample Analysis

Origin:
MIT Research Lab

Date:
February 1, 2025

Summary:
Laboratory analysis reveals unprecedented findings...

Confidence: HIGH

Source:
Dr. Sarah Chen, Lead Researcher

SUPPORTING INTEL

Scientific methodology and results...

TAKEAWAYS

1. Non-terrestrial origin confirmed
2. Further analysis required
```

## Importing Evidence

1. Place your markdown files in the `evidence/` directory
2. Run the import script:
   ```bash
   npx tsx scripts/import-evidence.ts
   ```
3. Review imported evidence in the GM dashboard
4. Adjust phase, target, and release settings if needed

## Notes

- Files are identified by filename, so renaming a file will create a new evidence entry
- The script uses upsert, so re-running on the same file will update the content
- Metadata fields (phase, legitimacy, confidentiality) default to phase 1, verified, and public
- Auto-release: Evidence targeted to "Everyone" is automatically released
- Other evidence must be manually released through the GM dashboard
