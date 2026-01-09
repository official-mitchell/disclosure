# Development Documentation

# Phase 1.1 - Project Initialization Complete ✓

## Completed Tasks

### 1. Create Next.js 14 Project with App Router ✓

- Initialized Next.js 16.1.1 with App Router
- TypeScript configured
- Project structure created:
  - `/app` - Next.js pages
  - `/components` - React components
  - `/lib` - Utilities and helpers
  - `/prisma` - Database schema

### 2. Configure Tailwind CSS ✓

- Tailwind CSS v4 installed and configured
- PostCSS with @tailwindcss/postcss plugin
- Global styles configured
- Dark mode support ready

### 3. Set up Vercel Postgres Connection ✓

- Environment variables configured (`.env.example` and `.env`)
- Database connection ready for Vercel Postgres
- Connection variables:
  - `DATABASE_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `GM_PASSWORD`
  - `SESSION_SECRET`

### 4. Initialize Prisma Schema with Models ✓

- Prisma v5.22.0 installed (stable version for Vercel)
- Schema created with complete data models:
  - **Player**: id, name, pin, country, archetype
  - **Clue**: Complete clue model with metadata and content fields
  - **ClueAssignment**: For randomized clue distribution
- Enums defined:
  - Country (RUSSIA, US, CHINA)
  - Archetype (SCIENTIST, SPY, DIPLOMAT, GENERAL, EXECUTIVE, JOURNALIST, OPERATIVE)
  - TargetType (all, country, archetype, player)
  - Legitimacy (verified, suspected, fabricated, unknown)
  - Confidentiality (top_secret, confidential, shareable_if_pressed, public)
  - ConfidenceLevel (confirmed, high, medium, low, unverified)

## Files Created

### Configuration

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variables template
- `.env` - Local environment variables

### Application

- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Home page with login links
- `app/globals.css` - Global styles with Tailwind

### Database & Utilities

- `prisma/schema.prisma` - Complete database schema
- `lib/db.ts` - Prisma client singleton
- `lib/constants.ts` - Game constants and display names

### Documentation

- `README.md` - Project documentation
- `PHASE_1_1_COMPLETE.md` - This completion summary

## Build Status

✅ Build successful
✅ TypeScript compilation clean
✅ No errors or warnings

## Next Steps - Phase 1.2: Player Authentication

1. Create `/app/login/page.tsx` - Player login form
2. Create API route `POST /api/auth/player` - Validate credentials
3. Implement session management with cookies
4. Create middleware to protect `/dashboard` routes
5. Test player authentication flow

## How to Continue

1. Make sure your database is set up (local PostgreSQL or Vercel Postgres)
2. Update the `DATABASE_URL` in `.env` with your actual database connection string
3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Access the app at http://localhost:3000

## Prisma Commands Reference

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio to view/edit data
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Phase 1.2 & 1.3 Complete ✓

**Authentication fully implemented:**

- Player login (name + PIN)
- GM login (password)
- JWT sessions with secure cookies
- Route protection middleware
- Player & GM dashboards

## Phase 2 Complete ✓

**Player Experience implemented:**

- `GET /api/clues/visible` - Fetch player's visible clues
- ClueCard component with HOI4-style design
- CluesDisplay component with SWR polling (15s refresh)
- Auto-refresh clue display on player dashboard
- Empty/loading/error states

## Architecture

### Session Management (lib/auth.ts)

- JWT tokens via `jose` library
- HttpOnly cookies (7 day expiration)
- Session types: `PlayerSession` | `GMSession`
- Helper functions: `getSession()`, `requirePlayerAuth()`, `requireGMAuth()`

### Route Protection (middleware.ts)

- `/dashboard/*` requires player auth
- `/gm/*` requires GM auth (except `/gm/login`)
- Auto-redirects authenticated users from login pages

### API Endpoints

- `POST /api/auth/player` - Player login
- `POST /api/auth/gm` - GM login
- `POST /api/auth/logout` - Logout both

## Database Schema

### Player

- id, name (unique), pin, country (enum), archetype (enum)

### Clue

- id, title, phase (1-5), targetType, targetValue
- Metadata: legitimacy, confidentiality, originCountry
- Content: eventDate, backstory, imageUrl, confidenceLevel, supportingIntel, source, takeaways[]
- Status: released, releasedAt, retracted

### ClueAssignment

- clueId, playerId, assignedAt (for randomized releases)

## Next: Phase 2 - Player Experience

**Tasks:**

1. Create `GET /api/clues/visible` API
2. Implement visibility logic (match player to targetType/targetValue)
3. Create ClueCard component (HOI4 style)
4. Add SWR polling (15s refresh)
5. Display clues on player dashboard

**Clue Visibility Rules:**

- `targetType='all'` → visible to everyone
- `targetType='country'` → match player.country to targetValue
- `targetType='archetype'` → match player.archetype to targetValue
- `targetType='player'` → match player.id to targetValue OR exists in ClueAssignment
- Must have: `released=true AND retracted=false`

## Phase 3-5 TODOs

**Phase 3:** GM Clue CRUD + image upload
**Phase 4:** Release controls (phase/individual/retract/randomize) + View As Player
**Phase 5:** Player management CRUD

## Technical Notes

- Prisma 5.22.0 (more stable than v7 for Vercel)
- Tailwind v4 with @tailwindcss/postcss
- Next.js 16.1.1 (middleware uses deprecated convention)
- 5 test players seeded (3 countries, 5 archetypes)
