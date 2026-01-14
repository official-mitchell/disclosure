import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;
    const { mode } = await request.json(); // 'one' or 'half'

    const clue = await prisma.clue.findUnique({
      where: { id },
    });

    if (!clue) {
      return NextResponse.json({ error: 'Clue not found' }, { status: 404 });
    }

    // Get eligible players based on target
    // Build query conditions based on targeting criteria
    const whereConditions: any = {};
    
    if (clue.targetCountry) {
      whereConditions.country = clue.targetCountry;
    } else if (clue.targetArchetypes && clue.targetArchetypes.length > 0) {
      whereConditions.archetype = { in: clue.targetArchetypes };
    } else if (clue.targetDemeanor) {
      whereConditions.demeanor = clue.targetDemeanor;
    } else if (clue.targetPlayer) {
      whereConditions.id = clue.targetPlayer;
    }
    // If all target fields are null/empty, whereConditions remains empty and all players are eligible

    const players = await prisma.player.findMany({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    // Randomize selection
    const shuffled = players.sort(() => 0.5 - Math.random());
    const count = mode === 'one' ? 1 : Math.ceil(players.length / 2);
    const selected = shuffled.slice(0, count);

    // Clear existing assignments
    await prisma.clueAssignment.deleteMany({
      where: { clueId: id },
    });

    // Create new assignments
    await prisma.clueAssignment.createMany({
      data: selected.map(player => ({
        clueId: id,
        playerId: player.id,
      })),
    });

    return NextResponse.json({ count: selected.length, players: selected });
  } catch (error) {
    console.error('Error randomizing assignments:', error);
    return NextResponse.json(
      { error: 'Failed to randomize' },
      { status: 500 }
    );
  }
}
