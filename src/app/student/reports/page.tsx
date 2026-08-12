// src/app/student/reports/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ReportClient from './ReportClient';

export default async function StudentReportPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  // Fetch student profile, activities, and contributions
  const student = await prisma.student.findUnique({
    where: { id: session.profileId },
    include: {
      program: true,
      department: true,
      activities: {
        orderBy: { date: 'desc' },
      },
      contributions: {
        orderBy: { startDate: 'desc' },
      },
    },
  });

  if (!student) {
    redirect('/');
  }

  // Next.js serialization helper: converting models to plain JS object to pass safely as props
  const serializedStudent = JSON.parse(JSON.stringify(student));

  return (
    <ReportClient 
      student={serializedStudent} 
      sessionName={session.name} 
    />
  );
}
