import { validateReferral } from './action';
import ReferralClient from './ReferralClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Referral Verification | Shivkara Digital',
    description: 'Verifying your referral code...',
};

import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';

export default async function Page({ params }: { params: Promise<{ refId: string }> }) {
    const { refId } = await params;

    // Validate the referral code
    const result = await validateReferral(refId);

    // Fetch Active Bootcamp details for pricing display
    let bootcampDetails = null;
    if (db) {
        const bootcampsRef = db.collection(COLLECTIONS.BOOTCAMPS);
        const activeBootcampSnapshot = await bootcampsRef.where('status', '==', 'active').limit(1).get();
        if (!activeBootcampSnapshot.empty) {
            const data = activeBootcampSnapshot.docs[0].data();
            bootcampDetails = {
                id: activeBootcampSnapshot.docs[0].id,
                name: data.name,
                price: Number(data.price) || 0,
            };
        }
    }

    return (
        <ReferralClient
            status={result.success ? 'success' : 'error'}
            referrerName={result.referrerName}
            code={refId}
            message={result.message}
            bootcamp={bootcampDetails}
        />
    );
}
