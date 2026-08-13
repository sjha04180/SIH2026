// src/app/admin/registry/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import RegistryClient from './RegistryClient';

export default async function StudentRegistryPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/');
  }

  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
  });

  const programs = await prisma.program.findMany({
    orderBy: { name: 'asc' },
  });

  // Next.js serialization
  const serializedDepts = JSON.parse(JSON.stringify(departments));
  const serializedProgs = JSON.parse(JSON.stringify(programs));

  return (
    <RegistryClient
      departments={serializedDepts}
      programs={serializedProgs}
    />
  );
}
