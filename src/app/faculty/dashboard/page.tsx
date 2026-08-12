// src/app/faculty/dashboard/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import FacultyDashboardClient from './FacultyDashboardClient';

export default async function FacultyDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'FACULTY') {
    redirect('/');
  }

  // Retrieve all activities routed to Faculty/TG
  const activities = await prisma.activity.findMany({
    where: {
      verificationRoute: 'FACULTY_TG',
    },
    include: {
      student: {
        include: {
          user: true,
          program: true,
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Retrieve all project contributions routed to Faculty/TG
  const contributions = await prisma.projectContribution.findMany({
    where: {
      verificationRoute: 'FACULTY_TG',
    },
    include: {
      student: {
        include: {
          user: true,
          program: true,
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <FacultyDashboardClient
      initialActivities={activities}
      initialContributions={contributions}
      facultyName={session.name}
    />
  );
}
