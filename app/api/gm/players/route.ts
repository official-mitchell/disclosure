import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

// GET all players
export async function GET() {
  try {
    await requireGMAuth();

    const players = await prisma.player.findMany({
      orderBy: [{ country: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST create new player
export async function POST(request: NextRequest) {
  try {
    await requireGMAuth();

    const body = await request.json();
    const { name, pin, country, archetype } = body;

    // Validate required fields
    if (!name || !pin || !country || !archetype) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existing = await prisma.player.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Player with this name already exists' },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: { name, pin, country, archetype },
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
