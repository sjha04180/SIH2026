// src/app/api/admin/rules/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PRINCIPAL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await prisma.activityCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error('Get config rules error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      id,
      requiresEvidence,
      verificationType,
      verificationRequired,
      allowedSelfDeclaration,
      verificationAuthority,
    } = await request.json();

    if (!id || requiresEvidence === undefined || !verificationType || verificationRequired === undefined || allowedSelfDeclaration === undefined || !verificationAuthority) {
      return NextResponse.json({ error: 'Missing required configuration fields' }, { status: 400 });
    }

    const updatedRule = await prisma.activityCategory.update({
      where: { id },
      data: {
        requiresEvidence,
        verificationType,
        verificationRequired,
        allowedSelfDeclaration,
        verificationAuthority,
      },
    });

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_RULE',
        details: `Updated routing rules for category "${updatedRule.name}". Route: ${verificationType}, Authority: ${verificationAuthority}.`,
      },
    });

    return NextResponse.json({ success: true, rule: updatedRule });
  } catch (error) {
    console.error('Update rule configuration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
