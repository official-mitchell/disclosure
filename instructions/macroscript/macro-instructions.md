# Mystery Game: GM Clue Release System

## Problem Statement

Build a web app enabling a Game Master to selectively reveal evidence/clues to 25 players across 3 factions during a 4-5 phase social experiment game.

This was inspired by Murder Mystery games, but we're doing an international spy drama game based around UAP Disclosure. With an emphasis on chaos and international disintegration and intrigue, focused on defecting strategies and backstabbing, AKA Catastrophic Disclosure.

## Constraints

- Zero hosting cost (Vercel free tier)
- Image uploads required (Vercel Blob or similar free storage)
- No real-time websockets; polling/refresh acceptable
- Single GM, ~25 concurrent players
- Claude Code primary tool, Cursor secondary

## Success Criteria

- Players authenticate via name + PIN in <10 seconds
- GM can release phase clues to all targets in 1 click
- Clue visibility updates propagate within 30 seconds (polling)
- Pre-game connection test confirms player identity

---

## Data Model

### Player

| Field     | Type   | Notes                      |
| --------- | ------ | -------------------------- |
| id        | string | UUID                       |
| name      | string | Real name, unique          |
| pin       | string | 4-6 digit, texted pre-game |
| country   | enum   | `russia`, `us`, `china`    |
| archetype | enum   | See below                  |

### Archetypes (Hardcoded)

```
SCIENTIST, SPY, DIPLOMAT, GENERAL, EXECUTIVE, JOURNALIST, OPERATIVE
```

_(Replace with actual names)_

### Countries (Hardcoded)

```
RUSSIA, US, CHINA
```

### Clue

| Field        | Type      | Notes                                                     |
| ------------ | --------- | --------------------------------------------------------- |
| id           | string    | UUID                                                      |
| title        | string    | Display name (e.g., "Intercepted Transmission - PHOENIX") |
| phase        | int       | 1-5                                                       |
| target_type  | enum      | `all`, `country`, `archetype`, `player`                   |
| target_value | string    | Country/archetype name, player ID, or null for `all`      |
| released     | boolean   | GM toggle                                                 |
| released_at  | timestamp | Auto-set on release                                       |
| retracted    | boolean   | GM can pull back a released clue                          |

#### Clue Metadata

| Field           | Type   | Notes                                                                          |
| --------------- | ------ | ------------------------------------------------------------------------------ |
| legitimacy      | enum   | `verified`, `suspected`, `fabricated`, `unknown`                               |
| confidentiality | enum   | `top_secret`, `confidential`, `shareable_if_pressed`, `public`                 |
| origin_country  | string | Source country (US, Russia, China, UK, Brazil, etc.) - NOT limited to factions |

#### Clue Content (HOI4-Style Event Format)

| Field            | Type   | Notes                                                                                          |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------- |
| event_date       | string | In-game date (e.g., "March 14, 1962")                                                          |
| backstory        | text   | Narrative context, 2-4 sentences                                                               |
| image_url        | string | Optional, uploaded to blob storage                                                             |
| confidence_level | enum   | `confirmed`, `high`, `medium`, `low`, `unverified`                                             |
| supporting_intel | text   | Corroborating evidence or context                                                              |
| source           | string | Origin of intel (e.g., "CIA Station Chief - Berlin", "SIGINT Intercept", "Defector Testimony") |
| takeaways        | text[] | Array of bullet-point conclusions/actions                                                      |

### Origin Countries (Not Hardcoded - GM Can Add)

```
US, RUSSIA, CHINA, UK, BRAZIL, FRANCE, ISRAEL, INDIA, PAKISTAN, etc.
```

_(Stored as free text string, not enum - allows flexibility)_

### ClueAssignment (for randomized releases)

| Field       | Type      | Notes |
| ----------- | --------- | ----- |
| clue_id     | string    | FK    |
| player_id   | string    | FK    |
| assigned_at | timestamp |       |

---

## Core Features

### F1: Player Authentication

- Login: name + PIN
- On success: display "Connection confirmed! You are [Name], [Archetype], [Country]"
- Session persists via cookie/token
- No registration flow; GM pre-seeds all players

### F2: Player Clue View

- Dashboard shows all clues visible to current player
- Visibility logic: `released=true` AND `retracted=false` AND (target matches player OR player in ClueAssignment)
- Auto-refresh every 15 seconds OR manual refresh button
- Sort by `released_at` descending (newest first)

