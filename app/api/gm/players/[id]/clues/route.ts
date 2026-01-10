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

    // Get the player
    const player = await prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Fetch clues visible to this player (same logic as player API)
    const clues = await prisma.clue.findMany({
      where: {
        released: true,
        retracted: false,
        OR: [
          // Target all (all target fields are null/empty)
          {
            targetCountry: null,
            targetArchetypes: { isEmpty: true },
            targetDemeanor: null,
            targetPlayer: null,
          },
          // Target specific player OR assigned to player
          {
            OR: [
              { targetPlayer: player.id },
              {
                clueAssignments: {
                  some: {
                    playerId: player.id,
                  },
                },
              },
            ],
          },
          // Target with country and/or archetype filters
          // This requires ALL specified filters to match (AND logic)
          {
            AND: [
              // If targetCountry is set, must match player's country
              {
                OR: [
                  { targetCountry: null },
                  { targetCountry: player.country },
                ],
              },
              // If targetArchetypes is set, must include player's archetype
              {
                OR: [
                  { targetArchetypes: { isEmpty: true } },
                  { targetArchetypes: { has: player.archetype } },
                ],
              },
              // If targetDemeanor is set, must match player's demeanor
              {
                OR: [
                  { targetDemeanor: null },
                  ...(player.demeanor ? [{ targetDemeanor: player.demeanor }] : []),
                ],
              },
            ],
          },
        ],
      },
      orderBy: {
        releasedAt: 'desc',
      },
      include: {
        clueAssignments: {
          where: {
            playerId: player.id,
          },
        },
      },
    });

    return NextResponse.json({ clues });
  } catch (error) {
    console.error('Error fetching visible clues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clues' },
      { status: 500 }
    );
  }
}
