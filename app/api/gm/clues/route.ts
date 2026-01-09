import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

// GET all clues (GM only)
export async function GET() {
  try {
    await requireGMAuth();

    const clues = await prisma.clue.findMany({
      orderBy: [{ phase: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: { clueAssignments: true },
        },
      },
    });

    return NextResponse.json({ clues });
  } catch (error) {
    console.error('Error fetching clues:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST create new clue (GM only)
export async function POST(request: NextRequest) {
  try {
    await requireGMAuth();

    const body = await request.json();
    const {
      title,
      phase,
      targetType,
      targetValue,
      legitimacy,
      confidentiality,
      originCountry,
      eventDate,
      backstory,
      imageUrl,
      confidenceLevel,
      supportingIntel,
      source,
      takeaways,
    } = body;

    const clue = await prisma.clue.create({
      data: {
        title,
        phase: parseInt(phase),
        targetType,
        targetValue: targetValue || null,
        legitimacy,
        confidentiality,
        originCountry,
        eventDate,
        backstory,
        imageUrl: imageUrl || null,
        confidenceLevel,
        supportingIntel,
        source,
        takeaways: takeaways || [],
      },
    });

    return NextResponse.json({ clue }, { status: 201 });
  } catch (error) {
    console.error('Error creating clue:', error);
    return NextResponse.json(
      { error: 'Failed to create clue' },
      { status: 500 }
    );
  }
}
