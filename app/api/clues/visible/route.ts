import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePlayerAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requirePlayerAuth();

    // Fetch clues visible to this player
    const clues = await prisma.clue.findMany({
      where: {
        released: true,
        retracted: false,
        OR: [
          // Target all (all target fields are null)
          {
            targetCountry: null,
            targetArchetype: null,
            targetDemeanor: null,
            targetPlayer: null,
          },
          // Target player's country
          {
            targetCountry: session.country as any,
          },
          // Target player's archetype
          {
            targetArchetype: session.archetype as any,
          },
          // Target specific player OR assigned to player
          {
            OR: [
              { targetPlayer: session.playerId },
              {
                clueAssignments: {
                  some: {
                    playerId: session.playerId,
                  },
                },
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
            playerId: session.playerId,
          },
        },
      },
    });

    return NextResponse.json({ clues });
  } catch (error) {
    console.error('Error fetching visible clues:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
