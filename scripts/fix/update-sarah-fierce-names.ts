// Script to update name references in Rep. Sarah Fierce's dossier
// Changes: Amanda O'Brien -> Mitz Albarron, Lt. Carson Conklin -> Lt. Chris Ries

import { prisma } from "../lib/db";

function replaceInString(text: string): string {
  return text
    .replace(/Amanda O'Brien/g, "Mitz Albarron")
    .replace(/Lt\. Carson Conklin/g, "Lt. Chris Ries");
}

function replaceInArray(arr: string[]): string[] {
  return arr.map((item) => replaceInString(item));
}

function replaceInMotivations(motivations: any): any {
  if (Array.isArray(motivations)) {
    return motivations.map((motivation) => ({
      ...motivation,
      label: replaceInString(motivation.label || ""),
      description: replaceInString(motivation.description || ""),
    }));
  }
  return motivations;
}

async function main() {
  console.log("Updating Rep. Sarah Fierce's dossier...\n");

  // Find the player
  const player = await prisma.player.findUnique({
    where: { name: "Sarah" },
    include: { character: true },
  });

  if (!player) {
    console.error("❌ Player 'Sarah' not found");
    process.exit(1);
  }

  if (!player.character) {
    console.error("❌ Character data not found for Sarah");
    process.exit(1);
  }

  const character = player.character;
  console.log(`Found character: ${character.displayName}\n`);

  // Prepare updated data
  const updates = {
    backstory: replaceInString(character.backstory),
    publicReputation: replaceInString(character.publicReputation),
    exposureConsequences: replaceInString(character.exposureConsequences),
    privateWant: replaceInString(character.privateWant),
    disclosureBelief: replaceInString(character.disclosureBelief),
    motivations: replaceInMotivations(character.motivations as any),
    formalAuthority: replaceInArray(character.formalAuthority),
    informalFears: replaceInArray(character.informalFears),
    safelyIgnore: replaceInArray(character.safelyIgnore),
    canDiscuss: replaceInArray(character.canDiscuss),
    mustConceal: replaceInArray(character.mustConceal),
  };

  // Update the character
  await prisma.character.update({
    where: { id: character.id },
    data: updates,
  });

  console.log("✅ Successfully updated Rep. Sarah Fierce's dossier");
  console.log("\nChanges made:");
  console.log("  - Amanda O'Brien → Mitz Albarron");
  console.log("  - Lt. Carson Conklin → Lt. Chris Ries");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
