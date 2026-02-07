'use server';

import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type ReferralResult = {
    success: boolean;
    message?: string;
    referrerName?: string;
    code?: string;
};

// Helper to find referral doc
async function findReferral(refId: string) {
    if (!db) return null;

    // 1. Check REFERRALS collection
    const referralsRef = db.collection(COLLECTIONS.REFERRALS);
    const referralQuery = await referralsRef.where('code', '==', refId).limit(1).get();

    if (!referralQuery.empty) {
        return {
            ref: referralQuery.docs[0].ref,
            data: referralQuery.docs[0].data(),
            type: 'referral'
        };
    }

    // 2. Check STUDENTS collection
    const studentsRef = db.collection(COLLECTIONS.STUDENTS);
    const studentQuery = await studentsRef.where('referralCode', '==', refId).limit(1).get();

    if (!studentQuery.empty) {
        return {
            ref: studentQuery.docs[0].ref,
            data: studentQuery.docs[0].data(),
            type: 'student'
        };
    }

    return null;
}

// 1. Read-Operation (Safe for Page Load)
export async function validateReferral(refId: string): Promise<ReferralResult> {
    try {
        const result = await findReferral(refId);

        if (!result) {
            return { success: false, message: 'Invalid referral code' };
        }

        const { data, type } = result;
        // Normalize name
        const ownerName = type === 'referral' ? (data.ownerName || data.name) : (data.name || 'A Student');

        return {
            success: true,
            referrerName: ownerName,
            code: refId
        };

    } catch (error) {
        console.error('Error validating referral:', error);
        return { success: false, message: 'Validation error' };
    }
}

// 2. Write-Operation (Must be called from Client or proper Action)
export async function trackReferralVisit(refId: string) {
    try {
        const result = await findReferral(refId);

        if (result) {
            // 3. Log the click (Analytics)
            try {
                await result.ref.update({
                    clicks: (result.data.clicks || 0) + 1,
                    lastClickAt: new Date()
                });
            } catch (e) {
                console.error('Failed to update click count', e);
            }

            // 4. Set Cookie for tracking
            (await cookies()).set('shivkara_referral', refId, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
    } catch (error) {
        console.error('Error tracking referral:', error);
    }
}
