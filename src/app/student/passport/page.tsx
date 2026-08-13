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

  // Fetch student profile info with activities, contributions, links, and skills
  const student = await prisma.student.findUnique({
    where: { id: session.profileId },
    include: {
      program: true,
      department: true,
      profileLinks: {
        orderBy: { displayOrder: 'asc' },
      },
      studentSkills: {
        include: { skill: true },
        orderBy: { createdAt: 'desc' },
      },
      activities: {
        orderBy: { date: 'desc' },
      },
      contributions: {
        include: { project: true },
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
    profileSummary: student.profileSummary,
    interests: student.interests,
  };

  // Serialize models safely
  const serializedActivities = JSON.parse(JSON.stringify(student.activities));
  const serializedProjects = JSON.parse(JSON.stringify(student.contributions));
  const serializedLinks = JSON.parse(JSON.stringify(student.profileLinks));
  const serializedSkills = JSON.parse(JSON.stringify(student.studentSkills));

  return (
    <PassportClient
      initialActivities={serializedActivities}
      initialProjects={serializedProjects}
      profileLinks={serializedLinks}
      studentSkills={serializedSkills}
      studentInfo={studentInfo}
    />
  );
}
