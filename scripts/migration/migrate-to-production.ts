import { PrismaClient } from '@prisma/client';

// Local database
const localPrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Production database
const prodPrisma = new PrismaClient({
  datasourceUrl: process.env.PROD_DATABASE_URL || process.env.PRISMA_DATABASE_URL,
});

async function migrateData() {
  console.log('Starting data migration to production...\n');

  try {
    // Test production connection
    console.log('Testing production database connection...');
    await prodPrisma.$connect();
    console.log('✓ Connected to production database\n');

    // Fetch all data from local
    console.log('Fetching data from local database...');
    const localPlayers = await localPrisma.player.findMany({
      include: {
        character: true,
      },
    });
    const localClues = await localPrisma.clue.findMany();
    const localAssignments = await localPrisma.clueAssignment.findMany();

    console.log(`Found ${localPlayers.length} players`);
    console.log(`Found ${localClues.length} clues`);
    console.log(`Found ${localAssignments.length} clue assignments\n`);

    // Clear existing data in production (optional - comment out if you want to keep existing data)
    console.log('Clearing existing production data...');
    await prodPrisma.clueAssignment.deleteMany();
    await prodPrisma.character.deleteMany();
    await prodPrisma.clue.deleteMany();
    await prodPrisma.player.deleteMany();
    console.log('✓ Cleared production data\n');

    // Migrate Players
    console.log('Migrating players...');
    for (const player of localPlayers) {
      await prodPrisma.player.create({
        data: {
          id: player.id,
          name: player.name,
          pin: player.pin,
          country: player.country,
          archetype: player.archetype,
          demeanor: player.demeanor,
          createdAt: player.createdAt,
          updatedAt: player.updatedAt,
        },
      });
    }
    console.log(`✓ Migrated ${localPlayers.length} players\n`);

    // Migrate Characters
    console.log('Migrating characters...');
    let characterCount = 0;
    for (const player of localPlayers) {
      if (player.character) {
        const char = player.character;
        await prodPrisma.character.create({
          data: {
            id: char.id,
            playerId: char.playerId,
            displayName: char.displayName,
            nationalityBloc: char.nationalityBloc,
            occupation: char.occupation,
            publicReputation: char.publicReputation,
            portraitUrl: char.portraitUrl,
            archetypeTitle: char.archetypeTitle,
            permissions: char.permissions,
            restrictions: char.restrictions,
            backstory: char.backstory,
            motivations: char.motivations as any,
            exposureConsequences: char.exposureConsequences,
            privateWant: char.privateWant,
            disclosureBelief: char.disclosureBelief,
            canDiscuss: char.canDiscuss,
            mustConceal: char.mustConceal,
            covertOccupation: char.covertOccupation,
            formalAuthority: char.formalAuthority,
            informalFears: char.informalFears,
            safelyIgnore: char.safelyIgnore,
            createdAt: char.createdAt,
            updatedAt: char.updatedAt,
          },
        });
        characterCount++;
      }
    }
    console.log(`✓ Migrated ${characterCount} characters\n`);

    // Migrate Clues
    console.log('Migrating clues...');
    for (const clue of localClues) {
      await prodPrisma.clue.create({
        data: {
          id: clue.id,
          title: clue.title,
          phase: clue.phase,
          released: clue.released,
          releasedAt: clue.releasedAt,
          retracted: clue.retracted,
          legitimacy: clue.legitimacy,
          confidentiality: clue.confidentiality,
          originCountry: clue.originCountry,
          eventDate: clue.eventDate,
          backstory: clue.backstory,
          imageUrl: clue.imageUrl,
          confidenceLevel: clue.confidenceLevel,
          supportingIntel: clue.supportingIntel,
          source: clue.source,
          takeaways: clue.takeaways,
          targetCountry: clue.targetCountry,
          targetArchetypes: clue.targetArchetypes,
          targetDemeanor: clue.targetDemeanor,
          targetPlayer: clue.targetPlayer,
          createdAt: clue.createdAt,
          updatedAt: clue.updatedAt,
        },
      });
    }
    console.log(`✓ Migrated ${localClues.length} clues\n`);

    // Migrate Clue Assignments
    console.log('Migrating clue assignments...');
    for (const assignment of localAssignments) {
      await prodPrisma.clueAssignment.create({
        data: {
          id: assignment.id,
          clueId: assignment.clueId,
          playerId: assignment.playerId,
          assignedAt: assignment.assignedAt,
        },
      });
    }
    console.log(`✓ Migrated ${localAssignments.length} clue assignments\n`);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await localPrisma.$disconnect();
    await prodPrisma.$disconnect();
  }
}

migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
