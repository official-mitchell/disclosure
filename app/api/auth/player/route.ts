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

    // Find player by first name (case-insensitive partial match)
    // Search for players where the full name contains the provided first name
    const players = await prisma.player.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    // Filter to find a player where the first name matches and PIN is correct
    let matchedPlayer = null;

    for (const p of players) {
      // Extract first name from full name (handles formats like "[EXAMPLE] Alice Johnson")
      const nameParts = p.name.split(' ');
      const firstName = nameParts.find(part =>
        !part.startsWith('[') &&
        !part.endsWith(']') &&
        part.length > 0
      );

      // Check if first name matches (case-insensitive) and PIN is correct
      if (firstName?.toLowerCase() === name.toLowerCase() && p.pin === pin) {
        matchedPlayer = p;
        break;
      }
    }

    if (!matchedPlayer) {
      return NextResponse.json(
        { error: 'Invalid name or PIN' },
        { status: 401 }
      );
    }

    // Create session
    await setSessionCookie({
      type: 'player',
      playerId: matchedPlayer.id,
      name: matchedPlayer.name,
      country: matchedPlayer.country,
      archetype: matchedPlayer.archetype,
    });

    // Return success with player info
    return NextResponse.json({
      success: true,
      player: {
        id: matchedPlayer.id,
        name: matchedPlayer.name,
        country: matchedPlayer.country,
        archetype: matchedPlayer.archetype,
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
