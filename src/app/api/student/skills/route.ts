// src/app/api/student/skills/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId: session.profileId },
      include: { skill: true },
    });

    const allCatalogSkills = await prisma.skill.findMany();

    return NextResponse.json({
      success: true,
      studentSkills,
      allCatalogSkills,
    });
  } catch (error) {
    console.error('Get student skills error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId, customSkillName, customSkillCategory, level } = await request.json();
    if ((!skillId && !customSkillName) || !level) {
      return NextResponse.json({ error: 'Missing skill selection/name or level' }, { status: 400 });
    }

    let targetSkillId = skillId;

    if (customSkillName && customSkillName.trim()) {
      const trimmedName = customSkillName.trim();
      const category = customSkillCategory || 'Technical';

      // Check if skill already exists in catalog (case-insensitive)
      let skill = await prisma.skill.findFirst({
        where: {
          name: {
            equals: trimmedName,
            mode: 'insensitive',
          },
        },
      });

      if (!skill) {
        // Create new skill in the catalog
        skill = await prisma.skill.create({
          data: {
            name: trimmedName,
            category,
          },
        });
      }

      targetSkillId = skill.id;
    }

    // Check if link already exists
    const existing = await prisma.studentSkill.findFirst({
      where: {
        studentId: session.profileId,
        skillId: targetSkillId,
      },
    });

    if (existing) {
      const updated = await prisma.studentSkill.update({
        where: { id: existing.id },
        data: { level },
      });
      return NextResponse.json({ success: true, studentSkill: updated });
    }

    const studentSkill = await prisma.studentSkill.create({
      data: {
        studentId: session.profileId,
        skillId: targetSkillId,
        level,
        status: 'SELF_DECLARED',
      },
    });

    return NextResponse.json({ success: true, studentSkill });
  } catch (error) {
    console.error('Add student skill error:', error);
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
      return NextResponse.json({ error: 'Missing student skill association ID' }, { status: 400 });
    }

    await prisma.studentSkill.delete({
      where: {
        id,
        studentId: session.profileId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student skill error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
