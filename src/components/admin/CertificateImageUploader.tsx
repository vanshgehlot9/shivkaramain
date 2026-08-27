'use client';

import { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import CertificateTemplate from '@/components/CertificateTemplate';
import { apiRequest } from '@/lib/admin-api';

interface Certificate {
    id: string;
    studentName: string;
    bootcampName?: string;
    bootcampCategory?: string;
    internshipName?: string;
    internshipCategory?: string;
    type?: 'bootcamp' | 'internship';
    completionDate: string;
    mentorName?: string;
    mentorTitle?: string;
    mentorSignature?: string;
}

interface Props {
    certificate: Certificate;
    onUploaded: (url: string) => void;
    onError: (error: string) => void;
}

export function CertificateImageUploader({ certificate, onUploaded, onError }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const onUploadedRef = useRef(onUploaded);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onUploadedRef.current = onUploaded;
        onErrorRef.current = onError;
    }, [onUploaded, onError]);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const generateAndUpload = async () => {
            try {
                // Wait a moment for fonts/images to load
                await new Promise(resolve => {
                    timeoutId = setTimeout(resolve, 1500);
                });

                if (!isMounted) return;

                const element = containerRef.current;
                if (!element) {
                    if (isMounted) throw new Error('Certificate element not found in DOM');
                    return;
                }

                // Try converting using html-to-image which handles modern CSS better
                const base64Image = await htmlToImage.toJpeg(element, {
                    quality: 0.9,
                    pixelRatio: 2,
                    style: {
                        transform: 'none',
                    },
                    filter: (node) => {
                        // Filter out print buttons if they leak
                        return !node.classList?.contains('print:hidden');
                    }
                });

                if (!isMounted) return;

                const data = await apiRequest<{ url: string }>('/certificates/upload', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: base64Image,
                        certificateId: certificate.id
                    })
                });

                if (!isMounted) return;

                if (data.success && data.data?.url) {
                    onUploadedRef.current(data.data.url);
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (error: any) {
                if (isMounted) {
                    console.error('Failed to generate/upload certificate image:', error);
                    onErrorRef.current(error.message || 'Failed to process certificate');
                }
            }
        };

        generateAndUpload();
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [certificate.id]);

    const formattedCertId = `SKD-${((certificate.type === 'internship' ? certificate.internshipName : certificate.bootcampName) || 'CERT').replace(/\s+/g, '').substring(0, 8).toUpperCase()}-${certificate.id.substring(0, 4).toUpperCase()}`;

    const verifyUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${certificate.id}`
        : `https://shivkaradigital.com/verify/${certificate.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&ecc=H`;

    return (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1100px' }}>
            <div ref={containerRef} className="certificate-wrapper" style={{ width: '1100px', background: 'white' }}>
                <CertificateTemplate
                    participantName={certificate.studentName || 'Participant Name'}
                    bootcampName={certificate.bootcampName || ''}
                    internshipName={certificate.internshipName || ''}
                    category={(certificate.type === 'internship' ? certificate.internshipCategory : certificate.bootcampCategory) || 'General'}
                    dateOfParticipation={new Date(certificate.completionDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    })}
                    certificateId={formattedCertId}
                    qrCodeUrl={qrCodeUrl}
                    type={certificate.type || 'bootcamp'}
                    mentorName={certificate.mentorName}
                    mentorTitle={certificate.mentorTitle}
                    mentorSignature={certificate.mentorSignature}
                />
            </div>
        </div>
    );
}
