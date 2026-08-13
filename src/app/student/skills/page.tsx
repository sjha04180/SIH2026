// src/app/student/skills/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import SkillsClient from './SkillsClient';

export default async function StudentSkillsPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  const studentSkills = await prisma.studentSkill.findMany({
    where: { studentId: session.profileId },
    include: { skill: true },
    orderBy: { createdAt: 'desc' },
  });

  const allCatalogSkills = await prisma.skill.findMany({
    orderBy: { name: 'asc' },
  });

  // Next.js serialization helper
  const serializedStudentSkills = JSON.parse(JSON.stringify(studentSkills));
  const serializedCatalogSkills = JSON.parse(JSON.stringify(allCatalogSkills));

  return (
    <SkillsClient
      initialStudentSkills={serializedStudentSkills}
      catalogSkills={serializedCatalogSkills}
    />
  );
}
