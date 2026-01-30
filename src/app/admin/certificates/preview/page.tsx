'use client';

import CertificateTemplate from '@/components/CertificateTemplate';

export default function CertificatePreviewPage() {
    // Sample data for preview
    const sampleData = {
        participantName: "Nikhil Kachhawaha",
        bootcampName: "SPUNK 2025",
        category: "Product Design",
        dateOfParticipation: "4 December 2025",
        certificateId: "SKD-SPUNK25-0001",
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://shivkaradigital.com/verify/sample&ecc=H"
    };

    return (
        <CertificateTemplate
            participantName={sampleData.participantName}
            bootcampName={sampleData.bootcampName}
            category={sampleData.category}
            dateOfParticipation={sampleData.dateOfParticipation}
            certificateId={sampleData.certificateId}
            qrCodeUrl={sampleData.qrCodeUrl}
        />
    );
}
