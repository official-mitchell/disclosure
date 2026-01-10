# Changes Made

1. Removed Sample Clues - Deleted all 6 example clues from the database in scripts/remove-sample-clues.ts:58
2. Created Evidence Import System - Built scripts/import-evidence.ts:1 that:

   - Parses markdown files from the evidence/ directory
   - Extracts structured data (Title, Origin, Date, Summary, Confidence, Source, Supporting Intel, Takeaways)
   - Creates clues in the database with appropriate metadata
   - Auto-releases welcome messages to all players

3. Imported Welcome Message - The welcome-message.md has been imported and automatically released to all players. It's now visible when they sign in.

# How It Works

The evidence import script:

- Looks for .md or .markdown files in evidence/
- Parses the structured format (Title, Origin, Date, Summary, etc.)
- Maps confidence levels (HIGH → high, CONFIRMED → confirmed, etc.)
- Creates unique IDs based on filename (evidence-welcome-messsage)
- Auto-releases files with "welcome" in the name
- Supports upsert (updates existing evidence without changing GM settings)

To Add More Evidence

1. Create new .md files in evidence/ directory using the same format as welcome-messsage.md
2. Run: npx tsx scripts/import-evidence.ts
3. Review in GM dashboard and adjust phase/target/release settings as needed

The welcome message is now live and will be shown to all players when they sign in.
