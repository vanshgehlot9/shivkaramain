'use client';

import { useRef } from 'react';
import { Printer } from 'lucide-react';

interface CertificateProps {
    participantName: string;
    bootcampName?: string;
    internshipName?: string;
    category: string;
    dateOfParticipation: string;
    certificateId: string;
    qrCodeUrl?: string;
    type?: 'bootcamp' | 'internship';
    mentorName?: string;
    mentorTitle?: string;
    mentorSignature?: string;
}

export default function CertificateTemplate({
    participantName = "Participant Name",
    bootcampName = "SPUNK 2025",
    internshipName = "",
    category = "Product Design",
    dateOfParticipation = "4 December 2025",
    certificateId = "SKD-SPUNK25-0001",
    qrCodeUrl,
    type = 'bootcamp',
    mentorName = "UI/Web Designer",
    mentorTitle = "Signature",
    mentorSignature = "tutor.PNG"
}: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white print:p-0">
            {/* Global Styles for Typography and specific text effects */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');
                
                .signature-img-shared {
                    mix-blend-mode: multiply;
                    filter: grayscale(100%) contrast(250%) brightness(110%);
                }
                
                .student-name-gradient-shared {
                    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e293b 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }

                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    html, body {
                        width: 297mm;
                        height: 210mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:bg-white {
                        background: white !important;
                    }
                }
            `}} />

            {/* Controls - Hidden in print */}
            <div className="max-w-[1100px] mx-auto my-6 flex justify-end gap-3 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                    <Printer size={18} />
                    Print Certificate
                </button>
            </div>

            {/* Certificate Container - Landscape Aspect Ratio A4 (297x210) */}
            <div
                ref={certificateRef}
                className="w-full max-w-[1100px] mx-auto relative overflow-hidden bg-white shadow-2xl print:shadow-none"
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
                                {type === 'internship' ? 'Completion' : 'Participation'}
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
                                className="text-7xl font-bold mb-6 px-12 tracking-tight student-name-gradient-shared"
                                style={{
                                    fontFamily: "'Playfair Display', serif"
                                }}
                            >
                                {participantName || 'Participant Name'}
                            </h2>
                            <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                        </div>

                        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4 font-light">
                            has successfully {type === 'internship' ? 'completed the internship in' : 'attended the'} <span className="font-semibold text-slate-900">{type === 'internship' ? internshipName : bootcampName || 'Bootcamp'}</span> {type !== 'internship' && 'Bootcamp,'}
                            <br />demonstrating dedication and commitment to excellence.
                        </p>

                        <p className="text-lg text-slate-600 font-medium">
                            on {dateOfParticipation}
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
                                        className="h-16 w-auto object-contain signature-img-shared"
                                        style={{ mixBlendMode: 'multiply' }}
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
                                        src={`/signature/${mentorSignature || 'tutor.PNG'}`}
                                        alt={`${mentorName || 'UI/Web Designer'} Signature`}
                                        className="h-16 w-auto object-contain signature-img-shared"
                                        style={{ mixBlendMode: 'multiply' }}
                                    />
                                </div>
                                <div className="border-t border-slate-800 pt-2 w-32 mx-auto">
                                    <p className="font-bold text-slate-900 text-sm">{mentorName || 'UI/Web Designer'}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{mentorTitle || 'Signature'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Info */}
                        <div className="flex items-end gap-6">
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
                                <p className="font-mono text-xs text-slate-600 tracking-wide mb-3">{certificateId}</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
