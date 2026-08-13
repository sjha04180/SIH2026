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

    // 1. Find or Create the base shared Project entry
    let project = await prisma.project.findUnique({
      where: { name: projectName },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: projectName,
          description: projectDesc,
          type: 'TEAM', // Default to TEAM project for mapping scenario
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          repoUrl: repoUrl || null,
          demoUrl: demoUrl || null,
          technologies,
        },
      });
    }

    // 2. Create the specific student contribution
    const projectContribution = await prisma.projectContribution.create({
      data: {
        studentId: session.profileId,
        projectId: project.id,
        projectName,
        projectDesc,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        projectEvidence: projectEvidence || null,
        role,
        contribution,
        technologies, // Store stack, e.g. "React, Node.js"
        verificationRoute: 'FACULTY_TG',
        status: 'SUBMITTED',
      },
    });

    // 3. Create verification log
    await prisma.verificationLog.create({
      data: {
        contributionId: projectContribution.id,
        actorId: session.userId,
        actorName: session.name,
        action: 'SUBMIT',
        previousStatus: 'DRAFT',
        newStatus: 'SUBMITTED',
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
      include: {
        project: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ success: true, contributions });
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
