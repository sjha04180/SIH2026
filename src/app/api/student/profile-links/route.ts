// src/app/api/student/profile-links/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.profileLink.findMany({
      where: { studentId: session.profileId },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error('Get profile links error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platformName, profileUrl } = await request.json();
    if (!platformName || !profileUrl) {
      return NextResponse.json({ error: 'Missing platform name or URL' }, { status: 400 });
    }

    // Validate URL basic format
    if (!profileUrl.startsWith('http://') && !profileUrl.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid URL format. Must start with http:// or https://' }, { status: 400 });
    }

    // Delete existing link for the same platform to avoid duplicates
    await prisma.profileLink.deleteMany({
      where: {
        studentId: session.profileId,
        platformName,
      },
    });

    const link = await prisma.profileLink.create({
      data: {
        studentId: session.profileId,
        platformName,
        profileUrl,
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Create profile link error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing link ID' }, { status: 400 });
    }

    await prisma.profileLink.delete({
      where: {
        id,
        studentId: session.profileId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete profile link error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
