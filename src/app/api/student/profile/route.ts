// src/app/api/student/profile/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileSummary, interests } = await request.json();

    const updated = await prisma.student.update({
      where: { id: session.profileId },
      data: {
        profileSummary,
        interests,
      },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error('Update student profile error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
