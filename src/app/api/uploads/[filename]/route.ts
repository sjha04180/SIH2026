// src/app/api/uploads/[filename]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    const fileRecord = await prisma.uploadedFile.findUnique({
      where: { filename },
    });

    if (!fileRecord) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Return the binary data with proper headers
    return new NextResponse(fileRecord.data as any, {
      headers: {
        'Content-Type': fileRecord.mimeType,
        'Content-Disposition': `inline; filename="${fileRecord.filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
