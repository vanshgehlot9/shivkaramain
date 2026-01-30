'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    const [downloading, setDownloading] = useState(false);
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
                setCertificate(data.data.certificate);
            } else if (data.success && data.data) {
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

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        const element = document.getElementById('certificate-container');
        if (!element || !certificate) return;

        setDownloading(true);

        try {
            // Create canvas from the certificate element
            const canvas = await html2canvas(element, {
                scale: 4, // Higher quality (approx 300 DPI)
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#fbf9fd', // Consistent background color
                logging: false,
            });

            // Create PDF with A4 Landscape dimensions
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 297; // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add image to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Generate filename
            const studentName = certificate.studentName.replace(/\s+/g, '_');
            const filename = `Certificate_${studentName}_${certificate.bootcampName || 'Bootcamp'}.pdf`;

            // Download
            pdf.save(filename);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to download certificate. Please try printing instead.');
        } finally {
            setDownloading(false);
        }
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
                    <p className="text-slate-500 mb-4">{error || 'Unable to load certificate data'}</p>
                    <a
                        href="/admin/certificates"
                        className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                        Back to Certificates
                    </a>
                </div>
            </div>
        );
    }

    // Generate certificate ID format
    const bootcampCode = (certificate.bootcampName || 'BOOTCAMP').replace(/\s+/g, '').substring(0, 8).toUpperCase();
    const idSuffix = (certificate.id || '0000').substring(0, 4).toUpperCase();
    const formattedCertId = `SKD-${bootcampCode}-${idSuffix}`;

    // Generate QR code URL
    const verifyUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${certificate.id}`
        : `https://shivkaradigital.com/verify/${certificate.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&ecc=H`;

    return (
        <>
            {/* Print Styles - Must be first */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');
                
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    html, body {
                        width: 297mm;
                        height: 210mm;
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #certificate-container, #certificate-container * {
                        visibility: visible;
                    }
                    #certificate-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 297mm;
                        height: 210mm;
                        transform: none;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
                
                .signature-img {
                    mix-blend-mode: multiply;
                    filter: grayscale(100%) contrast(250%) brightness(110%);
                }
            `}</style>

            <div className="min-h-screen bg-slate-200 py-8 px-4 overflow-auto">
                {/* Controls - Hidden in print */}
                <div className="max-w-[1123px] mx-auto mb-6 flex justify-between items-center no-print">
                    <a
                        href="/admin/certificates"
                        className="text-slate-600 hover:text-slate-900 text-sm"
                    >
                        ← Back to Certificates
                    </a>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download PDF
                                </>
                            )}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                    </div>
                </div>

                {/* Certificate Container - Landscape Aspect Ratio */}
                <div
                    id="certificate-container"
                    className="max-w-[1123px] mx-auto shadow-2xl relative overflow-hidden"
                    style={{
                        aspectRatio: '297 / 210',
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: '#ffffff'
                    }}
                >
                    {/* Border Frame */}
                    <div className="absolute inset-8 border-4 border-double border-slate-900/10 pointer-events-none z-10"></div>
                    <div className="absolute inset-10 border border-slate-900/5 pointer-events-none z-10"></div>

                    {/* Corner Decoration */}
                    <div className="absolute top-8 left-8 w-6 h-6 border-l-4 border-t-4 border-slate-800 z-20"></div>
                    <div className="absolute top-8 right-8 w-6 h-6 border-r-4 border-t-4 border-slate-800 z-20"></div>
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-l-4 border-b-4 border-slate-800 z-20"></div>
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-r-4 border-b-4 border-slate-800 z-20"></div>

                    {/* Background Texture - Noise */}
                    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                    </div>

                    {/* Background Pattern - Guilloche-style Security Pattern */}
                    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 50% 50%, #000 1px, transparent 1px), radial-gradient(circle at 0% 0%, #000 1px, transparent 1px), radial-gradient(circle at 100% 0%, #000 1px, transparent 1px), radial-gradient(circle at 100% 100%, #000 1px, transparent 1px), radial-gradient(circle at 0% 100%, #000 1px, transparent 1px)`,
                            backgroundSize: '40px 40px, 60px 60px, 60px 60px, 60px 60px, 60px 60px'
                        }}>
                    </div>

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.02)_100%)] pointer-events-none"></div>

                    {/* Background Watermark */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none mix-blend-multiply">
                        <img src="/shivkara-logo.png" className="w-[600px] h-[600px] object-contain grayscale" alt="" />
                    </div>

                    {/* Inner Content Container */}
                    <div className="relative h-full flex flex-col p-24 z-10 box-border">

                        {/* Top Section with Logo */}
                        <header className="flex items-start justify-between mb-8">
                            <img
                                src="/shivkara-logo.png"
                                alt="Shivkara Digital"
                                className="h-24 w-auto object-contain"
                            />
                            <div className="text-right">
                                <p className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase mb-2">
                                    Certificate of
                                </p>
                                <h1 className="text-5xl text-slate-900 uppercase tracking-widest leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Participation
                                </h1>
                            </div>
                        </header>

                        {/* Main Body */}
                        <main className="flex-1 text-center flex flex-col items-center justify-center">
                            <p className="text-xl text-slate-500 italic mb-8 font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                                This is to certify that
                            </p>

                            <div className="relative mb-10 w-full max-w-4xl">
                                <h2
                                    className="text-7xl font-bold mb-6 px-12 tracking-tight"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e293b 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        color: 'transparent'
                                    }}
                                >
                                    {certificate.studentName || 'Participant Name'}
                                </h2>
                                <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                            </div>

                            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4 font-light">
                                has successfully attended the <span className="font-semibold text-slate-900">{certificate.bootcampName || 'Bootcamp'}</span> Bootcamp,
                                <br />demonstrating dedication and commitment to excellence.
                            </p>

                            <p className="text-lg text-slate-600 font-medium">
                                on {formatDate(certificate.completionDate)}
                            </p>
                        </main>

                        {/* Footer */}
                        <footer className="mt-8 pt-8 flex items-end justify-between">
                            {/* Left Signatures */}
                            <div className="flex gap-16">
                                {/* Sawai Singh */}
                                <div className="text-center relative">
                                    <div className="h-16 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/sawaisingh.png"
                                            alt="Signature"
                                            className="h-16 w-auto object-contain signature-img"
                                            style={{ mixBlendMode: 'multiply' }}
                                        />
                                    </div>
                                    <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                        <p className="font-bold text-slate-900 text-sm">Sawai Singh</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Founder</p>
                                    </div>
                                </div>

                                {/* Ashutosh Singh */}
                                <div className="text-center">
                                    <div className="h-16 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/ashutosh.png"
                                            alt="Signature"
                                            className="h-16 w-auto object-contain signature-img"
                                            style={{ mixBlendMode: 'multiply' }}
                                        />
                                    </div>
                                    <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                        <p className="font-bold text-slate-900 text-sm">Ashutosh Singh</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Training Incharge</p>
                                    </div>
                                </div>

                                {/* Mohit */}
                                <div className="text-center">
                                    <div className="h-16 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/mohit.png"
                                            alt="Signature"
                                            className="h-16 w-auto object-contain signature-img"
                                            style={{ mixBlendMode: 'multiply' }}
                                        />
                                    </div>
                                    <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                        <p className="font-bold text-slate-900 text-sm">Mohit</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Mentor</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right QR Info */}
                            <div className="flex items-end gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
                                    <p className="font-mono text-xs text-slate-600 tracking-wide mb-3">{formattedCertId}</p>

                                    <p className="text-[10px] font-medium text-slate-500">Scan to Verify</p>
                                    <p className="text-[10px] text-slate-400">Shivkara Digital</p>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-slate-100 shadow-sm">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-16 h-16"
                                    />
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
