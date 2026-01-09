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
          // Target all
          { targetType: 'all' },
          // Target player's country
          {
            targetType: 'country',
            targetValue: session.country,
          },
          // Target player's archetype
          {
            targetType: 'archetype',
            targetValue: session.archetype,
          },
          // Target specific player OR assigned to player
          {
            targetType: 'player',
            OR: [
              { targetValue: session.playerId },
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
