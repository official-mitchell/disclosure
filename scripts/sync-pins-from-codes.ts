import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/db';

// Parse CHARACTER_CODES.md and update PINs in database
async function main() {
  const codesFile = path.join(process.cwd(), 'CHARACTER_CODES.md');

  if (!fs.existsSync(codesFile)) {
    console.error('CHARACTER_CODES.md not found');
    process.exit(1);
  }

  const content = fs.readFileSync(codesFile, 'utf-8');
  const lines = content.split('\n');

  // Parse the markdown table
  const pinMap: Record<string, string> = {};

  for (const line of lines) {
    // Match lines like: | Amanda O'Brien | Amanda | `2865` |
    const match = line.match(/\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*`(\d+)`\s*\|/);
    if (match) {
      const [, , shortName, pin] = match;
      pinMap[shortName.trim()] = pin;
    }
  }

  console.log(`Found ${Object.keys(pinMap).length} characters in CHARACTER_CODES.md\n`);

  let updated = 0;
  let notFound = 0;

  for (const [shortName, pin] of Object.entries(pinMap)) {
    try {
      const player = await prisma.player.findUnique({
        where: { name: shortName },
      });

      if (!player) {
        console.log(`⚠ Player "${shortName}" not found in database`);
        notFound++;
        continue;
      }

      if (player.pin === pin) {
        console.log(`✓ ${shortName} - PIN already correct (${pin})`);
      } else {
        await prisma.player.update({
          where: { name: shortName },
          data: { pin },
        });
        console.log(`✓ ${shortName} - Updated PIN from ${player.pin} to ${pin}`);
        updated++;
      }
    } catch (error) {
      console.log(`✗ ${shortName} - Failed: ${(error as Error).message}`);
    }
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
  console.log(`\n✅ PINs synced with CHARACTER_CODES.md`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
