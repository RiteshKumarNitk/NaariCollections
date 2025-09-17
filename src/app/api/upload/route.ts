import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files provided' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Convert the file to a buffer
      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      // Upload the file to Cloudinary
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            // Optionally, you can specify a folder in Cloudinary
            folder: 'naari-eshop',
            // Cloudinary will automatically detect the resource type (image)
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            // Return the secure URL of the uploaded image
            resolve(result?.secure_url);
          }
        ).end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls }, { status: 200 });

  } catch (error) {
    console.error('API Upload Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload files';
    return NextResponse.json({ message }, { status: 500 });
  }
}
