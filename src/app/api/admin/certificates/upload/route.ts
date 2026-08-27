import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorizedResponse();

    try {
        const { image, certificateId } = await request.json();

        if (!image) {
            return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
        }
        
        if (!certificateId) {
            return NextResponse.json({ success: false, error: 'No certificateId provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'certificates',
            public_id: certificateId,
            overwrite: true,
            format: 'jpg',
        });

        const secureUrl = uploadResponse.secure_url;
        
        // Update the certificate in Firestore with the new Cloudinary URL
        if (db) {
            await db.collection(COLLECTIONS.CERTIFICATES).doc(certificateId).update({
                cloudinaryUrl: secureUrl,
                updatedAt: new Date()
            });
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                url: secureUrl,
            },
            message: 'Uploaded and linked successfully'
        });

    } catch (error: any) {
        console.error('Error uploading to Cloudinary:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to upload image' },
            { status: 500 }
        );
    }
}
