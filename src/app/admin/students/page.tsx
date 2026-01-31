"use client";

import { useState, useEffect } from "react";
import {
    Plus, Mail, Phone, User, Edit2, Trash2, X, Award,
    Search, Hash, Calendar, GraduationCap, ChevronRight, Sparkles, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

interface Student {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    externalId?: string;
    enrolledAt: string;
    createdAt: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        externalId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/admin/students');
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingStudent
                ? `/api/admin/students/${editingStudent.id}`
                : '/api/admin/students';
            const method = editingStudent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchStudents();
                closeModal();
            } else {
                alert(data.error || 'Failed to save student');
            }
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const response = await fetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchStudents();
            } else {
                alert(data.error || 'Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const openCreateModal = () => {
        setEditingStudent(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            externalId: '',
        });
        setShowModal(true);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            phone: student.phone || '',
            externalId: student.externalId || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStudent(null);
    };

    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <User className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans p-6 pb-20">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-transparent rounded-full opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 mb-2"
                        >
                            STUDENTS
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-cyan-400" />
                            Manage Student Directory
                        </motion.p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openCreateModal}
                            className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                        >
                            <Plus size={20} />
                            Register
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Students', value: students.length, color: 'cyan', icon: User },
                        { label: 'New This Month', value: students.filter(s => new Date(s.enrolledAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, color: 'emerald', icon: Calendar },
                        { label: 'Verified', value: students.filter(s => s.externalId).length, color: 'blue', icon: Award },
                        { label: 'Pending', value: students.length - students.filter(s => s.externalId).length, color: 'amber', icon: Clock },
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

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map((student, i) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <TiltCard className="h-full">
                                <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors">

                                    {/* Avatar Glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] transition-all group-hover:bg-cyan-500/10" />

                                    <div className="relative z-10 flex flex-col h-full gap-4">

                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-300 text-xl font-bold border border-white/5 shadow-inner">
                                                {student.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{student.fullName}</h3>
                                            {student.externalId && (
                                                <div className="flex items-center gap-1.5 text-xs text-cyan-400 mb-3">
                                                    <Hash size={12} />
                                                    <span>ID: {student.externalId}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-3 mt-auto pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                <Mail size={14} className="text-cyan-500/70" />
                                                <span className="truncate">{student.email}</span>
                                            </div>
                                            {student.phone && (
                                                <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    <Phone size={14} className="text-blue-500/70" />
                                                    <span>{student.phone}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
                                                <Calendar size={12} />
                                                Joined {new Date(student.enrolledAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className="col-span-full py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Search size={24} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No students found</h3>
                            <p className="text-gray-500 max-w-sm">
                                {searchTerm ? `We couldn't find any students matching "${searchTerm}"` : "Get started by registering your first student."}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={openCreateModal}
                                    className="mt-6 px-6 py-2 bg-cyan-600 rounded-xl text-sm font-bold hover:bg-cyan-500 transition-colors"
                                >
                                    Register Student
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Modern Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-900/20"
                        >
                            {/* Modal Decor */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-600/20 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">
                                            {editingStudent ? 'Edit Profile' : 'New Registration'}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Enter student details below</p>
                                    </div>
                                    <button onClick={closeModal} className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/10 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all focus:bg-white/10"
                                                    placeholder="Ex: Alex Carter"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all focus:bg-white/10"
                                                    placeholder="alex@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Phone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all focus:bg-white/10"
                                                        placeholder="+1 234..."
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">External ID</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.externalId}
                                                        onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all focus:bg-white/10"
                                                        placeholder="ID-123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-colors font-bold text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm shadow-lg shadow-cyan-900/20"
                                        >
                                            {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Complete Registration'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
