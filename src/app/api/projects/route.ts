// src/app/api/projects/route.ts
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
      projectName,
      projectDesc,
      startDate,
      endDate,
      repoUrl,
      demoUrl,
      projectEvidence,
      role,
      contribution,
      technologies,
    } = await request.json();

    if (!projectName || !projectDesc || !startDate || !endDate || !role || !contribution || !technologies) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Project contributions are automatically routed to Faculty/TG for verification
    const verificationRoute = 'FACULTY_TG';
    const status = 'SUBMITTED';

    const projectContribution = await prisma.projectContribution.create({
      data: {
        studentId: session.profileId,
        projectName,
        projectDesc,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        projectEvidence: projectEvidence || null,
        role,
        contribution,
        technologies, // Store as comma-separated string, e.g. "React, Node.js, Express"
        verificationRoute,
        status,
      },
    });

    // Create verification log
    await prisma.verificationLog.create({
      data: {
        contributionId: projectContribution.id,
        actorId: session.userId,
        actorName: session.name,
        action: 'SUBMIT',
        previousStatus: 'DRAFT',
        newStatus: status,
        comment: 'Project contribution submitted for Faculty/TG verification.',
      },
    });

    return NextResponse.json({ success: true, projectContribution });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contributions = await prisma.projectContribution.findMany({
      where: {
        studentId: session.role === 'STUDENT' ? session.profileId : undefined,
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ success: true, contributions });
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
