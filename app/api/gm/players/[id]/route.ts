import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

// PUT update player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    const body = await request.json();
    const { name, pin, country, archetype } = body;

    // Check if name is taken by another player
    if (name) {
      const existing = await prisma.player.findFirst({
        where: { name, NOT: { id } },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Player with this name already exists' },
          { status: 400 }
        );
      }
    }

    const player = await prisma.player.update({
      where: { id },
      data: { name, pin, country, archetype },
    });

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

// DELETE player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    await prisma.player.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
