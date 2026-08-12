// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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
    
    // Path inside public folder
    const publicDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure the uploads directory exists
    await mkdir(publicDir, { recursive: true });

    // Write file to filesystem
    const filePath = join(publicDir, filename);
    await writeFile(filePath, buffer);

    // Publicly accessible URL path
    const fileUrl = `/uploads/${filename}`;

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
