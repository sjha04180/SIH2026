// src/app/api/admin/students/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      email,
      password,
      rollNumber,
      departmentId,
      programId,
      currentSemester,
      batch,
      cgpa,
      sgpa,
      attendance,
    } = await request.json();

    if (!name || !email || !password || !rollNumber || !departmentId || !programId || !currentSemester || !batch || cgpa === undefined || sgpa === undefined || attendance === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Check if roll number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber },
    });
    if (existingStudent) {
      return NextResponse.json({ error: 'Student with this roll number already exists' }, { status: 400 });
    }

    // Fetch department to get institutionId
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      return NextResponse.json({ error: 'Invalid department selected' }, { status: 400 });
    }

    // Create User, Student, and Academic Record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash: password, // plain password as per MVP seed policy
          role: 'STUDENT',
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          rollNumber,
          institutionId: department.institutionId,
          departmentId,
          programId,
          currentSemester: parseInt(currentSemester),
          batch,
          cgpa: parseFloat(cgpa),
          sgpa: parseFloat(sgpa),
          attendance: parseFloat(attendance),
          profileCompletion: 80,
        },
      });

      // Create initial semester academic record
      await tx.academicRecord.create({
        data: {
          studentId: student.id,
          semester: parseInt(currentSemester),
          sgpa: parseFloat(sgpa),
          cgpa: parseFloat(cgpa),
          attendance: parseFloat(attendance),
          examStatus: 'PASS',
        },
      });

      return { user, student };
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE_STUDENT',
        details: `Created student ${name} (${rollNumber}) in program ${programId}.`,
      },
    });

    return NextResponse.json({ success: true, student: result.student });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
