# Catastrophic Disclosure

Mystery Game - GM Clue Release System

A web application enabling a Game Master to selectively reveal evidence/clues to 25 players across 3 factions during a 4-5 phase social experiment game inspired by Murder Mystery games, focused on international spy drama and UAP Disclosure.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel Postgres
- **ORM**: Prisma
- **Storage**: Vercel Blob (for images)
- **Styling**: Tailwind CSS
- **Authentication**: Session-based with cookies

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Vercel Postgres recommended)
- Vercel Blob storage token (optional, for image uploads)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GM_PASSWORD`: Choose a secure GM password
   - `SESSION_SECRET`: Generate a secure random string (32+ chars)
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token (optional)

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

7. Seed the database with test data:
   ```bash
   npm run db:seed
   ```

8. Start the development server:
   ```bash
   npm run dev
   ```

9. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app                    # Next.js app router pages
  /login               # Player authentication
  /dashboard           # Player clue view
  /gm                  # GM routes
    /login            # GM authentication
    /clues            # Clue management
    /players          # Player management
/components            # React components
/lib                   # Utilities
  /constants.ts        # Game constants (countries, archetypes)
  /db.ts              # Prisma client instance
/prisma                # Database schema
  /schema.prisma      # Data models
```

## Data Models

- **Player**: Game participants with country and archetype
- **Clue**: Evidence/intel with targeting and release controls
- **ClueAssignment**: Randomized clue-to-player assignments

## Features

- Player authentication (name + PIN)
- GM dashboard with clue management
- Phase-based clue release system
- Individual and bulk release controls
- Clue retraction capability
- Player impersonation view for GM
- HOI4-style event card display
- Polling-based updates (no websockets)

## Development Status

**Phase 1.1 Complete** ✓
- Next.js 14 project scaffolded
- Tailwind CSS configured
- Prisma schema initialized
- Database connection configured

**Phase 1.2 Complete** ✓
- Player login page and authentication
- Session management with JWT
- Protected routes middleware
- Player dashboard with connection confirmation

**Phase 1.3 Complete** ✓
- GM login page and authentication
- GM dashboard with navigation
- Placeholder pages for clue and player management
- Logout functionality

**Phase 2 Complete** ✓
- Clue visibility API with filtering
- ClueCard component with HOI4-style design
- Auto-refresh polling (15s)

**Phase 3 Complete** ✓
- GM clue list view (grouped by phase)
- Create/edit clue forms
- Clue CRUD APIs

**Phase 4 Complete** ✓
- Release/retract individual clues
- Phase-wide release (bulk)
- Randomize assignments (1 or 50%)
- View As Player feature
- Live stats on GM dashboard

**Phase 5 Complete** ✓
- Player list view with stats
- Add/edit/delete players
- Inline editing
- All CRUD operations

**All Phases Complete!** 🎉

## Test Credentials

After running `npm run db:seed`:

**Players:**
- Test players will be created with the `[EXAMPLE]` prefix
- Use the migration scripts to populate with actual game players
- Remove example players before production deployment: `npx tsx scripts/remove-example-players.ts`

**GM:** Password set via `GM_PASSWORD` environment variable

## Deployment

### Vercel Deployment

The application is deployed on Vercel at: **https://disclosure-alluminate.vercel.app**

(Individual deployments also get unique URLs like `disclosure-xxxxx-alluminate.vercel.app`, but the main production URL above always points to the latest successful deployment)

#### Initial Setup

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Create Vercel Postgres Database**:
   - Go to your Vercel project dashboard
   - Navigate to the **Storage** tab
   - Create a new **Postgres Database**
   - This automatically sets `DATABASE_URL`, `POSTGRES_URL`, and `PRISMA_DATABASE_URL`

4. **Set Environment Variables**:
   ```bash
   vercel env add GM_PASSWORD production
   vercel env add SESSION_SECRET production
   vercel env add BLOB_READ_WRITE_TOKEN production  # Optional
   ```

5. **Deploy**:
   ```bash
   vercel --prod
   ```

6. **Initialize Database Schema**:
   ```bash
   vercel env pull .env.production
   DATABASE_URL=$(grep POSTGRES_URL .env.production | cut -d '=' -f2- | tr -d '"') npx prisma db push
   ```

#### Subsequent Deployments

Simply push changes and deploy:
```bash
git add .
git commit -m "Your commit message"
vercel --prod
```

If schema changes are made, sync the database:
```bash
DATABASE_URL=$(grep POSTGRES_URL .env.production | cut -d '=' -f2- | tr -d '"') npx prisma db push
```

## Database Migrations and Maintenance

### Naming Conventions

**Player Names**:
- Production player names should NEVER have an `[EXAMPLE]` prefix
- Example players are for testing only and should be removed before deployment
- Player names must match exactly (case-sensitive) across all imports and scripts

