'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface CertificateData {
    id: string;
    type?: string;
    studentName: string;
    bootcampName?: string;
    bootcampCategory?: string;
    internshipName?: string;
    internshipCategory?: string;
    completionDate: string;
    issuedAt: string;
}

export default function CertificatePrintPage() {
    const params = useParams();
    const certificateId = params.id as string;
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [printing, setPrinting] = useState(false);
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

            if (data.success && data.data) {
                // Handle both nested and flat structure
                const certData = data.data.certificate || data.data;
                setCertificate(certData);

                // Generate QR Code locally to avoid CORS/tainting issues
                generateQRCode(certData.id);
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

    const generateQRCode = async (id: string) => {
        const verifyUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/verify/${id}`
            : `https://shivkaradigital.com/verify/${id}`;

        try {
            const url = await QRCode.toDataURL(verifyUrl, {
                width: 200,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            });
            setQrCodeDataUrl(url);
        } catch (err) {
            console.error('Error generating QR code:', err);
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

    const waitForImagesAndFonts = async (root: HTMLElement) => {
        try {
            // Wait for fonts to be ready (modern browsers)
            if ('fonts' in document && document.fonts?.ready) {
                await document.fonts.ready;
            }

            // Wait for all images inside the root to decode
            const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
            await Promise.all(imgs.map(async (img) => {
                if (img.complete && img.naturalWidth > 0) return;

                if (typeof img.decode === 'function') {
                    try {
                        await img.decode();
                        return;
                    } catch {
                        // Fall back to events below
                    }
                }

                await new Promise<void>((resolve) => {
                    img.addEventListener('load', () => resolve(), { once: true });
                    img.addEventListener('error', () => resolve(), { once: true });
                });
            }));

            // Let layout settle before snapshotting
            await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        } catch (err) {
            // swallow errors - best-effort
            console.warn('Error waiting for assets', err);
        }
    };

    const handlePrint = async () => {
        const element = document.getElementById('certificate-container');
        if (!element) return window.print();

        try {
            setPrinting(true);
            await waitForImagesAndFonts(element);
            // small delay to ensure layout stabilises
            await new Promise(r => setTimeout(r, 150));
            window.print();
        } finally {
            setPrinting(false);
        }
    };

    const handleDownload = async () => {
        const element = document.getElementById('certificate-container');
        if (!element || !certificate) return;

        setDownloading(true);

        try {
            // Ensure fonts and images are loaded before snapshotting
            await waitForImagesAndFonts(element);
            await new Promise(resolve => setTimeout(resolve, 250));

            // Create canvas from the certificate element
            // IMPORTANT: images must be CORS compliant or data URLs
            const scale = window.devicePixelRatio >= 2 ? 4 : 3;
            const canvas = await html2canvas(element, {
                scale,
                useCORS: true,
                backgroundColor: '#ffffff',
                imageTimeout: 10000,
                logging: false,
                onclone: (clonedDoc, clonedElement) => {
                    // CRITICAL: Remove all stylesheets that contain oklab colors
                    // html2canvas parses stylesheets before we can modify them
                    const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
                    stylesheets.forEach(sheet => {
                        // Check if it contains oklab
                        if (sheet.textContent?.includes('oklab') || sheet.tagName === 'LINK') {
                            sheet.remove();
                        }
                    });

                    // Apply computed styles as inline styles to all elements
                    const allElements = clonedElement.querySelectorAll('*');
                    allElements.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        const computed = window.getComputedStyle(htmlEl);

                        // Copy essential visual properties as inline styles
                        htmlEl.style.color = computed.color;
                        htmlEl.style.backgroundColor = computed.backgroundColor;
                        htmlEl.style.borderColor = computed.borderColor;
                        htmlEl.style.fontFamily = computed.fontFamily;
                        htmlEl.style.fontSize = computed.fontSize;
                        htmlEl.style.fontWeight = computed.fontWeight;
                        htmlEl.style.lineHeight = computed.lineHeight;
                        htmlEl.style.textAlign = computed.textAlign;
                        htmlEl.style.padding = computed.padding;
                        htmlEl.style.margin = computed.margin;
                        htmlEl.style.display = computed.display;
                        htmlEl.style.flexDirection = computed.flexDirection;
                        htmlEl.style.justifyContent = computed.justifyContent;
                        htmlEl.style.alignItems = computed.alignItems;
                        htmlEl.style.gap = computed.gap;
                        htmlEl.style.width = computed.width;
                        htmlEl.style.height = computed.height;
                        htmlEl.style.position = computed.position;
                        htmlEl.style.top = computed.top;
                        htmlEl.style.left = computed.left;
                        htmlEl.style.right = computed.right;
                        htmlEl.style.bottom = computed.bottom;
                        htmlEl.style.borderRadius = computed.borderRadius;
                        htmlEl.style.borderWidth = computed.borderWidth;
                        htmlEl.style.borderStyle = computed.borderStyle;
                        htmlEl.style.opacity = computed.opacity;
                        htmlEl.style.boxShadow = computed.boxShadow;
                        htmlEl.style.textTransform = computed.textTransform;
                        htmlEl.style.letterSpacing = computed.letterSpacing;
                    });

                    // Also apply to the container itself
                    const containerComputed = window.getComputedStyle(element);
                    clonedElement.style.backgroundColor = containerComputed.backgroundColor;
                    clonedElement.style.color = containerComputed.color;

                    // Fix text gradient for PDF generation
                    const nameElement = clonedElement.querySelector('.student-name-gradient') as HTMLElement;
                    if (nameElement) {
                        nameElement.style.background = 'none';
                        nameElement.style.webkitTextFillColor = '#1e293b';
                        nameElement.style.color = '#1e293b';
                    }
                }
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
            const projectName = certificate.type === 'internship' ? (certificate.internshipName || 'Internship') : (certificate.bootcampName || 'Bootcamp');
            const filename = `Certificate_${studentName}_${projectName}.pdf`;

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
    let typeCode = '';
    if (certificate.type === 'internship') {
        typeCode = (certificate.internshipName || 'INTERN').replace(/\s+/g, '').substring(0, 8).toUpperCase();
    } else {
        typeCode = (certificate.bootcampName || 'BOOTCAMP').replace(/\s+/g, '').substring(0, 8).toUpperCase();
    }
    const idSuffix = (certificate.id || '0000').substring(0, 4).toUpperCase();
    const formattedCertId = `SKD-${typeCode}-${idSuffix}`;

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
                
                .student-name-gradient {
                    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e293b 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
                
                @media print {
                    .student-name-gradient {
                        background: none !important;
                        -webkit-text-fill-color: #1e293b !important;
                        color: #1e293b !important;
                    }
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
                            disabled={printing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {printing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Preparing...
                                </>
                            ) : (
                                <>
                                    <Printer size={18} />
                                    Print
                                </>
                            )}
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
                                    {certificate.type === 'internship' ? 'Completion' : 'Participation'}
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
                                    className="text-7xl font-bold mb-6 px-12 tracking-tight student-name-gradient"
                                    style={{
                                        fontFamily: "'Playfair Display', serif"
                                    }}
                                >
                                    {certificate.studentName || 'Participant Name'}
                                </h2>
                                <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                            </div>

                            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4 font-light">
                                has successfully {certificate.type === 'internship' ? 'completed the internship in' : 'attended the'} <span className="font-semibold text-slate-900">{certificate.type === 'internship' ? certificate.internshipName : certificate.bootcampName || 'Bootcamp'}</span> {certificate.type !== 'internship' && 'Bootcamp,'}
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
                                {/* Founder */}
                                <div className="text-center relative">
                                    <div className="h-16 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/vansh.png"
                                            alt="Founder Signature"
                                            className="h-16 w-auto object-contain signature-img"
                                        />
                                    </div>
                                    <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                        <p className="font-bold text-slate-900 text-sm">Vansh Gehlot</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Founder</p>
                                    </div>
                                </div>

                                {/* Mentor / Tutor */}
                                <div className="text-center">
                                    <div className="h-16 flex items-end justify-center mb-2">
                                        <img
                                            src={`/signature/${certificate.mentorSignature || 'tutor.PNG'}`}
                                            alt={`${certificate.mentorName || 'UI/Web Designer'} Signature`}
                                            className="h-16 w-auto object-contain signature-img"
                                        />
                                    </div>
                                    <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                        <p className="font-bold text-slate-900 text-sm">{certificate.mentorName || 'UI/Web Designer'}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{certificate.mentorTitle || 'Signature'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Info */}
                            <div className="flex items-end gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
                                    <p className="font-mono text-xs text-slate-600 tracking-wide mb-3">{formattedCertId}</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
