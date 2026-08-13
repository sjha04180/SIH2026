// src/app/student/profile/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function StudentProfilePage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  const student = await prisma.student.findUnique({
    where: { id: session.profileId },
    include: {
      program: true,
      department: true,
      profileLinks: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!student) {
    redirect('/');
  }

  // Next.js serialization helper
  const serializedStudent = JSON.parse(JSON.stringify(student));

  return (
    <ProfileClient
      student={serializedStudent}
      sessionName={session.name}
      sessionEmail={session.email}
    />
  );
}
