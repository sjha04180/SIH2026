// src/app/coordinator/dashboard/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CoordinatorDashboardClient from './CoordinatorDashboardClient';

export default async function CoordinatorDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'COORDINATOR') {
    redirect('/');
  }

  // Fetch all activities routed to Event Coordinator
  const activities = await prisma.activity.findMany({
    where: {
      verificationRoute: 'EVENT_COORDINATOR',
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
    <CoordinatorDashboardClient
      initialActivities={activities}
      coordinatorScope={session.profileId}
    />
  );
}
