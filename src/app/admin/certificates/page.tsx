"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Award, Plus, Eye, XCircle, Download, QrCode, CheckCircle,
    AlertTriangle, Search, Filter, X, ExternalLink, FileText,
    ShieldCheck, AlertOctagon, Sparkles, ChevronRight, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

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

        const verifyUrl = `${window.location.origin}/verify/${cert.id}`;

        try {
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
            window.open(qrApiUrl, '_blank');
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
            <div className="flex items-center justify-center h-screen">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    <Award className="absolute inset-0 m-auto w-6 h-6 text-amber-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans p-6 pb-20">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-amber-500 to-transparent rounded-full opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-yellow-200 mb-2"
                        >
                            CERTIFICATES
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-amber-400" />
                            Manage Digital Credentials
                        </motion.p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search certificates..."
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="all" className="bg-[#0a0a0a]">All Status</option>
                                <option value="valid" className="bg-[#0a0a0a]">Valid Only</option>
                                <option value="revoked" className="bg-[#0a0a0a]">Revoked</option>
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowIssueModal(true)}
                            className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl font-bold text-black shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                        >
                            <Plus size={20} />
                            Issue New
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Issued', value: certificates.length, color: 'blue', icon: Award },
                        { label: 'Valid', value: certificates.filter(c => c.status === 'valid').length, color: 'emerald', icon: ShieldCheck },
                        { label: 'Revoked', value: certificates.filter(c => c.status === 'revoked').length, color: 'red', icon: AlertOctagon },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <TiltCard className="h-full">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                                    <div className={`absolute -right-6 -top-6 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-xl`} />
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                            <stat.icon size={16} className={`text-${stat.color}-400`} />
                                        </div>
                                        <p className="text-3xl font-black text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <TiltCard className="h-full">
                                <div className={`h-full p-6 rounded-3xl border backdrop-blur-xl relative overflow-hidden group transition-all ${cert.status === 'revoked'
                                        ? 'bg-red-950/20 border-red-500/20'
                                        : 'bg-white/5 border-white/10 hover:border-amber-500/30'
                                    }`}>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {cert.status === 'valid' ? (
                                            <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full ring-1 ring-emerald-500/50">
                                                <CheckCircle size={14} />
                                            </div>
                                        ) : (
                                            <div className="bg-red-500/20 text-red-400 p-1.5 rounded-full ring-1 ring-red-500/50">
                                                <XCircle size={14} />
                                            </div>
                                        )}
                                    </div>

                                    {/* ID */}
                                    <div className="font-mono text-[10px] text-gray-600 mb-4 tracking-widest uppercase">
                                        ID: {cert.id.substring(0, 8)}...
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                                            {cert.studentName}
                                        </h3>
                                        <p className="text-sm text-amber-500 font-medium mb-4">{cert.bootcampName}</p>

                                        <div className="space-y-2 text-xs text-gray-400">
                                            <div className="flex justify-between">
                                                <span>Issued:</span>
                                                <span className="text-gray-300">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Category:</span>
                                                <span className="capitalize text-gray-300">{cert.bootcampCategory}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <a
                                            href={verificationUrl(cert.id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            Verify <ExternalLink size={10} />
                                        </a>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/certificate/${cert.id}`}
                                                target="_blank"
                                                className="p-1.5 text-gray-400 hover:text-amber-400 transition-colors"
                                                title="View PDF"
                                            >
                                                <FileText size={16} />
                                            </Link>
                                            <button
                                                onClick={() => openQRModal(cert)}
                                                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                                title="QR Code"
                                            >
                                                <QrCode size={16} />
                                            </button>
                                            {cert.status === 'valid' && (
                                                <button
                                                    onClick={() => openRevokeModal(cert)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                                    title="Revoke"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}

                    {filteredCertificates.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                            <Award size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No certificates found matching your criteria.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Issue Modal */}
            <AnimatePresence>
                {showIssueModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowIssueModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-600" />

                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white">Issue Certificate</h2>
                                <button onClick={() => setShowIssueModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleIssueCertificate} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Student</label>
                                    <select
                                        value={issueForm.studentId}
                                        onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 appearance-none"
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bootcamp</label>
                                    <select
                                        value={issueForm.bootcampId}
                                        onChange={(e) => setIssueForm({ ...issueForm, bootcampId: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 appearance-none"
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Completion Date</label>
                                    <input
                                        type="date"
                                        value={issueForm.completionDate}
                                        onChange={(e) => setIssueForm({ ...issueForm, completionDate: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowIssueModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
                                    >
                                        {submitting ? 'Issuing...' : 'Issue Certificate'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Revoke Modal */}
            <AnimatePresence>
                {showRevokeModal && selectedCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRevokeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Revoke Certificate</h2>
                                    <p className="text-sm text-red-400">This action is irreversible.</p>
                                </div>
                            </div>

                            <form onSubmit={handleRevokeCertificate} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason</label>
                                    <textarea
                                        value={revokeReason}
                                        onChange={(e) => setRevokeReason(e.target.value)}
                                        required
                                        minLength={10}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 resize-none"
                                        placeholder="Please explain why this certificate is being revoked..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRevokeModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || revokeReason.length < 10}
                                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Revoking...' : 'Confirm Revocation'}
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowQRModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                                <X size={24} />
                            </button>

                            <h2 className="text-xl font-bold text-black mb-6">Scan to Verify</h2>

                            {qrLoading ? (
                                <div className="w-56 h-56 mx-auto flex items-center justify-center">
                                    <Loader2 size={32} className="text-black animate-spin" />
                                </div>
                            ) : generatedQR && (
                                <div className="mb-6">
                                    <img
                                        src={generatedQR}
                                        alt="QR Code"
                                        className="w-64 h-64 mx-auto"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mb-6">
                                This QR code directs to the secure verification page for <strong>{selectedCertificate.studentName}</strong>.
                            </p>

                            <button
                                onClick={() => downloadQR(selectedCertificate)}
                                className="w-full px-4 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Download QR Code
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
