
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  // Ensure DB is initialized before proceeding, although it's not directly used for upload
  try {
    await getDb();
  } catch(error) {
    console.error('API Upload Error - DB Initialization failed:', error);
    return NextResponse.json({ message: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files provided' }, { status: 400 });
    }

    const bucket = getStorage().bucket();
    const uploadPromises = files.map(async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const uniqueFilename = `${randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
      const gcsFile = bucket.file(`product-images/${uniqueFilename}`);

      await gcsFile.save(fileBuffer, {
        metadata: {
          contentType: file.type,
        },
        public: true, // Make file public upon upload
      });

      // Return the public URL
      return gcsFile.publicUrl();
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls }, { status: 200 });

  } catch (error) {
    console.error('API Upload Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload files';
    return NextResponse.json({ message }, { status: 500 });
  }
}

    