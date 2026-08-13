// src/app/api/activities/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      type,
      title,
      date,
      organiser,
      role,
      description,
      outcome,
      evidenceUrl,
      evidenceType,
      externalLink,
    } = await request.json();

    if (!type || !title || !date || !organiser || !role || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch dynamic ActivityCategory rules from the database
    const category = await prisma.activityCategory.findFirst({
      where: { name: type },
    });

    let verificationRoute = 'SELF_DECLARED';
    let status = 'SELF_DECLARED';

    if (category) {
      verificationRoute = category.verificationType;
      status = category.verificationRequired ? 'SUBMITTED' : 'SELF_DECLARED';
      
      // Enforce evidence rule if required by category configuration
      if (category.requiresEvidence && status !== 'SELF_DECLARED' && !evidenceUrl) {
        return NextResponse.json({ 
          error: `Evidence is required for category "${type}". Please upload proof (PDF/Image) to submit.` 
        }, { status: 400 });
      }
    } else {
      // Fallback classification if category not found in DB
      const eventTypes = ['Hackathon', 'Competition', 'Workshop', 'Seminar', 'Club/SIG Participation'];
      const facultyTypes = ['Project', 'Research', 'Internship', 'Award', 'Certification'];

      if (eventTypes.includes(type)) {
        verificationRoute = 'EVENT_COORDINATOR';
        status = 'SUBMITTED';
      } else if (facultyTypes.includes(type)) {
        verificationRoute = 'FACULTY_TG';
        status = 'SUBMITTED';
      } else {
        verificationRoute = 'SELF_DECLARED';
        status = 'SELF_DECLARED';
      }
    }

    // 2. Create the activity in the database
    const activity = await prisma.activity.create({
      data: {
        studentId: session.profileId,
        categoryId: category?.id || null,
        type,
        title,
        date: new Date(date),
        organiser,
        role,
        description,
        outcome,
        evidenceUrl: status === 'SELF_DECLARED' ? null : evidenceUrl || null,
        evidenceType: status === 'SELF_DECLARED' ? null : evidenceType || null,
        externalLink: externalLink || null,
        verificationRoute,
        status,
      },
    });

    // 3. Create initial log
    await prisma.verificationLog.create({
      data: {
        activityId: activity.id,
        actorId: session.userId,
        actorName: session.name,
        action: 'SUBMIT',
        previousStatus: 'DRAFT',
        newStatus: status,
        comment: status === 'SELF_DECLARED' ? 'Self-declared activity saved.' : 'Activity submitted for review.',
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        studentId: session.role === 'STUDENT' ? session.profileId : undefined,
      },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('List activities error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