**Database Enums**:
- **Country**: `US`, `RUSSIA`, `CHINA`
- **Demeanor**: `ANTI_DISCLOSURE`, `AGNOSTIC`, `PRO_DISCLOSURE`
- **Archetype**: `MILITARY_DEFENSE_CONTRACTOR`, `HIGH_RANKING_POLITICIAN`, `INTEL_OLIGARCH`, `JOURNALIST_MEDIA`, `HIGH_RANKING_SCIENTIST`

### Migration Scripts

Located in `/scripts/`:

```bash
# Migrate player attributes (country, demeanor, archetype)
npx tsx scripts/migrate-players.ts

# Migrate clue targeting system
npx tsx scripts/migrate-clues.ts

# Remove example/test players
npx tsx scripts/remove-example-players.ts

# Check migration status
npx tsx scripts/check-db-status.ts
npx tsx scripts/check-unmigrated.ts
```

### Evidence Import

Import evidence files from markdown format:

```bash
# Import evidence from /evidence directory
npx tsx scripts/import-evidence.ts
```

**Evidence File Naming Convention**:
- Files should be in markdown format (`.md`)
- Place in `/evidence/` directory
- See `/evidence/EVIDENCE_FORMAT.md` for structure requirements

## Character Sheet Import

Import character sheets from Notion HTML exports into the database.

### File Naming Convention

**CRITICAL**: HTML files must be named **exactly** as the player's login name.

Examples:
- If the player login name is `Kassidy Neville`, the file must be `Kassidy Neville.html`
- If the player login name is `Sarah Fierce`, the file must be `Sarah Fierce.html`

The filename (without `.html`) must match the `name` field in the Player table exactly (case-sensitive, including spaces and special characters).

### Step-by-Step Instructions

1. **Export from Notion**
   - Open the character sheet page in Notion
   - Click `...` (More actions) → `Export`
   - Select format: `HTML`
   - Click `Export`

2. **Name the file correctly**
   - Find the player's login name in the GM Players panel or database
   - Rename the exported HTML file to match exactly: `[PLAYER_NAME].html`
   - Example: `[EXAMPLE] Alice Johnson.html`

3. **Place in /characters directory**
   - Move or copy the HTML file to `/characters/` folder in the project root
   - Repeat for all character sheets

4. **Run the import**
   ```bash
   npm run sync:characters
   ```

5. **Review the output**
   ```
   Found 12 HTML files

   [[EXAMPLE] Alice Johnson.html] ✓ Created "Dr. Alice Johnson"
   [[EXAMPLE] Boris Petrov.html] ✓ Updated "Boris Petrov"
   [UnknownPlayer.html] ⚠ No player "UnknownPlayer" — skipped

   ────────────────────────────────────
   Created: 8
   Updated: 3
   Skipped: 1
   Failed:  0
   ```

### Troubleshooting

- **"No player found"**: The filename doesn't match any player's login name. Check the exact name in the database.
- **Parsing errors**: Ensure the HTML export follows the expected 8-section structure (0. Header, 1. Roles, 2. Backstory, etc.)
- **Missing fields**: The parser will leave fields empty if sections aren't found. Review the character in the database after import.

### Notes

- The import is **idempotent** — you can re-run it to update existing characters
- HTML files in `/characters/` are git-ignored to prevent spoilers
- Players must exist in the database before importing characters (run `npm run db:seed` first for test data)

## Useful Commands

```bash
# Development
npm run dev                              # Start dev server
npm run build                            # Build for production

# Database
npx prisma studio                        # Open database GUI
npx prisma db push                       # Push schema to database
npx prisma generate                      # Regenerate Prisma client
npm run db:seed                          # Seed test data

# Imports
npm run sync:characters                  # Import character sheets from HTML
npx tsx scripts/import-evidence.ts       # Import evidence from markdown

# Migrations
npx tsx scripts/migrate-players.ts       # Migrate player attributes
npx tsx scripts/migrate-clues.ts         # Migrate clue targeting
npx tsx scripts/remove-example-players.ts # Remove example players
npx tsx scripts/check-db-status.ts       # Check migration status
```

## Routes

- `/` - Home
- `/login` - Player login
- `/dashboard` - Player dashboard (protected)
- `/gm/login` - GM login
- `/gm/dashboard` - GM control panel (protected)

## Known Issues

- Middleware deprecation warning (Next.js 16) - cosmetic only (will be addressed in future Next.js release)
- PINs stored as plain text - should hash in production
- No rate limiting yet

## Recent Updates

- **Next.js 16 Compatibility**: Updated all route handlers to use async params API
- **Vercel Deployment**: Successfully deployed to production with Vercel Postgres

## License

ISC