#### Clue Card Layout (HOI4-Style Event)

```
┌─────────────────────────────────────────────────┐
│ [ORIGIN FLAG]  TITLE                            │
│ March 14, 1962                                  │
├─────────────────────────────────────────────────┤
│ ┌─────────────┐                                 │
│ │   IMAGE     │  BACKSTORY TEXT                 │
│ │             │  2-4 sentences of narrative     │
│ │             │  context...                     │
│ └─────────────┘                                 │
├─────────────────────────────────────────────────┤
│ CONFIDENCE: ██████░░░░ HIGH                     │
│ SOURCE: CIA Station Chief - Berlin              │
├─────────────────────────────────────────────────┤
│ SUPPORTING INTEL:                               │
│ Corroborating evidence paragraph...             │
├─────────────────────────────────────────────────┤
│ TAKEAWAYS:                                      │
│ • First actionable conclusion                   │
│ • Second actionable conclusion                  │
│ • Third actionable conclusion                   │
├─────────────────────────────────────────────────┤
│ [VERIFIED ✓]  [CONFIDENTIAL - DO NOT SHARE]     │
└─────────────────────────────────────────────────┘
```

**Visual Indicators:**

- **Legitimacy badge**: Green (verified), Yellow (suspected), Red (fabricated), Gray (unknown)
- **Confidentiality banner**:
  - `top_secret`: Red banner "TOP SECRET - DENY ALL KNOWLEDGE"
  - `confidential`: Orange banner "CONFIDENTIAL"
  - `shareable_if_pressed`: Yellow banner "SHARE ONLY IF CORNERED"
  - `public`: Green banner "PUBLIC INFORMATION"
- **Confidence meter**: Visual bar + label

### F3: GM Authentication

- Separate login route (`/gm`)
- Single hardcoded GM credential (env var)

### F4: GM Dashboard

- Table view: all clues grouped by phase
- Columns: title, target_type, target_value, released status, actions
- Expand row to preview full clue content

### F5: GM Clue Management

- **Create clue**:
  - Basic: title, phase, target_type, target_value
  - Metadata: legitimacy, confidentiality, origin_country
  - Content: event_date, backstory, image upload, confidence_level, supporting_intel, source, takeaways[]
- **Edit clue**: all fields mutable until released
- **Delete clue**: soft delete or hard delete pre-release only
- **Preview**: render clue as player would see it before releasing

### F6: GM Release Controls

- **Phase release button**: releases ALL unreleased clues for selected phase
- **Individual toggle**: release/unrelease single clue
- **Retract clue**: pull back a released clue (sets `retracted=true`, disappears from player view)
- **Randomize release** (for archetype/country targets):
  - Select clue → "Randomize to 1" OR "Randomize to 50%"
  - Creates ClueAssignment records for randomly selected subset
  - Clue remains `released=false` (assignment is the visibility mechanism)

### F7: GM Player Impersonation View

- **View as player**: dropdown to select any player
- Renders player dashboard exactly as that player sees it
- Shows all clues currently visible to selected player
- Visual indicator: "Viewing as: [Player Name]" banner
- Quick switch between players without logging out

### F8: GM Player Management

- View all players table
- Edit player details (name, PIN, country, archetype)
- Bulk import via CSV optional (nice-to-have)

---

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- Tailwind CSS (minimal styling)
- SWR or React Query for polling

### Backend

- Next.js API Routes (serverless)
- Vercel Postgres (free tier: 256MB)
- Vercel Blob (free tier: 1GB for images)

### Auth

- Simple session token in cookie
- No external auth provider needed

### ORM

- Prisma (type-safe, good Vercel integration)

---

## Implementation Phases

## Phase 1: Project Scaffold & Auth

### 1.1 Initialize Project

- [x] Create Next.js 14 project with App Router
- [x] Configure Tailwind CSS
- [x] Set up Vercel Postgres connection
- [x] Initialize Prisma schema with Player, Clue, ClueAssignment models

### 1.2 Player Auth

- [x] `/login` page: name + PIN form
- [x] API route: `POST /api/auth/player` validates credentials, sets session cookie
- [x] Middleware: protect `/dashboard` routes

### 1.3 GM Auth

- [x] `/gm/login` page: password-only form
- [x] API route: `POST /api/auth/gm` validates against env var
- [x] Middleware: protect `/gm/*` routes

## Phase 2: Player Experience

### 2.1 Player Dashboard

