// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to prevent overwriting
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${cleanFileName}`;
    
    // Save to database
    await prisma.uploadedFile.create({
      data: {
        filename,
        mimeType: file.type || 'application/octet-stream',
        data: buffer,
      },
    });

    // Publicly accessible URL path (served from our database endpoint)
    const fileUrl = `/api/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: file.name
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to write file to storage' }, { status: 500 });
  }
}
