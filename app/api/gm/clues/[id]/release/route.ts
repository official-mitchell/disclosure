import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    const clue = await prisma.clue.update({
      where: { id },
      data: {
        released: true,
        releasedAt: new Date(),
        retracted: false,
      },
    });

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error releasing clue:', error);
    return NextResponse.json(
      { error: 'Failed to release clue' },
      { status: 500 }
    );
  }
}
