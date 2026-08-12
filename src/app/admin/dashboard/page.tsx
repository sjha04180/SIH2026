// src/app/admin/dashboard/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/');
  }

  // Load all students with profiles, activities, and contributions
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

  // Load overall counts
  const activities = await prisma.activity.findMany();
  const contributions = await prisma.projectContribution.findMany();

  return (
    <AdminDashboardClient
      students={students}
      allActivities={activities}
      allContributions={contributions}
    />
  );
}
