// src/app/faculty/students/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import StudentsListClient from './StudentsListClient';

export default async function FacultyStudentsPage() {
  const session = await getSession();
  if (!session || session.role !== 'FACULTY') {
    redirect('/');
  }

  // Fetch faculty profile
  const faculty = await prisma.faculty.findUnique({
    where: { id: session.profileId },
  });

  if (!faculty) {
    redirect('/');
  }

  // Find students in the same department
  const students = await prisma.student.findMany({
    where: {
      department: {
        name: faculty.department,
      },
    },
    include: {
      user: true,
      program: true,
      department: true,
      profileLinks: {
        orderBy: { displayOrder: 'asc' },
      },
      studentSkills: {
        include: { skill: true },
      },
      activities: {
        orderBy: { date: 'desc' },
      },
      contributions: {
        orderBy: { startDate: 'desc' },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  // Serialization
  const serializedStudents = JSON.parse(JSON.stringify(students));

  return (
    <StudentsListClient
      students={serializedStudents}
      department={faculty.department}
    />
  );
}
