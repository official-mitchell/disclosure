import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, pin } = body;

    // Validate input
    if (!name || !pin) {
      return NextResponse.json(
        { error: 'Name and PIN are required' },
        { status: 400 }
      );
    }

    // Find player by name
    const player = await prisma.player.findUnique({
      where: { name },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Invalid name or PIN' },
        { status: 401 }
      );
    }

    // Verify PIN (simple string comparison - in production, use hashing)
    if (player.pin !== pin) {
      return NextResponse.json(
        { error: 'Invalid name or PIN' },
        { status: 401 }
      );
    }

    // Create session
    await setSessionCookie({
      type: 'player',
      playerId: player.id,
      name: player.name,
      country: player.country,
      archetype: player.archetype,
    });

    // Return success with player info
    return NextResponse.json({
      success: true,
      player: {
        id: player.id,
        name: player.name,
        country: player.country,
        archetype: player.archetype,
      },
    });
  } catch (error) {
    console.error('Player auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