- [x] `/dashboard` page: fetch visible clues for current player
- [x] API route: `GET /api/clues/visible` returns filtered clues
- [x] Clue card component: title, image, description, interpretation
- [x] Polling: SWR with 15-second refresh interval

### 2.2 Connection Test

- [x] On successful login, display confirmation with player details
- [x] "Test connection" page accessible pre-game

## Phase 3: GM Clue Management

### 3.1 Clue CRUD

- [x] `/gm/clues` table view with phase grouping
- [x] `/gm/clues/new` create form with image upload
- [x] `/gm/clues/[id]/edit` edit form
- [x] API routes: `POST/PUT/DELETE /api/gm/clues`

### 3.2 Image Upload

- [x] Integrate Vercel Blob for image storage
- [x] Upload component in clue form
- [x] Display uploaded images in clue cards

## Phase 4: GM Release System

### 4.1 Release Controls

- [x] Phase release button: `POST /api/gm/release/phase/[phase]`
- [x] Individual toggle: `PATCH /api/gm/clues/[id]/release`
- [x] Retract button: `PATCH /api/gm/clues/[id]/retract`
- [x] Release status indicators in table

### 4.2 Randomization

- [x] "Randomize" dropdown on archetype/country-targeted clues
- [x] Options: "1 random" or "50%"
- [x] API route: `POST /api/gm/clues/[id]/randomize` creates ClueAssignment records
- [x] Display assigned players in clue detail view
      1

### 4.3 View As Player

- [x] `/gm/view-as/[playerId]` page renders player dashboard
- [x] Player selector dropdown in GM nav
- [x] "Viewing as: [Name]" banner
- [x] API route: `GET /api/gm/view-as/[playerId]`

## Phase 5: GM Player Management

### 5.1 Player Admin

- [x] `/gm/players` table view
- [x] Inline edit or modal for player details
- [x] API routes: `GET/PUT /api/gm/players`

### 5.2 Seed Data

- [x] Script to seed initial players from JSON/CSV
- [x] Generate random PINs for each player

---

## API Routes Summary

| Method | Route                           | Purpose                      |
| ------ | ------------------------------- | ---------------------------- |
| POST   | `/api/auth/player`              | Player login                 |
| POST   | `/api/auth/gm`                  | GM login                     |
| GET    | `/api/clues/visible`            | Player's visible clues       |
| GET    | `/api/gm/clues`                 | All clues (GM)               |
| POST   | `/api/gm/clues`                 | Create clue                  |
| PUT    | `/api/gm/clues/[id]`            | Update clue                  |
| DELETE | `/api/gm/clues/[id]`            | Delete clue                  |
| PATCH  | `/api/gm/clues/[id]/release`    | Toggle release               |
| PATCH  | `/api/gm/clues/[id]/retract`    | Retract released clue        |
| POST   | `/api/gm/release/phase/[phase]` | Release all phase clues      |
| POST   | `/api/gm/clues/[id]/randomize`  | Random assignment            |
| GET    | `/api/gm/players`               | All players                  |
| PUT    | `/api/gm/players/[id]`          | Update player                |
| GET    | `/api/gm/view-as/[playerId]`    | Get clues as specific player |

---

## Environment Variables

```
DATABASE_URL=           # Vercel Postgres connection string
BLOB_READ_WRITE_TOKEN=  # Vercel Blob token
GM_PASSWORD=            # Single GM password
SESSION_SECRET=         # Cookie signing key
```

---

## Nice-to-Have (Post-MVP)

- [ ] Visual indicator when new clues appear (highlight/badge)
- [ ] Clue read receipts (track which players viewed)
- [ ] Export game state to JSON for post-game analysis
- [ ] Bulk CSV import for players
- [ ] Phase timer/countdown display

---

## File Structure (Target)

```
/app
  /login/page.tsx
  /dashboard/page.tsx
  /gm
    /login/page.tsx
    /clues/page.tsx
    /clues/new/page.tsx
    /clues/[id]/edit/page.tsx
    /players/page.tsx
    /view-as/[playerId]/page.tsx
/components
  /ClueCard.tsx
  /ClueTable.tsx
  /PlayerTable.tsx
  /ReleaseControls.tsx
  /ViewAsPlayerSelector.tsx
  /ConfidenceMeter.tsx
  /LegitimacyBadge.tsx
  /ConfidentialityBanner.tsx
/lib
  /auth.ts
  /db.ts
  /constants.ts (archetypes, factions, origin countries)
/prisma
  /schema.prisma
```
