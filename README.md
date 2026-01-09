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
- Alice Johnson (US, Scientist) - PIN: 1234
- Boris Petrov (Russia, Spy) - PIN: 5678
- Chen Wei (China, Diplomat) - PIN: 9012

**GM:** Password: admin123

## Deployment

### Vercel Deployment

The application is deployed on Vercel at: **https://disclosure-3pp6szwh0-alluminate.vercel.app**

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

## Useful Commands

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema to database
npm run db:seed         # Seed test data
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
