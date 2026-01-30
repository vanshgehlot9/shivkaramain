'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CertificateTemplate from '@/components/CertificateTemplate';

interface CertificateData {
    id: string;
    studentName: string;
    bootcampName: string;
    bootcampCategory: string;
    completionDate: string;
    issuedAt: string;
}

export default function CertificatePrintPage() {
    const params = useParams();
    const certificateId = params.id as string;
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (certificateId) {
            fetchCertificate();
        }
    }, [certificateId]);

    const fetchCertificate = async () => {
        try {
            const response = await fetch(`/api/admin/certificates/${certificateId}`);
            const data = await response.json();

            if (data.success && data.data?.certificate) {
                // The API returns data nested under data.certificate
                setCertificate(data.data.certificate);
            } else if (data.success && data.data) {
                // Fallback for flat structure
                setCertificate(data.data);
            } else {
                setError(data.error || 'Certificate not found');
            }
        } catch (err) {
            console.error('Error fetching certificate:', err);
            setError('Failed to load certificate');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string | Date | null | undefined) => {
        if (!dateStr) return 'Date not specified';
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Certificate Not Found</h1>
                    <p className="text-slate-500">{error || 'Unable to load certificate data'}</p>
                    <a
                        href="/admin/certificates"
                        className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                        Back to Certificates
                    </a>
                </div>
            </div>
        );
    }

    // Generate certificate ID format: SKD-SPUNK25-XXXX
    const bootcampCode = (certificate.bootcampName || 'BOOTCAMP').replace(/\s+/g, '').substring(0, 8).toUpperCase();
    const idSuffix = (certificate.id || '0000').substring(0, 4).toUpperCase();
    const formattedCertId = `SKD-${bootcampCode}-${idSuffix}`;

    // Generate QR code URL
    const verifyUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${certificate.id}`
        : `https://shivkaradigital.com/verify/${certificate.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&ecc=H`;

    return (
        <CertificateTemplate
            participantName={certificate.studentName || 'Participant Name'}
            bootcampName={certificate.bootcampName || 'Bootcamp'}
            category={certificate.bootcampCategory || 'Technology'}
            dateOfParticipation={formatDate(certificate.completionDate)}
            certificateId={formattedCertId}
            qrCodeUrl={qrCodeUrl}
        />
    );
}
