// src/app/principal/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import PrincipalClient from './PrincipalClient';

export default async function PrincipalPage() {
  const session = await getSession();
  if (!session || session.role !== 'PRINCIPAL') {
    redirect('/login');
  }

  // Load all students and their activity logs (read-only audit ledger)
  const students = await prisma.student.findMany({
    include: {
      user: true,
      program: true,
      department: true,
      activities: true,
      contributions: true,
    },
    orderBy: { rollNumber: 'asc' },
  });

  const activities = await prisma.activity.findMany();
  const contributions = await prisma.projectContribution.findMany();

  // Serialization
  const serializedStudents = JSON.parse(JSON.stringify(students));
  const serializedAct = JSON.parse(JSON.stringify(activities));
  const serializedCont = JSON.parse(JSON.stringify(contributions));

  return (
    <PrincipalClient
      students={serializedStudents}
      allActivities={serializedAct}
      allContributions={serializedCont}
      principalName={session.name}
    />
  );
}
