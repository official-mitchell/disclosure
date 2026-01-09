# Character Sheet Feature PRD

## Problem Statement

Players need access to their character information during gameplay without carrying physical sheets. The digital character sheet should be immersive, matching the game's Cold War espionage aesthetic with HOI4-inspired document styling.

## Integration Point

This feature extends the existing Mystery Game app. Players access their character sheet from the same dashboard where they view clues.

---

## Data Model

### Character (extends Player)

The existing Player model gains these fields:

#### Header Info

| Field             | Type   | Notes                                      |
| ----------------- | ------ | ------------------------------------------ |
| display_name      | string | Character name (e.g., "Dr. Oscar Morozov") |
| nationality_bloc  | string | Country affiliation (Russia, US, China)    |
| occupation        | string | Job title + organization                   |
| public_reputation | string | What others know about them                |
| portrait_url      | string | Optional character image                   |

#### Section 1: Roles & Permissions

| Field           | Type     | Notes                                            |
| --------------- | -------- | ------------------------------------------------ |
| archetype_title | string   | Role title (e.g., "Ranking Scientist Tech Lead") |
| permissions     | string[] | What they CAN do                                 |
| restrictions    | string[] | "However..." clauses                             |

#### Section 2: Backstory

| Field     | Type | Notes                                     |
| --------- | ---- | ----------------------------------------- |
| backstory | text | Narrative background (markdown supported) |

#### Section 3: Motivations

| Field       | Type     | Notes                         |
| ----------- | -------- | ----------------------------- |
| motivations | object[] | Array of {label, description} |

Example:

```json
[
  {
    "label": "Legacy",
    "description": "You want your work to matter beyond classified archives."
  },
  {
    "label": "Health",
    "description": "You are being treated for a condition..."
  },
  {
    "label": "Redemption",
    "description": "You want what's best for the country..."
  }
]
```

#### Section 4: Authority Structure

| Field            | Type   | Notes                         |
| ---------------- | ------ | ----------------------------- |
| formal_authority | string | Who has formal power over you |
| informal_fears   | string | Who you fear or rely on       |
| safely_ignore    | string | Who you can dismiss           |

#### Section 5: Exposure Risk

| Field                 | Type | Notes                   |
| --------------------- | ---- | ----------------------- |
| exposure_consequences | text | What happens if exposed |

#### Section 6: Secret Desire

| Field        | Type | Notes                        |
| ------------ | ---- | ---------------------------- |
| private_want | text | What they can't say out loud |

#### Section 7: Disclosure Stance

| Field             | Type | Notes                                              |
| ----------------- | ---- | -------------------------------------------------- |
| disclosure_belief | text | Their philosophy on disclosure (rendered as quote) |

#### Section 8: Knowledge Boundaries

| Field        | Type     | Notes                          |
| ------------ | -------- | ------------------------------ |
| can_discuss  | string[] | Topics they can freely discuss |
| must_conceal | string[] | Secrets they must hide         |

---

## User Flow

### Access Points

1. **Dashboard Nav**: "CHARACTER DOSSIER" button in player nav bar
2. **Direct URL**: `/dashboard/dossier`
3. **Login Confirmation**: Link to dossier shown after successful auth

### Visibility Rules

- Players can ONLY see their own character sheet
- GM can view any character sheet via `/gm/players/[id]/dossier`
- Character data is seeded by GM, not editable by players

---

## Visual Design: HOI4-Style Dossier

### Overall Aesthetic

