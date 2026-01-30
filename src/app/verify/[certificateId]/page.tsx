/**
 * Public Certificate Verification Page
 * 
 * This page displays the verification result for a certificate.
 * It follows a government-style authoritative design with:
 * - Clear verification status (VERIFIED / INVALID / REVOKED)
 * - Certificate details
 * - Trust indicators
 * - Mobile-first responsive design
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Shield, CheckCircle, XCircle, AlertTriangle, Award, Calendar, Building2, User } from 'lucide-react';
import { VerificationResult, CertificateStatus } from '@/lib/certificate-types';

interface PageProps {
    params: Promise<{ certificateId: string }>;
}

// Dynamic metadata based on certificate
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { certificateId } = await params;

    return {
        title: `Certificate Verification - ${certificateId} | Shivkara Digital`,
        description: 'Verify the authenticity of this certificate issued by Shivkara Digital.',
        openGraph: {
            title: 'Certificate Verification | Shivkara Digital',
            description: 'Verify the authenticity of certificates issued by Shivkara Digital.',
            type: 'website',
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
        <main className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Certificate Verification</h1>
                    <p className="text-slate-500 text-sm">Shivkara Digital</p>
                </header>

                {/* Verification Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Status Banner */}
                    <StatusBanner status={result.status} valid={result.valid} />

                    {/* Certificate Details */}
                    {result.certificate && (
                        <div className="p-6 space-y-6">
                            <CertificateDetails certificate={result.certificate} />
                        </div>
                    )}

                    {/* Message */}
                    <div className="px-6 pb-6">
                        <div className={`p-4 rounded-xl ${result.valid
                            ? 'bg-emerald-50 border border-emerald-100'
                            : (result.status === CertificateStatus.REVOKED || result.status as string === 'REVOKED' || result.status as string === 'revoked')
                                ? 'bg-amber-50 border border-amber-100'
                                : 'bg-red-50 border border-red-100'
                            }`}>
                            <p className={`text-sm ${result.valid
                                ? 'text-emerald-700'
                                : (result.status === CertificateStatus.REVOKED || result.status as string === 'REVOKED' || result.status as string === 'revoked')
                                    ? 'text-amber-700'
                                    : 'text-red-700'
                                }`}>
                                {result.message}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
                            <span>Certificate ID: {certificateId}</span>
                            <span>Verified: {new Date(result.verifiedAt).toLocaleString()}</span>
                        </div>
                    </footer>
                </div>

                {/* Trust Footer */}
                <div className="mt-8 text-center space-y-3">
                    <a
                        href="https://www.shivkaradigital.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Visit Our Website
                    </a>
                    <p className="text-xs text-slate-400">
                        This verification system is operated by Shivkara Digital.
                        <br />
                        For inquiries, contact{' '}
                        <a href="mailto:info@shivkaradigital.com" className="text-slate-600 hover:underline">
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
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">VERIFIED</h2>
                <p className="text-emerald-100 text-sm">This certificate is authentic and valid</p>
            </div>
        );
    }

    if (status === CertificateStatus.REVOKED || status === 'REVOKED') {
        return (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                    <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">REVOKED</h2>
                <p className="text-amber-100 text-sm">This certificate has been revoked by the issuer</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                <XCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">NOT VERIFIED</h2>
            <p className="text-red-100 text-sm">This certificate could not be verified</p>
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
        <div className="space-y-4">
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
                <div className="pt-4 border-t border-slate-200">
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
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    {label}
                </p>
                <p className={`${highlight ? 'text-lg font-semibold text-slate-900' : 'text-slate-800'}`}>
                    {value}
                </p>
                {sublabel && (
                    <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
                )}
            </div>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <main className="min-h-screen flex items-center justify-center py-8 px-4">
            <div className="max-w-md mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Verification Error</h1>
                <p className="text-slate-500">{message}</p>
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
