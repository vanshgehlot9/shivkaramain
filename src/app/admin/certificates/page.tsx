"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Award,
    Plus,
    Eye,
    XCircle,
    Download,
    QrCode,
    CheckCircle,
    AlertTriangle,
    Search,
    Filter,
    X,
    ExternalLink,
    BarChart3,
    Loader2,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Certificate {
    id: string;
    studentId: string;
    bootcampId: string;
    studentName: string;
    studentEmail: string;
    bootcampName: string;
    bootcampCategory: string;
    completionDate: string;
    issuedAt: string;
    issuingAuthority: string;
    status: 'valid' | 'revoked' | 'expired';
    qrCodeDataUrl?: string;
    revokedAt?: string;
    revocationReason?: string;
}

interface Bootcamp {
    id: string;
    name: string;
}

interface Student {
    id: string;
    fullName: string;
    email: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [generatedQR, setGeneratedQR] = useState<string | null>(null);
    const [qrLoading, setQrLoading] = useState(false);

    const [issueForm, setIssueForm] = useState({
        studentId: '',
        bootcampId: '',
        completionDate: '',
    });
    const [revokeReason, setRevokeReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certsRes, bootcampsRes, studentsRes] = await Promise.all([
                fetch('/api/admin/certificates'),
                fetch('/api/admin/bootcamps'),
                fetch('/api/admin/students'),
            ]);

            const [certsData, bootcampsData, studentsData] = await Promise.all([
                certsRes.json(),
                bootcampsRes.json(),
                studentsRes.json(),
            ]);

