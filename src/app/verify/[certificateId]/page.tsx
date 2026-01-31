/**
 * Public Certificate Verification Page
 * 
 * This page displays the verification result for a certificate.
 * Ultimate Tech Design with glassmorphism and modern aesthetics.
 */

import { Metadata } from 'next';
import { Shield, CheckCircle, XCircle, AlertTriangle, Award, Calendar, Building2, User, ExternalLink, Fingerprint } from 'lucide-react';
import { VerificationResult, CertificateStatus } from '@/lib/certificate-types';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ certificateId: string }>;
}

// Dynamic metadata based on certificate
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { certificateId } = await params;

    return {
        title: `Certificate Verification - ${certificateId} | Shivkara Digital`,
        description: 'Verify the authenticity of this certificate issued by Shivkara Digital. Secure, instant, and tamper-proof verification.',
        openGraph: {
            title: 'Certificate Verification | Shivkara Digital',
            description: 'Verify the authenticity of certificates issued by Shivkara Digital.',
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

async function getVerificationResult(certificateId: string): Promise<VerificationResult | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shivkaradigital.com';
        const response = await fetch(`${baseUrl}/api/public/verify/${certificateId}`, {
            cache: 'no-store',
        });

        if (!response.ok && response.status !== 404 && response.status !== 400) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Verification fetch error:', error);
        return null;
    }
}

export default async function VerifyPage({ params }: PageProps) {
    const { certificateId } = await params;
    const result = await getVerificationResult(certificateId);

    if (!result) {
        return <ErrorState message="Unable to verify certificate. Please try again later." />;
    }

    return (
        <main className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 py-12 px-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-600/10 to-transparent blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-6 shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        Certificate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Verification</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Shivkara Digital</p>
                </header>

                {/* Verification Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                    {/* Status Banner */}
                    <StatusBanner status={result.status} valid={result.valid} />

                    {/* Certificate Details */}
                    {result.certificate && (
                        <div className="p-8 space-y-6">
                            <CertificateDetails certificate={result.certificate} />
                        </div>
                    )}

                    {/* Message */}
                    <div className="px-8 pb-8">
                        <div className={`p-5 rounded-2xl border ${result.valid
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : (result.status === CertificateStatus.REVOKED || result.status as string === 'REVOKED' || result.status as string === 'revoked')
                                ? 'bg-amber-500/10 border-amber-500/20'
                                : 'bg-red-500/10 border-red-500/20'
                            }`}>
                            <p className={`text-sm font-medium ${result.valid
                                ? 'text-emerald-400'
                                : (result.status === CertificateStatus.REVOKED || result.status as string === 'REVOKED' || result.status as string === 'revoked')
                                    ? 'text-amber-400'
                                    : 'text-red-400'
                                }`}>
                                {result.message}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-white/[0.02] px-8 py-5 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500 font-mono">
                            <div className="flex items-center gap-2">
                                <Fingerprint size={14} className="text-gray-600" />
                                <span className="uppercase tracking-wider">{certificateId}</span>
                            </div>
                            <span>Verified: {new Date(result.verifiedAt).toLocaleString('en-IN')}</span>
                        </div>
                    </footer>
                </div>

                {/* Trust Footer */}
                <div className="mt-12 text-center space-y-6">
                    <Link
                        href="https://www.shivkaradigital.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Visit Our Website
                        <ExternalLink size={16} />
                    </Link>
                    <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                        This verification system is operated by Shivkara Digital.
                        <br />
                        For inquiries, contact{' '}
                        <a href="mailto:info@shivkaradigital.com" className="text-gray-400 hover:text-white transition-colors">
                            info@shivkaradigital.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}

// ============================================================================
// Components
// ============================================================================

function StatusBanner({ status, valid }: { status: string; valid: boolean }) {
    if (valid) {
        return (
            <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 backdrop-blur-sm px-8 py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-xl">
                        <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">VERIFIED</h2>
                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest">This certificate is authentic and valid</p>
                </div>
            </div>
        );
    }

    if (status === CertificateStatus.REVOKED || status === 'REVOKED') {
        return (
            <div className="bg-gradient-to-br from-amber-600/80 to-amber-700/80 backdrop-blur-sm px-8 py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-xl">
                        <AlertTriangle className="w-14 h-14 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">REVOKED</h2>
                    <p className="text-amber-100 text-sm font-medium uppercase tracking-widest">This certificate has been revoked</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-sm px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-xl">
                    <XCircle className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">NOT VERIFIED</h2>
                <p className="text-red-100 text-sm font-medium uppercase tracking-widest">Certificate could not be verified</p>
            </div>
        </div>
    );
}

function CertificateDetails({ certificate }: {
    certificate: {
        studentName: string;
        bootcampName: string;
        bootcampCategory: string;
        completionDate: Date;
        issuedAt: Date;
        issuingAuthority: string;
        revokedAt?: Date;
    }
}) {
    return (
        <div className="space-y-5">
            {/* Recipient */}
            <DetailRow
                icon={<User className="w-5 h-5" />}
                label="Awarded To"
                value={certificate.studentName}
                highlight
            />

            {/* Program */}
            <DetailRow
                icon={<Award className="w-5 h-5" />}
                label="Program"
                value={certificate.bootcampName}
                sublabel={`Category: ${formatCategory(certificate.bootcampCategory)}`}
            />

            {/* Completion Date */}
            <DetailRow
                icon={<Calendar className="w-5 h-5" />}
                label="Completion Date"
                value={formatDate(certificate.completionDate)}
            />

            {/* Issuing Authority */}
            <DetailRow
                icon={<Building2 className="w-5 h-5" />}
                label="Issued By"
                value={certificate.issuingAuthority}
                sublabel={`Issued on: ${formatDate(certificate.issuedAt)}`}
            />

            {/* Revocation Date if applicable */}
            {certificate.revokedAt && (
                <div className="pt-5 border-t border-white/10">
                    <DetailRow
                        icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
                        label="Revoked On"
                        value={formatDate(certificate.revokedAt)}
                    />
                </div>
            )}
        </div>
    );
}

function DetailRow({
    icon,
    label,
    value,
    sublabel,
    highlight
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sublabel?: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <p className={`${highlight ? 'text-xl font-bold text-white' : 'text-white font-medium'}`}>
                    {value}
                </p>
                {sublabel && (
                    <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
                )}
            </div>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <main className="min-h-screen bg-[#030303] flex items-center justify-center py-8 px-4 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-md mx-auto text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Verification Error</h1>
                <p className="text-gray-400 mb-8">{message}</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Go to Homepage
                </Link>
            </div>
        </main>
    );
}

// ============================================================================
// Utilities
// ============================================================================

function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
}
