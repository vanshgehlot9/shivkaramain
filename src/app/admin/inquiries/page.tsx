"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare, Search, Filter, Mail, Phone, Calendar,
    CheckCircle, Clock, Archive, Trash2, X, ChevronRight,
    User, Sparkles, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'archived';
    createdAt: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            // Mock data for now as specific API might not exist yet or follows standard pattern
            // In a real scenario, this would be: const res = await fetch('/api/admin/inquiries');
            const mockInquiries: Inquiry[] = [
                {
                    id: '1',
                    name: 'Sarah Connor',
                    email: 'sarah@skynet.com',
                    phone: '+1 555 123 4567',
                    subject: 'Project Collaboration',
                    message: 'I would like to discuss a potential project regarding AI safety systems.',
                    status: 'new',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    name: 'John Wick',
                    email: 'john@continental.com',
                    phone: '+1 555 987 6543',
                    subject: 'Security Consultation',
                    message: 'Need a quote for a comprehensive security audit of my home layout.',
                    status: 'read',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                },
                {
                    id: '3',
                    name: 'Tony Stark',
                    email: 'tony@starkindustries.com',
                    phone: '+1 555 000 0000',
                    subject: 'Internship Program',
                    message: 'Interested in your bootcamp graduates for the new arc reactor initiative.',
                    status: 'new',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                }
            ];
            setInquiries(mockInquiries);

            // Attempt real fetch if API exists
            const response = await fetch('/api/admin/contacts'); // Trying common endpoint name
            if (response.ok) {
                const data = await response.json();
                if (data.success) setInquiries(data.data);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: Inquiry['status']) => {
        // Optimistic update
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
        if (selectedInquiry?.id === id) {
            setSelectedInquiry({ ...selectedInquiry, status });
        }

        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        setInquiries(inquiries.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);

        try {
            await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'read': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'archived': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    <MessageSquare className="absolute inset-0 m-auto w-6 h-6 text-violet-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans p-6 pb-20">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-500 to-transparent rounded-full opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-indigo-200 mb-2"
                        >
                            INQUIRIES
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-violet-400" />
                            Manage Incoming Messages
                        </motion.p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search messages..."
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-violet-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="all" className="bg-[#0a0a0a]">All Messages</option>
                                <option value="new" className="bg-[#0a0a0a]">New</option>
                                <option value="read" className="bg-[#0a0a0a]">Read</option>
                                <option value="archived" className="bg-[#0a0a0a]">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">

                    {/* List View */}
                    <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
                        {filteredInquiries.map((inq, i) => (
                            <motion.div
                                key={inq.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div
                                    onClick={() => {
                                        setSelectedInquiry(inq);
                                        if (inq.status === 'new') updateStatus(inq.id, 'read');
                                    }}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedInquiry?.id === inq.id
                                            ? 'bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-900/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {inq.status === 'new' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                            <h3 className={`font-bold text-sm ${selectedInquiry?.id === inq.id ? 'text-white' : 'text-gray-200'}`}>
                                                {inq.name}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] text-gray-500">
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-medium mb-1 truncate ${selectedInquiry?.id === inq.id ? 'text-violet-200' : 'text-gray-400'}`}>
                                        {inq.subject}
                                    </p>
                                    <p className="text-[10px] text-gray-500 line-clamp-2">
                                        {inq.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {filteredInquiries.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <Inbox size={48} className="mb-4 opacity-30" />
                                <p>No messages found</p>
                            </div>
                        )}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-2">
                        <TiltCard className="h-full">
                            <div className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden flex flex-col">

                                {selectedInquiry ? (
                                    <>
                                        {/* Detail Header */}
                                        <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
                                            <div>
                                                <h2 className="text-2xl font-black text-white mb-2">{selectedInquiry.subject}</h2>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-violet-400" />
                                                        <span className="text-white">{selectedInquiry.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-violet-400" />
                                                        <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedInquiry.status)}`}>
                                                        {selectedInquiry.status}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {selectedInquiry.status !== 'archived' && (
                                                    <button
                                                        onClick={() => updateStatus(selectedInquiry.id, 'archived')}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-400 transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Archive size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(selectedInquiry.id)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</span>
                                                <a href={`mailto:${selectedInquiry.email}`} className="flex items-center gap-2 text-violet-300 hover:text-violet-200 transition-colors">
                                                    <Mail size={14} />
                                                    {selectedInquiry.email}
                                                </a>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Phone</span>
                                                <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-2 text-violet-300 hover:text-violet-200 transition-colors">
                                                    <Phone size={14} />
                                                    {selectedInquiry.phone}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Message Body */}
                                        <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5 overflow-y-auto">
                                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {selectedInquiry.message}
                                            </p>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="mt-8 flex justify-end gap-3">
                                            <a
                                                href={`mailto:${selectedInquiry.email}`}
                                                className="px-6 py-3 bg-violet-600 rounded-xl text-white font-bold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/20 flex items-center gap-2"
                                            >
                                                <ChevronRight size={18} />
                                                Reply via Email
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                        <MessageSquare size={64} className="mb-4" />
                                        <p className="text-lg">Select a message to view details</p>
                                    </div>
                                )}

                            </div>
                        </TiltCard>
                    </div>

                </div>

            </div>
        </div>
    );
}