            if (certsData.success) setCertificates(certsData.data);
            if (bootcampsData.success) setBootcamps(bootcampsData.data);
            if (studentsData.success) setStudents(studentsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/admin/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issueForm),
            });

            const data = await response.json();
            if (data.success) {
                fetchData();
                setShowIssueModal(false);
                setIssueForm({ studentId: '', bootcampId: '', completionDate: '' });
                alert('Certificate issued successfully!');
            } else {
                alert(data.error || 'Failed to issue certificate');
            }
        } catch (error) {
            console.error('Error issuing certificate:', error);
            alert('Failed to issue certificate');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevokeCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCertificate) return;
        setSubmitting(true);

        try {
            const response = await fetch(`/api/admin/certificates/${selectedCertificate.id}/revoke`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: revokeReason }),
            });

            const data = await response.json();
            if (data.success) {
                fetchData();
                setShowRevokeModal(false);
                setSelectedCertificate(null);
                setRevokeReason('');
                alert('Certificate revoked successfully');
            } else {
                alert(data.error || 'Failed to revoke certificate');
            }
        } catch (error) {
            console.error('Error revoking certificate:', error);
            alert('Failed to revoke certificate');
        } finally {
            setSubmitting(false);
        }
    };

    const openRevokeModal = (cert: Certificate) => {
        setSelectedCertificate(cert);
        setRevokeReason('');
        setShowRevokeModal(true);
    };

    const openQRModal = async (cert: Certificate) => {
        setSelectedCertificate(cert);
        setGeneratedQR(null);
        setQrLoading(true);
        setShowQRModal(true);

        // Generate QR code dynamically
        const verifyUrl = `${window.location.origin}/verify/${cert.id}`;

        try {
            // Use a simple QR code API for reliable generation
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}&ecc=H`;
            setGeneratedQR(qrApiUrl);
        } catch (error) {
            console.error('Error generating QR:', error);
        } finally {
            setQrLoading(false);
        }
    };

    const downloadQR = async (cert: Certificate) => {
        const verifyUrl = `${window.location.origin}/verify/${cert.id}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}&ecc=H&format=png`;

        try {
            // Fetch the QR image and download it
            const response = await fetch(qrApiUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${cert.id}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading QR:', error);
            // Fallback: open in new tab
            window.open(qrApiUrl, '_blank');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'revoked': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'expired': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'valid': return <CheckCircle size={14} />;
            case 'revoked': return <XCircle size={14} />;
            case 'expired': return <AlertTriangle size={14} />;
            default: return null;
        }
    };

    const filteredCertificates = certificates.filter((cert) => {
        const matchesSearch =
            cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.bootcampName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const verificationUrl = (certId: string) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/verify/${certId}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-shivkara-orange/30 border-t-shivkara-orange rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Certificates</h1>
                    <p className="text-gray-400 mt-1">Issue and manage verification certificates</p>
                </div>
                <button
                    onClick={() => setShowIssueModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors"
                >
                    <Plus size={18} />
                    Issue Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{certificates.filter(c => c.status === 'valid').length}</div>
                            <div className="text-sm text-gray-400">Valid Certificates</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                            <XCircle className="text-red-400" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{certificates.filter(c => c.status === 'revoked').length}</div>
                            <div className="text-sm text-gray-400">Revoked</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Award className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{certificates.length}</div>
                            <div className="text-sm text-gray-400">Total Issued</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, bootcamp, or certificate ID..."
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-shivkara-orange"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                    >
                        <option value="all" className="bg-[#0a0a0a]">All Status</option>
                        <option value="valid" className="bg-[#0a0a0a]">Valid</option>
                        <option value="revoked" className="bg-[#0a0a0a]">Revoked</option>
                    </select>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Certificate</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Program</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Issued</th>
                                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCertificates.map((cert) => (
                                <motion.tr
                                    key={cert.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-shivkara-orange/10 rounded-xl flex items-center justify-center">
                                                <Award className="text-shivkara-orange" size={18} />
                                            </div>
                                            <div>
                                                <div className="font-mono text-sm">{cert.id.substring(0, 12)}...</div>
                                                <a
                                                    href={verificationUrl(cert.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-shivkara-orange hover:underline flex items-center gap-1"
                                                >
                                                    View <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{cert.studentName}</div>
                                        <div className="text-xs text-gray-500">{cert.studentEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>{cert.bootcampName}</div>
                                        <div className="text-xs text-gray-500 capitalize">{cert.bootcampCategory}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border ${getStatusColor(cert.status)}`}>
                                            {getStatusIcon(cert.status)}
                                            {cert.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(cert.issuedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/certificate/${cert.id}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-shivkara-orange rounded-lg hover:bg-shivkara-orange/10 transition-colors"
                                                title="Print Certificate"
                                            >
                                                <FileText size={16} />
                                            </Link>
                                            <button
                                                onClick={() => openQRModal(cert)}
                                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                                title="View QR Code"
                                            >
                                                <QrCode size={16} />
                                            </button>
                                            <button
                                                onClick={() => downloadQR(cert)}
                                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                                title="Download QR"
                                            >
                                                <Download size={16} />
                                            </button>
                                            {cert.status === 'valid' && (
                                                <button
                                                    onClick={() => openRevokeModal(cert)}
                                                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    title="Revoke"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {filteredCertificates.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        <Award size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>
                                            {searchTerm || statusFilter !== 'all'
                                                ? 'No certificates match your filters.'
                                                : 'No certificates issued yet.'}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Certificate Modal */}
            <AnimatePresence>
                {showIssueModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowIssueModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Issue Certificate</h2>
                                <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleIssueCertificate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
                                    <select
                                        value={issueForm.studentId}
                                        onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Select a student...</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id} className="bg-[#0a0a0a]">
                                                {s.fullName} ({s.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Bootcamp</label>
                                    <select
                                        value={issueForm.bootcampId}
                                        onChange={(e) => setIssueForm({ ...issueForm, bootcampId: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Select a bootcamp...</option>
                                        {bootcamps.map((b) => (
                                            <option key={b.id} value={b.id} className="bg-[#0a0a0a]">
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Completion Date</label>
                                    <input
                                        type="date"
                                        value={issueForm.completionDate}
                                        onChange={(e) => setIssueForm({ ...issueForm, completionDate: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowIssueModal(false)}
                                        className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Issuing...' : 'Issue Certificate'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Revoke Certificate Modal */}
            <AnimatePresence>
                {showRevokeModal && selectedCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRevokeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="text-red-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-red-400">Revoke Certificate</h2>
                                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-4">
                                <div className="text-sm text-gray-400">Certificate for</div>
                                <div className="font-medium">{selectedCertificate.studentName}</div>
                                <div className="text-sm text-gray-500">{selectedCertificate.bootcampName}</div>
                            </div>

                            <form onSubmit={handleRevokeCertificate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Revocation</label>
                                    <textarea
                                        value={revokeReason}
                                        onChange={(e) => setRevokeReason(e.target.value)}
                                        required
                                        minLength={10}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 resize-none"
                                        placeholder="Provide a detailed reason (min. 10 characters)..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowRevokeModal(false)}
                                        className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || revokeReason.length < 10}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Revoking...' : 'Revoke Certificate'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQRModal && selectedCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowQRModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center"
                        >
                            <h2 className="text-xl font-bold mb-4">Certificate QR Code</h2>

                            {qrLoading ? (
                                <div className="w-48 h-48 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4">
                                    <Loader2 size={48} className="text-gray-400 animate-spin" />
                                </div>
                            ) : generatedQR ? (
                                <div className="bg-white rounded-2xl p-4 inline-block mb-4">
                                    <img
                                        src={generatedQR}
                                        alt="Certificate QR Code"
                                        className="w-48 h-48"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            ) : (
                                <div className="w-48 h-48 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                    <QrCode size={64} className="text-gray-500" />
                                </div>
                            )}

                            <p className="text-sm text-gray-400 mb-2">
                                Scan to verify certificate for<br />
                                <span className="text-white font-medium">{selectedCertificate.studentName}</span>
                            </p>

                            <p className="text-xs text-gray-500 mb-4 font-mono break-all">
                                {window.location.origin}/verify/{selectedCertificate.id.substring(0, 16)}...
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => downloadQR(selectedCertificate)}
                                    className="flex-1 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
