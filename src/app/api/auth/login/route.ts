// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        faculty: true,
        coordinator: true,
        principal: true,
      },
    });

    if (!user) {
      // Fallback check: check if it matches a student's personalEmail for permanent alumni access
      const studentProfile = await prisma.student.findFirst({
        where: { personalEmail: email },
        include: {
          user: {
            include: {
              student: true,
              faculty: true,
              coordinator: true,
              principal: true,
            }
          }
        }
      });
      if (studentProfile) {
        user = studentProfile.user;
      }
    }

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    let profileId = '';
    if (user.role === 'STUDENT') {
      profileId = user.student?.id || '';
    } else if (user.role === 'FACULTY') {
      profileId = user.faculty?.id || '';
    } else if (user.role === 'COORDINATOR') {
      profileId = user.coordinator?.id || '';
    } else if (user.role === 'PRINCIPAL') {
      profileId = user.principal?.id || '';
    }

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      profileId,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        profileId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
