import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireGMAuth } from '@/lib/auth';

// PUT update clue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

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

    // Convert targetType/targetValue to new schema fields
    let targetCountry = null;
    let targetArchetypes: any[] = [];
    let targetDemeanor = null;
    let targetPlayer = null;

    if (targetType === 'country' && targetValue) {
      targetCountry = targetValue as any;
    } else if (targetType === 'archetype' && targetValue) {
      targetArchetypes = [targetValue as any];
    } else if (targetType === 'demeanor' && targetValue) {
      targetDemeanor = targetValue as any;
    } else if (targetType === 'player' && targetValue) {
      targetPlayer = targetValue;
    }
    // If targetType is 'all' or not set, all fields remain null/empty

    const clue = await prisma.clue.update({
      where: { id },
      data: {
        title,
        phase: parseInt(phase),
        targetCountry,
        targetArchetypes,
        targetDemeanor,
        targetPlayer,
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

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error updating clue:', error);
    return NextResponse.json(
      { error: 'Failed to update clue' },
      { status: 500 }
    );
  }
}

// DELETE clue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireGMAuth();
    const { id } = await params;

    await prisma.clue.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting clue:', error);
    return NextResponse.json(
      { error: 'Failed to delete clue' },
      { status: 500 }
    );
  }
}
