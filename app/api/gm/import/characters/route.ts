import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

interface CharacterImport {
  playerName: string;
  displayName: string;
  nationalityBloc: string;
  occupation: string;
  publicReputation: string;
  portraitUrl?: string;
  archetypeTitle: string;
  permissions: string[];
  restrictions: string[];
  backstory: string;
  motivations: { label: string; description: string }[];
  formalAuthority: string;
  informalFears: string;
  safelyIgnore: string;
  exposureConsequences: string;
  privateWant: string;
  disclosureBelief: string;
  canDiscuss: string[];
  mustConceal: string[];
}

interface ImportPayload {
  characters: CharacterImport[];
}

export async function POST(request: Request) {
  try {
    await requireGMAuth();

    const body: ImportPayload = await request.json();

    if (!body.characters || !Array.isArray(body.characters)) {
      return NextResponse.json(
        { error: 'Invalid format: expected { characters: [...] }' },
        { status: 400 }
      );
    }

    const results = {
      success: [] as string[],
      errors: [] as { playerName: string; error: string }[],
    };

    for (const char of body.characters) {
      try {
        // Find player by name
        const player = await prisma.player.findUnique({
          where: { name: char.playerName },
        });

        if (!player) {
          results.errors.push({
            playerName: char.playerName,
            error: 'Player not found',
          });
          continue;
        }

        // Upsert character
        await prisma.character.upsert({
          where: { playerId: player.id },
          create: {
            playerId: player.id,
            displayName: char.displayName,
            nationalityBloc: char.nationalityBloc,
            occupation: char.occupation,
            publicReputation: char.publicReputation,
            portraitUrl: char.portraitUrl || null,
            archetypeTitle: char.archetypeTitle,
            permissions: char.permissions,
            restrictions: char.restrictions,
            backstory: char.backstory,
            motivations: char.motivations,
            formalAuthority: char.formalAuthority,
            informalFears: char.informalFears,
            safelyIgnore: char.safelyIgnore,
            exposureConsequences: char.exposureConsequences,
            privateWant: char.privateWant,
            disclosureBelief: char.disclosureBelief,
            canDiscuss: char.canDiscuss,
            mustConceal: char.mustConceal,
          },
          update: {
            displayName: char.displayName,
            nationalityBloc: char.nationalityBloc,
            occupation: char.occupation,
            publicReputation: char.publicReputation,
            portraitUrl: char.portraitUrl || null,
            archetypeTitle: char.archetypeTitle,
            permissions: char.permissions,
            restrictions: char.restrictions,
            backstory: char.backstory,
            motivations: char.motivations,
            formalAuthority: char.formalAuthority,
            informalFears: char.informalFears,
            safelyIgnore: char.safelyIgnore,
            exposureConsequences: char.exposureConsequences,
            privateWant: char.privateWant,
            disclosureBelief: char.disclosureBelief,
            canDiscuss: char.canDiscuss,
            mustConceal: char.mustConceal,
          },
        });

        results.success.push(char.playerName);
      } catch (error) {
        results.errors.push({
          playerName: char.playerName,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      imported: results.success.length,
      failed: results.errors.length,
      results,
    });
  } catch (error) {
    console.error('Error importing characters:', error);
    return NextResponse.json(
      { error: 'Failed to import characters' },
      { status: 500 }
    );
  }
}