- Aged paper/parchment background texture
- Typewriter font for headers (Courier, Special Elite, or similar)
- Serif body text
- Red "CLASSIFIED" stamps and folder tab styling
- Subtle coffee stain or fold marks as decorative elements
- Country flag/emblem watermark based on nationality

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                     │
│ │ [FLAG]  │  ████████████████████████████████████████████████   │
│ │ RUSSIA  │  █  CLASSIFIED PERSONNEL DOSSIER                █   │
│ └─────────┘  ████████████████████████████████████████████████   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐   NAME: Dr. Oscar Morozov                     │
│  │              │   ─────────────────────────────────────────   │
│  │  [PORTRAIT]  │   NATIONALITY: Russia                         │
│  │              │   OCCUPATION: Senior Materials Scientist,     │
│  │              │               Energia — State Aerospace Lab   │
│  └──────────────┘                                               │
│                                                                 │
│  PUBLIC PROFILE:                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Developing hypersonic missiles, brilliant, erratic,      │   │
│  │ politically unreliable, stubborn.                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 1: CLEARANCE & PERMISSIONS                          │
│  ══════════════════════════════════════                         │
│                                                                 │
│  DESIGNATION: Ranking Scientist Tech Lead                       │
│                                                                 │
│  AUTHORIZED ACTIONS:                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ Authenticate or debunk evidence with authority        │   │
│  │ ✓ Can be elevated into political position if someone    │   │
│  │   is ousted                                              │   │
│  │ ✓ Sit in on restricted briefings                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠ OPERATIONAL CONSTRAINTS:                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▸ Assume your clues are being spied upon                │   │
│  │ ▸ Assume your credibility is fragile if you talk out    │   │
│  │   of line                                                │   │
│  │ ▸ You need political protection                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 2: BACKGROUND [EYES ONLY]                           │
│  ════════════════════════════════════                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ You were raised on the streets of Soviet Moscow...      │   │
│  │                                                          │   │
│  │ [Full backstory text rendered here with paragraph       │   │
│  │  breaks preserved]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 3: PSYCHOLOGICAL PROFILE                            │
│  ═══════════════════════════════════                            │
│                                                                 │
│  MOTIVATIONAL DRIVERS:                                          │
│                                                                 │
│  ┌─ LEGACY ──────────────────────────────────────────────┐     │
│  │ You want your work to matter beyond classified         │     │
│  │ archives.                                               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ HEALTH ──────────────────────────────────────────────┐     │
│  │ You are being treated for a condition you believe may  │     │
│  │ be related to exposure.                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ REDEMPTION ──────────────────────────────────────────┐     │
│  │ You want what's best for the country, and doubt Putin  │     │
│  │ and his cronies are the right people for the job.      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 4: CHAIN OF COMMAND                                 │
│  ═════════════════════════════                                  │
│                                                                 │
│  FORMAL AUTHORITY:     The Ministry of Defense                  │
│  ───────────────────────────────────────────                    │
│  INFORMAL PRESSURES:   The CIA (American spies) and the GRU    │
│                        (Russian spies)                          │
│  ───────────────────────────────────────────                    │
│  SAFELY IGNORE:        Journalists                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 5: EXPOSURE RISK ASSESSMENT                         │
│  ═════════════════════════════════════                          │
│                                                                 │
│  [RED BORDER BOX]                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ You would lose lab access immediately and likely be     │   │
│  │ reassigned or marginalized. You would not be arrested,  │   │
│  │ but you would disappear professionally.                 │   │
│  │                                                          │   │
│  │ Beyond that, there's potential serious repercussions    │   │
│  │ to your family and yourself.                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 6: CLASSIFIED — PRIVATE OBJECTIVES                  │
│  ════════════════════════════════════════════                   │
│                                                                 │
│  [REDACTED STAMP OVERLAY - but text visible]                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ You want international collaboration, not because you   │   │
│  │ trust anyone, but because you believe no single country │   │
│  │ understands what it has. Saying this openly would end   │   │
│  │ your career.                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 7: DISCLOSURE ASSESSMENT                            │
│  ══════════════════════════════════                             │
│                                                                 │
│  SUBJECT'S STATEMENT:                                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  "I don't have all the pieces to the puzzle. But I      │   │
│  │   know something for sure. The technology I'm           │   │
│  │   developing far exceeds any previously known physics   │   │
│  │   by a long shot..."                                    │   │
│  │                                                          │   │
│  │                           — Dr. Oscar Morozov           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ▼ SECTION 8: OPERATIONAL BOUNDARIES                           │
│  ═══════════════════════════════════                            │
│                                                                 │
│  ┌─ MAY DISCUSS ─────────────────────────────────────────┐     │
│  │ ● Anomalous material properties in abstract            │     │
│  │   scientifically coded terms                            │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ MUST CONCEAL ────────────────────────────────────────┐     │
│  │ ● Multiple samples appear to share non-terrestrial     │     │
│  │   manufacturing signatures                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [FOOTER: Document ID, Classification Level, Country Seal]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Elements by Country

