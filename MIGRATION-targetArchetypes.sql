-- Migration: Change targetArchetype from single value to array
-- This migration converts the targetArchetype field to targetArchetypes array

-- Step 1: Add new targetArchetypes column as an array
ALTER TABLE "Clue" ADD COLUMN IF NOT EXISTS "targetArchetypes" "Archetype"[] DEFAULT '{}';

-- Step 2: Migrate existing data from targetArchetype to targetArchetypes
-- Convert single values to single-element arrays
UPDATE "Clue"
SET "targetArchetypes" = ARRAY["targetArchetype"]
WHERE "targetArchetype" IS NOT NULL;

-- Step 3: Drop the old targetArchetype column
ALTER TABLE "Clue" DROP COLUMN IF EXISTS "targetArchetype";

-- Verification query (optional - run to check results)
-- SELECT id, title, "targetCountry", "targetArchetypes" FROM "Clue" WHERE "targetArchetypes" != '{}';
