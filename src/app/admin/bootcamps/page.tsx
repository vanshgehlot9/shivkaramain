"use client";

import { useState, useEffect } from "react";
import {
    Plus, Calendar, Users, Edit2, Trash2, X, BookOpen,
    Sparkles, Clock, ChevronRight, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

interface Bootcamp {
    id: string;
    name: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

const CATEGORIES = [
    { value: 'design', label: 'Design', color: 'pink' },
    { value: 'development', label: 'Development', color: 'blue' },
    { value: 'data', label: 'Data Science', color: 'purple' },
    { value: 'marketing', label: 'Marketing', color: 'amber' },
    { value: 'business', label: 'Business', color: 'emerald' },
    { value: 'other', label: 'Other', color: 'gray' },
];

export default function BootcampsPage() {
    const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'design',
        startDate: '',
        endDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBootcamps();
    }, []);

    const fetchBootcamps = async () => {
        try {
            const response = await fetch('/api/admin/bootcamps');
            const data = await response.json();
            if (data.success) {
                setBootcamps(data.data);
            }
        } catch (error) {
            console.error('Error fetching bootcamps:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingBootcamp
                ? `/api/admin/bootcamps/${editingBootcamp.id}`
                : '/api/admin/bootcamps';
            const method = editingBootcamp ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchBootcamps();
                closeModal();
            } else {
                alert(data.error || 'Failed to save bootcamp');
            }
        } catch (error) {
            console.error('Error saving bootcamp:', error);
            alert('Failed to save bootcamp');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bootcamp?')) return;

        try {
            const response = await fetch(`/api/admin/bootcamps/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchBootcamps();
            } else {
                alert(data.error || 'Failed to delete bootcamp');
            }
        } catch (error) {
            console.error('Error deleting bootcamp:', error);
        }
    };

    const openCreateModal = () => {
        setEditingBootcamp(null);
        setFormData({
            name: '',
            description: '',
            category: 'design',
            startDate: '',
            endDate: '',
        });
        setShowModal(true);
    };

    const openEditModal = (bootcamp: Bootcamp) => {
        setEditingBootcamp(bootcamp);
        setFormData({
            name: bootcamp.name,
            description: bootcamp.description,
            category: bootcamp.category,
            startDate: new Date(bootcamp.startDate).toISOString().split('T')[0],
            endDate: new Date(bootcamp.endDate).toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBootcamp(null);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getCategoryColor = (cat: string) =>
        CATEGORIES.find(c => c.value === cat)?.color || 'gray';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                    <GraduationCap className="absolute inset-0 m-auto w-6 h-6 text-pink-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans p-6 pb-20">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">

                {/* Ultra-Modern Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-pink-500 to-transparent rounded-full opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 mb-2"
                        >
                            BOOTCAMPS
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-pink-400" />
                            Manage Training Programs
                        </motion.p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openCreateModal}
                        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-bold text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all"
                    >
                        <Plus size={20} />
                        Create Bootcamp
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total', value: bootcamps.length, color: 'pink' },
                        { label: 'Active', value: bootcamps.filter(b => b.status === 'active').length, color: 'emerald' },
                        { label: 'Completed', value: bootcamps.filter(b => b.status === 'completed').length, color: 'blue' },
                        { label: 'Cancelled', value: bootcamps.filter(b => b.status === 'cancelled').length, color: 'red' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm`}
                        >
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-3xl font-black text-${stat.color}-400 mt-1`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Bootcamps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bootcamps.map((bootcamp, i) => {
                        const catColor = getCategoryColor(bootcamp.category);
                        return (
                            <motion.div
                                key={bootcamp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <TiltCard className="h-full">
                                    <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">

                                        {/* Glow */}
                                        <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${catColor}-500/10 rounded-full blur-3xl group-hover:bg-${catColor}-500/20 transition-all`} />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-white group-hover:text-pink-200 transition-colors line-clamp-1">
                                                        {bootcamp.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border ${getStatusStyle(bootcamp.status)}`}>
                                                        {bootcamp.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => openEditModal(bootcamp)}
                                                        className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(bootcamp.id)}
                                                        className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{bootcamp.description}</p>

                                            {/* Meta */}
                                            <div className="space-y-2 text-xs border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <BookOpen size={12} className={`text-${catColor}-400`} />
                                                    <span className="capitalize">{bootcamp.category}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Clock size={12} />
                                                    <span>
                                                        {new Date(bootcamp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(bootcamp.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}

                    {bootcamps.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                            <GraduationCap size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-500">No bootcamps yet.</p>
                            <button
                                onClick={openCreateModal}
                                className="mt-4 px-6 py-2 bg-pink-600 rounded-xl text-sm font-bold hover:bg-pink-500 transition-colors"
                            >
                                Create First Bootcamp
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-lg overflow-hidden"
                        >
                            {/* Modal Glow */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-white">
                                        {editingBootcamp ? 'Edit Bootcamp' : 'Create Bootcamp'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/10 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-colors"
                                            placeholder="e.g., Spunk 2025 - Product Design"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                            placeholder="Describe the bootcamp..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-colors appearance-none"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.value} value={cat.value} className="bg-[#0a0a0a]">
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-colors font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {submitting ? 'Saving...' : editingBootcamp ? 'Update' : 'Create'}
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
