import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePlayerAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requirePlayerAuth();

    // Fetch character data for current player
    const character = await prisma.character.findUnique({
      where: {
        playerId: session.playerId,
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
        { error: 'Character not found. Contact your Game Master.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ character });
  } catch (error) {
    console.error('Error fetching character dossier:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