| Country | Primary Color       | Accent    | Watermark                      |
| ------- | ------------------- | --------- | ------------------------------ |
| Russia  | Deep Red (#8B0000)  | Gold      | Hammer & Sickle / Double Eagle |
| US      | Navy Blue (#000080) | White/Red | Eagle / CIA seal               |
| China   | Red (#DE2910)       | Yellow    | Star / MSS emblem              |

### Collapsible Sections

- All sections (▼) are expandable/collapsible
- Default: Sections 1-4 expanded, 5-8 collapsed
- Remembers user preference in localStorage

### Mobile Responsiveness

- Portrait becomes smaller or hidden on mobile
- Sections stack vertically
- Touch-friendly expand/collapse

---

## Implementation

### New Routes

| Route                      | Purpose                    |
| -------------------------- | -------------------------- |
| `/dashboard/dossier`       | Player views own character |
| `/gm/players/[id]/dossier` | GM views any character     |

### New API Endpoints

| Method | Route                          | Purpose                             |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/player/dossier`          | Get current player's character data |
| GET    | `/api/gm/players/[id]/dossier` | GM gets any player's character data |
| PUT    | `/api/gm/players/[id]/dossier` | GM updates character data           |

### New Components

```
/components
  /dossier
    /DossierPage.tsx         # Full page layout
    /DossierHeader.tsx       # Name, portrait, basic info
    /DossierSection.tsx      # Collapsible section wrapper
    /PermissionsSection.tsx  # Section 1
    /BackstorySection.tsx    # Section 2
    /MotivationsSection.tsx  # Section 3
    /AuthoritySection.tsx    # Section 4
    /ExposureSection.tsx     # Section 5
    /PrivateWantSection.tsx  # Section 6
    /DisclosureSection.tsx   # Section 7
    /BoundariesSection.tsx   # Section 8
    /CountryWatermark.tsx    # Background country emblem
    /ClassifiedStamp.tsx     # Decorative stamp element
```

### Prisma Schema Addition

```prisma
model Character {
  id                    String   @id @default(uuid())
  playerId              String   @unique
  player                Player   @relation(fields: [playerId], references: [id])

  // Header
  displayName           String
  nationalityBloc       String
  occupation            String
  publicReputation      String
  portraitUrl           String?

  // Section 1: Roles
  archetypeTitle        String
  permissions           String[]
  restrictions          String[]

  // Section 2: Backstory
  backstory             String

  // Section 3: Motivations (stored as JSON)
  motivations           Json     // [{label, description}]

  // Section 4: Authority
  formalAuthority       String
  informalFears         String
  safelyIgnore          String

  // Section 5: Exposure
  exposureConsequences  String

  // Section 6: Private Want
  privateWant           String

  // Section 7: Disclosure
  disclosureBelief      String

  // Section 8: Boundaries
  canDiscuss            String[]
  mustConceal           String[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

---

## GM Workflow: Seeding Characters

### Option A: Form-based Entry

- `/gm/players/[id]/dossier/edit` - Full form with all fields
- Copy/paste from existing character sheets

### Option B: JSON Import (Recommended for 25 players)

- `/gm/import/characters` - Upload JSON file
- Bulk import all character data at once

Example JSON format:

```json
{
  "characters": [
    {
      "playerName": "Oscar",
      "displayName": "Dr. Oscar Morozov",
      "nationalityBloc": "Russia",
      "occupation": "Senior Materials Scientist, Energia — State Aerospace Lab",
      "publicReputation": "Developing hypersonic missiles, brilliant, erratic...",
      "archetypeTitle": "Ranking Scientist Tech Lead",
      "permissions": [
        "Authenticate or debunk evidence with authority",
        "Can be elevated into political position if someone is ousted",
        "Sit in on restricted briefings"
      ],
      "restrictions": [
        "Assume your clues are being spied upon",
        "Assume your credibility is fragile if you talk out of line",
        "You need political protection"
      ],
      "backstory": "You were raised on the streets of Soviet Moscow...",
      "motivations": [
        { "label": "Legacy", "description": "You want your work to matter..." },
        { "label": "Health", "description": "You are being treated..." },
        { "label": "Redemption", "description": "You want what's best..." }
      ],
      "formalAuthority": "The Ministry of Defense",
      "informalFears": "The CIA (American spies) and the GRU (Russian spies)",
      "safelyIgnore": "Journalists",
      "exposureConsequences": "You would lose lab access immediately...",
      "privateWant": "You want international collaboration...",
      "disclosureBelief": "I don't have all the pieces to the puzzle...",
      "canDiscuss": ["Anomalous material properties in abstract terms"],
      "mustConceal": ["Multiple samples share non-terrestrial signatures"]
    }
  ]
}
```

---

## Implementation Phases

### Phase 1: Data & Basic Display

- [x] Add Character model to Prisma schema
- [x] Create `/api/player/dossier` endpoint
- [x] Build basic DossierPage with unstyled sections
- [x] Link from player dashboard

### Phase 2: HOI4 Styling

- [x] Implement aged paper background
- [x] Add country-specific color themes
- [x] Create ClassifiedStamp component
- [x] Add CountryWatermark component
- [x] Style all 8 sections with borders and typography

### Phase 3: GM Tools

- [x] Create `/gm/players/[id]/dossier` view
- [x] Build character edit form
- [x] Implement JSON bulk import
- [x] Add character preview in player management table

### Phase 4: Polish

- [x] Collapsible sections with animation
- [x] Mobile responsive layout
