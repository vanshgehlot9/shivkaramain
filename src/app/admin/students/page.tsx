"use client";

import { useState, useEffect } from "react";
import { Plus, Mail, Phone, User, Edit2, Trash2, X, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                    <h1 className="text-3xl font-bold">Students</h1>
                    <p className="text-gray-400 mt-1">Manage registered students</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors"
                >
                    <Plus size={18} />
                    Register Student
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-shivkara-orange"
                />
            </div>

            {/* Students Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Enrolled</th>
                                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map((student) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-shivkara-orange/10 rounded-full flex items-center justify-center text-shivkara-orange font-medium">
                                                {student.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{student.fullName}</div>
                                                {student.externalId && (
                                                    <div className="text-xs text-gray-500">ID: {student.externalId}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Mail size={14} className="text-gray-500" />
                                                {student.email}
                                            </div>
                                            {student.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Phone size={14} className="text-gray-500" />
                                                    {student.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(student.enrolledAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(student)}
                                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                        <User size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>
                                            {searchTerm
                                                ? 'No students match your search.'
                                                : 'No students registered yet.'}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    {editingStudent ? 'Edit Student' : 'Register Student'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">External ID (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.externalId}
                                        onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        placeholder="For integration with other systems"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : editingStudent ? 'Update' : 'Register'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
