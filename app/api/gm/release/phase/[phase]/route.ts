import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ phase: string }> }
) {
  try {
    await requireGMAuth();
    const { phase } = await params;

    const result = await prisma.clue.updateMany({
      where: {
        phase: parseInt(phase),
        released: false,
      },
      data: {
        released: true,
        releasedAt: new Date(),
      },
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('Error releasing phase:', error);
    return NextResponse.json(
      { error: 'Failed to release phase' },
      { status: 500 }
    );
  }
}
