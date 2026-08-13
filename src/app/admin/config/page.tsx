// src/app/admin/config/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ConfigClient from './ConfigClient';

export default async function AdminConfigPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/');
  }

  const rules = await prisma.activityCategory.findMany({
    orderBy: { name: 'asc' },
  });

  // Serialization
  const serializedRules = JSON.parse(JSON.stringify(rules));

  return (
    <ConfigClient initialRules={serializedRules} />
  );
}
