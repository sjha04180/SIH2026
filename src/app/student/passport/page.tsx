// src/app/student/passport/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import PassportClient from './PassportClient';

export default async function StudentPassportPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  // Fetch student profile info
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

  const studentInfo = {
    name: session.name,
    rollNumber: student.rollNumber,
    cgpa: student.cgpa,
    sgpa: student.sgpa,
    attendance: student.attendance,
    program: student.program.name,
    department: student.department.name,
  };

  return (
    <PassportClient
      initialActivities={student.activities}
      initialProjects={student.contributions}
      studentInfo={studentInfo}
    />
  );
}
