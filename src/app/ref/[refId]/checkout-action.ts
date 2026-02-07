'use server';

import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { razorpay } from '@/lib/razorpay';
import { validateReferral } from './action';



export async function createBootcampOrder(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    refId: string;
}) {
    if (!db) {
        return { success: false, error: 'Database unavailable' };
    }



    try {
        // 1. Fetch Active Bootcamp
        const bootcampsRef = db.collection(COLLECTIONS.BOOTCAMPS);
        const activeBootcampSnapshot = await bootcampsRef.where('status', '==', 'active').limit(1).get();

        if (activeBootcampSnapshot.empty) {
            return { success: false, error: 'No active bootcamp enrollment found.' };
        }

        const bootcampDoc = activeBootcampSnapshot.docs[0];
        const bootcampData = bootcampDoc.data();

        // Use dynamic config
        const BOOTCAMP_config = {
            id: bootcampDoc.id,
            name: bootcampData.name || 'Bootcamp',
            price: Number(bootcampData.price) || 7800, // Fallback safe
            discountPercent: 5
        };

        // 2. Validate Referral Code to apply discount
        const referralResult = await validateReferral(formData.refId);
        let discountAmount = 0;
        let finalAmount = BOOTCAMP_config.price;
        let isReferralValid = referralResult.success;

        if (isReferralValid) {
            discountAmount = Math.round((BOOTCAMP_config.price * BOOTCAMP_config.discountPercent) / 100);
            finalAmount = BOOTCAMP_config.price - discountAmount;
        }

        // 3. Create/Update Student Record
        const studentsRef = db.collection(COLLECTIONS.STUDENTS);
        const studentQuery = await studentsRef.where('email', '==', formData.email).limit(1).get();

        let studentId = '';
        let studentRef;

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        const studentData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            fullName: fullName, // Critical for Admin Page
            email: formData.email,
            phone: formData.phone,
            enrolledBootcamps: [], // This should ideally be updated upon payment success
            updatedAt: new Date(),
            enrolledAt: new Date(), // Critical for "New This Month" stat
            referredBy: isReferralValid ? formData.refId : null,
            paymentStatus: 'pending_payment' // Student won't show in admin until verified
        };

        if (!studentQuery.empty) {
            // Update existing student
            studentRef = studentQuery.docs[0].ref;
            studentId = studentRef.id;
            await studentRef.update({
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: fullName,
                phone: formData.phone,
                updatedAt: new Date(),
                paymentStatus: 'pending_payment' // Reset to pending on new checkout
            });
        } else {
            // Create new student
            studentRef = await studentsRef.add({
                ...studentData,
                createdAt: new Date()
            });
            studentId = studentRef.id;
        }

        // 4. Create Invoice Record
        const invoiceData = {
            invoiceNumber: `INV-${Date.now()}`,
            clientId: studentId,
            clientName: fullName,
            clientEmail: formData.email,
            date: new Date(),
            dueDate: new Date(), // Immediate payment
            status: 'pending_verification', // Manual payment status
            items: [
                {
                    description: BOOTCAMP_config.name,
                    quantity: 1,
                    rate: BOOTCAMP_config.price,
                    amount: BOOTCAMP_config.price
                },
                ...(isReferralValid ? [{
                    description: `Referral Discount (${formData.refId})`,
                    quantity: 1,
                    rate: -discountAmount,
                    amount: -discountAmount
                }] : [])
            ],
            subtotal: BOOTCAMP_config.price,
            discount: discountAmount,
            total: finalAmount, // Final amount to pay
            type: 'BOOTCAMP_REGISTRATION',
            bootcampId: BOOTCAMP_config.id,
            referralCode: isReferralValid ? formData.refId : null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const invoiceRef = await db.collection(COLLECTIONS.INVOICES).add(invoiceData);
        const invoiceId = invoiceRef.id;

        // Return details for Manual Payment UI
        return {
            success: true,
            amount: finalAmount,
            currency: "INR",
            invoiceId: invoiceId,
            studentName: fullName,
            studentEmail: formData.email,
            studentPhone: formData.phone,
            description: `Payment for ${BOOTCAMP_config.name}`,
            bootcampName: BOOTCAMP_config.name
        };

    } catch (error: any) {
        console.error('Error creating bootcamp order:', error);
        return { success: false, error: error.message || 'Failed to create order' };
    }
}
