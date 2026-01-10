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
          // Target with country and/or archetype filters
          // This requires ALL specified filters to match (AND logic)
          {
            AND: [
              // If targetCountry is set, must match player's country
              {
                OR: [
                  { targetCountry: null },
                  { targetCountry: session.country as any },
                ],
              },
              // If targetArchetypes is set, must include player's archetype
              {
                OR: [
                  { targetArchetypes: { isEmpty: true } },
                  { targetArchetypes: { has: session.archetype as any } },
                ],
              },
              // If targetDemeanor is set, must match player's demeanor
              {
                OR: [
                  { targetDemeanor: null },
                  { targetDemeanor: session.demeanor as any },
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
