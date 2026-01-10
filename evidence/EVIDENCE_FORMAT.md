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

The Recipients field determines who can see this evidence. You can combine multiple filters using `+` or `,` to create precise targeting.

### Everyone (No Filters)
```
Recipients:
Everyone
```
Or:
```
Recipients:
All
```
- All players can see this evidence
- Auto-released upon import

### Country/Bloc Filters

Target players from specific countries:

```
Recipients:
US
```
Supported: `US`, `USA`, `United States`, `RUSSIA`, `Russian`, `CHINA`, `Chinese`

### Archetype Filters

Target players with specific roles:

```
Recipients:
Military / Defense Contractor
```

Supported archetypes:
- `Military / Defense Contractor` (also: `Military`, `Defense Contractor`)
- `High Ranking Politician` (also: `Politician`)
- `Intel / Oligarch` (also: `Intel`, `Oligarch`)
- `Journalist / Media` (also: `Journalist`, `Media`)
- `High Ranking Scientist` (also: `Scientist`)

### Demeanor Filters

Target players based on their stance on disclosure:

```
Recipients:
Pro-Disclosure
```

Supported demeanors:
- `Pro-Disclosure` (also: `Pro Disclosure`, `ProDisclosure`)
- `Anti-Disclosure` (also: `Anti Disclosure`, `AntiDisclosure`)
- `Agnostic`

### Specific Player

Target an individual player by name:

```
Recipients:
Alice Johnson
```
Use the player's short name (from CHARACTER_CODES.md)

### Combination Targeting

Combine multiple filters with `+` or `,`:

```
Recipients:
US + Pro-Disclosure
```
Only US players with Pro-Disclosure demeanor will see this

```
Recipients:
Russia + Military / Defense Contractor
```
Only Russian military/defense contractors will see this

```
Recipients:
High Ranking Scientist + Anti-Disclosure
```
Only scientists with Anti-Disclosure stance (across all countries) will see this

```
Recipients:
China + Journalist / Media + Agnostic
```
Only Chinese journalists with Agnostic demeanor will see this

## Example Files

### Example 1: Public Welcome Message
```markdown
Recipients:
Everyone

Title:
Welcome to Catastrophic Disclosure

Origin:
Game Master

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

### Example 3: Archetype + Demeanor
```markdown
Recipients:
Military / Defense Contractor + Pro-Disclosure

Title:
Insider's Dilemma

Origin:
Anonymous Whistleblower

Date:
February 15, 2025

Summary:
A message to those in the military-industrial complex who believe disclosure is necessary...

Confidence: MEDIUM

Source:
Encrypted Drop

SUPPORTING INTEL

Strategic considerations and personal testimony...

TAKEAWAYS

1. Some insiders are ready to speak
2. Institutional pressure remains intense
```

### Example 4: Multi-Filter Combination
```markdown
Recipients:
Russia + Intel / Oligarch + Anti-Disclosure

Title:
Control Protocol Update

Origin:
Russian Intelligence

Date:
March 1, 2025

Summary:
Updated protocols for maintaining operational security...

Confidence: HIGH

Source:
FSB Internal Memo

SUPPORTING INTEL

Detailed operational instructions...

TAKEAWAYS

1. Maintain information discipline
2. Counter pro-disclosure narratives
3. Coordinate with international counterparts
```

### Example 5: Individual Player
```markdown
Recipients:
Alice Johnson

Title:
Personal Communication

Origin:
Unknown

Date:
February 20, 2025

Summary:
A message intended only for Dr. Alice Johnson...

Confidence: UNVERIFIED

Source:
Anonymous

SUPPORTING INTEL

Content specific to this player's situation...

TAKEAWAYS

1. Someone knows about your work
2. You may have allies you don't know about
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

- **Combination Logic**: All specified filters must match (AND logic). A player must match ALL criteria to receive the evidence.
- **Auto-Release**: Only evidence targeted to "Everyone" is automatically released. All other evidence must be manually released through the GM dashboard.
- **File Identification**: Files are identified by filename, so renaming a file will create a new evidence entry.
- **Upsert Behavior**: Re-running the import on the same file will update the content but preserve targeting/metadata set by GM.
- **Defaults**: New evidence defaults to phase 1, verified legitimacy, and public confidentiality.
- **Case Insensitive**: Recipient parsing is case-insensitive and flexible with formatting.

## Valid Recipient Combinations

Here are some valid recipient patterns:

| Recipients | Who Sees It |
|------------|-------------|
| `Everyone` | All players |
| `US` | All US players |
| `Pro-Disclosure` | All pro-disclosure players (any country) |
| `Military / Defense Contractor` | All military/defense players (any country) |
| `US + Pro-Disclosure` | US pro-disclosure players only |
| `Russia + Anti-Disclosure` | Russian anti-disclosure players only |
| `China + High Ranking Scientist` | Chinese scientists only |
| `Journalist / Media + Agnostic` | Agnostic journalists (any country) |
| `US + Military / Defense Contractor + Anti-Disclosure` | US military/defense with anti-disclosure stance |
| `Alice Johnson` | Only Alice Johnson |

## Testing Your Recipients

After importing, check the import output to see how recipients were parsed:

```
[my-evidence] ✓ Created "My Title" (Target: US + PRO_DISCLOSURE)
```

This confirms the targeting was parsed correctly.
