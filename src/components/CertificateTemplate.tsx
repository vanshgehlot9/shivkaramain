'use client';

import { useRef } from 'react';
import { Printer } from 'lucide-react';
import Image from 'next/image';

interface CertificateProps {
    participantName: string;
    bootcampName: string;
    category: string;
    dateOfParticipation: string;
    certificateId: string;
    qrCodeUrl?: string;
}

export default function CertificateTemplate({
    participantName = "Participant Name",
    bootcampName = "SPUNK 2025",
    category = "Product Design",
    dateOfParticipation = "4 December 2025",
    certificateId = "SKD-SPUNK25-0001",
    qrCodeUrl
}: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white">
            {/* Controls - Hidden in print */}
            <div className="max-w-[850px] mx-auto mb-6 flex justify-end gap-3 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                    <Printer size={18} />
                    Print Certificate
                </button>
            </div>

            {/* Certificate Container - A4 Aspect Ratio */}
            <div
                ref={certificateRef}
                className="max-w-[850px] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none"
                style={{
                    aspectRatio: '1 / 1.414',
                    fontFamily: "'Inter', 'Poppins', system-ui, sans-serif"
                }}
            >
                {/* Certificate Content */}
                <div className="relative h-full flex flex-col">

                    {/* Decorative Top Border */}
                    <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>

                    {/* Main Content Area */}
                    <div className="flex-1 px-16 py-12 flex flex-col">

                        {/* Header with Logo */}
                        <header className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <img
                                    src="/shivkara-logo.png"
                                    alt="Shivkara Digital"
                                    className="h-24 w-auto object-contain"
                                />
                            </div>
                        </header>

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <div className="w-24 h-px bg-gradient-to-r from-transparent to-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-24 h-px bg-gradient-to-l from-transparent to-slate-300"></div>
                        </div>

                        {/* Certificate Title */}
                        <div className="text-center mb-8">
                            <p className="text-sm font-medium tracking-[0.4em] text-slate-400 uppercase mb-3">
                                Certificate of
                            </p>
                            <h1 className="text-4xl font-light tracking-[0.15em] text-slate-800 uppercase">
                                Participation
                            </h1>
                        </div>

                        {/* Main Content */}
                        <main className="flex-1 flex flex-col items-center justify-center text-center">
                            {/* Certification Statement */}
                            <div className="mb-8">
                                <p className="text-base text-slate-500 mb-6">
                                    This is to certify that
                                </p>

                                {/* Participant Name - Largest Element */}
                                <div className="relative inline-block mb-6">
                                    <h2 className="text-5xl font-semibold text-slate-900 tracking-tight px-8">
                                        {participantName}
                                    </h2>
                                    {/* Decorative underline */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                                </div>

                                <p className="text-base text-slate-500 leading-relaxed max-w-lg mt-8">
                                    has successfully attended the{' '}
                                    <span className="font-bold text-slate-800">{bootcampName}</span>{' '}
                                    Bootcamp
                                    <br />
                                    organized by <span className="font-medium text-slate-700">Shivkara Digital</span>
                                </p>
                            </div>

                            {/* Program Info Cards */}
                            <div className="flex items-center justify-center gap-12 mt-4 mb-8">
                                <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                                    <p className="text-sm font-semibold text-slate-700">{category}</p>
                                </div>
                                <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date of Participation</p>
                                    <p className="text-sm font-semibold text-slate-700">{dateOfParticipation}</p>
                                </div>
                            </div>
                        </main>

                        {/* Authority Section - Signatures */}
                        <footer className="mt-auto pt-8">
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                {/* Founder */}
                                <div className="text-center">
                                    <div className="h-20 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/sawaisingh.png"
                                            alt="Signature"
                                            className="h-full w-auto object-contain mix-blend-multiply opacity-90 contrast-200 brightness-110 grayscale"
                                        />
                                    </div>
                                    <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                                    <p className="font-bold text-slate-800 text-sm">Sawai Singh</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Founder</p>
                                </div>

                                {/* Training Incharge */}
                                <div className="text-center">
                                    <div className="h-20 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/ashutosh.png"
                                            alt="Signature"
                                            className="h-full w-auto object-contain mix-blend-multiply opacity-90 contrast-200 brightness-110 grayscale"
                                        />
                                    </div>
                                    <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                                    <p className="font-bold text-slate-800 text-sm">Ashutosh Singh</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Training Incharge</p>
                                </div>

                                {/* Mentor */}
                                <div className="text-center">
                                    <div className="h-20 flex items-end justify-center mb-2">
                                        <img
                                            src="/signature/mohit.png"
                                            alt="Signature"
                                            className="h-full w-auto object-contain mix-blend-multiply opacity-90 contrast-200 brightness-110 grayscale"
                                        />
                                    </div>
                                    <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                                    <p className="font-bold text-slate-800 text-sm">Mohit</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Mentor</p>
                                </div>
                            </div>

                            {/* Certificate ID and QR Section */}
                            <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Certificate ID</p>
                                    <p className="font-mono text-sm text-slate-600 mt-0.5">{certificateId}</p>
                                </div>

                                {/* QR Code */}
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400">Scan to verify</p>
                                        <p className="text-[10px] text-slate-400">authenticity</p>
                                    </div>
                                    {qrCodeUrl ? (
                                        <img
                                            src={qrCodeUrl}
                                            alt="Verification QR Code"
                                            className="w-16 h-16 rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
                                            <span className="text-[8px] text-slate-400 text-center">QR<br />Code</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </footer>
                    </div>

                    {/* Decorative Bottom Border */}
                    <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
                
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
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
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
