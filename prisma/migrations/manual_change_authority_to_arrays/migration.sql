-- AlterTable
ALTER TABLE "Character"
  ALTER COLUMN "formalAuthority" TYPE TEXT[] USING ARRAY[formalAuthority],
  ALTER COLUMN "informalFears" TYPE TEXT[] USING ARRAY[informalFears],
  ALTER COLUMN "safelyIgnore" TYPE TEXT[] USING ARRAY[safelyIgnore];
