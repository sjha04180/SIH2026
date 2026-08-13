// src/app/api/activities/[id]/verify/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'FACULTY' && session.role !== 'COORDINATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, comment } = await request.json();
    if (!action || !['VERIFY', 'RETURN', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Require comment for Return or Reject decisions
    if (['RETURN', 'REJECT'].includes(action) && (!comment || !comment.trim())) {
      return NextResponse.json({ error: 'A comment is required when returning or rejecting an activity.' }, { status: 400 });
    }

    const { id } = await params;

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
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

    // Update Activity
    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: {
        status: newStatus,
        reviewerId: session.profileId,
        reviewerName: session.name,
        reviewerComment: comment || null,
        facultyReviewerId: session.role === 'FACULTY' ? session.profileId : undefined,
        coordinatorReviewerId: session.role === 'COORDINATOR' ? session.profileId : undefined,
      },
    });

    // Create Verification Log
    await prisma.verificationLog.create({
      data: {
        activityId: id,
        actorId: session.userId,
        actorName: session.name,
        action: action,
        previousStatus: activity.status,
        newStatus: newStatus,
        comment: comment || null,
      },
    });

    // Log this action in HOD Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: `ACTIVITY_${action}`,
        details: `Reviewed activity ${id} for student ${activity.studentId}. Status changed from ${activity.status} to ${newStatus}.`,
      },
    });

    return NextResponse.json({ success: true, activity: updatedActivity });
  } catch (error) {
    console.error('Verify activity error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
