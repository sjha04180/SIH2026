// src/app/api/projects/[id]/verify/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'FACULTY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, comment } = await request.json();
    if (!action || !['VERIFY', 'RETURN', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { id } = await params;

    const contribution = await prisma.projectContribution.findUnique({
      where: { id },
    });

    if (!contribution) {
      return NextResponse.json({ error: 'Project contribution not found' }, { status: 404 });
    }

    // Determine new status
    let newStatus = 'UNDER_REVIEW';
    if (action === 'VERIFY') {
      newStatus = 'VERIFIED';
    } else if (action === 'RETURN') {
      newStatus = 'RETURNED';
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
    }

    // Update Project Contribution
    const updatedContribution = await prisma.projectContribution.update({
      where: { id },
      data: {
        status: newStatus,
        reviewerId: session.profileId,
        reviewerName: session.name,
        reviewerComment: comment || null,
        facultyReviewerId: session.profileId,
      },
    });

    // Create Verification Log
    await prisma.verificationLog.create({
      data: {
        contributionId: id,
        actorId: session.userId,
        actorName: session.name,
        action: action,
        previousStatus: contribution.status,
        newStatus: newStatus,
        comment: comment || null,
      },
    });

    return NextResponse.json({ success: true, projectContribution: updatedContribution });
  } catch (error) {
    console.error('Verify project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
