import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    const character = await prisma.character.findUnique({
      where: {
        playerId: id,
      },
      include: {
        player: {
          select: {
            name: true,
            country: true,
            archetype: true,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found for this player' },
        { status: 404 }
      );
    }

    return NextResponse.json({ character });
  } catch (error) {
    console.error('Error fetching character dossier:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    const body = await request.json();
    const {
      displayName,
      nationalityBloc,
      occupation,
      publicReputation,
      portraitUrl,
      archetypeTitle,
      permissions,
      restrictions,
      backstory,
      motivations,
      formalAuthority,
      informalFears,
      safelyIgnore,
      exposureConsequences,
      privateWant,
      disclosureBelief,
      canDiscuss,
      mustConceal,
    } = body;

    // Upsert character (create if doesn't exist, update if it does)
    const character = await prisma.character.upsert({
      where: {
        playerId: id,
      },
      create: {
        playerId: id,
        displayName,
        nationalityBloc,
        occupation,
        publicReputation,
        portraitUrl: portraitUrl || null,
        archetypeTitle,
        permissions,
        restrictions,
        backstory,
        motivations,
        formalAuthority,
        informalFears,
        safelyIgnore,
        exposureConsequences,
        privateWant,
        disclosureBelief,
        canDiscuss,
        mustConceal,
      },
      update: {
        displayName,
        nationalityBloc,
        occupation,
        publicReputation,
        portraitUrl: portraitUrl || null,
        archetypeTitle,
        permissions,
        restrictions,
        backstory,
        motivations,
        formalAuthority,
        informalFears,
        safelyIgnore,
        exposureConsequences,
        privateWant,
        disclosureBelief,
        canDiscuss,
        mustConceal,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error('Error updating character dossier:', error);
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    );
  }
}
